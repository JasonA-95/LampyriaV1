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
EX.enter=(name,x,y,quiet=false)=>{exPrune();sv.hist.flags['vu_'+name]=true;const d=DATA.cartes[name],previous=EX.map,chg=previous!==name;if(chg)EX.avatar={};EX.map=name;sv.map=name;if(!quiet)store();if(chg&&previous)setTimeout(()=>{if(!EX.sceneActive)startScreenTransition(d.n)},0);
EX.x=x??d.start[0];EX.y=y??d.start[1];EX.groups=d.groups.map(q=>({...q}));EX.nodes=d.nodes.map(n=>({...n,until:0}));EX.pend=null;const Q=qs(),on=(p,i)=>{const s=Q[p.quest];return s&&s.s==1&&!(s.got||[]).includes(name+i)};
(d.picks||[]).forEach((p,i)=>{if(on(p,i))EX.nodes.push({x:p.x,y:p.y,pick:1,quest:p.quest,id:name+i,until:0})});
(d.hides||[]).forEach((p,i)=>{if(on(p,i))EX.groups.push({x:p.x,y:p.y,renc:p.renc,hide:1,quest:p.quest,id:name+i})});(d.coffres||[]).forEach(c=>{if(sv.deb.includes('farceuse')&&!sv.hist.flags['coffre_'+name])EX.nodes.push({x:c.x,y:c.y,coffre:1,res:c.res,id:name,until:0})});if(chg&&W)resetView()}
EX.start=options=>{options=options||{};DJ.guard();const entering=EX.map!==(sv.map||'village');hideBubble();EX.on=true;EX.tok++;EX.walking=false;EX.group=null;hideMenu();closeModal();$('game').classList.remove('hide');size();
if(entering)EX.enter(sv.map||'village',undefined,undefined,!!(options.storyId&&cfg.test));resetView();
$('tip').textContent='Touche une case, puis touche-la encore pour y aller.';
msg('Tu es : '+DATA.cartes[EX.map].n+'.');EX.ui();EX.draw();if(options.storyId)EX.storyPlay(options.storyId);else if(!EX.storyResume()&&entering)EX.storyTrigger({quand:'entree',carte:EX.map})};
EX.hud=()=>{$('hud').innerHTML='<span class="chip">'+DATA.cartes[EX.map].n+'</span>'+DJ.chips()+'<span class="chip">Niv '+sv.niv+(sv.niv<XP.max?' · '+Math.round(100*XP.part(sv))+'%':' max')+'</span>'+Object.keys(DATA.res).map(k=>'<span class="chip">'+rn(k)+' <b>'+sv.res[k]+'</b></span>').join('')};
EX.ui=()=>{exPrune();const foes=$('foes');if(foes){foes.replaceChildren();foes.classList.add('hide')}EX.hud();$('bar').innerHTML='';$('bar').className='';const F=$('foot');F.innerHTML='';EX.dock(F)};
EX.gain=r=>{let t='';const xp=r.xpq?XP.quete(r.xpq[0],XP.k[r.xpq[1]]||XP.k.normale):r.xp;if(xp){const lv=XP.add(sv,xp);t+=' +'+xp+' XP';if(lv){t+=' Niveau '+sv.niv+' !';if(typeof playSound=='function')playSound('level')}}
for(const k in (r.res||{})){sv.res[k]+=r.res[k];t+=' +'+r.res[k]+' '+DATA.res[k].split(' ')[0]}
if(r.item&&!sv.inv.includes(r.item)){sv.inv.push(r.item);autoEquip(r.item);t+=' '+DATA.objets[r.item].n+' !'}
for(const k in (r.set||{}))sv.hist.flags[k]=r.set[k];if(r.renc!=null&&sv.renc==r.renc&&sv.renc<DATA.rencontres.length-1)sv.renc++;
if(r.lueur&&!sv.deb.includes(r.lueur)){sv.deb.push(r.lueur);t+=' Nouvelle Lueur : '+DATA.lueurs[r.lueur].n+' !'}store();return t};
EX.prog=(id,cell)=>{const s=qs()[id],q=DATA.quetes[id];if(!s||s.s!=1||(s.n||0)>=q.need)return;s.got=s.got||[];if(cell)s.got.push(cell);s.n=(s.n||0)+1;store();
const t='Quête « '+q.n+' » : '+s.n+'/'+q.need+(s.n>=q.need?'. Retourne voir '+(q.donneur||'le Maître Lampiste')+'.':'.');msg(t);toast(t)};
EX.talkNormal=p=>{const Q=qs(),B=[],variant=(p.variantes||[]).find(v=>storyCondition(v.si,sv,sv.hist.flags));let t=variant?variant.txt:p.txt;
(p.quests||[]).forEach(id=>{const q=DATA.quetes[id],s=Q[id];
if(!s){if((q.req||0)<=sv.renc&&(!q.apres||(Q[q.apres]||{}).s==2))B.push(['Accepter : '+q.n,q.desc,false,()=>{Q[id]={s:1,n:0,got:[]};store();EX.enter(EX.map,EX.x,EX.y);exStory({quand:'quete',id,etat:'acceptee'},()=>{speak(p.n,q.say,{at:{x:p.x,y:p.y}});EX.ui();EX.draw();toast('Quête acceptée : '+q.n)})},''])}
else if(s.s==1){const ok=s.n>=q.need,afford=!q.cost||Object.keys(q.cost).every(k=>sv.res[k]>=q.cost[k]);
if(ok)B.push(['Terminer : '+q.n,q.cost?'coût : '+rl(q.cost):'récompense','pri',()=>{
if(q.cost)Object.keys(q.cost).forEach(k=>sv.res[k]-=q.cost[k]);s.s=2;const g=EX.gain(q.rew);EX.enter(EX.map,EX.x,EX.y);exStory({quand:'quete',id,etat:'terminee'},()=>{speak(p.n,q.fin,{at:{x:p.x,y:p.y}});msg('Quête terminée !'+g);toast('Quête terminée !'+g);EX.ui();EX.draw()})},!afford])
else t+=' ('+q.n+' : '+s.n+'/'+q.need+')'}});
(p.actions||[]).forEach(a=>{if(a.si&&!storyCondition(a.si,sv,sv.hist.flags))return;const ok=!a.ok||storyCondition(a.ok,sv,sv.hist.flags);
B.push([a.t,ok?a.sub:a.why,a.cls||'',()=>{if(a.fight!=null){EX.fightNpc(a.fight,p);return}const g=a.rew?EX.gain(a.rew):'';EX.storyTrigger({quand:'action',id:a.id},()=>{EX.ui();EX.draw();if(g){msg(g.trim());toast(g.trim())}})},!ok])});
(p.trade||[]).forEach(tr=>{const lab=o=>Object.keys(o).map(k=>o[k]+' '+DATA.res[k].split(' ')[0]).join(' '),ok=Object.keys(tr.give).every(k=>sv.res[k]>=tr.give[k]);
B.push(['Échanger '+lab(tr.give),'contre '+lab(tr.get),'',()=>{Object.keys(tr.give).forEach(k=>sv.res[k]-=tr.give[k]);Object.keys(tr.get).forEach(k=>sv.res[k]+=tr.get[k]);store();EX.talk(p)},!ok])});
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
EX.back=res=>{const g0=EX.group;if(res=='win'&&g0)g0.dead=true;if(res=='lose'){sv.map='village';sv.dj=null;store();EX.map=null}
const djm=res=='win'&&g0?DJ.after():'';EX.start();
if(res=='lose')msg('Tu te réveilles au village, sans rien avoir perdu.');
else if(g0){if(g0.hide)EX.prog(g0.quest,g0.id);
Object.keys(DATA.quetes).forEach(id=>{const q=DATA.quetes[id];if(q.kind=='win'&&q.renc==(DATA.rencontres[g0.renc].base??g0.renc)&&!g0.hide)EX.prog(id)})}
if(res=='win'){const rr=g0?g0.renc:cfg.renc;sv.hist.flags['vaincu_'+(DATA.rencontres[rr].base??rr)]=true;store()}
if(djm)msg(djm);EX.hud();if(g0)EX.storyGroup=g0;EX.storyTrigger({quand:'apresCombat',renc:g0?g0.renc:cfg.renc,issue:res});if(!EX.sceneActive)startScreenTransition()};
EX.draw=()=>{const N=DATA.taille,d=DATA.cartes[EX.map],rocks=new Set(d.rocks.map(r=>exK(r[0],r[1]))),avatar=displayPosition(EX.avatar,EX.x,EX.y,rocks);cam(avatar.x,avatar.y);g.clearRect(0,0,W,H);
const pp={},ex={},E={};
if(EX.pend&&EX.pend.path)EX.pend.path.forEach(t=>pp[exK(t[0],t[1])]=1);
d.exits.forEach(e=>ex[exK(e.x,e.y)]=e);
EX.groups.forEach(q=>{if(!q.dead)E[exK(q.x,q.y)]=q.hide?{e:'🌿',b:'?',visual:q}:{e:DATA.rencontres[q.renc].m[0].e,n:DATA.rencontres[q.renc].m[0].n,b:'×'+DATA.rencontres[q.renc].m.length,visual:q}});
EX.nodes.forEach(n=>E[exK(n.x,n.y)]={e:n.pick?'🏮':n.coffre?'🎁':DATA.resE[n.res],a:n.until>EX.steps?.25:1,visual:n});
d.npcs.forEach(n=>E[exK(n.x,n.y)]={e:n.e,visual:n});
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
for(const key of Object.keys(E)){const u=E[key],[x,y]=key.split(',').map(Number),visual=u.visual||u,p=displayPosition(visual,x,y,rocks),style=displayUnitStyle(visual,undefined,tw,th),cx=(p.x-p.y)*tw/2+ox+style.x,cy=(p.x+p.y)*th/2+oy+style.y;const isH=visual===EX.avatar,sk=isH?SPR.heroKey():(u.b&&u.b!='?'?SPR.monKey(u.n):null);let ok=false;g.save();g.globalAlpha=(u.a??1)*style.alpha;drawGroundShadow(g,cx,cy,tw,th,u.b?1.1:1);g.translate(cx,cy);g.scale(style.scale,style.scale);g.fillStyle='#fff';g.font=Math.round(tw*.7)+'px serif';if(sk){const f=isH?(EX.face||{right:true,back:false}):{right:(EX.x-EX.y)>=(x-y),back:(EX.x+EX.y)<(x+y)};ok=SPR.drawKey(g,sk,f.right,f.back,tw,th)}if(!ok)g.fillText(u.e,0,-th*.3);g.restore();
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
xs=ks.map(k=>L[k][0]),ys=ks.map(k=>L[k][1]),x0=Math.min(...xs),y0=Math.min(...ys),cw=Math.max(...xs)-x0+1,ch=Math.max(...ys)-y0+1,S=40,
cv2=el('canvas'),g2=cv2.getContext('2d'),info=el('p');cv2.width=cw*S;cv2.height=ch*S;cv2.style.cssText='position:static;inset:auto;max-width:none;display:block;margin:auto;background:#120d1f;touch-action:manipulation';const wr=el('div');wr.style.cssText='height:min(46vh,'+ch*S+'px);overflow:auto;border-radius:10px;background:#120d1f;margin:8px 0';
const P=k=>[(L[k][0]-x0)*S+S/2,(L[k][1]-y0)*S+S/2],say=k=>{const m=C[k],mk=marks(k);info.innerHTML='<b>'+(vu(k)?m.n:'Zone inconnue')+'</b>'+(vu(k)&&niv(k)?' · '+niv(k):'')+(k==EX.map?' · 📍 tu es ici':'')+(vu(k)&&mk.length?'<br>'+mk.join(' '):'')+(vu(k)&&m.exits.some(e=>e.don)?'<br>Entrée : '+m.exits.find(e=>e.don).lbl+' ('+m.exits.find(e=>e.don).nv+')':'')};
g2.lineCap='round';
for(const k of ks)for(const e of C[k].exits)if(show(e.to)&&k<e.to){const a=P(k),b=P(e.to),lk=exLock(e)||exLock(C[e.to].exits.find(x=>x.to==k)||{to:k});g2.strokeStyle=lk?'#555':'#ffb454';g2.lineWidth=S/8;g2.setLineDash(lk?[S/10,S/10]:[]);g2.beginPath();g2.moveTo(a[0],a[1]);g2.lineTo(b[0],b[1]);g2.stroke()}
g2.setLineDash([]);g2.textAlign='center';g2.textBaseline='middle';
for(const k of ks){const[cx,cy]=P(k),w=S*.7,v=vu(k);g2.fillStyle=v?BC[C[k].biome]||'#6a5a8a':'#2a2540';g2.globalAlpha=v?(dj(k)?.5:.85):.6;g2.beginPath();g2.roundRect?g2.roundRect(cx-w/2,cy-w/2,w,w,S/8):g2.rect(cx-w/2,cy-w/2,w,w);g2.fill();g2.globalAlpha=1;
g2.lineWidth=k==EX.map?S/10:dj(k)?2:1;g2.strokeStyle=k==EX.map?'#fff':dj(k)?'#d9534f':'#0008';g2.stroke();
g2.font=Math.round(S*.3)+'px serif';g2.fillStyle='#fff';if(!v)g2.fillText('?',cx,cy);else{const mk=marks(k);if(k==EX.map)mk.unshift('📍');mk.slice(0,4).forEach((t,i,a)=>g2.fillText(t,cx+(a.length>1?(i%2?1:-1)*S*.17:0),cy+(a.length>2?(i<2?-1:1)*S*.17:0)))}}
cv2.onclick=ev=>{const r=cv2.getBoundingClientRect(),px=(ev.clientX-r.left)*cv2.width/r.width,py=(ev.clientY-r.top)*cv2.height/r.height,k=ks.find(k=>{const c=P(k);return Math.abs(px-c[0])<S/2&&Math.abs(py-c[1])<S/2});if(k)say(k)};
wr.appendChild(cv2);const box=el('div');box.style.flex='none';box.appendChild(wr);box.appendChild(info);box.appendChild(el('p','','🏠 village · 🕳️ donjon · 💀 boss · ❗ quête à prendre · 🎯 objectif de quête · 📍 toi. Touche une zone pour les détails.'));say(EX.map);box.center=()=>{const c=P(EX.map);wr.scrollTop=c[1]-wr.clientHeight/2;wr.scrollLeft=c[0]-wr.clientWidth/2};return box};


// ===== Interface en jeu : la barre d'icônes ouvre les panneaux (menu.js) =====
EX.dock=F=>{const D=el('div','dock');TABS.forEach(([id,n,ic])=>{const dot=(id=='heros'&&talLeft()>0)||(id=='sorts'&&spLeft()>0)||(id=='atelier'&&canCraftAny())||(id=='quetes'&&questReady()),b=el('button','','<span class="ic">'+ic+'</span><span>'+n+'</span>');b.setAttribute('aria-label',n);if(dot)b.appendChild(el('span','dot'));b.onclick=()=>openMenu(id);D.appendChild(b)});F.appendChild(D)};
