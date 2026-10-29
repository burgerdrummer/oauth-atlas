import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn,execFile} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);
fs.mkdirSync('.sites-runtime',{recursive:true});
const resultPath='.sites-runtime/launcher-result.json';
const report=v=>{fs.writeFileSync(resultPath,JSON.stringify({...v,at:new Date().toISOString()},null,2));console.log(v.message)};
const started=Date.now();
report({stage:'starting',message:'Starting OAuth Atlas and checking its actual address...'});
const output=fs.openSync('.sites-runtime/local-server.log','a');
const child=spawn(process.execPath,['scripts/serve-atlas.mjs'],{cwd:root,env:{...process.env,ATLAS_PORT:'0',ATLAS_OPEN_BROWSER:'0'},detached:true,windowsHide:true,stdio:['ignore',output,output]});
child.on('error',e=>report({stage:'failed',message:'Could not start the app: '+e.code}));child.unref();fs.closeSync(output);
let ready=false;
for(let i=0;i<30;i++){
 await new Promise(r=>setTimeout(r,500));
 let state;try{state=JSON.parse(fs.readFileSync('.sites-runtime/local-server.json','utf8'))}catch{continue}
 if(Date.parse(state.startedAt)<started||state.pid!==child.pid)continue;
 const url='http://127.0.0.1:'+state.port;
 try{const response=await fetch(url+'/__runtime',{signal:AbortSignal.timeout(1500)});if(!response.ok)continue;const runtime=await response.json();if(runtime.revision!=='bounded-research-v4')continue;
 report({stage:'ready',message:'App is responding at '+url,url,pid:child.pid,revision:runtime.revision});
 execFile('cmd.exe',['/c','start','',url],{windowsHide:true},()=>{});ready=true;break;
 }catch(e){report({stage:'checking',message:'Server started, but local connection failed: '+(e.cause?.code||e.name),port:state.port})}
}
if(!ready){report({stage:'failed',message:'The app did not pass its local connection check. Diagnostic saved for ChatGPT to inspect.'});process.exitCode=1}
