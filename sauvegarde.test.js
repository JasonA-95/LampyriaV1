const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = file => fs.readFileSync(path.join(__dirname, file), 'utf8');

// Charge etat.js avec une sauvegarde brute, comme au démarrage du jeu (même faux DOM que scenes.test.js).
function loadState(rawSave) {
  const context = vm.createContext({
    document: (() => {
      const el = () => new Proxy(function () {}, { get: (_t, k) => (k === 'style' ? {} : k === 'classList' ? { add() {}, remove() {}, toggle() {} } : k === 'children' ? [] : el()), apply: () => el(), set: () => true });
      return { createElement: el, head: el(), body: el(), getElementById: el, querySelector: el, querySelectorAll: () => [] };
    })(),
    TextEncoder, btoa, atob,
    localStorage: { getItem: () => rawSave, setItem: () => {} }
  });
  for (const f of ['donnees.js', 'xp.js', 'donjons.js', 'etat.js']) vm.runInContext(source(f), context, { filename: f });
  return context;
}

// Les tableaux/objets d'un contexte vm ont d'autres prototypes : on les copie via JSON avant de comparer.
const val = (ctx, expr) => { const r = vm.runInContext('JSON.stringify(' + expr + ')', ctx); return r === undefined ? undefined : JSON.parse(r); };

test('sauvegarde valide : objets, équipement, Lueurs et carte conservés', () => {
  const ctx = loadState(JSON.stringify({ niv: 12, xp: 40, res: {}, inv: ['tisonnier', 'chapeau'], eq: { arme: 'tisonnier' }, deb: ['gourmande', 'peureuse'], lueurs: ['gourmande'], map: 'foret', cap: 5, renc: 2 }));
  assert.deepEqual(val(ctx, 'sv.inv'), ['tisonnier', 'chapeau']);
  assert.equal(vm.runInContext('sv.eq.arme', ctx), 'tisonnier');
  assert.deepEqual(val(ctx, 'sv.deb'), ['gourmande', 'peureuse']);
  assert.equal(vm.runInContext('sv.map', ctx), 'foret');
  assert.equal(vm.runInContext('sv.niv', ctx), 12);
  assert.equal(vm.runInContext('sv.cap', ctx), 5);
});

test('identifiants inconnus ou piégés retirés, sans plantage de gear()', () => {
  const ctx = loadState(JSON.stringify({ niv: 3, xp: 0, res: {}, inv: ['tisonnier', 'objet_fantome', 'constructor', '__proto__', 42], eq: { arme: 'objet_fantome', tete: 'constructor', corps: 'tisonnier' }, deb: ['gourmande', 'inconnue', 'toString'], lueurs: ['inconnue'], map: 'carte_fantome' }));
  assert.deepEqual(val(ctx, 'sv.inv'), ['tisonnier']);
  assert.equal(vm.runInContext('Object.keys(sv.eq).includes("arme")', ctx), false);
  assert.equal(vm.runInContext('Object.keys(sv.eq).includes("tete")', ctx), false);
  assert.deepEqual(val(ctx, 'sv.deb'), ['gourmande']);
  assert.deepEqual(val(ctx, 'sv.lueurs'), []);
  assert.equal(vm.runInContext('sv.map', ctx), undefined);
  assert.doesNotThrow(() => vm.runInContext('gear()', ctx));
});

test('nombres falsifiés (texte HTML) remplacés par les valeurs par défaut', () => {
  const evil = '<img src=x onerror=alert(1)>';
  const ctx = loadState(JSON.stringify({ niv: 5, xp: evil, res: {}, inv: [], cap: evil, renc: evil, pity: NaN }));
  for (const k of ['xp', 'cap', 'renc', 'pity']) assert.equal(typeof vm.runInContext('sv.' + k, ctx), 'number', k);
  assert.equal(vm.runInContext('Number.isFinite(sv.xp)', ctx), true);
  assert.equal(vm.runInContext('sv.niv', ctx), 5);
});

test('structures de mauvais type (inv, eq, deb) ne plantent pas le chargement', () => {
  const ctx = loadState(JSON.stringify({ niv: 2, xp: 0, res: {}, inv: 'tisonnier', eq: ['tisonnier'], deb: 'gourmande' }));
  assert.deepEqual(val(ctx, 'sv.inv'), []);
  assert.deepEqual(val(ctx, 'sv.eq'), {});
  assert.deepEqual(val(ctx, 'sv.deb'), []);
});

