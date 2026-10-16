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
]}
};