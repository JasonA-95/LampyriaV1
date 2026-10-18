// DONNEES : classes, Lueurs, monstres, textes. On modifie ici sans toucher aux règles.
// XP : chaque rencontre a un niveau (niv) et chaque quête un xpq:[niveau,'courte|normale|longue|lueur'] ; les valeurs sont calculées par xp.js.
const DATA={
taille:13,
etats:{
brule:{n:'Brûlure',e:'🔥',d:'Inflige des dégâts au début du tour.',couleur:'#ff9a45'},
poison:{n:'Poison',e:'🧪',d:'Inflige des dégâts et réduit les soins reçus de moitié.',couleur:'#477d45'},
etourdi:{n:'Étourdissement',e:'💫',d:'Fait passer le prochain tour. Sans effet sur les boss.'},
bouclier:{n:'Bouclier',e:'🔰',d:'Absorbe les dégâts jusqu’à épuisement ou expiration.'},
ralenti:{n:'Ralenti',e:'🐌',d:'Réduit les PM disponibles au prochain tour.'},
affaibli:{n:'Affaibli',e:'🥀',d:'Réduit les dégâts infligés.'}},
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
{id:'ardente',n:'Lanterne ardente',niv:14,pa:5,r:[0,0],aoe:2,dmg:14,etats:[{id:'brule',v:3,t:3}],cd:3,rg:[{dmg:4},{cd:-1}]}]},
archer:{n:'Archer Farceur',e:'🏹',hp:45,info:'distance, fragile',sorts:[
{id:'tir',n:'Tir précis',niv:1,pa:2,r:[2,6],los:1,dmg:11,rg:[{dmg:3},{dmg:3}]},
{id:'tir2',n:'Tir double',niv:1,pa:4,r:[2,5],los:1,dmg:24,rg:[{dmg:4},{rmax:1}]},
{id:'retrait',n:'Tir en retrait',niv:3,pa:2,r:[2,5],los:1,dmg:8,recul:1,etats:[{id:'poison',v:3,t:3}],cd:2,rg:[{dmg:3},{cd:-1}]},
{id:'repoussant',n:'Tir repoussant',niv:6,pa:3,r:[2,5],los:1,dmg:10,push:2,cd:2,rg:[{dmg:3},{rmax:1}]},
{id:'perforant',n:'Tir perforant',niv:10,pa:4,r:[3,7],los:1,dmg:30,cd:2,rg:[{dmg:4},{cd:-1}]},
{id:'pluie',n:'Pluie de flèches',niv:14,pa:5,r:[3,6],aoe:2,dmg:14,cd:3,rg:[{dmg:4},{cd:-1}]}]},
mage:{n:'Mage Distrait',e:'🧙',hp:38,info:'zone, peu de vie',sorts:[
{id:'eclair',n:'Éclair',niv:1,pa:2,r:[2,6],los:1,dmg:9,rg:[{dmg:3},{dmg:3}]},
{id:'cendres',n:'Cendres',niv:1,pa:4,r:[2,5],dmg:12,aoe:1,rg:[{dmg:3},{pa:-1}]},
{id:'flaque',n:'Flaque enflammée',niv:3,pa:3,r:[2,5],aoe:1,dmg:15,etats:[{id:'brule',v:3,t:3}],cd:2,rg:[{dmg:3},{cd:-1}]},
{id:'fumee',n:'Bouclier de fumée',niv:6,pa:2,r:[0,0],garde:1,cd:3,rg:[{cd:-1},{garde:1}]},
{id:'rafale',n:'Rafale',niv:10,pa:3,r:[1,4],los:1,dmg:10,push:3,cd:2,rg:[{dmg:3},{rmax:1}]},
{id:'tempete',n:'Tempête de cendres',niv:14,pa:6,r:[2,5],aoe:2,dmg:26,etats:[{id:'etourdi',t:1}],cd:4,rg:[{dmg:5},{cd:-1}]}]}},
lueurs:{
colerique:{n:'Colérique',t:5,sort:{n:'Accès de rage',pa:1,r:[0,0],rage:1,cd:3,say:'rage'}},
peureuse:{n:'Peureuse',t:2,sort:{n:'Sauve-qui-peut',pa:2,r:[1,5],tp:1,cd:3,say:'fuite'}},
gourmande:{n:'Gourmande',t:3,sort:{n:'Festin',pa:4,r:[0,0],heal:20,etatsSoi:[{id:'bouclier',v:6,t:2}],cd:3,say:'soin'}},
reveuse:{n:'Rêveuse',t:3,sort:{n:'Somnolence',pa:3,r:[1,4],los:1,sleep:1,cd:2,say:'sommeil'}},
tetue:{n:'Têtue',t:4,sort:{n:"Mur d'entêtement",pa:2,r:[0,0],mur:1,cd:4,say:'mur'}},
farceuse:{n:'Farceuse',t:3,sort:{n:'Tour pendable',pa:3,r:[1,5],los:1,swap:1,cd:3,say:'farce'}},
melancolique:{n:'Mélancolique',t:4,sort:{n:'Ombre douce',pa:3,r:[1,4],los:1,dmg:12,drain:1,cd:2,say:'ombre'}}},
repliques:{
debut:[['Gourmande','Ça se mange, ça ? On dirait un gros champignon.'],['Gourmande','Ça sent le combat. Ou le pain grillé. Dans le doute, j’ai faim.'],['Peureuse','On pourrait faire semblant d’être des buissons ?'],['Colérique','ENFIN de la bagarre ! Tape d’abord, discute après !'],['Rêveuse','J’ai rêvé de ce moment. J’avais un meilleur costume.'],['Têtue','Je reste ici, et eux aussi, tant que ça me plaît.'],['Farceuse','Hihi, ils ont des têtes à recevoir une farce.'],['Mélancolique','Encore un combat… À quoi bon, mais allons-y.']],
soin:['Gourmande','À table ! Mange un morceau, tu en as besoin.'],
fuite:['Peureuse','On fuit ! On fuit !'],
rage:['Colérique','Frappe-le ! Frappe-le ! FRAPPE-LE !'],
sommeil:['Rêveuse','Chut… fais de beaux rêves…'],
mur:['Têtue',"Je ne bouge plus d'ici. Personne ne passe."],
farce:['Farceuse','Hop ! Qui est où ? Même moi je ne sais plus.'],
ombre:['Mélancolique',"Il paraît que le soleil était plus joli que ça."],
coup:[['Gourmande','Aïe ! Pas sur la lanterne !'],['Peureuse','Ça fait mal ! Je le savais ! Je le dis toujours !'],['Colérique','Il a osé ! Il a OSÉ !'],['Têtue','Je ne bouge pas. Même touchée.'],['Mélancolique','Ça fait mal… comme tout.']],
victoire:[['Gourmande','Victoire ! On mange quoi ?'],['Farceuse','Hihi ! Et on n’a même pas triché. Beaucoup.'],['Colérique','Trop facile ! Il y en a d’autres ?'],['Rêveuse','Quel beau rêve. On le refait ?'],['Têtue','Je l’avais dit. Je ne bougeais pas, et ils sont tombés.']],
defaite:[['Peureuse','On aurait dû faire demi-tour…'],['Gourmande','Je ne digère pas cette défaite.'],['Mélancolique','Tout finit par tomber. Mais pas toi. On recommence.'],['Têtue','On repart. Je n’abandonne pas, j’ai juste changé de place.']],
formulaire:['Gourmande',"C'est quoi ce papier qui flotte ? Il faut le déchirer… ou le jeter dehors !"],
vexation:['Gourmande','Sa vexation flotte autour de lui. Brise-la, ou moque-le avec les Lueurs (Colérique, Farceuse, Rêveuse…) : elle fond !'],
eclipse:['Peureuse','Elle est protégée quand elle plonge dans l’ombre. Attends la lumière : là, frappe fort !'],
cercle:['Gourmande','Ses grévistes font un cercle autour de lui. Écarte-les ou écrase-les : sans escorte, il est à nous.'],
blague:['Farceuse','Il prépare une blague sur ta case ! Bouge avant qu’elle tombe, et il se fatiguera.']}
};
const mou=(x,y)=>({x,y,hp:24,max:24,pm:3,d:8,e:'🪰',n:'La mouche à braise',ia:'dist',garde:[2,3],sort:{n:'Étincelle',r:[2,3],los:1,dmg:6,cd:0}}),cha=(x,y)=>({x,y,hp:30,max:30,pm:2,d:10,e:'🍄',n:'Le champignon bavard',sort:{n:'Spores collantes',r:[1,3],los:1,dmg:0,etats:[{id:'ralenti',v:1,t:1}],cd:3}}),mot=(x,y)=>({x,y,hp:28,max:28,pm:3,d:9,e:'🐑',n:'Le mouton-fantôme',sort:{n:'Coup de tête',r:[1,1],push:1,cd:2}}),ber=(x,y)=>({x,y,hp:30,max:30,pm:2,d:6,e:'🐏',n:'Le berger-fantôme',ia:'soin',sort:{n:'Berceuse de laine',r:[1,3],heal:10,cd:3}});
DATA.res={braise:'🔥 Braises',champi:'🍄 Champignons',laine:'🐑 Laine'};
DATA.rencontres=[
{n:'Village des Lanternes',biome:'village',niv:2,loot:{braise:4},m:[mou(10,3),mou(11,8)]},
{n:'Forêt des Champignons Lumineux',biome:'foret',niv:7,loot:{champi:4,laine:2},m:[cha(10,3),cha(11,8),mot(9,10)]},
{n:'Collines aux Moutons-Fantômes',biome:'collines',niv:13,loot:{laine:5,braise:3},m:[mot(10,3),mot(11,8),ber(9,10),cha(11,5)]}];
DATA.lampiste=[{cap:5,cout:{braise:4}},{cap:8,cout:{champi:4,laine:4}},{cap:12,cout:{braise:8,champi:6,laine:8}}];
const boss=(x,y)=>({x,y,hp:90,max:90,pm:2,d:12,e:'👻',n:'Chambellan Poussière',boss:1,prot:'le formulaire flotte sur lui',sort:{n:'Tampon officiel',r:[2,3],los:1,dmg:8,etats:[{id:'affaibli',v:25,t:2}],cd:2}}),frm=(x,y)=>({x,y,hp:15,max:15,pm:0,d:0,e:'📜',n:'Le formulaire',form:1,pct:.14,regen:.03});
DATA.rencontres.push({n:'Manoir du Chambellan (boss)',biome:'manoir',niv:18,loot:{braise:8,laine:4,champi:4},say:'formulaire',m:[boss(11,7),frm(11,6),mou(9,3),mou(10,9)]});
DATA.resE={braise:'🔥',champi:'🍄',laine:'🧶'};
DATA.cartes={
village:{n:'Village des Lanternes',biome:'village',need:0,start:[3,6],tint:'rgba(255,170,80,.08)',
rocks:[[5,2],[5,3],[7,9],[8,9],[2,9],[10,3],[9,2],[6,10],[11,10]],
npcs:[{x:6,y:4,e:'🧓',n:'Maître Lampiste',quests:['q1','q2','q3'],txt:"Ta lanterne réagit à cette Lueur… fascinant ! Rapporte-moi des ressources et je lui ferai de la place (menu, onglet Lanterne).",variantes:[{si:{quete:{id:'q1',etat:'finie'}},txt:'Trois lanternes retrouvées, et pas une seule cabossée ! Je vais finir par croire que tu sais livrer.'}]},
{x:4,y:8,e:'🧔',n:'Le marchand',txt:"Je ne prends pas de braises en pièces, mais j'échange volontiers !",trade:[{give:{laine:2},get:{braise:1}},{give:{braise:2},get:{champi:1}},{give:{champi:2},get:{laine:1}},{give:{braise:1},get:{laine:1}}]}],
picks:[{x:1,y:2,quest:'q1'},{x:9,y:10,quest:'q1'},{x:12,y:2,quest:'q1'}],
groups:[{x:10,y:4,renc:0},{x:10,y:8,renc:0}],
nodes:[{x:7,y:2,res:'braise'},{x:3,y:10,res:'braise'}],
exits:[{x:12,y:6,to:'foret',tx:1,ty:6}]},
foret:{n:'Forêt des Champignons Lumineux',biome:'foret',need:1,start:[1,6],tint:'rgba(60,150,90,.16)',
rocks:[[4,3],[4,4],[7,8],[8,8],[6,2],[9,3],[3,9],[10,10]],npcs:[],
hides:[{x:3,y:7,renc:1,quest:'q3'},{x:8,y:3,renc:1,quest:'q3'},{x:11,y:8,renc:1,quest:'q3'}],
groups:[{x:9,y:5,renc:1},{x:9,y:10,renc:1}],
nodes:[{x:2,y:3,res:'champi'},{x:5,y:10,res:'champi'},{x:10,y:2,res:'laine'}],
exits:[{x:0,y:6,to:'village',tx:11,ty:6},{x:12,y:6,to:'collines',tx:1,ty:6}]},
collines:{n:'Collines aux Moutons-Fantômes',biome:'collines',need:2,start:[1,6],tint:'rgba(130,160,210,.14)',
rocks:[[3,3],[4,3],[6,8],[7,8],[9,5],[10,5],[2,9]],npcs:[],
groups:[{x:8,y:3,renc:2},{x:9,y:9,renc:2}],
nodes:[{x:2,y:2,res:'laine'},{x:5,y:10,res:'laine'},{x:11,y:10,res:'braise'}],
exits:[{x:0,y:6,to:'foret',tx:11,ty:6},{x:12,y:6,to:'manoir',tx:1,ty:6}]},
manoir:{n:'Manoir du Chambellan',biome:'manoir',need:3,start:[1,6],tint:'rgba(130,70,170,.2)',
rocks:[[4,2],[4,10],[8,2],[8,10],[6,4],[6,8]],npcs:[],
groups:[{x:10,y:6,renc:3}],
nodes:[{x:2,y:2,res:'braise'},{x:2,y:10,res:'champi'}],
exits:[{x:0,y:6,to:'collines',tx:11,ty:6}]}};
DATA.quetes={
q1:{n:'Lanternes perdues',desc:'Retrouve 3 lanternes égarées dans le village.',need:3,kind:'pick',say:"Trois lanternes ont roulé hors de ma boutique. Ouvre l'œil : elles brillent encore un peu.",fin:"Les voilà ! Tu es plus doué pour les retrouver que pour les livrer.",rew:{xpq:[2,'normale'],res:{braise:3}}},
q2:{n:'Courrier volé',desc:'Repousse 2 groupes de voleurs de courrier devant le village.',need:2,kind:'win',renc:0,say:"Des monstres dévalisent mes livraisons. Repousse-en deux groupes, tu veux bien ?",fin:"Mon courrier est sauf. Enfin, ce qu'il en reste.",rew:{xpq:[3,'normale'],res:{braise:2}}},
q3:{n:"La Lueur qui s'enfuit",desc:'Trouve les 3 cachettes (🌿) de la Peureuse dans la forêt, puis offre-lui une tarte (3 🍄).',need:3,kind:'hide',req:1,cost:{champi:3},say:"Une autre Lueur se cache dans la forêt. Elle a peur de tout. Cherche les buissons suspects.",fin:"Ta Gourmande a eu raison : une tarte aux champignons, et la Peureuse sort enfin. Elle te suit.",rew:{xpq:[7,'lueur'],lueur:'peureuse'}}};


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
DATA.repliques.cendres=['Gourmande',"Cette dame se tient toujours sur un tas de cendres qui grandit… Disperse-la d’un sort, puis frappe vite !"];
DATA.repliques.duchesse_vic=['Têtue',"Elle ne voulait pas bouger non plus. On aurait pu s'entendre."];
const cra=(x,y)=>({x,y,hp:40,max:40,pm:3,d:13,e:'🐸',n:'Le crapaud cendreux',sort:{n:'Langue gluante',r:[2,4],los:1,dmg:5,pull:2,etats:[{id:'poison',v:3,t:2}],cd:3}}),gri=(x,y)=>({x,y,hp:34,max:34,pm:4,d:12,e:'🦗',n:'Le grillon de cendre',ia:'dist',garde:[3,4],sort:{n:'Stridulation',r:[2,5],los:1,dmg:9,cd:0}}),sac=(x,y)=>({x,y,hp:56,max:56,pm:2,d:15,e:'⚱️',n:'Le sac de cendres',mort:{n:'Éclatement',r:1,dmg:12}}),duch=(x,y)=>({x,y,hp:110,max:110,pm:2,d:14,e:'👸',n:'La Duchesse des Cendres',boss:1,cendre:1,spread:2,sort:{n:'Pluie de cendres',r:[2,4],los:1,dmg:9,etats:[{id:'brule',v:3,t:2}],cd:2}});
DATA.rencontres.push({n:'Marais de Cendres',biome:'marais',niv:22,loot:{cendre:4,roseau:2},m:[cra(10,3),cra(11,8),gri(9,10)]});
DATA.rencontres.push({n:'Roselière Fantôme',biome:'roseliere',niv:26,loot:{roseau:5,cendre:3},m:[gri(10,3),gri(11,8),sac(9,10),cra(11,5)]});
DATA.rencontres.push({n:'Serre de la Duchesse (boss)',biome:'serre',niv:30,loot:{cendre:8,roseau:5,braise:6},say:'cendres',vic:'duchesse_vic',m:[duch(11,7),gri(9,3),gri(10,9)]});
DATA.lampiste.push({cap:15,cout:{cendre:8,roseau:8,braise:8}});
DATA.cartes.manoir.exits.push({x:12,y:6,to:'marais',tx:1,ty:6});
DATA.cartes.marais={n:'Marais de Cendres',biome:'marais',need:4,start:[1,6],tint:'rgba(120,125,115,.22)',
rocks:[[3,3],[3,4],[6,2],[6,9],[7,9],[9,4],[10,4],[4,10],[11,10],[8,7]],
npcs:[{x:2,y:8,e:'🧙',n:'La Passeuse',quests:['q4','q5'],txt:"Le marais n'a pas de chemin, seulement des habitudes. Je connais les habitudes. J'échange aussi des ressources, si tu veux.",
trade:[{give:{braise:2},get:{cendre:1}},{give:{laine:2},get:{roseau:1}},{give:{cendre:1},get:{braise:2}},{give:{roseau:1},get:{champi:2}}]}],
picks:[{x:1,y:2,quest:'q4'},{x:10,y:11,quest:'q4'},{x:11,y:2,quest:'q4'}],
groups:[{x:9,y:6,renc:4},{x:10,y:9,renc:4}],
nodes:[{x:2,y:3,res:'cendre'},{x:5,y:11,res:'roseau'},{x:11,y:5,res:'cendre'}],
exits:[{x:0,y:6,to:'manoir',tx:11,ty:6},{x:12,y:6,to:'roseliere',tx:1,ty:6}]};
DATA.cartes.roseliere={n:'Roselière Fantôme',biome:'roseliere',need:5,start:[1,6],tint:'rgba(90,150,140,.22)',
rocks:[[3,2],[4,2],[6,5],[6,6],[8,10],[9,10],[10,3],[2,9],[5,8]],npcs:[],
hides:[{x:2,y:4,renc:5,quest:'q5'},{x:7,y:11,renc:5,quest:'q5'},{x:11,y:8,renc:5,quest:'q5'}],
groups:[{x:9,y:6,renc:5},{x:9,y:9,renc:5}],
nodes:[{x:2,y:2,res:'roseau'},{x:4,y:11,res:'roseau'},{x:11,y:11,res:'cendre'}],
exits:[{x:0,y:6,to:'marais',tx:11,ty:6},{x:12,y:6,to:'serre',tx:1,ty:6}]};
DATA.cartes.serre={n:'Serre de la Duchesse',biome:'serre',need:6,start:[1,6],tint:'rgba(150,140,165,.26)',
rocks:[[4,3],[4,9],[8,3],[8,9],[6,6]],npcs:[],
groups:[{x:10,y:6,renc:6}],
nodes:[{x:2,y:2,res:'cendre'},{x:2,y:10,res:'roseau'}],
exits:[{x:0,y:6,to:'roseliere',tx:11,ty:6}]};
DATA.quetes.q4={n:'La Lueur qui ne bougeait pas',desc:"Retrouve les 3 lanternes d'appel (🏮) dans le marais, puis rapporte 3 🌾 pour construire un banc : la Têtue refuse de partir sans s'asseoir.",need:3,kind:'pick',req:4,cost:{roseau:3},
say:"Une Lueur est plantée au milieu du marais depuis des années. Elle dit qu'elle attend. Rapporte trois lanternes d'appel, et de quoi lui faire un banc.",
fin:"Elle s'est assise, a regardé le banc, et a dit : « Bon. D'accord. » C'est la première fois qu'elle cède. Elle te suit.",rew:{xpq:[23,'lueur'],lueur:'tetue'}};
DATA.quetes.q5={n:'Les rêves de la roselière',desc:'Trouve les 3 bulles de rêve (🌿) dans la roselière, puis offre un oreiller de roseaux (4 🌾) à la Rêveuse.',need:3,kind:'hide',req:5,cost:{roseau:4},
say:"Dans la roselière, quelqu'un rêve si fort que les roseaux s'endorment. Cherche les bulles de rêve, et apporte de quoi faire un oreiller.",
fin:"Elle s'est allongée sur l'oreiller en trois secondes. « Je rêvais justement de toi », dit-elle. Elle te suit.",rew:{xpq:[27,'lueur'],lueur:'reveuse'}};
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
DATA.ambiance={village:{type:'lucioles'},foret:{type:'spores'},collines:{type:'brume'},manoir:{type:'poussiere'},marais:{type:'cendres'},roseliere:{type:'cendres'},serre:{type:'cendres'},desert:{type:'sable'},temple:{type:'eclats'},citadelle:{type:'cendres'},trone:{type:'eclats'}};
DATA.decor={village:.14,foret:.19,collines:.13,manoir:.1,marais:.16,roseliere:.2,serre:.12,desert:.1};

