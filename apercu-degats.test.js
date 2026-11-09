const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const context = vm.createContext({});
for (const file of ['donnees.js', 'moteur.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, { filename: file });
const { DATA, Combat } = vm.runInContext('({ DATA, Combat })', context);

const SORTS = [
  { id: 't_dir', n: 'Direct', pa: 2, r: [1, 6], los: 0, dmg: 11, cd: 0 },
  { id: 't_zone', n: 'Zone', pa: 2, r: [1, 6], aoe: 2, dmg: 9, cd: 0 },
  { id: 't_elem', n: 'Élément', pa: 2, r: [1, 6], los: 0, dmg: 14, elem: 'foudre', cd: 0 },
  { id: 't_soin', n: 'Soin', pa: 1, r: [0, 0], heal: 5, cd: 0 }
];
function combat() {
  const c = new Combat(DATA, { classe: 'mage', renc: 0, niv: 1, lueurs: [], sorts: SORTS });
  c.pa = 20;
  return c;
}
// Place le premier ennemi sur une case que le sort i peut viser.
function cible(c, i) {
  const f = c.foes[0];
  for (const [x, y] of c.cells) {
    if (!c.free(x, y)) continue;
    f.x = x; f.y = y;
    if (c.ranged(i).some(t => t[0] == x && t[1] == y)) return [x, y];
  }
  throw new Error('aucune case viable');
}
const etat = c => JSON.stringify({ pa: c.pa, cd: c.cd, rage: c.hero.rage, hero: c.hero.hp, foes: c.foes.map(f => [f.x, f.y, f.hp, f.etats]) });

test("l'aperçu ne change aucun état du combat", () => {
  for (const i of [0, 1, 2]) {
    const c = combat(); const [x, y] = cible(c, i); c.hero.rage = true;
    const avant = etat(c); c.preview(i, x, y);
    assert.equal(etat(c), avant, 'état identique après aperçu du sort ' + i);
  }
});

test("l'aperçu correspond aux dégâts réellement infligés", () => {
  for (const i of [0, 1, 2]) for (const rage of [false, true]) {
    const c = combat(); const [x, y] = cible(c, i); c.hero.rage = rage;
    const f = c.foes[0]; f.hp = 999; f.max = Math.max(f.max, 999);
    const p = c.preview(i, x, y), hp0 = c.foes.map(g => g.hp);
    c.cast(i, x, y);
    for (const e of p) assert.equal(hp0[c.foes.indexOf(e.f)] - e.f.hp, e.dmg, 'sort ' + i + ' rage ' + rage);
    assert.ok(p.length >= 1);
  }
});

test("l'aperçu tient compte du bouclier d'un ennemi et ignore les sorts sans dégâts", () => {
  const c = combat(); const [x, y] = cible(c, 0); const f = c.foes[0];
  f.hp = 999; f.etats = [{ id: 'bouclier', v: 4, t: 2 }];
  const [e] = c.preview(0, x, y), hp0 = f.hp;
  c.cast(0, x, y);
  assert.equal(e.absorbed, 4);
  assert.equal(hp0 - f.hp, e.dmg);
  assert.equal(c.preview(3, c.hero.x, c.hero.y).length, 0);
});
