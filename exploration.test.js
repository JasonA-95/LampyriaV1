const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = file => fs.readFileSync(path.join(__dirname, file), 'utf8');

// Charge exploration.js avec l'état du jeu (même faux DOM que les autres tests).
function loadExploration(save) {
  const context = vm.createContext({
    document: (() => {
      const el = () => new Proxy(function () {}, { get: (_t, k) => (k === 'style' ? {} : k === 'classList' ? { add() {}, remove() {}, toggle() {} } : k === 'children' ? [] : el()), apply: () => el(), set: () => true });
      return { createElement: el, head: el(), body: el(), getElementById: el, querySelector: el, querySelectorAll: () => [] };
    })(),
    TextEncoder, btoa, atob, W: 0, startScreenTransition() {},
    localStorage: { getItem: () => JSON.stringify(save), setItem: () => {} }
  });
  for (const f of ['donnees.js', 'histoire.js', 'xp.js', 'donjons.js', 'etat.js', 'exploration.js', 'scenes.js']) vm.runInContext(source(f), context, { filename: f });
  return context;
}
const run = (ctx, expr) => vm.runInContext(expr, ctx);
const val = (ctx, expr) => JSON.parse(run(ctx, 'JSON.stringify(' + expr + ')'));

const baseSave = { niv: 3, xp: 0, res: {}, inv: [], renc: 0, hist: { vus: ['prologue'], flags: {} }, q: {} };

test('quête acceptée : les monstres vaincus et les récoltes en cours ne réapparaissent pas', () => {
  const ctx = loadExploration(baseSave);
  run(ctx, "EX.enter('village',3,6,true)");
  assert.ok(run(ctx, 'EX.groups.length') >= 1);
  run(ctx, 'EX.groups[0].dead=true');
  run(ctx, 'EX.nodes[0].until=Date.now()+180000');
  run(ctx, "sv.q.q1={s:1,n:0,got:[]}");
  run(ctx, "EX.marks('village')");
  assert.equal(run(ctx, 'EX.groups[0].dead'), true, 'le groupe vaincu doit rester vaincu');
  assert.equal(run(ctx, 'EX.nodes[0].until>Date.now()'), true, 'le nœud récolté doit rester en repousse');
});

test('les repères de quête apparaissent à l’acceptation et disparaissent une fois ramassés ou la quête terminée', () => {
  const ctx = loadExploration(baseSave);
  run(ctx, "EX.enter('quartier',11,6,true)");
  assert.equal(run(ctx, 'EX.nodes.filter(n=>n.pick).length'), 0);
  run(ctx, "sv.q.q1={s:1,n:0,got:[]}");
  run(ctx, "EX.marks('quartier')");
  assert.equal(run(ctx, 'EX.nodes.filter(n=>n.pick).length'), 1);
  run(ctx, "sv.q.q1={s:1,n:1,got:['quartier0']}");
  run(ctx, "EX.marks('quartier')");
  assert.equal(run(ctx, 'EX.nodes.filter(n=>n.pick).length'), 0, 'objet déjà ramassé : plus de repère');
  run(ctx, "sv.q.q1={s:2,n:3,got:[]}");
  run(ctx, "EX.marks('quartier')");
  assert.equal(run(ctx, 'EX.nodes.filter(n=>n.pick).length'), 0, 'quête terminée : plus de repère');
});

test('EX.enter pose toujours les mêmes repères de quête qu’avant (cachettes de la forêt)', () => {
  const ctx = loadExploration({ ...baseSave, renc: 1, q: { q3: { s: 1, n: 1, got: ['foret0'] } } });
  run(ctx, "EX.enter('foret',1,6,true)");
  const hides = val(ctx, 'EX.groups.filter(g=>g.hide).map(g=>g.id)');
  assert.deepEqual(hides.sort(), ['foret1', 'foret2']);
  assert.equal(run(ctx, 'EX.groups.filter(g=>!g.hide).length'), 2);
  assert.equal(run(ctx, 'EX.pend'), null);
});

