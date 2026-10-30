// DONNEES : classes, Lueurs, monstres, textes. On modifie ici sans toucher aux règles.
// XP : chaque rencontre a un niveau (niv) et chaque quête un xpq:[niveau,'courte|normale|longue|lueur'] ; les valeurs sont calculées par xp.js.
const DATA={
taille:13,
// Éléments (étape B1, sans effet en jeu pour l'instant). Cycle : Vent > Foudre > Ténèbres > Lumière > Vent
// (« X > Y » : X est fort contre Y). `faiblesse` = l'élément qui bat celui-ci ; le Neutre n'en a pas.
// Un sort ou un monstre sans champ `elem` est Neutre.
elements:{
neutre:{n:'Neutre',e:'⚪',faiblesse:null},
vent:{n:'Vent',e:'🌪️',faiblesse:'lumiere'},
foudre:{n:'Foudre',e:'⚡',faiblesse:'vent'},
tenebres:{n:'Ténèbres',e:'🌑',faiblesse:'foudre'},
lumiere:{n:'Lumière',e:'☀️',faiblesse:'tenebres'}},
// Règle des éléments (valeurs provisoires, à caler avec le simulateur) : 1 point dans un élément = +pct % de dégâts
// sur les sorts de cet élément ; cap = maximum de points de talent par élément. Résistance d'un monstre (`rs`) bornée à resMax %.
regleElem:{pct:2.5,cap:20,resMax:80},
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
{id:'charge',elem:'vent',n:'Charge',niv:3,pa:3,r:[2,4],los:1,dmg:12,charge:1,cd:2,rg:[{dmg:3},{rmax:1}]},
{id:'garde',elem:'lumiere',n:'Garde de lanterne',niv:5,old:6,pa:2,r:[0,0],garde:1,cd:3,rg:[{cd:-1},{garde:1}]},
{id:'boutoir',elem:'foudre',n:'Coup de boutoir',niv:8,old:10,pa:3,r:[1,1],dmg:18,push:2,cd:2,rg:[{dmg:4},{cd:-1}]},
{id:'bourrasque',elem:'vent',n:'Bourrasque de lanterne',niv:11,old:8,pa:3,r:[0,0],aoe:1,dmg:10,push:2,cd:2,rg:[{dmg:3},{cd:-1}]},
{id:'eteinte',elem:'tenebres',n:'Lanterne éteinte',niv:14,old:16,pa:3,r:[1,1],dmg:16,drain:1,cd:2,rg:[{dmg:4},{cd:-1}]},
{id:'poing',elem:'foudre',n:'Poing d’orage',niv:18,old:12,pa:4,r:[1,1],dmg:16,etats:[{id:'etourdi',t:1}],cd:3,rg:[{dmg:4},{cd:-1}]},
{id:'ardente',elem:'lumiere',n:'Lanterne ardente',niv:22,old:14,pa:5,r:[0,0],aoe:2,dmg:14,etats:[{id:'brule',v:3,t:3}],cd:3,rg:[{dmg:4},{cd:-1}]},
{id:'voile',elem:'tenebres',n:'Voile d’ombre',niv:27,old:20,pa:4,r:[0,0],aoe:2,dmg:12,etats:[{id:'ralenti',v:1,t:2}],cd:3,rg:[{dmg:3},{cd:-1}]},
{id:'rempart',elem:'lumiere',n:'Rempart de braise',niv:32,pa:3,r:[0,0],aoe:1,dmg:30,etats:[{id:'brule',v:3,t:3}],cd:2,rg:[{dmg:5},{cd:-1}]},
{id:'fracas',elem:'foudre',n:'Fracas du tonnerre',niv:38,pa:4,r:[1,2],los:1,dmg:38,cd:2,rg:[{dmg:6},{cd:-1}]},
{id:'sillage',elem:'vent',n:'Sillage de bourrasque',niv:44,pa:3,r:[2,4],los:1,dmg:24,charge:1,push:1,cd:2,rg:[{dmg:5},{rmax:1}]},
{id:'linceul',elem:'tenebres',n:'Linceul de lanterne',niv:50,pa:5,r:[0,0],aoe:2,dmg:28,drain:1,etats:[{id:'ralenti',v:1,t:2}],cd:4,rg:[{dmg:6},{cd:-1}]},
{id:'aube',elem:'lumiere',n:'Aube du Porteur',niv:56,pa:6,r:[0,0],aoe:2,dmg:40,etatsSoi:[{id:'bouclier',v:8,t:2}],cd:4,rg:[{dmg:7},{cd:-1}]}]},
archer:{n:'Archer Farceur',e:'🏹',hp:45,info:'distance, fragile',sorts:[
{id:'tir',n:'Tir précis',niv:1,pa:2,r:[2,6],los:1,dmg:11,rg:[{dmg:3},{dmg:3}]},
{id:'tir2',n:'Tir double',niv:1,pa:4,r:[2,5],los:1,dmg:24,rg:[{dmg:4},{rmax:1}]},
{id:'retrait',elem:'vent',n:'Tir en retrait',niv:3,pa:2,r:[2,5],los:1,dmg:8,recul:1,etats:[{id:'poison',v:3,t:3}],cd:2,rg:[{dmg:3},{cd:-1}]},
{id:'repoussant',elem:'vent',n:'Tir repoussant',niv:6,pa:3,r:[2,5],los:1,dmg:10,push:2,cd:2,rg:[{dmg:3},{rmax:1}]},
{id:'flecheclair',elem:'foudre',n:'Flèche-éclair',niv:8,pa:3,r:[3,6],los:1,dmg:20,cd:2,rg:[{dmg:4},{cd:-1}]},
{id:'perforant',elem:'foudre',n:'Tir perforant',niv:10,pa:4,r:[3,7],los:1,dmg:30,cd:2,rg:[{dmg:4},{cd:-1}]},
{id:'flechesolaire',elem:'lumiere',n:'Flèche solaire',niv:12,pa:3,r:[2,5],los:1,dmg:14,etats:[{id:'affaibli',v:25,t:2}],cd:2,rg:[{dmg:3},{cd:-1}]},
{id:'pluie',elem:'lumiere',n:'Pluie de flèches',niv:14,pa:5,r:[3,6],aoe:2,dmg:14,cd:3,rg:[{dmg:4},{cd:-1}]},
{id:'flecheombre',elem:'tenebres',n:'Flèche d’ombre',niv:16,pa:3,r:[2,5],los:1,dmg:14,drain:1,cd:2,rg:[{dmg:4},{cd:-1}]},
{id:'pluienuit',elem:'tenebres',n:'Pluie de nuit',niv:22,pa:5,r:[3,6],aoe:2,dmg:12,etats:[{id:'poison',v:3,t:3}],cd:3,rg:[{dmg:4},{cd:-1}]}]},
mage:{n:'Mage Distrait',e:'🧙',hp:38,info:'zone, peu de vie',sorts:[
{id:'eclair',n:'Éclair',niv:1,pa:2,r:[2,6],los:1,dmg:9,rg:[{dmg:3},{dmg:3}]},
{id:'cendres',n:'Cendres',niv:1,pa:4,r:[2,5],dmg:12,aoe:1,rg:[{dmg:3},{pa:-1}]},
{id:'flaque',elem:'tenebres',n:'Flaque enflammée',niv:3,pa:3,r:[2,5],aoe:1,dmg:15,etats:[{id:'brule',v:3,t:3}],cd:2,rg:[{dmg:3},{cd:-1}]},
{id:'fumee',elem:'lumiere',n:'Bouclier de fumée',niv:6,pa:2,r:[0,0],garde:1,cd:3,rg:[{cd:-1},{garde:1}]},
{id:'chaine',elem:'foudre',n:'Chaîne d’éclairs',niv:8,pa:4,r:[2,5],los:1,aoe:1,dmg:14,cd:2,rg:[{dmg:3},{cd:-1}]},
{id:'rafale',elem:'vent',n:'Rafale',niv:10,pa:3,r:[1,4],los:1,dmg:10,push:3,cd:2,rg:[{dmg:3},{rmax:1}]},
{id:'tempete',elem:'tenebres',n:'Tempête de cendres',niv:14,pa:6,r:[2,5],aoe:2,dmg:26,etats:[{id:'etourdi',t:1}],cd:4,rg:[{dmg:5},{cd:-1}]},
{id:'foudroiement',elem:'foudre',n:'Foudroiement',niv:14,pa:5,r:[3,6],los:1,dmg:32,cd:3,rg:[{dmg:5},{cd:-1}]},
{id:'rayon',elem:'lumiere',n:'Rayon de lumière',niv:17,pa:4,r:[3,7],los:1,dmg:26,cd:2,rg:[{dmg:4},{cd:-1}]},
{id:'tourbillon',elem:'vent',n:'Tourbillon',niv:18,pa:5,r:[2,5],aoe:2,dmg:14,push:2,cd:3,rg:[{dmg:4},{cd:-1}]}]}},
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
const mou=(x,y)=>({x,y,hp:24,max:24,pm:3,d:8,e:'🪰',n:'La mouche à braise',ia:'dist',garde:[2,3],sort:{n:'Étincelle',r:[2,3],los:1,dmg:6,cd:0}}),cha=(x,y)=>({x,y,hp:30,max:30,pm:2,d:10,e:'🍄',n:'Le champignon bavard',sort:{n:'Spores collantes',r:[1,3],los:1,dmg:0,etats:[{id:'ralenti',v:1,t:1}],cd:2}}),mot=(x,y)=>({x,y,hp:28,max:28,pm:3,d:9,e:'🐑',n:'Le mouton-fantôme',sort:{n:'Coup de tête',r:[1,1],push:1,cd:1}}),ber=(x,y)=>({x,y,hp:30,max:30,pm:2,d:6,e:'🐏',n:'Le berger-fantôme',ia:'soin',sort:{n:'Berceuse de laine',r:[1,3],heal:10,cd:2}});
DATA.res={braise:'🔥 Braises',champi:'🍄 Champignons',laine:'🐑 Laine'};
DATA.rencontres=[
{n:'Village des Lanternes',biome:'village',niv:2,loot:{braise:4},m:[mou(10,3),mou(11,8)]},
{n:'Forêt des Champignons Lumineux',biome:'foret',niv:7,loot:{champi:4,laine:2},m:[cha(10,3),cha(11,8),mot(9,10)]},
{n:'Collines aux Moutons-Fantômes',biome:'collines',niv:13,loot:{laine:5,braise:3},m:[mot(10,3),mot(11,8),ber(9,10),cha(11,5)]}];
DATA.lampiste=[{cap:5,cout:{braise:4}},{cap:8,cout:{champi:4,laine:4}},{cap:12,cout:{braise:8,champi:6,laine:8}}];
const boss=(x,y)=>({x,y,hp:90,max:90,pm:2,d:12,e:'👻',n:'Chambellan Poussière',boss:1,prot:'le formulaire flotte sur lui',sort:{n:'Tampon officiel',r:[2,3],los:1,dmg:8,etats:[{id:'affaibli',v:25,t:2}],cd:1}}),frm=(x,y)=>({x,y,hp:15,max:15,pm:0,d:0,e:'📜',n:'Le formulaire',form:1,pct:.14,regen:.03});
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
tisonnier:{n:'Tisonnier',e:'🔥',slot:'arme',r:0,st:{neutre:1},cout:{braise:4}},
epee_braise:{n:'Épée de braise',e:'⚔️',slot:'arme',r:1,st:{neutre:2},cout:{braise:8,laine:2}},
sceptre:{n:'Sceptre-champignon',e:'🍄',slot:'arme',r:2,st:{neutre:3}},
plume:{n:'Plume du Chambellan',e:'🪶',slot:'arme',r:3,st:{neutre:4}},
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
bague:{n:'Bague de braise',e:'💍',slot:'acc',r:1,st:{neutre:1},cout:{braise:5,champi:2}},
clochette:{n:'Clochette du berger',e:'🔔',slot:'acc',r:2,st:{pv:8,neutre:1}},
lanterne_cha:{n:'Lanterne du Chambellan',e:'🏮',slot:'acc',r:3,st:{pv:10,neutre:1,res:5}}};
DATA.sets={livreur:{n:'Panoplie du livreur',bonus:{2:{pv:10},3:{neutre:1,res:5}}}};
DATA.rencontres[0].drops=[{id:'chaussons',p:25},{id:'echarpe',p:15}];
DATA.rencontres[1].drops=[{id:'chapeau',p:25},{id:'amulette',p:15},{id:'clochette',p:8}];
DATA.rencontres[2].drops=[{id:'gilet',p:20},{id:'bague',p:10},{id:'sceptre',p:10},{id:'cape',p:8}];
DATA.rencontres[3].drops=[{id:'plume',p:35},{id:'bottes_cha',p:35},{id:'lanterne_cha',p:35}];


// ============ ACTE 2 : MARAIS DE CENDRES ============
DATA.res.cendre='🌫️ Cendres';DATA.res.roseau='🌾 Roseaux';DATA.resE.cendre='🌫️';DATA.resE.roseau='🌾';
DATA.repliques.cendres=['Gourmande',"Cette dame se tient toujours sur un tas de cendres qui grandit… Disperse-la d’un sort, puis frappe vite !"];
DATA.repliques.duchesse_vic=['Têtue',"Elle ne voulait pas bouger non plus. On aurait pu s'entendre."];
const cra=(x,y)=>({x,y,hp:40,max:40,pm:3,d:13,e:'🐸',n:'Le crapaud cendreux',sort:{n:'Langue gluante',r:[2,4],los:1,dmg:5,pull:2,etats:[{id:'poison',v:3,t:2}],cd:2}}),gri=(x,y)=>({x,y,hp:34,max:34,pm:4,d:12,e:'🦗',n:'Le grillon de cendre',ia:'dist',garde:[3,4],sort:{n:'Stridulation',r:[2,5],los:1,dmg:9,cd:0}}),sac=(x,y)=>({x,y,hp:56,max:56,pm:2,d:15,e:'⚱️',n:'Le sac de cendres',mort:{n:'Éclatement',r:1,dmg:12}}),duch=(x,y)=>({x,y,hp:110,max:110,pm:2,d:14,e:'👸',n:'La Duchesse des Cendres',boss:1,cendre:1,spread:2,sort:{n:'Pluie de cendres',r:[2,4],los:1,dmg:9,etats:[{id:'brule',v:3,t:2}],cd:1}});
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
DATA.objets.lame_roseau={n:'Lame de roseau',e:'🗡️',slot:'arme',r:1,st:{neutre:3},cout:{roseau:6,cendre:3}};
DATA.objets.capuchon_cendre={n:'Capuchon de cendre',e:'🎓',slot:'tete',r:1,st:{pv:14},cout:{cendre:5,roseau:3}};
DATA.objets.tunique_roseau={n:'Tunique de roseau',e:'👘',slot:'corps',r:1,st:{pv:14,res:6},cout:{roseau:8,cendre:3}};
DATA.objets.sandales_roseau={n:'Sandales de roseau',e:'🩴',slot:'bottes',r:1,st:{pv:8,res:3},cout:{roseau:5}};
DATA.objets.bracelet_cendre={n:'Bracelet de cendre',e:'📿',slot:'acc',r:1,st:{pv:6,neutre:1},cout:{cendre:5,braise:3}};
DATA.objets.voile_brume={n:'Voile de brume',e:'🌫️',slot:'tete',r:2,st:{pv:16,res:4}};
DATA.objets.perle_marais={n:'Perle du marais',e:'🔮',slot:'acc',r:2,st:{neutre:1,res:5}};
DATA.objets.lance_libellule={n:'Lance de libellule',e:'🔱',slot:'arme',r:2,st:{neutre:4}};
DATA.objets.manteau_brume={n:'Manteau de brume',e:'🧥',slot:'corps',r:2,st:{pv:20,res:8}};
DATA.objets.bottes_vase={n:'Bottes de vase',e:'🥾',slot:'bottes',r:2,st:{pv:10,res:5}};
DATA.objets.baguette_duchesse={n:'Baguette de la Duchesse',e:'🪄',slot:'arme',r:3,st:{neutre:5}};
DATA.objets.couronne_cendre={n:'Couronne de cendre',e:'👑',slot:'tete',r:3,st:{pv:16,res:6}};
DATA.objets.robe_duchesse={n:'Robe de la Duchesse',e:'👗',slot:'corps',r:3,st:{pv:18,res:8}};
DATA.objets.eventail_cendre={n:'Éventail de cendre',e:'🪭',slot:'acc',r:3,st:{pv:8,neutre:1,res:6}};
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

// ============ VILLAGE ÉTENDU : place, quartier des Chandelles, poste de garde ============
(()=>{const v=DATA.cartes.village,take=n=>{const i=v.npcs.findIndex(p=>p.n==n);return v.npcs.splice(i,1)[0]};
const mem=take('Mémé Lumignon'),ton=take('Tonton Zébulon'),pet=take('Pétoche');
mem.x=4;mem.y=4;ton.x=8;ton.y=7;pet.x=6;pet.y=5;
const pk=v.picks.splice(0,3);v.picks=[pk[1]];
v.exits.push({x:0,y:6,to:'quartier',tx:11,ty:6},{x:6,y:0,to:'poste',tx:6,ty:10});
DATA.cartes.quartier={n:'Quartier des Chandelles',biome:'village',need:0,start:[11,6],tint:'rgba(255,150,90,.1)',
rocks:[[3,2],[4,2],[8,2],[9,2],[2,8],[3,8],[7,9],[8,9],[10,4],[10,8]],npcs:[mem,ton],
picks:[{x:1,y:2,quest:'q1'}],groups:[{x:9,y:6,renc:0}],nodes:[{x:2,y:10,res:'braise'},{x:6,y:7,res:'laine'}],
exits:[{x:12,y:6,to:'village',tx:1,ty:6}]};
DATA.cartes.poste={n:'Poste de garde',biome:'village',need:0,start:[6,10],tint:'rgba(255,200,120,.08)',
rocks:[[2,4],[3,4],[9,4],[10,4],[1,8],[11,8],[5,2],[7,2]],npcs:[pet],
picks:[{x:12,y:2,quest:'q1'}],groups:[{x:3,y:7,renc:0},{x:9,y:7,renc:0}],nodes:[{x:1,y:1,res:'braise'},{x:11,y:10,res:'champi'}],
exits:[{x:6,y:11,to:'village',tx:6,ty:1}]};
DATA.ambiance.quartier={type:'lucioles'};DATA.ambiance.poste={type:'lucioles'};DATA.decor.quartier=.14;DATA.decor.poste=.12;
})();

