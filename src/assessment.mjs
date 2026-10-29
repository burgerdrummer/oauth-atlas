export function assessEvidence(app,pages,audience='customers'){
 const text=p=>(String(p.title||'')+' '+String(p.excerpt||'')).toLowerCase();
 let submittedHost;try{submittedHost=new URL(app.includes('://')?app:'https://'+app).hostname;if(!app.includes('.'))submittedHost=null}catch{}
 const words=app.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>2&&!['https','http','www','docs','developers','com'].includes(w));
 const identity=p=>submittedHost?new URL(p.url).hostname===submittedHost:words.some(w=>text(p).includes(w));
 const oauth=p=>/\boauth\b/.test(text(p))&&/authorization.?code|user.?delegat|on behalf|consent|user.{0,50}authoriz|authoriz.{0,50}user/.test(text(p));
 const definitions=[
  ['identity','Provider identity',identity,true],
  ['oauth','User-delegated OAuth',oauth,true],
  ['registration','App registration route',p=>oauth(p)&&/register|registration|creat.{0,30}app|client[_ -]?id|redirect/.test(text(p)),true],
  ['permissions','Permissions or scopes',p=>oauth(p)&&/scope|permission/.test(text(p)),true],
  ['external','External-user access requirements',p=>/external|public distribution|other workspaces|outside.{0,25}org|publish|approval|verification/.test(text(p)),audience==='customers']
 ];
 const checks=definitions.map(([id,label,test,required])=>{const page=pages.find(test);return {id,label,required,located:!!page,url:page?.url||null}});
 const missing=checks.filter(c=>c.id!=='external'&&!c.located);
 return {canGenerate:missing.length===0,checks,missing:missing.map(c=>c.label),note:'Coverage checks locate relevant text; they do not verify the claim or establish provider approval.'};
}
export function investigationGuide(app,pages,assessment,route='custom'){
 let name=app;try{if(app.includes('.'))name=new URL(app.includes('://')?app:'https://'+app).hostname}catch{}
 const managed=route==='managed';
 return {name,category:managed?'Managed auth check':'Research result',summary:managed?'Confirm managed-app coverage and permissions before registering a provider OAuth app. Coverage has not been verified.':'The retrieved evidence is insufficient for a reliable OAuth setup path. Complete these investigation steps before registration.',difficulty:'Unconfirmed',effort:'Unknown (not measured)',wait:'Unknown; provider and customer-admin requirements are not established.',audience:'The selected audience and intended action need to be checked against the providerâ€™s authentication and distribution rules.',prerequisites:['The exact provider and its official developer documentation.','A description of the intended operations and who needs to connect.'],steps:managed?[
 {title:'Check Composio managed-app coverage',body:'Look up this provider in Composioâ€™s current managed-auth directory. Confirm the authentication method, required permissions and any restrictions; listing or coverage is not established by this result.',where:'https://docs.composio.dev/toolkits/managed-auth',success:'You have confirmed whether a managed app supports the exact use case.',owner:'Developer',source:-1},
 {title:'Choose the supported authentication route',body:'Use the managed app only if its permissions, audience and branding meet the requirement. Otherwise return to custom-app research. Do not create duplicate OAuth credentials by default.',where:'Your integration configuration and the managed-auth documentation',success:'The managed versus custom decision has an explicit, checked basis.',owner:'Developer',source:-1},
 {title:'Test the intended connection',body:'Follow the confirmed route with a test account. Check consent, the intended action, and reconnection before inviting customers.',where:'Your test integration',success:'The intended action succeeds with the expected user and workspace permissions.',owner:'Developer and test user',source:-1}
 ]:[
 {title:'Confirm the provider and OAuth model',body:'Locate official documentation showing user-delegated OAuth. An API key, SSO login or server-only grant does not establish this path.',where:pages[0]?.url||'Official provider developer documentation',success:'The correct provider and user-delegated OAuth support are documented.',owner:'Developer or provider support',source:-1},
 {title:'Find the missing setup evidence',body:'Still missing: '+assessment.missing.join(', ')+'. Supply the exact OAuth documentation URL and rerun research; the current result does not establish registration instructions.',where:'Official OAuth and API permission references',success:'Core registration and permission requirements have a usable source.',owner:'Developer or provider support',source:-1},
 {title:'Resolve the external-access boundary',body:'Separate internal testing, external customers, customer-admin policy and optional directory listing. Ask the provider a specific question when the docs do not establish the answer.',where:'Provider distribution documentation or support',success:'Remaining launch blockers and their owners are explicit.',owner:'Developer and relevant workspace owner',source:-1}
 ],blockers:[{symptom:managed?'Managed-app coverage has not been checked':'Core OAuth setup evidence is incomplete',action:managed?'Check the current directory and permissions before choosing managed auth.':'Use the exact official OAuth documentation URL. Do not follow a guessed registration flow.',owner:'Developer',source:-1}],agent:['Locate public documentation and extract relevant requirements.','Prepare a concise question listing the missing evidence.'],human:['Confirm account access and provider identity.','Complete login, consent, and any external approvals if the route is established.'],uncertainty:[managed?'Managed-app coverage and permission fit remain unverified.':'No reliable registration path has been established from these excerpts.','No authenticated setup, consent, API action, or approval was tested.'],sources:pages.map(p=>({title:p.title,url:p.url})),next:managed?'Check Composio managed-auth coverage for this provider and intended action.':'Find the missing official OAuth documentation before configuring an app.',managed:'Check the current managed-auth directory; coverage is not assumed.',kind:managed?'managed-check':'research-gap'};
}

