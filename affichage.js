// AFFICHAGE : dessin de la grille, boutons de combat, clics. Les règles sont dans moteur.js, les menus dans menu.js.
const cv=$('c'),g=cv.getContext('2d'),ambCv=$('amb'),ag=ambCv.getContext('2d');
const MSG={loin:'Trop loin : déplacement limité par tes PM, sans traverser les obstacles.',cible:'Cible invalide (portée, ligne de vue ou case vide).',cout:'Pas assez de PA, ou sort en recharge.'};
let C,tw,th,ox,oy,W,H,mode,busy,tt,pend=null,after=null;
let visualLock=0;
function pop(u,t,c){addDisplayText(u,t,c)}
// Attente des animations avec garde-fou : si l'onglet est masqué ou si une animation se bloque, on libère après 3 s.
function waitDisplaySafe(){return Promise.race([waitForDisplay(),new Promise(r=>setTimeout(r,3000))])}
function lockActionsDuringAnimation(){if(busy||!displayPending())return;busy=true;const token=++visualLock;ui();waitDisplaySafe().then(()=>{if(token!==visualLock)return;busy=false;ui();draw()})}
function flashHit(unit,color){
  if(!unit)return;
  addDisplayEffect('hit',{unit,at:{x:unit.x,y:unit.y},duration:displayDuration(220),color:color||'#e5564a'});
}
function deathAnimation(unit){
  if(!unit||unit.hp>0)return;
  addDisplayEffect('death',{unit,duration:displayDuration(300)});if(typeof playSound=='function')playSound('death');
}
function unitSnapshots(units){return units.map(unit=>({unit,x:unit.x,y:unit.y,hp:unit.hp}))}
function appearanceAnimation(unit,duration){
  if(!unit)return;
  addDisplayEffect('spawn',{unit,duration:displayDuration(duration||220)});
}
function animateUnitChanges(before,blocked){for(const item of before){const unit=item.unit;if(item.x!==unit.x||item.y!==unit.y)animateUnitMove(unit,{x:item.x,y:item.y},{x:unit.x,y:unit.y},blocked);
if(item.hp>0&&unit.hp<=0)deathAnimation(unit)}}

// ---------- fin de combat ----------
function reward(){const e=DATA.rencontres[cfg.renc];if(cfg.test)return{test:true};
const type=e.type||(e.m.some(m=>m.boss)?'boss':'normal'),gain=XP.rencontre({niv:e.niv||1+cfg.renc*3,m:XP.m[type]||1},sv.niv,!EX.group),r={xp:gain,loot:e.loot||{},lv:0,items:[],eq:[],lueur:null};for(const k in r.loot)sv.res[k]+=r.loot[k];
r.lv=XP.add(sv,gain);if(r.lv&&typeof playSound=='function')playSound('level');
if((DATA.rencontres[cfg.renc].base??cfg.renc)==sv.renc&&sv.renc<DATA.rencontres.length-1)sv.renc++;
if(e.unlock&&!sv.deb.includes(e.unlock)){sv.deb.push(e.unlock);r.lueur=e.unlock}
r.rel=DJ.roll();r.items=rollDrops(cfg.renc);r.eq=r.items.map(autoEquip);store();return r}
function endFight(res,r){combatLive=false;const win=res=='win',n=el('div','');if(typeof playSound=='function')playSound(win?'victory':'defeat');
if(win){say(DATA.rencontres[cfg.renc].vic||'victoire');let h='<h2>Victoire !</h2>';
if(r.test)h+='<p>Mode test : aucun gain.</p>';
else{h+='<p>+'+r.xp+' XP'+(r.lv?' · <b style="color:var(--ember)">Niveau '+sv.niv+' !</b> (+'+r.lv+' point'+(r.lv>1?'s':'')+' de talent)':'')+'</p>';
const L=Object.keys(r.loot);if(L.length)h+='<p><span class="chips">'+L.map(k=>'<span class="chip ok">'+rn(k)+' +'+r.loot[k]+'</span>').join('')+'</span></p>';
if(r.lueur)h+='<p>✨ Nouvelle Lueur : <b>'+DATA.lueurs[r.lueur].n+'</b></p>';
if(r.rel)h+='<p>'+DJ.D[r.rel].e+' <b>'+DJ.D[r.rel].rel+'</b> obtenue ! Elle ouvre le donjon « '+DJ.D[r.rel].n+' ».</p>';
r.items.forEach((id,i)=>{const o=DATA.objets[id];h+='<p>'+o.e+' <b style="color:'+RC[o.r]+'">'+o.n+'</b> <span class="sp">('+RAR[o.r]+', '+fmtSt(o.st)+')'+(r.eq[i]?' · équipé':' · dans ton sac')+'</span></p>'})}
n.innerHTML=h}
else{say('defaite');n.innerHTML='<h2>Défaite</h2><p>'+(EX.group?'Tu te réveilles au village, sans rien avoir perdu.':'Aucune perte : réessaie avec un autre équipement ou d\'autres Lueurs.')+'</p>'}
const fin=()=>EX.group?EX.back(res):openMenu('jouer');
after=fin;msg(win?'Victoire !':'Défaite.');ui();draw();
const B=EX.group?[['Continuer',fin,'pri']]:win?[['Menu',()=>openMenu('jouer')],['Rejouer',()=>startTraining(cfg.renc),'pri']]:[['Menu',()=>openMenu('jouer')],['Réessayer',()=>startTraining(cfg.renc),'pri']];
modal(n,B)}
function startTraining(i){EX.group=null;EX.on=false;EX.tok++;cfg.renc=i;hideMenu();$('game').classList.remove('hide');startScreenTransition();init()}
function leaveFight(){combatLive=false;if(EX.group){const q=EX.group;EX.group=null;EX.start()}else openMenu('jouer')}