// ============ ACTE 2 : DÉSERT DES CHAUSSETTES PERDUES (niveaux 33 à 40) ============
DATA.res.sable='🏜️ Sable';DATA.res.fil='🧵 Fil';DATA.res.chaussette='🧦 Chaussettes';DATA.resE.sable='🏜️';DATA.resE.fil='🧵';DATA.resE.chaussette='🧦';
const squ=(x,y)=>({x,y,hp:60,max:60,pm:3,d:18,e:'💀',n:'Squelette gréviste',sort:{n:'Coup de pancarte',r:[1,1],push:1,etats:[{id:'affaibli',v:25,t:2}],cd:2}}),
sco=(x,y)=>({x,y,hp:52,max:52,pm:3,d:19,e:'🦂',n:'Scorpion de sable',sort:{n:'Piqûre',r:[1,1],etats:[{id:'poison',v:4,t:3}],cd:1}}),
chl=(x,y)=>({x,y,hp:48,max:48,pm:4,d:18,e:'🧦',n:'Chaussette lanceuse',ia:'dist',garde:[3,4],sort:{n:'Chaussette lancée',r:[2,5],los:1,dmg:18,cd:0}}),
cmi=(x,y)=>({x,y,hp:70,max:70,pm:2,d:12,e:'🐪',n:'Chameau-infirmier',ia:'soin',sort:{n:'Sieste express',r:[1,3],heal:15,cd:2}}),
chs=(x,y)=>({x,y,hp:80,max:80,pm:2,d:22,e:'🧦',n:'Chaussette sale',mort:{n:'Éclatement de sueur',r:1,dmg:18}}),
gen=(x,y)=>({x,y,hp:190,max:190,pm:2,d:22,e:'🪖',n:'Général Gréviste',boss:1,escorte:2,prot:'ses grévistes font un cercle autour de lui',sort:{n:'Appel à la grève',r:[1,1],push:1,dmg:22,etats:[{id:'affaibli',v:25,t:2}],etatsSoi:[{id:'bouclier',v:20,t:2}],cd:2}});
DATA.rencontres.push(
{n:'Dunes des Chaussettes Perdues',biome:'desert',niv:33,loot:{sable:4,fil:2},m:[squ(10,3),sco(11,8),chl(9,10)]},
{n:'Oasis aux Chaussettes',biome:'desert',niv:36,loot:{chaussette:4,fil:2},m:[chl(10,3),sco(11,8),cmi(9,10),chs(11,5)]},
{n:'Piquets de grève',biome:'desert',niv:38,type:'elite',loot:{sable:3,chaussette:3,fil:3},m:[squ(10,3),squ(11,8),cmi(9,10),chs(11,5)]},
{n:'Général Gréviste (boss)',biome:'desert',niv:40,say:'cercle',loot:{sable:8,fil:5,chaussette:5},m:[gen(11,7),squ(9,3),squ(10,9)]});
DATA.objets.turban_sable={n:'Turban de sable',e:'🧕',slot:'tete',r:1,st:{pv:20},set:'dunes',cout:{sable:6,fil:3}};
DATA.objets.tunique_fil={n:'Tunique de fil',e:'👘',slot:'corps',r:1,st:{pv:20,res:6},set:'dunes',cout:{fil:8,sable:4,chaussette:2}};
DATA.objets.sandales_dunes={n:'Sandales des dunes',e:'🩴',slot:'bottes',r:1,st:{pv:12,res:4},set:'dunes',cout:{sable:5,chaussette:3}};
DATA.objets.bracelet_chaussette={n:'Bracelet de chaussette',e:'🧦',slot:'acc',r:1,st:{pv:10,neutre:1},set:'dunes',cout:{chaussette:5,fil:3}};
DATA.objets.amulette_grain={n:'Amulette de grain',e:'📿',slot:'acc',r:1,st:{res:6},set:'dunes',cout:{sable:6,chaussette:3}};
DATA.objets.pancarte_general={n:'Pancarte du Général',e:'🪧',slot:'arme',r:3,st:{neutre:6}};
DATA.objets.casque_negociateur={n:'Casque du Négociateur',e:'🪖',slot:'tete',r:3,st:{pv:22,res:6}};
DATA.sets.dunes={n:'Panoplie des dunes',bonus:{2:{pv:12},4:{neutre:1,res:5}}};
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
const pel=(x,y)=>({x,y,hp:75,max:75,pm:3,d:21,e:'🧎',n:'Pèlerin éteint',sort:{n:'Bénédiction ratée',r:[1,1],etats:[{id:'affaibli',v:25,t:2}],cd:2}}),
luc=(x,y)=>({x,y,hp:60,max:60,pm:4,d:20,e:'🪲',n:'Luciole terne',ia:'dist',garde:[3,4],sort:{n:'Éclat pâle',r:[2,5],los:1,dmg:21,cd:0}}),
sta=(x,y)=>({x,y,hp:110,max:110,pm:2,d:25,e:'🗿',n:'Statue de soleil',mort:{n:'Éboulement',r:1,dmg:20}}),
pre=(x,y)=>({x,y,hp:85,max:85,pm:2,d:16,e:'🧑‍🦯',n:'Prêtre aveugle',ia:'soin',sort:{n:'Prière tardive',r:[1,3],heal:18,cd:2}}),
ecl=(x,y)=>({x,y,hp:230,max:230,pm:2,d:26,e:'🌘',n:'Éclipse',boss:1,cycle:{a:2,b:2},prot:'elle est dans l’ombre',sort:{n:'Ombre portée',r:[1,3],los:1,dmg:26,etats:[{id:'ralenti',v:1,t:2}],cd:1}}),
voi=(x,y)=>({x,y,hp:20,max:20,pm:0,d:0,e:'🌑',n:'Le voile d’ombre',form:1,pct:.14,regen:.03}),
gar=(x,y)=>({x,y,hp:95,max:95,pm:3,d:25,e:'🛡️',n:'Garde fantôme',sort:{n:'Charge spectrale',r:[1,1],push:1,dmg:25,cd:2}}),
arc=(x,y)=>({x,y,hp:70,max:70,pm:4,d:22,e:'🏹',n:'Archer osseux',ia:'dist',garde:[3,4],sort:{n:'Flèche rouillée',r:[2,6],los:1,dmg:24,cd:0}}),
che=(x,y)=>({x,y,hp:120,max:120,pm:2,d:27,e:'🤺',n:'Chevalier brisé',sort:{n:'Coup de pommeau',r:[1,1],push:1,etats:[{id:'affaibli',v:25,t:2}],cd:2}}),
lch=(x,y)=>({x,y,hp:130,max:130,pm:2,d:24,e:'👻',n:'Chambellan Poussière',sort:{n:'Tampon officiel',r:[2,3],los:1,dmg:24,etats:[{id:'affaibli',v:25,t:2}],cd:1}}),
ldu=(x,y)=>({x,y,hp:120,max:120,pm:2,d:22,e:'👸',n:'Duchesse des Cendres',ia:'dist',garde:[3,4],sort:{n:'Pluie de cendres',r:[2,4],los:1,dmg:26,cd:1}}),
lge=(x,y)=>({x,y,hp:150,max:150,pm:2,d:26,e:'🪖',n:'Général Gréviste',sort:{n:'Appel à la grève',r:[1,1],push:1,dmg:26,etatsSoi:[{id:'bouclier',v:20,t:2}],cd:2}}),
bou=(x,y)=>({x,y,hp:260,max:260,pm:3,d:27,e:'🤡',n:'Bouffon Sans Rire',boss:1,alerte:{every:3,r:1,mult:1.4,n:'Blague sans rire',vul:1},sort:{n:'Blague sans rire',r:[1,3],los:1,dmg:27,etats:[{id:'affaibli',v:25,t:2}],cd:1}}),
roi=(x,y)=>({x,y,hp:320,max:320,pm:2,d:29,e:'👑',n:'Le Roi Éteint',boss:1,prot:'sa vexation le protège',sort:{n:'Décret royal',r:[1,4],los:1,dmg:30,etats:[{id:'affaibli',v:25,t:2}],etatsSoi:[{id:'bouclier',v:25,t:2}],cd:2}}),
vex=(x,y)=>({x,y,hp:25,max:25,pm:0,d:0,e:'😤',n:'Sa vexation',form:1,pct:.14,regen:.04,mock:.3}),
cou=(x,y)=>({x,y,hp:90,max:90,pm:3,d:24,e:'💀',n:'Courtisan squelette',sort:{n:'Révérence tranchante',r:[1,1],dmg:24,cd:1}});
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
DATA.objets.anneau_eclat={n:'Anneau d’éclat',e:'💍',slot:'acc',r:2,st:{pv:12,neutre:2},set:'soleil',cout:{eclat:5,gravat:2}};
DATA.objets.medaille_gardien={n:'Médaille du Gardien',e:'🏅',slot:'acc',r:2,st:{res:8},set:'soleil',cout:{eclat:6,gravat:3}};
DATA.objets.lame_eclipse={n:'Lame d’éclipse',e:'🗡️',slot:'arme',r:3,st:{neutre:8}};
DATA.objets.couronne_eteinte={n:'Couronne éteinte',e:'👑',slot:'tete',r:3,st:{pv:30,res:8}};
DATA.sets.soleil={n:'Panoplie du soleil couchant',bonus:{2:{pv:14},4:{neutre:2,res:6}}};
DATA.rencontres[13].drops=[{id:'lame_eclipse',p:100}];
DATA.rencontres[17].drops=[{id:'couronne_eteinte',p:100}];
DATA.cartes.camp.exits.push({x:12,y:6,to:'chemin',tx:1,ty:6});
DATA.cartes.chemin={n:'Chemin du Soleil Couchant',biome:'desert',need:11,start:[1,6],tint:'rgba(240,150,70,.16)',
rocks:[[4,2],[4,10],[6,6],[8,3],[8,9],[10,6]],
npcs:[{x:2,y:8,e:'🧙',n:'Pèlerin Cendré',quests:['e1'],txt:'Je marche vers le Temple depuis 300 ans. Je n’ai jamais regardé où il était. Il est devant.',variantes:[{si:{flag:'petales_offerts'},txt:'Mes pétales sont sur les marches. Le Temple ne m’a pas remercié, mais il les a gardées. C’est déjà quelque chose.'}]}],
picks:[{x:1,y:2,quest:'e1'},{x:6,y:11,quest:'e1'},{x:11,y:11,quest:'e1'}],
groups:[{x:9,y:4,renc:11},{x:9,y:9,renc:11}],
nodes:[{x:2,y:3,res:'eclat'},{x:5,y:2,res:'gravat'}],
coffres:[{x:12,y:1,res:{eclat:3,gravat:2}}],
exits:[{x:0,y:6,to:'camp',tx:11,ty:6},{x:12,y:6,to:'parvis',tx:1,ty:6}]};
DATA.cartes.parvis={n:'Parvis du Temple',biome:'temple',need:12,start:[1,6],tint:'rgba(255,210,120,.14)',
rocks:[[3,3],[3,9],[6,2],[6,10],[7,6],[9,3],[9,9]],
npcs:[{x:2,y:6,e:'🧑‍🦯',n:'Gardien du Parvis',quests:['e2'],txt:'Le Temple est fermé à cause de la tristesse. Entendez : trop de monstres qui pleurent.',variantes:[{si:{flag:'parvis_cloitre'},txt:'Les pèlerins sont au Cloître. On les entend pleurer d’ici, mais en rythme. Presque une prière.'},{si:{flag:'parvis_pleurs'},txt:'Ils pleurent sur mes marches, comme avant. Mais maintenant, c’est un choix. Ça change tout et rien.'},{si:{flag:'petales_offerts'},txt:'Quelqu’un a posé des pétales sur mes marches. Je ne sais pas qui. Je les balaie doucement.'}],actions:[{id:'parvis_pleurs',t:'Laisser les pèlerins pleurer',sub:'Respecter leur deuil : éclats et gravats',si:{quete:{id:'e2',etat:'finie'},pasFlag:'parvis_choix'},rew:{xpq:[47,'normale'],res:{eclat:3,gravat:2},set:{parvis_pleurs:true,parvis_choix:true}}},{id:'parvis_cloitre',t:'Les inviter au Cloître',sub:'Les confier à Sœur Veilleuse : éclats en plus',si:{quete:{id:'e2',etat:'finie'},pasFlag:'parvis_choix'},rew:{xpq:[47,'normale'],res:{eclat:5},set:{parvis_cloitre:true,parvis_choix:true}}}]}],
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
e1:{n:'Pétales de couchant',desc:'Ramasse 3 pétales de soleil mourant le long du Chemin pour le Pèlerin Cendré.',need:3,kind:'pick',req:11,donneur:'Pèlerin Cendré',say:'Des pétales de couchant. Elles fleurissent là où le soleil est passé pour la dernière fois. Trois, s’il te plaît.',fin:'Elles brillent encore. Je les poserai sur les marches du Temple, avant qu’il ne m’oublie.',rew:{xpq:[44,'normale'],res:{eclat:4},set:{petales_offerts:true}}},
e2:{n:'Parvis en deuil',desc:'Repousse le groupe de monstres éplorés qui pleure sur le Parvis du Temple, puis décide avec le Gardien de ce qu’on fait des pèlerins.',need:1,kind:'win',renc:12,req:12,donneur:'Gardien du Parvis',say:'Les pèlerins éteints pleurent sur mes marches. Dégage-les : on décidera ensuite de ce qu’on en fait.',fin:'Enfin du silence. Reste à savoir quoi faire des pèlerins : parle-moi encore.',rew:{xpq:[47,'courte'],res:{eclat:2}}},
e3:{n:'Médailles de la Garde',desc:'Mène l’enquête : interroge le Gardien du Parvis et Sœur Veilleuse pour retrouver la trace des médailles du Capitaine fantôme.',need:2,kind:'livre',req:14,donneur:'Capitaine fantôme',to:['Gardien du Parvis','Sœur Veilleuse'],say:'Mes gardes ont perdu leurs médailles. Trois. Sans elles, ils ne se souviennent plus d’être des gardes. Demande au Gardien du Parvis et à Sœur Veilleuse, au Temple : les pèlerins ramassent tout.',recu:{'Gardien du Parvis':'Des médailles ? Les pèlerins éteints les ont prises pour des offrandes. Demande à Sœur Veilleuse : elle récupère les offrandes.','Sœur Veilleuse':'Les médailles ? Fondues dans les cierges, avec le reste des offrandes. Dis au Capitaine que ses gardes veillent désormais pour le Temple. Ils vont être fâchés.'},fin:'Fondues dans les cierges ! Mes gardes veillent pour le Temple, sans le savoir. Ils vont être très fâchés. Mais ils se souviennent d’être des gardes.',rew:{xpq:[53,'longue'],res:{eclat:4,gravat:4}}}});

