import http from 'node:http';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {execFile} from 'node:child_process';
let port=Number(process.env.ATLAS_PORT||4173);
let worker,workerStamp;
async function currentWorker(){const file=path.resolve('worker/index.js');const stamp=(await fs.stat(file)).mtimeMs;if(stamp!==workerStamp){worker=(await import(pathToFileURL(file).href+'?revision='+stamp)).default;workerStamp=stamp}return worker}
async function environment(){let local={};try{for(const line of (await fs.readFile('.env.local','utf8')).split(/\r?\n/)){const i=line.indexOf('=');if(i>0)local[line.slice(0,i).trim()]=line.slice(i+1).trim().replace(/^['"]|['"]$/g,'')}}catch{}return Object.fromEntries(['GROQ_API_KEY','GROQ_MODEL','GEMINI_API_KEY','GEMINI_MODEL'].map(k=>[k,local[k]||process.env[k]]))}
const server=http.createServer(async(req,res)=>{try{
 const env=await environment();
 const cacheFile=k=>{if(!/^[a-f0-9]{64}-(guide|evidence)$/.test(k))throw Error('Invalid cache key');return path.join('.sites-runtime','research-cache',k+'.json')};
 env.cacheGet=async k=>{try{return JSON.parse(await fs.readFile(cacheFile(k),'utf8'))}catch{return null}};
 env.cacheSet=async(k,v)=>{await fs.mkdir('.sites-runtime/research-cache',{recursive:true});await fs.writeFile(cacheFile(k),JSON.stringify(v))};
 if(req.url==='/__runtime'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({revision:'bounded-research-v4',provider:env.GROQ_API_KEY?'groq':'gemini',port}));return}
 const headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(typeof v==='string')headers.set(k,v);
 let body;if(!['GET','HEAD'].includes(req.method)){body='';for await(const chunk of req){body+=chunk;if(body.length>10000){res.writeHead(413);res.end();return}}}
 const response=await (await currentWorker()).fetch(new Request('http://127.0.0.1:'+port+req.url,{method:req.method,headers,...(body?{body}:{})}),env);
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
}catch{res.writeHead(500);res.end('Local server could not complete this request.')}});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'App already running. Open http://127.0.0.1:'+port:'Server failed: '+e.code);process.exitCode=1});
server.listen(port,'127.0.0.1',async()=>{
 port=server.address().port;
 const url='http://127.0.0.1:'+port;
 console.log('OAuth Atlas v3 running at '+url+' - leave this window open.');
 await fs.mkdir('.sites-runtime',{recursive:true});await fs.writeFile('.sites-runtime/local-server.json',JSON.stringify({revision:'bounded-research-v4',port,pid:process.pid,startedAt:new Date().toISOString()}));
 if(process.env.ATLAS_OPEN_BROWSER==='1')execFile('cmd.exe',['/c','start','',url],{windowsHide:true},()=>{});
});
