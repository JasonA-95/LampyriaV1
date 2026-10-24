// ÉTAT : sauvegarde, réglages, équipement, butin et petits utilitaires d'interface partagés par tous les écrans.
const VERSION='0.8.1';
// Emplacements de sauvegarde : 1 = clé historique 'lampyria', 2 et 3 = 'lampyria2', 'lampyria3'. L'emplacement actif est choisi sur l'écran titre.
const slotKey=n=>n==1?'lampyria':'lampyria'+n;
const SLOT=(()=>{try{const n=Math.floor(+localStorage.getItem('lampyria_slot'));return n>=1&&n<=3?n:1}catch(e){return 1}})();
const escHtml=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=i=>document.getElementById(i);
let sv,savedData=false;try{const raw=localStorage.getItem(slotKey(SLOT));savedData=raw!=null;sv=JSON.parse(raw)}catch(e){}
sv=sv&&typeof sv=='object'?sv:{};
const hadStoryHistory=!!sv.hist&&typeof sv.hist=='object'&&!Array.isArray(sv.hist);
const SV0={niv:1,xp:0,res:{braise:0,champi:0,laine:0},cap:3,renc:0,deb:['gourmande'],inv:[],eq:{},pity:0,tal:{pv:0,dmg:0,res:0},sp:{eq:[],rg:{},seen:[]},classe:'porte',lueurs:['gourmande'],q:{},hist:{vus:[],flags:{}}};
for(const k in SV0)if(sv[k]==null)sv[k]=JSON.parse(JSON.stringify(SV0[k]));
function normaliseStoryHistory(save,existed,hadHistory){if(!save.hist||typeof save.hist!='object'||Array.isArray(save.hist))save.hist={vus:[],flags:{}};
if(!Array.isArray(save.hist.vus))save.hist.vus=[];save.hist.vus=[...new Set(save.hist.vus.filter(id=>typeof id=='string'))];
if(!save.hist.flags||typeof save.hist.flags!='object'||Array.isArray(save.hist.flags))save.hist.flags={};
if(!existed)save.hist.flags.nouvellePartie=true;else if(!hadHistory&&!save.hist.vus.includes('prologue'))save.hist.vus.push('prologue');return save}
sv=normaliseStoryHistory(sv,savedData,hadStoryHistory);
XP.migrer(sv);
const ALL_SORT_IDS=new Set(Object.values(DATA.classes).flatMap(c=>c.sorts.map(s=>s.id)));
if(!sv.sp||typeof sv.sp!='object'||Array.isArray(sv.sp))sv.sp={eq:[],rg:{},seen:[]};
if(!Array.isArray(sv.sp.eq))sv.sp.eq=[];
if(!sv.sp.rg||typeof sv.sp.rg!='object'||Array.isArray(sv.sp.rg))sv.sp.rg={};
if(!Array.isArray(sv.sp.seen))sv.sp.seen=[];
sv.sp.eq=[...new Set(sv.sp.eq.filter(id=>ALL_SORT_IDS.has(id)))];
sv.sp.seen=[...new Set(sv.sp.seen.filter(id=>ALL_SORT_IDS.has(id)))];
for(const id of Object.keys(sv.sp.rg)){if(!ALL_SORT_IDS.has(id)||typeof sv.sp.rg[id]!='number')delete sv.sp.rg[id];else sv.sp.rg[id]=Math.max(1,Math.min(3,Math.floor(sv.sp.rg[id])))}
for(const k in DATA.res)if(typeof sv.res[k]!='number')sv.res[k]=0;
if(typeof DJ!='undefined')DJ.norm();
for(const k of ['pv','dmg','res'])if(typeof sv.tal[k]!='number')sv.tal[k]=0;
// Nettoyage défensif (code importé ou sauvegarde abîmée) : nombres finis et identifiants connus uniquement, sans quoi l'interface plante ou affiche du texte injecté.
const knownId=(table,id)=>typeof id=='string'&&Object.prototype.hasOwnProperty.call(table,id);
for(const k of ['niv','xp','cap','renc','pity'])if(!Number.isFinite(sv[k]))sv[k]=SV0[k];
sv.inv=[...new Set((Array.isArray(sv.inv)?sv.inv:[]).filter(id=>knownId(DATA.objets,id)))];
if(!sv.eq||typeof sv.eq!='object'||Array.isArray(sv.eq))sv.eq={};
for(const s of Object.keys(sv.eq))if(!knownId(DATA.objets,sv.eq[s]))delete sv.eq[s];
for(const k of ['deb','lueurs'])sv[k]=(Array.isArray(sv[k])?sv[k]:[]).filter(id=>knownId(DATA.lueurs,id));
if(sv.map!=null&&!knownId(DATA.cartes,sv.map))delete sv.map;
if(!DATA.classes[sv.classe])sv.classe='porte';
// Si l'écriture échoue (stockage plein ou bloqué), le joueur est prévenu une fois. `tto` est déclaré ici car toast() peut être appelé dès le chargement (migration d'ancienne sauvegarde).
let saveWarned=false,tto;
const store=()=>{try{sv.maj=Date.now();localStorage.setItem(slotKey(SLOT),JSON.stringify(sv))}catch(e){if(!saveWarned){saveWarned=true;toast('Sauvegarde impossible : stockage du navigateur plein ou bloqué. Exporte ta sauvegarde depuis le menu Jouer.')}}};
const heroEmoji=()=>(sv.hero&&sv.hero.asp)||DATA.classes[cfg.classe].e;
if(savedData&&!hadStoryHistory)store();
const cfg={classe:sv.classe,renc:0,test:false,lueurs:sv.lueurs.filter(k=>DATA.lueurs[k])};
const saveCfg=()=>{sv.classe=cfg.classe;sv.lueurs=[...cfg.lueurs];store()};
const sum=()=>cfg.lueurs.reduce((a,k)=>a+DATA.lueurs[k].t,0);
const avail=()=>cfg.test?Object.keys(DATA.lueurs):sv.deb;
const capNow=()=>cfg.test?12:sv.cap;
function applyRang(sort,rang){const s={...sort,r:[...sort.r]},rank=Math.max(1,Math.min(3,Math.floor(rang||1)));
for(let i=0;i<rank-1;i++){const b=sort.rg[i]||{};if(b.dmg)s.dmg=(s.dmg||0)+b.dmg;if(b.pa)s.pa+=b.pa;if(b.cd)s.cd=Math.max(0,(s.cd||0)+b.cd);if(b.rmax)s.r[1]+=b.rmax;if(b.push)s.push=(s.push||0)+b.push;if(b.garde)s.garde=(s.garde||0)+b.garde}
s.rang=rank;return s}
function sortsDispo(){return DATA.classes[cfg.classe].sorts.filter(s=>cfg.test||s.niv<=sv.niv).map(s=>applyRang(s,cfg.test?3:(sv.sp.rg[s.id]||1)))}
const spSpent=()=>Object.values(sv.sp.rg).reduce((n,r)=>n+(r>=3?3:r>=2?1:0),0),spLeft=()=>Math.max(0,sv.niv-1-spSpent());
function sortsEquipes(){const available=new Map(sortsDispo().map(s=>[s.id,s]));return sv.sp.eq.map(id=>available.get(id)).filter(Boolean)}
function syncSorts(){const all=DATA.classes[cfg.classe].sorts,available=new Set(sortsDispo().map(s=>s.id)),unlocked=all.filter(s=>s.niv<=sv.niv),first=all[0].id;
sv.sp.eq=sv.sp.eq.filter(id=>available.has(id));if(!sv.sp.eq.includes(first))sv.sp.eq.unshift(first);
for(const s of unlocked)if(!sv.sp.seen.includes(s.id)&&!sv.sp.eq.includes(s.id)&&sv.sp.eq.length+cfg.lueurs.length<6)sv.sp.eq.push(s.id);
sv.sp.seen=[...new Set([...sv.sp.seen,...unlocked.map(s=>s.id)])];
while(sv.sp.eq.length+cfg.lueurs.length>6){let i=-1;for(let j=sv.sp.eq.length-1;j>=0;j--)if(sv.sp.eq[j]!==first){i=j;break}if(i<0)break;sv.sp.eq.splice(i,1)}store()}
function normL(){const av=avail(),cap=capNow();cfg.lueurs=cfg.lueurs.filter(k=>av.includes(k));while(sum()>cap||cfg.lueurs.length>4)cfg.lueurs.pop();syncSorts()}