// ============ ÉQUIPEMENT DES ACTES 2 ET 3 : nouveaux objets, panoplies et butins ============
DATA.sets.marais={n:'Panoplie des marais',bonus:{2:{pv:10},4:{neutre:1,res:4}}};
['lame_roseau','capuchon_cendre','tunique_roseau','sandales_roseau','bracelet_cendre'].forEach(id=>{if(DATA.objets[id])DATA.objets[id].set='marais'});
Object.assign(DATA.objets,{
baton_sable:{n:'Bâton de sable',e:'🪄',slot:'arme',r:1,st:{neutre:3},set:'dunes',cout:{sable:6,fil:3}},
cimeterre_dunes:{n:'Cimeterre des dunes',e:'🗡️',slot:'arme',r:2,st:{neutre:5}},
amulette_mirage:{n:'Amulette du mirage',e:'🔮',slot:'acc',r:2,st:{pv:14,neutre:1}},
cape_marchand:{n:'Cape du marchand',e:'🧣',slot:'corps',r:2,st:{pv:24,res:6}},
bottes_chameau:{n:'Bottes de chameau',e:'🥾',slot:'bottes',r:2,st:{pv:12,pm:1}},
casque_piquet:{n:'Casque de piquet',e:'⛑️',slot:'tete',r:2,st:{pv:24,res:4}},
brassard_greviste:{n:'Brassard de gréviste',e:'🎗️',slot:'acc',r:2,st:{neutre:2,res:4}},
etendard_greve:{n:'Étendard de grève',e:'🚩',slot:'acc',r:3,st:{pv:20,neutre:2,res:6}},
lame_aube:{n:'Lame d’aube',e:'⚔️',slot:'arme',r:2,st:{neutre:6},set:'soleil',cout:{eclat:8,gravat:5}},
baton_pelerin:{n:'Bâton de pèlerin',e:'🦯',slot:'arme',r:2,st:{neutre:6}},
sandales_pelerin:{n:'Sandales de pèlerin',e:'🩴',slot:'bottes',r:2,st:{pv:20,res:6}},
collier_parvis:{n:'Collier du parvis',e:'📿',slot:'acc',r:2,st:{pv:18,neutre:1}},
tunique_pretre:{n:'Tunique de prêtre',e:'🥻',slot:'corps',r:2,st:{pv:28,res:8}},
manteau_ombre:{n:'Manteau d’ombre',e:'🧥',slot:'corps',r:3,st:{pv:34,res:10}},
bottes_eclipse:{n:'Bottes d’éclipse',e:'👢',slot:'bottes',r:3,st:{pv:22,res:6,pm:1}},
epee_garde:{n:'Épée de la Garde',e:'🗡️',slot:'arme',r:2,st:{neutre:7}},
heaume_garde:{n:'Heaume de la Garde',e:'🪖',slot:'tete',r:2,st:{pv:28,res:6}},
tampon_chambellan:{n:'Tampon du Chambellan',e:'📎',slot:'acc',r:3,st:{neutre:3,res:8}},
sceptre_cendres:{n:'Sceptre des cendres rallumées',e:'🪄',slot:'arme',r:3,st:{neutre:9}},
masque_bouffon:{n:'Masque du Bouffon',e:'🎭',slot:'tete',r:3,st:{pv:30,neutre:2}},
marotte_bouffon:{n:'Marotte du Bouffon',e:'🃏',slot:'arme',r:3,st:{neutre:10}},
lanterne_gardien:{n:'Lanterne du Gardien',e:'🏮',slot:'acc',r:3,st:{pv:30,neutre:3,res:10}},
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
const mer=(x,y)=>({x,y,hp:150,max:150,pm:2,d:12,e:'🍄',n:'Mère Mycélium',boss:1,renfort:{every:3,max:2,m:cha(0,0)},sort:{n:'Nuage de spores',r:[1,3],los:1,dmg:10,etats:[{id:'ralenti',v:1,t:2}],cd:1}});
DATA.rencontres.push(
{n:'Sentier des Lucioles',biome:'foret',niv:8,loot:{champi:3,laine:1},m:[mou(10,3),mou(11,8),cha(9,10)]},
{n:'Clairière des Cèpes',biome:'foret',niv:9,loot:{champi:4,laine:2},m:[cha(10,3),mot(11,8),cha(9,10),mou(11,5)]},
{n:'Terrier : galeries',biome:'foret',niv:10,loot:{champi:4,laine:2},m:[cha(9,3),cha(10,9),mot(11,6)]},
{n:'Terrier : salle des spores',biome:'foret',niv:11,type:'elite',loot:{champi:6,laine:3},m:[cha(10,3),cha(11,6),cha(10,9),mou(9,6)]},
{n:'Mère Mycélium (boss)',biome:'foret',niv:12,say:'mere',loot:{champi:10,laine:5},m:[mer(11,7)]});
DATA.repliques.mere=['Gourmande','Elle fait pousser des champignons à la chaîne ! Tue-la vite, avant qu’ils ne s’accumulent.'];
Object.assign(DATA.objets,{
bague_luciole:{n:'Bague de luciole',e:'💍',slot:'acc',r:1,st:{pv:6,neutre:1}},
bottes_sporees:{n:'Bottes sporées',e:'👢',slot:'bottes',r:1,st:{pv:8,res:3}},
coiffe_mycelium:{n:'Coiffe de mycélium',e:'🍄',slot:'tete',r:2,st:{pv:16,res:3}},
sceptre_mere:{n:'Sceptre de la Mère',e:'🪄',slot:'arme',r:2,st:{neutre:4}},
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
picks:[{x:2,y:2,quest:'f2'}],
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
f2:{n:'Cèpes égarés',desc:'Ramasse 3 cèpes dispersés dans la Forêt des Champignons, le Sentier des Lucioles et la Clairière pour la Cueilleuse Pâquerette.',need:3,kind:'pick',req:1,donneur:'Cueilleuse Pâquerette',say:'Trois cèpes se sont cachés dans la clairière. Trouve-les, je cuisinerai quelque chose.',fin:'Magnifiques ! Je t’en garde une part. Si tu me promets de ne pas la manger tout de suite.',rew:{xpq:[9,'normale'],res:{champi:4,laine:2}}},
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

// ============ COLLINES ÉTENDUES : Pâturage Brumeux, Bergerie abandonnée et donjon « L'Enclos du Bouc Recenseur » ============
// Ces blocs (Collines, Manoir, Marais, Désert, Acte 3) mettent eux-mêmes leurs rencontres à l'échelle (valeurs à recaler avec outils/sim.js).
(()=>{
const B=DATA.rencontres.length;
const lbr=(x,y)=>({x,y,hp:34,max:34,pm:4,d:11,e:'🐺',n:'Le loup de brume',sort:{n:'Hurlement',r:[1,3],los:1,dmg:4,etats:[{id:'affaibli',v:25,t:2}],cd:2}}),
plt=(x,y)=>({x,y,hp:30,max:30,pm:3,d:9,e:'🧶',n:'La pelote enragée',mort:{n:'Déroulement',r:1,dmg:8}}),
bcr=(x,y)=>({x,y,hp:140,max:140,pm:3,d:11,e:'🐐',n:'Bouc Recenseur',boss:1,alerte:{every:3,r:1,mult:1.4,n:'Charge du recensement',vul:1},sort:{n:'Coup de corne',r:[1,1],push:1,dmg:10,etats:[{id:'affaibli',v:25,t:2}],cd:1}});
DATA.rencontres.push(
{n:'Pâturage Brumeux',biome:'collines',niv:14,loot:{laine:4,braise:2},m:[lbr(10,3),lbr(11,8),mot(9,10)]},
{n:'Bergerie abandonnée',biome:'collines',niv:15,loot:{laine:5,champi:2},m:[plt(10,3),mot(11,8),ber(9,10),lbr(11,5)]},
{n:'Enclos : couloir de barrières',biome:'collines',niv:16,loot:{laine:4,braise:3},m:[lbr(9,3),plt(10,9),mot(11,6)]},
{n:'Enclos : abreuvoir',biome:'collines',niv:16,type:'elite',loot:{laine:6,braise:4},m:[plt(10,3),lbr(11,6),ber(10,9),mot(9,6)]},
{n:'Bouc Recenseur (boss)',biome:'collines',niv:17,say:'bouc',loot:{laine:10,braise:6,champi:4},m:[bcr(11,7),ber(9,3),mot(10,10)]});
[4.6,4.4,4.8,5.0,4.2].forEach((k,j)=>{const kd=Math.pow(k,.7);DATA.rencontres[B+j].m.forEach(m=>{m.hp=m.max=Math.max(1,Math.round(m.max*k));m.d=Math.round(m.d*kd);
if(m.sort){m.sort={...m.sort};if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd);if(m.sort.heal)m.sort.heal=Math.round(m.sort.heal*kd)}
if(m.mort)m.mort={...m.mort,dmg:Math.round(m.mort.dmg*kd)}})});
DATA.repliques.bouc=['Gourmande','Il prépare une charge ! Quand les cases rouges apparaissent, sors de là : il se fatiguera, et ce sera ton moment.'];
Object.assign(DATA.objets,{
clochette_brume:{n:'Clochette de brume',e:'🔔',slot:'acc',r:1,st:{pv:8,res:3}},
guetres_berger:{n:'Guêtres de berger',e:'🥾',slot:'bottes',r:1,st:{pv:10,res:3}},
bonnet_brume:{n:'Bonnet de brume',e:'🧢',slot:'tete',r:2,st:{pv:18,res:4}},
houlette_recenseur:{n:'Houlette du Recenseur',e:'🪝',slot:'arme',r:2,st:{neutre:4}},
pelisse_bouc:{n:'Pelisse du Bouc',e:'🧥',slot:'corps',r:2,st:{pv:20,res:6}}});
DR(B,[{id:'clochette_brume',p:15}]);DR(B+1,[{id:'guetres_berger',p:20}]);DR(B+3,[{id:'bonnet_brume',p:25}]);DR(B+4,[{id:'houlette_recenseur',p:100},{id:'pelisse_bouc',p:40}]);
DATA.cartes.collines.exits.push({x:6,y:0,to:'paturage',tx:6,ty:11});
DATA.cartes.collines.npcs.forEach(n=>{if(n.n=='Berger Laine-de-Nuit')n.quests=['c3','c4']});
DATA.cartes.collines.picks.push({x:5,y:6,quest:'c4'});
DATA.cartes.paturage={n:'Pâturage Brumeux',biome:'collines',need:2,start:[6,11],tint:'rgba(170,190,220,.16)',
rocks:[[3,3],[3,9],[6,6],[9,3],[9,9]],
npcs:[{x:2,y:11,e:'🧑‍🦰',n:'Bergère Brume',quests:['c1','c5'],txt:'Le brouillard est si épais que mes moutons se comptent en double. J’ai deux fois plus de moutons. Sur le papier.',variantes:[{si:{flag:'moutons_bouc'},txt:'Les moutons marchent en rang pour le Bouc. Ils sont ponctuels, c’est le pire.'},{si:{flag:'moutons_bergers'},txt:'Mes moutons sont revenus au pâturage, en désordre. Enfin chez nous.'}],actions:[{id:'moutons_bouc',t:'Rendre les moutons au Bouc',sub:'Obéir au décret royal : braises et champignons',si:{quete:{id:'c5',etat:'finie'},pasFlag:'moutons_choix'},rew:{xpq:[15,'normale'],res:{braise:4,champi:2},set:{moutons_bouc:true,moutons_choix:true}}},{id:'moutons_bergers',t:'Garder les moutons au pâturage',sub:'Désobéir au Roi : de la laine en plus',si:{quete:{id:'c5',etat:'finie'},pasFlag:'moutons_choix'},rew:{xpq:[15,'normale'],res:{laine:6},set:{moutons_bergers:true,moutons_choix:true}}}]}],
groups:[{x:8,y:4,renc:B},{x:3,y:6,renc:B}],
nodes:[{x:2,y:2,res:'laine'},{x:11,y:11,res:'braise'}],
exits:[{x:6,y:12,to:'collines',tx:6,ty:1},{x:12,y:6,to:'bergerie',tx:1,ty:6}]};
DATA.cartes.bergerie={n:'Bergerie abandonnée',biome:'collines',need:2,start:[1,6],tint:'rgba(140,130,110,.2)',
rocks:[[4,3],[4,9],[7,6],[10,3],[10,9]],
npcs:[{x:2,y:10,e:'✂️',n:'Tondeur Mérinos',quests:['c2','c6'],txt:'Je tonds des fantômes. La laine repousse, mais transparente. Ça se vend mal, ça se porte léger.'}],
picks:[{x:2,y:2,quest:'c2'},{x:11,y:11,quest:'c2'},{x:11,y:1,quest:'c2'}],
groups:[{x:9,y:5,renc:B+1},{x:9,y:10,renc:B+1}],
nodes:[{x:6,y:2,res:'laine'},{x:6,y:11,res:'braise'}],
coffres:[{x:12,y:12,res:{laine:4,braise:2}}],
exits:[{x:0,y:6,to:'paturage',tx:11,ty:6},{x:12,y:6,to:'enclos1',tx:1,ty:6}]};
DATA.cartes.enclos1={n:'Enclos : couloir de barrières',biome:'collines',need:2,start:[1,6],tint:'rgba(60,70,90,.3)',
rocks:[[4,2],[4,10],[6,5],[6,7],[8,3],[8,9]],npcs:[],
groups:[{x:9,y:4,renc:B+2},{x:9,y:9,renc:B+2}],
nodes:[{x:2,y:2,res:'laine'}],
exits:[{x:0,y:6,to:'bergerie',tx:11,ty:6},{x:12,y:6,to:'enclos2',tx:1,ty:6}]};
DATA.cartes.enclos2={n:'Enclos : abreuvoir',biome:'collines',need:2,start:[1,6],tint:'rgba(80,60,100,.3)',
rocks:[[4,3],[4,9],[7,3],[7,9]],npcs:[],
groups:[{x:9,y:6,renc:B+3}],
nodes:[{x:2,y:11,res:'braise'}],
coffres:[{x:12,y:1,res:{laine:3,braise:2}}],
exits:[{x:0,y:6,to:'enclos1',tx:11,ty:6},{x:12,y:6,to:'enclos3',tx:1,ty:6}]};
DATA.cartes.enclos3={n:'Enclos : cœur du troupeau',biome:'collines',need:2,start:[1,6],tint:'rgba(100,60,110,.36)',
rocks:[[4,3],[4,9],[7,6]],npcs:[],
groups:[{x:10,y:6,renc:B+4}],
nodes:[],
coffres:[{x:12,y:12,res:{laine:5,champi:4}}],
exits:[{x:0,y:6,to:'enclos2',tx:11,ty:6}]};
Object.assign(DATA.quetes,{
c1:{n:'Brouillard sur le troupeau',desc:'Interroge le Tondeur Mérinos et le Berger Laine-de-Nuit pour comprendre d’où vient le brouillard.',need:2,kind:'livre',req:2,donneur:'Bergère Brume',to:['Tondeur Mérinos','Berger Laine-de-Nuit'],say:'Le brouillard monte depuis des jours, et mes moutons se comptent en double. Va demander au Tondeur Mérinos et au Berger Laine-de-Nuit : eux savent toujours ce qui se passe ici.',recu:{'Tondeur Mérinos':'Le brouillard ? Il monte à la tombée de la nuit, quand quelqu’un compte les moutons. Je n’ai jamais vu qui.','Berger Laine-de-Nuit':'Le bouc compte tout la nuit, et la vapeur de ses fiches fait le brouillard. Dis à la Bergère de ne plus compter à voix haute.'},fin:'Le bouc, évidemment. Ses fiches font du brouillard, et mes moutons se comptent en double. Merci, je baisserai la voix.',rew:{xpq:[14,'normale'],res:{laine:4,braise:2}}},
c2:{n:'Clochettes égarées',desc:'Ramasse 3 clochettes dans la Bergerie abandonnée pour le Tondeur Mérinos.',need:3,kind:'pick',req:2,donneur:'Tondeur Mérinos',say:'Mes moutons ont perdu leurs clochettes dans la bergerie. Sans clochette, un fantôme est introuvable. Trois, s’il te plaît.',fin:'Dring ! Ah, voilà qui rassure. Un mouton fantôme qui ne tinte pas, c’est juste un mouton qui a un problème.',rew:{xpq:[15,'normale'],res:{laine:4,champi:3}}},
c3:{n:'Le Bouc qui compte tout',desc:'Entre dans l’Enclos, au bout de la Bergerie, et vaincs le Bouc Recenseur.',need:1,kind:'win',renc:B+4,req:2,donneur:'Berger Laine-de-Nuit',say:'Un bouc a pris ma bergerie pour un bureau. Il recense mes moutons : ils ne dorment plus, ils attendent d’être comptés. Vas-y, je garde la barrière.',fin:'Mes moutons dorment ! Enfin, ils flottent en rond. Pour des fantômes, c’est dormir.',rew:{xpq:[17,'longue'],res:{laine:6,braise:4}}},
c4:{n:'Les fiches du recensement',desc:'Ramasse 3 fiches de recensement dans les Collines, le Pâturage Brumeux et la Bergerie pour le Berger Laine-de-Nuit.',need:3,kind:'pick',req:2,donneur:'Berger Laine-de-Nuit',say:'Le bouc sème ses fiches dans les collines. Elles portent un cachet royal : le Roi veut compter chaque sujet. Rapporte-m’en trois, que je comprenne pourquoi.',fin:'« Un mouton, un soldat. » Le Roi lève une armée de laine. Voilà pourquoi le bouc ne dort plus.',rew:{xpq:[16,'normale'],res:{laine:4,braise:2}}},
c5:{n:'Moutons réquisitionnés',desc:'Repousse le groupe de loups qui garde les moutons enrôlés dans la Bergerie abandonnée, puis décide de leur sort avec la Bergère Brume.',need:1,kind:'win',renc:B+1,req:2,donneur:'Bergère Brume',say:'On a enrôlé mes moutons de force : un tampon royal sur le dos, et hop, « soldats ». Ils sont retenus dans la bergerie, gardés par des loups. Libère-les.',fin:'Ils sont là, au garde-à-vous. Reste à savoir ce qu’on en fait : parle-moi encore, on va décider.',rew:{xpq:[15,'courte'],res:{laine:2}}},
c6:{n:'Laine pour le Roi',desc:'Livre un ballot de laine au Concierge Ficelle, au Manoir du Chambellan.',need:1,kind:'livre',req:2,donneur:'Tondeur Mérinos',to:'Concierge Ficelle',say:'Le Roi réclame de la laine pour un manteau royal. Le Concierge Ficelle, au Manoir, réceptionne. Vas-y à ma place : on me demanderait un formulaire.',recu:'De la laine pour Sa Majesté ? Parfait. Remplissez le formulaire de remise. Vous n’en avez pas ? Je sais. Je note quand même.',fin:'Livré ? Le Roi aura son manteau. Transparent, mais royal.',rew:{xpq:[17,'normale'],res:{laine:4,braise:2}}}});
})();

// ============ MANOIR ÉTENDU : Hall des Guichets, Bureaux des Tampons et donjon « Les Archives du Chambellan » ============
(()=>{
const B=DATA.rencontres.length;
const clr=(x,y)=>({x,y,hp:36,max:36,pm:3,d:10,e:'🧑‍💼',n:'Le clerc fantôme',ia:'dist',garde:[2,3],sort:{n:'Tampon de rappel',r:[2,3],los:1,dmg:5,etats:[{id:'ralenti',v:1,t:1}],cd:1}}),
ccl=(x,y)=>({x,y,hp:50,max:50,pm:2,d:13,e:'🗄️',n:'Le classeur mordant',mort:{n:'Éclatement de dossiers',r:1,dmg:10}}),
plm=(x,y)=>({x,y,hp:26,max:26,pm:4,d:9,e:'🪶',n:'La plume vexée',ia:'dist',garde:[3,4],sort:{n:'Rature',r:[2,5],los:1,dmg:8,cd:0}}),
bgr=(x,y)=>({x,y,hp:150,max:150,pm:2,d:12,e:'🧐',n:'Greffier Ratures',boss:1,escorte:2,prot:'ses clercs font un cercle autour de lui',sort:{n:'Rature définitive',r:[1,2],los:1,dmg:10,etats:[{id:'affaibli',v:25,t:2}],cd:1}});
DATA.rencontres.push(
{n:'Hall des Guichets',biome:'manoir',niv:18,loot:{braise:4,champi:2},m:[clr(10,3),plm(11,8),mou(9,10)]},
{n:'Bureaux des Tampons',biome:'manoir',niv:19,loot:{champi:4,laine:3},m:[clr(10,3),ccl(11,8),plm(9,10),clr(11,5)]},
{n:'Archives : rayonnages',biome:'manoir',niv:19,loot:{braise:4,laine:3},m:[ccl(9,3),plm(10,9),clr(11,6)]},
{n:'Archives : salle des dossiers',biome:'manoir',niv:20,type:'elite',loot:{braise:6,champi:5},m:[ccl(10,3),clr(11,6),plm(10,9),ccl(9,6)]},
{n:'Greffier Ratures (boss)',biome:'manoir',niv:20,say:'greffier',loot:{braise:10,champi:6,laine:5},m:[bgr(11,7),clr(10,7),ccl(11,9),plm(9,3)]});
[5.0,5.2,5.4,5.6,4.4].forEach((k,j)=>{const kd=Math.pow(k,.7);DATA.rencontres[B+j].m.forEach(m=>{m.hp=m.max=Math.max(1,Math.round(m.max*k));m.d=Math.round(m.d*kd);
if(m.sort){m.sort={...m.sort};if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd);if(m.sort.heal)m.sort.heal=Math.round(m.sort.heal*kd)}
if(m.mort)m.mort={...m.mort,dmg:Math.round(m.mort.dmg*kd)}})});
DATA.repliques.greffier=['Gourmande','Il est entouré de ses clercs. Écarte-les ou écrase-les : seul, il ne tient pas debout.'];
Object.assign(DATA.objets,{
encrier_noir:{n:'Encrier noir',e:'🖋️',slot:'acc',r:1,st:{pv:10,res:3}},
chaussons_feutres:{n:'Chaussons feutrés',e:'🥿',slot:'bottes',r:1,st:{pv:12,res:3}},
visiere_clerc:{n:'Visière de clerc',e:'🧢',slot:'tete',r:2,st:{pv:20,res:4}},
regle_greffier:{n:'Règle du Greffier',e:'📏',slot:'arme',r:2,st:{neutre:4,pv:6}},
robe_greffier:{n:'Robe du Greffier',e:'🥻',slot:'corps',r:2,st:{pv:22,res:6}}});
DR(B,[{id:'encrier_noir',p:15}]);DR(B+1,[{id:'chaussons_feutres',p:20}]);DR(B+3,[{id:'visiere_clerc',p:25}]);DR(B+4,[{id:'regle_greffier',p:100},{id:'robe_greffier',p:40}]);
DATA.cartes.manoir.exits.push({x:6,y:0,to:'hall',tx:6,ty:11});
DATA.cartes.hall={n:'Hall des Guichets',biome:'manoir',need:3,start:[6,11],tint:'rgba(130,70,170,.18)',
rocks:[[3,4],[3,8],[6,6],[9,4],[9,8]],
npcs:[{x:2,y:11,e:'🧑‍✈️',n:'Concierge Ficelle',quests:['m1','m3'],txt:'Guichet 1 : fermé. Guichet 2 : fermé. Guichet 3 : ouvert, mais il est dans le mauvais bâtiment.',variantes:[{si:{flag:'courrier_tampon'},txt:'Tout est tamponné, donc légalement arrivé. Les destinataires, eux, n’ont toujours rien reçu.'},{si:{flag:'courrier_libre'},txt:'Du courrier distribué sans tampon ? Je n’ai rien vu. Je n’ai jamais rien vu. Je note quand même.'}],actions:[{id:'courrier_tampon',t:'Faire tamponner le courrier',sub:'Suivre la procédure : braises et champignons',si:{quete:{id:'m1',etat:'finie'},pasFlag:'courrier_choix'},rew:{xpq:[18,'normale'],res:{braise:4,champi:2},set:{courrier_tampon:true,courrier_choix:true}}},{id:'courrier_libre',t:'Distribuer sans tampon',sub:'Désobéir au règlement : de la laine en plus',si:{quete:{id:'m1',etat:'finie'},pasFlag:'courrier_choix'},rew:{xpq:[18,'normale'],res:{laine:6},set:{courrier_libre:true,courrier_choix:true}}}]}],
groups:[{x:8,y:3,renc:B},{x:3,y:6,renc:B}],
nodes:[{x:2,y:2,res:'braise'},{x:11,y:11,res:'champi'}],
exits:[{x:6,y:12,to:'manoir',tx:6,ty:1},{x:12,y:6,to:'bureaux',tx:1,ty:6}]};
DATA.cartes.bureaux={n:'Bureaux des Tampons',biome:'manoir',need:3,start:[1,6],tint:'rgba(150,100,170,.2)',
rocks:[[4,3],[4,9],[7,6],[10,3],[10,9]],
npcs:[{x:2,y:10,e:'🖋️',n:'Copiste Rature',quests:['m2'],txt:'Je recopie le même formulaire depuis 40 ans. Je ne sais pas ce qu’il dit. Il est très bien écrit.'},{x:9,y:7,e:'🧑‍💼',n:'Stagiaire Pochoir',txt:'Je tamponne. On ne m’a jamais dit quoi. Ni pourquoi trois fois.'}],
groups:[{x:9,y:5,renc:B+1},{x:9,y:10,renc:B+1}],
nodes:[{x:6,y:2,res:'champi'},{x:6,y:11,res:'laine'}],
coffres:[{x:12,y:12,res:{braise:4,champi:2}}],
exits:[{x:0,y:6,to:'hall',tx:11,ty:6},{x:12,y:6,to:'archives1',tx:1,ty:6}]};
DATA.cartes.archives1={n:'Archives : rayonnages',biome:'manoir',need:3,start:[1,6],tint:'rgba(60,50,80,.34)',
rocks:[[4,2],[4,10],[6,5],[6,7],[8,3],[8,9]],npcs:[],
groups:[{x:9,y:4,renc:B+2},{x:9,y:9,renc:B+2}],
nodes:[{x:2,y:2,res:'braise'}],
exits:[{x:0,y:6,to:'bureaux',tx:11,ty:6},{x:12,y:6,to:'archives2',tx:1,ty:6}]};
DATA.cartes.archives2={n:'Archives : salle des dossiers',biome:'manoir',need:3,start:[1,6],tint:'rgba(80,50,100,.34)',
rocks:[[4,3],[4,9],[7,3],[7,9]],npcs:[],
groups:[{x:9,y:6,renc:B+3}],
nodes:[{x:2,y:11,res:'champi'}],
coffres:[{x:12,y:1,res:{braise:3,laine:2}}],
exits:[{x:0,y:6,to:'archives1',tx:11,ty:6},{x:12,y:6,to:'archives3',tx:1,ty:6}]};
DATA.cartes.archives3={n:'Archives : bureau du Greffier',biome:'manoir',need:3,start:[1,6],tint:'rgba(100,50,110,.4)',
rocks:[[4,3],[4,9],[7,6]],npcs:[],
groups:[{x:10,y:6,renc:B+4}],
nodes:[],
coffres:[{x:12,y:12,res:{braise:5,champi:4}}],
exits:[{x:0,y:6,to:'archives2',tx:11,ty:6}]};
Object.assign(DATA.quetes,{
m1:{n:'Courrier en souffrance',desc:'Repousse le groupe de clercs et de mouches qui bloque le courrier dans le Hall des Guichets, puis décide du sort du courrier avec le Concierge Ficelle.',need:1,kind:'win',renc:B,req:3,donneur:'Concierge Ficelle',say:'Le courrier s’entasse devant les guichets, gardé par des clercs et des mouches. Dégage le passage : je déciderai ensuite avec toi de ce qu’on en fait.',fin:'Le passage est libre. Reste le courrier : parle-moi encore, on va décider.',rew:{xpq:[18,'courte'],res:{braise:2}}},
m2:{n:'Formulaires égarés',desc:'Mène l’enquête : interroge le Concierge Ficelle et le Stagiaire Pochoir pour savoir où sont passées les pages du formulaire du Copiste Rature.',need:2,kind:'livre',req:3,donneur:'Copiste Rature',to:['Concierge Ficelle','Stagiaire Pochoir'],say:'Trois pages de mon formulaire ont disparu. Sans elles, il est incomplet. Je ne sais pas de quoi, mais ça me gêne. Demande au Concierge Ficelle et au Stagiaire Pochoir : l’un garde les guichets, l’autre fait les tampons.',recu:{'Concierge Ficelle':'Des pages ? Elles passent toutes par le guichet 3, qui est fermé. Demande au stagiaire : c’est lui qui tamponne.','Stagiaire Pochoir':'Je les ai tamponnées, par réflexe. Trois fois chacune. Elles sont si tamponnées qu’on ne lit plus rien. Dis au Copiste que son formulaire est complet. Illisible, mais complet.'},fin:'Complet ! Illisible, mais complet. Je vais pouvoir le recopier à nouveau. Merci, je suis ému. Il y a de l’encre sur ma joue.',rew:{xpq:[19,'normale'],res:{laine:4,champi:3}}},
m3:{n:'Les Archives du Chambellan',desc:'Pénètre dans les Archives, au fond des Bureaux, et vaincs le Greffier Ratures.',need:1,kind:'win',renc:B+4,req:3,donneur:'Concierge Ficelle',say:'Le Greffier archive tout, même les gens. Quelqu’un doit lui rappeler qu’on ne classe pas les visiteurs. Les Archives sont derrière les Bureaux.',fin:'Les visiteurs sont sortis des classeurs ! Certains ont un peu jauni. Merci, on sent que ça circule.',rew:{xpq:[20,'longue'],res:{braise:6,champi:4,laine:4}}}});
})();

// ============ MARAIS ÉTENDU : Gué des Crapauds, Île aux Berceuses et donjon « Le Manoir des Rêves » ============
(()=>{
const B=DATA.rencontres.length;
const pap=(x,y)=>({x,y,hp:30,max:30,pm:4,d:11,e:'🦋',n:'Le papillon de nuit',ia:'dist',garde:[3,4],sort:{n:'Poudre soporifique',r:[2,4],los:1,dmg:6,etats:[{id:'ralenti',v:1,t:1}],cd:1}}),
ore=(x,y)=>({x,y,hp:60,max:60,pm:2,d:14,e:'🛏️',n:'L’oreiller hanté',mort:{n:'Explosion de plumes',r:1,dmg:12}}),
chr=(x,y)=>({x,y,hp:44,max:44,pm:3,d:14,e:'🕸️',n:'Le chasseur de rêves',sort:{n:'Filet de rêve',r:[2,4],los:1,dmg:6,pull:2,etats:[{id:'affaibli',v:25,t:2}],cd:2}}),
bar=(x,y)=>({x,y,hp:160,max:160,pm:2,d:13,e:'🦉',n:'Baronne Insomnie',boss:1,cycle:{a:2,b:2},prot:'elle rêve encore',sort:{n:'Bâillement',r:[1,3],los:1,dmg:11,etats:[{id:'ralenti',v:1,t:2}],cd:1}});
DATA.rencontres.push(
{n:'Gué des Crapauds',biome:'marais',niv:22,loot:{cendre:4,roseau:2},m:[cra(10,3),pap(11,8),cra(9,10)]},
{n:'Île aux Berceuses',biome:'marais',niv:23,loot:{roseau:5,cendre:3},m:[pap(10,3),chr(11,8),ore(9,10),gri(11,5)]},
{n:'Rêves : couloir des oreillers',biome:'roseliere',niv:24,loot:{roseau:4,cendre:3},m:[ore(9,3),pap(10,9),chr(11,6)]},
{n:'Rêves : salle des cauchemars',biome:'roseliere',niv:25,type:'elite',loot:{cendre:6,roseau:5},m:[chr(10,3),ore(11,6),pap(10,9),cra(9,6)]},
{n:'Baronne Insomnie (boss)',biome:'roseliere',niv:26,say:'insomnie',loot:{cendre:10,roseau:6,braise:4},m:[bar(11,7),pap(9,3),ore(10,10)]});
[4.8,4.6,4.4,4.6,3.8].forEach((k,j)=>{const kd=Math.pow(k,.7);DATA.rencontres[B+j].m.forEach(m=>{m.hp=m.max=Math.max(1,Math.round(m.max*k));m.d=Math.round(m.d*kd);
if(m.sort){m.sort={...m.sort};if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd);if(m.sort.heal)m.sort.heal=Math.round(m.sort.heal*kd)}
if(m.mort)m.mort={...m.mort,dmg:Math.round(m.mort.dmg*kd)}})});
DATA.repliques.insomnie=['Peureuse','Elle s’endort et se réveille ! Quand elle dort, elle est protégée. Attends qu’elle ouvre les yeux : là, frappe fort !'];
Object.assign(DATA.objets,{
amulette_dormeur:{n:'Amulette du dormeur',e:'📿',slot:'acc',r:1,st:{pv:10,neutre:1}},
pantoufles_reve:{n:'Pantoufles de rêve',e:'🥿',slot:'bottes',r:1,st:{pv:14,res:4}},
bonnet_nuit:{n:'Bonnet de nuit',e:'🧢',slot:'tete',r:2,st:{pv:22,res:4}},
plume_insomnie:{n:'Plume de l’Insomnie',e:'🪶',slot:'arme',r:2,st:{neutre:4,pv:8}},
robe_nuit:{n:'Robe de nuit',e:'👘',slot:'corps',r:2,st:{pv:24,res:7}}});
DR(B,[{id:'amulette_dormeur',p:15}]);DR(B+1,[{id:'pantoufles_reve',p:20}]);DR(B+3,[{id:'bonnet_nuit',p:25}]);DR(B+4,[{id:'plume_insomnie',p:100},{id:'robe_nuit',p:40}]);
DATA.cartes.marais.exits.push({x:6,y:0,to:'gue',tx:6,ty:11});
DATA.cartes.marais.npcs.forEach(n=>{if(n.n=='La Passeuse')n.quests.push('n3')});
DATA.cartes.gue={n:'Gué des Crapauds',biome:'marais',need:4,start:[6,11],tint:'rgba(110,130,120,.22)',
rocks:[[3,3],[3,9],[6,6],[9,3],[9,9]],
npcs:[{x:2,y:11,e:'🎣',n:'Pêcheur de Brume',quests:['n1'],txt:'Je pêche depuis vingt ans. Pas un poisson. Mais le brouillard mord beaucoup.'}],
groups:[{x:8,y:4,renc:B},{x:3,y:6,renc:B}],
nodes:[{x:2,y:2,res:'roseau'},{x:11,y:11,res:'cendre'}],
exits:[{x:6,y:12,to:'marais',tx:6,ty:1},{x:12,y:6,to:'ile',tx:1,ty:6}]};
DATA.cartes.ile={n:'Île aux Berceuses',biome:'marais',need:4,start:[1,6],tint:'rgba(130,140,170,.2)',
rocks:[[4,3],[4,9],[7,6],[10,3],[10,9]],
npcs:[{x:2,y:10,e:'👵',n:'Vieille Berceuse',quests:['n2'],txt:'Je chantais pour endormir le marais. Maintenant le marais me chante des reproches.'}],
picks:[{x:2,y:2,quest:'n2'},{x:11,y:11,quest:'n2'},{x:11,y:1,quest:'n2'}],
groups:[{x:9,y:5,renc:B+1},{x:9,y:10,renc:B+1}],
nodes:[{x:6,y:2,res:'roseau'},{x:6,y:11,res:'cendre'}],
coffres:[{x:12,y:12,res:{roseau:4,cendre:3}}],
exits:[{x:0,y:6,to:'gue',tx:11,ty:6},{x:12,y:6,to:'reves1',tx:1,ty:6}]};
DATA.cartes.reves1={n:'Rêves : couloir des oreillers',biome:'roseliere',need:4,start:[1,6],tint:'rgba(110,80,150,.32)',
rocks:[[4,2],[4,10],[6,5],[6,7],[8,3],[8,9]],npcs:[],
groups:[{x:9,y:4,renc:B+2},{x:9,y:9,renc:B+2}],
nodes:[{x:2,y:2,res:'roseau'}],
exits:[{x:0,y:6,to:'ile',tx:11,ty:6},{x:12,y:6,to:'reves2',tx:1,ty:6}]};
DATA.cartes.reves2={n:'Rêves : salle des cauchemars',biome:'roseliere',need:4,start:[1,6],tint:'rgba(70,50,110,.36)',
rocks:[[4,3],[4,9],[7,3],[7,9]],npcs:[],
groups:[{x:9,y:6,renc:B+3}],
nodes:[{x:2,y:11,res:'cendre'}],
coffres:[{x:12,y:1,res:{roseau:3,cendre:3}}],
exits:[{x:0,y:6,to:'reves1',tx:11,ty:6},{x:12,y:6,to:'reves3',tx:1,ty:6}]};
DATA.cartes.reves3={n:'Rêves : chambre de la Baronne',biome:'roseliere',need:4,start:[1,6],tint:'rgba(90,50,120,.4)',
rocks:[[4,3],[4,9],[7,6]],npcs:[],
groups:[{x:10,y:6,renc:B+4}],
nodes:[],
coffres:[{x:12,y:12,res:{cendre:5,roseau:5}}],
exits:[{x:0,y:6,to:'reves2',tx:11,ty:6}]};
Object.assign(DATA.quetes,{
n1:{n:'Le crapaud-roi du Gué',desc:'Un crapaud géant et ses deux chasseurs de rêves ont pris le Gué des Crapauds : chasse-les.',need:1,kind:'win',renc:B,req:4,donneur:'Pêcheur de Brume',say:'Un crapaud grand comme une barque squatte mon gué, avec deux chasseurs de rêves pour garde. Chasse-les : j’aimerais pêcher quelque chose, même un caillou.',fin:'J’ai pêché un caillou ! Il est gros, il est mouillé, il est à moi. Garde la verrue : elle porte bonheur, paraît-il.',rew:{xpq:[22,'normale'],res:{cendre:4,roseau:3}}},
n2:{n:'Berceuses envolées',desc:'Ramasse 3 berceuses sur l’Île aux Berceuses pour la Vieille Berceuse.',need:3,kind:'pick',req:4,donneur:'Vieille Berceuse',say:'Trois berceuses se sont échappées de mon carnet. Elles brillent un peu. Sans elles, plus personne ne dort ici.',fin:'La première note est revenue. Les roseaux bâillent, et le marais commence à se taire. Merci, je vais pouvoir me reposer, moi aussi.',rew:{xpq:[23,'normale'],res:{roseau:4,cendre:3},set:{berceuses_rendues:true}}},
n3:{n:'La Baronne qui ne dort jamais',desc:'Pénètre dans le Manoir des Rêves, au bout de l’Île, et vaincs la Baronne Insomnie.',need:1,kind:'win',renc:B+4,req:4,donneur:'La Passeuse',say:'Une baronne veille dans le manoir des rêves. Tant qu’elle ne dort pas, tout le marais fait des cauchemars. Je connais les habitudes du marais, mais pas les siennes.',fin:'Les cauchemars retombent en cendres. Le marais dort. C’est très inhabituel, et très agréable.',rew:{xpq:[26,'longue'],res:{cendre:6,roseau:4,braise:4}}}});
})();

// ============ DÉSERT ÉTENDU : Mirage Changeant, Puits aux Mille Pieds et donjon « La Pyramide des Pieds » ============
(()=>{
const B=DATA.rencontres.length;
const vtr=(x,y)=>({x,y,hp:50,max:50,pm:4,d:17,e:'🦅',n:'Le vautour affamé',ia:'dist',garde:[3,4],sort:{n:'Piqué',r:[2,4],los:1,dmg:17,cd:1}}),
cob=(x,y)=>({x,y,hp:54,max:54,pm:3,d:18,e:'🐍',n:'Le cobra de sable',sort:{n:'Morsure',r:[1,1],etats:[{id:'poison',v:4,t:3}],cd:1}}),
mom=(x,y)=>({x,y,hp:85,max:85,pm:2,d:20,e:'🧻',n:'La momie bandée',sort:{n:'Bandelettes',r:[1,3],los:1,dmg:10,pull:2,etats:[{id:'ralenti',v:1,t:1}],cd:2}}),
sph=(x,y)=>({x,y,hp:200,max:200,pm:2,d:18,e:'🦁',n:'Sphinx Dépareillé',boss:1,renfort:{every:3,max:2,m:chs(0,0)},sort:{n:'Énigme sans réponse',r:[1,3],los:1,dmg:14,etats:[{id:'affaibli',v:25,t:2}],cd:1}});
DATA.rencontres.push(
{n:'Mirage Changeant',biome:'desert',niv:33,loot:{sable:4,fil:2},m:[vtr(10,3),cob(11,8),squ(9,10)]},
{n:'Puits aux Mille Pieds',biome:'desert',niv:34,loot:{chaussette:4,sable:3},m:[cob(10,3),mom(11,8),vtr(9,10),chl(11,5)]},
{n:'Pyramide : couloir',biome:'desert',niv:35,loot:{fil:4,sable:3},m:[mom(9,3),vtr(10,9),cob(11,6)]},
{n:'Pyramide : salle des momies',biome:'desert',niv:36,type:'elite',loot:{chaussette:5,fil:4},m:[mom(10,3),chs(11,6),vtr(10,9),cob(9,6)]},
{n:'Sphinx Dépareillé (boss)',biome:'desert',niv:37,say:'sphinx',loot:{sable:10,fil:6,chaussette:6},m:[sph(11,7),vtr(9,3),cob(10,10)]});
[3.9,3.0,4.2,4.4,3.6].forEach((k,j)=>{const kd=Math.pow(k,.7);DATA.rencontres[B+j].m.forEach(m=>{m.hp=m.max=Math.max(1,Math.round(m.max*k));m.d=Math.round(m.d*kd);
if(m.sort){m.sort={...m.sort};if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd);if(m.sort.heal)m.sort.heal=Math.round(m.sort.heal*kd)}
if(m.mort)m.mort={...m.mort,dmg:Math.round(m.mort.dmg*kd)};
if(m.renfort){const rm=m.renfort.m,sm=Math.round(rm.max*k);m.renfort={...m.renfort,m:{...rm,hp:sm,max:sm,d:Math.round(rm.d*kd),...(rm.mort?{mort:{...rm.mort,dmg:Math.round(rm.mort.dmg*kd)}}:{})}}}})});
DATA.repliques.sphinx=['Gourmande','Il appelle des chaussettes sales qui explosent ! Frappe-les de loin, ou fais-les éclater loin de toi.'];
Object.assign(DATA.objets,{
scarabee_dore:{n:'Scarabée doré',e:'🪲',slot:'acc',r:1,st:{pv:12,neutre:1}},
sandales_momie:{n:'Sandales de momie',e:'🩴',slot:'bottes',r:1,st:{pv:14,res:4}},
coiffe_pharaon:{n:'Coiffe de pharaon',e:'👑',slot:'tete',r:2,st:{pv:26,res:5}},
sceptre_sphinx:{n:'Sceptre du Sphinx',e:'🪄',slot:'arme',r:2,st:{neutre:5}},
bandelettes_sable:{n:'Bandelettes de sable',e:'🥋',slot:'corps',r:2,st:{pv:28,res:8}}});
DR(B,[{id:'scarabee_dore',p:15}]);DR(B+1,[{id:'sandales_momie',p:20}]);DR(B+3,[{id:'coiffe_pharaon',p:25}]);DR(B+4,[{id:'sceptre_sphinx',p:100},{id:'bandelettes_sable',p:40}]);
DATA.cartes.dunes.exits.push({x:6,y:0,to:'mirage',tx:6,ty:11});
DATA.cartes.dunes.npcs.forEach(n=>{if(n.n=='Vieux Sablier')n.quests.push('o3')});
DATA.cartes.mirage={n:'Mirage Changeant',biome:'desert',need:7,start:[6,11],tint:'rgba(230,190,120,.14)',
rocks:[[3,3],[3,9],[6,6],[9,3],[9,9]],
npcs:[{x:2,y:11,e:'🧞',n:'Guide du Mirage',quests:['o1'],txt:'Je connais le chemin. Il change tous les quarts d’heure. Moi aussi, d’ailleurs.',variantes:[{si:{flag:'mirage_oasis'},txt:'Les touristes vont tous à l’Oasis. Ils y vont droit, sans mirage. Je m’ennuie un peu.'},{si:{flag:'mirage_secret'},txt:'Le mirage reste secret. Les touristes cherchent encore. Je les regarde chercher : c’est mon métier.'}],actions:[{id:'mirage_oasis',t:'Rediriger vers l’Oasis',sub:'Aider l’Hôtelier : sable et fil',si:{quete:{id:'o1',etat:'finie'},pasFlag:'mirage_choix'},rew:{xpq:[33,'normale'],res:{sable:4,fil:3},set:{mirage_oasis:true,mirage_choix:true}}},{id:'mirage_secret',t:'Garder le mirage secret',sub:'Rester discret : chaussettes en plus',si:{quete:{id:'o1',etat:'finie'},pasFlag:'mirage_choix'},rew:{xpq:[33,'normale'],res:{chaussette:5},set:{mirage_secret:true,mirage_choix:true}}}]}],
groups:[{x:8,y:4,renc:B},{x:3,y:6,renc:B}],
nodes:[{x:2,y:2,res:'sable'},{x:11,y:11,res:'fil'}],
exits:[{x:6,y:12,to:'dunes',tx:6,ty:1},{x:12,y:6,to:'puits',tx:1,ty:6}]};
DATA.cartes.puits={n:'Puits aux Mille Pieds',biome:'desert',need:7,start:[1,6],tint:'rgba(200,170,120,.18)',
rocks:[[4,3],[4,9],[7,6],[10,3],[10,9]],
npcs:[{x:2,y:10,e:'🪣',n:'Porteur d’eau',quests:['o2'],txt:'Le puits est à sec. Mais il est très profond. C’est le seul compliment qu’on puisse lui faire.'}],
groups:[{x:9,y:5,renc:B+1},{x:9,y:10,renc:B+1}],
nodes:[{x:6,y:2,res:'chaussette'},{x:6,y:11,res:'sable'}],
coffres:[{x:12,y:12,res:{chaussette:4,sable:3}}],
exits:[{x:0,y:6,to:'mirage',tx:11,ty:6},{x:12,y:6,to:'pyr1',tx:1,ty:6}]};
DATA.cartes.pyr1={n:'Pyramide : couloir',biome:'desert',need:7,start:[1,6],tint:'rgba(120,90,60,.34)',
rocks:[[4,2],[4,10],[6,5],[6,7],[8,3],[8,9]],npcs:[],
groups:[{x:9,y:4,renc:B+2},{x:9,y:9,renc:B+2}],
nodes:[{x:2,y:2,res:'fil'}],
exits:[{x:0,y:6,to:'puits',tx:11,ty:6},{x:12,y:6,to:'pyr2',tx:1,ty:6}]};
DATA.cartes.pyr2={n:'Pyramide : salle des momies',biome:'desert',need:7,start:[1,6],tint:'rgba(100,80,70,.36)',
rocks:[[4,3],[4,9],[7,3],[7,9]],npcs:[],
groups:[{x:9,y:6,renc:B+3}],
nodes:[{x:2,y:11,res:'sable'}],
coffres:[{x:12,y:1,res:{fil:3,chaussette:2}}],
exits:[{x:0,y:6,to:'pyr1',tx:11,ty:6},{x:12,y:6,to:'pyr3',tx:1,ty:6}]};
DATA.cartes.pyr3={n:'Pyramide : chambre du Sphinx',biome:'desert',need:7,start:[1,6],tint:'rgba(140,100,60,.4)',
rocks:[[4,3],[4,9],[7,6]],npcs:[],
groups:[{x:10,y:6,renc:B+4}],
nodes:[],
coffres:[{x:12,y:12,res:{sable:5,fil:4,chaussette:4}}],
exits:[{x:0,y:6,to:'pyr2',tx:11,ty:6}]};
Object.assign(DATA.quetes,{
o1:{n:'Chemin du mirage',desc:'Repousse le groupe de vautours et de cobras qui squatte le Mirage Changeant, puis décide avec le Guide de ce qu’on fait des touristes.',need:1,kind:'win',renc:B,req:7,donneur:'Guide du Mirage',say:'Des vautours et des cobras squattent mon mirage. Dégage-les : on décidera ensuite ce qu’on fait des touristes.',fin:'Le mirage est dégagé. Il a même l’air plus vrai. C’est inquiétant, mais c’est mieux. Reste à décider des touristes : parle-moi encore.',rew:{xpq:[33,'courte'],res:{sable:2}}},
o2:{n:'Gourdes asséchées',desc:'Mène l’enquête : interroge le Chamelier et le Marchand de chaussettes, à l’Oasis, pour savoir où sont passées les gourdes du Porteur d’eau.',need:2,kind:'livre',req:7,donneur:'Porteur d’eau',to:['Chamelier','Marchand de chaussettes'],say:'Trois gourdes ont disparu et le puits est à sec. Je soupçonne un complot. Demande au Chamelier et au Marchand de chaussettes, à l’Oasis : l’un transporte, l’autre revend tout.',recu:{'Chamelier':'Les gourdes ? Mes chameaux les portent la nuit, vides, par habitude. Demande au marchand : c’est lui qui les rachète.','Marchand de chaussettes':'Je les rachète vides, je les revends vides. Marge parfaite. Dis au Porteur que son puits n’est pas à sec : il est en rupture de stock.'},fin:'En rupture de stock ! Voilà qui change tout. Enfin, ça ne change rien, mais ça sonne mieux. Merci.',rew:{xpq:[34,'normale'],res:{chaussette:4,sable:3}}},
o3:{n:'L’énigme sans réponse',desc:'Pénètre dans la Pyramide, au bout du Puits, et vaincs le Sphinx Dépareillé.',need:1,kind:'win',renc:B+4,req:7,donneur:'Vieux Sablier',say:'Un sphinx pose une énigme depuis mille ans. Personne n’a trouvé la réponse. Lui non plus, d’ailleurs. Il serait temps qu’on lui dise d’arrêter.',fin:'Il arrête ! Enfin ! Et il y avait bien une chaussette au fond. Je tiens mon registre à jour.',rew:{xpq:[37,'longue'],res:{sable:6,fil:5,chaussette:5}}}});
})();

