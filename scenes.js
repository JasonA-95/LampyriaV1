function storyQuestState(sv,id){const q=(sv.q||{})[id];if(!q)return'aucune';if(q.s==2)return'finie';return(q.n||0)>=(DATA.quetes[id]?.need||Infinity)?'prete':'cours'}
function storyCondition(condition,sv,flags){if(!condition)return true;const f=flags||sv.hist?.flags||{};
if(condition.flag&&!f[condition.flag])return false;if(condition.pasFlag&&f[condition.pasFlag])return false;
if(condition.renc&&sv.renc<(condition.renc.min||0))return false;if(condition.niv&&sv.niv<(condition.niv.min||0))return false;
if(condition.quete&&storyQuestState(sv,condition.quete.id)!=condition.quete.etat)return false;return true}
function storyTriggerMatches(definition,trigger){return !!definition&&Object.keys(definition).every(k=>definition[k]===trigger[k])}
function storySelect(scenes,trigger,sv,options={}){const seen=sv.hist?.vus||[],flags=options.flags||sv.hist?.flags||{};
return Object.entries(scenes).filter(([id,scene])=>storyTriggerMatches(scene.declencheur,trigger)&&storyCondition(scene.si,sv,flags)&&(!scene.once||options.test||!seen.includes(id))).map(([id])=>id)}
function storyMarkSeen(sv,id,test=false){if(test)return false;sv.hist=sv.hist||{vus:[],flags:{}};sv.hist.vus=sv.hist.vus||[];if(sv.hist.vus.includes(id))return false;sv.hist.vus.push(id);return true}
function storySetFlags(sv,runtimeFlags,values,test=false){for(const [key,value] of Object.entries(values||{}))runtimeFlags[key]=value;
if(!test){sv.hist=sv.hist||{vus:[],flags:{}};sv.hist.flags=sv.hist.flags||{};Object.assign(sv.hist.flags,values||{})}}
function storyChoiceTransition(currentId,currentIndex,choice){return choice.scene?{id:choice.scene,index:0,chained:true}:{id:currentId,index:currentIndex+1,chained:false}}
const STORY_LOGIC={questState:storyQuestState,condition:storyCondition,triggerMatches:storyTriggerMatches,select:storySelect,markSeen:storyMarkSeen,setFlags:storySetFlags,choiceTransition:storyChoiceTransition};

