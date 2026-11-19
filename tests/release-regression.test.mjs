import test from 'node:test';
import assert from 'node:assert/strict';
import {analyse, examples} from '../public/analysis.mjs';

const enquiry = statement => `Please replace a leaking kitchen tap in Dublin next Wednesday. ${statement}`;
const output = result => [result.summary, result.scope, ...result.details].join(' ');
const purchaseClaim = /replacement tap already purchased|customer (?:states they have|has) bought|materials purchased/i;

for (const statement of [
  "I haven't bought the replacement tap.",
  'I haven’t bought the replacement tap.',
  'I have not bought the replacement tap.',
  'I have not yet bought the replacement tap.',
  'I have not purchased the replacement tap.',
  'Not bought the replacement tap yet.',
  "I don't have the replacement tap.",
  'I do not have a replacement tap.',
  'I have not yet purchased the replacement tap.',
  'Replacement tap not yet purchased.',
  "We haven't purchased a replacement faucet.",
  'I never bought the replacement tap.',
  'I am without a replacement tap.',
  'I have no replacement tap available.',
  'The replacement tap is unavailable.',
  "I can't confirm whether I bought the replacement tap.",
]) {
  test(`Materials never reverse negative/uncertain wording: ${statement}`, () => {
    const result = analyse(enquiry(statement));
    assert.equal(result.fixture, false);
    assert.match(result.materials, /not confirmed|uncertain/i);
    assert.doesNotMatch(output(result), purchaseClaim);
    assert.match(result.missing.join(' '), /material|purchase|availability/i);
    assert.equal(result.location, 'Dublin');
    assert.equal(result.timing, 'next Wednesday');
  });
}

for (const statement of [
  "I bought the replacement tap but I don't have it.",
  "I haven't bought the tap, but I have bought the replacement tap.",
  'I have bought the replacement tap. Actually, I have not bought it.',
  'I have bought the replacement tap. It is not available.',
  'I have bought the replacement tap. I returned it.',
  'I have bought the replacement tap. It has not arrived.',
  'I may have bought the replacement tap.',
  'If I have bought the replacement tap, can you fit it?',
  'Did I buy the replacement tap?',
  'I have bought the replacement tap for another property.',
  'The plumber said "I have bought the replacement tap".',
  'I have bought the replacement tap? I am unsure.',
  'I have bought the replacement tap, or perhaps I only ordered it.',
  'I have bought the replacement tap. That was a lie.',
  'I have bought the replacement tap. I sold it.',
  'I have bought the replacement tap. The materials are unavailable.',
  'I have bought the replacement tap. The replacement faucet might be unavailable.',
]) {
  test(`Contrasting, qualified or attributed materials remain uncertain: ${statement}`, () => {
    const result = analyse(enquiry(statement));
    assert.match(result.materials, /not confirmed|uncertain/i);
    assert.doesNotMatch(output(result), purchaseClaim);
  });
}

for (const statement of [
  'I have bought the replacement tap.',
  'I bought a replacement faucet.',
  'We have purchased the replacement tap.',
  'I’ve already bought the replacement tap.',
]) {
  test(`Unqualified first-person purchase is retained: ${statement}`, () => {
    const result = analyse(enquiry(statement));
    assert.match(result.materials, /customer states.*(?:bought|purchased)/i);
    assert.match(result.details.join(' '), /customer states.*(?:bought|purchased)/i);
    assert.match(result.missing.join(' '), /compatib|availability/i);
  });
}

test('Exact audited negative purchase never becomes purchased', () => {
  const input = examples.typical.replace('I have bought', "I haven't bought");
  const result = analyse(input);
  assert.match(result.materials, /not confirmed/i);
  assert.doesNotMatch(output(result), purchaseClaim);
  assert.equal(result.location, 'South Bend');
  assert.match(result.timing, /Tuesday/);
});

for (const input of [
  'Please repair the fence and assess a faulty socket in Dublin tomorrow.',
  'Please assess a faulty socket and repair the fence in Dublin tomorrow.',
  'Please replace the tap and repair the fence and assess a faulty socket in Dublin tomorrow.',
  'Please fix the door. The outlet is sparking in Dublin tomorrow.',
]) {
  test(`Overlapping trades accumulate with electrical caution: ${input}`, () => {
    const result = analyse(input);
    assert.equal(result.mode, 'rules');
    assert.match(result.trade, /electrician/i);
    assert.match(result.trade, /carpenter|maintenance/i);
    if (/replace the tap/.test(input)) assert.match(result.trade, /plumber/i);
    assert.match(result.safety, /do not touch/);
    assert.equal(result.uncertain, true);
    assert.equal(result.location, 'Dublin');
    assert.equal(result.timing, 'tomorrow');
    assert.match(result.scope, /assessment|confirmation/i);
    assert.doesNotMatch(result.summary, /caused by|due to|diagnosed/i);
  });
}

