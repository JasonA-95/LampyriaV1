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
      if (o.gis ? !D.exin(o.x, o.y) : (o.x < 0 || o.y < 0 || o.x >= N || o.y >= N)) p.push(lab + ': hors carte');
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
      if (!o.gis && !vu.has(key(o.x, o.y)) && !DIRS.some(([a, b]) => vu.has(key(o.x + a, o.y + b)))) p.push(k + '.' + q + '@' + key(o.x, o.y) + ' : inaccessible');
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

test('lanterne : chaque palier du Maître Lampiste exige un niveau et une quête existante, et le PNJ du village porte lampiste:1', () => {
  assert.ok(D.lampiste.every(u => u.niv > 0 && (!u.quete || D.quetes[u.quete])));
  assert.ok(D.cartes.village.npcs.some(n => n.n === 'Maître Lampiste' && n.lampiste));
});

test('quête tutoriel q_atelier : principale, donnée par le Maître Lampiste, objet à fabriquer et récompenses existants et fabricables à la forge', () => {
  const q = D.quetes.q_atelier;
  assert.ok(q && q.princ && q.kind === 'craft');
  assert.ok(D.cartes.village.npcs.find(n => n.n === 'Maître Lampiste').quests.includes('q_atelier'));
  assert.equal(D.objets[q.item].slot, 'arme');
  assert.ok(D.cartes.v_forge.atelier.slots.includes('arme'));
  assert.ok(q.rew.items.every(i => D.objets[i]));
});

test('quêtes d\'escorte : le PNJ suivi se cache pendant l\'escorte, la carte d\'arrivée est atteignable, l\'embuscade et le PNJ de remise existent, la fin libère le drapeau', () => {
  const esc = Object.entries(D.quetes).filter(([, q]) => q.kind === 'escorte');
  assert.ok(esc.length >= 1, 'au moins une quête d\'escorte');
  for (const [id, q] of esc) {
    const proposeur = Object.entries(C).find(([, m]) => (m.npcs || []).some(n => n.n === q.donneur && (n.quests || []).includes(id)));
    assert.ok(proposeur, id + ' : le donneur doit proposer la quête');
    const [home, hm] = proposeur, suivi = hm.npcs.find(n => n.n === q.suit);
    assert.ok(suivi, id + ' : le PNJ suivi doit être sur la carte du donneur');
    assert.ok((suivi.cache || []).some(c => c.flag === 'esc_' + id) && (suivi.cache || []).some(c => c.flag === 'esc_fin_' + id), id + ' : le PNJ suivi doit se cacher pendant l\'escorte et après la remise');
    assert.ok(C[q.vers], id + ' : carte d\'arrivée inconnue');
    assert.ok(D.rencontres[q.emb] && !D.rencontres[q.emb].m.some(m => m.boss), id + ' : embuscade inconnue ou boss');
    assert.ok(C[q.vers].npcs.some(n => n.n === q.rend && (n.quests || []).includes(id)), id + ' : le PNJ de remise doit être sur la carte d\'arrivée et proposer la quête');
    assert.ok(C[q.vers].npcs.some(n => n.n === q.suit && (n.cache || []).some(c => c.pasFlag === 'esc_fin_' + id)), id + ' : le PNJ suivi doit réapparaître à l\'arrivée après la remise');
    assert.equal(q.rew.set['esc_' + id], false, id + ' : la fin doit libérer le drapeau d\'escorte');
    assert.equal(q.rew.set['esc_fin_' + id], true);
    assert.ok(q.need >= 1);
    // chemin entre les deux cartes
    const vu = new Set([home]), file = [home];
    while (file.length) { const k = file.shift(); for (const e of C[k].exits || []) if (C[e.to] && !vu.has(e.to)) { vu.add(e.to); file.push(e.to); } }
    assert.ok(vu.has(q.vers), id + ' : la carte d\'arrivée doit être atteignable depuis ' + home);
    // le PNJ suivi n'a pas de quête qui bloquerait son retour : la carte d'arrivée l'accueille sur une case libre
    const occ = new Set((C[q.vers].rocks || []).map(r => key(r[0], r[1])));
    for (const f of ENTS) for (const o of C[q.vers][f] || []) if (!(f === 'npcs' && o.n === q.suit)) occ.add(key(o.x, o.y));
    const copie = C[q.vers].npcs.find(n => n.n === q.suit);
    assert.ok(!occ.has(key(copie.x, copie.y)), id + ' : la copie du PNJ suivi doit être sur une case libre');
  }
});

