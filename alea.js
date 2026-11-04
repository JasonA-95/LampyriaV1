// ALEA : groupes de monstres aléatoires (1 à 4) tirés parmi les monstres de la zone, et nouveau groupe après une victoire.
// - À l'entrée d'une carte, chaque groupe « libre » est remplacé par une composition aléatoire. Restent fixes : boss, élites, groupes de la progression
//   d'histoire (≤ 24), groupes visés par une quête de combat ou une scène. Donjons : jamais touchés.
// - Après une victoire (hors donjon, boss, élite), un autre groupe aléatoire apparaît sur la carte au bout de ALEA.DELAY ms.
// - Les rencontres créées sont ajoutées à la fin de DATA.rencontres (base:-1 : sans effet sur l'histoire ni les quêtes) ; elles ne sont jamais retirées
//   (un combat ou une scène peut encore s'y référer après un changement de carte) : quelques Ko par groupe seulement.
const ALEA=(()=>{
const R=DATA.rencontres,C=DATA.cartes,BASE=R.length,MAXN=4,SL=[[10,3],[11,8],[9,10],[11,5]];
// Menace par taille de groupe. KH/KD : facteurs déjà appliqués aux groupes d'origine (on les retire du monstre source) ; NH/ND : facteurs voulus ici,
// relatifs à un groupe de 3 (réglés au simulateur pour viser ~55 % de PV perdus quelle que soit la taille : seul, un monstre devait être bien plus solide).
const KH={1:1.65,2:1.25,3:1,4:.85,5:.75},KD={1:1.25,2:1.1,3:1,4:.95,5:.9},NH={1:3.3,2:1.62,3:1,4:.68},ND={1:1.75,2:1.19,3:1,4:.87},hp0=n=>100+4.5*n,d0=n=>20+.7*n;
const A={DELAY:30000,gen:0,BASE};
let FIX=null,POOL={};
const fixSet=()=>{if(FIX)return FIX;FIX=new Set();
for(const q of Object.values(DATA.quetes||{})){if(q.kind=='win'&&q.renc!=null)FIX.add(q.renc);if(q.emb!=null)FIX.add(q.emb)}
for(const s of Object.values(DATA.scenes||{})){const d=s&&s.declencheur;if(d&&d.renc!=null&&(d.quand=='avantCombat'||d.quand=='apresCombat'))FIX.add(d.renc)}
return FIX};
const isBoss=r=>r.n.includes('boss')||r.m.some(m=>m.boss);
// Un groupe est fixe s'il compte pour l'histoire, une quête ou une scène (ou s'il n'est pas un groupe ordinaire).
A.isFixed=g=>{const r=R[g.renc];if(!r||g.hide||g.npc||g.escort)return true;
// Une copie (r.base) d'un groupe d'origine n'est jamais indispensable : l'original reste sur sa carte pour l'histoire et les quêtes.
return isBoss(r)||r.type=='elite'||(r.base==null&&(g.renc<=24||fixSet().has(g.renc)))};
const normal=g=>{const r=R[g.renc];return r&&!g.hide&&!g.npc&&!g.escort&&!isBoss(r)&&r.type!='elite'};
const median=a=>{const s=[...a].sort((x,y)=>x-y);return s.length?s[Math.floor(s.length/2)]:0};
A.niv=name=>median(((C[name]||{}).groups||[]).map(g=>R[g.renc]&&R[g.renc].niv).filter(Boolean));
// Monstres de la zone : ceux des groupes ordinaires de la carte et des cartes voisines (2 sorties au plus), à ±3 niveaux (élargi si trop peu).
A.pool=name=>{if(POOL[name])return POOL[name];const niv=A.niv(name),seen=new Set([name]);let front=[name];
for(let h=0;h<2;h++){const nx=[];for(const k of front)for(const e of ((C[k]||{}).exits||[])){if(!seen.has(e.to)&&C[e.to]&&!DJ.of(e.to)){seen.add(e.to);nx.push(e.to)}}front=nx}
const all=[];for(const k of seen)for(const g of (C[k].groups||[])){if(!normal(g))continue;const r=R[g.renc];for(const m of r.m)if(!m.boss&&!m.form&&!m.renfort&&m.hp>0)all.push({m,niv:r.niv,size:r.m.length})}
for(const w of [3,6,99]){const by={};for(const t of all)if(Math.abs(t.niv-niv)<=w){const o=by[t.m.n];if(!o||Math.abs(t.niv-niv)<Math.abs(o.niv-niv))by[t.m.n]=t}
const P=Object.values(by);if(P.length>=3||w==99)return POOL[name]=P}};
const snipe=m=>!!(m.sort&&m.sort.r&&m.sort.r[1]>=7);
// Source du butin : le premier groupe ordinaire de la carte (ressources et objets de la zone).
const source=name=>{const g=((C[name]||{}).groups||[]).find(normal);return g?R[g.renc]:null};
// Crée une rencontre aléatoire pour la carte ; renvoie son indice dans DATA.rencontres (null si la carte n'a pas de monstres ordinaires).
A.compose=name=>{const P=A.pool(name),src=source(name);if(!P||!P.length||!src)return null;const niv=A.niv(name)||src.niv,n=1+Math.floor(Math.random()*MAXN),pick=[];let heal=0,sn=0;
for(let i=0;pick.length<n&&i<60;i++){const t=P[Math.floor(Math.random()*P.length)],m=t.m;
if(m.ia=='soin'&&(n==1||heal>=1))continue;if(snipe(m)&&sn>=1)continue;pick.push(t);if(m.ia=='soin')heal++;if(snipe(m))sn++}
if(!pick.length||pick.every(t=>t.m.ia=='soin'))return null;
const N=pick.length,ms=pick.map((t,i)=>{const o=JSON.parse(JSON.stringify(t.m)),f=hp0(niv)/hp0(t.niv),fd=d0(niv)/d0(t.niv),kh=NH[N]/KH[t.size],kd=ND[N]/KD[t.size];
o.x=SL[i][0];o.y=SL[i][1];o.hp=o.max=Math.max(1,Math.round(o.max*f*kh));o.d=Math.round(o.d*fd*kd);
if(o.sort){if(o.sort.dmg!=null)o.sort.dmg=Math.round(o.sort.dmg*fd*kd);if(o.sort.heal)o.sort.heal=Math.round(o.sort.heal*fd*kd)}
if(o.mort)o.mort={...o.mort,dmg:Math.round(o.mort.dmg*fd*kd)};o.sortCd=0;return o});
R.push({n:src.n,biome:src.biome,niv,loot:JSON.parse(JSON.stringify(src.loot||{})),m:ms,drops:JSON.parse(JSON.stringify(src.drops||[])),base:-1});return R.length-1};
// Groupes d'une carte à l'entrée : copie des groupes de la carte, les libres remplacés par une composition aléatoire. Jamais dans un donjon.
A.groups=(name,list)=>{A.gen++;const out=list.map(q=>({...q}));if(DJ.of(name))return out;
return out.map(g=>{if(A.isFixed(g))return g;const i=A.compose(name);return i==null?g:{...g,renc:i}})};
// Case libre pour un nouveau groupe : dans la carte, loin du héros, des groupes, des PNJ et des bords de sortie.
A.cell=()=>{const d=C[EX.map],al=EX.groups.filter(q=>!q.dead),near=(x,y,o,r)=>Math.abs(x-o.x)+Math.abs(y-o.y)<r,all=[],ctr=[];
for(let x=-20;x<=50;x++)for(let y=-20;y<=50;y++){if(!DATA.exin(x,y)||(d.rocks||[]).some(r=>r[0]==x&&r[1]==y)||DATA.exside(x,y).length)continue;
if(near(x,y,EX,5)||al.some(q=>near(x,y,q,3)))continue;
if(['npcs','nodes','picks','hides','coffres','etins'].some(k=>(d[k]||[]).some(o=>near(x,y,o,1)))||EX.nodes.some(o=>near(x,y,o,1)))continue;
if((d.exits||[]).some(e=>e.x!=null&&near(x,y,e,2)))continue;(DATA.in(x,y)?ctr:all).push([x,y])}
const P=ctr.length?ctr:all;return P.length?P[Math.floor(Math.random()*P.length)]:null};
// Après une victoire : un autre groupe aléatoire apparaît sur la carte au bout de A.DELAY ms (annulé si on change de carte).
A.after=g0=>{if(!g0||!normal(g0)||DJ.of(EX.map))return false;const map=EX.map,gen=A.gen;
setTimeout(()=>{if(EX.map!==map||A.gen!==gen||DJ.of(map))return;const i=A.compose(map),c=i==null?null:A.cell();if(i==null)return;if(!c){R.pop();return}
EX.groups.push({x:c[0],y:c[1],renc:i});if(EX.on&&typeof EX.draw=='function')EX.draw()},A.DELAY);return true};
return A})();
