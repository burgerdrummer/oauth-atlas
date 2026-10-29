const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const raw=fs.readFileSync('lib/guides.ts','utf8');const GUIDES=JSON.parse(raw.slice(raw.indexOf('[')).trim().replace(/;$/,''));
const nodes=new Map();function node(k){if(!nodes.has(k))nodes.set(k,{innerHTML:'',textContent:'',fields:{app:'Controlled',purpose:'Read issues'},disabled:false,setAttribute(){},querySelectorAll(){return[]},querySelector(q){return node(k+' '+q)},addEventListener(){},focus(){},scrollIntoView(){},classList:{toggle(){},contains(){return false}}});return nodes.get(k)}
let resolveRequest;const globals={structuredClone,URL,URLSearchParams,AbortController,Response,GUIDES,document:{querySelector:node,querySelectorAll:()=>[],addEventListener(){},getElementById:node,activeElement:{tagName:'BODY'}},localStorage:{getItem:k=>k==='atlas-progress'?'null':null,setItem(){}},window:{addEventListener(){}},location:{search:'',hash:'',pathname:'/'},history:{pushState(){},replaceState(){}},scrollTo(){},setTimeout(){},console,btoa:s=>Buffer.from(s).toString('base64'),FormData:class{constructor(form){this.fields=form.fields}get(k){return this.fields[k]}},fetch:async()=>new Promise(resolve=>resolveRequest=resolve)};
const context=vm.createContext(globals);let client=fs.readFileSync('src/client.js','utf8');client=client.slice(0,client.indexOf("window.addEventListener('popstate',route);"));vm.runInContext(client,context);
(async()=>{
 assert.equal(vm.runInContext('state.done!==null && typeof state.done==="object"',context),true);
 vm.runInContext("state.configured=true;globalThis.testForm=document.querySelector('#research-form');globalThis.request=generate({preventDefault(){},target:testForm});",context);
 const pending=globals.request;vm.runInContext('closeModal()',context);
 const guide={...GUIDES[0],id:'research-stale'};
 resolveRequest(new Response(JSON.stringify({guide})));await pending;
 assert.equal(vm.runInContext('state.custom.length',context),0);assert.equal(vm.runInContext('state.busy',context),false);
 vm.runInContext('globalThis.request=generate({preventDefault(){},target:testForm});',context);
 resolveRequest(new Response(JSON.stringify({error:'Formatting failed.',evidenceSaved:true,diagnosticRef:'test-reference',retryAfter:65}),{status:502}));await globals.request;
 assert.ok(node('#research-error').innerHTML.includes('Retrieved sources are saved'));assert.ok(node('#research-error').innerHTML.includes('2 minutes'));assert.ok(node('#research-error').innerHTML.includes('test-reference'));assert.equal(node('#generate').disabled,false);assert.equal(node('#research-form').fields.app,'Controlled');
 console.log('PASS: malformed saved progress is ignored; closed research cannot save a late result; failed generation preserves inputs, source-reuse guidance, retry timing and enabled retry controls. DOM stubs do not verify browser rendering.');
})().catch(e=>{console.error(e);process.exitCode=1});

