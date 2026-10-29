function modelError(message,code,extra={}){return Object.assign(new Error(message),{code,...extra})}
export function validateGuide(value,schema){
 function valid(v,s,depth=0){if(depth>10)return false;if(s.type==='object')return !!v&&typeof v==='object'&&!Array.isArray(v)&&s.required.every(k=>Object.hasOwn(v,k))&&Object.entries(s.properties).every(([k,child])=>valid(v[k],child,depth+1));if(s.type==='array')return Array.isArray(v)&&v.length<=30&&v.every(x=>valid(x,s.items,depth+1));if(s.type==='integer')return Number.isInteger(v);return typeof v==='string'&&v.trim().length>0&&v.length<=8000}
 return valid(value,schema)&&value.steps.length>0&&value.steps.length<=10&&value.sources.length>0&&value.sources.length<=8&&value.uncertainty.length>0&&['Direct setup','Admin-dependent','Review-heavy','Unconfirmed'].includes(value.difficulty);
}
export async function formatGuide({env,schema,instructions,input,onDiagnostic=async()=>{}}){
 const keys=[env.GROQ_API_KEY,env.GEMINI_API_KEY].filter(Boolean);
 const clean=value=>{let text=String(value||'');for(const key of keys)text=text.replaceAll(key,'[redacted]');return text.replace(/(?:Bearer\s+|key=)[A-Za-z0-9._-]+/gi,'[redacted]').slice(0,900)};
 const options=[];if(env.GROQ_API_KEY){options.push(['groq',env.GROQ_MODEL||'openai/gpt-oss-20b']);options.push(['groq','openai/gpt-oss-120b'])}if(env.GEMINI_API_KEY)options.push(['gemini',env.GEMINI_MODEL||'gemini-3.5-flash']);
 const unique=options.filter(([p,m],i,a)=>a.findIndex(x=>x[0]===p&&x[1]===m)===i);
 const blocked=new Set();let attempts=0,last;
 async function note(provider,model,status,code,message){try{await onDiagnostic({at:new Date().toISOString(),provider,model,status,code,message:clean(message)})}catch{}}
 async function call(provider,model,compatibility=false){
  if(++attempts>4)throw modelError('The researcher exhausted its bounded recovery attempts. Sources are saved; try again later.','RECOVERY_LIMIT',{providerStatus:503});
  const system=instructions+(compatibility?'\nReturn a single JSON object matching this exact schema. No Markdown fences. JSON schema: '+JSON.stringify(schema):'');
  const headers=provider==='groq'?{'Content-Type':'application/json',Authorization:'Bearer '+env.GROQ_API_KEY}:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY};
  const payload=provider==='groq'?{model,messages:[{role:'system',content:system},{role:'user',content:input}],...(compatibility?{}:{reasoning_effort:'low'}),max_completion_tokens:2600,response_format:compatibility?{type:'json_object'}:{type:'json_schema',json_schema:{name:'oauth_guide',strict:true,schema}}}:{systemInstruction:{parts:[{text:system}]},contents:[{parts:[{text:input}]}],generationConfig:{maxOutputTokens:3500,...(compatibility?{responseMimeType:'application/json'}:{responseMimeType:'application/json',responseJsonSchema:schema})}};
  const endpoint=provider==='groq'?'https://api.groq.com/openai/v1/chat/completions':'https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent';
  let response;try{response=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify(payload),signal:AbortSignal.timeout(45000)})}catch(e){
   const timeout=e.name==='TimeoutError'||e.name==='AbortError';await note(provider,model,0,timeout?'TIMEOUT':'NETWORK',e.cause?.code||e.name);
   throw modelError(timeout?'The model timed out. Sources are saved; try again.':'The model service could not be reached. Sources are saved; try again later.',timeout?'MODEL_TIMEOUT':'MODEL_NETWORK',{providerStatus:503});
  }
  let data;try{data=await response.json()}catch{await note(provider,model,response.status,'INVALID_RESPONSE','Service returned a non-JSON response');throw modelError('The model service returned an unreadable response. Sources are saved.','MODEL_RESPONSE',{providerStatus:502})}
  if(!response.ok){
   const detail=data?.error||{},message=String(detail.message||'No provider explanation returned.'),code=String(detail.code||detail.status||'HTTP_'+response.status);
   await note(provider,model,response.status,code,message);
   const retryAfter=Number(response.headers.get('retry-after'))||Number(message.match(/try again in ([\d.]+)s/i)?.[1])||undefined;
   if(response.status===400&&!compatibility&&/schema|response.?format|json|structured|reasoning_effort/i.test(message+' '+code)&&attempts<4)return call(provider,model,true);
   if(response.status===401||response.status===403){blocked.add(provider);throw modelError('The configured model account rejected access. Sources are saved; the site owner needs to check model permissions.','MODEL_ACCESS',{providerStatus:response.status})}
   if(response.status===429)throw modelError('The available model allowance is temporarily exhausted. Sources are saved; retrying will reuse them.','MODEL_LIMIT',{providerStatus:429,retryAfter});
   if(response.status===400)throw modelError('The model rejected the guide-format request. Sources are saved and the diagnostic has been recorded.','MODEL_REQUEST',{providerStatus:400});
   throw modelError('The model service is unavailable. Sources are saved; try again later.','MODEL_UNAVAILABLE',{providerStatus:response.status});
  }
  let text;
  if(provider==='groq'){const choice=data.choices?.[0];if(choice?.finish_reason!=='stop'){await note(provider,model,200,'INCOMPLETE',choice?.finish_reason||'Missing choice');throw modelError('The model did not finish the guide. Sources are saved.','MODEL_INCOMPLETE',{providerStatus:422})}text=choice.message?.content}
  else{const candidate=data.candidates?.[0];if(candidate?.finishReason!=='STOP'){await note(provider,model,200,'INCOMPLETE',candidate?.finishReason||data.promptFeedback?.blockReason||'Missing candidate');throw modelError('The model did not finish the guide. Sources are saved.','MODEL_INCOMPLETE',{providerStatus:422})}text=candidate.content?.parts?.filter(p=>!p.thought&&p.text).map(p=>p.text).join('')}
  let guide;try{guide=JSON.parse(String(text||''))}catch{await note(provider,model,200,'INVALID_JSON','Guide could not be parsed');throw modelError('The model returned an invalid guide format. Sources are saved.','GUIDE_FORMAT',{providerStatus:422})}
  if(!validateGuide(guide,schema)){await note(provider,model,200,'INVALID_GUIDE','Required fields, field types, or supported classification are missing');throw modelError('The draft is incomplete or has invalid fields. Sources are saved; no guide was published.','GUIDE_INVALID',{providerStatus:422})}
  return guide;
 }
 for(const [provider,model]of unique){if(blocked.has(provider)||attempts>=4)continue;try{return await call(provider,model)}catch(e){last=e;const status=e.providerStatus;if(![400,401,403,404,408,422,429,500,502,503,504].includes(status))throw e}}
 throw last||modelError('No usable model service is configured. Existing guides remain available.','MODEL_CONFIG',{providerStatus:503});
}