// ---------- dimensions et initialisation ----------
// Caméra libre : on zoome (pincement ou molette) et on déplace la vue en faisant glisser. Aucun suivi automatique.
let TW0=1,LAND=false;const V={z:1,px:0,py:0};
function applyZoom(){tw=TW0*V.z;th=tw/2}
function clampPan(){const N=DATA.taille;if(V.z<=1.01){V.px=V.py=0;return}const mx=N*tw/2+W/2-50,my=N*th/2+H/2-50;V.px=Math.max(-mx,Math.min(mx,V.px));V.py=Math.max(-my,Math.min(my,V.py))}
function fillOuter(biome,N){const R=40;for(let s=-2*R;s<=2*N+2*R;s++)for(let x=-R;x<N+R;x++){const y=s-x;if(y<-R||y>=N+R||(x>=0&&x<N&&y>=0&&y<N))continue;const cx=(x-y)*tw/2+ox,cy=(x+y)*th/2+oy;if(cx<-tw||cx>W+tw||cy<-th||cy>H+th)continue;const l=.3*((x+y)%2?.9:1);if(OPT.fx=='off')dia(cx,cy,col(l));else tuile(g,cx,cy,tw,th,biome,Math.abs(x),Math.abs(y),l);dia(cx,cy,'rgba(0,0,0,.18)')}}
function cam(){clampPan();ox=W/2+V.px;oy=H/2-6*th+V.py}
let ambRAF=0,ambTimer=0,ambLast=0;const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
function ambienceActive(){return ambienceShouldRun(OPT.fx,document.hidden,$('game').classList.contains('hide'),motionQuery.matches)}
function stopAmbience(){if(ambRAF)cancelAnimationFrame(ambRAF);if(ambTimer)clearTimeout(ambTimer);ambRAF=ambTimer=ambLast=0;ambCv.style.visibility='hidden';if(ambCv.width&&ambCv.height)ag.clearRect(0,0,W,H)}
function scheduleAmbience(delay){if(ambTimer||ambRAF)return;if(delay)ambTimer=setTimeout(()=>{ambTimer=0;if(ambienceActive())ambRAF=requestAnimationFrame(ambienceFrame)},delay);else ambRAF=requestAnimationFrame(ambienceFrame)}
function ambienceFrame(time){ambRAF=0;if(!ambienceActive()){stopAmbience();return}const fps=ambienceFps(OPT.fx);
if(ambienceFrameDue(ambLast,time,OPT.fx)){ambLast=time;const biome=EX.on?DATA.cartes[EX.map].biome:DATA.rencontres[cfg.renc].biome;drawAmbience(ag,W,H,biome,DATA.taille,ox,oy,tw,th,time,OPT.fx,DATA.ambiance[biome])}
scheduleAmbience(Math.max(0,1000/fps-(performance.now()-time)))}
function syncAmbience(){if(!ambienceActive()){if(ambRAF||ambTimer||ambCv.style.visibility!='hidden')stopAmbience();return}ambCv.style.visibility='visible';scheduleAmbience(0)}
function size(){const N=DATA.taille,S=$('stage');LAND=matchMedia('(orientation:landscape) and (min-width:700px)').matches||matchMedia('(orientation:landscape) and (max-height:600px)').matches;
W=S.clientWidth||innerWidth;H=S.clientHeight||innerHeight*.55;TW0=Math.min(W/16.4,(H-10)/6.5);applyZoom();const d=devicePixelRatio||1;
cv.width=Math.round(W*d);cv.height=Math.round(H*d);cv.style.width=ambCv.style.width=W+'px';cv.style.height=ambCv.style.height=H+'px';ambCv.width=cv.width;ambCv.height=cv.height;g.setTransform(d,0,0,d,0,0);ag.setTransform(d,0,0,d,0,0);cam();syncAmbience()}
function resetView(){V.z=1;V.px=V.py=0;applyZoom();cam()}
function setZoom(z2,fx,fy){const N=DATA.taille;cam();const u=(fx-ox)/tw,v=(fy-oy)/tw;V.z=Math.max(1,Math.min(3.5,z2));applyZoom();V.px=fx-u*tw-W/2;V.py=fy-v*tw-(H/2-6*th);cam()}
const ptrs=new Map();let drag=null,moved=false,pinch=null;
cv.addEventListener('pointerdown',e=>{try{cv.setPointerCapture(e.pointerId)}catch(_){}ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
if(ptrs.size==1){drag={x:e.clientX,y:e.clientY,px:V.px,py:V.py};moved=false}else if(ptrs.size==2){const [p,q]=[...ptrs.values()];pinch={d:Math.hypot(p.x-q.x,p.y-q.y)||1,z:V.z};moved=true}});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
if(ptrs.size==2&&pinch){const [p,q]=[...ptrs.values()],r=cv.getBoundingClientRect();setZoom(pinch.z*Math.hypot(p.x-q.x,p.y-q.y)/pinch.d,(p.x+q.x)/2-r.left,(p.y+q.y)/2-r.top);draw();return}
if(drag&&ptrs.size==1){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!moved&&Math.hypot(dx,dy)>8)moved=true;if(moved){V.px=drag.px+dx;V.py=drag.py+dy;cam();draw()}}});
const ptrUp=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;if(!ptrs.size)drag=null};
cv.addEventListener('pointerup',ptrUp);cv.addEventListener('pointercancel',ptrUp);
cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();setZoom(V.z*(e.deltaY<0?1.15:1/1.15),e.clientX-r.left,e.clientY-r.top);draw()},{passive:false});
const cellPx=(x,y)=>[(x-y)*tw/2+ox,(x+y)*th/2+oy];
function placeBubble(){const B=$('bubble');if(B.classList.contains('hide')||$('game').classList.contains('hide'))return;
const at=bub.at=='hero'?(EX.on?{x:EX.x,y:EX.y}:C&&C.hero):bub.at;if(!at)return;
const [px,py]=cellPx(at.x,at.y),bw=B.offsetWidth,bh=B.offsetHeight;let top=py-th*1.7-bh,below=false;if(top<4){top=py+th*.7;below=true}
const left=Math.max(6,Math.min(W-bw-6,px-bw/2));B.style.left=left+'px';B.style.top=top+'px';B.classList.toggle('below',below);B.querySelector('.tail').style.left=Math.max(10,Math.min(bw-24,px-left-7))+'px'}
function init(){size();normL();C=new Combat(DATA,{...cfg,niv:sv.niv,gear:gear().t,sorts:sortsEquipes()});C.hero.e=heroEmoji();resetView();mode='move';busy=false;pend=null;after=null;combatLive=true;
hideBubble();say(DATA.rencontres[cfg.renc].say||'debut');$('tip').textContent='Maintiens un sort pour lire sa description. Tacle : quitter une case voisine d’un monstre coûte 1 PM de plus.'+(C.foes.some(f=>f.cendre)?' Duchesse : protégée sur la cendre grise (≈), disperse-la avec un sort pour la rendre vulnérable.':'');
msg('Touche une case éclairée pour te déplacer, ou choisis un sort puis une cible.');ui();draw()}
cv.onclick=e=>{if(moved){moved=false;return}if(EX.on)return EX.click(e);if(busy||C.result)return;const r=cv.getBoundingClientRect(),a=(e.clientX-r.left-ox)/(tw/2),b=(e.clientY-r.top-oy)/(th/2);
const x=Math.round((a+b)/2),y=Math.round((b-a)/2);if(!DATA.in(x,y))return;act(x,y)};