// ============ ACTE 3 ÉTENDU : Cloître des Pèlerins, Jardin de cire et donjon « La Crypte du Gardien » ============
(()=>{
const B=DATA.rencontres.length;
const omb=(x,y)=>({x,y,hp:70,max:70,pm:4,d:22,e:'👤',n:'L’ombre errante',sort:{n:'Frisson',r:[1,3],los:1,dmg:12,etats:[{id:'ralenti',v:1,t:1}],cd:1}}),
cie=(x,y)=>({x,y,hp:65,max:65,pm:3,d:20,e:'🕯️',n:'Le cierge vivant',ia:'dist',garde:[3,4],sort:{n:'Cire brûlante',r:[2,4],los:1,dmg:20,etats:[{id:'brule',v:4,t:2}],cd:1}}),
eco=(x,y)=>({x,y,hp:280,max:280,pm:2,d:24,e:'🛡️',n:'Écho du Gardien',boss:1,renfort:{every:3,max:2,m:gar(0,0)},sort:{n:'Souvenir tranchant',r:[1,3],los:1,dmg:22,etats:[{id:'affaibli',v:25,t:2}],cd:1}});
DATA.rencontres.push(
{n:'Cloître des Pèlerins',biome:'temple',niv:45,loot:{eclat:4,gravat:2},m:[pel(10,3),omb(11,8),cie(9,10)]},
{n:'Jardin de cire',biome:'temple',niv:46,loot:{eclat:4,gravat:3},m:[cie(10,3),pre(9,10),omb(11,8),sta(11,5)]},
{n:'Crypte : galerie',biome:'citadelle',niv:47,loot:{gravat:4,eclat:3},m:[omb(9,3),sta(10,9),cie(11,6)]},
{n:'Crypte : ossuaire',biome:'citadelle',niv:48,type:'elite',loot:{eclat:5,gravat:5},m:[pre(10,3),omb(11,6),cie(10,9),pel(9,6)]},
{n:'Écho du Gardien (boss)',biome:'citadelle',niv:49,say:'echo',loot:{eclat:8,gravat:6},m:[eco(11,7),omb(9,3),cie(10,10)]});
[3.7,3.8,3.8,3.9,3.5].forEach((k,j)=>{const kd=Math.pow(k,.7);DATA.rencontres[B+j].m.forEach(m=>{m.hp=m.max=Math.max(1,Math.round(m.max*k));m.d=Math.round(m.d*kd);
if(m.sort){m.sort={...m.sort};if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd);if(m.sort.heal)m.sort.heal=Math.round(m.sort.heal*kd)}
if(m.mort)m.mort={...m.mort,dmg:Math.round(m.mort.dmg*kd)};
if(m.renfort){const rm=m.renfort.m,sm=Math.round(rm.max*k);m.renfort={...m.renfort,m:{...rm,hp:sm,max:sm,sortCd:0,d:Math.round(rm.d*kd),...(rm.sort?{sort:{...rm.sort,dmg:Math.round(rm.sort.dmg*kd)}}:{})}}}})});
DATA.repliques.echo=['Gourmande','Il rappelle sa garde toutes les trois tours ! Abats les renforts vite, ou frappe-le avant qu’ils arrivent.'];
Object.assign(DATA.objets,{
cierge_poche:{n:'Cierge de poche',e:'🕯️',slot:'acc',r:1,st:{pv:14,neutre:1}},
sandales_cloitre:{n:'Sandales du cloître',e:'🩴',slot:'bottes',r:1,st:{pv:18,res:5}},
capuche_veilleur:{n:'Capuche de veilleur',e:'🧕',slot:'tete',r:2,st:{pv:30,res:5}},
veilleuse:{n:'Veilleuse du Gardien',e:'🏮',slot:'arme',r:2,st:{neutre:6}},
habit_penitent:{n:'Habit de pénitent',e:'🥻',slot:'corps',r:2,st:{pv:32,res:9}}});
DR(B,[{id:'cierge_poche',p:15}]);DR(B+1,[{id:'sandales_cloitre',p:20}]);DR(B+3,[{id:'capuche_veilleur',p:25}]);DR(B+4,[{id:'veilleuse',p:100},{id:'habit_penitent',p:40}]);
DATA.cartes.parvis.exits.push({x:6,y:0,to:'cloitre',tx:6,ty:11});
DATA.cartes.parvis.npcs.forEach(n=>{if(n.n=='Gardien du Parvis')n.quests.push('t3')});
DATA.cartes.cloitre={n:'Cloître des Pèlerins',biome:'temple',need:12,start:[6,11],tint:'rgba(255,210,120,.12)',
rocks:[[3,3],[3,9],[6,6],[9,3],[9,9]],
npcs:[{x:2,y:11,e:'🧕',n:'Sœur Veilleuse',quests:['t1'],txt:'Nous veillons depuis des siècles. Personne n’a pensé à nous dire quoi.',variantes:[{si:{flag:'parvis_cloitre'},txt:'Des pèlerins sont arrivés. Ils pleurent doucement. Nous veillons enfin sur quelqu’un.'},{si:{flag:'fleurs_replantees'},txt:'On dit que des fleurs de cire ont été replantées au jardin. Nous veillons dessus, pour qu’elles ne fondent pas trop vite.'}]}],
groups:[{x:8,y:4,renc:B},{x:3,y:6,renc:B}],
nodes:[{x:2,y:2,res:'eclat'},{x:11,y:11,res:'gravat'}],
exits:[{x:6,y:12,to:'parvis',tx:6,ty:1},{x:12,y:6,to:'jardin',tx:1,ty:6}]};
DATA.cartes.jardin={n:'Jardin de cire',biome:'temple',need:12,start:[1,6],tint:'rgba(240,200,140,.16)',
rocks:[[4,3],[4,9],[7,6],[10,3],[10,9]],
npcs:[{x:2,y:10,e:'🧑‍🌾',n:'Jardinier de cire',quests:['t2'],txt:'Mes fleurs sont en cire. Elles ne fanent pas, elles fondent. C’est plus poétique.',variantes:[{si:{flag:'fleurs_replantees'},txt:'Mes fleurs sont replantées. Elles fondront, mais en bon ordre. On vient les voir, maintenant.'}]}],
picks:[{x:2,y:2,quest:'t2'},{x:11,y:11,quest:'t2'},{x:11,y:1,quest:'t2'}],
groups:[{x:9,y:5,renc:B+1},{x:9,y:10,renc:B+1}],
nodes:[{x:6,y:2,res:'eclat'},{x:6,y:11,res:'gravat'}],
coffres:[{x:12,y:12,res:{eclat:4,gravat:3}}],
exits:[{x:0,y:6,to:'cloitre',tx:11,ty:6},{x:12,y:6,to:'crypte1',tx:1,ty:6}]};
DATA.cartes.crypte1={n:'Crypte : galerie',biome:'citadelle',need:12,start:[1,6],tint:'rgba(60,60,90,.36)',
rocks:[[4,2],[4,10],[6,5],[6,7],[8,3],[8,9]],npcs:[],
groups:[{x:9,y:4,renc:B+2},{x:9,y:9,renc:B+2}],
nodes:[{x:2,y:2,res:'gravat'}],
exits:[{x:0,y:6,to:'jardin',tx:11,ty:6},{x:12,y:6,to:'crypte2',tx:1,ty:6}]};
DATA.cartes.crypte2={n:'Crypte : ossuaire',biome:'citadelle',need:12,start:[1,6],tint:'rgba(70,50,90,.38)',
rocks:[[4,3],[4,9],[7,3],[7,9]],npcs:[],
groups:[{x:9,y:6,renc:B+3}],
nodes:[{x:2,y:11,res:'eclat'}],
coffres:[{x:12,y:1,res:{eclat:3,gravat:3}}],
exits:[{x:0,y:6,to:'crypte1',tx:11,ty:6},{x:12,y:6,to:'crypte3',tx:1,ty:6}]};
DATA.cartes.crypte3={n:'Crypte : tombeau du Gardien',biome:'citadelle',need:12,start:[1,6],tint:'rgba(90,60,110,.42)',
rocks:[[4,3],[4,9],[7,6]],npcs:[],
groups:[{x:10,y:6,renc:B+4}],
nodes:[],
coffres:[{x:12,y:12,res:{eclat:6,gravat:5}}],
exits:[{x:0,y:6,to:'crypte2',tx:11,ty:6}]};
Object.assign(DATA.quetes,{
t1:{n:'Cloître assiégé',desc:'Repousse un groupe d’ombres et de cierges dans le Cloître des Pèlerins en 6 tours ou moins.',need:1,kind:'win',renc:B,req:12,defi:{tours:6},donneur:'Sœur Veilleuse',say:'Des ombres et des cierges errent dans le cloître. Chasse-les vite : ils éteignent les veilleuses un peu plus à chaque tour. Six tours, pas un de plus.',fin:'Le silence est revenu, et vite. Nous pouvons de nouveau veiller sans rien surveiller.',rew:{xpq:[45,'normale'],res:{eclat:4,gravat:3}}},
t2:{n:'Fleurs de cire',desc:'Ramasse 3 fleurs de cire dans le Jardin pour le Jardinier.',need:3,kind:'pick',req:12,donneur:'Jardinier de cire',say:'Trois fleurs de cire ont fondu à travers le jardin. Elles sont encore tièdes : retrouve-les avant qu’elles refroidissent.',fin:'Les voilà, presque intactes ! Je vais les replanter. Elles fondront quand même, mais plus tard. Peut-être qu’on viendra les voir.',rew:{xpq:[46,'normale'],res:{eclat:4,gravat:3},set:{fleurs_replantees:true}}},
t3:{n:'La Crypte du Gardien',desc:'Pénètre dans la Crypte, au fond du Jardin, et vaincs l’Écho du Gardien.',need:1,kind:'win',renc:B+4,req:12,donneur:'Gardien du Parvis',say:'Sous le jardin, il y a la crypte où le Gardien a veillé une dernière fois. Son écho y monte encore la garde. Quelqu’un doit lui dire que c’est fini.',fin:'L’écho s’est tu. Je crois qu’il a enfin pu s’asseoir. Merci pour lui.',rew:{xpq:[49,'longue'],res:{eclat:6,gravat:5}}}});
})();

