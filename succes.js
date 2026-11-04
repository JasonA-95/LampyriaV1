// SUCCÈS : liste de données + évaluation. Chaque succès = un compteur v() à atteindre (need) et une récompense facultative.
// Récompenses : res (ressources), conso (potions, 50 max par pile), etin (étincelle de succès, voir DATA.etin). sv.succ[id] = date de déblocage.
const nQ=()=>Object.values(sv.q||{}).filter(s=>s&&s.s==2).length,
nBes=()=>Object.keys(sv.bes).filter(k=>sv.bes[k]>0).length,
nKill=()=>Object.values(sv.bes).reduce((a,b)=>a+(+b||0),0),
nPast=()=>['gourmande','peureuse','tetue','reveuse','farceuse','colerique','melancolique'].filter(k=>sv.hist.flags[k+'_passe']).length,
nMet=()=>Object.keys(DATA.metiers).filter(m=>((sv.met||{})[m]||{}).niv>=DATA.metMax).length,
mxMet=()=>Math.max(0,...Object.values(sv.met||{}).map(t=>t.niv||0));
const SUCCES=[
{id:'niv5',n:'Livreur confirmé',d:'Atteindre le niveau 5',v:()=>sv.niv,need:5,rew:{conso:{tisane:2}}},
{id:'niv20',n:'Fin de l’acte 1',d:'Atteindre le niveau 20',v:()=>sv.niv,need:20,rew:{conso:{baume:3}}},
{id:'niv40',n:'Fin de l’acte 2',d:'Atteindre le niveau 40',v:()=>sv.niv,need:40,rew:{conso:{elixir:3}}},
{id:'niv60',n:'Porte-Lanterne accompli',d:'Atteindre le niveau 60',v:()=>sv.niv,need:60,rew:{res:{eclat:10}}},
{id:'boss1',n:'Papiers en règle',d:'Vaincre le Chambellan Poussière',v:()=>sv.renc,need:4,rew:{res:{braise:10}}},
{id:'boss2',n:'Cendres refroidies',d:'Vaincre la Duchesse des Cendres',v:()=>sv.renc,need:7,rew:{res:{cendre:10}}},
{id:'boss3',n:'Fin de grève',d:'Vaincre ou convaincre le Général Gréviste',v:()=>sv.renc,need:11,rew:{res:{chaussette:10}}},
{id:'boss4',n:'Le soleil revient',d:'Terminer l’histoire principale',v:()=>sv.renc,need:18,rew:{res:{eclat:15}}},
{id:'lueur3',n:'Compagnie lumineuse',d:'Réunir 3 Lueurs',v:()=>sv.deb.length,need:3,rew:{conso:{tisane:3}}},
{id:'lueur7',n:'Sept Lueurs',d:'Réunir les 7 Lueurs',v:()=>sv.deb.length,need:7,rew:{conso:{fiole:3}}},
{id:'passes',n:'Mémoire du Gardien',d:'Terminer les 7 quêtes du passé des Lueurs',v:nPast,need:7,rew:{etin:'s_memoire'}},
{id:'q10',n:'Facteur zélé',d:'Terminer 10 quêtes',v:nQ,need:10,rew:{res:{laine:10}}},
{id:'q40',n:'Homme à tout faire',d:'Terminer 40 quêtes',v:nQ,need:40,rew:{conso:{baume:5}}},
{id:'q80',n:'Journal rempli',d:'Terminer 80 quêtes',v:nQ,need:80,rew:{etin:'s_journal'}},
{id:'bes10',n:'Curieux',d:'Découvrir 10 monstres dans le bestiaire',v:nBes,need:10,rew:{res:{champi:10}}},
{id:'bes30',n:'Naturaliste',d:'Découvrir 30 monstres dans le bestiaire',v:nBes,need:30,rew:{etin:'s_chasse'}},
{id:'kill100',n:'Chasseur',d:'Vaincre 100 monstres',v:nKill,need:100,rew:{conso:{tisane:5}}},
{id:'kill500',n:'Exterminateur de poussière',d:'Vaincre 500 monstres',v:nKill,need:500,rew:{conso:{elixir:5}}},
{id:'etin5',n:'Collectionneur d’étincelles',d:'Trouver 5 étincelles',v:()=>sv.etin.got.filter(i=>!DATA.etin[i].succ).length,need:5,rew:{res:{eclat:5}}},
{id:'etin15',n:'Toutes les étincelles',d:'Trouver les 15 étincelles du monde',v:()=>sv.etin.got.filter(i=>!DATA.etin[i].succ).length,need:15,rew:{res:{eclat:10}}},
{id:'met10',n:'Apprenti',d:'Monter un métier au niveau 10',v:mxMet,need:10,rew:{conso:{baume:2}}},
{id:'met20',n:'Maître d’atelier',d:'Monter les 4 métiers au niveau maximum',v:nMet,need:4,rew:{etin:'s_atelier'}}];
// Débloque les succès atteints et donne leurs récompenses ; appelée par store() avant la sauvegarde.
function succCheck(){if(!sv.succ||typeof sv.succ!='object'||Array.isArray(sv.succ))sv.succ={};const neufs=[];
for(const s of SUCCES){if(sv.succ[s.id]||s.v()<s.need)continue;sv.succ[s.id]=Date.now();neufs.push(s);const r=s.rew||{};
for(const k in r.res||{})sv.res[k]=(sv.res[k]||0)+r.res[k];
for(const k in r.conso||{})sv.conso[k]=Math.min(50,(sv.conso[k]||0)+r.conso[k]);
if(r.etin&&!sv.etin.got.includes(r.etin))sv.etin.got.push(r.etin)}
if(neufs.length)toast('🏆 '+(neufs.length>1?neufs.length+' succès : ':'Succès : ')+neufs.map(s=>s.n).join(', '));return neufs}
function succRew(r){const t=[];for(const k in r.res||{})t.push(r.res[k]+' '+DATA.res[k]);for(const k in r.conso||{})t.push(r.conso[k]+' '+DATA.conso[k].n);if(r.etin)t.push(DATA.etin[r.etin].n);return t.join(', ')}
