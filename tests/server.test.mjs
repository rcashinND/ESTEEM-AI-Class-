import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createServer} from '../server.mjs';

test('HTTP assets and private-path protection from an ephemeral server',async()=>{
 const server=createServer();server.listen(0,'127.0.0.1');await once(server,'listening');
 const base=`http://127.0.0.1:${server.address().port}`;
 try {
  for(const [path,type] of [['/','text/html'],['/customer','text/html'],['/review','text/html'],['/app.js','text/javascript'],['/review.js','text/javascript'],['/analysis.mjs','text/javascript'],['/rules.mjs','text/javascript'],['/workflow.mjs','text/javascript'],['/handoff.mjs','text/javascript'],['/photos.mjs','text/javascript'],['/form-controls.mjs','text/javascript'],['/style.css','text/css']]){
   const r=await fetch(base+path);assert.equal(r.status,200,path);assert.match(r.headers.get('content-type'),new RegExp(type));
   assert.ok((await r.text()).length>50);assert.equal(r.headers.get('cache-control'),'no-store');
  }
  const html=await (await fetch(base)).text();assert.match(html,/Simulated AI prototype/);assert.match(html,/19 November 2026/);
  for(const path of ['/server.mjs','/package.json','/.env','/README.md','/api/requests','/constructor','/toString','/__proto__'])assert.equal((await fetch(base+path)).status,404);
  assert.equal((await fetch(base,{method:'POST',body:'private enquiry'})).status,404);
  const head=await fetch(base,{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 }finally{await new Promise(resolve=>server.close(resolve));}
});

test('Customer and review routes are distinct pages, including direct review empty state',async()=>{
 const server=createServer();server.listen(0,'127.0.0.1');await once(server,'listening');
 const base=`http://127.0.0.1:${server.address().port}`;
 try {
  const customer=await(await fetch(base+'/customer')).text();
  const reviewResponse=await fetch(base+'/review');const review=await reviewResponse.text();
  assert.match(customer,/Submit enquiry/);assert.match(customer,/Attach photos \(optional\)/);
  assert.match(review,/No current enquiry to review/);assert.doesNotMatch(review,/<textarea|id="enquiry"|id="questions"/);
  assert.notEqual(customer,review);
  assert.match(reviewResponse.headers.get('content-security-policy'),/img-src 'self' blob: data:/);
  assert.match(reviewResponse.headers.get('content-security-policy'),/connect-src 'none'/);
  for(const path of ['/customer/','/review/'])assert.equal((await fetch(base+path)).status,200);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