// Charge etat.js avec un stockage qui refuse l'écriture et un faux élément « toast » pour lire le message affiché.
function loadWithFailingStorage(save) {
  const toastEl = { textContent: '', classList: { add() {}, remove() {} } };
  const proxyEl = () => new Proxy(function () {}, { get: (_t, k) => (k === 'style' ? {} : k === 'classList' ? { add() {}, remove() {}, toggle() {} } : k === 'children' ? [] : proxyEl()), apply: () => proxyEl(), set: () => true });
  const context = vm.createContext({
    document: { createElement: proxyEl, head: proxyEl(), body: proxyEl(), getElementById: id => (id === 'toast' ? toastEl : proxyEl()), querySelector: proxyEl, querySelectorAll: () => [] },
    TextEncoder, btoa, atob, setTimeout, clearTimeout,
    localStorage: { getItem: () => JSON.stringify(save), setItem: () => { throw new Error('QuotaExceededError'); } }
  });
  for (const f of ['donnees.js', 'xp.js', 'donjons.js', 'etat.js']) vm.runInContext(source(f), context, { filename: f });
  return { context, toastEl };
}

test('échec d’écriture : le joueur est prévenu une seule fois', () => {
  const { context, toastEl } = loadWithFailingStorage({ niv: 2, xp: 0, res: {}, inv: [], hist: { vus: ['prologue'], flags: {} } });
  vm.runInContext('store()', context);
  assert.match(toastEl.textContent, /Sauvegarde impossible/);
  toastEl.textContent = '';
  vm.runInContext('store()', context);
  assert.equal(toastEl.textContent, '', 'pas de message répété à chaque échec');
});

test('échec d’écriture dès le chargement : avertissement immédiat, une seule fois, sans plantage', () => {
  // Sans « hist », etat.js appelle store() pendant le chargement.
  const { context, toastEl } = loadWithFailingStorage({ niv: 2, xp: 0, res: {}, inv: [] });
  assert.match(toastEl.textContent, /Sauvegarde impossible/);
  toastEl.textContent = '';
  vm.runInContext('store()', context);
  assert.equal(toastEl.textContent, '');
});

test('migration : les points de l\'ancien talent Force (dmg) deviennent des points de Neutre, sans perte', () => {
  const ctx = loadState(JSON.stringify({ niv: 12, xp: 0, res: {}, tal: { pv: 2, dmg: 3, res: 1 } }));
  assert.equal(vm.runInContext('sv.tal.neutre', ctx), 3);
  assert.equal(vm.runInContext("'dmg' in sv.tal", ctx), false);
  assert.equal(vm.runInContext('talSpent()', ctx), 5);
  assert.equal(vm.runInContext('talLeft()', ctx), 11 - 5);
  assert.equal(vm.runInContext('gear().t.neutre', ctx), 3);
});

test('talents d\'éléments : valeurs falsifiées ramenées à 0 et points cumulés dans gear()', () => {
  const ctx = loadState(JSON.stringify({ niv: 30, xp: 0, res: {}, tal: { vent: 4, foudre: '<img>', tenebres: -9, lumiere: 2 } }));
  assert.equal(vm.runInContext('sv.tal.foudre', ctx), 0);
  assert.equal(vm.runInContext('sv.tal.tenebres', ctx), 0);
  assert.equal(vm.runInContext('gear().t.vent', ctx), 4);
  assert.equal(vm.runInContext('gear().t.lumiere', ctx), 2);
});

test('l\'ancien talent Endurance est supprimé : ses points sont rendus et la résistance ne vient plus que de l\'équipement', () => {
  const ctx = loadState(JSON.stringify({ niv: 20, xp: 0, res: {}, tal: { pv: 4, res: 6 } }));
  assert.equal(vm.runInContext("'res' in sv.tal", ctx), false);
  assert.equal(vm.runInContext("TAL.some(t => t[0] === 'res')", ctx), false);
  assert.equal(vm.runInContext('talSpent()', ctx), 4);
  assert.equal(vm.runInContext('talLeft()', ctx), 19 - 4);
  assert.equal(vm.runInContext('gear().t.res', ctx), 0);
});

test('PV persistants et potions : valeurs invalides nettoyées, piles plafonnées à 50, montée de niveau = PV max', () => {
  const ctx = loadState(JSON.stringify({ niv: 3, pv: 'x', conso: { tisane: 99, inconnue: 4, baume: -2 } }));
  assert.equal(val(ctx, 'sv.pv'), null);
  assert.deepEqual(val(ctx, 'sv.conso'), { tisane: 50 });
  const ok = loadState(JSON.stringify({ niv: 3, pv: 12 }));
  assert.equal(val(ok, 'sv.pv'), 12);
  assert.equal(val(ok, 'pvNow()'), 12);
  vm.runInContext('sv.pv=999999', ok);
  assert.equal(val(ok, 'pvNow()'), val(ok, 'pvMax()'));
  vm.runInContext('sv.pv=12;XP.add(sv,1)', ok);
  assert.equal(val(ok, 'sv.pv'), 12, 'sans montée de niveau, les PV ne changent pas');
  vm.runInContext('XP.add(sv,XP.next(sv.niv))', ok);
  assert.equal(val(ok, 'sv.pv'), null, 'montée de niveau : PV au maximum');
});
