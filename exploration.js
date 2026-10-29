// EXPLORATION : cartes du monde, déplacement, récolte, rencontres. Utilise la grille et le style de affichage.js.
const EX={on:false,map:null,x:0,y:0,avatar:{},groups:[],nodes:[],pend:null,tok:0,steps:0,group:null,walking:false,sceneActive:false,storyActors:[],storyGroup:null};
const exK=(x,y)=>x+','+y,qs=()=>sv.q=sv.q||{};
const exLock=e=>{const t=DATA.cartes[e.to];if(sv.renc<t.need)return 'Passage fermé : bats d\'abord les monstres de cette zone.';if(e.cle&&!sv.hist.flags[e.cle]&&sv.renc<=t.need)return e.why;return DJ.lock(e)};
const exStory=(trigger,after)=>EX.storyTrigger?EX.storyTrigger(trigger,after):after&&after();
function exBlock(){const d=DATA.cartes[EX.map],s=new Set(d.rocks.map(r=>exK(r[0],r[1])));
EX.groups.forEach(q=>{if(!q.dead)s.add(exK(q.x,q.y))});EX.nodes.forEach(n=>s.add(exK(n.x,n.y)));
d.npcs.forEach(n=>s.add(exK(n.x,n.y)));d.exits.forEach(e=>s.add(exK(e.x,e.y)));return s}
function exEnt(x,y){const d=DATA.cartes[EX.map];
const q=EX.groups.find(q=>!q.dead&&q.x==x&&q.y==y);if(q)return{t:'g',o:q};
const n=EX.nodes.find(n=>n.x==x&&n.y==y);if(n)return{t:'n',o:n};
const p=d.npcs.find(n=>n.x==x&&n.y==y);if(p)return{t:'p',o:p};
const e=d.exits.find(e=>e.x==x&&e.y==y);if(e)return{t:'e',o:e};return null}
function exPath(tx,ty,ent){const N=DATA.taille,B=exBlock(),near=ent&&ent.t!='e',
goal=(x,y)=>near?Math.abs(x-tx)+Math.abs(y-ty)==1:(x==tx&&y==ty);
if(goal(EX.x,EX.y))return[];
const p={},d={[exK(EX.x,EX.y)]:1},q=[[EX.x,EX.y]];let end=null;
while(q.length&&!end){const [x,y]=q.shift();for(const [a,b] of DIRS){const nx=x+a,ny=y+b,k=exK(nx,ny);
if(!DATA.in(nx,ny)||d[k])continue;
if(B.has(k)&&!(ent&&ent.t=='e'&&nx==tx&&ny==ty))continue;
d[k]=1;p[k]=[x,y];if(goal(nx,ny)){end=[nx,ny];break}q.push([nx,ny])}}
if(!end)return null;const r=[];let c=end;while(c&&!(c[0]==EX.x&&c[1]==EX.y)){r.unshift(c);c=p[exK(c[0],c[1])]}return r}
// Masque les PNJ dont une condition de 'cache' est vraie (ex. le Général après sa défaite).
function exPrune(){for(const m of Object.values(DATA.cartes)){if(!m._npcs)m._npcs=m.npcs.slice();m.npcs=m._npcs.filter(n=>!(n.cache||[]).some(c=>storyCondition(c,sv,sv.hist.flags)))}}
// Repères de quête de la carte (objets à ramasser, cachettes) : recalculés depuis l'état des quêtes, sans toucher aux monstres vaincus ni aux récoltes en cours.
EX.marks=name=>{const d=DATA.cartes[name],Q=qs(),on=(p,i)=>{const s=Q[p.quest];return s&&s.s==1&&!(s.got||[]).includes(name+i)};EX.pend=null;EX.nodes=EX.nodes.filter(n=>!n.pick);EX.groups=EX.groups.filter(q=>!q.hide);
(d.picks||[]).forEach((p,i)=>{if(on(p,i))EX.nodes.push({x:p.x,y:p.y,pick:1,quest:p.quest,id:name+i,until:0})});
(d.hides||[]).forEach((p,i)=>{if(on(p,i))EX.groups.push({x:p.x,y:p.y,renc:p.renc,hide:1,quest:p.quest,id:name+i})})};
EX.atelier=()=>(DATA.cartes[EX.map]||{}).atelier||null;
EX.enter=(name,x,y,quiet=false)=>{exPrune();sv.hist.flags['vu_'+name]=true;const d=DATA.cartes[name],previous=EX.map,chg=previous!==name;if(chg)EX.avatar={};EX.map=name;sv.map=name;if(!quiet)store();if(chg&&previous)setTimeout(()=>{if(!EX.sceneActive)startScreenTransition(d.n)},0);
EX.x=x??d.start[0];EX.y=y??d.start[1];EX.groups=d.groups.map(q=>({...q}));EX.nodes=d.nodes.map(n=>({...n,until:0}));EX.marks(name);(d.coffres||[]).forEach(c=>{if(sv.deb.includes('farceuse')&&!sv.hist.flags['coffre_'+name])EX.nodes.push({x:c.x,y:c.y,coffre:1,res:c.res,id:name,until:0})});if(chg&&W)resetView()}
EX.start=options=>{options=options||{};DJ.guard();const entering=EX.map!==(sv.map||'village');hideBubble();EX.on=true;EX.tok++;EX.walking=false;EX.group=null;hideMenu();closeModal();$('game').classList.remove('hide');size();
if(entering)EX.enter(sv.map||'village',undefined,undefined,!!(options.storyId&&cfg.test));resetView();
$('tip').textContent='Touche une case, puis touche-la encore pour y aller.';
msg('Tu es : '+DATA.cartes[EX.map].n+'.');EX.ui();EX.draw();if(options.storyId)EX.storyPlay(options.storyId);else if(!EX.storyResume()&&entering)EX.storyTrigger({quand:'entree',carte:EX.map})};
EX.hud=()=>{$('hud').innerHTML='<span class="chip">'+DATA.cartes[EX.map].n+'</span>'+DJ.chips()+'<span class="chip">Niv '+sv.niv+(sv.niv<XP.max?' · '+Math.round(100*XP.part(sv))+'%':' max')+'</span>'};
EX.ui=()=>{exPrune();const foes=$('foes');if(foes){foes.replaceChildren();foes.classList.add('hide')}EX.hud();$('bar').innerHTML='';$('bar').className='';const F=$('foot');F.innerHTML='';EX.dock(F)};
EX.gain=r=>{let t='';const xp=r.xpq?XP.quete(r.xpq[0],XP.k[r.xpq[1]]||XP.k.normale):r.xp;if(xp){const lv=XP.add(sv,xp);t+=' +'+xp+' XP';if(lv){t+=' Niveau '+sv.niv+' !';if(typeof playSound=='function')playSound('level')}}
for(const k in (r.res||{})){sv.res[k]+=r.res[k];t+=' +'+r.res[k]+' '+DATA.res[k].split(' ')[0]}
if(r.item&&!sv.inv.includes(r.item)){sv.inv.push(r.item);autoEquip(r.item);t+=' '+DATA.objets[r.item].n+' !'}
for(const k in (r.set||{}))sv.hist.flags[k]=r.set[k];if(r.renc!=null&&sv.renc==r.renc&&sv.renc<DATA.rencontres.length-1)sv.renc++;
if(r.lueur&&!sv.deb.includes(r.lueur)){sv.deb.push(r.lueur);t+=' Nouvelle Lueur : '+DATA.lueurs[r.lueur].n+' !'}store();return t};
EX.prog=(id,cell)=>{const s=qs()[id],q=DATA.quetes[id];if(!s||s.s!=1||(s.n||0)>=q.need)return;s.got=s.got||[];if(cell)s.got.push(cell);s.n=(s.n||0)+1;store();
const t='Quête « '+q.n+' » : '+s.n+'/'+q.need+(s.n>=q.need?'. Retourne voir '+(q.donneur||'le Maître Lampiste')+'.':'.');msg(t);toast(t)};
EX.npcMark=p=>{const Q=qs();let m='';for(const id of (p.quests||[])){const q=DATA.quetes[id],s=Q[id];if(!q)continue;if(s&&s.s==1&&(s.n||0)>=q.need&&(!q.cost||Object.keys(q.cost).every(k=>sv.res[k]>=q.cost[k])))return'?';if(!s&&(q.req||0)<=sv.renc&&(!q.apres||(Q[q.apres]||{}).s==2))m='!'}return m};
EX.talkNormal=p=>{const Q=qs(),B=[],variant=(p.variantes||[]).find(v=>storyCondition(v.si,sv,sv.hist.flags));let t=variant?variant.txt:p.txt;
(p.quests||[]).forEach(id=>{const q=DATA.quetes[id],s=Q[id];
if(!s){if((q.req||0)<=sv.renc&&(!q.apres||(Q[q.apres]||{}).s==2))B.push(['Accepter : '+q.n,q.desc,false,()=>{Q[id]={s:1,n:0,got:[]};store();EX.marks(EX.map);exStory({quand:'quete',id,etat:'acceptee'},()=>{speak(p.n,q.say,{at:{x:p.x,y:p.y}});EX.ui();EX.draw();toast('Quête acceptée : '+q.n)})},''])}
else if(s.s==1){const ok=s.n>=q.need,afford=!q.cost||Object.keys(q.cost).every(k=>sv.res[k]>=q.cost[k]);
if(ok)B.push(['Terminer : '+q.n,q.cost?'coût : '+rl(q.cost):'récompense','pri',()=>{
if(q.cost)Object.keys(q.cost).forEach(k=>sv.res[k]-=q.cost[k]);s.s=2;const g=EX.gain(q.rew);EX.marks(EX.map);exStory({quand:'quete',id,etat:'terminee'},()=>{speak(p.n,q.fin,{at:{x:p.x,y:p.y}});msg('Quête terminée !'+g);toast('Quête terminée !'+g);EX.ui();EX.draw()})},!afford])
else t+=' ('+q.n+' : '+s.n+'/'+q.need+')'}});
(p.actions||[]).forEach(a=>{if(a.si&&!storyCondition(a.si,sv,sv.hist.flags))return;const ok=!a.ok||storyCondition(a.ok,sv,sv.hist.flags);
B.push([a.t,ok?a.sub:a.why,a.cls||'',()=>{if(a.fight!=null){EX.fightNpc(a.fight,p);return}if(a.open){openMenu(a.open);return}const g=a.rew?EX.gain(a.rew):'';EX.storyTrigger({quand:'action',id:a.id},()=>{EX.ui();EX.draw();if(g){msg(g.trim());toast(g.trim())}})},!ok])});
(p.trade||[]).forEach(tr=>{const lab=o=>Object.keys(o).map(k=>o[k]+' '+DATA.res[k].split(' ')[0]).join(' '),ok=Object.keys(tr.give).every(k=>sv.res[k]>=tr.give[k]);
B.push(['Échanger '+lab(tr.give),'contre '+lab(tr.get),'',()=>{Object.keys(tr.give).forEach(k=>sv.res[k]-=tr.give[k]);Object.keys(tr.get).forEach(k=>sv.res[k]+=tr.get[k]);store();EX.talk(p)},!ok])});
if(p.zaap)(DATA.zaaps||[]).filter(z=>z!=EX.map&&sv.hist.flags['vu_'+z]).forEach(z=>B.push(['Voyager : '+DATA.cartes[z].n,'Gratuit : tu as déjà visité ce lieu','',()=>{hideBubble();EX.enter(z);msg('Tu voyages : '+DATA.cartes[z].n+'.');EX.ui();EX.draw();EX.storyTrigger({quand:'entree',carte:EX.map})}]));
speak(p.n,t,{at:{x:p.x,y:p.y},stay:true});EX.hud();$('bar').innerHTML='';$('bar').className='talk';B.forEach(b=>mk(b[0],b[1],b[2],b[3],b[4]));const F=$('foot');F.innerHTML='';F.appendChild(btn('Fermer','','pri',()=>{hideBubble();EX.ui();EX.draw()}));msg('')};
// Livraison : parler au destinataire d'une quête 'livre' active valide l'objectif.
EX.deliver=p=>{const id=Object.keys(DATA.quetes).find(k=>{const q=DATA.quetes[k],s=qs()[k];return q.kind=='livre'&&[].concat(q.to).includes(p.n)&&s&&s.s==1&&!(s.got||[]).includes(p.n)&&(s.n||0)<q.need});if(!id)return false;
const q=DATA.quetes[id],line=typeof q.recu=='object'?q.recu[p.n]:q.recu;EX.prog(id,p.n);const played=EX.storyTrigger({quand:'livraison',id},()=>{EX.ui();EX.draw()});if(!played){speak(p.n,line,{at:{x:p.x,y:p.y}});EX.ui();EX.draw()}return true};
EX.talk=p=>exStory({quand:'parle',pnj:p.n},()=>{if(!EX.deliver(p))EX.talkNormal(p)});
EX.click=e=>{if(EX.walking)return;const rc=cv.getBoundingClientRect(),a=(e.clientX-rc.left-ox)/(tw/2),b=(e.clientY-rc.top-oy)/(th/2),
x=Math.round((a+b)/2),y=Math.round((b-a)/2),N=DATA.taille,d=DATA.cartes[EX.map];
if(EX.sceneActive){EX.storyNext();return}if(!DATA.in(x,y)||(x==EX.x&&y==EX.y))return;
if(d.rocks.some(r=>r[0]==x&&r[1]==y)){EX.pend=null;msg('Un rocher bloque le passage.');EX.draw();return}
const ent=exEnt(x,y);
if(ent&&ent.t=='e'&&!cfg.test&&exLock(ent.o)){EX.pend=null;msg(exLock(ent.o));EX.draw();return}
const path=exPath(x,y,ent);if(!path){EX.pend=null;msg('Aucun chemin vers cette case.');EX.draw();return}
if(!EX.pend||EX.pend.x!=x||EX.pend.y!=y){EX.pend={x,y,ent,path};
msg(!ent?'Touche encore la case pour t\'y rendre ('+path.length+' cases).':ent.t=='g'?'Groupe de monstres : touche encore pour engager le combat.':ent.t=='n'?'Ressource : touche encore pour la récolter.':ent.t=='p'?'Touche encore pour parler à '+ent.o.n+'.':'Touche encore pour '+(ent.o.don?'entrer dans '+ent.o.lbl+' ('+ent.o.nv+')':'partir vers '+DATA.cartes[ent.o.to].n)+'.'+DJ.warn(ent.o));EX.draw();return}
EX.pend=null;EX.go(path,ent)};
EX.go=async(path,ent)=>{const t=++EX.tok;EX.walking=true;
for(const [px,py] of path){await new Promise(r=>setTimeout(r,130));if(t!=EX.tok)return;
const from={x:EX.x,y:EX.y};EX.face={right:(px-py)>(from.x-from.y),back:(px+py)<(from.x+from.y)};EX.x=px;EX.y=py;EX.steps++;if(typeof playSound=='function')playSound('step');animateUnitMove(EX.avatar,from,{x:px,y:py},new Set(DATA.cartes[EX.map].rocks.map(r=>exK(r[0],r[1]))));EX.draw()}
EX.walking=false;if(!ent){msg('');return}
if(ent.t=='n')EX.harvest(ent.o);else if(ent.t=='p')EX.talk(ent.o)
else if(ent.t=='e'){const e=DJ.pass(ent.o);EX.enter(e.to,e.tx,e.ty);msg('Tu entres : '+DATA.cartes[e.to].n+'.'+DJ.note);EX.ui();EX.draw();EX.storyTrigger({quand:'entree',carte:EX.map})}
else EX.fight(ent.o)};
EX.harvest=n=>{if(n.coffre){EX.nodes=EX.nodes.filter(z=>z!==n);sv.hist.flags['coffre_'+n.id]=true;const t=[];for(const k in n.res){sv.res[k]+=n.res[k];t.push('+'+n.res[k]+' '+rn(k))}store();pop(n,'Coffre secret !','#ffe08a');if(typeof playSound=='function')playSound('harvest');msg('Coffre de la Farceuse : '+t.join(', '));EX.ui();EX.draw();return}
if(n.pick){EX.nodes=EX.nodes.filter(z=>z!==n);EX.prog(n.quest,n.id);pop(n,'Trouvé !','#ffe08a');if(typeof playSound=='function')playSound('harvest');EX.draw();return}
if(n.until>EX.steps){msg('Déjà cueilli : ça repoussera bientôt.');return}
const k=n.res;sv.res[k]+=2;n.until=EX.steps+30;store();pop(n,'+2 '+DATA.res[k].split(' ')[0],'#7fd18b');if(typeof playSound=='function')playSound('harvest');msg('Récolte : +2 '+DATA.res[k]);EX.ui();EX.draw()};
EX.fight=q=>{const begin=()=>{EX.walking=false;EX.on=false;EX.pend=null;EX.group=q;cfg.renc=q.renc;hideMenu();$('game').classList.remove('hide');startScreenTransition();init()};EX.storyGroup=q;EX.storyTrigger({quand:'avantCombat',renc:q.renc},begin,{kind:'fight',x:q.x,y:q.y,renc:q.renc})};
EX.fightNpc=(i,p)=>EX.fight({x:p.x,y:p.y,renc:i,npc:1});
EX.storyResumeAction=action=>{if(action.kind!='fight')return;const q=EX.groups.find(g=>!g.dead&&g.x==action.x&&g.y==action.y&&g.renc==action.renc);if(q)EX.fight(q)};
// Défi de combat : une quête 'win' avec defi:{tours:N} ne progresse que si la victoire arrive au tour N au plus.
EX.defi=renc=>{const b=DATA.rencontres[renc].base??renc,id=Object.keys(DATA.quetes).find(k=>{const q=DATA.quetes[k];return q.defi&&q.kind=='win'&&q.renc==b&&(qs()[k]||{}).s==1});return id?DATA.quetes[id]:null};
EX.defiMiss=(id,turns)=>{const q=DATA.quetes[id],s=qs()[id];return !!(q&&q.defi&&s&&s.s==1&&turns!=null&&turns>q.defi.tours)};
EX.back=(res,turns)=>{const g0=EX.group;if(res=='win'&&g0)g0.dead=true;if(res=='lose'){sv.map='village';sv.dj=null;store();EX.map=null}
const djm=res=='win'&&g0?DJ.after():'';EX.start();
if(res=='lose')msg('Tu te réveilles au village, sans rien avoir perdu.');
else if(g0){if(g0.hide)EX.prog(g0.quest,g0.id);
Object.keys(DATA.quetes).forEach(id=>{const q=DATA.quetes[id];if(q.kind=='win'&&q.renc==(DATA.rencontres[g0.renc].base??g0.renc)&&!g0.hide){if(EX.defiMiss(id,turns))toast('Défi manqué : gagne en '+q.defi.tours+' tours maximum.');else EX.prog(id)}})}
if(res=='win'){const rr=g0?g0.renc:cfg.renc;sv.hist.flags['vaincu_'+(DATA.rencontres[rr].base??rr)]=true;store()}
if(djm)msg(djm);EX.hud();if(g0)EX.storyGroup=g0;EX.storyTrigger({quand:'apresCombat',renc:g0?g0.renc:cfg.renc,issue:res});if(!EX.sceneActive)startScreenTransition()};
EX.draw=()=>{const N=DATA.taille,d=DATA.cartes[EX.map],rocks=new Set(d.rocks.map(r=>exK(r[0],r[1]))),avatar=displayPosition(EX.avatar,EX.x,EX.y,rocks);cam(avatar.x,avatar.y);g.clearRect(0,0,W,H);
const pp={},ex={},E={};
if(EX.pend&&EX.pend.path)EX.pend.path.forEach(t=>pp[exK(t[0],t[1])]=1);
d.exits.forEach(e=>ex[exK(e.x,e.y)]=e);
EX.groups.forEach(q=>{if(!q.dead)E[exK(q.x,q.y)]=q.hide?{e:'🌿',b:'?',visual:q}:{e:DATA.rencontres[q.renc].m[0].e,n:DATA.rencontres[q.renc].m[0].n,b:'×'+DATA.rencontres[q.renc].m.length,visual:q}});
EX.nodes.forEach(n=>E[exK(n.x,n.y)]={e:n.pick?((DATA.quetes[n.quest]||{}).ico||'🏮'):n.coffre?'🎁':DATA.resE[n.res],a:n.until>EX.steps?.25:1,visual:n});
d.npcs.forEach(n=>E[exK(n.x,n.y)]={e:n.e,n:n.n,npc:1,visual:n});
EX.storyActors.forEach(a=>E[exK(a.x,a.y)]={e:a.e,visual:a});
E[exK(EX.x,EX.y)]={e:heroEmoji(),visual:EX.avatar};
g.textAlign='center';g.textBaseline='middle';g.font=Math.round(tw*.7)+'px serif';
const occupied=new Set(rocks);Object.keys(E).forEach(k=>occupied.add(k));d.npcs.forEach(n=>occupied.add(exK(n.x,n.y)));d.exits.forEach(e=>occupied.add(exK(e.x,e.y)));
(d.picks||[]).forEach(p=>occupied.add(exK(p.x,p.y)));(d.hides||[]).forEach(p=>occupied.add(exK(p.x,p.y)));
const excluded=new Set([exK(d.start[0],d.start[1]),...d.exits.map(e=>exK(e.x,e.y))]),biome=d.biome,
decor=OPT.fx=='off'?[]:terrainDecorCells(N,biome,occupied,excluded,DATA.decor[biome]),decorAt=new Map(decor.map(item=>[exK(item.x,item.y),item]));
fillOuter(biome,N);for(const [x,y] of DATA.cells){const k=exK(x,y),cx=(x-y)*tw/2+ox,cy=(x+y)*th/2+oy,l=Math.max(0,1-Math.hypot(x-avatar.x,y-avatar.y)/7)*((x+y)%2?.9:1);
if(OPT.fx=='off')dia(cx,cy,col(l));else tuile(g,cx,cy,tw,th,biome,x,y,l);const detail=decorAt.get(k);if(detail)drawTerrainDecor(g,cx,cy,tw,th,biome,detail)}
for(const [x,y] of DATA.cells){const k=exK(x,y),cx=(x-y)*tw/2+ox,cy=(x+y)*th/2+oy;
if(d.tint)dia(cx,cy,d.tint);if(ex[k])dia(cx,cy,exLock(ex[k])?'rgba(120,120,140,.45)':'rgba(255,180,84,.45)');
if(pp[k])dia(cx,cy,'rgba(255,240,170,.55)');if(EX.pend&&EX.pend.x==x&&EX.pend.y==y)dia(cx,cy,'rgba(255,240,170,.35)');
if(rocks.has(k)){if(OPT.fx=='off'){g.fillStyle='#fff';g.fillText('🪨',cx,cy-th*.15)}else drawTerrainObstacle(g,cx,cy,tw,th,biome,x,y)}}
const hx=(EX.x-EX.y)*tw/2+ox,hy=(EX.x+EX.y)*th/2+oy,gr=g.createRadialGradient(hx,hy,0,hx,hy,tw*3);
gr.addColorStop(0,'rgba(255,180,84,.28)');gr.addColorStop(1,'rgba(255,180,84,0)');
g.globalCompositeOperation='lighter';g.fillStyle=gr;g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';
for(const exit of d.exits){const cx=(exit.x-exit.y)*tw/2+ox,cy=(exit.x+exit.y)*th/2+oy;g.fillStyle='#fff';g.font=Math.round(tw*.7)+'px serif';g.fillText(exit.don?'🕳️':({W:'⬅️',E:'➡️',N:'⬆️',S:'⬇️'})[exit.d]||'➡️',cx,cy-th*.1);
if(exit.don){const f=Math.round(tw*.3),up=exit.d=='S'?1:0,y0=cy+(up?-th*1.15:th*.75);g.font='bold '+f+'px sans-serif';g.lineWidth=3;g.strokeStyle='#000';g.lineJoin='round';g.fillStyle=exit.don?'#ffd27a':'#e8e4f5';
const ls=exit.don?[exit.lbl,exit.nv]:[exit.lbl];ls.forEach((t,i)=>{const yy=y0+(up?-(ls.length-1-i):i)*f*1.15;g.strokeText(t,cx,yy);g.fillText(t,cx,yy)})}}
drawDisplayEffects(g,tw,th,ox,oy);
for(const key of Object.keys(E)){const u=E[key],[x,y]=key.split(',').map(Number),visual=u.visual||u,p=displayPosition(visual,x,y,rocks),style=displayUnitStyle(visual,undefined,tw,th),cx=(p.x-p.y)*tw/2+ox+style.x,cy=(p.x+p.y)*th/2+oy+style.y;const isH=visual===EX.avatar,sk=isH?SPR.heroKey():(u.npc||(u.b&&u.b!='?')?SPR.monKey(u.n):null);let ok=false;g.save();g.globalAlpha=(u.a??1)*style.alpha;drawGroundShadow(g,cx,cy,tw,th,u.b?1.1:1);g.translate(cx,cy);g.scale(style.scale,style.scale);g.fillStyle='#fff';g.font=Math.round(tw*.7)+'px serif';if(sk){const f=isH?(EX.face||{right:true,back:false}):{right:(EX.x-EX.y)>=(x-y),back:(EX.x+EX.y)<(x+y)};ok=SPR.drawKey(g,sk,f.right,f.back,tw,th)}if(!ok)g.fillText(u.e,0,-th*.3);g.restore();
if(u.npc){const mk=EX.npcMark(visual);g.save();g.textAlign='center';g.lineJoin='round';if(mk){g.font='bold '+Math.round(tw*.5)+'px Georgia,serif';g.lineWidth=4;g.strokeStyle='#120d1a';g.shadowColor='#ffd24a';g.shadowBlur=ok?10:0;const my=cy-th*(ok?3.3:1.5);g.strokeText(mk,cx,my);g.fillStyle='#ffd24a';g.fillText(mk,cx,my)}g.shadowBlur=0;g.font='600 '+Math.max(9,Math.round(tw*.2))+'px system-ui,sans-serif';g.lineWidth=3;g.strokeStyle='#120d1a';g.fillStyle='#f3e9d8';g.strokeText(u.n,cx,cy+th*.55);g.fillText(u.n,cx,cy+th*.55);g.restore()}
if(u.b){g.font='bold '+Math.round(tw*.3)+'px Georgia,serif';g.lineWidth=3;g.strokeStyle='#120d1a';g.strokeText(u.b,cx+tw*.3,cy-th*(ok?1.8:.7));g.fillStyle='#ffb454';g.fillText(u.b,cx+tw*.3,cy-th*(ok?1.8:.7))}}
drawDisplayTexts(g,tw,th,ox,oy);updateDisplayTransition();placeBubble();syncAmbience()};

