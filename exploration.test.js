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
  run(ctx, 'EX.nodes[0].until=EX.steps+30');
  run(ctx, "sv.q.q1={s:1,n:0,got:[]}");
  run(ctx, "EX.marks('village')");
  assert.equal(run(ctx, 'EX.groups[0].dead'), true, 'le groupe vaincu doit rester vaincu');
  assert.equal(run(ctx, 'EX.nodes[0].until>EX.steps'), true, 'le nœud récolté doit rester en repousse');
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

test('déplacements : un appui pendant la marche l’annule ; une case proche d’une sortie vise la sortie sauf si le héros en est tout près', () => {
  const ctx = loadExploration({ ...baseSave, renc: 99 });   // sorties ouvertes
  run(ctx, "var DIRS=[[1,0],[-1,0],[0,1],[0,-1]];var cv={getBoundingClientRect:()=>({left:0,top:0})},ox=0,oy=0,tw=2,th=2;EX.draw=()=>{};");
  run(ctx, "EX.enter('village',6,6,true)");
  run(ctx, 'EX.walking=true;EX.tok=5;EX.click({clientX:0,clientY:0})');
  assert.equal(run(ctx, 'EX.walking'), false);
  assert.equal(run(ctx, 'EX.tok'), 6);
  const ex = val(ctx, "DATA.cartes.village.exits.find(e=>e.to=='foret')");
  // deux cases libres (ni rocher ni objet) à 2 pas ou moins de la sortie
  const libres = val(ctx, `(()=>{const e=DATA.cartes.village.exits.find(e=>e.to=='foret'),R=DATA.cartes.village.rocks,o=[];for(const [a,b] of [[-1,0],[0,1],[-1,1],[0,-1],[-2,0],[-1,-1],[0,2],[0,-2]]){const x=e.x+a,y=e.y+b;if(DATA.in(x,y)&&!R.some(r=>r[0]==x&&r[1]==y)&&!exEnt(x,y))o.push([x,y])}return o})()`);
  assert.ok(libres.length >= 2, 'cases libres près de la sortie');
  const tap = ([x, y]) => `EX.click({clientX:${x - y},clientY:${x + y}})`;
  run(ctx, `EX.pend=null;EX.x=6;EX.y=6;${tap(libres[0])}`);
  assert.equal(run(ctx, 'EX.pend&&EX.pend.ent&&EX.pend.ent.t'), 'e', 'une case voisine de la sortie vise la sortie');
  assert.equal(run(ctx, 'EX.pend.x'), ex.x);
  run(ctx, `EX.pend=null;EX.x=${libres[0][0]};EX.y=${libres[0][1]};${tap(libres[1])}`);
  assert.ok(!run(ctx, 'EX.pend&&EX.pend.ent'), 'près de la sortie, une case voisine reste une simple case');
});