test('PNJ : « ! » si une quête est disponible, rien une fois prise, « ? » quand les conditions sont remplies', () => {
  const ctx = loadExploration(baseSave);
  const lamp = "DATA.cartes.village.npcs.find(n=>n.n=='Maître Lampiste')";
  assert.equal(run(ctx, 'EX.npcMark(' + lamp + ')'), '!');
  run(ctx, "sv.q.q1={s:1,n:0,got:[]}");
  assert.ok(['', '!'].includes(run(ctx, 'EX.npcMark(' + lamp + ')')));
  run(ctx, "['q2','q3','L2','L5'].forEach(id=>{sv.q[id]={s:2,n:9,got:[]}});sv.q.q1={s:1,n:0,got:[]}");
  assert.equal(run(ctx, 'EX.npcMark(' + lamp + ')'), '', 'quête prise mais incomplète : aucun repère');
  run(ctx, "sv.q.q1.n=DATA.quetes.q1.need;sv.res.braise=99;sv.res.champi=99;sv.res.laine=99");
  assert.equal(run(ctx, 'EX.npcMark(' + lamp + ')'), '?');
  assert.equal(run(ctx, "EX.npcMark({quests:[]})"), '');
});

test('défi de combat : un défi est manqué seulement si la quête est active, a une limite et que la victoire la dépasse', () => {
  const ctx = loadExploration({ ...baseSave, niv: 45, renc: 17, q: { t1: { s: 1, n: 0, got: [] }, m1: { s: 1, n: 0, got: [] } } });
  assert.equal(val(ctx, 'DATA.quetes.t1.defi.tours'), 6);
  assert.equal(val(ctx, 'EX.defiMiss("t1",5)'), false, 'victoire en 5 tours : défi tenu');
  assert.equal(val(ctx, 'EX.defiMiss("t1",6)'), false, 'victoire en 6 tours : défi tenu (limite incluse)');
  assert.equal(val(ctx, 'EX.defiMiss("t1",7)'), true, 'victoire en 7 tours : défi manqué');
  assert.equal(val(ctx, 'EX.defiMiss("t1")'), false, 'nombre de tours inconnu : jamais de blocage');
  assert.equal(val(ctx, 'EX.defiMiss("m1",40)'), false, 'quête sans défi : comportement inchangé');
  const sans = loadExploration(baseSave);
  assert.equal(val(sans, 'EX.defiMiss("t1",40)'), false, 'quête non acceptée : pas de défi');
});

test('défi de combat : EX.defi retrouve la quête à défi liée à la rencontre du Cloître, seulement si elle est active', () => {
  const idx = 'DATA.rencontres.findIndex(r=>r.n=="Cloître des Pèlerins")';
  const actif = loadExploration({ ...baseSave, niv: 45, renc: 17, q: { t1: { s: 1, n: 0, got: [] } } });
  assert.equal(val(actif, 'EX.defi(' + idx + ').defi.tours'), 6);
  assert.equal(val(loadExploration(baseSave), 'EX.defi(' + idx + ')'), null);
});

test('déplacements : un appui pendant la marche l’annule ; un seul appui lance la marche ; une case proche d’une sortie vise la sortie sauf si le héros en est tout près', () => {
  const ctx = loadExploration({ ...baseSave, renc: 99 });   // sorties ouvertes
  run(ctx, "var DIRS=[[1,0],[-1,0],[0,1],[0,-1]];var cv={getBoundingClientRect:()=>({left:0,top:0})},ox=0,oy=0,tw=2,th=2;EX.draw=()=>{};");
  run(ctx, "EX.enter('village',6,6,true)");
  run(ctx, 'EX.walking=true;EX.tok=5;EX.click({clientX:0,clientY:0})');
  assert.equal(run(ctx, 'EX.walking'), false);
  assert.equal(run(ctx, 'EX.tok'), 6);
  // entrée de donjon (sortie ponctuelle) : l'assistance de case voisine reste active
  run(ctx, "globalThis.setTimeout=()=>0;cfg.test=true;EX.enter('clairiere',6,6,true)");   // cfg.test : ignore la relique exigée
  const ex = val(ctx, "DATA.cartes.clairiere.exits.find(e=>e.don)");
  const libres = val(ctx, `(()=>{const e=DATA.cartes.clairiere.exits.find(e=>e.don),R=DATA.cartes.clairiere.rocks,o=[];for(const [a,b] of [[-1,0],[0,1],[-1,1],[0,-1],[-2,0],[-1,-1],[0,2],[0,-2],[1,0],[1,1]]){const x=e.x+a,y=e.y+b;if(DATA.exin(x,y)&&!R.some(r=>r[0]==x&&r[1]==y)&&!exEnt(x,y))o.push([x,y])}return o})()`);
  assert.ok(libres.length >= 2, 'cases libres près de l\'entrée');
  const tap = ([x, y]) => `EX.click({clientX:${x - y},clientY:${x + y}})`;
  run(ctx, `globalThis.G=null;EX.go=(p,e)=>{G={p,e}};EX.pend=null;EX.x=6;EX.y=6;${tap(libres[0])}`);
  assert.equal(run(ctx, 'G&&G.e&&G.e.t'), 'e', 'une case voisine de l\'entrée la vise');
  assert.equal(run(ctx, 'G.p[G.p.length-1][0]'), ex.x);
  run(ctx, `G=null;EX.pend=null;EX.x=${libres[0][0]};EX.y=${libres[0][1]};${tap(libres[1])}`);
  assert.ok(run(ctx, 'G&&!G.e'), 'près de l\'entrée, une case voisine reste une simple case');
});

