const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = file => fs.readFileSync(path.join(__dirname, file), 'utf8');
const stubs = { Image: function () {}, cfg: { classe: 'porte' }, encodeURIComponent, setTimeout: () => 0, document: {} };

function load() {
  const context = vm.createContext({ ...stubs });
  vm.runInContext(source('donnees.js'), context, { filename: 'donnees.js' });
  vm.runInContext(source('sprites.js').replace(/^const SPR=/m, 'var SPR='), context, { filename: 'sprites.js' });
  vm.runInContext(source('monstres.js'), context, { filename: 'monstres.js' });
  return context;
}

test('chaque sprite de monstre correspond a un monstre existant (pas de faute de nom)', () => {
  const context = load();
  const noms = new Set(vm.runInContext('DATA.rencontres.flatMap(r=>r.m.map(m=>m.n))', context));
  const sprites = vm.runInContext('SPR.names', context);
  assert.ok(sprites.length >= 4);
  for (const nom of sprites) assert.ok(noms.has(nom), 'monstre inconnu : ' + nom);
});

test('les trois classes ont un sprite', () => {
  const context = load();
  for (const classe of ['porte', 'archer', 'mage']) {
    context.cfg.classe = classe;
    assert.equal(vm.runInContext('SPR.heroKey()', context), classe);
  }
});

test('chaque monstre du jeu a son sprite (sinon le jeu retombe sur l emoji)', () => {
  const context = load();
  const noms = new Set(vm.runInContext('DATA.rencontres.flatMap(r=>r.m.map(m=>m.n))', context));
  const sprites = new Set(vm.runInContext('SPR.names', context));
  const manquants = [...noms].filter(n => !sprites.has(n));
  assert.deepEqual(manquants, [], 'monstres sans sprite : ' + manquants.join(', '));
});

test('chaque sprite produit un SVG bien forme', () => {
  const context = load();
  for (const cle of vm.runInContext('SPR.keys', context)) {
    const svg = vm.runInContext('SPR.raw(' + JSON.stringify(cle) + ',false)', context);
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), cle);
    assert.equal((svg.match(/<g[ >]/g) || []).length, (svg.match(/<\/g>/g) || []).length, 'balises g : ' + cle);
  }
});

test('chaque degrade ou filtre utilise par un sprite est defini (sinon le sprite est vide)', () => {
  const context = load();
  for (const cle of vm.runInContext('SPR.keys', context)) {
    const svg = vm.runInContext('SPR.raw(' + JSON.stringify(cle) + ',false)', context);
    const definis = new Set([...svg.matchAll(/id="([A-Za-z0-9_]+)"/g)].map(m => m[1]));
    const utilises = [...svg.matchAll(/url\(#([A-Za-z0-9_]+)\)/g)].map(m => m[1]);
    for (const id of utilises) assert.ok(definis.has(id), cle + ' : #' + id + ' non defini');
  }
});

test('chaque PNJ du jeu a un sprite vectoriel valide', () => {
  const context = load();
  vm.runInContext(source('pnj.js'), context, { filename: 'pnj.js' });
  const noms = vm.runInContext('Object.values(DATA.cartes).flatMap(m=>(m.npcs||[]).map(n=>n.n))', context);
  assert.ok(noms.length >= 30);
  const manquants = Array.from(noms).filter(n => !vm.runInContext('SPR.monKey(' + JSON.stringify(n) + ')', context));
  assert.deepEqual(manquants, [], 'PNJ sans sprite : ' + manquants.join(', '));
  for (const n of noms) {
    const svg = vm.runInContext('SPR.raw(SPR.monKey(' + JSON.stringify(n) + '))', context);
    assert.ok(svg.startsWith('<svg') && svg.length > 400 && !svg.includes('undefined') && !svg.includes('NaN'), 'sprite invalide : ' + n);
  }
});