// ---------- petits outils d'interface ----------
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.innerHTML=x;return e};
function btn(t,sub,cls,fn,dis){const b=el('button',cls||'','<span class="nm">'+t+'</span>'+(sub?'<span class="mt">'+sub+'</span>':''));b.disabled=!!dis;if(fn)b.onclick=e=>{if(typeof playSound=='function')playSound('click');fn(e)};return b}
function toast(t){const e=$('toast');e.textContent=t;e.classList.remove('hide');clearTimeout(tto);tto=setTimeout(()=>e.classList.add('hide'),2600)}
const closeModal=()=>$('modal').classList.add('hide');
function modal(node,btns){const c=$('mcard');c.innerHTML='';c.appendChild(node);const f=el('div','mbtns');
(btns||[]).forEach(([t,fn,cls])=>f.appendChild(btn(t,'',cls||'',()=>{closeModal();if(fn)fn()})));c.appendChild(f);$('modal').classList.remove('hide')}
const SPK={Gourmande:'#b8620a',Peureuse:'#a07800',Colérique:'#c93a2a',Rêveuse:'#2a6db0',Têtue:'#6a4fb0',Farceuse:'#1f8a64',Mélancolique:'#4a56b8','Maître Lampiste':'#c17b26','Chambellan Poussière':'#747080','Le Roi Éteint':'#5a647d','La Passeuse':'#268a84','Le marchand':'#628d54','Le héros':'#75633a'};
let bub={at:null,t:null};
function hideBubble(){clearTimeout(bub.t);bub.at=null;$('bubble').classList.add('hide')}
// Bulle de dialogue au-dessus d'un personnage (o.at = case {x,y}, sinon le héros ; o.stay = reste jusqu'à fermeture)
function speak(who,txt,o){o=o||{};const c=SPK[who]||'#8a5a1a',B=$('bubble');B.style.setProperty('--c',c);
B.innerHTML='<span class="who" style="color:'+c+'">'+who+'</span><span class="tx">'+txt+'</span><i class="tail"></i>';B.classList.remove('hide');if(typeof playSound=='function')playSound('dialogue');
clearTimeout(bub.t);bub.at=o.at||'hero';if(!o.stay)bub.t=setTimeout(hideBubble,6000);if(typeof placeBubble=='function')placeBubble()}
const say=k=>{let r=DATA.repliques[k];if(!r)return;if(Array.isArray(r[0])){const known=r.filter(v=>Object.keys(DATA.lueurs).some(id=>DATA.lueurs[id].n==v[0]&&(sv.deb||[]).includes(id)));const pool=known.length?known:[r[0]];r=pool[Math.floor(Math.random()*pool.length)]}speak(...r)};
const msg=t=>$('msgEl').textContent=t;