// ============ MER : Plage des Naufragés, Port des Marées Mortes, Épave de l'Amiral (niv. 41-43) ============
// Accessible depuis le Mirage Changeant après le Général Gréviste (need 11). Commandant : l'Amiral Marée-Basse (marée haute = protégé ; boussole brisée = vulnérable).
(()=>{
const B=DATA.rencontres.length;
const cra=(x,y)=>({x,y,hp:72,max:72,pm:3,d:19,e:'🦀',n:'Le crabe-lanterne',sort:{n:'Pince de lanterne',r:[1,1],etats:[{id:'affaibli',v:20,t:2}],cd:1}}),
mou=(x,y)=>({x,y,hp:52,max:52,pm:4,d:17,e:'🐦',n:'La mouette pillarde',ia:'dist',garde:[3,4],sort:{n:'Piqué du sandwich',r:[2,4],los:1,dmg:16,cd:1}}),
med=(x,y)=>({x,y,hp:60,max:60,pm:2,d:12,e:'🪼',n:'La méduse luisante',sort:{n:'Voile urticant',r:[1,3],los:1,dmg:10,etats:[{id:'poison',v:4,t:2}],cd:1}}),
mar=(x,y)=>({x,y,hp:88,max:88,pm:3,d:22,e:'🏴‍☠️',n:'Le marin fantôme',sort:{n:'Grappin',r:[2,4],los:1,dmg:12,pull:2,cd:2}}),
ami=(x,y)=>({x,y,hp:190,max:190,pm:2,d:22,e:'⚓',n:'Amiral Marée-Basse',boss:1,boussole:1,cycle:{a:3,b:2,h:'La marée monte : l’Amiral est submergé et protégé.',l:'La marée descend ! L’Amiral est à découvert (dégâts ×1,5).'},prot:'la marée est haute',sort:{n:'Lame de marée',r:[1,3],los:1,dmg:24,push:1,cd:1}}),
bou=(x,y)=>({x,y,hp:22,max:22,pm:0,d:0,e:'🧭',n:'La boussole',form:1,pct:.12,regen:.03}),
gro=(x,y)=>({...cra(x,y),hp:130,max:130,d:24});
DATA.rencontres.push(
{n:'Plage des Naufragés',biome:'mer',niv:41,loot:{fil:4,sable:3},m:[cra(10,3),mou(11,8),med(9,10)]},
{n:'Port des Marées Mortes',biome:'mer',niv:42,loot:{sable:4,gravat:3},m:[mar(10,3),cra(11,8),med(9,10),mou(11,5)]},
{n:'Épave de l’Amiral (boss)',biome:'mer',niv:43,say:'amiral',loot:{fil:8,gravat:6,sable:5},m:[ami(11,7),bou(11,6),mar(9,3),mou(10,10)]},
{n:'Chasse au crabe colossal',biome:'mer',niv:42,type:'elite',loot:{fil:5,sable:4},m:[gro(10,6),mou(9,3),mou(9,9)]});
[4.0,4.2,4.5,4.6].forEach((k,j)=>{const kd=Math.pow(k,.7);const r=DATA.rencontres[B+j];
{const b0=r.m.find(m=>m.boss),f0=r.m.find(m=>m.form);if(b0&&f0)f0.hp=f0.max=Math.max(15,Math.round(b0.max*k*(f0.pct||.22)))}
r.m.forEach(m=>{if(m.form)return;m.hp=m.max=Math.max(1,Math.round(m.max*k));m.d=Math.round(m.d*kd);
if(m.sort){m.sort={...m.sort};if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd)}})});
DATA.repliques.amiral=['Peureuse','La marée monte : il est intouchable ! Attends qu’elle redescende, ou brise sa boussole.'];
Object.assign(DATA.objets,{
pince_rouille:{n:'Pince de crabe colossal',e:'🦀',slot:'acc',r:2,st:{pv:22,res:6}},
ancre_doree:{n:'Ancre dorée',e:'⚓',slot:'acc',r:2,st:{pv:20,neutre:2}},
bottes_maree:{n:'Bottes de marée',e:'👢',slot:'bottes',r:2,st:{pv:22,res:6}},
tricorne_amiral:{n:'Tricorne d’amiral',e:'🎩',slot:'tete',r:3,st:{pv:30,res:7}},
sabre_maree:{n:'Sabre de marée',e:'🗡️',slot:'arme',r:3,st:{neutre:9}},
veste_amiral:{n:'Veste d’amiral',e:'🧥',slot:'corps',r:3,st:{pv:34,res:10}}});
DR(B,[{id:'ancre_doree',p:15}]);DR(B+1,[{id:'bottes_maree',p:20}]);DR(B+3,[{id:'pince_rouille',p:100}]);DR(B+2,[{id:'sabre_maree',p:100},{id:'tricorne_amiral',p:35},{id:'veste_amiral',p:35}]);
DATA.cartes.mirage.exits.push({x:6,y:12,to:'plage',tx:6,ty:1});
DATA.cartes.plage={n:'Plage des Naufragés',biome:'mer',need:11,start:[6,1],tint:'rgba(120,170,200,.16)',
rocks:[[3,4],[9,4],[6,7],[3,10],[9,10]],
npcs:[{x:2,y:6,e:'🧔',n:'Naufragé Barnabé',quests:['r1','r2','r4'],txt:'Je suis naufragé depuis trois ans. Le bateau est parti sans moi. Il est revenu sans personne. C’est vexant.'}],
groups:[{x:8,y:5,renc:B},{x:5,y:9,renc:B},{x:10,y:9,renc:B+3}],
nodes:[{x:1,y:11,res:'fil'},{x:11,y:6,res:'sable'}],
exits:[{x:6,y:0,to:'mirage',tx:6,ty:11},{x:6,y:12,to:'port',tx:6,ty:1}]};
DATA.cartes.port={n:'Port des Marées Mortes',biome:'mer',need:11,start:[6,1],tint:'rgba(100,140,170,.2)',
rocks:[[3,3],[9,3],[6,6],[3,9],[9,9]],
picks:[{x:1,y:2,quest:'r3'},{x:11,y:2,quest:'r3'},{x:11,y:11,quest:'r3'}],
groups:[{x:8,y:5,renc:B+1},{x:5,y:9,renc:B+1}],
nodes:[{x:1,y:11,res:'sable'},{x:7,y:11,res:'gravat'}],
npcs:[{x:2,y:6,e:'👦',n:'Mousse Cuivré',quests:['r3','r5'],txt:'L’Amiral dit que la marée reviendra. Elle ne revient pas. Lui non plus ne bouge pas : il attend sur l’épave, au bout du quai.'},{x:10,y:7,e:'🧓',n:'Vieux Fanal',txt:'Je garde le phare du port. Il n’éclaire rien, mais personne ne s’en est plaint.'}],
coffres:[{x:12,y:6,res:{sable:4,gravat:3}}],
exits:[{x:6,y:0,to:'plage',tx:6,ty:11},{x:6,y:12,to:'epave',tx:6,ty:1}]};
DATA.cartes.epave={n:'Épave de l’Amiral',biome:'mer',need:11,start:[6,1],tint:'rgba(70,100,130,.3)',
rocks:[[3,4],[9,4],[6,8]],npcs:[],
groups:[{x:6,y:9,renc:B+2}],
nodes:[],
coffres:[{x:12,y:12,res:{fil:5,gravat:5,sable:4}}],
exits:[{x:6,y:0,to:'port',tx:6,ty:11}]};
DATA.ambiance.mer={type:'brume'};DATA.decor.mer=.12;
Object.assign(DATA.quetes,{
r1:{n:'Bouteilles à la mer',desc:'Découvre qui reçoit les messages en bouteille de Barnabé : interroge Mousse Cuivré et le Vieux Fanal, au Port des Marées Mortes.',need:2,kind:'livre',req:11,donneur:'Naufragé Barnabé',to:['Mousse Cuivré','Vieux Fanal'],say:'Je jette des messages en bouteille depuis trois ans, et personne ne répond. Va demander au mousse et au vieux du phare, au port : quelqu’un doit bien les lire.',recu:{'Mousse Cuivré':'Ses bouteilles ? Je n’en ai jamais vu une seule arriver au port. Demande au Vieux Fanal : il repêche tout ce qui flotte.','Vieux Fanal':'Je les repêche, bien sûr. Je les relance ensuite : on ne lit pas le courrier des autres. Je croyais qu’il aimait les voir revenir.'},fin:'Il les repêche et les relance ? Trois ans de « Au secours », relancés par politesse. Je vais lui écrire autre chose.',rew:{xpq:[41,'normale'],res:{fil:4,sable:3}}},
r2:{n:'Le crabe colossal',desc:'Un crabe colossal rôde sur la Plage des Naufragés : chasse-le, lui et ses mouettes.',need:1,kind:'win',renc:B+3,req:11,donneur:'Naufragé Barnabé',say:'Un crabe grand comme une barque a éventré mes filets. Il vit sur la plage avec ses mouettes. Chasse-le, ou je pêcherai mes sandales.',fin:'Plus de crabe, et des filets que je peux enfin raccommoder. Garde sa pince : elle brille comme une médaille.',rew:{xpq:[41,'normale'],res:{fil:4,sable:3}}},
r3:{n:'Ancres perdues',desc:'Ramasse 3 ancres autour du Port des Marées Mortes pour Mousse Cuivré.',need:3,kind:'pick',req:11,donneur:'Mousse Cuivré',say:'Les ancres sont tombées du quai quand la marée s’est arrêtée. Sans ancre, un bateau fantôme dérive. Trois, s’il te plaît : je les compte à chaque fois.',fin:'Trois ancres ! Je les range. Elles ne partiront plus nulle part, et elles adorent ça.',rew:{xpq:[42,'normale'],res:{sable:4,gravat:3}}},
r4:{n:'Marée de livraison',desc:'Livre des cordages à Mousse Cuivré, au Port des Marées Mortes.',need:1,kind:'livre',req:11,donneur:'Naufragé Barnabé',to:'Mousse Cuivré',say:'Ces cordages sont pour le mousse du port. Dis-lui qu’ils sont mouillés. Il ne verra pas la différence.',recu:'Des cordages ! Un peu mouillés, mais tout est mouillé ici. Merci, naufragé.',fin:'Livré ? Parfait. Il me doit un sandwich. Il le sait.',rew:{xpq:[42,'normale'],res:{fil:4,gravat:2}}},
r5:{n:'L’Amiral qui attend la marée',desc:'Entre dans l’Épave au bout du Port et vaincs l’Amiral Marée-Basse.',need:1,kind:'win',renc:B+2,req:11,donneur:'Mousse Cuivré',say:'L’Amiral a reçu un ordre du Roi : retrouver l’endroit où le soleil est tombé. Il a navigué jusqu’au bout du monde, et la marée s’est arrêtée, lui avec. Fais-la repartir.',fin:'La marée repart ! Lentement, mais elle repart. L’Amiral parlait du Soleil Couchant : le soleil a plongé du côté du Temple. Je crois que tu sais où aller.',rew:{xpq:[43,'longue'],res:{fil:6,gravat:5,sable:4}}}
})})();

// ============ ÉTAPE 3 (quêtes variées) : chasse au crapaud-roi (n1) et conséquences des berceuses (n2) ============
(()=>{
const HB=DATA.rencontres.length;
const roi=(x,y)=>({x,y,hp:85,max:85,pm:3,d:15,e:'🐸',n:'Le crapaud cendreux',sort:{n:'Langue gluante',r:[2,4],los:1,dmg:6,pull:2,etats:[{id:'poison',v:3,t:2}],cd:2}}),
chr=(x,y)=>({x,y,hp:44,max:44,pm:3,d:14,e:'🕸️',n:'Le chasseur de rêves',sort:{n:'Filet de rêve',r:[2,4],los:1,dmg:6,pull:2,etats:[{id:'affaibli',v:25,t:2}],cd:2}});
DATA.rencontres.push({n:'Chasse au crapaud-roi',biome:'marais',niv:23,type:'elite',loot:{cendre:5,roseau:3},m:[roi(10,6),chr(9,3),chr(9,9)]});
{const k=4.8,kd=Math.pow(k,.7);DATA.rencontres[HB].m.forEach(m=>{m.hp=m.max=Math.max(1,Math.round(m.max*k));m.d=Math.round(m.d*kd);
if(m.sort){m.sort={...m.sort};if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd)}})}
DATA.objets.verrue_chance={n:'Verrue porte-bonheur',e:'🐸',slot:'acc',r:2,st:{pv:16,res:5}};
DR(HB,[{id:'verrue_chance',p:100}]);
DATA.quetes.n1.renc=HB;
DATA.cartes.gue.groups.push({x:10,y:9,renc:HB});
const npc=(c,n)=>DATA.cartes[c].npcs.find(x=>x.n==n);
npc('ile','Vieille Berceuse').variantes=[{si:{flag:'berceuses_rendues'},txt:'Mes berceuses sont rentrées. Le marais ne me chante plus de reproches : il ronfle.'}];
npc('marais','La Passeuse').variantes=[{si:{flag:'berceuses_rendues'},txt:'Tu entends ? Le marais ronfle. Depuis les berceuses, même les crapauds baissent la voix.'}];
})();

// ============ ÉTAPE 4 (quêtes variées) : Désert, conséquence du choix du Mirage (o1) ============
DATA.cartes.oasis.npcs.find(n=>n.n.startsWith('Hôtelier')).variantes=[{si:{flag:'mirage_oasis'},txt:'Des touristes ! Enfin ! Ils dorment sur des draps dépareillés, et ils trouvent ça charmant.'}];