// ============ ACTE 1 : habitants, dialogues et quêtes de livraison ============
(()=>{const npc=(m,n)=>DATA.cartes[m].npcs.find(p=>p.n==n);
DATA.cartes.village.npcs.push(
{x:2,y:3,e:'👵',n:'Mémé Lumignon',quests:['L1'],txt:'Mon petit-fils a livré ma soupe à la mauvaise maison. Il a 40 ans, je ne l\'ai pas élevé pour ça.',variantes:[{si:{renc:{min:4}},txt:'Tu as battu un fantôme administratif ? Ton grand-père serait fier. Et surpris.'}]},
{x:7,y:6,e:'🧑‍🌾',n:'Tonton Zébulon',quests:['L3'],txt:'Un vrai soleil, garanti 3 minutes. Remboursé si ça s\'éteint. Ça s\'éteint toujours.',variantes:[{si:{flag:'lettre_vue'},txt:'Le Roi veut les Lueurs ? Moi, je vends des ampoules. On n\'a pas la même clientèle.'}]},
{x:9,y:5,e:'💂',n:'Pétoche',txt:'Je garde le village depuis 12 ans. Il ne s\'est jamais rien passé. Ça me rassure et ça m\'inquiète.',variantes:[{si:{quete:{id:'q3',etat:'finie'}},txt:'Elle me comprend, ta Lueur. On devrait monter un club.'}]},
{x:5,y:7,e:'👧',n:'Pipelette',txt:'Il paraît que le soleil était jaune. Ma maîtresse dit que c\'est une légende.',variantes:[{si:{flag:'lettre_vue'},txt:'Papa dit qu\'il ne faut pas appeler le Roi « Éteint ». Je l\'ai fait. Il n\'a rien dit. Il est loin.'}]});
const lamp=npc('village','Maître Lampiste'),march=npc('village','Le marchand');
lamp.quests.push('L2','L5');lamp.variantes.unshift({si:{renc:{min:4}},txt:'Le manoir est libre. Ta lanterne brille plus fort, ou c\'est moi qui vieillis.'});
march.quests=['L4'];march.variantes=[{si:{quete:{id:'q3',etat:'finie'}},txt:'Elle a pris l\'échange du jour. Je n\'ose plus rien lui refuser.'}];
DATA.cartes.foret.npcs.push({x:10,y:5,e:'🧙‍♂️',n:'Ermite Champignac',txt:'Mon sentier est fermé. Ça ne m\'empêche pas de recevoir du courrier. Ça m\'empêche d\'en lire.'});
DATA.cartes.collines.npcs.push({x:10,y:3,e:'🧑‍🦳',n:'Berger Laine-de-Nuit',txt:'Mes moutons sont fantômes, mais ils ont quand même besoin de tonte.'});
DATA.cartes.foret.picks=[{x:11,y:2,quest:'L3'}];
DATA.cartes.collines.picks=[{x:11,y:7,quest:'L5'}];
Object.assign(DATA.quetes,{
L1:{n:'Soupe égarée',desc:'Porte la soupe de Mémé Lumignon à Pétoche, le gardien, sans te faire brûler par les mouches.',need:1,kind:'livre',req:0,to:'Pétoche',donneur:'Mémé Lumignon',say:'Cette soupe doit aller chez Pétoche. Elle est encore chaude. Les mouches aussi, d\'ailleurs.',recu:'Ce n\'est pas ma soupe. Mais je la mange.',fin:'Il l\'a mangée ? Alors c\'était la bonne maison. Tiens, pour ta peine.',rew:{xpq:[3,'courte'],res:{braise:2}}},
L2:{n:'Colis pour l\'ermite',desc:'Livre des lanternes à l\'Ermite Champignac, dans la forêt. Son sentier est gardé par des monstres.',need:1,kind:'livre',req:1,to:'Ermite Champignac',say:'Ces lanternes sont pour l\'Ermite Champignac. Il a fermé son sentier, mais pas sa boîte aux lettres.',recu:'Des lanternes ? Enfin quelqu\'un qui comprend l\'obscurité.',fin:'Livré ? Parfait. L\'ermite paie toujours en champignons.',rew:{xpq:[6,'normale'],res:{champi:3}}},
L3:{n:'Soleil en bouteille',desc:'Retrouve la caisse de Tonton Zébulon, tombée dans un champ de champignons de la forêt.',need:1,kind:'pick',req:1,donneur:'Tonton Zébulon',say:'Mon colis de soleils est tombé dans la forêt. Cherche la caisse qui brille. Ou qui clignote.',fin:'Intacte ! Enfin, ça clignote. C\'est normal.',rew:{xpq:[8,'normale'],res:{braise:3}}},
L4:{n:'Courrier du berger',desc:'Porte une lettre au Berger Laine-de-Nuit, dans les Collines. Ses moutons-fantômes font des détours.',need:1,kind:'livre',req:2,to:'Berger Laine-de-Nuit',donneur:'Le marchand',say:'Une lettre pour le berger des collines. Ses moutons font des détours, sois patient.',recu:'Une lettre ? Mes moutons ne savent pas lire. Moi non plus, mais je fais semblant.',fin:'Il a répondu ? Tant mieux. Je ne lis pas non plus.',rew:{xpq:[12,'normale'],res:{laine:4}}},
L5:{n:'Livraison urgente',desc:'Récupère un colis scellé dans les Collines et rapporte-le au Maître Lampiste, avant que le Chambellan ne réclame un formulaire.',need:1,kind:'pick',req:2,say:'Un colis scellé m\'attend dans les collines. Rapporte-le avant le manoir : le Chambellan réclamerait un formulaire.',fin:'Scellé, intact, et sans formulaire. Tu progresses.',rew:{xpq:[15,'longue'],res:{braise:4,champi:4,laine:4}}}});
})();

