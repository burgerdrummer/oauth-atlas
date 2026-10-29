import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {assessEvidence}from'../src/assessment.mjs';
const raw=await fs.readFile('lib/guides.ts','utf8'),guides=JSON.parse(raw.slice(raw.indexOf('[')).trim().replace(/;$/,''));
const fixture=structuredClone(guides[0]);fixture.name='Example';
const pages=fixture.sources.map(s=>({...s,title:'Example developer documentation',excerpt:'Example supports OAuth authorization code for user-delegated access. Register an OAuth app with client_id and redirect_uri. Choose minimum read scopes. External access may depend on workspace approval.'}));
assert.equal(assessEvidence('Example',pages).canGenerate,true);
assert.equal(assessEvidence('Example',[{title:'Example',url:'https://example.com/docs',excerpt:'API keys and client credentials for server-only OAuth tokens.'}]).canGenerate,false);
const source=await fs.readFile('worker/index.js','utf8'),worker=(await import('data:text/javascript;base64,'+Buffer.from(source+'\n//product-acceptance').toString('base64'))).default;
const original=globalThis.fetch;let modelCalls=0;const payloads=[];
globalThis.fetch=async(_u,o)=>{modelCalls++;payloads.push(JSON.parse(o.body));return new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(fixture)}}]}))};
const env={GROQ_API_KEY:'controlled-key',retrieveEvidence:async app=>({provider:app,requests:2,pages:app==='Unknown'?[{title:'Unknown product docs',url:'https://example.com/docs',excerpt:'General product overview and API key authentication.'}]:pages})};
const request=body=>new Request('https://atlas.test/api/research',{method:'POST',headers:{Origin:'https://atlas.test','Content-Type':'application/json'},body:JSON.stringify(body)});
try{
 let r=await worker.fetch(request({app:'Example',audience:'everyone'}),env);assert.equal(r.status,400);
 r=await worker.fetch(request({app:'Example',operation:'specific'}),env);assert.equal(r.status,400);
 r=await worker.fetch(request({app:'Unknown',audience:'customers',operation:'read',authRoute:'custom'}),env);let result=await r.json();assert.equal(r.status,200);assert.equal(result.guide.kind,'research-gap');assert.equal(result.guide.assessment.canGenerate,false);assert.ok(result.guide.steps.every(s=>s.source===-1));assert.equal(modelCalls,0);
 r=await worker.fetch(request({app:'Example',audience:'customers',operation:'read',authRoute:'managed'}),env);result=await r.json();assert.equal(result.guide.kind,'managed-check');assert.equal(modelCalls,0);assert.ok(result.guide.summary.includes('not been verified'));
 for(const scenario of [{audience:'testing',operation:'read'},{audience:'customers',operation:'read'},{audience:'customers',operation:'write'}]){
  r=await worker.fetch(request({app:'Example',purpose:'Read issues',authRoute:'custom',...scenario}),env);result=await r.json();assert.equal(r.status,200);assert.equal(result.guide.requestContext.audience,scenario.audience);assert.equal(result.guide.requestContext.operation,scenario.operation);assert.equal(result.guide.assessment.canGenerate,true);
 }
 assert.equal(modelCalls,3);assert.equal(JSON.parse(payloads[0].messages[1].content).audience,'testing');assert.equal(JSON.parse(payloads[2].messages[1].content).operation,'write');
 r=await worker.fetch(request({app:'Example',purpose:'Read issues',audience:'testing',operation:'read',authRoute:'custom'}),env);assert.equal((await r.json()).reused,true);assert.equal(modelCalls,3);
}finally{globalThis.fetch=original}
console.log('PASS: scenario validation, specific-action requirement, no model call for incomplete evidence or managed-fit checks, scenario-separated cache keys, and audience/action passed into generation. Coverage signals are not semantic verification.');