// ---------- actions ----------
function spellColor(spell){if(spell&&spell.heal)return'#7fd18b';if(spell&&spell.say){return{rage:'#ffb454',fuite:'#9ecbff',soin:'#7fd18b',sommeil:'#c9b8ff',mur:'#c9b8ff',farce:'#ffe08a',ombre:'#8c85c7'}[spell.say]||'#ffe08a'}return{porte:'#ffb454',archer:'#6fb7ff',mage:'#c58bff'}[cfg.classe]||'#ffb454'}
function animateActionResult(before,spell,x,y,result){animateUnitChanges(before,C.rocks);const heroBefore=before[0],color=spellColor(spell),at={x,y};
if(spell){if(spell.r&&spell.r[1]>0&&spell.dmg&&spell.aoe==null)addDisplayEffect('projectile',{from:{x:heroBefore.x,y:heroBefore.y},to:at,color,duration:240});
if(spell.tp)appearanceAnimation(C.hero,220);if(spell.aoe!=null)addDisplayEffect('zone',{at,radius:spell.aoe,color,duration:280});if(spell.heal||spell.drain)addDisplayEffect('heal',{at:{x:C.hero.x,y:C.hero.y},color:'#7fd18b',duration:280});
if(spell.push)addDisplayEffect('wave',{at,radius:spell.push,color,duration:230});if(spell.garde||spell.mur||(spell.etatsSoi||[]).some(e=>e.id=='bouclier'))addDisplayEffect('pulse',{at:{x:C.hero.x,y:C.hero.y},radius:1.2,color,duration:280});
}
for(const hit of result.hit||[]){const old=before.find(item=>item.unit===hit);if(old&&old.hp>hit.hp&&hit.hp>0)flashHit(hit)}
if(heroBefore.hp>C.hero.hp){flashHit(C.hero);if(typeof playSound=='function')playSound('hit')}
if((result.events||[]).length){addDisplayEffect('pulse',{at,radius:.8,color:'#ffe08a',duration:220});if(typeof playSound=='function')playSound('state')}
if(typeof playSound=='function')playSound(spell?(spell.heal||spell.drain?'heal':spell.aoe!=null?'zone':spell.r&&spell.r[1]>1&&spell.dmg?'shot':spell.dmg?'melee':'magic'):'step')}
function act(x,y){if(busy||C.result||displayPending())return;const ok=mode=='move'?C.reach()[x+','+y]>0:C.ranged(mode).some(t=>t[0]==x&&t[1]==y);
if(!ok){pend=null;msg(mode=='move'?MSG.loin:MSG.cible);draw();return}
if(!pend||pend.x!=x||pend.y!=y){pend={x,y};msg(mode=='move'?'Déplacement : '+C.reach()[x+','+y]+' PM. Touche encore la case pour confirmer.':'Zone affichée. Touche encore la même case pour lancer le sort.');draw();return}
pend=null;const before=unitSnapshots([C.hero,...C.foes]),spell=Number.isInteger(mode)?C.S[mode]:null,hp0=C.hero.hp;let r;if(mode=='move')r=C.move(x,y);else{r=C.cast(mode,x,y);if(r.ok)mode='move'}
if(!r.ok){msg(MSG[r.tag]);return}
animateActionResult(before,spell,x,y,r);
if(r.tag)say(r.tag);
if(r.blocked)pop(C.foes.find(f=>f.boss&&f.hp>0),'Protégé','#c9b8ff');const dh=C.hero.hp-hp0;if(dh>0)pop(C.hero,'+'+dh,'#7fd18b');
const P={rage:['RAGE','#ffb454'],mur:['MUR','#c9b8ff'],sommeil:['Zzz','#9ecbff'],fuite:['Fuite !','#ffe08a'],farce:['Hop !','#ffe08a']}[r.tag];
if(r.resist)pop(C.foes.find(f=>f.boss&&f.hp>0),'Résiste','#c9b8ff');
if(P&&!r.resist)pop(r.tag=='sommeil'?(C.foes.find(f=>f.sleep&&f.hp>0)||C.hero):C.hero,...P);
if(r.charge)pop(C.hero,'Charge !','#ffb454');if(r.recul)pop(C.hero,'Recul','#ffe08a');if(r.garde)pop(C.hero,'Garde','#9ecbff');
(r.effects||[]).forEach(e=>pop(e.cible,e.texte,e.couleur));
(r.events||[]).forEach(e=>pop(e.cible,e.texte,e.couleur));
const k=r.hit?r.hit.filter(f=>f.hp<=0).length:0;
const ash=C.foes.some(f=>f.cendre&&f.hp>0);
const mortText=(r.mortEvents||[]).map(e=>e.text).join(' ');
const effectText=[r.charge?'Charge !':'',r.recul?'Recul':'',r.garde?'Garde':''].filter(Boolean).join(' '),stateText=(r.events||[]).map(e=>e.text).filter(Boolean).join(' ');
const FM=(C.foes.find(g=>g.form)||{n:'Le formulaire'}).n,BS=(C.foes.find(g=>g.boss)||{n:'Le Chambellan'}).n;const combatText=r.resist?'Le boss résiste à l’effet.':r.blocked&&ash?(r.ashCleared?'La Duchesse est protégée : elle se tient sur la cendre ! Ton sort la disperse : frappe maintenant, elle est vulnérable jusqu’à ce qu’elle la reforme.':'La Duchesse est protégée tant qu’elle se tient sur la cendre : lance un sort sur sa case pour la disperser.'):r.formDown?(r.out?FM+' est projeté hors du terrain !':FM+' est détruit !')+' '+BS+' est vulnérable 2 tours.':r.blocked&&!(r.hit&&r.hit.length)?BS+' est invulnérable : '+((C.foes.find(g=>g.boss)||{}).prot||FM.toLowerCase()+' le protège')+' !':r.mocked&&!(r.hit&&r.hit.length)?'Les Lueurs se moquent de lui : sa vexation fond !':r.ashCleared&&!(r.hit&&r.hit.length)?'La cendre se disperse.':r.hit&&r.hit.length?'-'+r.dmg+' PV sur '+r.hit.length+' ennemi(s)'+(k?', '+k+' vaincu(s).':'.'):'';
msg(mortText||[effectText,combatText,stateText].filter(Boolean).join(' '));
if(C.result=='lose'){ui();draw();setTimeout(()=>endFight('lose'),500);return}
if(C.result=='win'){const rw=reward();ui();draw();setTimeout(()=>endFight('win',rw),500);return}
ui();draw();lockActionsDuringAnimation()}
async function endTurn(){if(busy||C.result||displayPending())return;busy=true;mode='move';pend=null;ui();const reports=[];
for(const f of C.foes){if(f.hp<=0)continue;await new Promise(r=>setTimeout(r,400));const before=unitSnapshots([C.hero,...C.foes]),action=C.foeTurn(f);animateUnitChanges(before,C.rocks);
if(action.text){msg(action.text);reports.push(action.text)}if(action.tag=='contact')pop(C.hero,'-'+action.dmg,'#e5564a');if(typeof playSound=='function'){if(action.tag=='contact')playSound('melee');else if(action.tag=='heal')playSound('heal');else if(action.tag=='spell')playSound('magic');if(action.dmg>0&&action.cible===C.hero)playSound('hit');if(action.skip&&action.text.includes('étourdi'))playSound('stun')}if(action.skip&&action.text.includes('étourdi'))addDisplayEffect('pulse',{at:{x:f.x,y:f.y},radius:.8,color:'#ffe08a',duration:220});(action.effects||[]).forEach(e=>pop(e.cible,e.texte,e.couleur));if(action.tag=='heal'&&action.cible)addDisplayEffect('heal',{at:{x:action.cible.x,y:action.cible.y},color:'#7fd18b',duration:260});else if(action.tag=='spell')addDisplayEffect('projectile',{from:{x:f.x,y:f.y},to:{x:C.hero.x,y:C.hero.y},color:'#e5564a',duration:220});
draw();ui();await waitDisplaySafe();
if(C.result){busy=false;ui();draw();if(C.result=='lose')endFight('lose');else endFight('win',reward());return}}
const before=unitSnapshots([C.hero,...C.foes]),tick=C.newTurn();if(C.notice){toast(C.notice);msg(C.notice);C.notice=''}animateUnitChanges(before,C.rocks);if(tick.blocked)addDisplayEffect('pulse',{at:{x:C.hero.x,y:C.hero.y},radius:.9,color:'#ffe08a',duration:220});
if(C.result){msg(tick.events.map(e=>e.text).filter(Boolean).join(' '));ui();draw();await waitDisplaySafe();busy=false;endFight('lose');return}
const tickText=tick.events.map(e=>e.text).filter(Boolean).join(' ');msg([reports.join(' '),tickText,tick.blocked?'Étourdi ! Ton tour est passé automatiquement.':C.pm==0?'À toi de jouer (tu ne peux pas te déplacer ce tour).':'À toi de jouer.'].filter(Boolean).join(' '));ui();draw();await waitDisplaySafe();busy=false;ui();draw();
if(tick.blocked){busy=true;ui();setTimeout(()=>{busy=false;endTurn()},700)}}

