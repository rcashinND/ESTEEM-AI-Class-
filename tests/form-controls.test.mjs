import test from 'node:test';
import assert from 'node:assert/strict';
import {bindAnswerControls,setControlEnabled,readAnswers,validateAnswers} from '../public/form-controls.mjs';
import {buildBrief,WORK_TYPES,TIMINGS,URGENCIES,SAFETY} from '../public/workflow.mjs';
import {saveHandoff,readHandoff} from '../public/handoff.mjs';

// Small EventTarget fixtures test our listeners/state contract, not browser popup rendering.
class Control extends EventTarget {
  constructor(id,tagName='SELECT',value='') {super();this.id=id;this.tagName=tagName;this.value=value;this.disabled=false;}
  commit(value,event='change') {this.value=value;this.dispatchEvent(new Event(event));}
}
const form = () => ['work','detail','area','timing','timeDetail','urgency','safety','safetyDetail'].map(id=>new Control(id,['work','timing','urgency','safety'].includes(id)?'SELECT':'INPUT'));
const defaults={work:'maintenance',detail:'A cupboard door has a loose hinge',area:'Dublin',timing:'custom',timeDetail:'next Wednesday afternoon',urgency:'routine',safety:'none',safetyDetail:''};
function setup() {
  const controls=form();for(const control of controls)control.value=defaults[control.id];
  let state=readAnswers(controls),commits=0;
  bindAnswerControls(controls,()=>{state=readAnswers(controls);commits++;});
  return {controls,get:id=>controls.find(control=>control.id===id),state:()=>state,commits:()=>commits};
}
for(const id of ['work','timing','urgency','safety']) {
  test(`${id}: native change-only commit saves state, without input dependency or duplicate commits`,()=>{
    const f=setup(),control=f.get(id);
    control.commit('', 'input');assert.equal(f.commits(),0);
    control.dispatchEvent(new Event('change'));assert.equal(f.commits(),1);assert.equal(f.state()[id],'');
    for(const other of Object.keys(defaults).filter(key=>key!==id))assert.equal(f.state()[other],defaults[other]);
  });
}
test('Text clarifications still update immediately on input',()=>{
  const f=setup();f.get('detail').commit('Please assess the cupboard hinge','input');
  assert.equal(f.state().detail,'Please assess the cupboard hinge');assert.equal(f.commits(),1);
});
test('Already-enabled select is not mutated and retains its selected value',()=>{
  let writes=0,valueWrites=0;
  const control={get disabled(){return false;},set disabled(value){writes++;},get value(){return 'other';},set value(value){valueWrites++;}};
  setControlEnabled(control,true);setControlEnabled(control,true);
  assert.equal(writes,0);assert.equal(valueWrites,0);assert.equal(control.value,'other');
});
test('Only inapplicable controls are cleared, and disabled answers are excluded',()=>{
  const f=setup();setControlEnabled(f.get('timeDetail'),false);
  assert.equal(f.get('timeDetail').value,'');assert.equal(readAnswers(f.controls).timeDetail,'');
  assert.equal(f.get('work').value,'maintenance');assert.equal(f.get('area').value,'Dublin');
  setControlEnabled(f.get('timeDetail'),true);assert.equal(f.get('timeDetail').disabled,false);
});
test('Hidden controls ignore artificial change events and cleanup removes listeners',()=>{
  const c=new Control('work'),seen=[];const unbind=bindAnswerControls([c],id=>seen.push(id));
  c.disabled=true;c.commit('tap');assert.deepEqual(seen,[]);
  c.disabled=false;c.commit('other');assert.deepEqual(seen,['work']);
  unbind();c.commit('electrical');assert.deepEqual(seen,['work']);
});
test('Reset to default followed by selecting the same previous value commits again',()=>{
  const f=setup();f.get('work').commit('tap');f.get('work').value='';f.get('work').commit('tap');
  assert.equal(f.commits(),2);assert.equal(f.state().work,'tap');
});

