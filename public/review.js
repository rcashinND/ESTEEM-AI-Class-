import {readHandoff,clearHandoff,HANDOFF_KEY} from './handoff.mjs';
const $=id=>document.getElementById(id);
function list(id,items) {
  $(id).replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
}
function render() {
  let payload;
  try {payload=readHandoff(window.sessionStorage);} catch {payload=null;}
  $('empty').hidden=!!payload; $('brief').hidden=!payload;
  $('reviewed').hidden=true;$('review').disabled=false;
  if(!payload){$('fields').replaceChildren();$('scope').replaceChildren();$('attachments').replaceChildren();return;}
  const brief=payload.summary;
  $('job-title').textContent=brief.job;$('brief-mode').textContent=brief.mode;$('uncertainty').textContent=brief.uncertainty;
  $('safety-warning').textContent=brief.safety;$('safety-warning').hidden=!brief.safety;
  const fields=[['trades','Suggested trades'],['area','General area'],['timing','Preferred timing'],['urgency','Urgency'],['concern','Known safety concerns'],['materials','Materials / availability']];
  $('fields').replaceChildren(...fields.map(([key,title])=>{
    const group=document.createElement('div'), dt=document.createElement('dt'), dd=document.createElement('dd');
    dt.textContent=title;dd.textContent=brief[key];group.append(dt,dd);return group;
  }));
  list('scope',brief.scope);list('follow-up',brief.followUp.length ? brief.followUp : ['Confirm access and practical arrangements directly with the customer.']);
  $('photo-notice').textContent=brief.photoNotice;$('review-photos').hidden=!payload.photos.length;
  $('attachments').replaceChildren(...payload.photos.map((photo,index)=>{
    const figure=document.createElement('figure'),image=document.createElement('img'),caption=document.createElement('figcaption');
    image.src=photo.dataUrl;image.alt=`Customer attachment ${index+1}, for human inspection only`;caption.textContent=`Photo ${index+1} · not analysed`;figure.append(image,caption);return figure;
  }));
}
$('review').addEventListener('click',()=>{$('reviewed').hidden=false;$('review').disabled=true;});
$('new-enquiry').addEventListener('click',()=>{try{clearHandoff(window.sessionStorage);}catch{}window.location.assign('/customer');});
window.addEventListener('pageshow',render);
window.addEventListener('storage',event=>{if(event.key===HANDOFF_KEY)render();});
setInterval(renderIfExpired,60000);
function renderIfExpired(){try{if(!readHandoff(window.sessionStorage))render();}catch{render();}}
render();
