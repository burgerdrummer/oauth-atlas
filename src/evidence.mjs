const blockedHost=h=>h==='localhost'||!h.includes('.')||/^[\d.]+$/.test(h)||h.includes(':')||/\.(local|internal|localhost|test|invalid)$/.test(h);
export function publicUrl(value){const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port&&u.port!=='443'||blockedHost(u.hostname.toLowerCase()))throw Error('Use a public HTTPS provider website.');u.hash='';return u.href}
const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)));
const hostFamily=h=>h.toLowerCase().replace(/^(www|developers?|docs|api)\./,'');
const relatedHost=(a,b)=>hostFamily(a)===hostFamily(b);
function extract(html){html=html.replace(/<(script|style)\b[^>]*>[\s\S]*?(?:<\/\1>|$)/gi,' ');const main=html.match(/<(?:main|article)\b[^>]*>([\s\S]*?)<\/(?:main|article)>/i)?.[1]||html;return decode(main.replace(/<(script|style|nav|header|footer)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')).trim()}
function excerpt(text){if(text.length<=2200)return text;const chunks=text.match(/.{1,550}(?:\s|$)/g)||[text];const ranked=chunks.map((text,index)=>({text,index,score:(text.match(/oauth|approval|review|scope|redirect|publish|verification|refresh|consent|register/gi)||[]).length})).sort((a,b)=>b.score-a.score).slice(0,3).sort((a,b)=>a.index-b.index);return (text.slice(0,350)+'\n[Selected excerpts]\n'+ranked.map(x=>x.text).join('\n[Ã¢â‚¬Â¦]\n')).slice(0,2200)}
export async function retrieveEvidence(app,purpose=''){
 const log=[],pages=[],seen=new Set();let requests=0;
 async function read(value){let target=publicUrl(value);for(let redirects=0;redirects<3;redirects++){
  if(++requests>8)throw Error('Retrieval request budget reached.');
  const r=await fetch(target,{headers:{Accept:'text/markdown,text/html,application/xhtml+xml,text/plain,application/rss+xml','User-Agent':'OAuthAtlasResearch/1.0'},redirect:'manual',signal:AbortSignal.timeout(12000)});
  if(r.status>=300&&r.status<400){const location=r.headers.get('location');if(!location)throw Error('Redirect has no destination.');target=publicUrl(new URL(location,target).href);continue}
  if(!r.ok)throw Error('HTTP '+r.status);
  const kind=r.headers.get('content-type')||'';if(!/text|html|xml|json/i.test(kind))throw Error('Unsupported document format.');
  const reader=r.body.getReader();let chunks=[],length=0;while(true){const {value,done}=await reader.read();if(done)break;length+=value.length;if(length>600000){await reader.cancel();break}chunks.push(value)}const bytes=new Uint8Array(chunks.reduce((n,v)=>n+v.length,0));let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}return {url:target,html:new TextDecoder().decode(bytes)};
 }throw Error('Too many redirects.')}
 let seed;try{if(/^https?:\/\//i.test(app)||/^[\w.-]+\.[a-z]{2,}(?:\/|$)/i.test(app))seed=publicUrl(/^https:/i.test(app)?app:'https://'+app)}catch{throw Error('Enter a public HTTPS provider website.')}
 const query=app+' OAuth app registration approval official developer documentation';let candidates=[];
 try{if(!seed){const search=await read('https://www.bing.com/search?format=rss&q='+encodeURIComponent(query));for(const item of search.html.matchAll(/<item>([\s\S]*?)<\/item>/gi)){const title=decode(item[1].match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'Provider documentation');const link=decode(item[1].match(/<link>([\s\S]*?)<\/link>/i)?.[1]||'');try{candidates.push({url:publicUrl(link),title})}catch{}}log.push('One public search request; search snippets are discovery only, not evidence.')}}catch(e){log.push('Search discovery unavailable: '+e.message)}
 if(seed)candidates.unshift({url:seed,title:'Submitted provider website'});
 const topic=/oauth|authorization|authenticat|approval|publish|scope|developer/i;
 candidates=candidates.map((c,i)=>({...c,score:(topic.test(c.url)?4:0)+(/developer|docs|api\./i.test(c.url)?3:0)+(seed&&new URL(c.url).hostname.endsWith(new URL(seed).hostname)?2:0),i})).sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,6);
 const providerOrigin=seed?new URL(seed).origin:candidates.find(c=>!/(github\.com|wikipedia\.org|reddit\.com)/i.test(new URL(c.url).hostname))?.url;
 if(providerOrigin){const host=new URL(providerOrigin).hostname;candidates=candidates.filter(c=>relatedHost(new URL(c.url).hostname,host));}
 if(!candidates.length&&!seed){const slug=app.toLowerCase().replace(/[^a-z0-9-]/g,'');if(slug)candidates=[{url:'https://'+slug+'.com',title:'Candidate provider website (identity must be confirmed)'}]}
 const rank=url=>{if(seed&&url===seed)return 100;const u=new URL(url),v=u.pathname.toLowerCase();if(/\/(settings|login|signup|oauth\/authorize)(\/|$)/.test(v)||u.search)return -100;if(/oauth.*(?:2.?0|authentication)|oauth$|\/oauth\//.test(v))return 40;if(/approval|verification|publish|distribution/.test(v))return 30;if(/actor|manifest|file-storage/.test(v))return 5;if(/oauth|authentication|authorization/.test(v))return 20;if(/developer|docs/.test(v))return 10;return 0};
 for(let i=0;i<candidates.length&&pages.length<4&&requests<8;i++){
  const remaining=candidates.slice(i).sort((a,b)=>rank(b.url)-rank(a.url));candidates.splice(i,candidates.length-i,...remaining);
  const candidate=candidates[i];if(rank(candidate.url)<0)continue;if(seen.has(candidate.url))continue;seen.add(candidate.url);
  try{const document=await read(candidate.url),text=/<(?:html|main|article|body)\b/i.test(document.html)?extract(document.html):document.html.replace(/\s+/g,' ').trim();if(text.length<120){log.push(candidate.url+': insufficient readable content');continue}
   const relevant=/oauth|authorization code|register.{0,30}app|developer documentation|api reference/i.test(text);
   if(!relevant){log.push(candidate.url+': no OAuth/API setup content; skipped');}
   if(relevant)pages.push({title:decode(document.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||candidate.title).slice(0,160),url:document.url,excerpt:excerpt(text),retrievedAt:new Date().toISOString(),method:'Public HTTP retrieval; no console interaction'});
   if(pages.length<4){const links=[...document.html.matchAll(/href=["']([^"']+)["']/gi)].map(x=>x[1]).filter(h=>topic.test(h)).sort((a,b)=>(/oauth|authenticat/i.test(b)?3:/approval|publish/i.test(b)?2:1)-(/oauth|authenticat/i.test(a)?3:/approval|publish/i.test(a)?2:1)).slice(0,10).reverse();for(const link of links){try{const url=publicUrl(new URL(decode(link),document.url).href);if(!seen.has(url)&&relatedHost(new URL(url).hostname,new URL(document.url).hostname)&&!candidates.some(c=>c.url===url))candidates.splice(i+1,0,{url,title:'Linked provider documentation'})}catch{}}}
  }catch(e){log.push(candidate.url+': '+e.message)}
 }
 if(!pages.length)throw Error('No readable public documentation was retrieved. Try the providerÃ¢â‚¬â„¢s exact developer-documentation URL. No guide was invented.');
 return {pages,log,requests,provider:app,purpose,retrievedAt:new Date().toISOString(),limits:{maxPages:4,maxHttpRequests:8,maxExcerptCharacters:8800}};
}
