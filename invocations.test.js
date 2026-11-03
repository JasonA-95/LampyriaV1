const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const context = vm.createContext({});
for (const file of ['donnees.js', 'moteur.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, { filename: file });
const { DATA, Combat } = vm.runInContext('({ DATA, Combat })', context);

// Sorts de test : une invocation (squelette de mêlée) et un coup direct.
const INVOQUE = { id: 't_inv', n: 'Squelette', pa: 2, r: [1, 3], invoque: { n: 'Squelette', e: '💀', hp: 20, d: 7, pm: 3 }, cd: 0, max: 2 };
const COUP = { id: 't_coup', n: 'Coup', pa: 1, r: [1, 4], dmg: 5, los: 0, cd: 0 };

function combat(renc = 0) {
  const c = new Combat(DATA, { classe: 'porte', renc, niv: 1, lueurs: [], sorts: [INVOQUE, COUP] });
  c.pa = 12;
  return c;
}
const libre = (c, de) => c.cells.map(([x, y]) => ({ x, y })).find(p => c.free(p.x, p.y) && c.dist(p, de) >= 1 && c.dist(p, de) <= 3);

test('une invocation apparait sur une case libre a portee, bloque la case et reste limitee a 2', () => {
  const c = combat();
  const p = libre(c, c.hero);
  assert.ok(c.ranged(0).some(t => t[0] == p.x && t[1] == p.y), 'case libre proposee');
  const r = c.cast(0, p.x, p.y);
  assert.ok(r.ok && r.summon, 'invocation reussie');
  assert.equal(c.liveAllies().length, 1);
  assert.equal(c.at(p.x, p.y), c.allies[0], 'la case est occupee');
  assert.ok(!c.ranged(0).some(t => t[0] == p.x && t[1] == p.y), 'on ne peut pas invoquer sur une case occupee');
  const q = libre(c, c.hero);
  assert.ok(c.cast(0, q.x, q.y).ok);
  assert.equal(c.liveAllies().length, 2);
  assert.equal(c.ranged(0).length, 0, 'maximum de 2 invocations atteint');
});

test('le heros ne peut pas viser son invocation avec un sort offensif', () => {
  const c = combat();
  const p = libre(c, c.hero);
  c.cast(0, p.x, p.y);
  assert.ok(!c.ranged(1).some(t => t[0] == p.x && t[1] == p.y), 'allie non cible');
  assert.equal(c.cast(1, p.x, p.y).ok, false);
  assert.equal(c.allies[0].hp, c.allies[0].max);
});

test('l invocation avance vers un monstre et le frappe, une victoire par ses coups est reconnue', () => {
  const c = combat();
  const p = libre(c, c.hero);
  c.cast(0, p.x, p.y);
  const a = c.allies[0], foe = c.foes.find(f => !f.form), d0 = c.dist(a, foe);
  const act = c.allyTurn(a);
  assert.ok(c.dist(a, foe) < d0 || act.tag == 'ally', 'elle se rapproche ou frappe');
  c.foes.forEach(f => { if (f !== foe) f.hp = 0 });
  foe.hp = 1; a.x = foe.x + 1; a.y = foe.y;
  const hit = c.allyTurn(a);
  assert.equal(hit.tag, 'ally');
  assert.equal(foe.hp, 0);
  assert.equal(c.result, 'win', 'dernier monstre tue par un allie');
});

test('un monstre au contact de l invocation (et pas du heros) la frappe, elle peut mourir et disparait', () => {
  const c = combat();
  const foe = c.foes.find(f => !f.form);
  c.foes.forEach(f => { if (f !== foe) f.hp = 0 });
  const p = c.cells.map(([x, y]) => ({ x, y })).find(q => c.free(q.x, q.y) && c.dist(q, c.hero) >= 3);
  c.allies.push({ x: p.x, y: p.y, hp: 1, max: 20, d: 5, pm: 3, ally: 1, n: 'Squelette', e: '💀', etats: [] });
  const spot = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => ({ x: p.x + dx, y: p.y + dy })).find(q => c.free(q.x, q.y));
  foe.x = spot.x; foe.y = spot.y; foe.pm = 0; delete foe.sort; delete foe.ia;
  const act = c.foeTurn(foe);
  assert.equal(act.tag, 'allie');
  assert.equal(c.allies[0].hp, 0);
  assert.equal(c.liveAllies().length, 0);
  assert.equal(c.at(p.x, p.y), undefined, 'case liberee');
  assert.equal(c.result, null, 'la mort d un allie ne termine pas le combat');
});

test('chaque combat repart sans invocation', () => {
  const c = combat();
  const p = libre(c, c.hero);
  c.cast(0, p.x, p.y);
  assert.equal(combat().allies.length, 0);
});

test('Fossoyeur lot 1 : classe fragile, sorts valides, invocations lancees depuis les vrais sorts', () => {
  const F = DATA.classes.fossoyeur;
  assert.ok(F && F.hp < DATA.classes.mage.hp + 10, 'classe fragile');
  assert.equal(F.sorts.slice(0, 5).map(s => s.id).join(), 'pelle,squelette,spectre,terre,pelletee');
  const c = new Combat(DATA, { classe: 'fossoyeur', renc: 0, niv: 8, lueurs: [] });
  c.pa = 12;
  const sq = c.S.findIndex(s => s.id == 'squelette'), sp = c.S.findIndex(s => s.id == 'spectre');
  const p = c.ranged(sq)[0], q = c.ranged(sp)[1];
  assert.ok(c.cast(sq, p[0], p[1]).summon, 'squelette');
  assert.ok(c.cast(sp, q[0], q[1]).summon, 'spectre');
  assert.equal(c.allies.map(a => a.n).join(), 'Squelette de service,Spectre farceur');
  assert.ok(c.allies[0].hp > 24 && c.allies[0].d >= 7, 'les stats montent avec le niveau du heros');
});

test('Fossoyeur lot 2 : soin d une invocation, sacrifice explosif, renfort plus solide, malediction', () => {
  const F = DATA.classes.fossoyeur;
  assert.equal(F.sorts.slice(5, 9).map(s => s.id).join(), 'heure,sacrifice,renfort,malediction');
  const c = new Combat(DATA, { classe: 'fossoyeur', renc: 0, niv: 22, lueurs: [] });
  c.pa = 20;
  const I = id => c.S.findIndex(s => s.id == id);
  const sq = I('squelette'), re = I('renfort');
  const p = c.ranged(sq)[0]; c.cast(sq, p[0], p[1]);
  const q = c.ranged(re)[0]; c.cast(re, q[0], q[1]);
  const [a, b] = c.allies;
  assert.ok(b.hp > a.hp && b.d > a.d, 'le renfort est plus solide que le squelette');
  // soin : cibles = allies seulement, plafonne aux PV max
  const he = I('heure');
  assert.ok(c.ranged(he).every(t => c.at(t[0], t[1]) && c.at(t[0], t[1]).ally), 'soin : allies uniquement');
  a.hp = 1;
  const rc = c.ranged(he).find(t => c.at(t[0], t[1]) === a);
  assert.ok(rc && c.cast(he, rc[0], rc[1]).ok);
  assert.ok(a.hp > 1 && a.hp <= a.max);
  const full = b.hp;
  const rb = c.ranged(he).find(t => c.at(t[0], t[1]) === b);
  c.cd[he] = 0;
  c.cast(he, rb[0], rb[1]);
  assert.equal(b.hp, full, 'jamais au-dessus du maximum');
  // sacrifice : l allie meurt et les monstres proches subissent des degats
  const sa = I('sacrifice'), foe = c.foes.find(f => !f.form);
  foe.x = a.x + 1; foe.y = a.y; const hp0 = foe.hp;
  assert.ok(c.ranged(sa).every(t => c.at(t[0], t[1]) && c.at(t[0], t[1]).ally), 'sacrifice : allies uniquement');
  const rs = c.ranged(sa).find(t => c.at(t[0], t[1]) === a);
  assert.ok(c.cast(sa, rs[0], rs[1]).ok);
  assert.equal(a.hp, 0, 'invocation sacrifiee');
  assert.ok(foe.hp < hp0, 'explosion sur le monstre voisin');
  // malediction : degats et affaibli
  const ma = I('malediction'), foe2 = c.foes.find(f => f.hp > 0 && !f.form);
  foe2.x = c.hero.x + 3; foe2.y = c.hero.y; foe2.hp = foe2.max = 500;
  const rm = c.ranged(ma).find(t => c.at(t[0], t[1]) === foe2);
  assert.ok(rm, 'monstre a portee');
  c.cast(ma, rm[0], rm[1]);
  assert.ok(c.hasEtat(foe2, 'affaibli'));
});

test('Fossoyeur lot 3 : classe complete (15 sorts), appel de 2 unites, soin de zone, degats selon les invocations, cercueil et vent', () => {
  const F = DATA.classes.fossoyeur;
  assert.equal(F.sorts.length, 15);
  assert.equal(F.sorts.slice(9).map(s => s.id).join(), 'appel,benediction,cercueil,vent_large,legion,dernier');
  const mk = () => { const c = new Combat(DATA, { classe: 'fossoyeur', renc: 0, niv: 56, lueurs: [], sorts: F.sorts }); c.pa = 40; return c };
  const I = (c, id) => c.S.findIndex(s => s.id == id);
  // appel : 2 unites sur des cases differentes ; avec 1 invocation deja la, une seule de plus
  let c = mk(); let ap = I(c, 'appel'); let p = c.ranged(ap)[0];
  assert.ok(c.cast(ap, p[0], p[1]).ok);
  assert.equal(c.liveAllies().length, 2);
  assert.notEqual(c.allies[0].x + ',' + c.allies[0].y, c.allies[1].x + ',' + c.allies[1].y);
  c = mk(); ap = I(c, 'appel'); const sq = I(c, 'squelette'); p = c.ranged(sq)[0]; c.cast(sq, p[0], p[1]); c.cd[ap] = 0;
  p = c.ranged(ap)[0]; if (p) { c.cast(ap, p[0], p[1]); assert.ok(c.liveAllies().length <= 2) }
  // benediction : soigne et protege toutes les invocations
  c = mk(); ap = I(c, 'appel'); p = c.ranged(ap)[0]; c.cast(ap, p[0], p[1]);
  c.allies.forEach(a => { a.hp = 1 });
  const be = I(c, 'benediction'); assert.ok(c.cast(be, c.hero.x, c.hero.y).ok);
  assert.ok(c.allies.every(a => a.hp > 1 && c.hasEtat(a, 'bouclier')));
  // dernier service : plus fort avec des invocations
  const foeAt = cc => { const f = cc.foes.find(z => !z.form); f.x = cc.hero.x + 1; f.y = cc.hero.y; f.hp = f.max = 9999; return f };
  c = mk(); foeAt(c); const d0 = c.cast(I(c, 'dernier'), c.hero.x, c.hero.y);
  c = mk(); ap = I(c, 'appel'); p = c.ranged(ap)[0]; c.cast(ap, p[0], p[1]); const f2 = foeAt(c);
  const d2 = c.cast(I(c, 'dernier'), c.hero.x, c.hero.y);
  assert.ok(d2.dmg > d0.dmg, 'bonus par invocation : ' + d0.dmg + ' -> ' + d2.dmg);
  // cercueil : degats de zone et etourdissement
  c = mk(); const fz = c.foes.find(z => !z.form); fz.x = c.hero.x + 3; fz.y = c.hero.y; fz.hp = fz.max = 9999;
  const ce = I(c, 'cercueil'), rc = c.ranged(ce).find(t => c.at(t[0], t[1]) === fz);
  assert.ok(rc && c.cast(ce, rc[0], rc[1]).ok);
  assert.ok(fz.hp < 9999 && c.hasEtat(fz, 'etourdi'));
  // vent du large : degats et recul
  c = mk(); const fv = c.foes.find(z => !z.form); fv.x = c.hero.x + 3; fv.y = c.hero.y; fv.hp = fv.max = 9999;
  const vl = I(c, 'vent_large'), rv = c.ranged(vl).find(t => c.at(t[0], t[1]) === fv), x0 = fv.x;
  assert.ok(rv && c.cast(vl, rv[0], rv[1]).ok && fv.hp < 9999);
  assert.ok(fv.x > x0, 'recul : ' + x0 + ' -> ' + fv.x);
});