// ---------- boutons ----------
function mk(t,sub,cls,fn,dis){const b=btn(t,sub,cls,fn,dis);$('bar').appendChild(b);return b}
function pips(cls,n,max){let s='';for(let i=0;i<max;i++)s+='<i class="'+(i<n?'f':'')+'"></i>';return '<span class="pip '+cls+'">'+cls.toUpperCase()+' '+s+'</span>'}
function foesUI(){const F=$('foes');if(!F)return;const live=C.foes.filter(f=>f.hp>0);F.replaceChildren();F.classList.toggle('hide',!live.length);
for(const f of live){const item=document.createElement('button'),name=document.createElement('span'),states=document.createElement('span'),hp=document.createElement('span');item.type='button';item.className='foe';name.className='name';name.textContent=f.e+' '+f.n+(f.sort&&f.sortCd>0?' ⏳'+f.sortCd:'');
const active=f.etats.filter(e=>e.t>0);states.className='states';states.textContent=active.map(e=>DATA.etats[e.id].e+e.t+(e.id=='bouclier'?'·'+e.v:'')).concat(f.sleep?['💤 Sommeil 1']:[]).concat(C.shield(f)?['🛡️ Protégé'+(f.cendre?' (cendre)':'')]:[]).concat(C.weak(f)?['⚔️ Vulnérable']:[]).join(' ');hp.className='hp';hp.textContent=f.hp+'/'+f.max;item.append(name,states,hp);
item.onclick=()=>{$('tip').textContent=[...(f.cendre?['La Duchesse est protégée tant qu’elle se tient sur de la cendre (cases grises ≈). Lance un sort sur sa case : la cendre se disperse et elle devient vulnérable 2 tours. Elle en recrée à chaque tour.']:[]),...active.map(e=>{const d=DATA.etats[e.id];return d.n+' : '+d.d+' Durée : '+e.t+' tour(s)'+(e.id=='bouclier'?' · '+e.v+' points restants':'')+'.'}),...(f.sleep?['Sommeil : passe son prochain tour.']:[])].join(' ');if(!$('tip').textContent)$('tip').textContent='Aucun état actif.'};F.appendChild(item)}}
function ui(){const h=C.hero;foesUI();const states=h.etats.filter(e=>e.t>0).map(e=>{const d=DATA.etats[e.id];return'<span class="tag state">'+d.e+' '+d.n+' '+e.t+(e.id=='bouclier'?' · '+e.v:'')+'</span>'}).join('');
$('hud').innerHTML='<div class="pv"><span><b style="color:var(--ink)">'+h.hp+'</b> / '+h.max+' PV · Niv '+sv.niv+'</span><div class="bar"><i style="width:'+Math.max(0,Math.round(100*h.hp/h.max))+'%"></i></div></div>'+pips('pa',C.pa,C.PA)+pips('pm',C.pm,C.PM)+'<span class="pip">Tour '+C.turn+'</span>'+(h.rage?'<span class="tag">RAGE</span>':'')+(h.mur?'<span class="tag">MUR</span>':'')+(h.garde?'<span class="tag state">🛡️ Garde '+h.garde+'</span>':'')+states;
$('bar').innerHTML='';$('bar').className='';const F=$('foot');F.innerHTML='';
if(C.result){F.appendChild(btn('Menu','','',()=>after&&after()));F.appendChild(btn('Continuer','','pri',()=>after&&after()));return}
const off=busy;
mk('Se déplacer',C.PM+' PM par tour',mode=='move'?'on':'',()=>{if(off)return;mode='move';pend=null;ui();draw()},off);
C.S.forEach((s,i)=>{const no=C.pa<s.pa||C.cd[i]>0,name=s.n+(s.rang>1?' ★'+s.rang:'');
const b=mk(name,s.pa+' PA'+(C.cd[i]?' · recharge '+C.cd[i]:''),mode===i?'on':'',()=>{if(off)return;$('tip').textContent=descr(s);
if(no){msg(C.cd[i]>0?'En recharge : encore '+C.cd[i]+' tour(s).':'Pas assez de PA pour ce sort.');return}mode=i;pend=s.r[1]==0?{x:C.hero.x,y:C.hero.y}:null;msg(pend?'Zone affichée. Touche ton personnage pour confirmer.':'Touche une case bleue pour voir la zone, puis touche-la encore pour confirmer.');ui();draw()},false);
b.title=descr(s);if(no||off)b.classList.add('dim');
b.onpointerdown=()=>{clearTimeout(tt);tt=setTimeout(()=>$('tip').textContent=descr(s),400)};b.onpointerup=b.onpointerleave=()=>clearTimeout(tt)});
F.appendChild(btn('⚙️ Options','','',()=>openMenu('options'),busy));F.appendChild(btn('Fin du tour','','pri',endTurn,off))}

