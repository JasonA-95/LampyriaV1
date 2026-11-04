const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = file => fs.readFileSync(path.join(__dirname, file), 'utf8');
const DONJON = /^(terrier|enclos|archives|reves|pyr|crypte)\d$/;
// Contexte minimal : données du monde, histoire (scènes), donjons, ALEA ; un EX factice et des minuteries capturées.
function load() {
  const timers = [];
  const context = vm.createContext({ Math, JSON, console, setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; } });
  vm.runInContext('var EX={map:null,x:1,y:6,groups:[],nodes:[],on:false}', context);
  for (const f of ['donnees.js', 'histoire.js', 'donjons.js', 'alea.js']) vm.runInContext(source(f), context, { filename: f });
  context.timers = timers;
  return context;
}
const ev = (c, e) => vm.runInContext(e, c);
const val = (c, e) => JSON.parse(vm.runInContext('JSON.stringify(' + e + ')', c));

test('groupes : même nombre par carte, 1 à 4 monstres, groupes fixes et donjons intacts', () => {
  const c = load();
  const maps = val(c, 'Object.keys(DATA.cartes).filter(k=>(DATA.cartes[k].groups||[]).length)');
  let libres = 0;
  for (let pass = 0; pass < 20; pass++) for (const k of maps) {
    const orig = val(c, `DATA.cartes['${k}'].groups`), out = val(c, `ALEA.groups('${k}',DATA.cartes['${k}'].groups)`);
    assert.equal(out.length, orig.length, k);
    orig.forEach((g, i) => {
      if (DONJON.test(k) || ev(c, `ALEA.isFixed(${JSON.stringify(g)})`)) assert.equal(out[i].renc, g.renc, k + ' : groupe fixe ou de donjon modifié');
      else { libres++; assert.ok(out[i].renc >= 182 || out[i].renc === g.renc, k); const n = val(c, `DATA.rencontres[${out[i].renc}].m.length`); assert.ok(n >= 1 && n <= 4, k + ' : taille ' + n); }
    });
  }
  assert.ok(libres > 1000, 'des groupes libres sont bien remplacés (' + libres + ')');
});

test('groupes fixes : boss, élites, progression ≤ 24, quêtes de combat et scènes', () => {
  const c = load();
  for (const r of [0, 3, 4, 5, 6, 10, 13, 14, 15, 16, 17, 24, 46, 47]) assert.equal(ev(c, `ALEA.isFixed({renc:${r}})`), true, 'renc ' + r);
  const defis = val(c, "Object.values(DATA.quetes).filter(q=>q.kind=='win'&&q.renc!=null).map(q=>q.renc)");
  for (const r of defis) assert.equal(ev(c, `ALEA.isFixed({renc:${r}})`), true, 'quête sur renc ' + r);
  assert.equal(ev(c, 'ALEA.isFixed({renc:100})'), false, 'un groupe généré ordinaire est libre');
  assert.equal(ev(c, 'ALEA.isFixed({renc:55})'), false, 'une copie d\'un groupe d\'origine est libre');
  assert.equal(ev(c, 'ALEA.isFixed({renc:100,hide:1})'), true);
});

test('composition : monstres de la zone, au plus un soigneur (jamais seul) et un tireur, stats valides, tailles 1 à 4 toutes tirées', () => {
  const c = load();
  const tailles = new Set();
  for (const k of ['collines', 'marais', 'dunes', 'lu1', 'fs3', 'dp4', 'rp2', 'os5', 'port', 'cour']) {
    if (!ev(c, `!!DATA.cartes['${k}']`)) continue;
    const noms = new Set(val(c, `ALEA.pool('${k}').map(t=>t.m.n)`));
    assert.ok(noms.size >= 2, k + ' : pool trop petit');
    for (let i = 0; i < 60; i++) {
      const idx = ev(c, `ALEA.compose('${k}')`);
      if (idx == null) continue;
      const r = val(c, `DATA.rencontres[${idx}]`);
      tailles.add(r.m.length);
      assert.equal(r.base, -1); assert.ok(r.n && r.loot && Array.isArray(r.drops) && r.niv > 0);
      assert.ok(r.m.filter(m => m.ia == 'soin').length <= 1 && !(r.m.length == 1 && r.m[0].ia == 'soin'), k + ' : soigneur');
      assert.ok(r.m.filter(m => m.sort && m.sort.r && m.sort.r[1] >= 7).length <= 1, k + ' : tireurs');
      assert.equal(new Set(r.m.map(m => m.x + ',' + m.y)).size, r.m.length, k + ' : cases distinctes');
      for (const m of r.m) { assert.ok(noms.has(m.n), k + ' : monstre hors zone ' + m.n); assert.ok(Number.isInteger(m.hp) && m.hp >= 1 && m.hp == m.max && m.d >= 0, k + ' : stats ' + m.n); assert.ok(!m.boss && !m.form); }
    }
  }
  assert.deepEqual([...tailles].sort(), [1, 2, 3, 4]);
});

test('réapparition : un groupe ordinaire vaincu est remplacé après le délai, pas en donjon ni pour un boss, annulé si on change de carte', () => {
  const c = load();
  const setup = map => vm.runInContext(`EX.map='${map}';EX.on=false;EX.groups=ALEA.groups('${map}',DATA.cartes['${map}'].groups);EX.nodes=[];EX.x=1;EX.y=6`, c);
  setup('marais'); c.timers.length = 0;
  const n0 = val(c, 'EX.groups.length');
  assert.equal(ev(c, "ALEA.after(EX.groups.find(g=>!ALEA.isFixed(g))||EX.groups[1])"), true);
  assert.equal(c.timers.length, 1); assert.equal(c.timers[0].ms, 30000);
  c.timers[0].fn();
  assert.equal(val(c, 'EX.groups.length'), n0 + 1, 'un groupe de plus');
  const g = val(c, 'EX.groups[EX.groups.length-1]');
  assert.ok(ev(c, `DATA.exin(${g.x},${g.y})`) && !ev(c, `DATA.exside(${g.x},${g.y}).length`));
  assert.ok(!val(c, `DATA.cartes.marais.rocks`).some(r => r[0] == g.x && r[1] == g.y), 'pas sur un rocher');
  assert.ok(Math.abs(g.x - 1) + Math.abs(g.y - 6) >= 5, 'loin du héros');
  assert.ok(val(c, `DATA.rencontres[${g.renc}].m.length`) <= 4);
  // boss : aucun nouveau groupe
  c.timers.length = 0; setup('manoir');
  assert.equal(ev(c, "ALEA.after({renc:3})"), false); assert.equal(c.timers.length, 0);
  // donjon : aucun nouveau groupe
  c.timers.length = 0; setup('terrier1');
  assert.equal(ev(c, "ALEA.after({renc:20})"), false); assert.equal(c.timers.length, 0);
  // changement de carte : minuterie sans effet
  setup('marais'); c.timers.length = 0; ev(c, "ALEA.after({renc:55})");
  setup('collines'); const n1 = val(c, 'EX.groups.length'); c.timers[0].fn();
  assert.equal(val(c, 'EX.groups.length'), n1, 'minuterie annulée');
});

test('rencontres aléatoires : sans effet sur la progression ni les quêtes de combat', () => {
  const c = load();
  const idx = ev(c, "ALEA.compose('marais')");
  assert.equal(val(c, `DATA.rencontres[${idx}].base`), -1);
  assert.equal(ev(c, `Object.values(DATA.quetes).some(q=>q.kind=='win'&&q.renc==(DATA.rencontres[${idx}].base??${idx}))`), false);
});
