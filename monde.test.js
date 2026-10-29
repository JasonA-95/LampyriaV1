const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

// Validateur du monde : vérifie la cohérence des cartes, des sorties, des objets posés et des quêtes.
// Sert de filet de sécurité avant d'agrandir la carte du monde (phase A).
const ctx = vm.createContext({ console, Math, Object, Array, JSON, Set, Map });
let code = '';
for (const f of ['donnees.js', 'xp.js', 'histoire.js', 'donjons.js']) code += fs.readFileSync(path.join(__dirname, f), 'utf8') + '\n;';
vm.runInContext(code + ';this.D=DATA', ctx);
const D = ctx.D, C = D.cartes, L = D.monde, N = D.taille;
const key = (x, y) => x + ',' + y;
const ENTS = ['npcs', 'picks', 'groups', 'nodes', 'coffres', 'hides'];
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// Défauts déjà présents, connus, à corriger séparément. Tout autre problème fait échouer le test.
const CONNUS = [
  'temple.nodes@2,10: même case que npcs'
];
const sansConnus = liste => liste.filter(p => !CONNUS.includes(p));
const norm = s => String(s).replace(/^(le |la |les |l[’'])/i, '').trim();

test('monde : chaque carte a une position sur la grille du monde, et chaque position une carte', () => {
  const p = [];
  for (const k of Object.keys(C)) if (!L[k]) p.push('carte sans position : ' + k);
  for (const k of Object.keys(L)) if (!C[k]) p.push('position sans carte : ' + k);
  assert.deepEqual(p, []);
});

test('monde : les sorties mènent à une carte existante et sont symétriques', () => {
  const p = [];
  for (const [k, m] of Object.entries(C)) for (const e of m.exits) {
    if (!C[e.to]) p.push(k + ' : sortie vers une carte inconnue ' + e.to);
    else if (!C[e.to].exits.some(x => x.to === k)) p.push(k + ' -> ' + e.to + ' : sortie non symétrique');
  }
  assert.deepEqual(p, []);
});

test('monde : aucun objet hors carte, sur un rocher, sur une sortie ou superposé à un autre', () => {
  const p = [];
  for (const [k, m] of Object.entries(C)) {
    const rocks = new Set(m.rocks.map(r => key(r[0], r[1]))), vus = new Map(), sorties = new Set(m.exits.map(e => key(e.x, e.y)));
    for (const q of ENTS) for (const o of m[q] || []) {
      const id = key(o.x, o.y), lab = k + '.' + q + '@' + id;
      if (o.x < 0 || o.y < 0 || o.x >= N || o.y >= N) p.push(lab + ': hors carte');
      if (rocks.has(id)) p.push(lab + ': sur un rocher');
      if (sorties.has(id)) p.push(lab + ': sur une sortie');
      if (vus.has(id)) p.push(lab + ': même case que ' + vus.get(id)); else vus.set(id, q);
    }
  }
  assert.deepEqual(sansConnus(p), []);
});

test('monde : tout ce qui est posé sur une carte est accessible depuis son point de départ', () => {
  const p = [];
  for (const [k, m] of Object.entries(C)) {
    const rocks = new Set(m.rocks.map(r => key(r[0], r[1]))), s = m.start, vu = new Set([key(s[0], s[1])]), file = [[s[0], s[1]]];
    while (file.length) {
      const [x, y] = file.shift();
      for (const [a, b] of DIRS) { const nx = x + a, ny = y + b, kk = key(nx, ny); if (nx < 0 || ny < 0 || nx >= N || ny >= N || rocks.has(kk) || vu.has(kk)) continue; vu.add(kk); file.push([nx, ny]); }
    }
    for (const q of ENTS) for (const o of m[q] || [])
      if (!vu.has(key(o.x, o.y)) && !DIRS.some(([a, b]) => vu.has(key(o.x + a, o.y + b)))) p.push(k + '.' + q + '@' + key(o.x, o.y) + ' : inaccessible');
  }
  assert.deepEqual(p, []);
});

test('monde : toutes les cartes sont reliées au village par les sorties', () => {
  const atteint = new Set(['village']), pile = ['village'];
  while (pile.length) { const k = pile.pop(); for (const e of C[k].exits) if (!atteint.has(e.to)) { atteint.add(e.to); pile.push(e.to); } }
  assert.deepEqual(Object.keys(C).filter(k => !atteint.has(k)), []);
});

test('monde : les références des quêtes sont valides (PNJ, rencontres, ramassages)', () => {
  const p = [], noms = new Set(), ids = new Set();
  Object.values(C).forEach(m => (m.npcs || []).forEach(n => { noms.add(n.n); (n.quests || []).forEach(q => ids.add(q)); }));
  for (const [k, m] of Object.entries(C)) {
    for (const g of m.groups || []) if (!D.rencontres[g.renc]) p.push(k + ' : groupe vers une rencontre inconnue ' + g.renc);
    for (const o of (m.picks || []).concat(m.hides || [])) if (!D.quetes[o.quest]) p.push(k + ' : ramassage pour une quête inconnue ' + o.quest);
    for (const n of m.npcs || []) for (const id of n.quests || []) if (!D.quetes[id]) p.push(k + ' : ' + n.n + ' propose une quête inconnue ' + id);
  }
  const nomsNorm = new Set([...noms].map(norm));
  for (const [id, q] of Object.entries(D.quetes)) {
    if (q.donneur && !nomsNorm.has(norm(q.donneur))) p.push('quête ' + id + ' : donneur inconnu ' + q.donneur);
    for (const t of [].concat(q.to || [])) if (!noms.has(t)) p.push('quête ' + id + ' : destinataire inconnu ' + t);
    if (q.kind === 'win' && !D.rencontres[q.renc]) p.push('quête ' + id + ' : rencontre inconnue ' + q.renc);
    if (!ids.has(id)) p.push('quête ' + id + ' : proposée par aucun PNJ');
  }
  assert.deepEqual(p, []);
});

test('quêtes de combat par cartes : les cartes existent et offrent assez de groupes non boss pour finir la quête', () => {
  const D = ctx.D, p = [];
  for (const [id, q] of Object.entries(D.quetes)) {
    if (q.kind !== 'win' || !q.maps) continue;
    if (q.defi) p.push('quête ' + id + ' : un défi de combat doit viser un groupe précis');
    const groupes = q.maps.flatMap(m => { if (!D.cartes[m]) { p.push('quête ' + id + ' : carte inconnue ' + m); return []; } return (D.cartes[m].groups || []).filter(g => !D.rencontres[g.renc].n.includes('boss')); });
    if (groupes.length < q.need) p.push('quête ' + id + ' : seulement ' + groupes.length + ' groupe(s) pour ' + q.need);
  }
  assert.deepEqual(p, []);
});