test('bords entiers (style Dofus Touch) : toute case du bord d\'une sortie la déclenche, arrivée sur le bord opposé à la même position', () => {
  const ctx = loadExploration({ ...baseSave, renc: 99 });
  run(ctx, "EX.enter('village',6,6,true)");
  const d = 'DATA.cartes.village';
  const cote = val(ctx, `${d}.exits.find(e=>e.to=='foret').d`);
  assert.ok(['N', 'E', 'S', 'W'].includes(cote));
  const cells = val(ctx, `DATA.excells.filter(([x,y])=>{const s=DATA.exside(x,y);return s.length==1&&s[0]=='${cote}'})`);
  assert.ok(cells.length >= 40, 'un bord entier est cliquable');
  const bad = cells.filter(([x, y]) => val(ctx, `(()=>{const e=exEnt(${x},${y});return !(e&&e.t=='e'&&e.o.to=='foret')})()`));
  assert.equal(bad.length, 0, 'toutes les cases de ce bord mènent à la forêt');
  assert.equal(val(ctx, 'exEnt(6,6)'), null, 'le centre n\'est pas une sortie');
  // arrivée : bord opposé de la carte voisine, case libre, hors bord de sortie
  for (const [x, y] of cells.filter((_, i) => i % 7 == 0)) {
    const a = val(ctx, `exArrive('${cote}',${x},${y},DATA.cartes.foret)`);
    assert.ok(val(ctx, `DATA.exin(${a.tx},${a.ty})&&exFree(DATA.cartes.foret,${a.tx},${a.ty})`), 'arrivée libre ' + a.tx + ',' + a.ty);
  }
  // même position le long du bord : v identique pour E/W, u identique (à 1 près) pour N/S
  const [x0, y0] = cells[Math.floor(cells.length / 2)], a0 = val(ctx, `exArrive('${cote}',${x0},${y0},DATA.cartes.foret)`);
  const along = cote == 'E' || cote == 'W' ? [x0 + y0, a0.tx + a0.ty] : [x0 - y0, a0.tx - a0.ty];
  assert.ok(Math.abs(along[0] - along[1]) <= 6, 'même position le long du bord (marge de recherche d\'une case libre)');
});

test('quête de combat par cartes : un groupe non boss d\'une des cartes compte, pas ailleurs ni un boss', () => {
  const ctx = loadExploration(baseSave);
  run(ctx, "EX.map='sentier'");
  const g = run(ctx, 'DATA.cartes.sentier.groups[0].renc'), boss = run(ctx, "DATA.rencontres.findIndex(r=>r.n.includes('boss'))");
  assert.equal(run(ctx, `EX.winOf(DATA.quetes.f1,{renc:${g}})`), true, 'groupe du sentier');
  assert.equal(run(ctx, `EX.winOf(DATA.quetes.f1,{renc:${g},hide:1})`), false, 'cachette ignorée');
  assert.equal(run(ctx, `EX.winOf(DATA.quetes.f1,{renc:${boss}})`), false, 'boss ignoré');
  run(ctx, "EX.map='village'");
  assert.equal(run(ctx, `EX.winOf(DATA.quetes.f1,{renc:${g}})`), false, 'carte hors liste');
  assert.equal(run(ctx, "EX.winOf(DATA.quetes.q2,{renc:0})"), true, 'quête à groupe fixe inchangée');
});

