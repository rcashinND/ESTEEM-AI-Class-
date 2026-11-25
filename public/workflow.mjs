import {analyse} from './analysis.mjs';

export const BUILD = 'two-stage-enquiry';
export const WORK_TYPES = {
  '': null,
  tap: {job:'Tap / faucet replacement', trade:'Plumber'},
  plumbing: {job:'Plumbing assessment / repair', trade:'Plumber'},
  electrical: {job:'Electrical work / assessment', trade:'Electrician'},
  maintenance: {job:'Door, fence or fitting repair', trade:'Carpenter or general maintenance'},
  other: {job:'Other requested work', trade:''}
};
export const TIMINGS = {'':'', flexible:'Flexible', soon:'Within a few days', week:'This week', custom:''};
export const URGENCIES = {'':'', routine:'Routine / not urgent', soon:'Needs attention soon', urgent:'Urgent — customer requests prompt contact'};
export const SAFETY = {'':'', none:'No concerns noticed by customer (not a safety assessment)', electrical:'Electrical concern reported by customer', water:'Water leak / damp concern reported by customer', other:'Other safety concern reported by customer'};
const text = (value, max=180) => typeof value === 'string' ? value.trim().replace(/\s+/g,' ').slice(0,max) : '';
const known = value => value && !/^Not provided/i.test(value);
const uncertain = value => !known(value) || /Unclear|not confirmed/i.test(value);
const ELECTRICAL_CAUTION = 'Possible electrical concern: do not touch or use affected fittings, or approach them to take a photo. Seek qualified assessment; this prototype cannot assess safety or urgency.';

export function inspectEnquiry(description='', {visitTimingConfirmed=false}={}) {
  const raw = typeof description === 'string' ? description : '';
  let analysis;
  try { analysis = analyse(raw); }
  catch {
    analysis = {fixture:false, mode:'manual', job:'Not provided', trade:'Not provided', location:'Not provided', timing:'Not provided', urgency:'Not provided', scope:'Not provided', materials:'Not provided', details:[], safety:''};
  }
  const lowDetail = raw.trim().length < 35 || !known(analysis.job) || analysis.mode === 'manual';
  return {
    analysis, lowDetail,
    questions: {
      work:lowDetail, area:uncertain(analysis.location), timing:visitTimingConfirmed || uncertain(analysis.timing),
      urgency:uncertain(analysis.urgency), safety:!analysis.safety
    }
  };
}

export function normaliseAnswers(answers={}) {
  return {
    work:Object.hasOwn(WORK_TYPES, answers.work) ? answers.work : '',
    detail:text(answers.detail,180),
    area:text(answers.area,80),
    timing:Object.hasOwn(TIMINGS,answers.timing) ? answers.timing : '',
    timeDetail:text(answers.timeDetail,80),
    urgency:Object.hasOwn(URGENCIES,answers.urgency) ? answers.urgency : '',
    safety:Object.hasOwn(SAFETY,answers.safety) ? answers.safety : '',
    safetyDetail:text(answers.safetyDetail,140)
  };
}

