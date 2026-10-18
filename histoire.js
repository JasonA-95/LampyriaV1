DATA.scenes={
prologue:{once:true,declencheur:{quand:'entree',carte:'village'},si:{flag:'nouvellePartie'},etapes:[
{hero:'🏮',act:'Tu portes une pile de lanternes presque plus haute que toi.'},
{qui:'Maître Lampiste',at:'pnj:Maître Lampiste',txt:'Livraison numéro 47 ! Ne trébuche pas, cette fois.'},
{hero:'😬',act:'Tu hoches la tête avec assurance. Tu trébuches.'},
{hero:'😱',act:'Les lanternes s’envolent. Une d’elles ne retombe pas toute seule.'},
{qui:'Gourmande',at:'hero',txt:'Aïe ! Mais où suis-je ? Et pourquoi ça sent le champignon ?'},
{choix:[
{t:'Rester figé',set:{prologue_fige:true}},
{t:'Lever les mains, désolé',set:{prologue_desole:true}}]},
{qui:'Gourmande',at:'hero',si:{flag:'prologue_fige'},txt:'Tu ne dis rien ? Parfait. Un livreur muet, c’est reposant.'},
{qui:'Gourmande',at:'hero',si:{flag:'prologue_desole'},txt:'Pas de gestes d’excuses sur un estomac vide.'},
{qui:'Gourmande',at:'hero',txt:'Bon. Tu es mon livreur, maintenant. Tu as quelque chose à manger ?'},
{qui:'Maître Lampiste',at:'pnj:Maître Lampiste',txt:'Une Lueur ! Dans ta lanterne ! Viens me voir quand tu auras repris tes esprits.'},
{set:{nouvellePartie:false}}
]},
chambellan_avant:{once:true,declencheur:{quand:'avantCombat',renc:3},etapes:[
{qui:'Chambellan Poussière',at:'groupe',txt:'Halte ! Avez-vous rempli le formulaire B-12 pour traverser ce couloir ?'},
{qui:'Gourmande',at:'hero',txt:'On dirait un fantôme avec un classeur.'},
{qui:'Chambellan Poussière',at:'groupe',txt:'Gardien de l’ordre et des tampons, voilà ce que je suis. Sans formulaire, pas de passage.'},
{hero:'🙄',act:'Tu regardes autour de toi. Un papier flotte dans son dos.'},
{qui:'Chambellan Poussière',at:'groupe',txt:'Le règlement est le règlement. En garde !'}
]},
lettre_roi:{once:true,declencheur:{quand:'quete',id:'q3',etat:'terminee'},etapes:[
{apparait:{id:'pigeon',e:'🕊️',x:12,y:1}},
{deplace:{id:'pigeon',x:6,y:7}},
{qui:'Pipelette',at:'pnj:Pipelette',txt:'Une lettre ! Je la lis : « Aux habitants du Village des Lanternes. Par décret, toute Lueur doit m’être remise sans délai. »'},
{qui:'Pipelette',at:'pnj:Pipelette',txt:'« Je tiens à préciser que l’appellation « Roi Éteint » est inexacte : je suis le Gardien. »'},
{qui:'Pipelette',at:'pnj:Pipelette',txt:'« Veuillez agréer mes salutations distinguées et rigoureusement non négociables. P.-S. : Merci de ne pas rire. »'},
{part:'pigeon'},
{qui:'Gourmande',at:'hero',txt:'Il écrit comme un formulaire.'},
{qui:'Peureuse',at:'hero',txt:'Il a dit « sans délai ». Je n’aime pas quand il y a un délai qui n’en est pas un.'},
{set:{lettre_vue:true}}
]},
manoir_entree:{once:true,declencheur:{quand:'entree',carte:'manoir'},etapes:[
{qui:'Peureuse',at:'hero',txt:'Il y a des papiers qui flottent. Je n’aime pas quand ça flotte.'}
]},
chambellan_apres:{once:true,declencheur:{quand:'apresCombat',renc:3,issue:'win'},etapes:[
{qui:'Gourmande',at:'hero',txt:'On l’a battu avec ses propres formulaires. Je suis fière et affamée.'},
{qui:'Peureuse',at:'hero',txt:'Il avait un classeur de 3000 pages. Il y avait une page sur nous, avec une carte. Vers le marais.'},
{set:{page_lueurs:true}}
]},
ermite_livraison:{declencheur:{quand:'livraison',id:'L2'},etapes:[
{qui:'Ermite Champignac',at:'pnj:Ermite Champignac',txt:'Des lanternes ? Enfin quelqu’un qui comprend l’obscurité.'},
{qui:'Gourmande',at:'hero',txt:'Il a refusé le pourboire. Je note un risque.'}
]}
};
// ---- Désert des Chaussettes Perdues ----
Object.assign(DATA.scenes,{
desert_entree:{once:true,declencheur:{quand:'entree',carte:'dunes'},etapes:[
{qui:'Gourmande',at:'hero',txt:'Du sable. Partout. Ça se mange ? Non. Je note.'},
{qui:'Peureuse',at:'hero',txt:'Là-bas, quelque chose bouge. Une chaussette, peut-être. Ou pire.'}]},
oasis_entree:{once:true,declencheur:{quand:'entree',carte:'oasis'},etapes:[
{qui:'Gourmande',at:'hero',txt:'Un trou rempli de chaussettes. Ça doit être le Paradis.'}]},
camp_entree:{once:true,declencheur:{quand:'entree',carte:'camp'},etapes:[
{qui:'Général Gréviste',at:'pnj:Général Gréviste',txt:'Camarades ! Nous réclamons des horaires décents et des chaussettes assorties !'},
{qui:'Délégué des Chaussettes',at:'pnj:Délégué des Chaussettes',txt:'Il a raison. Ça fait 300 ans qu\'on garde la même porte.'}]},
farceuse_trouvee:{once:true,declencheur:{quand:'quete',id:'d2',etat:'terminee'},etapes:[
{qui:'Farceuse',at:'hero',txt:'Hihi ! Tu m\'as trouvée ! Enfin, j\'ai laissé trois chaussettes pour que tu me trouves.'},
{qui:'Gourmande',at:'hero',txt:'Elle est adorable. Et dangereuse.'}]},
general_convaincu:{once:true,declencheur:{quand:'action',id:'negocier'},etapes:[
{qui:'Général Gréviste',at:'pnj:Général Gréviste',txt:'Des chaussettes assorties… Vous nous avez compris. Reprise du travail, camarades.'},
{qui:'Délégué des Chaussettes',at:'pnj:Délégué des Chaussettes',txt:'Je vais devoir apprendre à garder la porte debout.'},
{set:{general_convaincu:true}}]},
general_battu:{once:true,declencheur:{quand:'apresCombat',renc:10,issue:'win'},etapes:[
{qui:'Général Gréviste',at:'hero',txt:'La grève… est… suspendue.'},
{qui:'Gourmande',at:'hero',txt:'On aurait pu discuter. Mais j\'avoue, c\'était drôle.'},
{set:{general_battu:true}}]},
colerique_libre:{once:true,declencheur:{quand:'action',id:'colerique'},etapes:[
{qui:'Colérique',at:'pnj:La lanterne-prison',txt:'ENFIN ! Qui m\'a enfermée dans une lanterne ? JE VAIS LUI… Ah, c\'est toi. Je vais te… remercier. Brutalement.'},
{qui:'Gourmande',at:'hero',txt:'Elle est adorable.'},
{set:{colerique_libre:true}}]}});
// La Gourmande s'interroge sur le premier colis reçu (une seule fois par partie).
['L1','L2','L3','L4','L5'].forEach(id=>{DATA.scenes['colis_'+id]={declencheur:{quand:'quete',id,etat:'acceptee'},si:{pasFlag:'colis_dit'},etapes:[
{qui:'Gourmande',at:'hero',txt:'C’est chaud ? Ça se mange ?'},{set:{colis_dit:true}}]}});
// ---- Acte 2 : fin (Marais, Duchesse, Bouffon, passé du Roi) ----
Object.assign(DATA.scenes,{
marais_entree:{once:true,declencheur:{quand:'entree',carte:'marais'},etapes:[
{qui:'Gourmande',at:'hero',txt:'Ça sent la cendre mouillée. Je déconseille de goûter.'},
{qui:'Peureuse',at:'hero',txt:'Les roseaux murmurent. Je n’aime pas quand les roseaux ont des opinions.'}]},
tetue_assise:{once:true,declencheur:{quand:'quete',id:'q4',etat:'terminee'},etapes:[
{qui:'Têtue',at:'hero',txt:'Un banc. Enfin quelqu’un qui comprend qu’on ne bouge pas sans raison. Je viens avec toi, mais je m’assois d’abord.'},
{qui:'Gourmande',at:'hero',txt:'Elle a fait trois heures de négociation pour un banc. Je l’adore déjà.'}]},
reveuse_oreiller:{once:true,declencheur:{quand:'quete',id:'q5',etat:'terminee'},etapes:[
{qui:'Rêveuse',at:'hero',txt:'Un oreiller de roseaux… J’ai rêvé de toi, tu sais. Tu portais des lanternes et tu tombais. Je crois que c’était un souvenir.'},
{qui:'Rêveuse',at:'hero',txt:'J’ai aussi rêvé d’un homme en armure dorée, devant le soleil. Il avait l’air… fatigué. Il n’était pas mort, dans mon rêve.'},
{set:{reve_gardien:true}}]},
duchesse_avant:{once:true,declencheur:{quand:'avantCombat',renc:6},etapes:[
{qui:'Duchesse des Cendres',at:'groupe',txt:'Un moment. On n’entre pas dans ma serre avec des bottes pleines de boue vivante.'},
{qui:'Têtue',at:'hero',txt:'Elle a de la prestance. Et un mauvais caractère. On s’entendrait.'},
{qui:'Duchesse des Cendres',at:'groupe',txt:'J’étais duchesse d’un jardin. Le Roi m’a promis qu’il refleurirait. Il m’a menti. Alors tout deviendra cendre.'},
{qui:'Duchesse des Cendres',at:'groupe',txt:'Et vous allez m’aider à commencer.'}]},
duchesse_apres:{once:true,declencheur:{quand:'apresCombat',renc:6,issue:'win'},etapes:[
{qui:'Duchesse des Cendres',at:'hero',txt:'Ah. Les cendres savent aussi pardonner. Tenez : mon sceau. Il vous ouvrira ses couloirs… Dites-lui que mon jardin ne repousse pas.'},
{qui:'Gourmande',at:'hero',txt:'C’était presque touchant. Presque. Elle voulait nous brûler.'},
{set:{duchesse_battue:true}}]}});
const BOUFFON=[
{apparait:{id:'bouffon',e:'🤡',x:11,y:5}},
{qui:'Bouffon Sans Rire',at:'hero',txt:'Bravo. Applaudissements. Je ne rirai pas, évidemment : c’est ma marque.'},
{qui:'Bouffon Sans Rire',at:'hero',txt:'Je suis le Bouffon du Roi, et il me prie de vous dire qu’il vous attend. Un duel ? Oui, un duel. Je le reporte : j’ai oublié ma massue.'},
{qui:'Colérique',at:'hero',si:{flag:'colerique_libre'},txt:'ATTENDS QUE JE TE… Il est parti. Il est toujours parti, celui-là.'},
{part:'bouffon'},
{qui:'Gourmande',at:'hero',txt:'Il a laissé un papier. Un journal, on dirait. Du Roi.'},
{qui:'Rêveuse',at:'hero',si:{flag:'reve_gardien'},txt:'C’est l’homme de mon rêve. Écoute…'},
{qui:'Gourmande',at:'hero',txt:'« Le Gardien du Soleil ne dort jamais. Si le Soleil tombe, c’est de ma faute. Je reste. » Il a écrit ça avant de mourir.'},
{qui:'Peureuse',at:'hero',txt:'Il n’a pas trahi le soleil. Il est mort en essayant de le tenir.'},
{qui:'Gourmande',at:'hero',txt:'Ça explique pourquoi il est si vexé qu’on l’appelle « Éteint ».'},
{set:{passe_roi:true,acte2_fini:true}}];
DATA.scenes.general_convaincu.etapes.pop();DATA.scenes.general_convaincu.etapes.push(...BOUFFON);
DATA.scenes.general_battu.etapes.pop();DATA.scenes.general_battu.etapes.push(...BOUFFON,{set:{general_battu:true}});
DATA.scenes.general_convaincu.etapes.push({set:{general_convaincu:true}});
// ---- Acte 3 : Chemin du Soleil, Temple, Citadelle, Roi Éteint ----
Object.assign(DATA.scenes,{
chemin_entree:{once:true,declencheur:{quand:'entree',carte:'chemin'},etapes:[
{qui:'Gourmande',at:'hero',txt:'Un chemin qui monte tout droit vers le dernier coucher de soleil. Je n’ai pas faim. C’est inquiétant.'},
{qui:'Peureuse',at:'hero',txt:'Les statues nous regardent. Je précise que j’ai déjà regardé ailleurs.'}]},
parvis_entree:{once:true,declencheur:{quand:'entree',carte:'parvis'},etapes:[
{qui:'Rêveuse',at:'hero',si:{flag:'reve_gardien'},txt:'Je connais cet escalier. Dans mon rêve, un homme en armure le montait chaque soir pour regarder le soleil.'}]},
temple_entree:{once:true,declencheur:{quand:'entree',carte:'temple'},etapes:[
{qui:'Têtue',at:'hero',txt:'Je ne bouge pas. Ce temple est trop beau pour qu’on le traverse en courant.'},
{qui:'Mélancolique',at:'hero',txt:'…Vous êtes venus. Je l’avais senti. Il y a quelqu’un dans une lanterne, au fond. Quelqu’un qui connaît bien le Roi.'},
{qui:'Gourmande',at:'hero',txt:'Elle parle comme une chanson triste. Je l’aime déjà.'}]},
eclipse_avant:{once:true,declencheur:{quand:'avantCombat',renc:13},etapes:[
{qui:'Éclipse',at:'groupe',txt:'Le soleil ne reviendra pas. Je suis son ombre : je reste pour le prouver.'},
{qui:'Peureuse',at:'hero',txt:'Il y a un voile noir autour d’elle. Quelque chose le tient ensemble.'},
{hero:'🤔',act:'Tu observes le voile. Un coup bien placé, ou une bonne poussée, devrait suffire.'}]},
eclipse_apres:{once:true,declencheur:{quand:'apresCombat',renc:13,issue:'win'},etapes:[
{qui:'Éclipse',at:'hero',txt:'Je me souviens… il venait ici chaque soir. Il regardait. Il disait : « Si je cligne des yeux, il tombe. »'},
{qui:'Gourmande',at:'hero',txt:'Il ne devait pas dormir beaucoup. Ça explique l’humeur.'},
{set:{eclipse_battue:true}}]},
melancolique_libre:{once:true,declencheur:{quand:'action',id:'melancolique'},etapes:[
{qui:'Mélancolique',at:'pnj:La lanterne d’ombre',txt:'Merci. Je suis la plus vieille d’entre nous, et la plus triste. J’ai connu le Gardien quand il n’était pas encore un roi.'},
{qui:'Mélancolique',at:'hero',txt:'Il tenait le soleil à bout de bras. Quand il est tombé, il a lâché prise pour nous sauver. Il est mort de ne pas avoir pu tenir.'},
{qui:'Mélancolique',at:'hero',txt:'Il est revenu mort-vivant parce qu’il s’est promis de le rallumer lui-même. Il n’a jamais accepté d’avoir échoué.'},
{qui:'Colérique',at:'hero',si:{flag:'colerique_libre'},txt:'Un crétin têtu et triste. On va lui parler. Avec le poing.'},
{qui:'Gourmande',at:'hero',txt:'Ou avec une tarte. Choix à discuter.'},
{set:{melancolique_libre:true}}]},
cour_entree:{once:true,declencheur:{quand:'entree',carte:'cour'},etapes:[
{qui:'Peureuse',at:'hero',txt:'La Citadelle Brisée. Elle est brisée, d’accord, mais pas de façon rassurante.'},
{qui:'Gourmande',at:'hero',txt:'Il y a des gardes fantômes. Ils ont un air d’avoir oublié pourquoi.'}]},
medailles_fin:{once:true,declencheur:{quand:'quete',id:'e3',etat:'terminee'},etapes:[
{qui:'Capitaine fantôme',at:'pnj:Capitaine fantôme',txt:'Garde royale, garde-à-vous ! Souvenez-vous : nous protégeons le Roi, pas ses humeurs.'},
{qui:'Gourmande',at:'hero',txt:'Il a salué sa propre médaille. C’est le plus beau moment de ma journée.'}]},
salle_entree:{once:true,declencheur:{quand:'entree',carte:'salle'},etapes:[
{qui:'Bouffon Sans Rire',at:'pnj:Bouffon Sans Rire',txt:'Ah, vous voilà. Je n’ai rien préparé, bien sûr. Mes amis non plus.'}]},
lieutenants_avant:{once:true,declencheur:{quand:'avantCombat',renc:15},etapes:[
{qui:'Chambellan Poussière',at:'groupe',txt:'Formulaire C-14, « Retour à l’antagonisme ». Veuillez le remplir en trois exemplaires avant de mourir.'},
{qui:'Duchesse des Cendres',at:'groupe',txt:'Je renais de mes cendres. Ça m’a pris du temps : les cendres, ça ne se range pas.'},
{qui:'Général Gréviste',at:'groupe',txt:'Je reprends la grève… contre vous. Les revendications sont simples : vous partez.'},
{qui:'Gourmande',at:'hero',txt:'Un comité d’accueil. Quelqu’un a de quoi manger ?'}]},
lieutenants_apres:{once:true,declencheur:{quand:'apresCombat',renc:15,issue:'win'},etapes:[
{qui:'Chambellan Poussière',at:'hero',txt:'Rejeté. Définitivement. Je vous laisse passer, par manque de tampons.'},
{qui:'Duchesse des Cendres',at:'hero',txt:'Dites au Roi que mon jardin ne repousse pas… mais que je l’ai replanté quand même.'},
{qui:'Général Gréviste',at:'hero',txt:'Ça nous a fait du bien de se battre. On devrait se syndiquer.'},
{set:{lieutenants_battus:true}}]},
bouffon_avant:{once:true,declencheur:{quand:'avantCombat',renc:16},etapes:[
{qui:'Bouffon Sans Rire',at:'groupe',txt:'Duel. Enfin. Je n’ai jamais gagné contre personne, c’est ma marque de fabrique.'},
{qui:'Bouffon Sans Rire',at:'groupe',txt:'Le Roi m’a sauvé quand tout le monde riait de moi. Alors moi, je ne ris pas. Je me bats.'}]},
bouffon_apres:{once:true,declencheur:{quand:'apresCombat',renc:16,issue:'win'},etapes:[
{qui:'Bouffon Sans Rire',at:'hero',txt:'Vous… vous avez perdu votre équilibre au dernier coup, pour me laisser gagner une phrase. C’était… (il hoquette) …drôle.'},
{qui:'Bouffon Sans Rire',at:'hero',txt:'Hihi. Je ris. C’est horrible. Allez le voir. Il est seul depuis trop longtemps.'},
{set:{bouffon_vaincu:true}}]},
trone_entree:{once:true,declencheur:{quand:'entree',carte:'trone'},etapes:[
{qui:'Le Roi Éteint',at:'hero',txt:'Vous arrivez en retard. Le soleil ne s’est pas allumé tout seul, je dois le préciser. Moi non plus.'},
{qui:'Mélancolique',at:'hero',si:{flag:'melancolique_libre'},txt:'Majesté… tu as l’air de quelqu’un qui n’a pas dormi depuis trois siècles.'},
{qui:'Le Roi Éteint',at:'hero',si:{flag:'melancolique_libre'},txt:'Mélancolique ! Tu es… libre. C’est contraire à mes plans. Et très émouvant. Ne le répète à personne.'}]},
roi_avant:{once:true,declencheur:{quand:'avantCombat',renc:17},etapes:[
{qui:'Le Roi Éteint',at:'groupe',txt:'Je suis le Gardien. Le Gardien du Soleil. Il faut m’appeler Gardien. Pas « Roi Éteint ».'},
{qui:'Farceuse',at:'hero',txt:'Roi Éteint ! Roi Éteint ! Roi Éteint !'},
{qui:'Le Roi Éteint',at:'groupe',txt:'Je vous l’interdis ! Ma… vexation s’élève comme une muraille !'},
{qui:'Gourmande',at:'hero',txt:'Ça flotte autour de lui, on dirait de la vexation. Brise-la ou chasse-la du terrain : il sera à nous.'},
{qui:'Le Roi Éteint',at:'groupe',txt:'En garde, livreur ! Il est temps que quelqu’un livre enfin ce soleil.'}]},
roi_apres:{once:true,declencheur:{quand:'apresCombat',renc:17,issue:'win'},etapes:[
{qui:'Le Roi Éteint',at:'hero',txt:'Je… je n’ai pas réussi. Je n’ai jamais réussi. Le soleil est tombé, et je suis resté.'},
{qui:'Mélancolique',at:'hero',si:{flag:'melancolique_libre'},txt:'Tu l’as tenu aussi longtemps que possible. C’est ça, un Gardien.'},
{qui:'Le Roi Éteint',at:'hero',txt:'Livreur. Les Lueurs sont dans ta lanterne. Dis-moi : que décides-tu ?'},
{choix:[
{t:'Rallumer le soleil (les Lueurs se sacrifient)',set:{fin_A:true}},
{t:'Libérer les Lueurs (le soleil reviendra lentement)',set:{fin_B:true}}]},
{qui:'Gourmande',at:'hero',si:{flag:'fin_A'},txt:'Je m’en vais en goûtant tout. La première lumière aura goût de tarte.'},
{qui:'Le Roi Éteint',at:'hero',si:{flag:'fin_A'},txt:'Le soleil… Il brille. Je suis éteint, mais il brille. Merci, livreur.'},
{qui:'Gourmande',at:'hero',si:{flag:'fin_B'},txt:'On ne se sépare pas. On a trop mangé ensemble pour ça.'},
{qui:'Le Roi Éteint',at:'hero',si:{flag:'fin_B'},txt:'Une aube lente, alors. Je veillerai. Je suis enfin autorisé à dormir.'},
{hero:'🌅',act:'Le soleil revient, à sa manière. Ta lanterne brille encore un peu.'},
{qui:'Maître Lampiste',at:'hero',txt:'Livraison numéro 48 : réussie. Je n’y croyais plus.'},
{set:{jeu_termine:true}}]}});