test('escorte : le PNJ se cache pendant l\'escorte, une défaite l\'annule, l\'embuscade n\'a lieu que sur la carte d\'arrivée et tant qu\'elle n\'est pas vaincue', () => {
  const ctx = loadExploration({ ...baseSave, renc: 5 });
  const npcsOf = m => val(ctx, "DATA.cartes['" + m + "'].npcs.map(n=>n.n)");
  run(ctx, "exPrune()");
  assert.ok(npcsOf('cb_place').includes('Veuve Cendreuse'), 'avant la quête, la veuve est sur la place');
  assert.ok(!npcsOf('cb_cimetiere').includes('Veuve Cendreuse'), 'avant la quête, pas de copie au cimetière');
  assert.equal(run(ctx, 'EX.escort()'), undefined);
  // acceptation (état de la quête + drapeau posé par le bouton « Accepter »)
  run(ctx, "sv.q.cb6={s:1,n:0,got:[]};sv.hist.flags.esc_cb6=true;exPrune()");
  assert.equal(run(ctx, 'EX.escort()'), 'cb6');
  assert.ok(!npcsOf('cb_place').includes('Veuve Cendreuse'), 'pendant l\'escorte, elle a quitté la place');
  assert.equal(run(ctx, "EX.escortNpc('cb6').n"), 'Veuve Cendreuse', 'le suiveur est retrouvé même caché');
  // embuscade : seulement sur la carte d'arrivée, une fois
  run(ctx, "globalThis.F=[];globalThis.setTimeout=()=>0;EX.fight=q=>F.push(q);toast=()=>{}");
  run(ctx, "EX.enter('cb_place',6,6,true);EX.ambush()");
  assert.equal(val(ctx, 'F.length'), 0, 'pas d\'embuscade ailleurs');
  run(ctx, "EX.enter('cb_cimetiere',6,11,true);EX.ambush()");
  assert.equal(val(ctx, 'F.length'), 1);
  assert.equal(val(ctx, 'F[0].renc'), 4);
  assert.equal(val(ctx, 'F[0].escort'), 'cb6');
  run(ctx, "sv.q.cb6.n=1;EX.ambush()");
  assert.equal(val(ctx, 'F.length'), 1, 'plus d\'embuscade une fois vaincue');
  // défaite : escorte annulée, quête à reprendre, la veuve rentre chez elle
  run(ctx, "sv.q.cb6.n=0;EX.escortFail();exPrune()");
  assert.equal(run(ctx, 'EX.escort()'), undefined);
  assert.equal(run(ctx, 'sv.q.cb6'), undefined, 'la quête est à reprendre');
  assert.ok(npcsOf('cb_place').includes('Veuve Cendreuse'), 'la veuve est de retour sur la place');
});

test('escorte : une fois la quête rendue, la veuve apparaît au cimetière et plus sur la place', () => {
  const ctx = loadExploration({ ...baseSave, renc: 5 });
  run(ctx, "sv.q.cb6={s:2,n:1,got:[]};sv.hist.flags.esc_cb6=false;sv.hist.flags.esc_fin_cb6=true;exPrune()");
  const npcsOf = m => val(ctx, "DATA.cartes['" + m + "'].npcs.map(n=>n.n)");
  assert.ok(!npcsOf('cb_place').includes('Veuve Cendreuse'));
  assert.ok(npcsOf('cb_cimetiere').includes('Veuve Cendreuse'));
  assert.equal(run(ctx, 'EX.escort()'), undefined);
});

