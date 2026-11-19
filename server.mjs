import http from 'node:http';
import { readFile } from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const files = {'/':'index.html', '/index.html':'index.html', '/app.js':'app.js', '/analysis.mjs':'analysis.mjs', '/rules.mjs':'rules.mjs', '/style.css':'style.css'};
const types = {html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',mjs:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8'};
export function createServer() { return http.createServer(async (req,res) => {
  const name=files[new URL(req.url,'http://localhost').pathname];
  if (!name || !['GET','HEAD'].includes(req.method)) {res.writeHead(404);res.end('Not found');return;}
  try {
    const body=await readFile(new URL(`./public/${name}`,import.meta.url));
    // Allow Replit's embedded preview; retain the no-network/no-form policy.
    res.writeHead(200,{'Content-Type':types[name.split('.').pop()], 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer', 'Content-Security-Policy':"default-src 'self'; img-src 'self' blob:; style-src 'self'; script-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'"});
    res.end(req.method==='HEAD'?undefined:body);
  } catch {res.writeHead(500);res.end('Unable to open Trawd. Restart the app and try again.');}
}); }
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
 const port = process.env.PORT === undefined ? 3000 : Number(process.env.PORT);
 if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be an integer from 0 to 65535.');
 const server = createServer();
 server.on('error', error => { console.error(`Trawd startup failed: ${error.code || 'server error'}`); process.exitCode=1; });
 server.listen(port,'0.0.0.0',()=>console.log(`Trawd revision 2026-11-19 running on port ${server.address().port}.`));
}