// ---------- dessin ----------
const col=l=>'rgb('+[38+82*l,32+52*l,51-3*l].map(Math.round)+')';
function dia(cx,cy,f){g.beginPath();g.moveTo(cx,cy-th/2);g.lineTo(cx+tw/2,cy);g.lineTo(cx,cy+th/2);g.lineTo(cx-tw/2,cy);g.closePath();g.fillStyle=f;g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.stroke()}
function draw(){if(EX.on)return EX.draw();if(!C)return;const N=DATA.taille,h=C.hero,units=[h,...C.foes],positions=new Map(units.map(u=>[u,displayPosition(u,u.x,u.y,C.rocks)])),hp=positions.get(h),fo=C.foes.filter(f=>f.hp>0&&!f.form);cam((2*hp.x+fo.reduce((s,f)=>s+positions.get(f).x,0))/(2+fo.length),(2*hp.y+fo.reduce((s,f)=>s+positions.get(f).y,0))/(2+fo.length));g.clearRect(0,0,W,H);
const rc=mode=='move'&&!busy&&!C.result?C.reach():{},rs=new Set(mode!='move'&&!C.result?C.ranged(mode).map(t=>t.join(',')):[]),rz=new Set(mode!='move'&&!C.result?C.zone(mode).map(t=>t.join(',')):[]);
const pp={},zone=new Set();if(pend&&!C.result){if(mode=='move')C.path(pend.x,pend.y).forEach(t=>pp[t.join(',')]=1);
else{const s=C.S[mode];for(const [x,y] of DATA.cells)if(C.ok(x,y)&&C.dist({x,y},pend)<=(s.aoe??0))zone.add(x+','+y)}}
g.textAlign='center';g.textBaseline='middle';g.font=Math.round(tw*.7)+'px serif';
const biome=DATA.rencontres[cfg.renc].biome,occupied=new Set(C.rocks);
for(const u of [h,...C.foes])if(u.hp>0)occupied.add(u.x+','+u.y);
const decor=OPT.fx=='off'?[]:terrainDecorCells(N,biome,occupied,null,DATA.decor[biome]),decorAt=new Map(decor.map(item=>[item.x+','+item.y,item]));
fillOuter(biome,N);for(const [x,y] of DATA.cells){const k=x+','+y,cx=(x-y)*tw/2+ox,cy=(x+y)*th/2+oy,l=Math.max(0,1-Math.hypot(x-hp.x,y-hp.y)/6.5)*((x+y)%2?.9:1);
if(OPT.fx=='off')dia(cx,cy,col(l));else tuile(g,cx,cy,tw,th,biome,x,y,l);const detail=decorAt.get(k);if(detail)drawTerrainDecor(g,cx,cy,tw,th,biome,detail)}
for(const [x,y] of DATA.cells){const k=x+','+y,cx=(x-y)*tw/2+ox,cy=(x+y)*th/2+oy;
if(C.ash.has(k)){dia(cx,cy,'rgba(140,130,150,.68)');g.save();g.font='bold '+Math.round(tw*.4)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(235,230,240,.85)';g.fillText('≈',cx,cy);g.restore()}if(C.warn&&C.warn.has(k))dia(cx,cy,'rgba(229,86,74,.5)');if(rc[k]>0)dia(cx,cy,'rgba(255,180,84,.32)');if(rz.has(k))dia(cx,cy,'rgba(106,169,255,.2)');if(rs.has(k))dia(cx,cy,'rgba(106,169,255,.45)');if(pp[k])dia(cx,cy,'rgba(255,240,170,.6)');if(zone.has(k))dia(cx,cy,'rgba(229,86,74,.6)');
if(C.rocks.has(k)){if(OPT.fx=='off'){g.fillStyle='#fff';g.fillText('🪨',cx,cy-th*.15)}else drawTerrainObstacle(g,cx,cy,tw,th,biome,x,y)}}
const hx=(hp.x-hp.y)*tw/2+ox,hy=(hp.x+hp.y)*th/2+oy,gr=g.createRadialGradient(hx,hy,0,hx,hy,tw*3);
gr.addColorStop(0,'rgba(255,180,84,.28)');gr.addColorStop(1,'rgba(255,180,84,0)');
g.globalCompositeOperation='lighter';g.fillStyle=gr;g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';drawDisplayEffects(g,tw,th,ox,oy);
for(const u of units){if(u.hp<=0&&!displayUnitActive(u))continue;const p=positions.get(u)||displayPosition(u,u.x,u.y,C.rocks),style=displayUnitStyle(u,undefined,tw,th),cx=(p.x-p.y)*tw/2+ox+style.x,cy=(p.x+p.y)*th/2+oy+style.y;
g.save();g.globalAlpha=style.alpha;drawGroundShadow(g,cx,cy,tw,th,u.boss?1.2:1);g.translate(cx,cy);g.scale(style.scale,style.scale);g.fillStyle='#fff';g.font=Math.round(tw*.7)+'px serif';g.fillText(u.sleep?'💤':u.e,0,-th*.3);if(u.boss&&u.hp>0&&C.bossInv())g.fillText('🛡️',tw*.32,-th*.75);g.restore();if(u.hp<=0)continue;
g.fillStyle='#000a';g.fillRect(cx-tw*.25,cy-th*.95,tw*.5,4);g.fillStyle=u===h?'#7fd18b':'#e5564a';g.fillRect(cx-tw*.25,cy-th*.95,tw*.5*Math.max(0,u.hp)/u.max,4);
const states=(u.etats||[]).filter(e=>e.t>0),shown=states.slice(0,3),badgeW=Math.max(11,tw*.5),badgeH=Math.max(10,th*.48),count=Math.min(3,shown.length)+(states.length>3?1:0),start=cx-count*badgeW/2,by=cy-th*1.5;g.font='bold '+Math.max(8,Math.round(tw*.32))+'px sans-serif';
shown.forEach((e,i)=>{const label=DATA.etats[e.id].e+e.t+(e.id=='bouclier'?'·'+e.v:'');g.fillStyle='#120d1add';g.fillRect(start+i*badgeW,by,badgeW,badgeH);g.fillStyle='#fff';g.fillText(label,start+i*badgeW+badgeW/2,by+badgeH/2)});
if(states.length>3){g.fillStyle='#120d1add';g.fillRect(start+3*badgeW,by,badgeW,badgeH);g.fillStyle='#fff';g.fillText('+',start+3*badgeW+badgeW/2,by+badgeH/2)}}
drawDisplayTexts(g,tw,th,ox,oy);updateDisplayTransition();placeBubble();syncAmbience()}
addEventListener('resize',()=>{if(!$('game').classList.contains('hide')){size();draw()}});
try{new ResizeObserver(()=>{if(!$('game').classList.contains('hide')){size();draw()}}).observe($('stage'))}catch(e){}
document.addEventListener('visibilitychange',syncAmbience);
if(motionQuery.addEventListener)motionQuery.addEventListener('change',syncAmbience);else if(motionQuery.addListener)motionQuery.addListener(syncAmbience);
if(typeof showTitle=='function')showTitle();else openMenu('jouer');