test('escorte : le « Terminer » n\'est proposé qu\'au PNJ de remise et seulement après l\'embuscade, l\'« Accepter » seulement au donneur', () => {
  const ctx = loadExploration({ ...baseSave, renc: 5 });
  run(ctx, "exPrune()");
  const marque = (m, nom) => val(ctx, "EX.markInfo(DATA.cartes['" + m + "'].npcs.find(n=>n.n=='" + nom + "')).m");
  assert.equal(marque('cb_place', 'Veuve Cendreuse'), '!', 'le donneur propose la quête');
  assert.equal(marque('cb_cimetiere', 'Gardienne Cyprès'), '!', 'la Gardienne propose cb4 (pas encore cb6)');
  run(ctx, "sv.q.cb4={s:2,n:1,got:[]};sv.q.cb6={s:1,n:0,got:[]};sv.hist.flags.esc_cb6=true");
  assert.equal(marque('cb_cimetiere', 'Gardienne Cyprès'), '', 'avant l\'embuscade, rien à rendre');
  run(ctx, "sv.q.cb6.n=1");
  assert.equal(marque('cb_cimetiere', 'Gardienne Cyprès'), '?', 'après l\'embuscade, la quête se rend à la Gardienne');
});

test('repos : entrer dans une auberge remet les PV au maximum, pas ailleurs ; la défaite aussi', () => {
  const ctx = loadExploration({ ...baseSave, pv: 5 });
  run(ctx, "globalThis.setTimeout=()=>0;toast=()=>{}");
  run(ctx, "EX.enter('poste',6,6,true)");
  assert.equal(val(ctx, 'sv.pv'), 5, 'pas de soin hors lieu de repos');
  run(ctx, "EX.enter('v_auberge',6,6,true)");
  assert.equal(val(ctx, 'sv.pv'), null);
  run(ctx, "sv.pv=5;EX.group=null;EX.escortFail=()=>{};EX.start=()=>{};EX.hud=()=>{};EX.storyTrigger=()=>{};startScreenTransition=()=>{};EX.back('lose',3)");
  assert.equal(val(ctx, 'sv.pv'), null, 'défaite : PV au maximum');
});

test('régénération lente : 1 PV par tick (1 s) en exploration seulement, plafonnée', () => {
  const ctx = loadExploration({ ...baseSave, pv: 5 });
  run(ctx, "EX.hud=()=>{}");
  const max = val(ctx, 'pvMax()'), pas = 1;
  run(ctx, "EX.on=false;EX.regen()");
  assert.equal(val(ctx, 'sv.pv'), 5, 'rien hors exploration (combat, menu de titre)');
  run(ctx, "EX.on=true;EX.regen();EX.regen()");
  assert.equal(val(ctx, 'sv.pv'), 5 + 2 * pas);
  run(ctx, "sv.pv=" + (max - 1) + ";EX.regen()");
  assert.equal(val(ctx, 'sv.pv'), null, 'plafonné au max');
  run(ctx, "EX.regen()");
  assert.equal(val(ctx, 'sv.pv'), null);
});

test('un seul toucher suffit pour une case libre, une ressource ou un bord de sortie ; un groupe de monstres demande un double toucher avec info-bulle', () => {
  const ctx = loadExploration({ ...baseSave, renc: 99 });
  run(ctx, "var DIRS=[[1,0],[-1,0],[0,1],[0,-1]];var cv={getBoundingClientRect:()=>({left:0,top:0})},ox=0,oy=0,tw=2,th=2;EX.draw=()=>{};globalThis.setTimeout=()=>0;EX.enter('village',6,6,true);globalThis.G=[];EX.go=(p,e)=>G.push({n:p.length,t:e?e.t:undefined})");
  const tap = (x, y) => `EX.pend=null;EX.x=6;EX.y=6;EX.click({clientX:${x - y},clientY:${x + y}})`;
  run(ctx, tap(6, 9));
  assert.deepEqual(val(ctx, 'G'), [{ n: 3 }], 'case libre : une marche de 3 cases dès le premier appui');
  const n = val(ctx, 'EX.nodes[0]'), g = val(ctx, 'EX.groups.find(q=>!q.dead)');
  run(ctx, 'G=[]'); run(ctx, tap(n.x, n.y));
  assert.equal(val(ctx, 'G[0].t'), 'n', 'ressource');
  run(ctx, 'G=[]'); run(ctx, tap(g.x, g.y));
  assert.equal(val(ctx, 'G.length'), 0, 'groupe de monstres : le premier toucher ne lance pas le combat');
  const nom = val(ctx, `DATA.rencontres[${g.renc}].m[0].n`);
  assert.equal(val(ctx, 'EX.pend.ent.t'), 'g', 'le groupe attend la confirmation');
  const info = val(ctx, `EX.groupInfo(EX.pend.ent.o)`);
  assert.ok(info.includes(nom) && info.includes('touche encore'), 'info-bulle avec la liste des monstres : ' + info);
  run(ctx, `EX.x=6;EX.y=6;EX.click({clientX:${g.x - g.y},clientY:${g.x + g.y}})`);
  assert.equal(val(ctx, 'G[0].t'), 'g', 'second toucher sur le même groupe : combat');
  const cote = val(ctx, "DATA.cartes.village.exits.find(e=>e.to=='foret').d"), c = val(ctx, `DATA.excells.find(([x,y])=>{const s=DATA.exside(x,y);return s.length==1&&s[0]=='${cote}'})`);
  run(ctx, 'G=[]'); run(ctx, tap(c[0], c[1]));
  assert.equal(val(ctx, 'G[0].t'), 'e', 'bord de sortie');
});