// ============ VILLES : cartes sans monstres générées à partir d'une courte description ============
// DATA.ville(id,{n,pos:[x,y],npcs,exits:[{to}],portes:[{to,d}],atelier}) : exits[].to suffit (les cases de sortie sont calculées plus bas) ;
// portes : liaison entre deux cartes non voisines sur la grille, avec la direction de la sortie (le retour prend la direction opposée).
DATA.liens=DATA.liens||{};DATA.extraMonde=DATA.extraMonde||{};
DATA.ville=(id,o)=>{const m=DATA.cartes[id]={n:o.n,biome:o.biome||'village',need:o.need||0,start:o.start||[6,11],tint:o.tint||'rgba(255,170,80,.08)',rocks:o.rocks||[],npcs:o.npcs||[],picks:[],groups:[],nodes:[],exits:(o.exits||[]).map(e=>({x:0,y:0,to:e.to,tx:0,ty:0}))};
if(o.atelier)m.atelier=o.atelier;DATA.extraMonde[id]=o.pos;(o.portes||[]).forEach(q=>{DATA.liens[id+'>'+q.to]=q.d});DATA.ambiance[id]={type:'lucioles'};DATA.decor[id]=.12;return m};
// Capitale : le Village des Lanternes s'étend au sud (Marché), au nord (Auberge, Remparts) et vers la Cour des Ouvrages (ateliers de fabrication).
{const R4=[[3,3],[9,3],[3,9],[9,9]],
art=(x,y,e,n,txt,extra)=>({x,y,e,n,txt,...(extra||{})}),
atl=(x,y,e,n,txt,sub)=>art(x,y,e,n,txt,{actions:[{id:'atelier_'+n,t:'Ouvrir l’atelier',sub,open:'atelier'}]});
DATA.cartes.village.exits.push({x:0,y:0,to:'v_marche',tx:0,ty:0});
DATA.cartes.poste.exits.push({x:0,y:0,to:'v_auberge',tx:0,ty:0},{x:0,y:0,to:'v_remparts',tx:0,ty:0});
DATA.ville('v_marche',{n:'Marché des Lanternes',pos:[0,1],tint:'rgba(255,190,110,.1)',rocks:R4,exits:[{to:'village'},{to:'v_ouvrages'}],portes:[{to:'v_ouvrages',d:'E'}],npcs:[
art(4,4,'🧵','Marchande de Rubans','Des rubans pour lanternes ! Elle n’en a pas besoin, mais ça fait joli. Dix pour cent de réduction si vous ne comptez pas.',{trade:[{give:{sable:3},get:{fil:1}},{give:{fil:3},get:{sable:1}}]}),
art(8,4,'💎','Marchand d’Éclats','Éclats, gravats, cailloux brillants ! Tout est authentique, sauf ce qui est faux.',{trade:[{give:{gravat:3},get:{eclat:1}},{give:{eclat:3},get:{gravat:1}}]}),
art(6,8,'📣','Crieur des Lanternes','Dernières nouvelles : le soleil est toujours éteint ! Le Roi s’en excuse. Il n’a pas précisé auprès de qui.'),
art(10,7,'🧦','Pique-Chaussette','Je ne vole pas : je rends aux chaussettes leur liberté. Elles me remercient. En silence.')]});
DATA.ville('v_auberge',{n:'Auberge du Dernier Feu',pos:[-1,-1],tint:'rgba(255,140,70,.14)',rocks:R4,exits:[{to:'poste'}],npcs:[
art(6,4,'🍺','Aubergiste Tisonnier','Le dernier feu du monde est dans cette cheminée. Il fume un peu. Ne le dites pas aux autres feux.'),
art(3,7,'🎻','Barde Sans-Voix','Je chante une ballade sur le soleil. Personne ne l’entend. C’est une ballade très discrète.'),
art(9,7,'🧳','Voyageuse Éteinte','Je viens de loin. Plus personne ne sait d’où. Mon sac est lourd d’adresses oubliées.')]});
DATA.ville('v_remparts',{n:'Remparts et jardins',pos:[1,-1],tint:'rgba(150,190,110,.1)',rocks:R4,exits:[{to:'poste'}],npcs:[
art(4,5,'💂','Sentinelle Mollette','Je garde les remparts. Contre quoi ? On ne m’a pas encore dit. Je surveille quand même, avec méthode.'),
art(8,8,'🪴','Jardinière Pétale','Mes fleurs poussent à l’ombre. C’est pratique : le soleil n’est pas là pour les déranger.'),
art(10,4,'🧓','Vieux Veilleur','Ces murs ont connu le soleil. Ils s’en souviennent mieux que moi.')]});
DATA.ville('v_ouvrages',{n:'Cour des Ouvrages',pos:[3,3],tint:'rgba(230,170,90,.12)',rocks:R4,exits:[{to:'v_marche'},{to:'v_forge'},{to:'v_armurerie'},{to:'v_cordonnerie'}],portes:[],npcs:[
art(4,4,'📐','Contremaître Rivet','Ici, on fabrique. La Braise Vive forge les armes, au nord. Les Tôles Fines font les armures, à l’est. Les Semelles Lumineuses, les bottes, au sud.'),
art(9,7,'🔧','Apprenti Étincelle','Moi, je porte les pièces. Le Contremaître dit que c’est un métier. Je crois qu’il parle de lui.')]});
DATA.ville('v_forge',{n:'La Braise Vive',pos:[3,2],tint:'rgba(255,120,60,.16)',rocks:R4,exits:[{to:'v_ouvrages'},{to:'v_bijouterie'}],atelier:{n:'La Braise Vive',slots:['arme']},npcs:[
atl(4,5,'🔨','Maître Braisard','Une arme bien forgée, c’est de la braise qui se souvient d’avoir été un arbre. Apportez les ressources, je m’occupe du reste.','Fabriquer des armes'),
art(9,8,'🧹','Apprenti Suie','Je balaie la cendre. Elle revient toujours. Je crois qu’elle me préfère au balai.')]});
DATA.ville('v_armurerie',{n:'Les Tôles Fines',pos:[4,3],tint:'rgba(170,170,190,.14)',rocks:R4,exits:[{to:'v_ouvrages'}],atelier:{n:'Les Tôles Fines',slots:['corps','tete']},npcs:[
atl(4,5,'🛡️','Armurière Tôle','Casques, plastrons, tout ce qui évite de recevoir les coups sur soi. Faites-moi confiance : je n’en ai jamais reçu un seul.','Fabriquer des armures et des casques'),
art(9,8,'🧍','Mannequin Fidèle','…Il ne dit rien. Il porte les dernières armures avec une patience admirable.')]});
DATA.ville('v_cordonnerie',{n:'Les Semelles Lumineuses',pos:[3,4],tint:'rgba(200,160,110,.14)',rocks:R4,exits:[{to:'v_ouvrages'},{to:'v_apothicairerie'}],atelier:{n:'Les Semelles Lumineuses',slots:['bottes']},npcs:[
atl(4,5,'👢','Cordonnier Talon','Des bottes qui brillent dans le noir. Le secret ? Ne jamais les faire marcher sur une chaussette perdue.','Fabriquer des bottes'),
art(9,8,'🦶','Client Pied-Plat','Je cherche des bottes qui me rendent plus grand. On me répond qu’il faut d’abord des jambes plus longues.')]});
DATA.ville('v_bijouterie',{n:'L’Écrin des Étincelles',pos:[4,2],tint:'rgba(230,200,255,.14)',rocks:R4,exits:[{to:'v_forge'}],atelier:{n:'L’Écrin des Étincelles',slots:['acc']},npcs:[
atl(4,5,'💍','Bijoutière Éclat','Un bijou ne protège de rien, mais il rend le malheur plus élégant. Apportez-moi vos éclats.','Fabriquer des accessoires'),
art(9,8,'🕶️','Garde Sourcilleux','Je surveille les bijoux. Les bijoux me surveillent aussi. Nous nous respectons.')]});
DATA.ville('v_apothicairerie',{n:'La Fiole Tiède',pos:[4,4],tint:'rgba(150,220,170,.12)',rocks:R4,exits:[{to:'v_cordonnerie'}],atelier:{n:'La Fiole Tiède',slots:[],bientot:1},npcs:[
art(5,5,'⚗️','Apothicaire Alambic','Mes fioles refroidissent… Elles arrivent bientôt. Revenez : je vous réchaufferai une potion, ou presque.')]});
}

// Cendrebourg (niv ~20-25) : ville de cendres au sud de la Roselière, à l'ouest du Gué
{const R4=[[3,3],[9,3],[3,9],[9,9]],a=(x,y,e,n,txt,extra)=>({x,y,e,n,txt,...(extra||{})}),B='marais',T='rgba(190,150,120,.1)';
DATA.cartes.roseliere.exits.push({x:0,y:0,to:'cb_place',tx:0,ty:0});DATA.cartes.gue.exits.push({x:0,y:0,to:'cb_place',tx:0,ty:0});
DATA.ville('cb_place',{n:'Place des Braises',biome:B,pos:[-1,3],tint:T,rocks:R4,exits:[{to:'roseliere'},{to:'gue'},{to:'cb_fonderie'},{to:'cb_taverne'}],npcs:[
a(6,4,'🎩','Bourgmestre Cendrier','Bienvenue à Cendrebourg ! Ville fondée sur les restes d’une autre ville. Nous sommes très attachés à nos fondations.',{quests:['cb1']}),
a(3,6,'🍲','Cantinière Braisette','Soupe de cendres, chaude comme au premier jour. Oui, elle a un goût de cendres. C’est la recette.'),
a(9,6,'🧒','Gamin Suie-Pouce','Je cherche des gens propres pour leur sourire. Personne ne passe l’examen.'),
a(7,9,'👵','Veuve Cendreuse','Mon mari est parti en fumée. Littéralement. Il m’avait promis qu’il ferait attention à la cheminée.')]});
DATA.ville('cb_fonderie',{n:'Fonderie Éteinte',biome:B,pos:[-2,3],tint:'rgba(255,120,60,.1)',rocks:R4,exits:[{to:'cb_place'},{to:'cb_chaudron'}],npcs:[
a(5,5,'🔥','Fondeur Refroidi','Mon four est éteint depuis la dernière nuit du soleil. Je lui parle, il ne répond pas. Ça fait un peu de peine.',{quests:['cb2'],variantes:[{si:{flag:'fonderie_rallumee'},txt:'Il chauffe ! Il chauffe même un peu trop. Mais je ne me plains pas : je suis enfin à l’heure.'}]}),
a(9,8,'💨','Souffleuse Muette','…Elle souffle sur les braises avec un sérieux imperturbable. Un jour, elle parlera. Peut-être.')]});
DATA.ville('cb_taverne',{n:'Taverne du Tison Froid',biome:B,pos:[-1,4],tint:'rgba(255,140,70,.12)',rocks:R4,exits:[{to:'cb_place'},{to:'cb_chaudron'},{to:'cb_cimetiere'}],npcs:[
a(6,4,'🍻','Tavernier Pelle','Ici, la bière est tiède et les nouvelles aussi. Je préfère les deux comme ça : ça évite les mauvaises surprises.'),
a(3,7,'🎲','Joueur de Dés Éteint','Je joue contre moi-même. C’est la seule partie que je n’ai jamais perdue. Ni gagnée.'),
a(9,7,'🎒','Colporteur Cendré','Un peu de tout, beaucoup de rien. Échange possible, mais je garde le meilleur côté.',{trade:[{give:{cendre:3},get:{roseau:1}},{give:{roseau:3},get:{cendre:1}},{give:{braise:3},get:{cendre:1}}]})]});
DATA.ville('cb_chaudron',{n:'Quartier des Chaudronniers',biome:B,pos:[-2,4],tint:'rgba(170,140,110,.1)',rocks:R4,exits:[{to:'cb_fonderie'},{to:'cb_taverne'}],npcs:[
a(5,5,'🍳','Chaudronnier Bosse','Je répare tout ce qui chauffe. Surtout les caractères. Ceux-là, ça prend plus de temps.',{quests:['cb3']}),
a(9,8,'🔩','Apprentie Rivette','Je tape sur les chaudrons depuis ce matin. Le chaudron n’a rien fait. Il tape en retour, par principe.')]});
DATA.ville('cb_cimetiere',{n:'Cimetière aux Cendres',biome:B,pos:[-1,5],tint:'rgba(120,130,150,.14)',rocks:R4,exits:[{to:'cb_taverne'}],npcs:[
a(4,4,'🌲','Gardienne Cyprès','Ici, les morts sont discrets. Pas autant que les vivants, pourtant. Ceux-là ne font que passer.'),
a(8,9,'⚰️','Fossoyeur Distrait','Je creuse. Pour qui ? Je ne sais plus. Je verrai bien qui se présente.')]}).groups=[{x:6,y:6,renc:4}];
Object.assign(DATA.quetes,{
cb1:{n:'Les registres de cendre',desc:'Interroge le Tavernier Pelle et le Fondeur Refroidi pour retrouver l’origine de Cendrebourg.',need:2,kind:'livre',req:5,donneur:'Bourgmestre Cendrier',to:['Tavernier Pelle','Fondeur Refroidi'],say:'Nos registres ont brûlé. Va demander au Tavernier Pelle et au Fondeur Refroidi : ils se souviennent de la ville, eux.',recu:{'Tavernier Pelle':'La ville est née d’un incendie, évidemment. Dis au Bourgmestre qu’on y a gagné des fondations.','Fondeur Refroidi':'On a fondu ce qui restait de la vieille ville. Nos casseroles sont des souvenirs. Ne leur dis pas.'},fin:'Un incendie, des casseroles… Je dois réécrire l’histoire de la ville. En cendres, comme il se doit.',rew:{xpq:[22,'normale'],res:{cendre:4,braise:3}}},
cb2:{n:'Rallumer la fonderie',desc:'Apporte 6 braises et 4 cendres au Fondeur Refroidi pour rallumer son four.',need:0,kind:'don',req:6,apres:'cb1',cost:{braise:6,cendre:4},donneur:'Fondeur Refroidi',say:'Mon four est froid. Il lui faut de la braise pour repartir, de la cendre pour le lit. Aide-moi, il nous attend tous les deux.',fin:'Il chauffe ! Il chauffe même trop. La ville aura de nouveau des casseroles.',rew:{xpq:[26,'normale'],set:{fonderie_rallumee:true}}},
cb3:{n:'Un message pour le cimetière',desc:'Porte le message du Chaudronnier Bosse à la Gardienne Cyprès, au Cimetière aux Cendres.',need:1,kind:'livre',req:6,donneur:'Chaudronnier Bosse',to:'Gardienne Cyprès',say:'Un chaudron du cimetière est à réparer. Dis à la Gardienne Cyprès que je passe demain. Enfin, un jour.',recu:'Demain ? Je vois. Les morts ont de la patience, mais pas moi. Dis-lui que je l’attends.',fin:'Elle attend ? Alors je passe demain. Cette fois, je le note quelque part.',rew:{xpq:[24,'normale'],res:{cendre:3}}}});
}

// Sainte-Veillée (niv ~44-50) : bourg de pèlerins entre le Chemin du Soleil Couchant et le Cloître
{const R4=[[3,3],[9,3],[3,9],[9,9]],a=(x,y,e,n,txt,extra)=>({x,y,e,n,txt,...(extra||{})}),B='temple',T='rgba(255,210,140,.1)';
DATA.cartes.chemin.exits.push({x:0,y:0,to:'sv_parvis',tx:0,ty:0});DATA.cartes.cloitre.exits.push({x:0,y:0,to:'sv_parvis',tx:0,ty:0});
DATA.ville('sv_parvis',{n:'Parvis des Veilleurs',biome:B,pos:[-2,-3],tint:T,rocks:R4,exits:[{to:'chemin'},{to:'cloitre'},{to:'sv_chapelle'},{to:'sv_scriptorium'}],npcs:[
a(6,4,'🕯️','Doyen Cierge','Sainte-Veillée veille pour que le soleil revienne. Nous veillons depuis longtemps. Nous commençons à avoir sommeil.',{quests:['sv1']}),
a(3,7,'🌙','Veilleuse Insomnieuse','Je veille, je veille, je veille. Quelqu’un a-t-il dit que je pouvais arrêter ?'),
a(9,6,'🧒','Enfant Chandelle','Je souffle les bougies pour rire. Les adultes pleurent. C’est un très bon jeu.'),
a(7,9,'🙏','Pèlerin Troqueur','Je troque ce que j’ai contre ce qu’il me faut. Pour le reste, je prie.',{trade:[{give:{eclat:2},get:{gravat:3}},{give:{gravat:3},get:{eclat:1}},{give:{cendre:2},get:{eclat:1}}]})]});
DATA.ville('sv_chapelle',{n:'Chapelle des Veilles',biome:B,pos:[-3,-3],tint:'rgba(255,230,170,.12)',rocks:R4,exits:[{to:'sv_parvis'},{to:'sv_hospice'},{to:'sv_cierges'}],npcs:[
a(5,5,'📿','Prieur Murmure','Nous veillons par roulement. Enfin, nous veillions. Plusieurs ont trouvé que le roulement roulait mal.',{quests:['sv2'],variantes:[{si:{flag:'veille_dormir'},txt:'Les veilleurs dorment à tour de rôle. Le soleil n’est pas revenu, mais les cernes, si.'},{si:{flag:'veille_laisser'},txt:'Ils veillent encore. On ne dort plus, mais on tient. Le monde a besoin de nos yeux ouverts.'}],actions:[{id:'veille_laisser',t:'Laisser les veilleurs veiller',sub:'Respecter leur vœu : éclats et gravats',si:{quete:{id:'sv2',etat:'finie'},pasFlag:'veille_choix'},rew:{xpq:[48,'normale'],res:{eclat:3,gravat:2},set:{veille_laisser:true,veille_choix:true}}},{id:'veille_dormir',t:'Les envoyer dormir à tour de rôle',sub:'Les protéger d’eux-mêmes : éclats en plus',si:{quete:{id:'sv2',etat:'finie'},pasFlag:'veille_choix'},rew:{xpq:[48,'normale'],res:{eclat:5},set:{veille_dormir:true,veille_choix:true}}}]}),
a(9,5,'🔔','Sacristain Mèche','J’éteins les cierges après la messe. Ils se rallument tout seuls. On dirait qu’ils veulent rester.',{quests:['sv3']}),
a(6,9,'🧎','Pèlerine Sans-Vœu','Je suis venue veiller et j’ai oublié pourquoi. Je veille quand même : c’est déjà un début.')]});
DATA.ville('sv_scriptorium',{n:'Scriptorium Éteint',biome:B,pos:[-2,-4],tint:'rgba(200,180,230,.1)',rocks:R4,exits:[{to:'sv_parvis'},{to:'sv_hospice'}],npcs:[
a(5,5,'✒️','Copiste Pâlot','Je recopie la liste de ceux qui ont veillé. Elle est longue. Je crois que je suis dessus, sans l’avoir cherché.'),
a(9,8,'📚','Archiviste Encre','Les archives disent que le soleil est parti un mardi. Elles ne disent pas pourquoi. Elles sont discrètes.')]});
DATA.ville('sv_hospice',{n:'Hospice des Pèlerins',biome:B,pos:[-3,-4],tint:'rgba(180,230,190,.1)',rocks:R4,exits:[{to:'sv_chapelle'},{to:'sv_scriptorium'}],npcs:[
a(5,5,'🌿','Infirmière Camomille','Soigner les veilleurs ? Facile : je leur dis de dormir. Ils me répondent qu’ils ont un vœu. Je réponds qu’ils ont des cernes.'),
a(9,8,'🧣','Pèlerin Grelot','J’ai froid. Veiller par ce temps, c’est de l’héroïsme ou de la bêtise. Je n’arrive pas à trancher.')]});
DATA.ville('sv_cierges',{n:'Jardin des Cierges',biome:B,pos:[-3,-2],tint:'rgba(255,190,110,.12)',rocks:R4,exits:[{to:'sv_chapelle'}],npcs:[
a(4,4,'🕯️','Jardinier Cirier','Ici, les cierges poussent. Ils sortent de terre déjà allumés. Je cueille, mais ils repoussent plus vite que je ne cueille.'),
a(8,9,'🕳️','Veilleur Égaré','Je cherchais la chapelle. J’ai trouvé un jardin. Je suis sûr d’avoir une bonne raison d’être là.')]}).groups=[{x:6,y:6,renc:11}];
Object.assign(DATA.quetes,{
sv1:{n:'La liste des veilleurs',desc:'Interroge le Copiste Pâlot et l’Infirmière Camomille pour savoir pourquoi les veilleurs s’endorment.',need:2,kind:'livre',req:15,donneur:'Doyen Cierge',to:['Copiste Pâlot','Infirmière Camomille'],say:'Les veilleurs s’endorment au poste. Va demander au Copiste Pâlot et à l’Infirmière Camomille : ils notent et soignent tout.',recu:{'Copiste Pâlot':'La liste montre que personne n’a dormi depuis des semaines. Ça n’est pas de la veille, c’est de l’entêtement. Dis-le au Doyen, doucement.','Infirmière Camomille':'Ils s’endorment parce qu’ils sont épuisés. Dis au Doyen que veiller ne veut pas dire ne jamais dormir.'},fin:'Épuisés. Évidemment. Je veillerai à ce qu’on veille mieux. Ou moins, ou autrement.',rew:{xpq:[44,'normale'],res:{eclat:3,gravat:2}}},
sv2:{n:'Le roulement qui roule mal',desc:'Repousse le groupe du Jardin des Cierges, puis décide avec le Prieur de ce qu’on fait des veilleurs épuisés.',need:1,kind:'win',renc:11,req:16,donneur:'Prieur Murmure',say:'Des cierges ont pris vie dans le jardin et dérangent les veilleurs. Chasse-les, on parlera ensuite du roulement.',fin:'Le jardin est calme. Reste à savoir ce qu’on fait des veilleurs : reviens me parler.',rew:{xpq:[46,'courte'],res:{eclat:2}}},
sv3:{n:'Des cierges pour le Cloître',desc:'Porte le message du Sacristain Mèche à Sœur Veilleuse, au Temple.',need:1,kind:'livre',req:17,donneur:'Sacristain Mèche',to:'Sœur Veilleuse',say:'Ces cierges sont pour Sœur Veilleuse, au Temple. Dis-lui qu’ils sont déjà allumés. Je n’y peux rien.',recu:'Allumés d’avance ? Parfait, ça fait gagner du temps. Dis-lui merci et dis-lui de ne pas les éteindre.',fin:'Elle les garde allumés ? Très bien. Je me fais à l’idée que le feu a son avis.',rew:{xpq:[48,'normale'],res:{eclat:2}}}});
}

