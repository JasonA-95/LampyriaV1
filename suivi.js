// Suivi de quête : où aller pour la quête suivie (cartes concernées, PNJ à voir, sortie à prendre). Fonctions pures sur DATA et l'état d'une quête ; ne modifie rien.
const SUIVI=(function(){
const C=()=>DATA.cartes,base=r=>DATA.rencontres[r].base??r;
const DIR={E:[1,-1],W:[-1,1],N:[-1,-1],S:[1,1]}; // sens d'une sortie de bord dans le plan (x,y) : u=x-y (E/W), v=x+y (N/S)
const prete=(q,s,res)=>!!s&&s.s==1&&(s.n||0)>=q.need&&(!q.cost||Object.keys(q.cost).every(k=>((res||{})[k]||0)>=q.cost[k]));
const mapsNpc=name=>Object.keys(C()).filter(k=>(C()[k].npcs||[]).some(n=>n.n==name));
function rendeur(id){const q=DATA.quetes[id];if(q.rend||q.donneur)return q.rend||q.donneur;for(const k in C()){const n=(C()[k].npcs||[]).find(n=>(n.quests||[]).includes(id));if(n)return n.n}return null}
// Où aller : {pret, npc:[noms], maps:[cartes]} ; null si la quête n'est pas en cours.
function lieux(id,s,res){const q=DATA.quetes[id];if(!q||!s||s.s!=1)return null;
if(prete(q,s,res)){const n=rendeur(id);return{pret:1,npc:n?[n]:[],maps:n?mapsNpc(n):[]}}
const got=s.got||[];
if(q.kind=='pick'||q.kind=='hide'){const f=q.kind=='pick'?'picks':'hides';return{npc:[],maps:Object.keys(C()).filter(k=>(C()[k][f]||[]).some((p,i)=>p.quest==id&&!got.includes(k+i)))}}
if(q.kind=='livre'){const r=[].concat(q.to||[]).filter(n=>!got.includes(n));return{npc:r,maps:[...new Set(r.flatMap(mapsNpc))]}}
if(q.kind=='win')return{npc:[],maps:q.maps||Object.keys(C()).filter(k=>(C()[k].groups||[]).some(g=>base(g.renc)==q.renc))};
const n=rendeur(id);return{npc:n?[n]:[],maps:n?mapsNpc(n):[]}}
// Chemin : null = déjà sur une carte cible ; undefined = aucune route ; sinon la sortie de la carte courante à prendre.
function route(from,maps){if(!maps||!maps.length||maps.includes(from))return null;const T=new Set(maps),seen=new Set([from]),Q=[[from,null]];
while(Q.length){const[k,first]=Q.shift();for(const e of (C()[k]||{}).exits||[]){const t=e.to;if(!C()[t]||seen.has(t))continue;seen.add(t);const f=first||e;if(T.has(t))return f;Q.push([t,f])}}return undefined}
return{lieux,route,prete,DIR}})();