test('récolte : 5 secondes sur place, interrompue par un toucher, repousse de 3 minutes conservée en sauvegarde et au changement de carte', () => {
  const ctx = loadExploration({ ...baseSave, renc: 99 });
  run(ctx, "globalThis.setTimeout=()=>0;globalThis.G=[];EX.draw=()=>{};EX.ui=()=>{};pop=()=>{};toast=()=>{};EX.enter('village',6,6,true)");
  run(ctx, "globalThis.n0=EX.nodes[0]");
  const k = val(ctx, "n0.res"), avant = val(ctx, `sv.res.${k}`);
  run(ctx, 'EX.harvest(n0)');
  assert.ok(run(ctx, 'EX.gather&&EX.gather.n===n0'), 'la récolte démarre');
  assert.equal(val(ctx, `sv.res.${k}`), avant, 'rien avant la fin des 5 s');
  run(ctx, 'EX.gather.t=Date.now()-2000;EX.gatherTick(EX.gather.id)');
  assert.ok(run(ctx, 'EX.gather'), 'toujours en cours à 2 s');
  run(ctx, 'EX.click({clientX:0,clientY:0})');
  assert.equal(run(ctx, 'EX.gather'), null, 'un toucher interrompt');
  assert.equal(val(ctx, `sv.res.${k}`), avant);
  run(ctx, 'EX.harvest(n0);EX.gather.t=Date.now()-5001;EX.gatherTick(EX.gather.id)');
  assert.equal(run(ctx, 'EX.gather'), null);
  assert.ok(val(ctx, `sv.res.${k}`) >= avant + 2, 'ressource obtenue');
  const reste = val(ctx, 'n0.until-Date.now()');
  assert.ok(reste > 179000 && reste <= 180000, 'repousse de 3 minutes : ' + reste);
  assert.ok(val(ctx, "Object.keys(sv.rep).length") === 1, 'repousse conservée en sauvegarde');
  run(ctx, 'EX.harvest(n0)');
  assert.equal(run(ctx, 'EX.gather'), null, 'pas de récolte pendant la repousse');
  run(ctx, "EX.enter('poste',6,6,true);EX.enter('village',6,6,true)");
  assert.ok(val(ctx, 'EX.nodes[0].until>Date.now()'), 'la repousse survit au changement de carte');
  run(ctx, "sv.rep[Object.keys(sv.rep)[0]]=Date.now()-1;EX.enter('poste',6,6,true);EX.enter('village',6,6,true)");
  assert.equal(val(ctx, 'EX.nodes[0].until>Date.now()'), false, 'la ressource a repoussé');
});

test('récolte : un gisement d\'un palier trop haut est refusé tant que le métier n\'a pas le niveau requis', () => {
  const ctx = loadExploration({ ...baseSave, renc: 99 });
  run(ctx, "globalThis.setTimeout=()=>0;EX.draw=()=>{};EX.ui=()=>{};pop=()=>{};toast=()=>{};EX.enter('village',6,6,true);globalThis.n1={x:3,y:3,res:'roseau',until:0}");
  run(ctx, 'sv.met={};EX.harvest(n1)');
  assert.equal(run(ctx, 'EX.gather'), null, 'Herboriste 1 : roseau (niveau 5) refusé');
  run(ctx, 'sv.met.herbo={xp:0,niv:5};EX.harvest(n1)');
  assert.ok(run(ctx, 'EX.gather&&EX.gather.n===n1'), 'Herboriste 5 : roseau accepté');
});