DATA.zaaps=['village','cb_place','sv_parvis'];
DATA.cartes.village.npcs.push({x:9,y:5,e:'🏮',n:'Passeur de Lanternes',zaap:1,txt:'Une lanterne, un souhait, un trajet. Dis-moi où tu veux aller : je ne te promets que les endroits où tu es déjà passé.'});DATA.cartes.cb_place.npcs.push({x:9,y:8,e:'🏮',n:'Passeur de Lanternes',zaap:1,txt:'Une lanterne, un souhait, un trajet. Dis-moi où tu veux aller : je ne te promets que les endroits où tu es déjà passé.'});DATA.cartes.sv_parvis.npcs.push({x:3,y:5,e:'🏮',n:'Passeur de Lanternes',zaap:1,txt:'Une lanterne, un souhait, un trajet. Dis-moi où tu veux aller : je ne te promets que les endroits où tu es déjà passé.'});
// ============ PHASE C : zones de nature générées (pilote : Landes des Lucioles, niv 6-10, au nord de la Clairière) ============
// Les cartes sont créées ici (pour que les sorties soient calculées avec le reste du monde) ; les rencontres sont ajoutées en toute fin de fichier
// afin de ne pas décaler les identifiants des rencontres existantes.
DATA.zones=[];
DATA.zone=(id,o)=>{const m=DATA.cartes[id]={n:o.n,biome:o.biome,need:0,start:[6,11],tint:o.tint||'rgba(120,180,110,.07)',rocks:[[3,3],[9,3],[3,9],[9,9]],npcs:o.npcs||[],picks:[],groups:[],nodes:o.nodes||[],exits:o.exits.map(t=>({x:0,y:0,to:t,tx:0,ty:0}))};
DATA.extraMonde[id]=o.pos;DATA.ambiance[id]={type:o.amb||'spores'};DATA.decor[id]=o.decor||.13;(o.list||DATA.zones).push({id,niv:o.niv,tailles:o.tailles,pool:o.pool});return m};
{const Z=[['lu1',3,-1,6,[1,3],'Lisière des Landes'],['lu2',4,-1,6,[2,4],'Landes aux Herbes Hautes'],['lu3',5,-1,7,[3,5],'Landes du Vent Doux'],['lu4',6,-1,8,[1,2],'Landes de la Pierre Plate'],
['lu5',3,-2,7,[4,2],'Fourré des Lucioles'],['lu6',4,-2,7,[5,3],'Clairière du Bûcheron'],['lu7',5,-2,8,[2,1],'Landes Bruissantes'],['lu8',6,-2,9,[3,4],'Landes des Ronces'],
['lu9',4,-3,8,[1,5],'Combe des Lucioles'],['lu10',5,-3,9,[2,3],'Hauteur des Lucioles']],P={};Z.forEach(z=>P[z[1]+','+z[2]]=z[0]);
const NR=[[2,6,'champi'],[6,2,'laine'],[2,10,'laine'],[10,6,'champi']];
Z.forEach((z,i)=>{const ex=[[1,0],[-1,0],[0,1],[0,-1]].map(d=>P[(z[1]+d[0])+','+(z[2]+d[1])]).filter(Boolean);if(z[0]=='lu1')ex.push('clairiere');
const nd=[NR[i%4],NR[(i+2)%4]].map(r=>({x:r[0],y:r[1],res:r[2]})),np=z[0]=='lu2'?[{x:5,y:6,e:'🌾',n:'Herboriste Brindille',txt:'Les herbes des landes poussent à l’envers : racines en haut, feuilles en bas. Ou l’inverse. Je n’ai jamais tranché.',quests:['lu_q1']}]:z[0]=='lu6'?[{x:6,y:5,e:'🪓',n:'Bûcheron Mousse',txt:'Je coupe du bois depuis ce matin. L’arbre repousse pendant que je dîne. C’est un peu vexant.'}]:[];
DATA.zone(z[0],{n:z[5],biome:'foret',pos:[z[1],z[2]],niv:z[3],tailles:z[4],exits:ex,nodes:nd,npcs:np})});
DATA.cartes.clairiere.exits.push({x:0,y:0,to:'lu1',tx:0,ty:0});
Object.assign(DATA.quetes,{lu_q1:{n:'Des herbes pour le bûcheron',desc:'Porte le fagot d’herbes de l’Herboriste Brindille au Bûcheron Mousse, dans la Clairière du Bûcheron.',need:1,kind:'livre',req:3,donneur:'Herboriste Brindille',to:'Bûcheron Mousse',say:'Ces herbes sont pour le Bûcheron Mousse, plus à l’ouest dans les landes. Il dit qu’elles font repousser le bois. Moi, je dis qu’elles font surtout rire les arbres.',recu:'Des herbes ? Parfait, j’en avais besoin pour mes tisanes. Pas pour les arbres. Les arbres repoussent déjà trop.',fin:'Il les a prises pour ses tisanes ? Bon. Les arbres repoussent toujours, c’est déjà ça.',rew:{xpq:[9,'normale'],res:{champi:3,laine:2}}}})}

// Zones générées 2 : Friches du Sud (collines), Désert Profond (désert), Rivages Perdus (mer). Rencontres équilibrées automatiquement en fin de fichier.
DATA.zonesB=[];
{const Z=(pref,nom,biome,tint,amb,entry,cells,nodes,npcs,quest)=>{const P={};cells.forEach(c=>P[c[0]+','+c[1]]=pref+(cells.indexOf(c)+1));
cells.forEach((c,i)=>{const id=pref+(i+1),ex=[[1,0],[-1,0],[0,1],[0,-1]].map(d=>P[(c[0]+d[0])+','+(c[1]+d[1])]).filter(Boolean);if(i==0)ex.push(entry);
const nd=[nodes[i%nodes.length],nodes[(i+1)%nodes.length]].map((r,j)=>({x:[2,6,2,10][(i+j*2)%4],y:[6,2,10,6][(i+j*2)%4],res:r})),np=(npcs[i]||[]).map(n=>({...n}));
DATA.zone(id,{n:nom[i],biome,pos:[c[0],c[1]],niv:c[2],tailles:null,exits:ex,nodes:nd,npcs:np,tint,amb,decor:.12,list:DATA.zonesB,pool:biome})});
DATA.cartes[entry].exits.push({x:0,y:0,to:pref+'1',tx:0,ty:0});Object.assign(DATA.quetes,quest)};
Z('fs',['Friches de la Barrière','Friches aux Chardons','Friches du Vieux Puits','Friches Venteuses','Friches des Meules','Friches Moutonnantes','Friches de la Lisière Sud','Friches aux Corbeaux','Friches des Cairns','Friches du Bout du Monde'],'collines','rgba(170,190,220,.14)','brume','paturage',
[[2,2,14],[2,3,15],[2,4,15],[2,5,16],[3,5,17],[4,5,17],[5,5,18],[2,6,17],[3,6,18],[4,6,19]],['laine','champi','braise'],
[[],[{x:5,y:6,e:'🧑‍🌾',n:'Fermier Guenille',txt:'Mes moutons sont partis voir ailleurs. Ils ont dit que l’herbe y est moins fantôme. Je n’ai pas su quoi répondre.',quests:['fs_q1']}],[],[],[],[],[],[{x:6,y:5,e:'🌾',n:'Meunière Farine',txt:'Je moule la farine, mais il n’y a plus de blé. Je moule de la brume, ça fait des galettes tièdes.'}]],
{fs_q1:{n:'Des nouvelles du troupeau',desc:'Porte le mot du Fermier Guenille à la Meunière Farine, aux Friches aux Corbeaux.',need:1,kind:'livre',req:8,donneur:'Fermier Guenille',to:'Meunière Farine',say:'Dis à la Meunière Farine que mes moutons ne sont pas chez elle. Ou alors qu’ils le sont, et qu’elle ne dise rien.',recu:'Des moutons ? Je n’en ai vu aucun. Mais mes galettes ont l’air lainées, depuis ce matin. Dis-lui de venir voir.',fin:'Lainées ? Alors ils sont passés par là. Je vais la voir, merci.',rew:{xpq:[16,'normale'],res:{laine:3,champi:2}}}});
Z('dp',['Piste des Perdus','Dunes des Chaussettes','Sables Murmurants','Piste des Oubliés','Dunes Sans Retour','Dune Ensorcelée','Sables Pâlis','Ravine des Mirages','Dunes de l’Adieu','Désert du Bout'],'desert','rgba(220,170,90,.14)','sable','oasis',
[[-3,0,35],[-4,0,36],[-3,-1,36],[-4,-1,37],[-5,0,37],[-5,-1,38],[-6,0,39],[-6,-1,39],[-7,0,40],[-7,-1,40]],['sable','chaussette','fil'],
[[],[{x:5,y:6,e:'🧳',n:'Caravanier Perdu',txt:'Ma caravane est partie sans moi. Ou je suis parti sans elle. Les deux versions se défendent.',quests:['dp_q1']}],[],[],[],[],[{x:6,y:5,e:'⏳',n:'Nomade Sablier',txt:'Le désert est un grand sablier. Je suis dedans. Je cherche la sortie, mais elle coule toujours sous mes pieds.'}]],
{dp_q1:{n:'Un message pour le nomade',desc:'Porte le message du Caravanier Perdu au Nomade Sablier, dans les Sables Pâlis.',need:1,kind:'livre',req:18,donneur:'Caravanier Perdu',to:'Nomade Sablier',say:'Le Nomade Sablier a mon bagage. Enfin, il l’aura peut-être. Dis-lui que je le rejoins, si je retrouve la route.',recu:'Un bagage ? Je n’en ai pas vu. Mais j’ai vu cinq chaussettes. Dis-lui de les prendre, il en a toujours besoin.',fin:'Cinq chaussettes ! Les voilà, mes affaires. Merci, le désert te revaudra ça.',rew:{xpq:[37,'normale'],res:{sable:3,chaussette:2}}}});
Z('rp',['Anse des Perdus','Récif aux Cierges','Banc de l’Oubli','Falaise des Naufragés','Lagune Tiède','Écueils du Silence','Crique aux Étoiles','Rivage de Brume','Grève de l’Adieu','Pointe de la Dernière Vague'],'mer','rgba(70,100,130,.22)','brume','epave',
[[-3,5,41],[-4,4,41],[-4,5,42],[-2,5,42],[-3,6,43],[-4,6,43],[-2,6,44],[-3,7,44],[-4,7,45],[-2,7,45]],['gravat','eclat','roseau'],
[[],[{x:5,y:6,e:'🎣',n:'Pêcheur Sans-Ligne',txt:'J’ai perdu ma ligne. Ou c’est elle qui m’a perdu. La mer ne tranche pas.',quests:['rp_q1']}],[],[],[],[],[],[{x:6,y:5,e:'🔦',n:'Gardienne du Phare Brisé',txt:'Mon phare est brisé, mais il éclaire quand même. De travers, certes. Les bateaux perdus apprécient l’originalité.'}]],
{rp_q1:{n:'Une ligne pour le phare',desc:'Porte le mot du Pêcheur Sans-Ligne à la Gardienne du Phare Brisé, au Rivage de Brume.',need:1,kind:'livre',req:24,donneur:'Pêcheur Sans-Ligne',to:'Gardienne du Phare Brisé',say:'La Gardienne du Phare Brisé a peut-être ma ligne. Elle a tout ce qui flotte. Demande-lui, poliment.',recu:'Une ligne ? Elle s’est enroulée autour de mon phare. Elle éclaire mieux qu’avant. Dis-lui qu’il peut la garder.',fin:'Elle éclaire le phare ? Alors c’est une promotion. Merci, je pêcherai sans.',rew:{xpq:[43,'normale'],res:{gravat:3,eclat:2}}}});
}

// ============ CARTE DU MONDE ÉTENDUE : les zones forment une grille (4 directions), donjons signalés ============
// Fenêtre de jeu rectangulaire (style Dofus Touch) : les cases en losange remplissent tout l'écran
DATA.in=(x,y)=>{const u=x-y,v=x+y;return u>=-15&&u<=15&&v>=0&&v<=24};
DATA.cells=[];for(let s=0;s<=24;s++)for(let x=-8;x<=20;x++){const y=s-x;if(DATA.in(x,y))DATA.cells.push([x,y])}
(()=>{const C=DATA.cartes,L={quartier:[-1,0],village:[0,0],poste:[0,-1],foret:[1,0],collines:[1,1],manoir:[1,2],marais:[0,2],roseliere:[-1,2],serre:[-2,2],dunes:[-2,1],oasis:[-2,0],camp:[-2,-1],chemin:[-2,-2],parvis:[-1,-2],temple:[0,-2],cour:[1,-2],salle:[2,-2],trone:[2,-1],
sentier:[2,0],clairiere:[3,0],terrier1:[4,0],terrier2:[5,0],terrier3:[6,0],
paturage:[2,1],bergerie:[3,1],enclos1:[4,1],enclos2:[5,1],enclos3:[6,1],
hall:[1,3],bureaux:[1,4],archives1:[1,5],archives2:[1,6],archives3:[1,7],
gue:[0,3],ile:[0,4],reves1:[0,5],reves2:[0,6],reves3:[0,7],
mirage:[-3,1],puits:[-4,1],pyr1:[-5,1],pyr2:[-6,1],pyr3:[-7,1],
cloitre:[-1,-3],jardin:[-1,-4],crypte1:[-1,-5],crypte2:[-1,-6],crypte3:[-1,-7],
plage:[-3,2],port:[-3,3],epave:[-3,4]};Object.assign(L,DATA.extraMonde||{});
DATA.monde=L;
const dir=(a,b)=>{const o=DATA.liens||{};if(o[a+'>'+b])return o[a+'>'+b];if(o[b+'>'+a])return {E:'W',W:'E',N:'S',S:'N'}[o[b+'>'+a]];const dx=L[b][0]-L[a][0],dy=L[b][1]-L[a][1];return dx==1?'E':dx==-1?'W':dy==1?'S':'N'},
side=e=>e.x==0?'W':e.x>=12?'E':e.y==0?'N':'S',def={E:[14,-1],W:[-1,14],N:[0,0],S:[12,12]},inn={E:[-1,0],W:[1,0],N:[0,1],S:[0,-1]},opp={E:'W',W:'E',N:'S',S:'N'},P={};
for(const k in C)P[k]={};
for(const k in C)for(const e of C[k].exits){const d=dir(k,e.to);P[k][e.to]=def[d]}
for(const k in C)C[k].exits=C[k].exits.map(e=>{const d=dir(k,e.to),q=P[e.to][k],a=opp[d],p=P[k][e.to];return{x:p[0],y:p[1],d:d,to:e.to,tx:q[0]+inn[a][0],ty:q[1]+inn[a][1]}});
const arr={};for(const k in C)for(const e of C[k].exits)(arr[e.to]=arr[e.to]||[]).push([e.tx,e.ty]);
for(const k in C){const m=C[k],ents=['npcs','picks','groups','nodes','coffres','hides'].flatMap(q=>m[q]||[]),bl=[...m.exits.map(e=>[e.x,e.y]),...(arr[k]||[])],is=(c,x,y)=>c[0]==x&&c[1]==y;
for(const o of ents)if(bl.some(c=>is(c,o.x,o.y)))for(const [a,b] of [[-1,0],[0,-1],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1],[-2,0],[0,-2]]){const x=o.x+a,y=o.y+b;
if(!DATA.in(x,y)||(m.rocks||[]).some(r=>is(r,x,y))||ents.some(u=>u.x==x&&u.y==y)||bl.some(c=>is(c,x,y)))continue;o.x=x;o.y=y;break}}
for(const k in C){const m=C[k],cells=[...m.exits.map(e=>[e.x,e.y]),...m.exits.map(e=>[e.tx,e.ty])];m.rocks=(m.rocks||[]).filter(r=>!cells.some(c=>c[0]==r[0]&&c[1]==r[1]))}
// Décor naturel dans les nouvelles zones : rochers épars (sans bloquer les sorties)
const hs=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h},hx=(x,y,k)=>(((x+31)*73856093)^((y+57)*19349663)^(k*83492791))>>>0,out=(x,y)=>x<0||y<0||x>12||y>12;
for(const k in C){const m=C[k],key=hs(k),keep=[...m.exits.map(e=>[e.x,e.y]),...(arr[k]||[])];for(const [x,y] of DATA.cells)if(out(x,y)&&hx(x,y,key)%100<13&&!keep.some(c=>Math.abs(c[0]-x)+Math.abs(c[1]-y)<=2))m.rocks.push([x,y])}
{const key=hs('arene');for(const [x,y] of DATA.cells)if(out(x,y)&&hx(x,y,key)%100<13)DATA.rochers.push([x,y])}
// Donjons : entrée visible depuis une carte de la zone, avec nom et niveau
const D=[['clairiere','terrier','Terrier de la Mère'],['bergerie','enclos','Enclos du Troupeau'],['bureaux','archives','Archives du Greffier'],['ile','reves','Rêves de la Baronne'],['puits','pyr','Pyramide du Sphinx'],['jardin','crypte','Crypte du Gardien']];
for(const [hub,p,nom] of D){const ns=[1,2,3].map(i=>C[p+i]),nv=[];ns.forEach(m=>(m.groups||[]).forEach(g=>nv.push(DATA.rencontres[g.renc].niv)));
const a=Math.min(...nv),b=Math.max(...nv),e=C[hub].exits.find(e=>e.to==p+'1');e.don=1;e.lbl=nom;e.nv='niv '+(a==b?a:a+'-'+b)}

// Passages verrouillés : il faut vaincre le boss du donjon de la zone pour avancer
for(const [a,b,r,nom] of [['foret','collines',22,'Terrier de la Mère'],['collines','manoir',27,'Enclos du Troupeau'],['manoir','marais',32,'Archives du Greffier'],['marais','roseliere',37,'Rêves de la Baronne'],['dunes','oasis',42,'Pyramide du Sphinx'],['parvis','temple',47,'Crypte du Gardien']]){const e=C[a].exits.find(e=>e.to==b);e.cle='vaincu_'+r;e.why='Passage bloqué : vaincs d’abord le boss de '+nom+'.'}
// Boss sur la route du joueur : à quelques cases de la sortie qui mène plus loin
const R=DATA.rencontres,isB=g=>R[g.renc].n.includes('boss');
for(const [k,to] of [['manoir','marais'],['serre','dunes'],['temple','cour']]){const m=C[k],g=(m.groups||[]).find(isB),e=m.exits.find(e=>e.to==to);if(!g)continue;
const sx=e.x==0?1:e.x>=12?-1:0,sy=e.y==0?1:e.y>=12?-1:0,taken=u=>[...m.groups,...(m.npcs||[]),...(m.nodes||[]),...(m.picks||[])].some(o=>o!==g&&o.x==u[0]&&o.y==u[1])||m.rocks.some(r=>r[0]==u[0]&&r[1]==u[1]);
for(const d of [3,4,2,5]){const c=[e.x+sx*d,e.y+sy*d];if(c[0]>0&&c[0]<12&&c[1]>0&&c[1]<12&&!taken(c)){g.x=c[0];g.y=c[1];break}}}
// Groupes diversifiés : les doublons d'une carte deviennent des variantes avec d'autres monstres du même biome
let sd=7;const rnd=()=>(sd=sd*16807%2147483647)/2147483647,pool={};
R.forEach(r=>{if(r.n.includes('boss'))return;(pool[r.biome]=pool[r.biome]||[]).push({niv:r.niv,ms:r.m.filter(u=>!u.boss&&!u.form)})});
for(const k in C){const seen=new Set();for(const g of C[k].groups||[]){const b=R[g.renc];if(isB(g)||b.base!=null)continue;if(!seen.has(g.renc)){seen.add(g.renc);continue}
const P=(pool[b.biome]||[]).filter(p=>Math.abs(p.niv-b.niv)<=4).flatMap(p=>p.ms).filter(u=>!b.m.some(w=>w.n==u.n));if(!P.length)continue;
const v=JSON.parse(JSON.stringify(b)),j=Math.floor(rnd()*v.m.length),o=v.m[j],c=JSON.parse(JSON.stringify(P[Math.floor(rnd()*P.length)]));c.x=o.x;c.y=o.y;v.m[j]=c;v.base=g.renc;R.push(v);g.renc=R.length-1}}
})();

// Panoplies élémentaires (étape 5) : une panoplie = un élément. Les objets des panoplies Dunes, Soleil couchant et Marais
// passent de Neutre à l'élément de leur panoplie ; la panoplie de l'orage (Foudre) est nouvelle, au niveau du marais.
// Chaque pièce non-arme donne aussi de la résistance à son élément (RES_PIECE, accessoires RES_ACC) et la panoplie complète un bonus.
DATA.objets.lame_orage={n:'Lame d’orage',e:'🗡️',slot:'arme',r:1,st:{foudre:3},cout:{roseau:6,braise:3}};
DATA.objets.heaume_paratonnerre={n:'Heaume paratonnerre',e:'🎓',slot:'tete',r:1,st:{pv:14},cout:{braise:5,roseau:3}};
DATA.objets.tunique_orage={n:'Tunique d’orage',e:'👘',slot:'corps',r:1,st:{pv:14,res:6},cout:{roseau:8,braise:3}};
DATA.objets.bottes_etincelle={n:'Bottes d’étincelle',e:'👢',slot:'bottes',r:1,st:{pv:8,res:3},cout:{roseau:5}};
DATA.objets.bracelet_eclair={n:'Bracelet d’éclair',e:'📿',slot:'acc',r:1,st:{pv:6,foudre:1},cout:{braise:5,cendre:3}};
DATA.sets.orage={n:'Panoplie de l’orage',bonus:{2:{pv:10},4:{foudre:1,res:4}}};
['lame_orage','heaume_paratonnerre','tunique_orage','bottes_etincelle','bracelet_eclair'].forEach(id=>{DATA.objets[id].set='orage'});
DATA.setElem={livreur:'neutre',dunes:'vent',soleil:'lumiere',marais:'tenebres',orage:'foudre'};
{const RES_PIECE=3,RES_ACC=2,RES_SET=5;
for(const k in DATA.setElem){const el=DATA.setElem[k];const S=DATA.sets[k],top=Math.max(...Object.keys(S.bonus).map(Number));
for(const id in DATA.objets){const o=DATA.objets[id];if(o.set!=k)continue;if(el!='neutre'&&o.st.neutre){o.st[el]=(o.st[el]||0)+o.st.neutre;delete o.st.neutre}if(o.slot!='arme')o.st['r'+el]=o.slot=='acc'?RES_ACC:RES_PIECE}
for(const n in S.bonus){const b=S.bonus[n];if(el!='neutre'&&b.neutre){b[el]=(b[el]||0)+b.neutre;delete b.neutre}}
S.bonus[top]['r'+el]=RES_SET}}

