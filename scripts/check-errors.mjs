import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {formatGuide,validateGuide}from'../src/models.mjs';
const research=await fs.readFile('src/research.mjs','utf8');
const schema=vm.runInNewContext(research.slice(0,research.indexOf('\nimport '))+';schema');
const guidesSource=await fs.readFile('lib/guides.ts','utf8');
const fixture=JSON.parse(guidesSource.slice(guidesSource.indexOf('[')).trim().replace(/;$/,'') )[0];
assert.ok(validateGuide(fixture,schema));
const success=()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(fixture)}}]}));
const failure=(status,code,message)=>new Response(JSON.stringify({error:{code,message}}),{status});
const original=globalThis.fetch;
const base={GROQ_API_KEY:'controlled-secret'};
const run=(env=base,onDiagnostic=async()=>{})=>formatGuide({env,schema,instructions:'Produce a sourced JSON guide.',input:'Controlled public source excerpts.',onDiagnostic});
try{
 let calls=[],diagnostics=[];
 globalThis.fetch=async(_u,o)=>{const p=JSON.parse(o.body);calls.push(p);return calls.length===1?failure(400,'json_validate_failed','JSON schema generation rejected controlled-secret'):success()};
 await run(base,async d=>diagnostics.push(d));assert.equal(calls.length,2);assert.equal(calls[0].response_format.type,'json_schema');assert.equal(calls[1].response_format.type,'json_object');assert.ok(!JSON.stringify(diagnostics).includes('controlled-secret'));assert.ok(calls[1].messages[0].content.includes('schema'));
 calls=[];
 globalThis.fetch=async(_u,o)=>{const p=JSON.parse(o.body);calls.push(p.model);return p.model==='openai/gpt-oss-20b'?failure(429,'rate_limit_exceeded','tokens per day exhausted'):success()};
 await run();assert.deepEqual(calls,['openai/gpt-oss-20b','openai/gpt-oss-120b']);
 calls=[];
 globalThis.fetch=async(u,o)=>{const p=JSON.parse(o.body);calls.push({u,p});if(u.includes('groq'))return failure(401,'invalid_api_key','Invalid credentials');return new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(fixture)}]}}]}))};
 await run({...base,GEMINI_API_KEY:'controlled-google'});assert.equal(calls.length,2);assert.ok(calls[1].u.includes('googleapis.com'));assert.equal(calls[1].p.tools,undefined);
 let count=0;
 globalThis.fetch=async()=>++count===1?new Response('<html>Service unavailable</html>',{status:503}):success();
 await run();assert.equal(count,2);
 count=0;
 globalThis.fetch=async()=>++count===1?new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:'not valid json'}}]})):success();
 await run();assert.equal(count,2);
 count=0;
 globalThis.fetch=async()=>++count===1?new Response(JSON.stringify({choices:[{finish_reason:'length',message:{content:'{}'}}]})):success();
 await run();assert.equal(count,2);
 count=0;
 globalThis.fetch=async()=>{count++;return failure(400,'json_validate_failed','Invalid JSON schema')};
 await assert.rejects(run({...base,GEMINI_API_KEY:'controlled-google'}));assert.equal(count,4);
 count=0;
 globalThis.fetch=async()=>{count++;return new Response(JSON.stringify({error:{code:'rate_limit_exceeded',message:'Try again in 15s.'}}),{status:429,headers:{'retry-after':'15'}})};
 await assert.rejects(run(),e=>e.code==='MODEL_LIMIT'&&e.retryAfter===15);assert.equal(count,2);
 const incomplete=structuredClone(fixture);incomplete.steps[0].owner=null;assert.equal(validateGuide(incomplete,schema),false);
 const hostile=structuredClone(fixture);hostile.sources='not an array';assert.equal(validateGuide(hostile,schema),false);
 // Integration: quota errors retain evidence and safe diagnostics without leaking credentials.
 const source=await fs.readFile('worker/index.js','utf8');
 const worker=(await import('data:text/javascript;base64,'+Buffer.from(source+'\n//error-integration').toString('base64'))).default;
 const records=new Map(),evidence={provider:'Controlled',requests:1,pages:fixture.sources.slice(0,3).map(s=>({...s,title:'Controlled OAuth documentation',excerpt:'Official OAuth registration for user consent. Scope and permission requirements.'}))};let reads=0;
 globalThis.fetch=async()=>failure(400,'json_validate_failed','Bad schema controlled-secret');
 const env={...base,retrieveEvidence:async()=>{reads++;return evidence},cacheGet:async k=>records.get(k),cacheSet:async(k,v)=>records.set(k,v)};
 const req=()=>new Request('https://atlas.test/api/research',{method:'POST',headers:{Origin:'https://atlas.test','Content-Type':'application/json'},body:JSON.stringify({app:'Controlled'})});
 let result=await worker.fetch(req(),env);assert.equal(result.status,502);const problem=await result.json();assert.equal(problem.evidenceSaved,true);assert.ok(problem.diagnosticRef);const saved=[...records.values()].find(v=>v.data.diagnostics);assert.ok(saved.data.pages.length);assert.ok(!JSON.stringify(saved).includes('controlled-secret'));
 globalThis.fetch=async()=>success();result=await worker.fetch(req(),env);assert.equal(result.status,200);assert.equal(reads,1);
 // Cache adapter failure cannot turn a valid generated guide into an application error.
 const cleanWorker=(await import('data:text/javascript;base64,'+Buffer.from(source+'\n//cache-failure').toString('base64'))).default;
 result=await cleanWorker.fetch(req(),{...env,cacheGet:async()=>{throw Error('disk unavailable')},cacheSet:async()=>{throw Error('disk unavailable')}});assert.equal(result.status,200);
}finally{globalThis.fetch=original}
console.log('PASS: structured-output HTTP 400 recovery, bounded failover, authentication rejection, non-JSON upstream responses, truncated/invalid drafts, quota metadata, redacted diagnostics, evidence reuse, and cache-storage failures. Controlled fixtures only; no live provider availability claim.');

