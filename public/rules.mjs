// Deliberately bounded pattern extraction, not natural-language understanding.
export function extractFacts(message) {
  const timing = [...message.matchAll(/\b(?:(?:next|this|on)\s+)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|today|tomorrow|next week|next month)\b/gi)].map(m => m[0]);
  const locations = [...message.matchAll(/\b(?:in|at)\s+([A-Z][a-z]+(?:[ -][A-Z][a-z]+){0,3})(?=[\s,.!?;]|$)/g)].map(m => m[1]);
  const urgency = message.match(/\b(?:not urgent|no rush|urgent|asap|as soon as possible|emergency)\b/gi) || [];
  const one = values => [...new Set(values.map(v => v.toLowerCase()))].length === 1 ? values[0] : values.length ? `Unclear — multiple statements: ${values.join('; ')}` : 'Not provided';
  return {timing: one(timing), location: one(locations), urgency: one(urgency)};
}

export function analyseRules(message, base) {
  const facts = extractFacts(message);
  const negated = /\b(?:not|no|never|don't|doesn't|isn't|is not|without|already|fixed|repaired|cancel|ignore|pretend)\b/i.test(message.replace(/\bnot urgent\b/gi, '').replace(/\balready (?:bought|purchased)\b/gi, ''));
  const plumbing = /\b(?:plumber|plumbing|tap|faucet|pipe|toilet|drain)\b/i.test(message);
  const electrical = /\b(?:electrician|electrical|socket|wiring|lights?|outlet)\b/i.test(message);
  const water = /\b(?:damp|water damage|leak(?:ing)?)\b/i.test(message);
  const electricalSymptom = electrical && /\b(?:flicker\w*|cut(?:s|ting)? out|sparks?|faulty|tripp\w*|damage|not working)\b/i.test(message);
  const tapReplacement = /\b(?:replace|replacement|change|swap|install)\b/i.test(message) && /\b(?:tap|faucet)\b/i.test(message) && !electrical;
  const maintenance = /\b(?:repair|fix)\b/i.test(message) && /\b(?:door|hinge|shelf|shelves|fence)\b/i.test(message);
  const safe = 'Possible electrical concern: do not touch or use affected fittings, or approach them to take a photo. Seek qualified assessment; this prototype cannot assess safety or urgency.';
  if (negated || /<[^>]*>/.test(message) || !(tapReplacement || electricalSymptom || maintenance || (plumbing && water))) {
    return {...base, ...facts, fixture:false, mode:'manual', photo:false,
      summary:'This message is outside the supported work patterns. Review the original enquiry and clarify the job with the customer.',
      details:['Only explicitly matched location, timing or urgency phrases may be shown; job details were not interpreted.'],
      missing:['What work is required?', 'Which trade should assess it?', 'Confirm location, timing, scope and access directly with the customer.'],
      note:'Manual review needed. Rules do not understand arbitrary wording or negation. Not provided means not extracted, not necessarily absent from the message.',
      safety: electricalSymptom ? safe : ''};
  }
  const bought = /\b(?:bought|purchased)\s+(?:the\s+|a\s+)?replacement\s+(?:tap|faucet)\b/i.test(message);
  let trade = 'Uncertain — plumber may be needed', job = 'Assessment of reported plumbing symptoms';
  if (tapReplacement) {trade = 'Plumber (suggested by stated work)'; job = 'Tap / faucet replacement';}
  if (electricalSymptom) {trade = water ? 'Uncertain — electrician; plumber or roofer may also be needed' : 'Uncertain — electrician may be needed'; job = water ? 'Assessment of water-related and electrical symptoms' : 'Assessment of reported electrical symptoms';}
  if (maintenance) {trade = 'Uncertain — carpenter or general maintenance'; job = 'Assessment of stated repair work';}
  const details = tapReplacement ? ['The message requests tap / faucet replacement.', ...(bought ? ['The customer states they have bought the replacement tap.'] : [])] : ['The original message describes symptoms or repair work; cause and extent need assessment.'];
  const summary = `${job}. ${facts.location !== 'Not provided' ? `Location phrase: ${facts.location}. ` : ''}${facts.timing !== 'Not provided' ? `Timing: ${facts.timing} (customer’s wording). ` : ''}${bought ? 'Replacement tap already purchased. ' : ''}Review the original message before arranging work.`;
  return {...base, ...facts, fixture:false, mode:'rules', trade, job, details, summary,
    uncertain:true, scope: tapReplacement ? 'Tap / faucet replacement; quantity and compatibility require confirmation.' : 'Not provided — assessment required',
    photo:!tapReplacement, safety:electricalSymptom ? safe : '',
    note:'Limited rule-based interpretation, not live AI. Trade suggestions are tentative; rules cannot establish causes, safety, scope or calendar dates.',
    missing:[...(facts.location === 'Not provided' ? ['Where is the property? Confirm privately.'] : []), ...(facts.timing === 'Not provided' ? ['When would the customer like someone to attend?'] : []), 'Confirm the work, quantity, compatibility, access and severity directly with the customer.']};
}