// Explicit questionnaire facts improve the brief without treating a room as a trade.
// Only allowlisted, concise fields leave the customer page. Never return raw input.
export function buildBrief(description, suppliedAnswers={}, {visitTimingConfirmed=false}={}) {
  if (typeof description !== 'string' || !description.trim()) throw new Error('Please describe the problem, even in a few words.');
  if (description.length > 4000) throw new Error('Please keep the description under 4,000 characters.');
  // Only the active customer form confirms provenance. Arbitrary/stale hidden
  // answers remain ignored by default, as in the existing handoff safeguards.
  const {analysis, questions} = inspectEnquiry(description,{visitTimingConfirmed});
  const answers = normaliseAnswers(suppliedAnswers);
  // Ignore answers to hidden questions, so old selections cannot silently override new facts.
  if (!questions.work) { answers.work=''; answers.detail=''; }
  if (!questions.area) answers.area='';
  if (!questions.timing) { answers.timing=''; answers.timeDetail=''; }
  if (!questions.urgency) answers.urgency='';
  if (!questions.safety) { answers.safety=''; answers.safetyDetail=''; }
  if (answers.timing !== 'custom') answers.timeDetail='';
  if (!['electrical','water','other'].includes(answers.safety)) answers.safetyDetail='';
  const selection = WORK_TYPES[answers.work];
  const conflict = /\b(?:do not|don't|don’t|never|not to|cancel)\s+(?:\w+\s+){0,2}(?:replace|repair|fix|install|assess)\b/i.test(description+' '+answers.detail);
  let answerAnalysis;
  if (answers.detail.length >= 10) answerAnalysis = inspectEnquiry(answers.detail).analysis;
  const safetyAnalysis = answers.safetyDetail.length >= 10 ? inspectEnquiry(answers.safetyDetail).analysis : null;
  const supported = [analysis, answerAnalysis, safetyAnalysis].filter(Boolean);
  const trades = new Set();
  const addTrades = suggestion => {
    if (/electrician/i.test(suggestion)) trades.add('Electrician');
    if (/plumber/i.test(suggestion)) trades.add('Plumber');
    if (/roofer/i.test(suggestion)) trades.add('Roofer');
    if (/carpenter|maintenance/i.test(suggestion)) trades.add('Carpenter or general maintenance');
  };
  for (const result of supported) if (known(result.trade)) addTrades(result.trade);
  if (selection?.trade && !conflict) addTrades(selection.trade);
  if (answers.safety === 'electrical') trades.add('Electrician');
  const job = conflict && selection ? 'Work request needs confirmation'
    : selection?.job || (known(analysis.job) ? analysis.job : known(answerAnalysis?.job) ? answerAnalysis.job : 'Home enquiry — assessment needed');
  const details = [];
  // Short, deliberately supplied clarification; not a questionnaire transcript.
  if (answers.detail && !conflict) details.push(`Customer-stated scope: ${answers.detail}`);
  if (!answers.detail) for (const item of analysis.details || []) {
    if (/not interpreted|check the original|original wording/i.test(item)) continue;
    const concise = item
      .replace('The message requests tap / faucet replacement.','Tap / faucet replacement requested.')
      .replace('Repair wording suggests carpentry or general maintenance assessment.','Repair work needs carpentry or general maintenance assessment.');
    details.push(text(concise));
  }
  if (conflict) details.push('Conflicting work instructions: clarify the requested work before arranging it.');
  if (!details.length) details.push('The customer needs help assessing work at home; the specific task still needs clarification.');
  let safety = supported.map(result=>result.safety).find(Boolean) || '';
  if (answers.safety === 'electrical' || answers.work === 'electrical') safety = ELECTRICAL_CAUTION;
  const concern = SAFETY[answers.safety] || (safety ? 'Electrical safety needs qualified confirmation; cause unconfirmed' : 'Not confirmed');
  if (answers.safetyDetail && ['other','electrical','water'].includes(answers.safety)) details.push(`Customer-stated concern: ${answers.safetyDetail}`);
  const area = answers.area || analysis.location;
  const timing = answers.timing === 'custom' ? answers.timeDetail || 'Not provided' : TIMINGS[answers.timing] || analysis.timing;
  const urgency = URGENCIES[answers.urgency] || analysis.urgency;
  // Analyse materials against ALL relevant wording so clarification cannot reverse negation.
  const combined = answers.detail || answers.safetyDetail ? inspectEnquiry(`${description}\n${answers.detail}\n${answers.safetyDetail}`).analysis : analysis;
  const materials = /^Not confirmed/i.test(combined.materials)
    ? 'Purchase / current availability not confirmed — ask the customer.'
    : combined.materials || 'Not provided';
  const followUp = [];
  if (job === 'Home enquiry — assessment needed' || conflict) followUp.push('Confirm the exact work or item that needs attention.');
  if (!answers.detail && !known(analysis.scope)) followUp.push('Confirm the affected item, symptoms and extent of work.');
  if (uncertain(area)) followUp.push('Confirm the general town or area; arrange an exact address privately if needed.');
  if (uncertain(timing)) followUp.push('Agree a preferred visit day or time.');
  if (uncertain(urgency)) followUp.push('Confirm how soon attention is needed.');
  if (uncertain(materials) && /tap|faucet|material|bought|purchas/i.test(description+' '+answers.detail)) followUp.push('Confirm materials availability and compatibility.');
  if (/tap|faucet/i.test(job)) followUp.push('Confirm tap compatibility, access and severity of any leak.');
  if (safety) followUp.push('Arrange qualified assessment of the electrical concern; do not infer its cause.');
  if (concern === 'Not confirmed') followUp.push('Ask whether any safety concerns have been noticed.');
  return {
    job:text(job), trades:trades.size ? `Tentative — ${[...trades].join('; ')}` : 'Not established — confirm the appropriate trade',
    scope:details.filter(item=>!(/^Not confirmed/i.test(combined.materials) && /^The customer (?:has bought|states they have (?:bought|purchased))/i.test(item))).slice(0,5),
    area:area || 'Not provided', timing:timing || 'Not provided', urgency:urgency || 'Not provided',
    materials:text(materials,300), concern, safety,
    followUp:[...new Set(followUp)].slice(0,7),
    mode:analysis.fixture ? 'Prepared simulated example, with customer clarifications' : 'Limited rule-based brief, with customer clarifications',
    uncertainty:'Customer-stated details and tentative trade suggestions; no diagnosis or safety certification.',
    photoNotice:'Attached photos are for the tradesperson to inspect. No image analysis has been performed.'
  };
}
