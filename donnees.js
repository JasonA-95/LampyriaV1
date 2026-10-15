// DONNEES : classes, Lueurs, monstres, textes. On modifie ici sans toucher aux règles.
const DATA={
taille:13,
rochers:[[5,4],[5,5],[6,8],[7,3],[8,6],[3,9],[9,7],[4,7],[10,5]],
heros:{x:1,y:6,pa:6,pm:3},
monstres:[
{x:10,y:3,hp:24,max:24,pm:3,d:8,e:'🪰',n:'La mouche à braise'},
{x:11,y:8,hp:24,max:24,pm:3,d:8,e:'🪰',n:'La mouche à braise'},
{x:9,y:10,hp:30,max:30,pm:2,d:10,e:'🍄',n:'Le champignon bavard'}],
classes:{
porte:{n:'Porte-Lanterne',e:'🏮',hp:70,info:'mêlée, résistant',sorts:[
{id:'coup',n:'Coup de lanterne',niv:1,pa:2,r:[1,1],dmg:14,push:1,rg:[{dmg:3},{dmg:3}]},
{id:'balayage',n:'Balayage',niv:1,pa:4,r:[0,0],dmg:10,aoe:1,rg:[{dmg:3},{pa:-1}]},
{id:'charge',n:'Charge',niv:3,pa:3,r:[2,4],los:1,dmg:12,charge:1,cd:2,rg:[{dmg:3},{rmax:1}]},
{id:'garde',n:'Garde de lanterne',niv:6,pa:2,r:[0,0],garde:1,cd:3,rg:[{cd:-1},{garde:1}]},
{id:'boutoir',n:'Coup de boutoir',niv:10,pa:3,r:[1,1],dmg:18,push:2,cd:2,rg:[{dmg:4},{cd:-1}]},
{id:'ardente',n:'Lanterne ardente',niv:14,pa:5,r:[0,0],aoe:2,dmg:14,cd:3,rg:[{dmg:4},{cd:-1}]}]},
archer:{n:'Archer Farceur',e:'🏹',hp:45,info:'distance, fragile',sorts:[
{id:'tir',n:'Tir précis',niv:1,pa:2,r:[2,6],los:1,dmg:11,rg:[{dmg:3},{dmg:3}]},
{id:'tir2',n:'Tir double',niv:1,pa:4,r:[2,5],los:1,dmg:24,rg:[{dmg:4},{rmax:1}]},
{id:'retrait',n:'Tir en retrait',niv:3,pa:2,r:[2,5],los:1,dmg:8,recul:1,cd:2,rg:[{dmg:3},{cd:-1}]},
{id:'repoussant',n:'Tir repoussant',niv:6,pa:3,r:[2,5],los:1,dmg:10,push:2,cd:2,rg:[{dmg:3},{rmax:1}]},
{id:'perforant',n:'Tir perforant',niv:10,pa:4,r:[3,7],los:1,dmg:30,cd:2,rg:[{dmg:4},{cd:-1}]},
{id:'pluie',n:'Pluie de flèches',niv:14,pa:5,r:[3,6],aoe:2,dmg:14,cd:3,rg:[{dmg:4},{cd:-1}]}]},
mage:{n:'Mage Distrait',e:'🧙',hp:38,info:'zone, peu de vie',sorts:[
{id:'eclair',n:'Éclair',niv:1,pa:2,r:[2,6],los:1,dmg:9,rg:[{dmg:3},{dmg:3}]},
{id:'cendres',n:'Cendres',niv:1,pa:4,r:[2,5],dmg:12,aoe:1,rg:[{dmg:3},{pa:-1}]},
{id:'flaque',n:'Flaque enflammée',niv:3,pa:3,r:[2,5],aoe:1,dmg:15,cd:2,rg:[{dmg:3},{cd:-1}]},
{id:'fumee',n:'Bouclier de fumée',niv:6,pa:2,r:[0,0],garde:1,cd:3,rg:[{cd:-1},{garde:1}]},
{id:'rafale',n:'Rafale',niv:10,pa:3,r:[1,4],los:1,dmg:10,push:3,cd:2,rg:[{dmg:3},{rmax:1}]},
{id:'tempete',n:'Tempête de cendres',niv:14,pa:6,r:[2,5],aoe:2,dmg:26,cd:4,rg:[{dmg:5},{cd:-1}]}]}},
lueurs:{
colerique:{n:'Colérique',t:5,sort:{n:'Accès de rage',pa:1,r:[0,0],rage:1,cd:3,say:'rage'}},
peureuse:{n:'Peureuse',t:2,sort:{n:'Sauve-qui-peut',pa:2,r:[1,5],tp:1,cd:3,say:'fuite'}},
gourmande:{n:'Gourmande',t:3,sort:{n:'Festin',pa:4,r:[0,0],heal:20,cd:3,say:'soin'}},
reveuse:{n:'Rêveuse',t:3,sort:{n:'Somnolence',pa:3,r:[1,4],los:1,sleep:1,cd:2,say:'sommeil'}},
tetue:{n:'Têtue',t:4,sort:{n:"Mur d'entêtement",pa:2,r:[0,0],mur:1,cd:4,say:'mur'}},
farceuse:{n:'Farceuse',t:3,sort:{n:'Tour pendable',pa:3,r:[1,5],los:1,swap:1,cd:3,say:'farce'}},
melancolique:{n:'Mélancolique',t:4,sort:{n:'Ombre douce',pa:3,r:[1,4],los:1,dmg:12,drain:1,cd:2,say:'ombre'}}},
repliques:{
debut:['Gourmande','Ça se mange, ça ? On dirait un gros champignon.'],
soin:['Gourmande','À table ! Mange un morceau, tu en as besoin.'],
fuite:['Peureuse','On fuit ! On fuit !'],
rage:['Colérique','Frappe-le ! Frappe-le ! FRAPPE-LE !'],
sommeil:['Rêveuse','Chut… fais de beaux rêves…'],
mur:['Têtue',"Je ne bouge plus d'ici. Personne ne passe."],
farce:['Farceuse','Hop ! Qui est où ? Même moi je ne sais plus.'],
ombre:['Mélancolique',"Il paraît que le soleil était plus joli que ça."],
coup:['Gourmande','Aïe ! Pas sur la lanterne !'],
victoire:['Gourmande','Victoire ! On mange quoi ?'],
defaite:['Peureuse','On aurait dû faire demi-tour…'],
formulaire:['Gourmande',"C'est quoi ce papier qui flotte ? Il faut le déchirer… ou le jeter dehors !"]}
};
const mou=(x,y)=>({x,y,hp:24,max:24,pm:3,d:8,e:'🪰',n:'La mouche à braise',ia:'dist',garde:[2,3],sort:{n:'Étincelle',r:[2,3],los:1,dmg:6,cd:0}}),cha=(x,y)=>({x,y,hp:30,max:30,pm:2,d:10,e:'🍄',n:'Le champignon bavard',sort:{n:'Spores collantes',r:[1,3],los:1,dmg:0,pm:1,cd:3}}),mot=(x,y)=>({x,y,hp:28,max:28,pm:3,d:9,e:'🐑',n:'Le mouton-fantôme',sort:{n:'Coup de tête',r:[1,1],push:1,cd:2}}),ber=(x,y)=>({x,y,hp:30,max:30,pm:2,d:6,e:'🐏',n:'Le berger-fantôme',ia:'soin',sort:{n:'Berceuse de laine',r:[1,3],heal:10,cd:3}});
DATA.res={braise:'🔥 Braises',champi:'🍄 Champignons',laine:'🐑 Laine'};
DATA.rencontres=[
{n:'Village des Lanternes',xp:30,loot:{braise:4},m:[mou(10,3),mou(11,8)]},
{n:'Forêt des Champignons Lumineux',xp:55,loot:{champi:4,laine:2},m:[cha(10,3),cha(11,8),mot(9,10)]},
{n:'Collines aux Moutons-Fantômes',xp:90,loot:{laine:5,braise:3},m:[mot(10,3),mot(11,8),ber(9,10),cha(11,5)]}];
DATA.lampiste=[{cap:5,cout:{braise:4}},{cap:8,cout:{champi:4,laine:4}},{cap:12,cout:{braise:8,champi:6,laine:8}}];
const boss=(x,y)=>({x,y,hp:90,max:90,pm:2,d:12,e:'👻',n:'Chambellan Poussière',boss:1,sort:{n:'Tampon officiel',r:[2,3],los:1,dmg:8,cd:2}}),frm=(x,y)=>({x,y,hp:15,max:15,pm:0,d:0,e:'📜',n:'Le formulaire',form:1});
DATA.rencontres.push({n:'Manoir du Chambellan (boss)',xp:150,loot:{braise:8,laine:4,champi:4},say:'formulaire',m:[boss(11,7),frm(11,6),mou(9,3),mou(10,9)]});
DATA.resE={braise:'🔥',champi:'🍄',laine:'🧶'};
DATA.cartes={
village:{n:'Village des Lanternes',need:0,start:[3,6],tint:'rgba(255,170,80,.08)',
rocks:[[5,2],[5,3],[7,9],[8,9],[2,9],[10,3],[9,2],[6,10],[11,10]],
npcs:[{x:6,y:4,e:'🧓',n:'Maître Lampiste',quests:['q1','q2','q3'],txt:"Ta lanterne réagit à cette Lueur… fascinant ! Rapporte-moi des ressources et je lui ferai de la place (menu, onglet Lanterne)."},
{x:4,y:8,e:'🧔',n:'Le marchand',txt:"Je ne prends pas de braises en pièces, mais j'échange volontiers !",trade:[{give:{laine:2},get:{braise:1}},{give:{braise:2},get:{champi:1}},{give:{champi:2},get:{laine:1}},{give:{braise:1},get:{laine:1}}]}],
picks:[{x:1,y:2,quest:'q1'},{x:9,y:10,quest:'q1'},{x:12,y:2,quest:'q1'}],
groups:[{x:10,y:4,renc:0},{x:10,y:8,renc:0}],
nodes:[{x:7,y:2,res:'braise'},{x:3,y:10,res:'braise'}],
exits:[{x:12,y:6,to:'foret',tx:1,ty:6}]},
foret:{n:'Forêt des Champignons Lumineux',need:1,start:[1,6],tint:'rgba(60,150,90,.16)',
rocks:[[4,3],[4,4],[7,8],[8,8],[6,2],[9,3],[3,9],[10,10]],npcs:[],
hides:[{x:3,y:7,renc:1,quest:'q3'},{x:8,y:3,renc:1,quest:'q3'},{x:11,y:8,renc:1,quest:'q3'}],
groups:[{x:9,y:5,renc:1},{x:9,y:10,renc:1}],
nodes:[{x:2,y:3,res:'champi'},{x:5,y:10,res:'champi'},{x:10,y:2,res:'laine'}],
exits:[{x:0,y:6,to:'village',tx:11,ty:6},{x:12,y:6,to:'collines',tx:1,ty:6}]},
collines:{n:'Collines aux Moutons-Fantômes',need:2,start:[1,6],tint:'rgba(130,160,210,.14)',
rocks:[[3,3],[4,3],[6,8],[7,8],[9,5],[10,5],[2,9]],npcs:[],
groups:[{x:8,y:3,renc:2},{x:9,y:9,renc:2}],
nodes:[{x:2,y:2,res:'laine'},{x:5,y:10,res:'laine'},{x:11,y:10,res:'braise'}],
exits:[{x:0,y:6,to:'foret',tx:11,ty:6},{x:12,y:6,to:'manoir',tx:1,ty:6}]},
manoir:{n:'Manoir du Chambellan',need:3,start:[1,6],tint:'rgba(130,70,170,.2)',
rocks:[[4,2],[4,10],[8,2],[8,10],[6,4],[6,8]],npcs:[],
groups:[{x:10,y:6,renc:3}],
nodes:[{x:2,y:2,res:'braise'},{x:2,y:10,res:'champi'}],
exits:[{x:0,y:6,to:'collines',tx:11,ty:6}]}};
DATA.quetes={
q1:{n:'Lanternes perdues',desc:'Retrouve 3 lanternes égarées dans le village.',need:3,kind:'pick',say:"Trois lanternes ont roulé hors de ma boutique. Ouvre l'œil : elles brillent encore un peu.",fin:"Les voilà ! Tu es plus doué pour les retrouver que pour les livrer.",rew:{xp:40,res:{braise:3}}},
q2:{n:'Courrier volé',desc:'Repousse 2 groupes de voleurs de courrier devant le village.',need:2,kind:'win',renc:0,say:"Des monstres dévalisent mes livraisons. Repousse-en deux groupes, tu veux bien ?",fin:"Mon courrier est sauf. Enfin, ce qu'il en reste.",rew:{xp:50,res:{braise:2}}},
q3:{n:"La Lueur qui s'enfuit",desc:'Trouve les 3 cachettes (🌿) de la Peureuse dans la forêt, puis offre-lui une tarte (3 🍄).',need:3,kind:'hide',req:1,cost:{champi:3},say:"Une autre Lueur se cache dans la forêt. Elle a peur de tout. Cherche les buissons suspects.",fin:"Ta Gourmande a eu raison : une tarte aux champignons, et la Peureuse sort enfin. Elle te suit.",rew:{xp:80,lueur:'peureuse'}}};


