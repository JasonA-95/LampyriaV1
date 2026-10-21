// DONJONS : relique à posséder pour entrer, puis salles à enchaîner dans l'ordre (pas de raccourci vers le boss).
// - La relique se gagne en battant des monstres dans la zone du donjon (≈20 % par victoire, garantie après 6 victoires sans relique).
// - Elle est consommée à l'entrée. Dans le donjon, vaincre tous les groupes d'une salle téléporte à la suivante.
// - Aucun retour en arrière ; quitter dès la 1re salle ou mourir perd la progression et la relique.
const DJ={
D:{
terrier:{n:'Terrier de la Mère',e:'🍄',rel:'Relique du Terrier',hub:'clairiere',salles:['terrier1','terrier2','terrier3'],zone:['foret','sentier','clairiere']},
enclos:{n:'Enclos du Troupeau',e:'🐑',rel:'Relique de l’Enclos',hub:'bergerie',salles:['enclos1','enclos2','enclos3'],zone:['collines','paturage','bergerie']},
archives:{n:'Archives du Greffier',e:'📜',rel:'Relique des Archives',hub:'bureaux',salles:['archives1','archives2','archives3'],zone:['manoir','hall','bureaux']},
reves:{n:'Rêves de la Baronne',e:'🌙',rel:'Relique des Rêves',hub:'ile',salles:['reves1','reves2','reves3'],zone:['marais','gue','ile']},
pyr:{n:'Pyramide du Sphinx',e:'🦶',rel:'Relique de la Pyramide',hub:'puits',salles:['pyr1','pyr2','pyr3'],zone:['dunes','mirage','puits']},
crypte:{n:'Crypte du Gardien',e:'⚰️',rel:'Relique de la Crypte',hub:'jardin',salles:['crypte1','crypte2','crypte3'],zone:['parvis','temple','cloitre','jardin']}},
note:'',
of(m){return Object.keys(DJ.D).find(k=>DJ.D[k].salles.includes(m))||null},
zone(m){return Object.keys(DJ.D).find(k=>DJ.D[k].zone.includes(m))||null},
rel(id){return Math.max(0,Math.floor(sv.rel&&sv.rel[id])||0)},
owner(e){for(const k in DATA.cartes)if(DATA.cartes[k].exits.includes(e))return k;return null},
norm(){if(!sv.rel||typeof sv.rel!='object'||Array.isArray(sv.rel))sv.rel={};if(typeof sv.relPity!='number')sv.relPity=0;if(!sv.dj||typeof sv.dj!='object')sv.dj=null},
// Verrou d'une sortie (texte non vide = fermée)
lock(e){const o=DJ.owner(e);if(!o)return'';
for(const id in DJ.D){const d=DJ.D[id],i=d.salles.indexOf(o);
if(o==d.hub&&e.to==d.salles[0])return DJ.rel(id)>0?'':'Il te faut la '+d.rel+' '+d.e+' pour entrer. Elle tombe sur les monstres de la zone.';
if(i>=0){if(e.to==d.salles[i+1])return'La salle est gardée : bats tous les monstres pour avancer.';
if(i==0)return'';if(i==d.salles.length-1&&sv.dj&&sv.dj.fini)return'';return'Le passage s’est refermé derrière toi : avance en battant les monstres.'}}
return''},
warn(e){const o=DJ.owner(e),id=DJ.of(o);if(!id)return'';const d=DJ.D[id];return o==d.salles[0]&&e.to==d.hub?' Attention : quitter le donjon fait perdre ta relique.':''},
// Passage d'une sortie : consomme la relique, abandonne ou termine le donjon. Renvoie la sortie à utiliser.
pass(e){DJ.note='';const o=DJ.owner(e);
for(const id in DJ.D){const d=DJ.D[id],i=d.salles.indexOf(o);
if(o==d.hub&&e.to==d.salles[0]){sv.rel[id]=DJ.rel(id)-1;sv.dj={id,i:0,fini:false};DJ.note=' '+d.rel+' consommée.';return e}
if(i==0&&e.to==d.hub){sv.dj=null;return e}
if(i==d.salles.length-1&&e.to==d.salles[i-1]){const b=DATA.cartes[d.salles[0]].exits.find(x=>x.to==d.hub);sv.dj=null;return{...e,to:d.hub,tx:b.tx,ty:b.ty}}}
return e},
// Après une victoire : si la salle est vidée, passe à la suivante (ou termine le donjon). Renvoie un message.
after(){const o=EX.map,id=DJ.of(o);if(!id||!sv.dj||sv.dj.id!=id)return'';const d=DJ.D[id],i=d.salles.indexOf(o);
if(!EX.groups.filter(q=>!q.hide).every(q=>q.dead))return'';
if(i<d.salles.length-1){sv.dj.i=i+1;sv.map=d.salles[i+1];store();return'Salle vaincue ! Une lueur t’emporte vers la suite…'}
sv.dj.fini=true;store();return'Donjon terminé ! Le chemin du retour est ouvert.'},
// Au chargement : impossible d'être dans un donjon sans y être entré avec une relique.
guard(){const id=DJ.of(sv.map);if(id&&(!sv.dj||sv.dj.id!=id)){sv.map=DJ.D[id].hub;store()}},
// Butin : relique possible après une victoire en zone (jamais dans le donjon ni en entraînement).
roll(){if(!EX.group||DJ.of(EX.map))return null;const id=DJ.zone(EX.map);if(!id)return null;
sv.relPity=(sv.relPity||0)+1;if(sv.relPity<6&&Math.random()>=.2)return null;if(DJ.rel(id)>=3)return null;
sv.relPity=0;sv.rel[id]=DJ.rel(id)+1;return id},
chips(){return Object.keys(DJ.D).filter(id=>DJ.rel(id)>0).map(id=>'<span class="chip" title="'+DJ.D[id].rel+'">'+DJ.D[id].e+' ×'+DJ.rel(id)+'</span>').join('')}};
// Un seul groupe de monstres par salle : le premier dans les salles 1 et 2, le boss dans la dernière.
(()=>{const R=DATA.rencontres,isB=g=>R[g.renc].n.includes('boss');
for(const id in DJ.D){const d=DJ.D[id],nv=[];
d.salles.forEach((s,i)=>{const m=DATA.cartes[s],gs=m.groups||[];if(gs.length>1){const keep=i==d.salles.length-1?(gs.find(isB)||gs[gs.length-1]):gs[0];m.groups=[keep]}(m.groups||[]).forEach(g=>nv.push(R[g.renc].niv))});
const e=DATA.cartes[d.hub].exits.find(e=>e.to==d.salles[0]);if(e&&nv.length){const a=Math.min(...nv),b=Math.max(...nv);e.nv='niv '+(a==b?a:a+'-'+b)}}})();
