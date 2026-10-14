import {examples,analyse} from './analysis.mjs';
const $=id=>document.getElementById(id);
let urls=[];
function clearPhotos(){urls.forEach(URL.revokeObjectURL);urls=[];$('photos').value='';$('previews').replaceChildren();$('photo-error').hidden=true;}
function invalidate(){ $('result').hidden=true;$('empty').hidden=false;$('reviewed').hidden=true;$('review').disabled=false;$('error').hidden=true;clearPhotos();$('counter').textContent=`${$('enquiry').value.length} / 4,000`; }
$('enquiry').addEventListener('input',invalidate);
document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{$('enquiry').value=examples[b.dataset.example];invalidate();$('enquiry').focus();}));
$('clear').addEventListener('click',()=>{$('enquiry').value='';invalidate();$('enquiry').focus();});
function list(id,items){$(id).replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));}
$('form').addEventListener('submit',e=>{e.preventDefault();invalidate();try{
 const lead=analyse($('enquiry').value);
 $('mode').textContent=lead.fixture?'Prepared response · simulated AI':'Unsupported message · manual review needed';
 $('uncertainty').textContent=lead.note;
 $('safety').textContent=lead.safety;$('safety').hidden=!lead.safety;
 $('summary').textContent=lead.summary;
 $('fields').replaceChildren(...[['trade','Likely trade(s)'],['job','Job type'],['location','Location'],['timing','Timing'],['urgency','Urgency'],['scope','Scope']].map(([key,label])=>{const d=document.createElement('div');const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=lead[key];d.append(dt,dd);return d;}));
 list('details',lead.details);list('missing',lead.missing);
 $('photo-section').hidden=!lead.photo;$('result').hidden=false;$('empty').hidden=true;$('result-heading').focus();
 }catch(err){$('error').textContent=err.message;$('error').hidden=false;$('enquiry').focus();}});
$('review').addEventListener('click',()=>{$('reviewed').hidden=false;$('review').disabled=true;});
$('photos').addEventListener('change',()=>{const files=[...$('photos').files];clearPhotos();if(files.length>3||files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>5*1024*1024)){$('photo-error').textContent='Choose up to 3 JPEG, PNG or WebP files, each no larger than 5 MB.';$('photo-error').hidden=false;return;}files.forEach((f,i)=>{const url=URL.createObjectURL(f);urls.push(url);const figure=document.createElement('figure');const img=document.createElement('img');img.src=url;img.alt=`Local photo preview ${i+1}`;img.addEventListener('error',()=>{figure.remove();$('photo-error').textContent='A selected file could not be displayed. Please choose a valid image.';$('photo-error').hidden=false;});const caption=document.createElement('figcaption');caption.textContent=f.name;figure.append(img,caption);$('previews').append(figure);});});