// ============ ACTE 2 : DÉSERT DES CHAUSSETTES PERDUES (niveaux 33 à 40) ============
DATA.res.sable='🏜️ Sable';DATA.res.fil='🧵 Fil';DATA.res.chaussette='🧦 Chaussettes';DATA.resE.sable='🏜️';DATA.resE.fil='🧵';DATA.resE.chaussette='🧦';
const squ=(x,y)=>({x,y,hp:60,max:60,pm:3,d:18,e:'💀',n:'Squelette gréviste',sort:{n:'Coup de pancarte',r:[1,1],push:1,etats:[{id:'affaibli',v:25,t:2}],cd:3}}),
sco=(x,y)=>({x,y,hp:52,max:52,pm:3,d:19,e:'🦂',n:'Scorpion de sable',sort:{n:'Piqûre',r:[1,1],etats:[{id:'poison',v:4,t:3}],cd:2}}),
chl=(x,y)=>({x,y,hp:48,max:48,pm:4,d:18,e:'🧦',n:'Chaussette lanceuse',ia:'dist',garde:[3,4],sort:{n:'Chaussette lancée',r:[2,5],los:1,dmg:18,cd:0}}),
cmi=(x,y)=>({x,y,hp:70,max:70,pm:2,d:12,e:'🐪',n:'Chameau-infirmier',ia:'soin',sort:{n:'Sieste express',r:[1,3],heal:15,cd:3}}),
chs=(x,y)=>({x,y,hp:80,max:80,pm:2,d:22,e:'🧦',n:'Chaussette sale',mort:{n:'Éclatement de sueur',r:1,dmg:18}}),
gen=(x,y)=>({x,y,hp:190,max:190,pm:2,d:22,e:'🪖',n:'Général Gréviste',boss:1,escorte:2,prot:'ses grévistes font un cercle autour de lui',sort:{n:'Appel à la grève',r:[1,1],push:1,dmg:22,etats:[{id:'affaibli',v:25,t:2}],etatsSoi:[{id:'bouclier',v:20,t:2}],cd:3}});
DATA.rencontres.push(
{n:'Dunes des Chaussettes Perdues',biome:'desert',niv:33,loot:{sable:4,fil:2},m:[squ(10,3),sco(11,8),chl(9,10)]},
{n:'Oasis aux Chaussettes',biome:'desert',niv:36,loot:{chaussette:4,fil:2},m:[chl(10,3),sco(11,8),cmi(9,10),chs(11,5)]},
{n:'Piquets de grève',biome:'desert',niv:38,type:'elite',loot:{sable:3,chaussette:3,fil:3},m:[squ(10,3),squ(11,8),cmi(9,10),chs(11,5)]},
{n:'Général Gréviste (boss)',biome:'desert',niv:40,say:'cercle',loot:{sable:8,fil:5,chaussette:5},m:[gen(11,7),squ(9,3),squ(10,9)]});
DATA.objets.turban_sable={n:'Turban de sable',e:'🧕',slot:'tete',r:1,st:{pv:20},set:'dunes',cout:{sable:6,fil:3}};
DATA.objets.tunique_fil={n:'Tunique de fil',e:'👘',slot:'corps',r:1,st:{pv:20,res:6},set:'dunes',cout:{fil:8,sable:4,chaussette:2}};
DATA.objets.sandales_dunes={n:'Sandales des dunes',e:'🩴',slot:'bottes',r:1,st:{pv:12,res:4},set:'dunes',cout:{sable:5,chaussette:3}};
DATA.objets.bracelet_chaussette={n:'Bracelet de chaussette',e:'🧦',slot:'acc',r:1,st:{pv:10,dmg:1},set:'dunes',cout:{chaussette:5,fil:3}};
DATA.objets.amulette_grain={n:'Amulette de grain',e:'📿',slot:'acc',r:1,st:{res:6},set:'dunes',cout:{sable:6,chaussette:3}};
DATA.objets.pancarte_general={n:'Pancarte du Général',e:'🪧',slot:'arme',r:3,st:{dmg:6}};
DATA.objets.casque_negociateur={n:'Casque du Négociateur',e:'🪖',slot:'tete',r:3,st:{pv:22,res:6}};
DATA.sets.dunes={n:'Panoplie des dunes',bonus:{2:{pv:12},4:{dmg:1,res:5}}};
DATA.rencontres[10].drops=[{id:'pancarte_general',p:100}];
DATA.cartes.serre.exits.push({x:12,y:6,to:'dunes',tx:1,ty:6});
DATA.cartes.dunes={n:'Dunes des Chaussettes Perdues',biome:'desert',need:7,start:[1,6],tint:'rgba(220,170,90,.14)',
rocks:[[3,3],[3,4],[5,9],[6,9],[8,2],[9,8],[10,3],[2,10],[11,10],[7,5]],
npcs:[{x:2,y:8,e:'⏳',n:'Vieux Sablier',quests:['d1','d2'],txt:'Le temps passe, le sable aussi. Les chaussettes, elles, disparaissent. Je tiens un registre.'}],
picks:[{x:1,y:2,quest:'d1'},{x:6,y:11,quest:'d1'},{x:11,y:6,quest:'d1'}],
groups:[{x:9,y:5,renc:7},{x:8,y:10,renc:7}],
nodes:[{x:2,y:4,res:'sable'},{x:5,y:2,res:'fil'},{x:11,y:2,res:'sable'}],
coffres:[{x:12,y:11,res:{sable:3,fil:2}}],
exits:[{x:0,y:6,to:'serre',tx:11,ty:6},{x:12,y:6,to:'oasis',tx:1,ty:6}]};
DATA.cartes.oasis={n:'Oasis aux Chaussettes',biome:'desert',need:8,start:[1,6],tint:'rgba(120,190,150,.14)',
rocks:[[4,2],[4,3],[7,10],[8,10],[6,6],[10,2],[2,9],[11,8]],
npcs:[{x:3,y:4,e:'🧔',n:'Marchand de chaussettes',txt:'Chaussettes neuves, chaussettes vieilles, chaussettes sans âme sœur. Tout se vend.',trade:[{give:{sable:2},get:{fil:1}},{give:{fil:2},get:{chaussette:1}},{give:{chaussette:2},get:{sable:1}},{give:{braise:2},get:{sable:1}}]},
{x:6,y:3,e:'🧑‍🦱',n:'Chamelier',txt:'Mon chameau est un grand sensible. Il lui faut une sieste après chaque phrase.'},
{x:9,y:9,e:'🧑‍🍳',n:"Hôtelier de l'oasis",txt:'Chambres à louer. Vue sur le sable. Attention aux draps, ils ne sont pas appariés.'}],
groups:[{x:8,y:4,renc:8},{x:10,y:9,renc:8}],
nodes:[{x:2,y:2,res:'chaussette'},{x:5,y:11,res:'chaussette'},{x:11,y:4,res:'fil'}],
coffres:[{x:12,y:1,res:{chaussette:3,fil:2}}],
exits:[{x:0,y:6,to:'dunes',tx:11,ty:6},{x:12,y:6,to:'camp',tx:1,ty:6}]};
DATA.cartes.camp={n:'Camp des Grévistes',biome:'desert',need:9,start:[1,6],tint:'rgba(190,120,80,.16)',
rocks:[[4,3],[4,9],[7,6],[6,2],[6,10]],
npcs:[{x:3,y:8,e:'🧟',n:'Délégué des Chaussettes',quests:['d3','d4'],txt:'Nous gardons cette porte depuis 300 ans. On n\'a jamais demandé pourquoi. On demande maintenant.'},
{x:11,y:6,e:'🪖',n:'Général Gréviste',cache:[{flag:'general_convaincu'},{flag:'general_battu'}],txt:'Camarade, la grève est légitime. Et elle est longue.',
actions:[{id:'negocier',t:'Négocier',sub:'Il réclame des chaussettes, du fil et du sable.',ok:{flag:'revendications'},why:'Il réclame des chaussettes, du fil et du sable : parle d\'abord au Délégué.',rew:{xp:800,item:'casque_negociateur',renc:10}},
{id:'combat',t:'Se battre',sub:'Lancer le combat',ok:{quete:{id:'d3',etat:'finie'}},why:'Repousse d\'abord les piquets de grève.',fight:10,cls:'danger'}]},
{x:11,y:10,e:'🏮',n:'La lanterne-prison',cache:[{flag:'colerique_libre'}],txt:'Une lanterne ancienne. Quelqu\'un crie à l\'intérieur, mais poliment.',
actions:[{id:'colerique',t:'Libérer la Lueur',sub:'Ouvrir la lanterne',ok:{quete:{id:'d3',etat:'finie'}},why:'Les grévistes la surveillent encore : repousse leurs piquets.',rew:{xpq:[40,'lueur'],lueur:'colerique'}}]}],
groups:[{x:8,y:3,renc:9},{x:8,y:9,renc:9},{x:10,y:6,renc:9}],
nodes:[{x:2,y:2,res:'sable'},{x:2,y:10,res:'chaussette'}],
coffres:[{x:12,y:12,res:{sable:3,chaussette:2,fil:2}}],
exits:[{x:0,y:6,to:'oasis',tx:11,ty:6}]};
Object.assign(DATA.quetes,{
d1:{n:'Indices absurdes',desc:'Ramasse 3 chaussettes dépareillées dans les Dunes pour le Vieux Sablier.',need:3,kind:'pick',req:7,donneur:'Vieux Sablier',say:'Une Lueur joue à cache-cache. Elle laisse des indices : des chaussettes dépareillées. Trois, dans les dunes.',fin:'Dépareillées, bien sûr. Ça confirme tout, et ça n\'explique rien.',rew:{xpq:[33,'normale']}},
d2:{n:'La Lueur qui joue à cache-cache',desc:'Fais une farce au Marchand de chaussettes, au Chamelier et à l\'Hôtelier de l\'oasis.',need:3,kind:'livre',req:8,apres:'d1',to:['Marchand de chaussettes','Chamelier',"Hôtelier de l'oasis"],donneur:'Vieux Sablier',say:'Les indices mènent à l\'oasis. La Lueur adore les farces : fais-en une à chacun des trois, elle viendra voir.',
recu:{'Marchand de chaussettes':'Mes chaussettes ne sont plus assorties ! C\'est du génie ou du sabotage ?','Chamelier':'Mon chameau porte un chapeau. Je ne l\'ai pas mis. Il ne me parle plus.',"Hôtelier de l'oasis":'Mes lits sont tous à l\'envers. Ça ne change rien, les clients dormaient mal.'},
fin:'Elle t\'a trouvé, ou c\'est l\'inverse. Dans le doute, elle te suit.',rew:{xpq:[36,'lueur'],lueur:'farceuse'}},
d3:{n:'Piquet de grève',desc:'Repousse 3 groupes de piquets de grève au Camp des Grévistes.',need:3,kind:'win',renc:9,req:9,donneur:'le Délégué des Chaussettes',say:'Les piquets bloquent tout. Repousse-en trois groupes, que je puisse enfin parler au Général.',fin:'Les piquets sont repoussés. Pour une fois, ils n\'ont pas fait grève de la fuite.',rew:{xpq:[38,'longue']}},
d4:{n:'Les revendications',desc:'Rassemble 6 fils, 6 chaussettes et 4 sables pour satisfaire les revendications du Général.',need:0,kind:'don',req:9,apres:'d3',cost:{fil:6,chaussette:6,sable:4},donneur:'le Délégué des Chaussettes',say:'Le Général réclame des chaussettes assorties, du fil et du sable. Donne-moi de quoi lui faire une offre.',fin:'Des chaussettes assorties ! Le Général va peut-être pleurer. Va lui parler.',rew:{xpq:[38,'normale'],set:{revendications:true}}}});

