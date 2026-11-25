import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {examples} from '../public/analysis.mjs';
import {inspectEnquiry,buildBrief,WORK_TYPES} from '../public/workflow.mjs';
import {saveHandoff,readHandoff,clearHandoff,handoffPayload,HANDOFF_KEY,MAX_AGE} from '../public/handoff.mjs';
import {validatePhotos,validatePhotoContent,imageTypeFromBytes,MAX_PHOTO_BYTES} from '../public/photos.mjs';

const memory = () => {const map=new Map();return {setItem:(k,v)=>map.set(k,v),getItem:k=>map.get(k)??null,removeItem:k=>map.delete(k)};};
const answers={work:'maintenance',detail:'Kitchen cupboard door has come off its hinge',area:'Dublin',timing:'custom',timeDetail:'next Wednesday afternoon',urgency:'routine',safety:'none'};
const allText = brief => JSON.stringify(brief);

for(const description of ['I need someone to help with my house','something is broken in my kitchen','help','Can somebody have a look at this?']) {
  test(`Sparse/unsupported detection before submit: ${description}`,()=>{
    const plan=inspectEnquiry(description);
    assert.equal(plan.lowDetail,true);
    assert.equal(plan.questions.work,true);
    assert.equal(Object.values(plan.questions).filter(Boolean).length,5);
  });
  test(`Actual answers make sparse input useful: ${description}`,()=>{
    const brief=buildBrief(description,answers);
    assert.match(brief.job,/Door, fence or fitting/);
    assert.match(brief.trades,/Carpenter or general maintenance/);
    assert.match(brief.scope.join(' '),/cupboard door.*hinge/);
    assert.equal(brief.area,'Dublin');
    assert.equal(brief.timing,'next Wednesday afternoon');
    assert.equal(brief.urgency,'Routine / not urgent');
    assert.match(brief.concern,/No concerns noticed.*not a safety assessment/);
    assert.ok(!brief.followUp.some(q=>/town|preferred visit|soon attention/.test(q)));
    assert.ok(!allText(brief).includes(description));
  });
}

