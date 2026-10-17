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