// ============ ACTE 3 : CHEMIN DU SOLEIL, TEMPLE, CITADELLE BRISÉE (niveaux 44 à 60) ============
DATA.res.eclat='🌟 Éclats de soleil';DATA.res.gravat='🧱 Gravats';DATA.resE.eclat='🌟';DATA.resE.gravat='🧱';
const pel=(x,y)=>({x,y,hp:75,max:75,pm:3,d:21,e:'🧎',n:'Pèlerin éteint',sort:{n:'Bénédiction ratée',r:[1,1],etats:[{id:'affaibli',v:25,t:2}],cd:3}}),
luc=(x,y)=>({x,y,hp:60,max:60,pm:4,d:20,e:'🪲',n:'Luciole terne',ia:'dist',garde:[3,4],sort:{n:'Éclat pâle',r:[2,5],los:1,dmg:21,cd:0}}),
sta=(x,y)=>({x,y,hp:110,max:110,pm:2,d:25,e:'🗿',n:'Statue de soleil',mort:{n:'Éboulement',r:1,dmg:20}}),
pre=(x,y)=>({x,y,hp:85,max:85,pm:2,d:16,e:'🧑‍🦯',n:'Prêtre aveugle',ia:'soin',sort:{n:'Prière tardive',r:[1,3],heal:18,cd:3}}),
ecl=(x,y)=>({x,y,hp:230,max:230,pm:2,d:26,e:'🌘',n:'Éclipse',boss:1,cycle:{a:2,b:2},prot:'elle est dans l’ombre',sort:{n:'Ombre portée',r:[1,3],los:1,dmg:26,etats:[{id:'ralenti',v:1,t:2}],cd:2}}),
voi=(x,y)=>({x,y,hp:20,max:20,pm:0,d:0,e:'🌑',n:'Le voile d’ombre',form:1,pct:.14,regen:.03}),
gar=(x,y)=>({x,y,hp:95,max:95,pm:3,d:25,e:'🛡️',n:'Garde fantôme',sort:{n:'Charge spectrale',r:[1,1],push:1,dmg:25,cd:3}}),
arc=(x,y)=>({x,y,hp:70,max:70,pm:4,d:22,e:'🏹',n:'Archer osseux',ia:'dist',garde:[3,4],sort:{n:'Flèche rouillée',r:[2,6],los:1,dmg:24,cd:0}}),
che=(x,y)=>({x,y,hp:120,max:120,pm:2,d:27,e:'🤺',n:'Chevalier brisé',sort:{n:'Coup de pommeau',r:[1,1],push:1,etats:[{id:'affaibli',v:25,t:2}],cd:3}}),
lch=(x,y)=>({x,y,hp:130,max:130,pm:2,d:24,e:'👻',n:'Chambellan Poussière',sort:{n:'Tampon officiel',r:[2,3],los:1,dmg:24,etats:[{id:'affaibli',v:25,t:2}],cd:2}}),
ldu=(x,y)=>({x,y,hp:120,max:120,pm:2,d:22,e:'👸',n:'Duchesse des Cendres',ia:'dist',garde:[3,4],sort:{n:'Pluie de cendres',r:[2,4],los:1,dmg:26,cd:1}}),
lge=(x,y)=>({x,y,hp:150,max:150,pm:2,d:26,e:'🪖',n:'Général Gréviste',sort:{n:'Appel à la grève',r:[1,1],push:1,dmg:26,etatsSoi:[{id:'bouclier',v:20,t:2}],cd:3}}),
bou=(x,y)=>({x,y,hp:260,max:260,pm:3,d:27,e:'🤡',n:'Bouffon Sans Rire',boss:1,alerte:{every:3,r:1,mult:1.4,n:'Blague sans rire',vul:1},sort:{n:'Blague sans rire',r:[1,3],los:1,dmg:27,etats:[{id:'affaibli',v:25,t:2}],cd:2}}),
roi=(x,y)=>({x,y,hp:320,max:320,pm:2,d:29,e:'👑',n:'Le Roi Éteint',boss:1,prot:'sa vexation le protège',sort:{n:'Décret royal',r:[1,4],los:1,dmg:30,etats:[{id:'affaibli',v:25,t:2}],etatsSoi:[{id:'bouclier',v:25,t:2}],cd:3}}),
vex=(x,y)=>({x,y,hp:25,max:25,pm:0,d:0,e:'😤',n:'Sa vexation',form:1,pct:.14,regen:.04,mock:.3}),
cou=(x,y)=>({x,y,hp:90,max:90,pm:3,d:24,e:'💀',n:'Courtisan squelette',sort:{n:'Révérence tranchante',r:[1,1],dmg:24,cd:2}});
DATA.rencontres.push(
{n:'Chemin du Soleil Couchant',biome:'desert',niv:44,loot:{eclat:4,gravat:2},m:[pel(10,3),luc(11,8),sta(9,10)]},
{n:'Parvis du Temple',biome:'temple',niv:47,loot:{eclat:4,gravat:3},m:[pre(9,10),pel(10,3),luc(11,8),sta(11,5)]},
{n:'Temple du Soleil (boss)',biome:'temple',niv:50,say:'eclipse',loot:{eclat:8,gravat:5},m:[ecl(11,7),pre(9,3),pel(10,9)]},
{n:'Cour de la Citadelle',biome:'citadelle',niv:53,loot:{gravat:5,eclat:3},m:[gar(10,3),arc(11,8),che(9,10),gar(11,5)]},
{n:'Salle des Lieutenants',biome:'citadelle',niv:56,type:'elite',loot:{eclat:5,gravat:5},m:[lch(10,4),ldu(11,9),lge(9,7)]},
{n:'Duel du Bouffon (boss)',biome:'citadelle',niv:58,say:'blague',loot:{eclat:6,gravat:6},m:[bou(11,7)]},
{n:'Le Roi Éteint (boss final)',biome:'trone',niv:60,say:'vexation',loot:{eclat:10,gravat:8},m:[roi(11,7),vex(11,6),cou(9,3),cou(10,9)]});
DATA.objets.diademe_eclat={n:'Diadème d’éclats',e:'👑',slot:'tete',r:2,st:{pv:26},set:'soleil',cout:{eclat:6,gravat:3}};
DATA.objets.cuirasse_aube={n:'Cuirasse d’aube',e:'🥋',slot:'corps',r:2,st:{pv:26,res:8},set:'soleil',cout:{eclat:8,gravat:4}};
DATA.objets.bottes_crepuscule={n:'Bottes du crépuscule',e:'🥾',slot:'bottes',r:2,st:{pv:16,res:5},set:'soleil',cout:{eclat:5,gravat:3}};
DATA.objets.anneau_eclat={n:'Anneau d’éclat',e:'💍',slot:'acc',r:2,st:{pv:12,dmg:2},set:'soleil',cout:{eclat:5,gravat:2}};
DATA.objets.medaille_gardien={n:'Médaille du Gardien',e:'🏅',slot:'acc',r:2,st:{res:8},set:'soleil',cout:{eclat:6,gravat:3}};
DATA.objets.lame_eclipse={n:'Lame d’éclipse',e:'🗡️',slot:'arme',r:3,st:{dmg:8}};
DATA.objets.couronne_eteinte={n:'Couronne éteinte',e:'👑',slot:'tete',r:3,st:{pv:30,res:8}};
DATA.sets.soleil={n:'Panoplie du soleil couchant',bonus:{2:{pv:14},4:{dmg:2,res:6}}};
DATA.rencontres[13].drops=[{id:'lame_eclipse',p:100}];
DATA.rencontres[17].drops=[{id:'couronne_eteinte',p:100}];
DATA.cartes.camp.exits.push({x:12,y:6,to:'chemin',tx:1,ty:6});
DATA.cartes.chemin={n:'Chemin du Soleil Couchant',biome:'desert',need:11,start:[1,6],tint:'rgba(240,150,70,.16)',
rocks:[[4,2],[4,10],[6,6],[8,3],[8,9],[10,6]],
npcs:[{x:2,y:8,e:'🧙',n:'Pèlerin Cendré',quests:['e1'],txt:'Je marche vers le Temple depuis 300 ans. Je n’ai jamais regardé où il était. Il est devant.'}],
picks:[{x:1,y:2,quest:'e1'},{x:6,y:11,quest:'e1'},{x:11,y:11,quest:'e1'}],
groups:[{x:9,y:4,renc:11},{x:9,y:9,renc:11}],
nodes:[{x:2,y:3,res:'eclat'},{x:5,y:2,res:'gravat'}],
coffres:[{x:12,y:1,res:{eclat:3,gravat:2}}],
exits:[{x:0,y:6,to:'camp',tx:11,ty:6},{x:12,y:6,to:'parvis',tx:1,ty:6}]};
DATA.cartes.parvis={n:'Parvis du Temple',biome:'temple',need:12,start:[1,6],tint:'rgba(255,210,120,.14)',
rocks:[[3,3],[3,9],[6,2],[6,10],[7,6],[9,3],[9,9]],
npcs:[{x:2,y:6,e:'🧑‍🦯',n:'Gardien du Parvis',quests:['e2'],txt:'Le Temple est fermé à cause de la tristesse. Entendez : trop de monstres qui pleurent.'}],
groups:[{x:8,y:4,renc:12},{x:9,y:8,renc:12},{x:11,y:6,renc:12}],
nodes:[{x:2,y:2,res:'eclat'},{x:11,y:11,res:'gravat'}],
exits:[{x:0,y:6,to:'chemin',tx:11,ty:6},{x:12,y:2,to:'temple',tx:1,ty:6}]};
DATA.cartes.temple={n:'Temple du Soleil',biome:'temple',need:13,start:[1,6],tint:'rgba(120,100,170,.2)',
rocks:[[4,3],[4,9],[6,6],[8,3],[8,9]],
npcs:[{x:2,y:10,e:'🏮',n:'La lanterne d’ombre',cache:[{flag:'melancolique_libre'}],txt:'Une lanterne noire. À l’intérieur, quelqu’un soupire avec élégance.',
actions:[{id:'melancolique',t:'Libérer la Lueur',sub:'Ouvrir la lanterne d’ombre',ok:{renc:{min:14}},why:'Une ombre garde la lanterne : bats Éclipse.',rew:{xpq:[50,'lueur'],lueur:'melancolique'}}]}],
groups:[{x:10,y:6,renc:13}],
nodes:[{x:2,y:2,res:'eclat'},{x:2,y:10,res:'gravat'}],
exits:[{x:0,y:6,to:'parvis',tx:11,ty:2},{x:12,y:6,to:'cour',tx:1,ty:6}]};
DATA.cartes.cour={n:'Cour de la Citadelle',biome:'citadelle',need:14,start:[1,6],tint:'rgba(130,70,170,.2)',
rocks:[[4,2],[4,10],[6,4],[6,8],[8,6],[10,2],[10,10]],
npcs:[{x:2,y:3,e:'👻',n:'Capitaine fantôme',quests:['e3'],txt:'Garde de la Citadelle depuis sa chute. Mon poste est de ne laisser entrer personne. Je n’ai pas dit pour qui.'}],
picks:[{x:1,y:11,quest:'e3'},{x:7,y:1,quest:'e3'},{x:11,y:6,quest:'e3'}],
groups:[{x:9,y:4,renc:14},{x:9,y:9,renc:14}],
nodes:[{x:3,y:6,res:'gravat'},{x:11,y:11,res:'eclat'}],
coffres:[{x:12,y:1,res:{eclat:3,gravat:3}}],
exits:[{x:0,y:6,to:'temple',tx:11,ty:6},{x:12,y:6,to:'salle',tx:1,ty:6}]};
DATA.cartes.salle={n:'Salle des Lieutenants',biome:'citadelle',need:15,start:[1,6],tint:'rgba(150,60,90,.2)',
rocks:[[4,3],[4,9],[7,3],[7,9]],
npcs:[{x:11,y:3,e:'🤡',n:'Bouffon Sans Rire',cache:[{flag:'bouffon_vaincu'}],txt:'Je ne ris pas. Je dois prévenir : mon duel est prêt.',
actions:[{id:'duel',t:'Relever le duel',sub:'Lancer le combat',ok:{renc:{min:16}},why:'Les lieutenants montent encore la garde : bats-les d’abord.',fight:16,cls:'danger'}]}],
groups:[{x:9,y:7,renc:15}],
nodes:[{x:2,y:2,res:'gravat'},{x:2,y:10,res:'eclat'}],
exits:[{x:0,y:6,to:'cour',tx:11,ty:6},{x:12,y:6,to:'trone',tx:1,ty:6}]};
DATA.cartes.trone={n:'Salle du Trône',biome:'trone',need:17,start:[1,6],tint:'rgba(90,100,125,.3)',
rocks:[[4,3],[4,9],[7,5],[7,7]],npcs:[],
groups:[{x:10,y:6,renc:17}],
nodes:[{x:2,y:2,res:'eclat'},{x:2,y:10,res:'gravat'}],
exits:[{x:0,y:6,to:'salle',tx:11,ty:6}]};
Object.assign(DATA.quetes,{
e1:{n:'Pétales de couchant',desc:'Ramasse 3 pétales de soleil mourant le long du Chemin pour le Pèlerin Cendré.',need:3,kind:'pick',req:11,donneur:'Pèlerin Cendré',say:'Des pétales de couchant. Elles fleurissent là où le soleil est passé pour la dernière fois. Trois, s’il te plaît.',fin:'Elles brillent encore. Je les offrirai au Temple, s’il se souvient de moi.',rew:{xpq:[44,'normale'],res:{eclat:4}}},
e2:{n:'Parvis en deuil',desc:'Repousse 2 groupes de monstres éplorés sur le Parvis du Temple.',need:2,kind:'win',renc:12,req:12,donneur:'Gardien du Parvis',say:'Les pèlerins éteints pleurent sur mes marches. Repousse-en deux groupes, que je puisse balayer.',fin:'Enfin du silence. Il y a du bruit dans le silence, mais c’est le mien.',rew:{xpq:[47,'longue'],res:{eclat:4,gravat:2}}},
e3:{n:'Médailles de la Garde',desc:'Retrouve 3 médailles de la Garde royale dans la Cour de la Citadelle.',need:3,kind:'pick',req:14,donneur:'Capitaine fantôme',say:'Mes gardes ont perdu leurs médailles dans la cour. Trois. Sans elles, ils ne se souviennent plus d’être des gardes.',fin:'Les voilà ! Ils vont se souvenir. Ils vont être très fâchés.',rew:{xpq:[53,'longue'],res:{eclat:4,gravat:4}}}});