// ---------- ressources ----------
const rn=k=>DATA.res[k].split(' ')[0];
const rl=o=>Object.keys(o).map(k=>rn(k)+' '+o[k]).join(' ');
const canPay=c=>Object.keys(c).every(k=>sv.res[k]>=c[k]);
const pay=c=>Object.keys(c).forEach(k=>sv.res[k]-=c[k]);
const costChips=c=>'<span class="chips">'+Object.keys(c).map(k=>'<span class="chip '+(sv.res[k]>=c[k]?'ok':'no')+'">'+rn(k)+' '+c[k]+'</span>').join('')+'</span>';

// ---------- description des sorts ----------
const rg=r=>r[0]==r[1]?r[0]:r[0]+'-'+r[1];
function descrBody(s){const a=[s.pa+' PA, '+(s.r[1]?'portée '+rg(s.r):'sur soi')+(s.los?', ligne de vue':'')];
if(s.dmg)a.push('inflige '+s.dmg+' dégâts'+(s.aoe!=null?' en zone (rayon '+s.aoe+')':'')+(s.drain?' et te soigne (plus ta vie est basse, plus tu récupères)':''));
const describeEtat=e=>{const n=DATA.etats[e.id]?.n||e.id,v=e.v,t=e.t;
if(e.id=='brule')return'brûle '+v+' PV par tour pendant '+t+' tours';if(e.id=='poison')return'empoisonne : '+v+' PV par tour pendant '+t+' tours, soins reçus réduits de moitié';
if(e.id=='etourdi')return'étourdit '+t+' tour(s) (sans effet sur les boss)';if(e.id=='bouclier')return'donne un bouclier de '+v+' points pendant '+t+' tours';
if(e.id=='ralenti')return'ralentit : -'+v+' PM pendant '+t+' tour(s)';if(e.id=='affaibli')return'affaiblit : dégâts infligés réduits de '+v+' % pendant '+t+' tours';return n+' pendant '+t+' tours'};
if(s.etats&&s.etats.length)a.push(...s.etats.map(describeEtat));if(s.etatsSoi&&s.etatsSoi.length)a.push(...s.etatsSoi.map(e=>'sur toi : '+describeEtat(e)));
if(s.heal)a.push('soigne '+s.heal+' PV');if(s.tp)a.push('te téléporte sur une case libre');if(s.push)a.push('repousse la cible de '+s.push+' case(s)');
if(s.charge)a.push('se jette sur la cible');if(s.recul)a.push('recule d\'une case après le tir');if(s.garde)a.push('dégâts réduits de moitié pendant '+s.garde+' tour(s), sans bloquer le déplacement');
if(s.rage)a.push('ta prochaine attaque inflige le double, mais -1 PM au tour suivant');
if(s.mur)a.push('dégâts subis réduits de moitié pendant 2 tours, mais tu ne peux pas bouger');
if(s.sleep)a.push('endort la cible 1 tour (réveil si elle subit des dégâts), sans effet sur les boss');
if(s.swap)a.push('échange ta place avec la cible');if(s.cd)a.push('recharge '+s.cd+' tours');if(s.rang)a.push('rang '+s.rang);return a.join(', ')+'.'}
const descr=s=>s.n+' : '+descrBody(s);

