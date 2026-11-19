import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createServer} from '../server.mjs';

test('HTTP assets and private-path protection from an ephemeral server',async()=>{
 const server=createServer();server.listen(0,'127.0.0.1');await once(server,'listening');
 const base=`http://127.0.0.1:${server.address().port}`;
 try {
  for(const [path,type] of [['/','text/html'],['/app.js','text/javascript'],['/analysis.mjs','text/javascript'],['/rules.mjs','text/javascript'],['/style.css','text/css']]){
   const r=await fetch(base+path);assert.equal(r.status,200,path);assert.match(r.headers.get('content-type'),new RegExp(type));
   assert.ok((await r.text()).length>50);assert.equal(r.headers.get('cache-control'),'no-store');
  }
  const html=await (await fetch(base)).text();assert.match(html,/Simulated AI prototype/);assert.match(html,/19 November 2026/);
  for(const path of ['/server.mjs','/package.json','/.env','/README.md','/api/requests','/constructor','/toString','/__proto__'])assert.equal((await fetch(base+path)).status,404);
  assert.equal((await fetch(base,{method:'POST',body:'private enquiry'})).status,404);
  const head=await fetch(base,{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 }finally{await new Promise(resolve=>server.close(resolve));}
});
