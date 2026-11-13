const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const load = () => { const c = vm.createContext({ Math, JSON, console }); vm.runInContext(fs.readFileSync(__dirname + '/donnees.js', 'utf8') + '\n' + fs.readFileSync(__dirname + '/suivi.js', 'utf8') + ';this.D=DATA;this.S=SUIVI', c); return c; };

test('quête de ramassage : cartes avec les points restants, route depuis une autre carte', () => {
  const { D, S } = load();
  const L = S.lieux('q1', { s: 1, n: 0, got: [] }, {});
  assert.ok(L.maps.includes('village') && L.maps.includes('quartier'));
  assert.equal(S.route('foret', L.maps).to, 'village');
  assert.equal(S.route('village', L.maps), null);
  const L2 = S.lieux('q1', { s: 1, n: 1, got: ['village0'] }, {});
  assert.ok(L2.maps.includes('quartier') && !L2.maps.includes('village'));
});

test('quête prête : on va voir le donneur ; non prête avec coût manquant : on reste sur l objectif', () => {
  const { D, S } = load();
  const P = S.lieux('q1', { s: 1, n: 3, got: [] }, {});
  assert.equal(P.pret, 1);
  assert.deepEqual([...P.npc], ['Maître Lampiste']);
  assert.deepEqual([...P.maps], ['village']);
  const q3 = S.lieux('q3', { s: 1, n: 3, got: [] }, { champi: 0 });
  assert.ok(!q3.pret && q3.maps.includes('foret'));
  assert.equal(S.lieux('q3', { s: 1, n: 3, got: [] }, { champi: 3 }).pret, 1);
});

test('livre : les PNJ restants ; win : cartes du combat ; quête non en cours : null', () => {
  const { D, S } = load();
  const L = S.lieux('d2', { s: 1, n: 1, got: ['Chamelier'] }, {});
  assert.deepEqual([...L.npc], ['Marchand de chaussettes', "Hôtelier de l'oasis"]);
  assert.ok(L.maps.length >= 1);
  const W = S.lieux('d3', { s: 1, n: 0 }, {});
  assert.ok(W.maps.length >= 1);
  assert.equal(S.lieux('q1', { s: 2 }, {}), null);
  assert.equal(S.lieux('q1', undefined, {}), null);
});

test('toutes les quêtes en cours ont un but et une route depuis le village', () => {
  const { D, S } = load();
  for (const id of Object.keys(D.quetes)) {
    const L = S.lieux(id, { s: 1, n: 0, got: [] }, {});
    assert.ok(L, id);
    if (L.maps.length) assert.notEqual(S.route('village', L.maps), undefined, 'route introuvable pour ' + id);
  }
});

test('sorties de bord : direction connue', () => {
  const { S } = load();
  assert.deepEqual([...S.DIR.E], [1, -1]);
  assert.equal(Object.keys(S.DIR).length, 4);
});