for(const [value,expected] of Object.entries(WORK_TYPES)) {
  test(`Work option ${JSON.stringify(value)} propagates factual job/trade to the brief`,()=>{
    const f=setup();f.get('detail').value='';f.get('work').commit(value);
    const brief=buildBrief('I need someone to help with my house',f.state());
    assert.equal(brief.job,expected?.job || 'Home enquiry — assessment needed');
    if(expected?.trade)assert.ok(brief.trades.includes(expected.trade));
    else assert.equal(brief.trades,'Not established — confirm the appropriate trade');
    assert.equal(brief.area,'Dublin');assert.equal(brief.timing,'next Wednesday afternoon');
  });
}
for(const [value,expected] of Object.entries(TIMINGS)) {
  test(`Timing option ${JSON.stringify(value)} propagates without changing other answers`,()=>{
    const f=setup();f.get('timing').commit(value);
    const brief=buildBrief('I need help at home',f.state());
    assert.equal(brief.timing,value==='custom'?'next Wednesday afternoon':expected||'Not provided');
    assert.equal(brief.area,'Dublin');assert.equal(brief.urgency,'Routine / not urgent');
    assert.equal(f.state().work,'maintenance');
  });
}
for(const [value,expected] of Object.entries(URGENCIES)) {
  test(`Urgency option ${JSON.stringify(value)} propagates the actual customer choice`,()=>{
    const f=setup();f.get('urgency').commit(value);
    const brief=buildBrief('I need help at home',f.state());
    assert.equal(brief.urgency,expected||'Not provided');assert.equal(brief.area,'Dublin');
  });
}
for(const [value,expected] of Object.entries(SAFETY)) {
  test(`Safety option ${JSON.stringify(value)} propagates without invented hazard causes`,()=>{
    const f=setup();f.get('safety').commit(value);
    const brief=buildBrief('I need help at home',f.state());
    assert.equal(brief.concern,expected||'Not confirmed');
    if(value==='electrical'){assert.match(brief.safety,/do not touch/);assert.match(brief.trades,/Electrician/);}
    else assert.equal(brief.safety,'');
    assert.doesNotMatch(JSON.stringify(brief),/short circuit|faulty wiring|caused by/i);
  });
}
test('Dependent fields clear only on becoming inapplicable; unrelated answers survive',()=>{
  const f=setup();f.get('safety').commit('other');f.get('safetyDetail').commit('Sharp edge noticed','input');
  f.get('timing').commit('flexible');setControlEnabled(f.get('timeDetail'),false);
  assert.equal(f.get('safetyDetail').value,'Sharp edge noticed');assert.equal(f.get('area').value,'Dublin');
  f.get('safety').commit('none');setControlEnabled(f.get('safetyDetail'),false);
  const brief=buildBrief('I need help at home',readAnswers(f.controls));
  assert.equal(brief.timing,'Flexible');assert.doesNotMatch(JSON.stringify(brief),/Wednesday|Sharp edge/);
});
test('Nondefault committed answers survive the actual structured handoff',()=>{
  const f=setup();f.get('work').commit('electrical');f.get('timing').commit('week');f.get('urgency').commit('urgent');f.get('safety').commit('other');
  f.get('safetyDetail').commit('A faulty socket sometimes sparks','input');
  const map=new Map(),storage={getItem:key=>map.get(key),setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};
  saveHandoff(storage,buildBrief('I need help at home',f.state()),[],1000);
  const {summary}=readHandoff(storage,1001);
  assert.equal(summary.job,'Electrical work / assessment');assert.match(summary.trades,/Electrician/);
  assert.equal(summary.area,'Dublin');assert.equal(summary.timing,'This week');
  assert.equal(summary.urgency,'Urgent — customer requests prompt contact');
  assert.match(summary.scope.join(' '),/socket sometimes sparks/);assert.match(summary.safety,/do not touch/);
  assert.equal(summary.description,undefined);assert.equal(summary.answers,undefined);
});
test('Custom timing needs actionable detail; unanswered/other/optional answers are safe',()=>{
  for(const timeDetail of ['', '   ']) {
    const issue=validateAnswers({timing:'custom',timeDetail});assert.equal(issue.field,'timeDetail');
    assert.match(issue.message,/preferred day or time/);assert.match(issue.message,/Not sure yet.*Flexible/);
  }
  for(const timing of ['', 'flexible','soon','week'])assert.equal(validateAnswers({timing,work:'other',safety:'other'}),null);
  assert.equal(validateAnswers({timing:'custom',timeDetail:'Wednesday afternoon'}),null);
});
