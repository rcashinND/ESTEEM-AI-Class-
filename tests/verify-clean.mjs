import {mkdtempSync, cpSync, rmSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync, spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const source=resolve(process.argv[2] || '.');
const dir=mkdtempSync(join(tmpdir(),'trawd-clean-'));
let child;
try {
 for(const name of ['package.json','package-lock.json','server.mjs','public','tests','README.md','.replit','docs']) {
  if(existsSync(join(source,name)))cpSync(join(source,name),join(dir,name),{recursive:true});
 }
 console.log('Clean directory: copied only distributable source; no node_modules, secrets or workspace state.');
 for(const args of [['install'],['test']]) {
  console.log(`$ npm ${args.join(' ')}`);
  console.log(execFileSync('npm',args,{cwd:dir,encoding:'utf8',timeout:60000,stdio:['ignore','pipe','pipe']}));
 }
 console.log('$ PORT=0 npm start');
 child=spawn('npm',['start'],{cwd:dir,env:{...process.env,PORT:'0'},detached:true,stdio:['ignore','pipe','pipe']});
 let output='';
 const port=await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('Startup timeout')),15000);
  child.stdout.on('data',b=>{output+=b; const m=output.match(/running on port (\d+)/);if(m){clearTimeout(timer);resolve(Number(m[1]));}});
  child.on('exit',code=>{clearTimeout(timer);reject(new Error(`Early exit ${code}`));});
 });
 console.log(output.trim());
 for(const path of ['/','/app.js','/analysis.mjs','/rules.mjs','/style.css']){
  const r=await fetch(`http://127.0.0.1:${port}${path}`);assert.equal(r.status,200);console.log(`GET ${path} -> ${r.status}`);
 }
 console.log('PASS: fresh copy installation, tests, npm start, HTML and all module/style assets.');
} finally {
 if(child?.pid)try{process.kill(-child.pid,'SIGTERM');}catch{}
 rmSync(dir,{recursive:true,force:true});
}
