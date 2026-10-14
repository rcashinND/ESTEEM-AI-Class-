import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = {'/':'index.html', '/index.html':'index.html', '/app.js':'app.js', '/analysis.mjs':'analysis.mjs', '/style.css':'style.css'};
const types = {html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',mjs:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8'};
const server = http.createServer(async (req,res) => {
  const name=files[new URL(req.url,'http://localhost').pathname];
  if (!name || !['GET','HEAD'].includes(req.method)) {res.writeHead(404);res.end('Not found');return;}
  try {
    const body=await readFile(new URL(`./public/${name}`,import.meta.url));
    res.writeHead(200,{'Content-Type':types[name.split('.').pop()], 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer', 'Content-Security-Policy':"default-src 'self'; img-src 'self' blob:; style-src 'self'; script-src 'self'; connect-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"});
    res.end(req.method==='HEAD'?undefined:body);
  } catch {res.writeHead(500);res.end('Unable to open Trawd. Restart the app and try again.');}
});
server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Trawd is running. Open the web preview.'));
