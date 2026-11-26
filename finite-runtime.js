'use strict';
/* Multi-language output in an opaque-origin frame with a time-limited worker. */
const runtimeModes=new Set(['javascript','typescript','python','lua','sql','json','yaml','xml','markdown','text','html','css']);
let runtimeActive=null;
function runtimeLabel(lang){return ['html','css'].includes(lang)?'Website preview':runtimeModes.has(lang)?'Run / inspect output':'Editor only — runtime not installed'}
async function runtimeWorkerMain(data){
 const lines=[];let size=0;const emit=(...args)=>{if(size>16000)return;const line=args.map(v=>{if(typeof v==='string')return v;try{return JSON.stringify(v)}catch{return String(v)}}).join(' ');lines.push(line.slice(0,4000));size+=line.length};
 const oldConsole=console;const log={log:emit,info:emit,warn:emit,error:emit,debug:emit,table:emit};
 const result=v=>{if(v!==undefined&&v!==null)emit(typeof v==='string'?v:JSON.stringify(v,null,2))};
 const {lang,code}=data;
 try{
 if(lang==='javascript'||lang==='typescript'){let js=code;if(lang==='typescript'){importScripts('https://cdnjs.cloudflare.com/ajax/libs/typescript/5.9.3/typescript.min.js');const out=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None},reportDiagnostics:true});const errors=(out.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error);if(errors.length)throw Error(errors.map(x=>ts.flattenDiagnosticMessageText(x.messageText,'\n')).join('\n'));js=out.outputText}self.console=log;await new Function('console','"use strict";\n'+js)(log)}
 else if(lang==='python'){importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');const py=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/',stdout:emit,stderr:emit});const v=await py.runPythonAsync(code);if(v!==undefined&&v!==null){emit(String(v));if(v.destroy)v.destroy()}}
 else if(lang==='lua'){const {LuaFactory}=await import('https://cdn.jsdelivr.net/npm/wasmoon@1.16.0/+esm');const factory=new LuaFactory('https://cdn.jsdelivr.net/npm/wasmoon@1.16.0/dist/glue.wasm');const lua=await factory.createEngine();try{lua.global.set('print',emit);result(await lua.doString(code))}finally{lua.global.close()}}
 else if(lang==='sql'){importScripts('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js');const SQL=await initSqlJs({locateFile:f=>'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/'+f});const db=new SQL.Database();try{const sets=db.exec(code);for(const s of sets){emit(s.columns.join(' | '));for(const row of s.values.slice(0,300))emit(row.join(' | '))}if(!sets.length)emit('SQL executed successfully. No result rows.')}finally{db.close()}}
 else if(lang==='json'){result(JSON.parse(code))}
 else if(lang==='yaml'){importScripts('https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js');result(jsyaml.load(code,{schema:jsyaml.JSON_SCHEMA}))}
 else throw Error('This language does not have a worker runtime.');
 return {ok:true,output:lines.join('\n').slice(0,16000)||'Finished successfully (no console output).'};
 }catch(e){return {ok:false,output:(lines.join('\n')+'\n'+String(e?.stack||e)).trim().slice(0,16000)}}finally{self.console=oldConsole}
}
function runtimeCancel(){if(runtimeActive)runtimeActive({ok:false,output:'Execution cancelled.'})}
function runtimeRun(lang,code){
 if(!runtimeModes.has(lang))return Promise.resolve({ok:false,output:'No compiler/interpreter is installed for '+(devLanguages[lang]?.[0]||lang)+'.'});
 if(lang==='text'||lang==='markdown')return Promise.resolve({ok:true,output:code||'(empty file)'});
 if(lang==='xml'){try{const doc=new DOMParser().parseFromString(code,'application/xml');const err=doc.querySelector('parsererror');return Promise.resolve({ok:!err,output:err?err.textContent:new XMLSerializer().serializeToString(doc)})}catch(e){return Promise.resolve({ok:false,output:String(e)})}}
 runtimeCancel();
 return new Promise(resolve=>{let frame,timer,done=false;const token='runtime-'+Math.random().toString(36).slice(2);
 const finish=val=>{if(done)return;done=true;clearTimeout(timer);window.removeEventListener('message',onMessage);frame?.remove();if(runtimeActive===finish)runtimeActive=null;resolve(val)};
 const onMessage=e=>{if(e.source===frame?.contentWindow&&e.data?.type==='finite-runtime-result'&&e.data.token===token){const v=e.data.result;finish({ok:v?.ok===true,output:String(v?.output||'No output.').slice(0,16000)})}};
 runtimeActive=finish;
 try{frame=document.createElement('iframe');frame.setAttribute('sandbox','allow-scripts');frame.setAttribute('referrerpolicy','no-referrer');frame.hidden=true;const workerSource='const run='+runtimeWorkerMain.toString()+';self.onmessage=async e=>{const send=self.postMessage.bind(self);send(await run(e.data))}';
 const payload=JSON.stringify({lang,code:code.slice(0,40000)}).replace(/</g,'\\u003c');const source=JSON.stringify(workerSource).replace(/</g,'\\u003c');
 const boot='const src='+source+';const data='+payload+';const token='+JSON.stringify(token)+';let w;const send=result=>parent.postMessage({type:"finite-runtime-result",token,result},"*");try{const url=URL.createObjectURL(new Blob([src],{type:"text/javascript"}));w=new Worker(url);w.onmessage=e=>{w.terminate();URL.revokeObjectURL(url);send(e.data)};w.onerror=e=>{w.terminate();URL.revokeObjectURL(url);send({ok:false,output:e.message||"Runtime could not start"})};w.postMessage(data)}catch(e){send({ok:false,output:String(e)})}';
 const policy="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; worker-src blob:; connect-src https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; form-action 'none'; base-uri 'none'";
 frame.srcdoc='<!doctype html><meta http-equiv="Content-Security-Policy" content="'+policy+'"><scr'+'ipt>'+boot+'</scr'+'ipt>';
 window.addEventListener('message',onMessage);timer=setTimeout(()=>finish({ok:false,output:'Execution timed out. Check loops or runtime download connectivity.'}),lang==='python'?45000:20000);document.body.appendChild(frame)
 }catch(e){finish({ok:false,output:'Runtime unavailable: '+String(e)})}
 })
}
function runtimeOutput(result){return '<pre class="studio-console '+(result.ok?'':'runtime-error')+'">'+safe(result.output)+'</pre>'}