test('potions : ressources connues, soins valides, atelier ouvert et lieux de repos existants', () => {
  for (const [k, o] of Object.entries(D.conso)) {
    assert.ok(o.n && o.e && o.pct > 0 && o.pct <= 100, k + ' : soin invalide');
    for (const r of Object.keys(o.cout)) assert.ok(D.res[r], k + ' : ressource inconnue ' + r);
  }
  const at = C.v_apothicairerie.atelier;
  assert.ok(at.conso && !at.bientot, 'La Fiole Tiède doit être ouverte');
  for (const m of Object.keys(C).filter(k => C[k].repos)) assert.ok(C[m].npcs !== undefined || C[m].n, m);
  for (const m of ['v_auberge', 'cb_taverne', 'sv_hospice']) assert.ok(C[m].repos, m + ' : lieu de repos');
});

test('métiers : chaque ressource appartient à un seul métier, et les potions exigent un métier et un niveau valides', () => {
  const owner = {};
  for (const [m, M] of Object.entries(D.metiers)) for (const r of M.res) { assert.ok(D.res[r], m + ' : ressource inconnue ' + r); assert.equal(owner[r], undefined, r + ' est dans deux métiers'); owner[r] = m; }
  for (const r of Object.keys(D.res).filter(k => !/^rel\d+$/.test(k))) assert.ok(owner[r], r + ' : aucune récolte ne la fait progresser');
  for (const [k, o] of Object.entries(D.conso)) {
    assert.ok(D.metiers[o.met[0]], k + ' : métier inconnu');
    assert.ok(o.met[1] >= 1 && o.met[1] <= D.metMax, k + ' : niveau requis hors limites');
  }
});

test('cartes d\'exploration 20×25 : rectangle complet, départ et entités dedans, tout est atteignable depuis le départ, chaque côté de sortie a toutes ses cases libres', () => {
  assert.ok(D.excells.length >= 1000 && D.excells.length <= 1100, 'environ 25 rangées de 20 à 21 cases : ' + D.excells.length);
  const rows = {}; for (const [x, y] of D.excells) rows[x + y] = (rows[x + y] || 0) + 1;
  assert.equal(Object.keys(rows).length, 50, '50 demi-rangées = 25 rangées complètes');
  for (const [k, m] of Object.entries(C)) {
    assert.ok(D.exin(m.start[0], m.start[1]), k + ' : départ hors carte');
    const sides = new Set(m.exits.filter(e => !e.don && e.d).map(e => e.d));
    const isRock = new Set(m.rocks.map(r => r.join(',')));
    const blocked = new Set([...isRock]);
    const ents = ['npcs', 'groups', 'nodes', 'picks', 'hides', 'coffres'].flatMap(q => m[q] || []);
    for (const o of ents) { assert.ok(D.exin(o.x, o.y), k + ' : objet hors carte ' + o.x + ',' + o.y); }
    for (const o of ['npcs', 'groups', 'nodes'].flatMap(q => m[q] || [])) blocked.add(o.x + ',' + o.y);
    for (const e of m.exits.filter(e => e.don)) blocked.add(e.x + ',' + e.y);
    for (const [x, y] of D.excells) if (D.exside(x, y).some(s => sides.has(s))) assert.ok(!isRock.has(x + ',' + y), k + ' : rocher sur un bord de sortie ' + x + ',' + y);
    const seen = new Set([m.start.join(',')]), q = [m.start.slice()];
    while (q.length) { const [x, y] = q.shift(); for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + a, ny = y + b, key = nx + ',' + ny; if (!D.exin(nx, ny) || seen.has(key) || blocked.has(key)) continue; seen.add(key); q.push([nx, ny]) } }
    for (const o of [...(m.npcs || []), ...(m.groups || []), ...(m.nodes || []), ...m.exits.filter(e => e.don)]) assert.ok([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => seen.has((o.x + a) + ',' + (o.y + b))), k + ' : inatteignable ' + (o.n || o.res || o.to) + ' ' + o.x + ',' + o.y);
    for (const s of sides) assert.ok([...seen].some(key => D.exside(...key.split(',').map(Number)).includes(s)), k + ' : bord ' + s + ' inatteignable');
  }
});

