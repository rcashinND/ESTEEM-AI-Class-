import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectEnquiry,buildBrief} from '../public/workflow.mjs';
import {readAnswers,setControlEnabled,visitTimingContext,validateAnswers} from '../public/form-controls.mjs';
import {examples} from '../public/analysis.mjs';
import {handoffPayload} from '../public/handoff.mjs';

const answers={work:'maintenance',detail:'Loose kitchen cupboard door hinge',area:'Cork',timing:'custom',timeDetail:'Wednesday afternoon',urgency:'routine',safety:'none'};

for (const edit of [' today','. The issue started today.','. It began on Tuesday.','. I noticed the problem this Wednesday.']) {
  test(`Active visit answer survives description edit ${edit}`,()=>{
    const controls=Object.entries(answers).map(([id,value])=>({id,value,disabled:false}));
    for (const description of ['something broken in my kitchen',`something broken in my kitchen${edit}`,'something broken in my kitchen']) {
      const supplied=readAnswers(controls),context=visitTimingContext(supplied);
      const plan=inspectEnquiry(description,context);
      assert.equal(plan.questions.timing,true);
      for (const id of ['timing','timeDetail']) setControlEnabled(controls.find(c=>c.id===id),plan.questions.timing);
      const latest=readAnswers(controls);
      assert.equal(latest.timing,'custom');assert.equal(latest.timeDetail,'Wednesday afternoon');
      assert.equal(latest.work,'maintenance');assert.equal(latest.area,'Cork');assert.equal(latest.urgency,'routine');
      const payload=handoffPayload(buildBrief(description,latest,visitTimingContext(latest)));
      assert.equal(payload.summary.timing,'Wednesday afternoon');
      assert.equal(payload.summary.area,'Cork');
      assert.match(payload.summary.scope.join(' '),/cupboard door hinge/);
      assert.equal(payload.summary.description,undefined);
    }
  });
}
test('Explicit visit preference survives an onset date on a detailed job',()=>{
  const input='Please repair the fence in Dublin. The issue started today.';
  const supplied={timing:'custom',timeDetail:'Wednesday afternoon'};
  assert.equal(inspectEnquiry(input,visitTimingContext(supplied)).questions.timing,true);
  assert.equal(buildBrief(input,supplied,visitTimingContext(supplied)).timing,'Wednesday afternoon');
});
test('Timing selection changes, default, validation and reset remain authoritative',()=>{
  for(const [timing,expected] of [['flexible','Flexible'],['soon','Within a few days'],['week','This week']]) {
    const supplied={...answers,timing,timeDetail:'STALE CUSTOM DAY'};
    const brief=buildBrief('something broken in my kitchen today',supplied,visitTimingContext(supplied));
    assert.equal(brief.timing,expected);assert.doesNotMatch(JSON.stringify(brief),/STALE CUSTOM DAY/);
  }
  assert.equal(visitTimingContext({timing:''}).visitTimingConfirmed,false);
  assert.equal(visitTimingContext({timing:'invalid'}).visitTimingConfirmed,false);
  const disabled=readAnswers([{id:'timing',value:'custom',disabled:true}]);
  assert.equal(visitTimingContext(disabled).visitTimingConfirmed,false);
  assert.equal(validateAnswers({timing:'custom',timeDetail:''}).field,'timeDetail');
});
for(const weekday of ['Tuesday','Wednesday']) {
  test(`Unanswered clear plumbing date remains ${weekday}`,()=>{
    const input=examples.typical.replace('Tuesday',weekday);
    assert.match(buildBrief(input).timing,new RegExp(weekday));
    assert.match(buildBrief(input).trades,/Plumber/);
  });
}
for(const input of [
  'Please repair the fence and assess a faulty socket in Dublin tomorrow',
  'Please assess a faulty socket and repair the fence in Dublin tomorrow.',
  'I need a fence repaired and a faulty socket assessed in Dublin tomorrow.'
]) {
  test(`Concise brief names supported affected items: ${input}`,()=>{
    const brief=buildBrief(input),scope=brief.scope.join(' ');
    assert.match(scope,/\bfence\b/i);assert.match(scope,/\bfaulty socket\b/i);
    assert.match(brief.trades,/Electrician/);assert.match(brief.trades,/Carpenter or general maintenance/);
    assert.equal(brief.area,'Dublin');assert.equal(brief.timing,'tomorrow');
    assert.match(brief.safety,/do not touch.*qualified assessment/);
    assert.doesNotMatch(scope,/caused by|short circuit|faulty wiring|due to/i);
    assert.ok(!scope.includes(input));assert.ok(brief.scope.length<=5);
  });
}
for(const prefix of ['Do not repair the fence.','The fence was already repaired.']) {
  test(`Do not resurrect excluded work item: ${prefix}`,()=>{
    const brief=buildBrief(`${prefix} Please assess a faulty socket in Dublin tomorrow.`);
    assert.doesNotMatch(brief.trades,/Carpenter/);
    assert.doesNotMatch(brief.scope.join(' '),/\bfence\b/i);
    assert.match(brief.scope.join(' '),/faulty socket/);
    assert.match(brief.safety,/do not touch/);
  });
}
for(const negative of ["I haven't bought the replacement tap",'I have not bought the replacement tap',"I don't have the replacement tap",'The replacement tap is not yet purchased']) {
  test(`Explicit materials negation survives corrected visit timing: ${negative}`,()=>{
    const input=`Please replace the tap in Dublin. The issue started today. ${negative}.`;
    const supplied={timing:'custom',timeDetail:'Wednesday afternoon'};
    const brief=buildBrief(input,supplied,visitTimingContext(supplied));
    assert.match(brief.materials,/not confirmed/i);
    assert.doesNotMatch(brief.scope.join(' '),/already purchased|has bought|states they have bought/i);
    assert.equal(brief.timing,'Wednesday afternoon');
  });
}
