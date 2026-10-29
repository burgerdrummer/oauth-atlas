import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {retrieveEvidence,publicUrl} from '../src/evidence.mjs';
const source=await fs.readFile('worker/index.js','utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const request=(body={app:'Example',purpose:'Read tasks'},origin='https://atlas.test')=>new Request('https://atlas.test/api/research',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
let r=await worker.fetch(new Request('https://atlas.test/'),{});assert.equal(r.status,200);const html=await r.text(),script=html.match(/<script>([\s\S]*)<\/script>/)[1];new vm.Script(script);
assert.equal((await worker.fetch(request({},'https://hostile.test'),{})).status,403);
assert.equal((await worker.fetch(request(),{})).status,503);
assert.equal((await worker.fetch(request({app:123}),{})).status,400);
assert.equal((await worker.fetch(new Request('https://atlas.test/no-route'),{})).status,404);
for(const u of ['http://example.com','https://127.0.0.1','https://localhost','https://x.internal','https://example.com:8000','https://user:password@example.com'])assert.throws(()=>publicUrl(u));
const guideSource=await fs.readFile('lib/guides.ts','utf8');const guides=JSON.parse(guideSource.slice(guideSource.indexOf('[')).trim().replace(/;$/,''));
const fixture=JSON.parse(JSON.stringify(guides[0]));
const evidence={pages:fixture.sources.slice(0,4).map(s=>({...s,excerpt:'Official OAuth registration and user consent. Scope and external organization approval depend on account policy.'})),requests:4,limits:{maxPages:4,maxHttpRequests:8}};
const original=globalThis.fetch;let modelCalls=0,retrievalCalls=0;const storage=new Map();
const env={GROQ_API_KEY:'not-a-real-key',retrieveEvidence:async app=>{retrievalCalls++;return {...evidence,pages:evidence.pages.map(p=>({...p,title:app+' OAuth documentation'}))}},cacheGet:async k=>storage.get(k),cacheSet:async(k,v)=>storage.set(k,v)};
try{
 globalThis.fetch=async(url,opts)=>{modelCalls++;assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');const p=JSON.parse(opts.body);assert.equal(p.tools,undefined);assert.ok(p.max_completion_tokens<=2600);return new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(fixture)}}]}))};
 r=await worker.fetch(request(),env);assert.equal(r.status,200);assert.equal((await r.json()).guide.status,'AI draft');assert.equal(modelCalls,1);assert.equal(retrievalCalls,1);
 r=await worker.fetch(request(),env);assert.equal((await r.json()).reused,true);assert.equal(modelCalls,1);
 // A restarted Worker restores completed guides from the persistence adapter.
 const restarted=(await import('data:text/javascript;base64,'+Buffer.from(source+'\n//restart').toString('base64'))).default;
 r=await restarted.fetch(request(),env);assert.equal((await r.json()).reused,true);assert.equal(modelCalls,1);
 const originalUrl=fixture.sources[0].url;fixture.sources[0].url='https://forged.example/unretrieved';
 r=await worker.fetch(request({app:'Other'}),env);assert.equal(r.status,502);assert.ok((await r.json()).error.includes('source-integrity'));fixture.sources[0].url=originalUrl;
 // Failed generation retains retrieved evidence for the next request.
 const countBefore=retrievalCalls;globalThis.fetch=async()=>new Response('{}',{status:503});
 r=await worker.fetch(request({app:'Retry provider'}),env);assert.equal(r.status,502);assert.equal(retrievalCalls,countBefore+1);
 globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(fixture)}}]}));
 r=await worker.fetch(request({app:'Retry provider'}),env);assert.equal(r.status,200);assert.equal(retrievalCalls,countBefore+1);
 // Real retrieval code with controlled HTTP documents: discovery is never cited as evidence.
 let reads=0;globalThis.fetch=async url=>{reads++;if(String(url).includes('bing.com'))return new Response('<rss><channel><item><title>OAuth guide</title><link>https://docs.example.com/oauth</link></item></channel></rss>',{headers:{'Content-Type':'application/rss+xml'}});return new Response('<html><title>Provider OAuth</title><main>'+('OAuth registration requires a redirect URL. Review requirements depend on external audience. '.repeat(80))+'<script>DO_NOT_INCLUDE</script><a href="/approval">Approval</a></main></html>',{headers:{'Content-Type':'text/html'}})};
 const retrieved=await retrieveEvidence('Example');assert.ok(retrieved.pages.length>=1&&retrieved.pages.length<=4);assert.ok(reads<=8);assert.ok(retrieved.pages.every(p=>p.excerpt.length<=2200&&!p.excerpt.includes('DO_NOT_INCLUDE')&&!p.url.includes('bing.com')));
 // An exact documentation URL must work even when search is unavailable.
 const calls=[];globalThis.fetch=async url=>{calls.push(String(url));assert.ok(!String(url).includes('bing.com'));if(String(url)==='https://docs.example.com/start-here')return new Response('<main>'+('OAuth app registration, user consent, redirect URI and permissions. '.repeat(20))+'</main>',{headers:{'Content-Type':'text/html'}});return new Response('missing',{status:404})};
 const direct=await retrieveEvidence('https://docs.example.com/start-here');assert.equal(calls[0],'https://docs.example.com/start-here');assert.equal(direct.pages[0].url,calls[0]);
 // Provider home pages can link to a separate official developer subdomain.
 const subdomainCalls=[];globalThis.fetch=async url=>{url=String(url);subdomainCalls.push(url);if(url.includes('bing.com'))return new Response('<rss><item><link>https://www.sample.com/</link></item></rss>',{headers:{'Content-Type':'application/rss+xml'}});if(url==='https://www.sample.com/')return new Response('<html><main>Welcome to Sample. '+('Product workspace. '.repeat(12))+'<a href="https://developers.sample.com/authorization">Developer API</a></main></html>',{headers:{'Content-Type':'text/html'}});if(url==='https://developers.sample.com/authorization')return new Response('# Sample OAuth authorization\n'+('Register an app with redirect URI and user consent permissions. '.repeat(10)),{headers:{'Content-Type':'text/markdown'}});return new Response('missing',{status:404})};
 const cross=await retrieveEvidence('Sample');assert.ok(cross.pages.some(p=>p.url==='https://developers.sample.com/authorization'));assert.ok(!subdomainCalls.some(u=>u.endsWith('/developers')||u.endsWith('/docs')));
}finally{globalThis.fetch=original}
console.log('PASS: routes, input/origin checks, public-URL restrictions, bounded document retrieval, one model call without search tools, source integrity, persistent-cache restore, and evidence reuse after a failed generation. Controlled tests do not establish live retrieval quality or model availability.');