// Éléments des monstres (étape 5) : un monstre d'un élément résiste à cet élément (+R %) et craint celui qui le bat (−R %) ;
// R = 25 (ordinaire) ou 20 (boss). Sans élément = Neutre : aucune résistance. Ses coups et sorts sont de son élément (sauf `elem` propre au sort).
DATA.monstreElem={'La mouche à braise':'foudre','Le champignon bavard':'lumiere','Le mouton-fantôme':'vent','Le berger-fantôme':'lumiere','Chambellan Poussière':'tenebres',
'Le crapaud cendreux':'tenebres','Le grillon de cendre':'vent','La Duchesse des Cendres':'tenebres','Duchesse des Cendres':'tenebres','Scorpion de sable':'tenebres','Chaussette lanceuse':'vent',
'Chameau-infirmier':'lumiere','Pèlerin éteint':'lumiere','Luciole terne':'foudre','Statue de soleil':'lumiere','Prêtre aveugle':'lumiere','Éclipse':'tenebres','Garde fantôme':'tenebres',
'Bouffon Sans Rire':'foudre','Le Roi Éteint':'tenebres','Mère Mycélium':'lumiere','Le loup de brume':'vent','Le clerc fantôme':'tenebres','La plume vexée':'vent','Greffier Ratures':'tenebres',
'Le papillon de nuit':'vent','Le chasseur de rêves':'tenebres','Baronne Insomnie':'tenebres','Le vautour affamé':'vent','Le cobra de sable':'foudre','Sphinx Dépareillé':'lumiere',
'L’ombre errante':'tenebres','Le cierge vivant':'lumiere','Écho du Gardien':'lumiere',
'Le crabe-lanterne':'foudre','La mouette pillarde':'vent','La méduse luisante':'lumiere','Le marin fantôme':'tenebres','Amiral Marée-Basse':'vent'};
// Résistances en % (positif = résiste, négatif = vulnérable) : élément du monstre +R, celui qui le bat −R (R = 25, boss 20), et un profil secondaire
// de ±10 sur les deux autres éléments (profils choisis pour que chaque élément soit, en moyenne sur toutes les rencontres, ni plus ni moins résisté) : 'A' = résiste à l'élément qu'il bat et craint l'opposé, 'B' = l'inverse. Un monstre Neutre reçoit ±15 (boss ±10)
// sur deux éléments [résiste, craint]. Chaque profil élémentaire est équilibré (somme nulle sur les 4 éléments) ; le Neutre est ajouté à part, fixe (15 %, boss 10 %), en fin de fichier.
DATA.monstreRs={'La mouche à braise':'A','Le champignon bavard':'B','Le mouton-fantôme':'B','Le berger-fantôme':'B','Chambellan Poussière':'B','Le crapaud cendreux':'B','Le grillon de cendre':'B',
'Le sac de cendres':['lumiere','vent'],'La Duchesse des Cendres':'A','Duchesse des Cendres':'A','Squelette gréviste':['tenebres','lumiere'],'Scorpion de sable':'A','Chaussette lanceuse':'A','Chameau-infirmier':'B',
'Chaussette sale':['vent','tenebres'],'Général Gréviste':['lumiere','foudre'],'Pèlerin éteint':'A','Luciole terne':'B','Statue de soleil':'B','Prêtre aveugle':'B','Éclipse':'A','Garde fantôme':'A',
'Archer osseux':['foudre','vent'],'Chevalier brisé':['foudre','lumiere'],'Bouffon Sans Rire':'A','Le Roi Éteint':'A','Courtisan squelette':['tenebres','vent'],'Mère Mycélium':'A','Le loup de brume':'A',
'La pelote enragée':['tenebres','lumiere'],'Bouc Recenseur':['tenebres','foudre'],'Le clerc fantôme':'A','La plume vexée':'A','Le classeur mordant':['lumiere','vent'],'Greffier Ratures':'A',
'Le papillon de nuit':'A','Le chasseur de rêves':'A','L’oreiller hanté':['lumiere','vent'],'Baronne Insomnie':'A','Le vautour affamé':'A','Le cobra de sable':'A','La momie bandée':['tenebres','lumiere'],
'Sphinx Dépareillé':'B','L’ombre errante':'A','Le cierge vivant':'B','Écho du Gardien':'B',
'Le crabe-lanterne':'A','La mouette pillarde':'A','La méduse luisante':'B','Le marin fantôme':'A','Amiral Marée-Basse':'B'};
{const BAT={vent:'foudre',foudre:'tenebres',tenebres:'lumiere',lumiere:'vent'};
DATA.rencontres.forEach(r=>r.m.forEach(m=>{if(m.form||m.elem||m.rs)return;const e=DATA.monstreElem[m.n],p=DATA.monstreRs[m.n],rs={};
if(e){const R=m.boss?20:25,b=BAT[e],o=BAT[b];m.elem=e;rs[e]=R;rs[DATA.elements[e].faiblesse]=-R;rs[b]=p=='A'?10:-10;rs[o]=p=='A'?-10:10}
else if(p){const v=m.boss?10:15;rs[p[0]]=v;rs[p[1]]=-v}
if(Object.keys(rs).length)m.rs=rs}))}

// ============ ROSELIÈRE ET SERRE : PNJ isolés et quêtes (ro1-ro3, se1-se2) ============
DATA.cartes.roseliere.npcs.push({x:3,y:7,e:'😴',n:'Insomniaque Mirette',quests:['ro1','ro2','ro3'],txt:'Je n’ai pas dormi depuis la Baronne. Elle compte les moutons des autres, et les miens avec.',actions:[{id:'somnambules_reveil',t:'Réveiller les somnambules',sub:'Les ramener chez eux : roseaux et cendres',si:{quete:{id:'ro2',etat:'finie'},pasFlag:'somnambules_choix'},rew:{xpq:[26,'normale'],res:{roseau:3,cendre:2},set:{somnambules_reveil:true,somnambules_choix:true}}},{id:'somnambules_sommeil',t:'Les laisser marcher en dormant',sub:'Respecter leur sommeil : roseaux en plus',si:{quete:{id:'ro2',etat:'finie'},pasFlag:'somnambules_choix'},rew:{xpq:[26,'normale'],res:{roseau:5},set:{somnambules_sommeil:true,somnambules_choix:true}}}]});
DATA.cartes.roseliere.npcs[0].variantes=[{si:{flag:'somnambules_reveil'},txt:'Ils sont rentrés chez eux, réveillés et vexés. Ma Roselière est enfin tranquille. Trop, peut-être.'},{si:{flag:'somnambules_sommeil'},txt:'Ils marchent toujours en dormant. Mais ils évitent mes roseaux, maintenant. C’est du savoir-vivre.'},{si:{flag:'berceuses_rendues'},txt:'On chante, au loin, dans le marais. Je ferme un œil. Un seul, mais c’est un début.'}];
DATA.cartes.serre.npcs.push({x:3,y:5,e:'🧑‍🌾',n:'Jardinier Sans-Pousse',quests:['se1','se2'],txt:'Je plante des graines pour la Duchesse depuis 200 ans. Rien ne pousse. Elle ne m’a pas dit d’arrêter.'});
Object.assign(DATA.quetes,{
ro1:{n:'Tisane pour la Passeuse',desc:'Porte la tisane de roseau de Mirette à la Passeuse, dans le Marais de Cendres.',need:1,kind:'livre',req:5,donneur:'Insomniaque Mirette',to:'La Passeuse',say:'Cette tisane est pour la Passeuse. Elle dit qu’elle connaît les habitudes du marais, pas celles du sommeil.',recu:'De la tisane ? Je ne dors jamais, mais je la boirai quand même. Dis-lui merci.',fin:'Elle l’a bue ? Alors elle ne dort pas non plus. On pourrait former un club.',rew:{xpq:[26,'normale'],res:{roseau:3}}},
ro2:{n:'Les somnambules',desc:'Repousse le groupe de somnambules qui piétine les roseaux de la Roselière, puis décide de leur sort avec Mirette.',need:1,kind:'win',renc:5,req:5,apres:'ro1',donneur:'Insomniaque Mirette',say:'Ils marchent dans leur sommeil et piétinent mes roseaux. Chasse ceux qui bloquent le passage : on décidera ensuite de ce qu’on en fait.',fin:'Le passage est libre. Reste les somnambules eux-mêmes : parle-moi encore, on va décider.',rew:{xpq:[26,'courte'],res:{roseau:1}}},
ro3:{n:'Oreillers pour insomniaques',desc:'Rapporte 5 roseaux et 2 cendres à Mirette pour garnir des oreillers.',need:0,kind:'don',req:5,apres:'ro2',cost:{roseau:5,cendre:2},donneur:'Insomniaque Mirette',say:'Des oreillers, voilà ce qu’il me faut. Des roseaux, de la cendre pour la douceur. Je te dirai si ça marche.',fin:'Ça marche. Je bâille. C’est la première fois depuis un siècle. Va, avant que je ne m’endorme sur toi.',rew:{xpq:[27,'normale'],set:{mirette_dort:true}}},
se1:{n:'Graines mortes',desc:'Mène l’enquête : interroge le Pêcheur de Brume et la Vieille Berceuse, dans le Marais, pour savoir pourquoi les graines du Jardinier ne poussent pas.',need:2,kind:'livre',req:6,donneur:'Jardinier Sans-Pousse',to:['Pêcheur de Brume','Vieille Berceuse'],say:'Je plante des graines depuis 200 ans, et rien ne pousse. Je soupçonne qu’on me les a changées. Demande au Pêcheur de Brume et à la Vieille Berceuse, dans le Marais : ils sont passés dans la Serre.',recu:{'Pêcheur de Brume':'Des graines ? J’en ai pêché dans le gué, la semaine dernière. Je les ai portées à la Vieille Berceuse : elle sait quoi faire de ce qui dort.','Vieille Berceuse':'Les graines du Jardinier ? Je leur chante des berceuses depuis des années, pour qu’elles se tiennent tranquilles. Elles dorment, voilà tout. Dis-lui de les réveiller.'},fin:'Elles dorment ! Voilà pourquoi rien ne pousse. Ce n’est pas que je plante mal : j’endors mes graines avec mes berceuses.',rew:{xpq:[30,'normale'],res:{cendre:3}}},
se2:{n:'Arrosage à la cendre',desc:'Apporte 4 cendres et 4 roseaux au Jardinier pour tenter d’arroser autrement.',need:0,kind:'don',req:6,apres:'se1',cost:{cendre:4,roseau:4},donneur:'Jardinier Sans-Pousse',say:'L’eau ne marche pas. Je n’ai jamais essayé la cendre et les roseaux. Autant tout tenter.',fin:'Un brin. Un seul, tout vert. La Duchesse sera… enfin, elle sera là, au moins.',rew:{xpq:[30,'normale'],set:{jardin_arrose:true}}}});

// ---- Phase C : rencontres des zones générées (ajoutées en fin de fichier : les indices existants ne bougent pas) ----
// Tailles de groupes variées (1 à 5 monstres) : un monstre seul est plus costaud, un grand groupe est composé de monstres plus fragiles.
(()=>{const R=DATA.rencontres,T=[],seen={};
R.filter(r=>r.biome=='foret'&&!r.n.includes('boss')&&r.base==null&&r.niv<=9).forEach(r=>r.m.forEach(m=>{if(!m.boss&&!m.form&&!seen[m.n]){seen[m.n]=1;T.push(m)}}));
const nv=(b,n,e,rs)=>{const c=JSON.parse(JSON.stringify(T.find(m=>m.n.includes(b))));c.n=n;c.e=e;c.elem='tenebres';c.rs=rs;T.push(c)};
nv('mouche','Le moustique d’ombre','🦟',{tenebres:25,foudre:-25,lumiere:10,vent:-10});nv('mouton','Le blaireau de brume','🦡',{tenebres:25,foudre:-25,lumiere:-10,vent:10});
const SL=[[10,3],[11,8],[9,10],[11,5],[10,7]],KH={1:1.7,2:1.25,3:1,4:.85,5:.75},KD={1:1.25,2:1.1,3:1,4:.95,5:.9},GP=[[9,5],[9,10]],SQ=[0,3,4,4,1,2,0,0,1,1,2,0];
DATA.zones.forEach((z,zi)=>{const m=DATA.cartes[z.id];z.tailles.forEach((n,g)=>{const f=1+.06*(z.niv-8),ms=[];
for(let i=0;i<n;i++){const t=JSON.parse(JSON.stringify(T[SQ[(zi*3+g*2+i)%SQ.length]%T.length]));t.x=SL[i][0];t.y=SL[i][1];t.hp=t.max=Math.round(t.hp*f*KH[n]);t.d=Math.round(t.d*f*KD[n]);ms.push(t)}
R.push({n:'Landes des Lucioles',biome:'foret',niv:z.niv,loot:{champi:2+(zi+g)%3,laine:1+(g%2)},m:ms,drops:JSON.parse(JSON.stringify(R[1].drops||[]))});
m.groups.push({x:GP[g][0],y:GP[g][1],renc:R.length-1})})})})();

// ---- Phase C : rencontres des zones 2 : composition choisie pour garder le bestiaire équilibré (résistance moyenne ~0 par élément) ----
(()=>{const R=DATA.rencontres,E=['vent','foudre','tenebres','lumiere'],S={},cnt={};let N=0;
const add=m=>{if(!m.rs)return;N++;E.forEach(e=>S[e]=(S[e]||0)+(m.rs[e]||0))};R.forEach(r=>r.m.forEach(add));
const hp0=n=>100+4.5*n,d0=n=>20+.7*n,KH={1:1.7,2:1.25,3:1,4:.85,5:.75},KD={1:1.25,2:1.1,3:1,4:.95,5:.9},SL=[[10,3],[11,8],[9,10],[11,5],[10,7]],GP=[[9,5],[9,10]],TL=[[1,3],[2,4],[3,5],[1,2],[4,2],[5,3],[2,1],[3,4],[1,5],[2,3]],NM={collines:'Friches du Sud',desert:'Désert Profond',mer:'Rivages Perdus'};
const orig=R.length,base={};
R.slice(0,orig).forEach(r=>{if(r.n.includes('boss')||r.type=='elite'||r.base!=null)return;r.m.forEach(m=>{if(m.boss||m.form||!m.rs)return;const k=r.biome+'|'+m.n;if(!base[k])base[k]={m,niv:r.niv,biome:r.biome}})});
DATA.zonesB.forEach((z,zi)=>{const P=Object.values(base).filter(b=>b.biome==z.pool&&b.niv<=z.niv+4),m=DATA.cartes[z.id],T=TL.slice(zi%10).concat(TL.slice(0,zi%10));
const sz=T[parseInt(z.id.replace(/\D/g,''))-1];
sz.forEach((n,g)=>{const ms=[],used={};for(let i=0;i<n;i++){let best=null;P.forEach((b,bi)=>{const w=Math.max(...E.map(e=>Math.abs((S[e]+(b.m.rs[e]||0))/(N+1))))+.04*(used[bi]||0)+((bi+zi+g+i)%P.length)*1e-4;if(!best||w<best.w)best={w,bi,b}});
used[best.bi]=(used[best.bi]||0)+1;const t=JSON.parse(JSON.stringify(best.b.m)),f=hp0(z.niv)/hp0(best.b.niv),fd=d0(z.niv)/d0(best.b.niv);t.x=SL[i][0];t.y=SL[i][1];
t.hp=t.max=Math.round(t.hp*f*KH[n]);t.d=Math.round(t.d*fd*KD[n]);ms.push(t);add(t)}
const loot=z.pool=='desert'?{sable:2+g,chaussette:1}:z.pool=='mer'?{gravat:2+g,eclat:1}:{laine:2+g,champi:1};
R.push({n:NM[z.pool],biome:z.pool,niv:z.niv,loot,m:ms,drops:JSON.parse(JSON.stringify((R.find(r=>r.biome==z.pool&&r.drops&&r.drops.length)||{}).drops||[]))});
m.groups.push({x:GP[g][0],y:GP[g][1],renc:R.length-1})})})})();

// ---- Objets de quête : un dessin propre à chaque quête (ico) et, pour f2 et c4, des objets répartis sur plusieurs cartes de la zone ----
{const C=DATA.cartes,pk=(m,x,y,q)=>(C[m].picks=C[m].picks||[]).push({x,y,quest:q});
pk('foret',6,11,'f2');pk('sentier',7,10,'f2');pk('paturage',12,2,'c4');pk('bergerie',7,11,'c4');
Object.entries({L3:'📦',L5:'📦',d1:'🧦',e1:'🌸',f2:'🍄',c2:'🔔',c4:'📄',n2:'🎵',t2:'🌼',r3:'⚓'}).forEach(([k,i])=>{DATA.quetes[k].ico=i})}

// ---- Résistance au Neutre : tous les monstres (hors formulaires) résistent un peu au Neutre (15 %, boss 10 %), pour que les sorts Neutres ne dominent plus ----
// Hors de la règle « somme nulle » des 4 éléments : le Neutre est un 5e profil fixe.
DATA.rencontres.forEach(r=>r.m.forEach(m=>{if(m.rs&&!m.form&&m.rs.neutre==null)m.rs.neutre=m.boss?10:15}));

// ---- Difficulté des groupes générés (Landes, Friches, Désert Profond, Rivages) : les petits groupes étaient trop faciles (mesuré au simulateur : 13 % de PV perdus pour 1 monstre, 37 % pour 2, contre ~55 % visés) ----
// Facteur de menace par taille de groupe, réparti en PV (k^1,3) et dégâts (k^0,7) pour éviter les coups trop forts ; les groupes de 4 et 5 restent inchangés.
{const K={1:1.65,2:1.25,3:1.06},G=['Landes des Lucioles','Friches du Sud','Désert Profond','Rivages Perdus'];
DATA.rencontres.forEach(r=>{const k=K[r.m.length];if(!k||!G.includes(r.n))return;const kh=Math.pow(k,1.3),kd=Math.pow(k,.7);
r.m.forEach(m=>{if(m.form||m.boss)return;m.hp=m.max=Math.max(1,Math.round(m.max*kh));m.d=Math.round(m.d*kd);
if(m.sort){m.sort=JSON.parse(JSON.stringify(m.sort));if(m.sort.dmg!=null)m.sort.dmg=Math.round(m.sort.dmg*kd);if(m.sort.heal)m.sort.heal=Math.round(m.sort.heal*kd)}
if(m.mort)m.mort={...m.mort,dmg:Math.round(m.mort.dmg*kd)}})})}

// ---- Quêtes de combat variées : n'importe quel groupe (non boss) des cartes indiquées compte, au lieu d'un groupe fixe ----
Object.entries({
f1:{maps:['foret','sentier','clairiere'],desc:'Repousse 2 groupes de monstres dans la forêt, sur le Sentier des Lucioles ou dans la Clairière.'},
c5:{maps:['bergerie','paturage'],desc:'Repousse un groupe de monstres dans la Bergerie abandonnée ou le Pâturage Brumeux, puis décide du sort des moutons enrôlés avec la Bergère Brume.',say:'On a enrôlé mes moutons de force : un tampon royal sur le dos, et hop, « soldats ». Des monstres les gardent, vers la bergerie et le pâturage. Libère-les.'},
m1:{maps:['hall','bureaux'],desc:'Repousse un groupe de monstres dans le Hall des Guichets ou les Bureaux des Tampons, puis décide du sort du courrier avec le Concierge Ficelle.',say:'Le courrier s’entasse devant les guichets, gardé par des monstres du Hall et des Bureaux. Dégage le passage : je déciderai ensuite avec toi de ce qu’on en fait.'},
o1:{maps:['mirage','puits'],desc:'Repousse un groupe de monstres au Mirage Changeant ou au Puits aux Mille Pieds, puis décide avec le Guide de ce qu’on fait des touristes.',say:'Des monstres squattent mon mirage et le puits d’à côté. Dégage-les : on décidera ensuite ce qu’on fait des touristes.'},
ro2:{maps:['roseliere','marais'],desc:'Repousse un groupe de monstres dans la Roselière ou le Marais de Cendres, puis décide du sort des somnambules avec Mirette.'},
d3:{maps:['camp','oasis'],desc:'Repousse 3 groupes de monstres au Camp des Grévistes ou à l’Oasis aux Chaussettes.'},
e2:{maps:['parvis','chemin'],desc:'Repousse un groupe de monstres éplorés sur le Parvis du Temple ou le Chemin du Soleil Couchant, puis décide avec le Gardien de ce qu’on fait des pèlerins.'},
sv2:{maps:['sv_cierges','chemin'],desc:'Repousse un groupe de monstres au Jardin des Cierges ou sur le Chemin du Soleil Couchant, puis décide avec le Prieur de ce qu’on fait des veilleurs épuisés.'}
}).forEach(([k,v])=>Object.assign(DATA.quetes[k],v));

// Sorts de classe : recharges réduites (3→2, 4→3) et rangs 4-5 (rang 4 : +dégâts/garde ; rang 5 : −1 recharge si possible, sinon +dégâts/garde)
for(const c of Object.values(DATA.classes))for(const s of c.sorts){if(s.cd>=3)s.cd--;
const b1=s.rg[0]||{},up=s.garde&&!s.dmg?{garde:1}:{dmg:(s.rg.find(b=>b.dmg)||{dmg:3}).dmg};
const cdNow=(s.cd||0)+s.rg.reduce((n,b)=>n+(b.cd||0),0);
s.rg.push({...up},cdNow>=2?{cd:-1}:{...up})}
