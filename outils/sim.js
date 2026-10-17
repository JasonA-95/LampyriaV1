// Simulateur de combats : un robot joue le héros avec des sorts, talents et équipement typiques de chaque palier.
// Usage (depuis la racine du jeu) : node outils/sim.js   — affiche, pour chaque rencontre et chaque classe, victoires, PV perdus et durée.
// Limites : le robot ne sait pas bien jouer le boss de la Serre (cendre) avec l'Archer ; vérifier ces cas à la main.
const fs=require('fs'),vm=require('vm');
const G=require('path').join(__dirname,'..')+'/';
function load(dir){const ctx={console,Math};vm.createContext(ctx);
for(const f of ['donnees','histoire','xp','moteur'])try{vm.runInContext(fs.readFileSync(dir+f+'.js','utf8').replace(/^const /gm,'var ').replace(/^class Combat/m,'var Combat=class Combat'),ctx)}catch(e){}
return ctx}
function applyRang(sort,rang){const s={...sort,r:[...sort.r]},rank=Math.max(1,Math.min(3,Math.floor(rang||1)));
for(let i=0;i<rank-1;i++){const b=(sort.rg||[])[i]||{};if(b.dmg)s.dmg=(s.dmg||0)+b.dmg;if(b.pa)s.pa+=b.pa;if(b.cd)s.cd=Math.max(0,(s.cd||0)+b.cd);if(b.rmax)s.r[1]+=b.rmax;if(b.push)s.push=(s.push||0)+b.push;if(b.garde)s.garde=(s.garde||0)+b.garde}s.rang=rank;return s}
// équipement typique : meilleurs objets déjà obtenus à l'étape i (zone vaincue)
const ZONES=[['tisonnier','chaussons','echarpe'],['chapeau','amulette','clochette','capuche','manteau','gilet','epee_braise'],['bague','sceptre','cape','casquette','veste_liv','bottes_liv'],['plume','bottes_cha','lanterne_cha'],['lame_roseau','capuchon_cendre','tunique_roseau','sandales_roseau','bracelet_cendre','voile_brume','perle_marais','bottes_vase'],['lance_libellule','manteau_brume'],['baguette_duchesse','couronne_cendre','robe_duchesse','eventail_cendre'],['turban_sable','tunique_fil','sandales_dunes','bracelet_chaussette','amulette_grain'],[],[],['pancarte_general','casque_negociateur']];
function gearAt(D,zone){const have=new Set();for(let z=0;z<=Math.min(zone,ZONES.length-1);z++)ZONES[z].forEach(i=>have.add(i));
const sc=o=>(o.st.pv||0)+5*(o.st.dmg||0)*2+2*(o.st.res||0)+(o.st.pm||0)*20,by={arme:[],tete:[],corps:[],bottes:[],acc:[]};
for(const id of have){const o=D.objets[id];if(o)by[o.slot].push(o)}
const t={pv:0,dmg:0,res:0,pm:0};for(const s in by){by[s].sort((a,b)=>sc(b)-sc(a));for(const o of by[s].slice(0,s=='acc'?2:1))for(const k in o.st)t[k]+=o.st[k]}return t}
function build(D,classe,niv,zone){const pts=niv-1,t={pv:0,dmg:0,res:0};let left=pts;
for(const [k,max] of [['pv',10],['dmg',6],['res',6]]){}
const order=['pv','dmg','res','pv','dmg','res'];const caps={pv:10,dmg:6,res:6};while(left>0&&(t.pv<10||t.dmg<6||t.res<6)){for(const k of ['pv','dmg','res']){if(left>0&&t[k]<caps[k]){t[k]++;left--}}}
const g=gearAt(D,zone);const gear={pv:g.pv+5*t.pv,dmg:g.dmg+t.dmg,res:Math.min(40,g.res+2*t.res),pm:g.pm};
// sorts : points de sort = niv-1 ; rang 2 = 1 pt, rang 3 = 2 pts de plus, on monte d'abord les sorts qui font le plus de dégâts
const base=D.classes[classe].sorts.filter(s=>s.niv<=niv),rg={};let sp=niv-1;
const rank=s=>(s.dmg||0)*(s.aoe!=null?1.6:1)/s.pa;const ord=[...base].sort((a,b)=>rank(b)-rank(a));
for(const s of ord){if(sp>=1){rg[s.id]=2;sp-=1}}for(const s of ord){if(rg[s.id]==2&&sp>=2){rg[s.id]=3;sp-=2}}
let sorts=base.map(s=>applyRang(s,rg[s.id]||1));
// barre de 6 : la lanterne contient la Gourmande (3 de capacité) ; on garde les 5 meilleurs sorts de classe
const lueurs=['gourmande'];const rest=sorts.slice(1).sort((a,b)=>rank(b)-rank(a)),aoe=rest.find(x=>x.aoe!=null&&x.dmg);let keep=rest.slice(0,4);if(aoe&&!keep.includes(aoe))keep[3]=aoe;sorts=sorts.slice(0,1).concat(keep);
return{gear,sorts,lueurs}}
function rand(seed){let s=seed>>>0;return()=>{s=(s+0x6d2b79f5)>>>0;let n=s;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return((n^(n>>>14))>>>0)/4294967296}}
function foeScale(m,kh,kd){m.hp=m.max=Math.max(1,Math.round(m.max*kh));m.d=Math.round(m.d*kd);if(m.sort){m.sort=JSON.parse(JSON.stringify(m.sort));if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd);if(m.sort.heal)m.sort.heal=Math.round(m.sort.heal*kd)}if(m.mort){m.mort={...m.mort,dmg:Math.round(m.mort.dmg*kd)}}}
// un combat complet joué par le robot ; renvoie {win,hpLoss,turns}
function fight(ctx,classe,niv,renc,kh,kd,opts={}){if(!ctx.DATA0)ctx.DATA0=ctx.DATA;const S0=ctx.DATA0,D=JSON.parse(JSON.stringify({classes:S0.classes,lueurs:S0.lueurs,rencontres:S0.rencontres,rochers:S0.rochers,heros:S0.heros,taille:S0.taille,objets:S0.objets,etats:S0.etats}));
D.rencontres[renc].m.forEach(m=>{if(!m.form)foeScale(m,kh,kd)});
const b=build(D,classe,niv,opts.zone??renc),cfg={classe,renc,niv,gear:b.gear,sorts:b.sorts,lueurs:b.lueurs};
ctx.DATA=D;const C=new ctx.Combat(D,cfg);
const dmgOf=(s)=>((s.dmg||0)+C.bonus);
let guard=0;
while(!C.result&&C.turn<=40&&guard++<4000){
 let acted=true,iter=0;
 while(acted&&iter++<30&&!C.result){acted=false;const h=C.hero;
  // 1. soin si bas
  let best=null;
  C.S.forEach((s,i)=>{if(C.pa<s.pa||C.cd[i]>0)return;
   if(s.heal&&h.hp<h.max*.55){const t=C.ranged(i)[0];if(t&&(!best||best.score<100))best={i,x:t[0],y:t[1],score:100}}
   if(!s.dmg)return;const tiles=C.ranged(i);
   for(const [x,y] of tiles){const T=s.aoe!=null?C.foes.filter(f=>f.hp>0&&C.dist(f,{x,y})<=s.aoe):[C.at(x,y)].filter(Boolean);
    let sc=0;for(const f of T){if(f===h)continue;if(f.boss&&C.shield(f)){if(s.aoe!=null&&f.cendre)sc+=8;continue}if(f.form&&C.foes.some(g=>g.boss&&C.shield(g)))sc+=40;const d=Math.min(f.hp,dmgOf(s));sc+=d+(d>=f.hp?12:0)+(f.ia=='soin'?6:0)}
    if(T.includes(h))sc=-1;sc=sc/ s.pa+(sc?.5:0);if(sc>0&&(!best||sc>best.score))best={i,x,y,score:sc}}});
  if(best&&best.score>=0){const r=C.cast(best.i,best.x,best.y);if(r.ok){acted=true;continue}}
  // 2. déplacement vers une case d'où un sort peut partir
  if(C.pm>0&&!best){const reach=C.reach(),origin={x:h.x,y:h.y};let pick=null;
   const foes=C.foes.filter(f=>f.hp>0&&!f.form);const target=foes.sort((a,b)=>C.dist(origin,a)-C.dist(origin,b))[0];if(!target)break;
   const ranged=C.S.some(s=>s.dmg&&s.r[1]>1);
   for(const k of Object.keys(reach)){const [x,y]=k.split(',').map(Number);if(reach[k]<=0)continue;h.x=x;h.y=y;let can=0;C.S.forEach((s,i)=>{if(s.dmg&&C.pa>=s.pa&&C.cd[i]<=0&&C.ranged(i).length)can++});
    const d=C.dist({x,y},target),sc=can*100-(ranged?Math.abs(d-4):d)-reach[k]*.1;if(!pick||sc>pick.sc)pick={x,y,sc,can}}
   h.x=origin.x;h.y=origin.y;
   if(pick&&pick.sc>-1e9){const before=C.dist(origin,target);const r=C.move(pick.x,pick.y);if(r.ok){acted=true}}}
 }
 if(C.result)break;
 for(const f of C.foes){if(f.hp<=0||C.result)continue;C.foeTurn(f)}
 if(C.result)break;C.newTurn()}
const win=C.result=='win';return{win,hpLoss:win?1-C.hero.hp/C.hero.max:1,turns:C.turn,heroMax:C.hero.max}}
function stats(ctx,classe,niv,renc,kh,kd,n=40){let w=0,loss=0,turns=0;for(let i=0;i<n;i++){const r=fight(ctx,classe,niv,renc,kh,kd);if(r.win){w++;loss+=r.hpLoss;turns+=r.turns}}return{win:w/n,loss:w?loss/w:1,turns:w?turns/w:0}}
module.exports={load,fight,stats,build,G};
if(require.main===module){const ctx=load(process.argv[2]||G);const N=ctx.DATA.rencontres.length;
console.log('rencontre | niv | classe | victoires | PV perdus (victoires) | tours');
for(let r=0;r<N;r++){const niv=(ctx.DATA0||ctx.DATA).rencontres[r].niv||1;for(const c of ['porte','archer','mage']){const s=stats(ctx,c,niv,r,1,1,30);console.log(String(r).padStart(2),String(niv).padStart(3),c.padEnd(7),(s.win*100).toFixed(0).padStart(4)+'%',(s.loss*100).toFixed(0).padStart(4)+'%',s.turns.toFixed(1))}}}