// ============ ÉQUIPEMENT DES ACTES 2 ET 3 : nouveaux objets, panoplies et butins ============
DATA.sets.marais={n:'Panoplie des marais',bonus:{2:{pv:10},4:{dmg:1,res:4}}};
['lame_roseau','capuchon_cendre','tunique_roseau','sandales_roseau','bracelet_cendre'].forEach(id=>{if(DATA.objets[id])DATA.objets[id].set='marais'});
Object.assign(DATA.objets,{
baton_sable:{n:'Bâton de sable',e:'🪄',slot:'arme',r:1,st:{dmg:3},set:'dunes',cout:{sable:6,fil:3}},
cimeterre_dunes:{n:'Cimeterre des dunes',e:'🗡️',slot:'arme',r:2,st:{dmg:5}},
amulette_mirage:{n:'Amulette du mirage',e:'🔮',slot:'acc',r:2,st:{pv:14,dmg:1}},
cape_marchand:{n:'Cape du marchand',e:'🧣',slot:'corps',r:2,st:{pv:24,res:6}},
bottes_chameau:{n:'Bottes de chameau',e:'🥾',slot:'bottes',r:2,st:{pv:12,pm:1}},
casque_piquet:{n:'Casque de piquet',e:'⛑️',slot:'tete',r:2,st:{pv:24,res:4}},
brassard_greviste:{n:'Brassard de gréviste',e:'🎗️',slot:'acc',r:2,st:{dmg:2,res:4}},
etendard_greve:{n:'Étendard de grève',e:'🚩',slot:'acc',r:3,st:{pv:20,dmg:2,res:6}},
lame_aube:{n:'Lame d’aube',e:'⚔️',slot:'arme',r:2,st:{dmg:6},set:'soleil',cout:{eclat:8,gravat:5}},
baton_pelerin:{n:'Bâton de pèlerin',e:'🦯',slot:'arme',r:2,st:{dmg:6}},
sandales_pelerin:{n:'Sandales de pèlerin',e:'🩴',slot:'bottes',r:2,st:{pv:20,res:6}},
collier_parvis:{n:'Collier du parvis',e:'📿',slot:'acc',r:2,st:{pv:18,dmg:1}},
tunique_pretre:{n:'Tunique de prêtre',e:'🥻',slot:'corps',r:2,st:{pv:28,res:8}},
manteau_ombre:{n:'Manteau d’ombre',e:'🧥',slot:'corps',r:3,st:{pv:34,res:10}},
bottes_eclipse:{n:'Bottes d’éclipse',e:'👢',slot:'bottes',r:3,st:{pv:22,res:6,pm:1}},
epee_garde:{n:'Épée de la Garde',e:'🗡️',slot:'arme',r:2,st:{dmg:7}},
heaume_garde:{n:'Heaume de la Garde',e:'🪖',slot:'tete',r:2,st:{pv:28,res:6}},
tampon_chambellan:{n:'Tampon du Chambellan',e:'📎',slot:'acc',r:3,st:{dmg:3,res:8}},
sceptre_cendres:{n:'Sceptre des cendres rallumées',e:'🪄',slot:'arme',r:3,st:{dmg:9}},
masque_bouffon:{n:'Masque du Bouffon',e:'🎭',slot:'tete',r:3,st:{pv:30,dmg:2}},
marotte_bouffon:{n:'Marotte du Bouffon',e:'🃏',slot:'arme',r:3,st:{dmg:10}},
lanterne_gardien:{n:'Lanterne du Gardien',e:'🏮',slot:'acc',r:3,st:{pv:30,dmg:3,res:10}},
armure_gardien:{n:'Armure du Gardien',e:'🛡️',slot:'corps',r:3,st:{pv:40,res:12}}});
const DR=(i,l)=>{DATA.rencontres[i].drops=(DATA.rencontres[i].drops||[]).concat(l)};
DR(7,[{id:'cimeterre_dunes',p:12},{id:'amulette_mirage',p:10}]);
DR(8,[{id:'cape_marchand',p:12},{id:'bottes_chameau',p:10}]);
DR(9,[{id:'casque_piquet',p:20},{id:'brassard_greviste',p:20}]);
DR(10,[{id:'etendard_greve',p:35}]);
DR(11,[{id:'baton_pelerin',p:12},{id:'sandales_pelerin',p:14}]);
DR(12,[{id:'collier_parvis',p:12},{id:'tunique_pretre',p:12}]);
DR(13,[{id:'manteau_ombre',p:35},{id:'bottes_eclipse',p:35}]);
DR(14,[{id:'epee_garde',p:12},{id:'heaume_garde',p:12}]);
DR(15,[{id:'tampon_chambellan',p:30},{id:'sceptre_cendres',p:20}]);
DR(16,[{id:'masque_bouffon',p:60},{id:'marotte_bouffon',p:35}]);
DR(17,[{id:'lanterne_gardien',p:35},{id:'armure_gardien',p:35}]);

