const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const context = vm.createContext({});
for (const file of ['donnees.js', 'moteur.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, { filename: file });
const { DATA, Combat } = vm.runInContext('({ DATA, Combat })', context);

const POUSSE = { id: 't_push', n: 'Poussée', pa: 2, r: [1, 4], los: 0, dmg: 5, push: 3, cd: 0 };
const combat = () => { const c = new Combat(DATA, { classe: 'mage', renc: 0, niv: 1, lueurs: [], sorts: [POUSSE] }); c.pa = 20; return c; };
const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
// Place héros H et ennemi F alignés, F à `d` cases de H, puis renvoie la direction de poussée.
function aligne(c, f, cond) {
  for (const [x, y] of c.cells) for (const [dx, dy] of DIRS4) {
    const hx = x - dx, hy = y - dy;
    if (!c.free(x, y) || !c.free(hx, hy)) continue;
    if (!cond(x, y, dx, dy)) continue;
    c.hero.x = hx; c.hero.y = hy; f.x = x; f.y = y; f.hp = 999; f.max = 999; f.etats = [];
    return { x, y, dx, dy };
  }
  throw new Error('configuration introuvable');
}
const f0 = c => c.foes[0];

test('un ennemi poussé contre le bord de la carte subit 6 PV par case non parcourue', () => {
  const c = combat(), f = f0(c);
  const p = aligne(c, f, (x, y, dx, dy) => !c.in(x + dx, y + dy) && !f.form);
  const hp0 = f.hp, r = c.cast(0, p.x, p.y);
  assert.ok(r.ok);
  const dmgSort = hp0 - f.hp - 18;
  assert.ok(dmgSort > 0, 'dégâts du sort + 18 de collision (3 cases)');
  assert.equal(r.collisions.length, 1);
  assert.equal(r.collisions[0].dmg, 18);
});

test('un ennemi poussé contre un rocher subit la collision après avoir avancé', () => {
  const c = combat(), f = f0(c);
  const p = aligne(c, f, (x, y, dx, dy) => c.free(x + dx, y + dy) && c.in(x + 2 * dx, y + 2 * dy) && c.ok(x + 2 * dx, y + 2 * dy));
  c.rocks.add((p.x + 2 * p.dx) + ',' + (p.y + 2 * p.dy));
  const r = c.cast(0, p.x, p.y);
  assert.equal(f.x, p.x + p.dx, 'avance de 1 case');
  assert.equal(r.collisions[0].dmg, 12, '2 cases non parcourues');
});

test('pousser un ennemi contre une autre unité blesse les deux', () => {
  const c = combat();
  if (c.foes.length < 2) return;
  const f = f0(c), g = c.foes[1];
  const p = aligne(c, f, (x, y, dx, dy) => c.free(x + dx, y + dy));
  g.x = p.x + p.dx; g.y = p.y + p.dy; g.hp = 999; g.max = 999; g.etats = [];
  const gh = g.hp, r = c.cast(0, p.x, p.y);
  assert.equal(r.collisions.length, 2);
  assert.equal(gh - g.hp, 18, "l'unité bloquante prend aussi 18");
});

test('sans obstacle, aucune collision', () => {
  const c = combat(), f = f0(c);
  const p = aligne(c, f, (x, y, dx, dy) => [1, 2, 3].every(k => c.free(x + k * dx, y + k * dy)));
  const r = c.cast(0, p.x, p.y);
  assert.equal(r.collisions.length, 0);
  assert.equal(f.x, p.x + 3 * p.dx);
});

test('le héros repoussé par un monstre subit la collision (défense comprise)', () => {
  const c = combat(), h = c.hero, f = f0(c);
  // monstre en (x,y) et héros entre lui et le bord : on cherche une case de bord pour le héros
  let ok = false;
  for (const [x, y] of c.cells) for (const [dx, dy] of DIRS4) {
    if (c.in(x + dx, y + dy) || !c.free(x - dx, y - dy) || !c.ok(x, y)) continue;
    h.x = x; h.y = y; f.x = x - dx; f.y = y - dy; ok = true; break;
  }
  assert.ok(ok);
  const hp0 = h.hp, coll = [];
  const moved = c.moveHero(f, 'push', 2, coll);
  assert.equal(moved, 0);
  assert.equal(coll.length, 1);
  assert.equal(coll[0].u, h);
  assert.equal(coll[0].dmg, hp0 - h.hp);
  assert.ok(coll[0].dmg > 0 && coll[0].dmg <= 12);
});

test("l'attirance (pull) ne provoque jamais de collision", () => {
  const c = combat(), h = c.hero, f = f0(c);
  const coll = [];
  const hp0 = h.hp;
  c.moveHero(f, 'pull', 3, coll);
  assert.equal(coll.length, 0);
  assert.equal(h.hp, hp0);
});

// --- aperçu des collisions : doit annoncer exactement ce que cast() inflige ---
function compare(c, p, extra) {
  const f = c.foes[0], g = c.foes[1];
  const avant = new Map(c.foes.map(u => [u, u.hp]));
  const pv = c.preview(0, p.x, p.y);
  const r = c.cast(0, p.x, p.y);
  for (const e of pv) assert.equal(avant.get(e.f) - e.f.hp, e.dmg + (e.coll || 0), 'aperçu = réel pour ' + e.f.n);
  return { pv, r, f, g };
}

test("l'aperçu annonce la collision contre le bord", () => {
  const c = combat(), f = f0(c);
  const p = aligne(c, f, (x, y, dx, dy) => !c.in(x + dx, y + dy) && !f.form);
  const { pv } = compare(c, p);
  assert.equal(pv.find(e => e.f === f).coll, 18);
});

test("l'aperçu annonce la collision contre un rocher et ne change pas l'état", () => {
  const c = combat(), f = f0(c);
  const p = aligne(c, f, (x, y, dx, dy) => c.free(x + dx, y + dy) && c.ok(x + 2 * dx, y + 2 * dy));
  c.rocks.add((p.x + 2 * p.dx) + ',' + (p.y + 2 * p.dy));
  const snap = JSON.stringify([c.pa, c.foes.map(u => [u.x, u.y, u.hp])]);
  c.preview(0, p.x, p.y);
  assert.equal(JSON.stringify([c.pa, c.foes.map(u => [u.x, u.y, u.hp])]), snap);
  const { pv } = compare(c, p);
  assert.equal(pv.find(e => e.f === f).coll, 12);
});

test("l'aperçu annonce la collision contre une autre unité (les deux blessés)", () => {
  const c = combat(), f = f0(c), g = c.foes[1];
  const p = aligne(c, f, (x, y, dx, dy) => c.free(x + dx, y + dy));
  g.x = p.x + p.dx; g.y = p.y + p.dy; g.hp = 999; g.max = 999; g.etats = [];
  const { pv } = compare(c, p);
  assert.equal(pv.find(e => e.f === f).coll, 18);
  assert.equal(pv.find(e => e.f === g).coll, 18);
});

test("l'aperçu tient compte du bouclier lors d'une collision", () => {
  const c = combat(), f = f0(c);
  const p = aligne(c, f, (x, y, dx, dy) => !c.in(x + dx, y + dy) && !f.form);
  f.etats = [{ id: 'bouclier', v: 10, t: 2 }];
  compare(c, p);
});