// ÉQUIPEMENT : slots arme / tête / corps / bottes / 2 accessoires. st = bonus (pv, dmg, res en %, pm). cout = recette d'atelier.
DATA.objets={
tisonnier:{n:'Tisonnier',e:'🔥',slot:'arme',r:0,st:{dmg:1},cout:{braise:4}},
epee_braise:{n:'Épée de braise',e:'⚔️',slot:'arme',r:1,st:{dmg:2},cout:{braise:8,laine:2}},
sceptre:{n:'Sceptre-champignon',e:'🍄',slot:'arme',r:2,st:{dmg:3}},
plume:{n:'Plume du Chambellan',e:'🪶',slot:'arme',r:3,st:{dmg:4}},
chapeau:{n:'Chapeau-champi',e:'🍄',slot:'tete',r:0,st:{pv:6},cout:{champi:3}},
capuche:{n:'Capuche luminescente',e:'🧙',slot:'tete',r:1,st:{pv:10},cout:{champi:6,laine:2}},
casquette:{n:'Casquette du livreur',e:'🧢',slot:'tete',r:1,st:{pv:6},set:'livreur',cout:{champi:4,laine:3,braise:2}},
gilet:{n:'Gilet de laine',e:'🧶',slot:'corps',r:0,st:{pv:8},cout:{laine:4}},
manteau:{n:'Manteau douillet',e:'🧥',slot:'corps',r:1,st:{pv:10,res:5},cout:{laine:8,champi:2}},
veste_liv:{n:'Veste du livreur',e:'🦺',slot:'corps',r:1,st:{pv:8,res:3},set:'livreur',cout:{laine:6,braise:3,champi:2}},
cape:{n:'Cape du mouton-fantôme',e:'👻',slot:'corps',r:2,st:{pv:14,res:8}},
chaussons:{n:'Chaussons de laine',e:'🧦',slot:'bottes',r:0,st:{pv:4},cout:{laine:3}},
bottes_liv:{n:'Bottes du livreur',e:'👢',slot:'bottes',r:1,st:{pv:6},set:'livreur',cout:{laine:4,braise:3,champi:3}},
bottes_cha:{n:'Bottes du Chambellan',e:'🥾',slot:'bottes',r:3,st:{pv:8,pm:1}},
amulette:{n:'Amulette de champi',e:'📿',slot:'acc',r:0,st:{pv:8},cout:{champi:5}},
echarpe:{n:'Écharpe de laine',e:'🧣',slot:'acc',r:0,st:{res:5},cout:{laine:5}},
bague:{n:'Bague de braise',e:'💍',slot:'acc',r:1,st:{dmg:1},cout:{braise:5,champi:2}},
clochette:{n:'Clochette du berger',e:'🔔',slot:'acc',r:2,st:{pv:8,dmg:1}},
lanterne_cha:{n:'Lanterne du Chambellan',e:'🏮',slot:'acc',r:3,st:{pv:10,dmg:1,res:5}}};
DATA.sets={livreur:{n:'Panoplie du livreur',bonus:{2:{pv:10},3:{dmg:1,res:5}}}};
DATA.rencontres[0].drops=[{id:'chaussons',p:25},{id:'echarpe',p:15}];
DATA.rencontres[1].drops=[{id:'chapeau',p:25},{id:'amulette',p:15},{id:'clochette',p:8}];
DATA.rencontres[2].drops=[{id:'gilet',p:20},{id:'bague',p:10},{id:'sceptre',p:10},{id:'cape',p:8}];
DATA.rencontres[3].drops=[{id:'plume',p:35},{id:'bottes_cha',p:35},{id:'lanterne_cha',p:35}];