// ============ FORÊT ÉTENDUE : Sentier, Clairière et donjon « Le Terrier de la Mère Mycélium » (modèle pour les autres zones) ============
const mer=(x,y)=>({x,y,hp:150,max:150,pm:2,d:12,e:'🍄',n:'Mère Mycélium',boss:1,renfort:{every:3,max:2,m:cha(0,0)},sort:{n:'Nuage de spores',r:[1,3],los:1,dmg:10,etats:[{id:'ralenti',v:1,t:2}],cd:2}});
DATA.rencontres.push(
{n:'Sentier des Lucioles',biome:'foret',niv:8,loot:{champi:3,laine:1},m:[mou(10,3),mou(11,8),cha(9,10)]},
{n:'Clairière des Cèpes',biome:'foret',niv:9,loot:{champi:4,laine:2},m:[cha(10,3),mot(11,8),cha(9,10),mou(11,5)]},
{n:'Terrier : galeries',biome:'foret',niv:10,loot:{champi:4,laine:2},m:[cha(9,3),cha(10,9),mot(11,6)]},
{n:'Terrier : salle des spores',biome:'foret',niv:11,type:'elite',loot:{champi:6,laine:3},m:[cha(10,3),cha(11,6),cha(10,9),mou(9,6)]},
{n:'Mère Mycélium (boss)',biome:'foret',niv:12,say:'mere',loot:{champi:10,laine:5},m:[mer(11,7)]});
DATA.repliques.mere=['Gourmande','Elle fait pousser des champignons à la chaîne ! Tue-la vite, avant qu’ils ne s’accumulent.'];
Object.assign(DATA.objets,{
bague_luciole:{n:'Bague de luciole',e:'💍',slot:'acc',r:1,st:{pv:6,dmg:1}},
bottes_sporees:{n:'Bottes sporées',e:'👢',slot:'bottes',r:1,st:{pv:8,res:3}},
coiffe_mycelium:{n:'Coiffe de mycélium',e:'🍄',slot:'tete',r:2,st:{pv:16,res:3}},
sceptre_mere:{n:'Sceptre de la Mère',e:'🪄',slot:'arme',r:2,st:{dmg:4}},
manteau_mycelium:{n:'Manteau de mycélium',e:'🧥',slot:'corps',r:2,st:{pv:16,res:4}}});
DR(18,[{id:'bague_luciole',p:15}]);DR(19,[{id:'bottes_sporees',p:20}]);DR(21,[{id:'coiffe_mycelium',p:25}]);DR(22,[{id:'sceptre_mere',p:100},{id:'manteau_mycelium',p:40}]);
DATA.cartes.foret.exits.push({x:6,y:0,to:'sentier',tx:6,ty:11});
DATA.cartes.foret.npcs.forEach(n=>{if(n.n=='Ermite Champignac')n.quests=['f3']});
DATA.cartes.sentier={n:'Sentier des Lucioles',biome:'foret',need:1,start:[6,11],tint:'rgba(120,220,140,.14)',
rocks:[[3,4],[3,8],[6,6],[9,4],[9,8]],
npcs:[{x:2,y:11,e:'🧚',n:'Gardienne des lucioles',quests:['f1'],txt:'Mes lucioles s’éteignent une à une. Quelque chose, au fond de la forêt, aspire la lumière.'}],
groups:[{x:9,y:3,renc:18},{x:10,y:9,renc:18}],
nodes:[{x:2,y:2,res:'champi'},{x:11,y:11,res:'laine'}],
exits:[{x:6,y:12,to:'foret',tx:6,ty:1},{x:12,y:6,to:'clairiere',tx:1,ty:6}]};
DATA.cartes.clairiere={n:'Clairière des Cèpes',biome:'foret',need:1,start:[1,6],tint:'rgba(200,170,90,.14)',
rocks:[[4,3],[4,9],[7,6],[10,3],[10,9]],
npcs:[{x:2,y:10,e:'👩‍🌾',n:'Cueilleuse Pâquerette',quests:['f2'],txt:'Les cèpes d’ici sont délicieux. Quand ils ne sont pas hantés.'}],
picks:[{x:2,y:2,quest:'f2'},{x:11,y:11,quest:'f2'},{x:11,y:1,quest:'f2'}],
groups:[{x:9,y:5,renc:19},{x:9,y:10,renc:19}],
nodes:[{x:6,y:2,res:'champi'},{x:6,y:11,res:'laine'}],
coffres:[{x:12,y:12,res:{champi:4,laine:2}}],
exits:[{x:0,y:6,to:'sentier',tx:11,ty:6},{x:12,y:6,to:'terrier1',tx:1,ty:6}]};
DATA.cartes.terrier1={n:'Terrier : galeries',biome:'foret',need:2,start:[1,6],tint:'rgba(40,70,60,.32)',
rocks:[[4,2],[4,10],[6,5],[6,7],[8,3],[8,9]],npcs:[],
groups:[{x:9,y:4,renc:20},{x:9,y:9,renc:20}],
nodes:[{x:2,y:2,res:'champi'}],
exits:[{x:0,y:6,to:'clairiere',tx:11,ty:6},{x:12,y:6,to:'terrier2',tx:1,ty:6}]};
DATA.cartes.terrier2={n:'Terrier : salle des spores',biome:'foret',need:2,start:[1,6],tint:'rgba(70,40,80,.32)',
rocks:[[4,3],[4,9],[7,3],[7,9]],npcs:[],
groups:[{x:9,y:6,renc:21}],
nodes:[{x:2,y:11,res:'champi'}],
coffres:[{x:12,y:1,res:{champi:3,laine:2}}],
exits:[{x:0,y:6,to:'terrier1',tx:11,ty:6},{x:12,y:6,to:'terrier3',tx:1,ty:6}]};
DATA.cartes.terrier3={n:'Terrier : cœur de la Mère',biome:'foret',need:2,start:[1,6],tint:'rgba(90,40,100,.38)',
rocks:[[4,3],[4,9],[7,6]],npcs:[],
groups:[{x:10,y:6,renc:22}],
nodes:[],
coffres:[{x:12,y:12,res:{champi:6,laine:4}}],
exits:[{x:0,y:6,to:'terrier2',tx:11,ty:6}]};
Object.assign(DATA.quetes,{
f1:{n:'Lucioles en péril',desc:'Repousse 2 groupes de monstres sur le Sentier des Lucioles.',need:2,kind:'win',renc:18,req:1,donneur:'Gardienne des lucioles',say:'Chasse les monstres qui rôdent sur le sentier : ils piétinent mes lucioles.',fin:'Elles brillent de nouveau. Un tout petit peu.',rew:{xpq:[8,'normale'],res:{champi:3}}},
f2:{n:'Cèpes égarés',desc:'Ramasse 3 cèpes dans la Clairière pour la Cueilleuse Pâquerette.',need:3,kind:'pick',req:1,donneur:'Cueilleuse Pâquerette',say:'Trois cèpes se sont cachés dans la clairière. Trouve-les, je cuisinerai quelque chose.',fin:'Magnifiques ! Je t’en garde une part. Si tu me promets de ne pas la manger tout de suite.',rew:{xpq:[9,'normale'],res:{champi:4,laine:2}}},
f3:{n:'La Mère qui éteint la forêt',desc:'Pénètre dans le Terrier, au bout de la Clairière, et vaincs la Mère Mycélium.',need:1,kind:'win',renc:22,req:2,donneur:'Ermite Champignac',say:'Tout le champignon de la forêt s’éteint. La source est dans un terrier, derrière la clairière. Vas-y, je reste ici, dans l’obscurité.',fin:'La forêt scintille ! Je n’ai jamais été aussi content de pouvoir lire mon courrier.',rew:{xpq:[12,'longue'],res:{champi:6,laine:4}}}});