test('Detailed plumbing asks only missing urgency and safety',()=>{
  const plan=inspectEnquiry(examples.typical);
  assert.equal(plan.lowDetail,false);
  assert.deepEqual(plan.questions,{work:false,area:false,timing:false,urgency:true,safety:true});
});
test('Prepared clear brief retains facts and useful follow-up without original paragraph',()=>{
  const brief=buildBrief(examples.typical,{urgency:'routine',safety:'none'});
  assert.equal(brief.area,'South Bend');
  assert.match(brief.timing,/Tuesday/);
  assert.match(brief.trades,/Plumber/);
  assert.match(brief.materials,/bought/);
  assert.match(brief.followUp.join(' '),/compatibility.*severity/);
  assert.ok(!allText(brief).includes(examples.typical));
  assert.ok(!/Review the original|Location phrase/.test(allText(brief)));
});
test('Kitchen alone cannot imply plumbing, electrical diagnosis or purchased materials',()=>{
  const brief=buildBrief('something is broken in my kitchen',{area:'Cork',timing:'flexible'});
  assert.match(brief.trades,/Not established/);
  assert.match(brief.job,/assessment needed/);
  assert.equal(brief.materials,'Not provided');
  assert.equal(brief.area,'Cork');
  assert.equal(brief.timing,'Flexible');
});
test('Uncertain skipped answers remain honest and request essential clarification',()=>{
  const brief=buildBrief('I need someone to help with my house');
  assert.match(brief.trades,/Not established/);
  assert.match(brief.followUp.join(' '),/exact work.*town.*day or time/);
  assert.match(brief.scope.join(' '),/customer needs help/i);
});
test('Unknown other work preserves the actual short scope without inventing trade',()=>{
  const brief=buildBrief('I need help at home',{work:'other',detail:'Assemble a flat-pack bookcase',area:'Dublin'});
  assert.equal(brief.job,'Other requested work');
  assert.match(brief.scope.join(' '),/Assemble a flat-pack bookcase/);
  assert.match(brief.trades,/Not established/);
});
test('Explicit safety clarification preserves warning without diagnosis',()=>{
  const brief=buildBrief('I need help at home',{...answers,work:'electrical',safety:'electrical',safetyDetail:'The socket sometimes sparks'});
  assert.match(brief.trades,/Electrician/);
  assert.match(brief.safety,/do not touch.*qualified assessment/);
  assert.match(brief.scope.join(' '),/socket sometimes sparks/);
  assert.doesNotMatch(allText(brief),/caused by|diagnosed|due to/);
});
test('Electrical safety answer adds electrician without losing a known plumbing job',()=>{
  const brief=buildBrief(examples.typical,{safety:'electrical',safetyDetail:'The socket sometimes sparks'});
  assert.match(brief.trades,/Plumber/);assert.match(brief.trades,/Electrician/);
  assert.match(brief.safety,/do not touch/);
});
test('Supported electrical symptoms in an other-concern answer retain caution',()=>{
  const brief=buildBrief('I need help at home',{...answers,safety:'other',safetyDetail:'A faulty socket is sparking'});
  assert.match(brief.trades,/Electrician/);assert.match(brief.trades,/Carpenter/);
  assert.match(brief.safety,/do not touch/);
});
test('A conflicting materials clarification cannot retain a prepared positive purchase detail',()=>{
  const brief=buildBrief(examples.typical,{safety:'other',safetyDetail:"I haven't bought the replacement tap."});
  assert.match(brief.materials,/not confirmed/i);
  assert.doesNotMatch(brief.scope.join(' '),/customer has bought|already purchased/i);
});
test('Hidden conditional extras are never passed through',()=>{
  const brief=buildBrief('I need help at home',{...answers,timing:'flexible',timeDetail:'HIDDEN DATE',safety:'none',safetyDetail:'HIDDEN SAFETY'});
  assert.doesNotMatch(allText(brief),/HIDDEN/);
});
test('Known electrical caution cannot be hidden by a stale no-concern answer',()=>{
  const brief=buildBrief(examples.challenge,{safety:'none'});
  assert.match(brief.safety,/do not touch/);
  assert.match(brief.trades,/Electrician/);assert.match(brief.trades,/Plumber/);assert.match(brief.trades,/Roofer/);
  assert.doesNotMatch(brief.concern,/No concerns/);
});
test('Fence and faulty socket retain both relevant trades and safety',()=>{
  const brief=buildBrief('Please repair the fence and assess a faulty socket in Dublin tomorrow.');
  assert.match(brief.trades,/Electrician/);
  assert.match(brief.trades,/Carpenter or general maintenance/);
  assert.match(brief.safety,/do not touch/);
  assert.equal(brief.area,'Dublin');assert.equal(brief.timing,'tomorrow');
});
test('Requested repair participles retain maintenance alongside electrical work',()=>{
  for(const request of ['I need a fence repaired','The fence needs repairing','Please have the door fixed']) {
    const brief=buildBrief(`${request} and a faulty socket assessed in Dublin tomorrow.`);
    assert.match(brief.trades,/Electrician/);
    assert.match(brief.trades,/Carpenter or general maintenance/);
    assert.match(brief.safety,/do not touch/);
  }
});
test('Already completed maintenance does not become a new repair request',()=>{
  const brief=buildBrief('The fence was already repaired. Please assess a faulty socket in Dublin tomorrow.');
  assert.match(brief.trades,/Electrician/);assert.doesNotMatch(brief.trades,/Carpenter|maintenance/);
});
for(const negative of ["I haven't bought the replacement tap.",'I have not purchased the replacement tap.',"I don't have the replacement tap.",'Not yet purchased.']) {
  test(`Two-stage brief retains materials negation: ${negative}`,()=>{
    const brief=buildBrief(`Please replace the tap in Dublin next Wednesday. ${negative}`);
    assert.match(brief.materials,/not confirmed/i);
    assert.doesNotMatch(brief.scope.join(' '),/already purchased|states they have bought/);
  });
}
test('Negated clarification never turns materials into a positive',()=>{
  const brief=buildBrief('I need help at home',{work:'tap',detail:"I haven't bought the replacement tap.",area:'Dublin'});
  assert.match(brief.materials,/not confirmed/i);
  assert.doesNotMatch(allText(brief),/already purchased/);
});
test('Conflicting work selection cannot reverse a negative instruction',()=>{
  const brief=buildBrief('Do not replace the tap in Dublin tomorrow.',{work:'tap'});
  assert.match(brief.job,/needs confirmation/);
  assert.doesNotMatch(brief.trades,/Plumber/);
  assert.match(brief.followUp.join(' '),/exact work/);
});
test('A negated clarification cannot be reversed by its dropdown selection',()=>{
  const brief=buildBrief('I need help at home',{work:'tap',detail:'Do not replace the tap.'});
  assert.match(brief.job,/needs confirmation/);
  assert.doesNotMatch(brief.trades,/Plumber/);
  assert.match(brief.scope.join(' '),/Conflicting work instructions/);
});
test('Hidden old answers cannot override the latest clear description',()=>{
  const brief=buildBrief(examples.typical.replace('Tuesday','Wednesday'),{...answers,area:'Cork',timing:'custom',timeDetail:'Friday'});
  assert.equal(brief.area,'South Bend');assert.equal(brief.timing,'next Wednesday');
  assert.doesNotMatch(allText(brief),/Cork|Friday|cupboard/);
});
test('Blank descriptions cannot be submitted even with completed answers',()=>{
  for(const input of ['', '   ',null,undefined]) assert.throws(()=>buildBrief(input,answers),/describe the problem/);
});
test('Photos are optional and never change analysis or create vision claims',()=>{
  const brief=buildBrief('I need someone to help with my house',answers);
  const payload=handoffPayload(brief,[]);
  assert.deepEqual(payload.photos,[]);
  assert.deepEqual(payload.summary.scope,brief.scope);
  assert.match(brief.photoNotice,/No image analysis/);
});
test('Handoff allowlist removes raw paragraph, questionnaire transcript and hidden properties',()=>{
  const storage=memory();
  const brief={...buildBrief('I need help at home',answers),raw:'SECRET RAW PARAGRAPH',description:'HIDDEN',answers:{phone:'PRIVATE'},debug:'VERBOSE'};
  saveHandoff(storage,brief,[],1000);
  const json=storage.getItem(HANDOFF_KEY);
  assert.doesNotMatch(json,/SECRET|HIDDEN|PRIVATE|VERBOSE|"answers"|"raw"|"description"/);
  assert.equal(readHandoff(storage,1001).summary.area,'Dublin');
});
test('Latest submission replaces old brief, clear invalidates, direct access is empty',()=>{
  const storage=memory();assert.equal(readHandoff(storage,1000),null);
  saveHandoff(storage,buildBrief('I need help at home',answers),[],1000);
  saveHandoff(storage,buildBrief(examples.typical),[],1001);
  assert.equal(readHandoff(storage,1002).summary.area,'South Bend');
  clearHandoff(storage);assert.equal(readHandoff(storage,1003),null);
});
test('Malformed, expired and future handoffs cannot resurrect stale data',()=>{
  const storage=memory();storage.setItem(HANDOFF_KEY,'not json');assert.equal(readHandoff(storage),null);
  saveHandoff(storage,buildBrief(examples.typical),[],1000);
  assert.equal(readHandoff(storage,1000+MAX_AGE+1),null);
  saveHandoff(storage,buildBrief(examples.typical),[],1000);assert.equal(readHandoff(storage,999),null);
});
test('Storage failures are explicit rather than pretending submission succeeded',()=>{
  assert.throws(()=>saveHandoff({setItem(){throw Error('quota');}},buildBrief(examples.typical)),/could not keep the brief/);
});
test('Failed replacement submission cannot retain an older brief',()=>{
  const storage=memory();saveHandoff(storage,buildBrief(examples.typical),[],1000);
  storage.setItem=()=>{throw Error('quota');};
  assert.throws(()=>saveHandoff(storage,buildBrief('help',answers),[],1001),/could not keep/);
  assert.equal(readHandoff(storage,1002),null);
});
test('Photo validation permits supported types and rejects size/type/count violations',()=>{
  assert.doesNotThrow(()=>validatePhotos([{type:'image/png',size:100}]));
  assert.doesNotThrow(()=>validatePhotos([{type:'image/jpeg',size:MAX_PHOTO_BYTES}]));
  assert.doesNotThrow(()=>validatePhotos([{type:'image/webp',size:1024}]));
  assert.throws(()=>validatePhotos([{type:'image/svg+xml',size:100}]),/JPEG, PNG or WebP/);
  assert.throws(()=>validatePhotos([{type:'image/jpeg',size:MAX_PHOTO_BYTES+1}]),/5 MB/);
  assert.throws(()=>validatePhotos([{type:'image/jpeg',size:0}]),/non-empty/);
  assert.throws(()=>validatePhotos([{type:'image/png',size:100}],3),/up to 3/);
});
test('Signature validation supports empty-MIME picker photos without trusting filename',async()=>{
  const bytes=new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0]);
  assert.equal(await validatePhotoContent(new File([bytes],'photo.png',{type:''})),'image/png');
  assert.equal(await validatePhotoContent(new File([bytes],'photo.bin',{type:'application/octet-stream'})),'image/png');
  await assert.rejects(()=>validatePhotoContent(new File(['not a photo'],'renamed.png',{type:''})),/not a supported/);
  await assert.rejects(()=>validatePhotoContent(new File(['<svg></svg>'],'renamed.png',{type:'image/png'})),/not a supported/);
});
test('JPEG and WebP signatures are recognised, empty/unsupported bytes are not',()=>{
  assert.equal(imageTypeFromBytes(new Uint8Array([255,216,255,224])),'image/jpeg');
  assert.equal(imageTypeFromBytes(new TextEncoder().encode('RIFF1234WEBP')),'image/webp');
  assert.equal(imageTypeFromBytes(new Uint8Array()),null);
  assert.equal(imageTypeFromBytes(new TextEncoder().encode('%PDF-')) ,null);
});
test('Handoff photos are separate, stripped of source filename and never arbitrary URLs',()=>{
  const brief=buildBrief(examples.typical);
  const payload=handoffPayload(brief,[{dataUrl:'data:image/jpeg;base64,YQ==',name:'private-name.jpg',exif:'gps'}]);
  assert.deepEqual(payload.photos,[{dataUrl:'data:image/jpeg;base64,YQ=='}]);
  assert.throws(()=>handoffPayload(brief,[{dataUrl:'https://tracker.test/photo'}]),/could not be attached/);
});
test('Photo removal leaves no image in the submitted handoff',()=>{
  const photos=[{dataUrl:'data:image/jpeg;base64,YQ=='}];photos.splice(0,1);
  assert.deepEqual(handoffPayload(buildBrief(examples.typical),photos).photos,[]);
});
test('Review page contains no original-input or questionnaire UI and uses safe text rendering',()=>{
  const html=readFileSync(new URL('../public/review.html',import.meta.url),'utf8');
  const js=readFileSync(new URL('../public/review.js',import.meta.url),'utf8');
  assert.doesNotMatch(html,/<textarea|id="enquiry"|id="questions"|id="detail"/);
  assert.match(html,/No current enquiry to review/);
  assert.doesNotMatch(js,/innerHTML|\.raw|\.description|\.answers/);
});
test('Each supported work choice has a valid option in the customer form',()=>{
  const html=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
  for(const value of Object.keys(WORK_TYPES)) assert.ok(html.includes(`<option value="${value}">`),`Missing work option ${value}`);
  assert.doesNotMatch(html,/<\/option\s+value/);
});