// ============ ACTE 2 : MARAIS DE CENDRES ============
DATA.res.cendre='🌫️ Cendres';DATA.res.roseau='🌾 Roseaux';DATA.resE.cendre='🌫️';DATA.resE.roseau='🌾';
DATA.repliques.cendres=['Gourmande',"Cette dame se tient toujours sur un tas de cendres… Et si on dispersait la cendre, ou si on la faisait changer de place ?"];
DATA.repliques.duchesse_vic=['Têtue',"Elle ne voulait pas bouger non plus. On aurait pu s'entendre."];
const cra=(x,y)=>({x,y,hp:40,max:40,pm:3,d:13,e:'🐸',n:'Le crapaud cendreux',sort:{n:'Langue gluante',r:[2,4],los:1,dmg:5,pull:2,cd:3}}),gri=(x,y)=>({x,y,hp:34,max:34,pm:4,d:12,e:'🦗',n:'Le grillon de cendre',ia:'dist',garde:[3,4],sort:{n:'Stridulation',r:[2,5],los:1,dmg:9,cd:0}}),sac=(x,y)=>({x,y,hp:56,max:56,pm:2,d:15,e:'⚱️',n:'Le sac de cendres',mort:{n:'Éclatement',r:1,dmg:12}}),duch=(x,y)=>({x,y,hp:110,max:110,pm:2,d:14,e:'👸',n:'La Duchesse des Cendres',boss:1,cendre:1,sort:{n:'Pluie de cendres',r:[2,4],los:1,dmg:9,cd:2}});
DATA.rencontres.push({n:'Marais de Cendres',xp:130,loot:{cendre:4,roseau:2},m:[cra(10,3),cra(11,8),gri(9,10)]});
DATA.rencontres.push({n:'Roselière Fantôme',xp:190,loot:{roseau:5,cendre:3},m:[gri(10,3),gri(11,8),sac(9,10),cra(11,5)]});
DATA.rencontres.push({n:'Serre de la Duchesse (boss)',xp:320,loot:{cendre:8,roseau:5,braise:6},say:'cendres',vic:'duchesse_vic',m:[duch(11,7),gri(9,3),gri(10,9)]});
DATA.lampiste.push({cap:15,cout:{cendre:8,roseau:8,braise:8}});
DATA.cartes.manoir.exits.push({x:12,y:6,to:'marais',tx:1,ty:6});
DATA.cartes.marais={n:'Marais de Cendres',need:4,start:[1,6],tint:'rgba(120,125,115,.22)',
rocks:[[3,3],[3,4],[6,2],[6,9],[7,9],[9,4],[10,4],[4,10],[11,10],[8,7]],
npcs:[{x:2,y:8,e:'🧙',n:'La Passeuse',quests:['q4','q5'],txt:"Le marais n'a pas de chemin, seulement des habitudes. Je connais les habitudes. J'échange aussi des ressources, si tu veux.",
trade:[{give:{braise:2},get:{cendre:1}},{give:{laine:2},get:{roseau:1}},{give:{cendre:1},get:{braise:2}},{give:{roseau:1},get:{champi:2}}]}],
picks:[{x:1,y:2,quest:'q4'},{x:10,y:11,quest:'q4'},{x:11,y:2,quest:'q4'}],
groups:[{x:9,y:6,renc:4},{x:10,y:9,renc:4}],
nodes:[{x:2,y:3,res:'cendre'},{x:5,y:11,res:'roseau'},{x:11,y:5,res:'cendre'}],
exits:[{x:0,y:6,to:'manoir',tx:11,ty:6},{x:12,y:6,to:'roseliere',tx:1,ty:6}]};
DATA.cartes.roseliere={n:'Roselière Fantôme',need:5,start:[1,6],tint:'rgba(90,150,140,.22)',
rocks:[[3,2],[4,2],[6,5],[6,6],[8,10],[9,10],[10,3],[2,9],[5,8]],npcs:[],
hides:[{x:2,y:4,renc:5,quest:'q5'},{x:7,y:11,renc:5,quest:'q5'},{x:11,y:8,renc:5,quest:'q5'}],
groups:[{x:9,y:6,renc:5},{x:9,y:9,renc:5}],
nodes:[{x:2,y:2,res:'roseau'},{x:4,y:11,res:'roseau'},{x:11,y:11,res:'cendre'}],
exits:[{x:0,y:6,to:'marais',tx:11,ty:6},{x:12,y:6,to:'serre',tx:1,ty:6}]};
DATA.cartes.serre={n:'Serre de la Duchesse',need:6,start:[1,6],tint:'rgba(150,140,165,.26)',
rocks:[[4,3],[4,9],[8,3],[8,9],[6,6]],npcs:[],
groups:[{x:10,y:6,renc:6}],
nodes:[{x:2,y:2,res:'cendre'},{x:2,y:10,res:'roseau'}],
exits:[{x:0,y:6,to:'roseliere',tx:11,ty:6}]};
DATA.quetes.q4={n:'La Lueur qui ne bougeait pas',desc:"Retrouve les 3 lanternes d'appel (🏮) dans le marais, puis rapporte 3 🌾 pour construire un banc : la Têtue refuse de partir sans s'asseoir.",need:3,kind:'pick',req:4,cost:{roseau:3},
say:"Une Lueur est plantée au milieu du marais depuis des années. Elle dit qu'elle attend. Rapporte trois lanternes d'appel, et de quoi lui faire un banc.",
fin:"Elle s'est assise, a regardé le banc, et a dit : « Bon. D'accord. » C'est la première fois qu'elle cède. Elle te suit.",rew:{xp:200,lueur:'tetue'}};
DATA.quetes.q5={n:'Les rêves de la roselière',desc:'Trouve les 3 bulles de rêve (🌿) dans la roselière, puis offre un oreiller de roseaux (4 🌾) à la Rêveuse.',need:3,kind:'hide',req:5,cost:{roseau:4},
say:"Dans la roselière, quelqu'un rêve si fort que les roseaux s'endorment. Cherche les bulles de rêve, et apporte de quoi faire un oreiller.",
fin:"Elle s'est allongée sur l'oreiller en trois secondes. « Je rêvais justement de toi », dit-elle. Elle te suit.",rew:{xp:260,lueur:'reveuse'}};
DATA.objets.lame_roseau={n:'Lame de roseau',e:'🗡️',slot:'arme',r:1,st:{dmg:3},cout:{roseau:6,cendre:3}};
DATA.objets.capuchon_cendre={n:'Capuchon de cendre',e:'🎓',slot:'tete',r:1,st:{pv:14},cout:{cendre:5,roseau:3}};
DATA.objets.tunique_roseau={n:'Tunique de roseau',e:'👘',slot:'corps',r:1,st:{pv:14,res:6},cout:{roseau:8,cendre:3}};
DATA.objets.sandales_roseau={n:'Sandales de roseau',e:'🩴',slot:'bottes',r:1,st:{pv:8,res:3},cout:{roseau:5}};
DATA.objets.bracelet_cendre={n:'Bracelet de cendre',e:'📿',slot:'acc',r:1,st:{pv:6,dmg:1},cout:{cendre:5,braise:3}};
DATA.objets.voile_brume={n:'Voile de brume',e:'🌫️',slot:'tete',r:2,st:{pv:16,res:4}};
DATA.objets.perle_marais={n:'Perle du marais',e:'🔮',slot:'acc',r:2,st:{dmg:1,res:5}};
DATA.objets.lance_libellule={n:'Lance de libellule',e:'🔱',slot:'arme',r:2,st:{dmg:4}};
DATA.objets.manteau_brume={n:'Manteau de brume',e:'🧥',slot:'corps',r:2,st:{pv:20,res:8}};
DATA.objets.bottes_vase={n:'Bottes de vase',e:'🥾',slot:'bottes',r:2,st:{pv:10,res:5}};
DATA.objets.baguette_duchesse={n:'Baguette de la Duchesse',e:'🪄',slot:'arme',r:3,st:{dmg:5}};
DATA.objets.couronne_cendre={n:'Couronne de cendre',e:'👑',slot:'tete',r:3,st:{pv:16,res:6}};
DATA.objets.robe_duchesse={n:'Robe de la Duchesse',e:'👗',slot:'corps',r:3,st:{pv:18,res:8}};
DATA.objets.eventail_cendre={n:'Éventail de cendre',e:'🪭',slot:'acc',r:3,st:{pv:8,dmg:1,res:6}};
DATA.rencontres[4].drops=[{id:'voile_brume',p:25},{id:'perle_marais',p:12},{id:'bottes_vase',p:15}];
DATA.rencontres[5].drops=[{id:'lance_libellule',p:12},{id:'manteau_brume',p:14}];
DATA.rencontres[6].drops=[{id:'baguette_duchesse',p:35},{id:'couronne_cendre',p:35},{id:'robe_duchesse',p:35},{id:'eventail_cendre',p:35}];
