// Bounded rules, not natural-language understanding. Preserve original text in the UI.
const canonical = text => text.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
const sentences = text => text.split(/[.!?;\n]+/).map(s => s.trim()).filter(Boolean);
const negative = /\b(?:not|no|never|without|cannot|unavailable|unconfirmed|missing)\b|n['’]t\b/i;
const qualified = /\b(?:if|whether|unless|maybe|perhaps|possibly|may|might|could|would|should|will|going to|plan|intend|want|need to buy|unsure|uncertain|unclear|confirm|think|believe|doubt|said|says|told|claims?|apparently|reported|returned|returning|cancel\w*|ordered|awaiting|waiting|arriv\w*|another|other property|but|however|although|except|only|or|lie|lied|joking|mistake|correction|retract\w*|sold|lost|stolen|out of stock)\b/i;
const materialWords = /\b(?:bought|buy|purchas\w*|materials?|replacement (?:tap|faucet)|(?:tap|faucet).*(?:available|arrived|delivered|have)|have.*(?:tap|faucet))\b/i;
const affirmativePurchase = /^(?:I|we)(?: (?:have)|'ve)? (?:already )?(bought|purchased) (?:the|a) replacement (tap|faucet)$/i;

export function extractMaterials(message) {
  const text = canonical(message);
  if (!materialWords.test(text)) return {state:'Not provided', details:[]};
  // The whole message can qualify or contradict an otherwise affirmative sentence.
  // Only a tightly bounded first-person sentence is accepted; quotation is not attribution.
  const unsafe = negative.test(text) || qualified.test(text) || /[?"“”]/.test(text);
  const affirmative = sentences(text).find(sentence => affirmativePurchase.test(sentence));
  const materialSentences = sentences(text).filter(sentence => materialWords.test(sentence));
  if (!unsafe && affirmative && materialSentences.every(sentence => affirmativePurchase.test(sentence))) {
    const detail = `The customer states they have ${affirmative.match(affirmativePurchase)[1].toLowerCase()} the replacement ${affirmative.match(affirmativePurchase)[2].toLowerCase()}.`;
    return {state:detail, details:[detail]};
  }
  return {
    state:'Not confirmed — purchase or availability wording is negative, qualified or outside supported patterns. Check the original.',
    details:['Materials purchase and current availability are not confirmed by these rules; check the original wording with the customer.']
  };
}

export function extractFacts(message) {
  const timing = [...message.matchAll(/\b(?:(?:next|this|on)\s+)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|today|tomorrow|next week|next month)\b/gi)].map(m => m[0]);
  const locations = [...message.matchAll(/\b(?:in|at)\s+([A-Z][a-z]+(?:[ -][A-Z][a-z]+){0,3})(?=[\s,.!?;]|$)/g)].map(m => m[1]);
  const urgency = message.match(/\b(?:not urgent|no rush|urgent|asap|as soon as possible|emergency)\b/gi) || [];
  const one = values => [...new Set(values.map(v => v.toLowerCase()))].length === 1 ? values[0] : values.length ? `Unclear — multiple statements: ${values.join('; ')}` : 'Not provided';
  return {timing: one(timing), location: one(locations), urgency: one(urgency)};
}

export function analyseRules(message, base) {
  const text = canonical(message);
  const facts = extractFacts(text);
  const materials = extractMaterials(text);
  // Classify clauses independently. Buying a tap is not a request to replace it.
  // Skip negated/conditional/completed work, rather than spreading its keywords.
  const clauses = sentences(text).flatMap(s => s.split(/\b(?:and|but|however|although)\b/i));
  const work = clauses.filter(clause => {
    const tested = clause.replace(/\b(?:not urgent|no rush|not working)\b/gi, '');
    return !negative.test(tested) && !/\b(?:if|unless|maybe|perhaps|already|fixed|repaired|cancel|ignore|pretend)\b/i.test(tested);
  });
  const plumbing = work.some(c => /\b(?:plumber|plumbing|taps?|faucets?|pipes?|toilets?|drains?)\b/i.test(c) && /\b(?:leak\w*|block\w*|damp|water damage)\b/i.test(c));
  const electricalSymptomIn = c => /\b(?:electrician|electrical|sockets?|wiring|lights?|outlets?)\b/i.test(c) && /\b(?:flicker\w*|cut(?:s|ting)? out|spark\w*|faulty|tripp\w*|damage|not working)\b/i.test(c);
  const electricalSymptom = work.some(electricalSymptomIn);
  // Retain precaution even if complex wording sends the work to manual review.
  const electricalCaution = clauses.some(electricalSymptomIn);
  const water = work.some(c => /\b(?:damp|water damage|leak(?:ing)?)\b/i.test(c));
  const tapReplacement = work.some(c => /\b(?:replace|change|swap|install)\b/i.test(c) && /\b(?:taps?|faucets?)\b/i.test(c));
  const maintenance = work.some(c => /\b(?:repair|fix)\b/i.test(c) && /\b(?:doors?|hinges?|shel(?:f|ves)|fences?)\b/i.test(c));
  const safe = 'Possible electrical concern: do not touch or use affected fittings, or approach them to take a photo. Seek qualified assessment; this prototype cannot assess safety or urgency.';
  const materialsQuestion = materials.state === 'Not provided' ? [] : ['Confirm materials purchase, current availability and compatibility directly with the customer.'];
  if (/<[^>]*>/.test(text) || /\b(?:ignore|pretend)\b/i.test(text) || !(tapReplacement || electricalSymptom || maintenance || plumbing)) {
    return {...base, ...facts, materials:materials.state, fixture:false, mode:'manual', photo:false,
      summary:'This message is outside the supported work patterns. Review the original enquiry and clarify the job with the customer.',
      details:['Job details were not interpreted; explicitly matched facts still require review.', ...materials.details],
      missing:['What work is required?', 'Which trade should assess it?', 'Confirm location, timing, scope and access directly with the customer.', ...materialsQuestion],
      note:'Manual review needed. Unsupported, negated or conditional work is not classified. Rules do not understand arbitrary language. Not provided means not extracted, not necessarily absent.',
      safety: electricalCaution ? safe : ''};
  }
  const trades = new Set(), jobs = [];
  if (electricalSymptom) {
    trades.add('electrician');
    if (water) trades.add('plumber or roofer');
    jobs.push('Assessment of reported electrical symptoms');
  }
  if (tapReplacement || plumbing) {
    trades.add('plumber');
    jobs.push(tapReplacement ? 'Tap / faucet replacement' : 'Assessment of reported plumbing symptoms');
  }
  if (maintenance) {
    trades.add('carpenter or general maintenance');
    jobs.push('Assessment of stated repair work');
  }
  const trade = `Uncertain — ${[...trades].join('; ')} may be needed`;
  const job = jobs.join('; ');
  const details = [
    ...(tapReplacement ? ['The message requests tap / faucet replacement.'] : []),
    ...(electricalSymptom ? ['Electrical symptoms are reported; their cause and any connection with water remain unconfirmed.'] : []),
    ...(maintenance ? ['Repair wording suggests carpentry or general maintenance assessment.'] : []),
    ...materials.details
  ];
  const summary = `${job}. ${facts.location !== 'Not provided' ? `Location phrase: ${facts.location}. ` : ''}${facts.timing !== 'Not provided' ? `Timing: ${facts.timing} (customer’s wording). ` : ''}Review the original message before arranging work.`;
  return {...base, ...facts, materials:materials.state, fixture:false, mode:'rules', trade, job, details, summary,
    uncertain:true, scope: tapReplacement && trades.size === 1 ? 'Tap / faucet replacement; quantity and compatibility require confirmation.' : 'Not provided — assessment required',
    photo:!tapReplacement || electricalSymptom, safety:electricalCaution ? safe : '',
    note:'Limited rule-based interpretation, not live AI. Trade suggestions are tentative; rules cannot establish causes, safety, scope or calendar dates. Unsupported or negated clauses may be omitted; compare the original.',
    missing:[
      ...(facts.location === 'Not provided' ? ['Where is the property? Confirm privately.'] : []),
      ...(facts.timing === 'Not provided' ? ['When would the customer like someone to attend?'] : []),
      ...(tapReplacement ? ['What time suits the customer, and is the replacement tap compatible?', 'How severe is the leak or other tap problem?'] : []),
      ...materialsQuestion,
      'Confirm the work, quantity, compatibility, access and severity directly with the customer.'
    ]};
}