// ---------- talents : 1 point par niveau gagné ----------
const TAL=[['pv','Vitalité','+5 PV par point',5,10,'❤️'],['dmg','Force','+1 dégât par point',1,6,'💪'],['res','Endurance','+2 % de résistance par point',2,6,'🛡️']];
const talSpent=()=>TAL.reduce((a,t)=>a+(sv.tal[t[0]]||0),0),talLeft=()=>Math.max(0,sv.niv-1-talSpent());
// ---------- équipement ----------
const RAR=['Commun','Rare','Épique','Légendaire'],RC=['#c9c2d6','#6fb7ff','#c58bff','#ffb454'];
const SLOTS=[['arme','Arme','⚔️'],['tete','Tête','🎩'],['corps','Corps','🧥'],['bottes','Bottes','👢'],['acc1','Accessoire 1','💍'],['acc2','Accessoire 2','💍']];
const slotType=s=>s.startsWith('acc')?'acc':s;
const fmtSt=st=>Object.keys(st).map(k=>'+'+st[k]+(k=='pv'?' PV':k=='dmg'?' dégâts':k=='res'?' % rés.':' PM')).join(' · ');
function gear(){const t={pv:0,dmg:0,res:0,pm:0},cnt={};
for(const [s] of SLOTS){const id=sv.eq[s];if(!id||!sv.inv.includes(id))continue;const o=DATA.objets[id];for(const k in o.st)t[k]+=o.st[k];if(o.set)cnt[o.set]=(cnt[o.set]||0)+1}
for(const k in cnt){const b=DATA.sets[k].bonus;for(const n in b)if(cnt[k]>=+n)for(const s in b[n])t[s]+=b[n][s]}
for(const [k,,,v] of TAL)t[k]+=v*(sv.tal[k]||0);
t.res=Math.min(t.res,40);return{t,cnt}}
function equip(slot,id){if(id){for(const s in sv.eq)if(sv.eq[s]==id)delete sv.eq[s];sv.eq[slot]=id}else delete sv.eq[slot];store()}
function autoEquip(id){const t=DATA.objets[id].slot,c=t=='acc'?['acc1','acc2']:[t],s=c.find(x=>!sv.eq[x]||!sv.inv.includes(sv.eq[x]));if(s){sv.eq[s]=id;return true}return false}
// Butin : chaque objet a sa chance ; garantie anti-malchance (4 combats sans objet, 1 contre un boss).
function rollDrops(ri){const R=DATA.rencontres[ri],D=R.drops||[],got=[];
for(const d of D)if(!sv.inv.includes(d.id)&&Math.random()*100<d.p)got.push(d.id);
if(!got.length){const left=D.filter(d=>!sv.inv.includes(d.id));sv.pity=(sv.pity||0)+1;
if(left.length&&sv.pity>=(R.m.some(m=>m.boss)?1:4))got.push(left[Math.floor(Math.random()*left.length)].id)}
if(got.length)sv.pity=0;got.forEach(id=>sv.inv.push(id));return got}