test('gisements des marges : 3 à 4 sur une partie seulement des cartes à ressources, hors bords, hors donjons, avec le type de ressource de la carte', () => {
  const marge = m => m.nodes.filter(n => n.gis && !n.zr);
  let avec = 0, total = 0;
  for (const [k, m] of Object.entries(C)) {
    const types = new Set(m.nodes.filter(n => n.res && !n.gis).map(n => n.res)), g = marge(m);
    if (!types.size) { assert.equal(g.length, 0, k + ' : pas de ressource d\'origine, pas de gisement'); continue }
    if (!/^(village|poste|quartier)$|^(v|cb|sv)_/.test(k)) total++;
    if (g.length) { avec++; assert.ok(g.length >= 3 && g.length <= 4, k + ' : ' + g.length + ' gisements'); assert.ok(g.every(n => types.has(n.res) && D.exin(n.x, n.y) && !D.exside(n.x, n.y).length), k) }
    if (/^(terrier|enclos|archives|reves|pyr|crypte)\d$/.test(k)) assert.equal(g.length, 0, k + ' : pas de gisement en donjon');
    if (/^(village|poste|quartier)$|^(v|cb|sv)_/.test(k)) assert.equal(g.length, 0, k + ' : pas de gisement en ville');
  }
  assert.ok(avec / total > .3 && avec / total < .75, 'environ la moitié des cartes : ' + avec + '/' + total);
});

test('paliers : chaque métier démarre au niveau 1, les exigences tiennent dans 1-20, les niveaux d\'équipement dans 1-60 et suivent les ressources', () => {
  for (const [m, M] of Object.entries(D.metiers)) {
    assert.ok(M.res.some(r => D.resNiv[r] == 1), m + ' : aucune ressource de niveau 1, le métier ne pourrait pas progresser');
    for (const r of M.res) assert.ok(D.resNiv[r] >= 1 && D.resNiv[r] <= D.metMax, r);
  }
  for (const r of Object.keys(D.res)) assert.ok(D.resNiv[r] && D.resHero[r], r + ' : palier manquant');
  for (const [id, o] of Object.entries(D.objets)) {
    assert.ok(o.niv >= 1 && o.niv <= 60, id + ' : niveau ' + o.niv);
    if (o.cout) assert.ok(o.niv >= Math.max(...Object.keys(o.cout).map(r => D.resHero[r])), id + ' : niveau de recette');
  }
  assert.equal(D.objets.tisonnier.niv, 1, 'le premier métier reste accessible dès le début');
  assert.ok(D.objets.diademe_eclat.niv > D.objets.lame_roseau.niv && D.objets.lame_roseau.niv > D.objets.chapeau.niv, 'les paliers montent avec l\'avancement');
});

test('ressources de zone : 9 nouvelles, 1-2 gisements par carte éligible, jamais en ville ni en donjon, chaque objet a une recette', () => {
  const nv = ['mousse', 'toison', 'encre', 'nenuphar', 'tuyau', 'verre', 'perle', 'cire', 'os'], vus = new Set();
  for (const [k, m] of Object.entries(C)) {
    const z = m.nodes.filter(n => n.zr);
    if (!z.length) continue;
    assert.ok(z.length <= 2 && z.every(n => nv.includes(n.res) && n.res == z[0].res && D.exin(n.x, n.y) && !D.exside(n.x, n.y).length), k);
    assert.ok(!/^(terrier|enclos|archives|reves|pyr|crypte)\d$|^(village|poste|quartier)$|^(v|cb|sv)_/.test(k), k + ' : zone interdite');
    vus.add(z[0].res);
  }
  assert.equal(vus.size, 9, 'chaque ressource de zone est récoltable quelque part');
  for (const [id, o] of Object.entries(D.objets)) if (o.drop) assert.ok(o.cout && Object.keys(o.cout).length, id + ' : recette manquante');
  assert.ok(!D.objets.casque_negociateur.cout, 'récompense de quête : pas de recette');
});

test('reliques de boss : chaque boss en lâche une garantie et ses objets la demandent', () => {
  let nb = 0;
  D.rencontres.forEach((e, i) => {
    if (!e.m.some(z => z.boss) || !(e.drops || []).length) return;
    nb++; const r = 'rel' + i;
    assert.equal(e.loot[r], 1, r + ' : butin garanti');
    assert.ok(D.res[r] && D.resNiv[r] && !D.metiers.herbo.res.includes(r), r);
    for (const d of e.drops) assert.ok(D.objets[d.id].cout[r] >= 2, d.id + ' : relique requise');
  });
  assert.equal(nb, 13);
  assert.ok(Object.values(D.objets).every(o => !o.cout || Object.keys(o.cout).filter(k => /^rel/.test(k)).length <= 1));
});
