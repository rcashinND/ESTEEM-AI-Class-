import {examples} from './analysis.mjs';
import {inspectEnquiry,buildBrief} from './workflow.mjs';
import {clearHandoff,saveHandoff} from './handoff.mjs';
import {validatePhotos,preparePhoto} from './photos.mjs';
import {bindAnswerControls,setControlEnabled,readAnswers,validateAnswers,visitTimingContext} from './form-controls.mjs';

const $ = id=>document.getElementById(id);
const groups = [...document.querySelectorAll('[data-question]')];
const answerIds = ['work','detail','area','timing','timeDetail','urgency','safety','safetyDetail'];
const answerControls = answerIds.map($);
let photos=[], photoEpoch=0, pendingPhotos=false;
const storage = () => window.sessionStorage;
function invalidate() { try { clearHandoff(storage()); } catch {} }
function setError(id,message='') { $(id).textContent=message; $(id).hidden=!message; }
function clearValidation() {
  setError('error');setError('time-error');
  for (const control of [$('enquiry'),...answerControls]) control.removeAttribute('aria-invalid');
}
function answers() {
  return readAnswers(answerControls);
}
function updateProgress(plan) {
  const a=answers();
  const complete={work:!!(a.work||a.detail.trim()),area:!!a.area.trim(),timing:!!(a.timing && (a.timing!=='custom'||a.timeDetail.trim())),urgency:!!a.urgency,safety:!!a.safety};
  const asked=Object.entries(plan.questions).filter(([,needed])=>needed).map(([key])=>key);
  const count=asked.filter(key=>complete[key]).length;
  $('progress').textContent=$('enquiry').value.trim() ? `${count} of ${asked.length} helpful details added · unknowns are okay` : 'No description yet';
  $('completion').max=Math.max(asked.length,1); $('completion').value=count;
}
function updateQuestions() {
  const description=$('enquiry').value, plan=inspectEnquiry(description,visitTimingContext(answers())), started=!!description.trim();
  $('counter').textContent=`${description.length} / 4,000`;
  $('questions').hidden=!started;
  for (const group of groups) {
    const visible=started && plan.questions[group.dataset.question];
    if (group.hidden !== !visible) group.hidden=!visible;
    for (const control of group.querySelectorAll('input,select')) {
      const applicable=control.id==='timeDetail' ? $('timing').value==='custom'
        : control.id==='safetyDetail' ? ['electrical','water','other'].includes($('safety').value) : true;
      setControlEnabled(control,visible && applicable);
    }
  }
  $('time-extra').hidden=$('timeDetail').disabled;
  $('safety-extra').hidden=$('safetyDetail').disabled;
  $('guidance').textContent=!started ? 'Start typing and we’ll ask only for details the rules could not identify.'
    : plan.lowDetail ? 'No need to know the trade. These short answers will help turn this into a useful brief.'
    : 'We found some useful details already. Just fill the gaps below.';
  $('photo-heading').textContent=started&&plan.lowDetail ? 'Could you add a photo of the problem?' : 'Add a supporting photo (optional)';
  $('photo-prompt').textContent=started&&plan.lowDetail ? 'A photo would help the tradesperson see what you mean. Add one now, or skip it and answer a few quick questions.'
    : 'You can attach a photo for the tradesperson to inspect, if it is safe to take one.';
  $('photo-section').classList.toggle('needs-photo',started&&plan.lowDetail);
  const clarificationWarning=inspectEnquiry([$('detail'),$('safetyDetail')].filter(control=>!control.disabled).map(control=>control.value).join('. ')).analysis.safety;
  const warning=plan.analysis.safety || clarificationWarning || ($('safety').value==='electrical'||$('work').value==='electrical' ? 'Possible electrical concern: do not touch or use affected fittings, or approach them for a photo. Seek qualified assessment; this prototype cannot assess safety or urgency.' : '');
  $('customer-safety').textContent=warning; $('customer-safety').hidden=!warning;
  updateProgress(plan);
}
function renderPhotos() {
  $('previews').replaceChildren(...photos.map((photo,index)=>{
    const figure=document.createElement('figure'), image=document.createElement('img'), caption=document.createElement('figcaption'), remove=document.createElement('button');
    image.src=photo.dataUrl; image.alt=`Attached photo ${index+1}, not analysed`;
    caption.textContent=`Photo ${index+1} · for visual inspection`;
    remove.type='button'; remove.textContent=`Remove photo ${index+1}`;
    remove.addEventListener('click',()=>{photos.splice(index,1);invalidate();renderPhotos();setError('photo-error');$('photos').focus();});
    figure.append(image,caption,remove);return figure;
  }));
  $('photo-status').textContent=photos.length ? `${photos.length} photo${photos.length===1?'':'s'} attached for human inspection.` : '';
}
function reset() {
  photoEpoch++; pendingPhotos=false; photos=[]; $('submit').disabled=false;
  $('form').reset();invalidate();renderPhotos();clearValidation();setError('photo-error');
  $('status').textContent='Enquiry cleared. No previous brief is available for review.';
  updateQuestions();$('enquiry').focus();
}
$('enquiry').addEventListener('input',()=>{invalidate();clearValidation();$('status').textContent='';updateQuestions();});
bindAnswerControls(answerControls,()=>{invalidate();clearValidation();updateQuestions();});
document.querySelectorAll('[data-example]').forEach(button=>button.addEventListener('click',()=>{
  reset();
  $('enquiry').value=({house:'I need someone to help with my house',kitchen:'something is broken in my kitchen',...examples})[button.dataset.example];
  $('status').textContent='';updateQuestions();$('enquiry').focus();
}));
$('clear').addEventListener('click',reset);
$('skip-photo').addEventListener('click',()=>{
  photoEpoch++; photos=[];pendingPhotos=false;$('submit').disabled=false;$('photos').value='';
  invalidate();renderPhotos();setError('photo-error');$('photo-status').textContent='Photos skipped. You can still submit your enquiry.';
  const target=groups.find(group=>!group.hidden)?.querySelector('input,select') || $('submit'); target.focus();
});
$('photos').addEventListener('change',async()=>{
  const files=[...$('photos').files];$('photos').value='';if(!files.length)return;
  setError('photo-error');
  try { validatePhotos(files,photos.length); }
  catch(error) { setError('photo-error',error.message);return; }
  const epoch=++photoEpoch; pendingPhotos=true;$('submit').disabled=true;invalidate();
  $('photo-status').textContent='Preparing local photo previews…';
  try {
    const prepared=await Promise.all(files.map(preparePhoto));
    if(epoch!==photoEpoch)return;
    photos.push(...prepared);renderPhotos();
  } catch(error) { if(epoch===photoEpoch){setError('photo-error',error.message);renderPhotos();} }
  finally {if(epoch===photoEpoch){pendingPhotos=false;$('submit').disabled=false;}}
});
$('form').addEventListener('submit',event=>{
  event.preventDefault();clearValidation();invalidate();
  const suppliedAnswers=answers(), invalid=validateAnswers(suppliedAnswers);
  if ($('enquiry').value.trim() && invalid) {
    setError('time-error',invalid.message);
    $(invalid.field).setAttribute('aria-invalid','true');
    $(invalid.field).focus();$(invalid.field).scrollIntoView({block:'center'});
    return;
  }
  try {
    if(pendingPhotos)throw new Error('Please wait for the photo previews, or continue without photos.');
    const brief=buildBrief($('enquiry').value,suppliedAnswers,visitTimingContext(suppliedAnswers));
    saveHandoff(storage(),brief,photos);
    window.location.assign('/review');
  } catch(error) {setError('error',error.message);$('enquiry').setAttribute('aria-invalid','true');$('error').scrollIntoView({block:'center'});$('enquiry').focus({preventScroll:true});}
});
// Back-forward cache must not resurrect a previously submitted or reset brief.
window.addEventListener('pageshow',event=>{if(event.persisted){invalidate();$('submit').disabled=false;updateQuestions();}});
updateQuestions();
