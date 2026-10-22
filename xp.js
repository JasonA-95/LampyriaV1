// XP : courbe de progression de 1 à 60 (solo). Données et petites fonctions pures, sans DOM.
// Règle de conception : un combat standard de niveau égal donne c(n) XP ; la moitié de l'XP d'un niveau vient
// des combats, l'autre moitié des quêtes. Rythme visé : acte 1 ≈ 130 combats (6 à 7 h), acte 2 ≈ 215, acte 3 ≈ 230.
// Pour changer le rythme : modifier les valeurs de XP.suiv (XP pour passer du niveau n au niveau n+1).
const XP={
max:60,
// suiv[n-1] = XP nécessaire pour passer du niveau n au niveau n+1 (n = 1 à 59)
suiv:[70,105,145,190,245,305,370,445,530,610,       // niveaux 1 à 10
690,760,850,930,1020,1110,1210,1310,1420,1530,      // 11 à 20  (fin de l'acte 1 au niveau 20)
1590,1660,1730,1790,1860,1930,2000,2050,2150,2200, // 21 à 30
2250,2350,2400,2500,2550,2600,2700,2750,2850,2900, // 31 à 40  (fin de l'acte 2 au niveau 40)
3000,3050,3150,3250,3300,3400,3450,3550,3650,3750, // 41 à 50
3800,3900,4000,4050,4150,4250,4350,4450,4500],      // 51 à 59  (fin de l'acte 3 au niveau 60)
// Anti-farm : multiplicateur selon l'écart d = niveau du héros - niveau de la rencontre.
// Moins de 4 niveaux d'avance = plein tarif ; au-delà l'XP chute vite (plancher 10 %).
ecart:[[-4,1.2],[-1,1.1],[1,1],[2,.6],[3,.35],[4,.2],[5,.1],[99,.05]],   // [écart maximal inclus, multiplicateur]
entrainement:.4,        // les combats d'entraînement (menu) donnent 40 % de l'XP
gain:3,               // réglage global du rythme : multiplie l'XP des combats et des quêtes (anti-farm plus strict, donc moins de grind)
// Valeurs de référence des gains (m = coefficient de la rencontre, k = coefficient de la quête)
m:{normal:1,elite:1.3,mini:3,boss:5},
k:{courte:3,normale:5,longue:8,lueur:12},
// Difficulté des monstres : hp/d = multiplicateurs de PV et de dégâts (monstres ordinaires), bossHp/bossD (boss), pmMelee = PM en plus pour les monstres de mêlée
diff:{hp:1,d:1.05,bossHp:1,bossD:1,pmMelee:0},
// ----- fonctions -----
next(n){return n>=XP.max?Infinity:XP.suiv[Math.max(1,n)-1]},
cmb(n){return 12+3*Math.max(1,n)},                                  // XP d'un combat standard de niveau n
mult(d){for(const [e,v] of XP.ecart)if(d<=e)return v;return .1},
// XP d'une rencontre : r = {niv, m} (m facultatif, 1 par défaut) ; heroNiv = niveau actuel du héros
rencontre(r,heroNiv,entrainement){const base=XP.gain*XP.cmb(r.niv)*(r.m||1)*XP.mult(heroNiv-r.niv)*(entrainement?XP.entrainement:1);return Math.max(1,Math.round(base))},
// XP d'une quête : niv = niveau de la zone, k = coefficient (XP.k.*)
quete(niv,k){return Math.round(XP.gain*XP.cmb(niv)*k)},
// Ajoute de l'XP à la sauvegarde s (s.niv, s.xp) ; renvoie le nombre de niveaux gagnés. Plafonne au niveau max.
add(s,gain){let up=0;if(s.niv>=XP.max){s.niv=XP.max;s.xp=0;return 0}
s.xp+=Math.max(0,Math.round(gain));
while(s.niv<XP.max&&s.xp>=XP.next(s.niv)){s.xp-=XP.next(s.niv);s.niv++;up++}
if(s.niv>=XP.max)s.xp=0;return up},
// Anciennes sauvegardes (seuil 40 × niveau) : conversion proportionnelle, une seule fois (marque s.xpv=2)
migrer(s){if(s.xpv===2)return;s.xpv=2;s.niv=Math.min(Math.max(1,Math.floor(s.niv)||1),XP.max);
if(s.niv>=XP.max){s.xp=0;return}const old=40*s.niv,part=Math.min(Math.max(0,s.xp||0)/old,.999);
s.xp=Math.floor(part*XP.next(s.niv))},
// Pour l'interface : progression vers le niveau suivant, de 0 à 1
part(s){return s.niv>=XP.max?1:Math.min(1,s.xp/XP.next(s.niv))}
};
if(typeof module!='undefined')module.exports=XP;