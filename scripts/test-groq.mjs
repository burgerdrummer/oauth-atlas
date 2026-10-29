import fs from 'node:fs';
import {fileURLToPath}from'node:url';
import path from'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);process.loadEnvFile('.env.local');
const {research}=await import('../src/research.mjs');
const {retrieveEvidence}=await import('../src/evidence.mjs');
console.log('Testing bounded public-document retrieval and guide generation. No model browser-search tool is used.');
const cacheDir=path.join(root,'.sites-runtime','research-cache');fs.mkdirSync(cacheDir,{recursive:true});
const cachePath=k=>{if(!/^[a-f0-9]{64}-(guide|evidence)$/.test(k))throw Error('Invalid cache key');return path.join(cacheDir,k+'.json')};
const env={GROQ_API_KEY:process.env.GROQ_API_KEY,GROQ_MODEL:process.env.GROQ_MODEL,GEMINI_API_KEY:process.env.GEMINI_API_KEY,GEMINI_MODEL:process.env.GEMINI_MODEL,cacheGet:async k=>{try{return JSON.parse(fs.readFileSync(cachePath(k),'utf8'))}catch{return null}},cacheSet:async(k,v)=>fs.writeFileSync(cachePath(k),JSON.stringify(v))};
env.retrieveEvidence=async(...args)=>{try{return await retrieveEvidence(...args)}catch(e){fs.writeFileSync(path.join(root,'.sites-runtime','retrieval-failure.json'),JSON.stringify({at:new Date().toISOString(),log:e.retrievalLog||[],message:e.message},null,2));throw e}};
if(!env.GROQ_API_KEY){console.log('Save GROQ_API_KEY in .env.local first.');process.exit(1)}
const app=process.argv[2]||'Asana';
const r=await research(new Request('https://atlas.test/api/research',{method:'POST',headers:{Origin:'https://atlas.test','Content-Type':'application/json'},body:JSON.stringify({app,purpose:'A web app where external users connect their accounts to read their own workspace data.',operation:'read',audience:'customers',authRoute:'custom'})}),env);
const result=await r.json();
fs.writeFileSync('groq-test-result.json',JSON.stringify({status:r.status,...result},null,2));
const guide=result.guide||result;
const incomplete=['research-gap','managed-check'].includes(guide.kind);
console.log(!r.ok?result.error:incomplete?'INCOMPLETE: An investigation checklist was returned; OAuth setup guidance still needs evidence.':'SUCCESS: A guide draft was generated. Audit its claims against sources before submission.');process.exitCode=r.ok&&!incomplete?0:1;