test('Independent plumbing and maintenance requests retain both suggestions', () => {
  const result = analyse('Please replace the tap and repair the fence in Dublin next week.');
  assert.match(result.trade, /plumber/i);
  assert.match(result.trade, /carpenter|maintenance/i);
  assert.equal(result.safety, '');
  assert.equal(result.materials, 'Not provided');
});

test('Negated work is not classified from keywords', () => {
  const result = analyse('Do not repair the fence. Please replace the tap in Dublin tomorrow.');
  assert.doesNotMatch(result.trade, /carpenter|maintenance/i);
  assert.match(result.trade, /plumber/i);
});

test('No plumbing is inferred solely from buying a tap during a fence repair', () => {
  const result = analyse('Please repair the fence in Dublin tomorrow. I have bought the replacement tap.');
  assert.doesNotMatch(result.trade, /plumber/i);
  assert.match(result.trade, /maintenance/i);
});

test('Wednesday preserves the specific plumbing follow-up questions', () => {
  const result = analyse(examples.typical.replace('Tuesday', 'Wednesday'));
  assert.equal(result.timing, 'next Wednesday');
  assert.doesNotMatch(output(result), /Tuesday/);
  assert.match(result.missing.join(' '), /compatib/i);
  assert.match(result.missing.join(' '), /sever|leak/i);
  assert.match(result.missing.join(' '), /time/i);
});

for (const [place, day] of [['Dublin', 'Friday'], ['South Bend', 'Monday'], ['New York', 'Thursday']]) {
  test(`Explicit variation retains ${place} and ${day}`, () => {
    const result = analyse(`Please replace the leaking tap in ${place} next ${day}.`);
    assert.equal(result.location, place);
    assert.equal(result.timing, `next ${day}`);
    assert.equal(result.materials, 'Not provided');
    assert.doesNotMatch(output(result), purchaseClaim);
  });
}

test('Conflicting dates and locations are not silently selected', () => {
  const result = analyse('Please replace the tap in Dublin on Tuesday or in Cork on Wednesday.');
  assert.match(result.location, /Unclear.*Dublin.*Cork/);
  assert.match(result.timing, /Unclear.*Tuesday.*Wednesday/);
});

test('Unsupported vague request invents no trade or purchased materials', () => {
  const result = analyse('Something seems wrong somewhere in the house.');
  assert.equal(result.mode, 'manual');
  assert.equal(result.trade, 'Not provided');
  assert.equal(result.materials, 'Not provided');
});

test('Invalid input types and whitespace produce useful validation', () => {
  for (const input of [null, undefined, 42, '\n\t ']) {
    assert.throws(() => analyse(input), /paste a customer enquiry/i);
  }
});

test('Electrical caution survives uncertain purchase wording', () => {
  const result = analyse("Please assess a faulty socket in Dublin tomorrow. I haven't bought the replacement tap.");
  assert.match(result.safety, /do not touch/);
  assert.match(result.trade, /electrician/i);
  assert.doesNotMatch(output(result), purchaseClaim);
});

test('Multiple positive and negative purchase clauses are order independent', () => {
  const positive = 'I have bought the replacement tap.';
  const negatives = ["I haven't bought the replacement faucet.", "I don't have it.", 'Not yet purchased.'];
  for (const negative of negatives) for (const statement of [`${positive} ${negative}`, `${negative} ${positive}`]) {
    const result = analyse(enquiry(statement));
    assert.match(result.materials, /not confirmed/i);
    assert.doesNotMatch(output(result), purchaseClaim);
  }
});

test('Negating one electrical clause cannot invent a water-related cause', () => {
  const result = analyse('Please assess a faulty socket in Dublin tomorrow. There is no water damage.');
  assert.match(result.trade, /electrician/i);
  assert.doesNotMatch(result.trade, /plumber|roofer/i);
  assert.match(result.safety, /do not touch/);
});