// ===== Minicarte du monde : zones découvertes, donjons, boss, quêtes =====
EX.carteNode=()=>{const L=DATA.monde,C=DATA.cartes,R=DATA.rencontres,F=sv.hist.flags,Q=qs(),vu=k=>!!F['vu_'+k],show=k=>vu(k)||C[k].exits.some(e=>vu(e.to)),ks=Object.keys(L).filter(show),
BC={village:'#d49a4a',foret:'#3f8f5a',collines:'#7f9fd0',manoir:'#8a50aa',marais:'#7a8070',roseliere:'#5a9a90',serre:'#9a8fa8',desert:'#d4a850',temple:'#e0c070',citadelle:'#8a4a9a',trone:'#5a6a85'},
dj=k=>/^(terrier|enclos|archives|reves|pyr|crypte)\d$/.test(k),bs=r=>R[r].base??r,
niv=k=>{const v=(C[k].groups||[]).map(g=>R[g.renc].niv);return v.length?Math.min(...v)==Math.max(...v)?'niv '+v[0]:'niv '+Math.min(...v)+'-'+Math.max(...v):''},
boss=k=>(C[k].groups||[]).some(g=>R[g.renc].n.includes('boss')&&!F['vaincu_'+bs(g.renc)]),
marks=k=>{const m=C[k],o=[];if(k=='village')o.push('🏠');if(m.exits.some(e=>e.don))o.push('🕳️');if(boss(k))o.push('💀');
const act=Object.keys(Q).filter(id=>Q[id].s==1&&DATA.quetes[id]);
if((m.npcs||[]).some(n=>(n.quests||[]).some(id=>{const q=DATA.quetes[id];return q&&!Q[id]&&(q.req||0)<=sv.renc&&(!q.apres||(Q[q.apres]||{}).s==2)})))o.push('❗');
if(act.some(id=>{const q=DATA.quetes[id];return(m.npcs||[]).some(n=>n.n==q.donneur||[].concat(q.to||[]).includes(n.n))||(m.picks||[]).concat(m.hides||[]).some(p=>p.quest==id)||(q.kind=='win'&&(m.groups||[]).some(g=>bs(g.renc)==q.renc))}))o.push('🎯');return o},
xs=ks.map(k=>L[k][0]),ys=ks.map(k=>L[k][1]),x0=Math.min(...xs),y0=Math.min(...ys),S=56,
cv2=el('canvas'),g2=cv2.getContext('2d'),info=el('p'),view={x:0,y:0,z:1},ptr=new Map(),reduce=!!(matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);
cv2.style.cssText='position:static;inset:auto;width:100%;height:100%;display:block;touch-action:none;cursor:grab';
const wr=el('div');wr.style.cssText='position:relative;height:min(48vh,340px);overflow:hidden;border-radius:12px;border:1px solid #6b5236;background:#1a120f;margin:8px 0';
const P=k=>[(L[k][0]-x0)*S*1.6+S/2,(L[k][1]-y0)*S*1.6+S/2],
say=k=>{const m=C[k],mk=marks(k);info.innerHTML='<b>'+(vu(k)?m.n:'Zone inconnue')+'</b>'+(vu(k)&&niv(k)?' · '+niv(k):'')+(k==EX.map?' · 📍 tu es ici':'')+(vu(k)&&mk.length?'<br>'+mk.join(' '):'')+(vu(k)&&m.exits.some(e=>e.don)?'<br>Entrée : '+m.exits.find(e=>e.don).lbl+' ('+m.exits.find(e=>e.don).nv+')':'')},
hash=n=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)},
mix=(a,b)=>{const h=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)||0);return'rgb('+h(a).map((v,i)=>Math.round((v+h(b)[i])/2)).join(',')+')'},
colOf=k=>vu(k)?BC[C[k].biome]||'#6a5a8a':'#3a3358',
size=()=>{const d=Math.min(2,window.devicePixelRatio||1),w=wr.clientWidth,h=wr.clientHeight;if(!w||!h)return false;if(cv2.width!=Math.round(w*d)||cv2.height!=Math.round(h*d)){cv2.width=Math.round(w*d);cv2.height=Math.round(h*d)}return d},
draw=t=>{const d=size();if(!d)return;g2.setTransform(1,0,0,1,0,0);const W=cv2.width,H=cv2.height,bg=g2.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.7);bg.addColorStop(0,'#241a3a');bg.addColorStop(1,'#0c0814');g2.fillStyle=bg;g2.fillRect(0,0,W,H);
g2.fillStyle='#fff';for(let i=0;i<46;i++){g2.globalAlpha=.15+.35*hash(i+.5)*(reduce?1:.6+.4*Math.sin(t/700+i));g2.beginPath();g2.arc(hash(i)*W,hash(i+99)*H,(.6+hash(i+7))*d,0,7);g2.fill()}g2.globalAlpha=1;
g2.setTransform(d*view.z,0,0,d*view.z,d*view.x,d*view.y);g2.lineCap='round';g2.textAlign='center';g2.textBaseline='middle';
for(const k of ks)for(const e of C[k].exits)if(show(e.to)&&k<e.to){const a=P(k),b=P(e.to),lk=exLock(e)||exLock(C[e.to].exits.find(x=>x.to==k)||{to:k});
if(lk){g2.strokeStyle='#6a6478';g2.setLineDash([S/9,S/9])}else{const gr=g2.createLinearGradient(a[0],a[1],b[0],b[1]);gr.addColorStop(0,colOf(k));gr.addColorStop(1,colOf(e.to));g2.strokeStyle=gr;g2.setLineDash([])}
g2.lineWidth=S/8;g2.beginPath();g2.moveTo(a[0],a[1]);g2.lineTo(b[0],b[1]);g2.stroke()}
g2.setLineDash([]);
for(const k of ks){const[cx,cy]=P(k),w=S*.72,v=vu(k),c=colOf(k);g2.save();g2.shadowColor=v?c:'transparent';g2.shadowBlur=v?S*.35:0;
const gr=g2.createLinearGradient(cx,cy-w/2,cx,cy+w/2);gr.addColorStop(0,v?mix(c,'#ffffff'):'#332c4e');gr.addColorStop(1,v?c:'#221d38');g2.fillStyle=gr;g2.globalAlpha=v?(dj(k)?.8:1):.8;
g2.beginPath();g2.roundRect?g2.roundRect(cx-w/2,cy-w/2,w,w,S/6):g2.rect(cx-w/2,cy-w/2,w,w);g2.fill();g2.restore();
g2.lineWidth=dj(k)?2.5:1.5;g2.strokeStyle=dj(k)?'#d9534f':'#0009';g2.stroke();
g2.font=Math.round(S*.34)+'px serif';g2.fillStyle='#fff';if(!v)g2.fillText('?',cx,cy);else{const mk=marks(k);mk.slice(0,4).forEach((x,i,a)=>g2.fillText(x,cx+(a.length>1?(i%2?1:-1)*S*.18:0),cy+(a.length>2?(i<2?-1:1)*S*.18:0)))}
if(v&&view.z>=.9){g2.font='600 '+Math.round(S*.2)+'px system-ui,sans-serif';g2.fillStyle='#f3e9d8cc';g2.fillText(C[k].n.length>15?C[k].n.slice(0,14)+'…':C[k].n,cx,cy+w/2+S*.17)}
if(k==EX.map){const p=reduce?0:(Math.sin(t/350)+1)/2;g2.lineWidth=S/11;g2.strokeStyle='rgba(255,255,255,'+(.95-.4*p)+')';g2.beginPath();g2.roundRect?g2.roundRect(cx-w/2-S*.06-p*S*.05,cy-w/2-S*.06-p*S*.05,w+S*.12+p*S*.1,w+S*.12+p*S*.1,S/5):g2.rect(cx-w/2,cy-w/2,w,w);g2.stroke();g2.font=Math.round(S*.3)+'px serif';g2.fillStyle='#fff';g2.fillText('📍',cx,cy-w/2-S*.12)}}},
run=()=>{if(!cv2.isConnected){cv2.running=false;return}draw(performance.now());if(!reduce)requestAnimationFrame(run)},
kick=()=>{if(reduce){draw(0);return}if(!cv2.running){cv2.running=true;requestAnimationFrame(run)}},
zoomAt=(f,sx,sy)=>{const z=Math.max(.5,Math.min(2.6,view.z*f)),r=z/view.z;view.x=sx-(sx-view.x)*r;view.y=sy-(sy-view.y)*r;view.z=z;if(reduce)draw(0)},
center=()=>{const c=P(EX.map);view.x=wr.clientWidth/2-c[0]*view.z;view.y=wr.clientHeight/2-c[1]*view.z;if(reduce)draw(0)};
const zb=(t,lab,fn)=>{const b=el('button','',t);b.setAttribute('aria-label',lab);b.style.cssText='min-height:0;width:36px;height:36px;padding:0;align-items:center;font-size:18px;border-radius:10px;background:#1c1430dd;backdrop-filter:blur(2px)';b.onclick=e=>{e.stopPropagation();fn()};return b},
zc=el('div');zc.style.cssText='position:absolute;right:8px;top:8px;display:flex;flex-direction:column;gap:6px;z-index:2';
zc.append(zb('+','Zoom avant',()=>zoomAt(1.3,wr.clientWidth/2,wr.clientHeight/2)),zb('−','Zoom arrière',()=>zoomAt(1/1.3,wr.clientWidth/2,wr.clientHeight/2)),zb('⌖','Centrer sur ma position',center));
const pos=ev=>{const r=cv2.getBoundingClientRect();return[ev.clientX-r.left,ev.clientY-r.top]};
cv2.onpointerdown=ev=>{cv2.setPointerCapture(ev.pointerId);ptr.set(ev.pointerId,{p:pos(ev),moved:0});cv2.style.cursor='grabbing'};
cv2.onpointermove=ev=>{const o=ptr.get(ev.pointerId);if(!o)return;const n=pos(ev);
if(ptr.size==1){view.x+=n[0]-o.p[0];view.y+=n[1]-o.p[1];o.moved+=Math.abs(n[0]-o.p[0])+Math.abs(n[1]-o.p[1])}
else if(ptr.size==2){const q=[...ptr.entries()].find(([id])=>id!=ev.pointerId)[1].p,d0=Math.hypot(o.p[0]-q[0],o.p[1]-q[1]),d1=Math.hypot(n[0]-q[0],n[1]-q[1]);if(d0>0)zoomAt(d1/d0,(n[0]+q[0])/2,(n[1]+q[1])/2);o.moved+=9}
o.p=n;if(reduce)draw(0)};
cv2.onpointerup=cv2.onpointercancel=ev=>{const o=ptr.get(ev.pointerId);ptr.delete(ev.pointerId);cv2.style.cursor='grab';if(!o||o.moved>6||ev.type=='pointercancel')return;const[px,py]=pos(ev),wx=(px-view.x)/view.z,wy=(py-view.y)/view.z,k=ks.find(k=>{const c=P(k);return Math.abs(wx-c[0])<S/2&&Math.abs(wy-c[1])<S/2});if(k)say(k)};
['gesturestart','gesturechange','gestureend'].forEach(g=>cv2.addEventListener(g,e=>e.preventDefault()));cv2.onwheel=ev=>{ev.preventDefault();const p=pos(ev);zoomAt(ev.deltaY<0?1.15:1/1.15,p[0],p[1])};
wr.append(cv2,zc);const box=el('div');box.style.flex='none';box.appendChild(wr);box.appendChild(info);box.appendChild(el('p','','🏠 village · 🕳️ donjon · 💀 boss · ❗ quête à prendre · 🎯 objectif de quête · 📍 toi. Touche une zone pour les détails ; glisse pour te déplacer, pince ou utilise + / − pour zoomer.'));say(EX.map);box.center=()=>{size();center();kick()};return box};


// ===== Interface en jeu : la barre d'icônes ouvre les panneaux (menu.js) =====
EX.dock=F=>{const D=el('div','dock');TABS.forEach(([id,n,ic])=>{const dot=(id=='heros'&&talLeft()>0)||(id=='sorts'&&spLeft()>0)||(id=='atelier'&&canCraftAny())||(id=='quetes'&&questReady()),b=el('button','','<span class="ic">'+ic+'</span><span>'+n+'</span>');b.setAttribute('aria-label',n);if(dot)b.appendChild(el('span','dot'));b.onclick=()=>openMenu(id);D.appendChild(b)});F.appendChild(D)};