let STORY_RUN=null,STORY_TOKEN=0;
function storyPersist(){if(cfg.test||!STORY_RUN)return;sv.hist.active={frames:STORY_RUN.frames.map(f=>({id:f.id,index:f.index})),pending:STORY_RUN.pending.slice(),actors:EX.storyActors.map(a=>({...a})),group:EX.storyGroup||EX.group||null,resumeAction:STORY_RUN.resumeAction||null};store()}
function storyPush(id){const scene=DATA.scenes[id];if(!scene)return false;if(scene.once&&!cfg.test&&sv.hist.vus.includes(id))return false;
STORY_RUN.frames.push({id,index:0});storyMarkSeen(sv,id,cfg.test);storyPersist();return true}
function storySet(values){storySetFlags(sv,STORY_RUN.flags,values,cfg.test);if(!cfg.test)store()}
function storyEscape(text){return String(text||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function storyLimit(text,limit=140){if(limit<=0)return'';const chars=Array.from(String(text||''));return chars.length>limit?chars.slice(0,limit-1).join('')+'…':chars.join('')}
function storyAt(at){if(at&&typeof at=='object')return at;if(at=='hero'||!at)return{x:EX.x,y:EX.y};if(at=='groupe'){const q=EX.storyGroup||EX.group;return q?{x:q.x,y:q.y}:{x:EX.x,y:EX.y}}
if(typeof at=='string'&&at.startsWith('pnj:')){const p=(DATA.cartes[EX.map].npcs||[]).find(n=>n.n==at.slice(4));if(p)return{x:p.x,y:p.y}}
const actor=EX.storyActors.find(a=>a.id==at);return actor?{x:actor.x,y:actor.y}:{x:EX.x,y:EX.y}}
function storyPanel(step,waiting=false){const bar=$('bar'),foot=$('foot');bar.replaceChildren();bar.className=step&&step.choix?'talk':'';foot.replaceChildren();
if(step&&step.choix)step.choix.forEach(choice=>{const b=btn(storyLimit(choice.t),'','',()=>storyChoose(choice));bar.appendChild(b)});
if(!waiting&&!step?.choix)foot.appendChild(btn('Suivant ▸','','pri',storyNext));foot.appendChild(btn('Passer la scène','','ghost',storySkip,!!step?.choix||waiting))}
function storyPresent(step){if(step.hero){const heroText=storyLimit(step.hero,139),hero=storyEscape(heroText),action=storyEscape(storyLimit(step.act,139-Array.from(heroText).length));speak('Le héros','<span>'+hero+'</span><br><i>'+action+'</i>',{at:storyAt('hero'),stay:true})}
else speak(step.qui,storyEscape(storyLimit(step.txt)),{at:storyAt(step.at),stay:true});storyPanel(step)}
async function storyMove(actor,dest,token){while(actor.x!=dest.x||actor.y!=dest.y){await new Promise(r=>setTimeout(r,85));if(token!=STORY_TOKEN||!STORY_RUN)return;
if(actor.x!=dest.x)actor.x+=Math.sign(dest.x-actor.x);else actor.y+=Math.sign(dest.y-actor.y);EX.draw()}}
function storyFinish(){const after=STORY_RUN.after,resumeAction=STORY_RUN.resumeAction;STORY_RUN=null;EX.sceneActive=false;EX.storyActors=[];EX.storyGroup=null;hideBubble();if(!cfg.test){sv.hist.active=null;store()}
if(EX.on){EX.ui();EX.draw()}else if(C){ui();draw()}if(after)after();else if(resumeAction&&EX.storyResumeAction)EX.storyResumeAction(resumeAction)}
function storyCompleteFrame(){const run=STORY_RUN;if(!run)return;run.frames.pop();if(run.frames.length){storyPersist();storyRun();return}
while(run.pending.length){const next=run.pending.shift();if(storyPush(next)){storyRun();return}}
storyFinish()}
async function storyRun(){if(!STORY_RUN)return;const token=++STORY_TOKEN,frame=STORY_RUN.frames.at(-1),scene=DATA.scenes[frame.id];if(!scene){storyCompleteFrame();return}
while(STORY_RUN&&STORY_RUN.frames.at(-1)===frame){const step=scene.etapes[frame.index];if(!step){storyCompleteFrame();return}
if(!storyCondition(step.si,sv,STORY_RUN.flags)){frame.index++;storyPersist();continue}
if(step.choix){storyPanel(step);return}
if(step.qui||step.hero){storyPresent(step);storyPersist();return}
if(step.set){frame.index++;storySet(step.set);storyPersist();continue}
if(step.gain){frame.index++;if(!cfg.test)EX.gain(step.gain);storyPersist();continue}
if(step.apparait){EX.storyActors=EX.storyActors.filter(a=>a.id!=step.apparait.id);EX.storyActors.push({...step.apparait});frame.index++;storyPersist();EX.draw();continue}
if(step.deplace){const actor=EX.storyActors.find(a=>a.id==step.deplace.id);frame.index++;if(actor){STORY_RUN.moving=true;storyPanel(null,true);await storyMove(actor,step.deplace,token);if(token!=STORY_TOKEN||!STORY_RUN)return;STORY_RUN.moving=false}storyPersist();continue}
if(step.part){EX.storyActors=EX.storyActors.filter(a=>a.id!=step.part);frame.index++;storyPersist();EX.draw();continue}
frame.index++;storyPersist()}}
function storyStart(ids,after,resumeAction){if(STORY_RUN||!ids.length)return false;STORY_RUN={frames:[],pending:ids.slice(1),flags:{...sv.hist.flags},after:after||null,resumeAction:resumeAction||null};EX.storyActors=[];EX.sceneActive=true;
if(!storyPush(ids[0]))storyCompleteFrame();else storyRun();return true}
function storyResume(){const active=sv.hist.active;if(cfg.test||STORY_RUN||!active||!Array.isArray(active.frames)||!active.frames.length)return false;
const frames=active.frames.filter(f=>DATA.scenes[f.id]).map(f=>({id:f.id,index:Math.max(0,Math.floor(f.index||0))}));if(!frames.length)return false;
STORY_RUN={frames,pending:Array.isArray(active.pending)?active.pending.filter(id=>DATA.scenes[id]):[],flags:{...sv.hist.flags},after:null,resumeAction:active.resumeAction||null};EX.storyActors=Array.isArray(active.actors)?active.actors.filter(a=>a&&a.id).map(a=>({...a})):[];EX.storyGroup=active.group||null;EX.sceneActive=true;storyRun();return true}
function storyTrigger(trigger,after,resumeAction){const ids=storySelect(DATA.scenes,trigger,sv,{test:cfg.test,flags:STORY_RUN?STORY_RUN.flags:sv.hist.flags});if(STORY_RUN&&ids.length){STORY_RUN.pending.push(...ids);storyPersist();return true}if(ids.length)storyStart(ids,after,resumeAction);else if(after)after();return ids.length>0}
function storyPlay(id,after){if(!DATA.scenes[id])return false;return storyStart([id],after)}
function storyNext(){if(!STORY_RUN||STORY_RUN.moving)return;const frame=STORY_RUN.frames.at(-1),step=DATA.scenes[frame.id].etapes[frame.index];if(step&&step.choix)return;frame.index++;storyPersist();storyRun()}
function storyChoose(choice){if(!STORY_RUN)return;const frame=STORY_RUN.frames.at(-1),transition=storyChoiceTransition(frame.id,frame.index,choice);if(choice.set)storySet(choice.set);
if(transition.chained){frame.index++;storyPersist();if(storyPush(transition.id))storyRun();else storyRun();return}frame.index=transition.index;storyPersist();storyRun()}
function storySkip(){if(!STORY_RUN||STORY_RUN.moving)return;STORY_TOKEN++;const run=STORY_RUN;
while(run.frames.length){const frame=run.frames.at(-1),scene=DATA.scenes[frame.id];while(frame.index<scene.etapes.length){const step=scene.etapes[frame.index];if(storyCondition(step.si,sv,run.flags)){if(step.choix){storyPanel(step);return}if(step.set)storySet(step.set);if(step.gain&&!cfg.test)EX.gain(step.gain)}frame.index++;storyPersist()}
run.frames.pop();if(run.frames.length){storyPersist();continue}while(run.pending.length){const next=run.pending.shift();if(storyPush(next))break}if(!run.frames.length&&!run.pending.length){storyFinish();return}}
storyRun()}

if(typeof EX!='undefined'){EX.storyTrigger=storyTrigger;EX.storyPlay=storyPlay;EX.storyResume=storyResume;EX.storyNext=storyNext}