// ============ ÉCHELLE DE PUISSANCE (calibrée avec outils/sim.js) ============
// Multiplicateur appliqué à chaque rencontre (PV x k, dégâts x k^0,7). Visé : un héros de niveau égal perd ~45 % de ses PV
// dans un combat normal, ~55 % contre une élite, ~65 % contre un boss. Pour rééquilibrer : changer ces valeurs, puis relancer le simulateur.
DATA.echelle=[2,5,5.2,5.2,5.2,4.4,3.8,3.9,4,4.7,4.6,3.7,3.8,3.9,3.9,4.0,6.0,3.9,3.4,4.0,5.0,4.8,3.8];
DATA.rencontres.forEach((r,i)=>{const k=DATA.echelle[i]||1,kd=Math.pow(k,.7);
{const B=r.m.find(m=>m.boss),F=r.m.find(m=>m.form);if(B&&F){F.hp=F.max=Math.max(15,Math.round(B.max*k*(F.pct||.22)))}}
r.m.forEach(m=>{if(m.form)return;m.hp=m.max=Math.max(1,Math.round(m.max*k));m.d=Math.round(m.d*kd);
if(m.sort){m.sort={...m.sort};if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd);if(m.sort.heal)m.sort.heal=Math.round(m.sort.heal*kd)}
if(m.mort)m.mort={...m.mort,dmg:Math.round(m.mort.dmg*kd)};
if(m.renfort){const rm=m.renfort.m,sm=Math.round(rm.max*k);m.renfort={...m.renfort,m:{...rm,hp:sm,max:sm,d:Math.round(rm.d*kd),...(rm.mort?{mort:{...rm.mort,dmg:Math.round(rm.mort.dmg*kd)}}:{})}}}})});
