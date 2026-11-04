const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = file => fs.readFileSync(path.join(__dirname, file), 'utf8');
function loadState(rawSave) {
  const context = vm.createContext({
    document: (() => {
      const el = () => new Proxy(function () {}, { get: (_t, k) => (k === 'style' ? {} : k === 'classList' ? { add() {}, remove() {}, toggle() {} } : k === 'children' ? [] : el()), apply: () => el() });
      return { createElement: el, head: el(), body: el(), getElementById: el, querySelector: el, querySelectorAll: () => [] };
    })(),
    TextEncoder, btoa, atob, clearTimeout() {}, setTimeout() { return 0 },
    localStorage: { getItem: () => rawSave, setItem: () => {} }
  });
  for (const f of ['donnees.js', 'xp.js', 'donjons.js', 'etat.js', 'succes.js']) vm.runInContext(source(f), context, { filename: f });
  return context;
}
const val = (ctx, expr) => { const r = vm.runInContext('JSON.stringify(' + expr + ')', ctx); return r === undefined ? undefined : JSON.parse(r); };

test('liste de succès : ids uniques, récompenses valides', () => {
  const c = loadState(JSON.stringify({ niv: 1 }));
  const ids = val(c, 'SUCCES.map(s=>s.id)');
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.length >= 20);
  assert.equal(vm.runInContext("SUCCES.every(s=>s.d&&s.n&&s.need>0&&typeof s.v()=='number')", c), true);
  assert.equal(vm.runInContext("SUCCES.every(s=>{const r=s.rew||{};return Object.keys(r.res||{}).every(k=>k in DATA.res)&&Object.keys(r.conso||{}).every(k=>k in DATA.conso)&&(!r.etin||DATA.etin[r.etin]&&DATA.etin[r.etin].succ)})", c), true);
  const succEtin = vm.runInContext("SUCCES.filter(s=>(s.rew||{}).etin).map(s=>s.rew.etin)", c);
  assert.deepEqual([...succEtin].sort(), ['s_chasse', 's_atelier', 's_journal', 's_memoire'].sort(), 'chaque étincelle de succès est donnée par un succès');
});

test('nouvelle partie : aucun succès débloqué', () => {
  const c = loadState(JSON.stringify({ niv: 1 }));
  assert.deepEqual(val(c, 'succCheck().map(s=>s.id)'), []);
});

test('déblocage unique, récompenses données une seule fois', () => {
  const c = loadState(JSON.stringify({ niv: 20, res: { braise: 0 }, conso: { baume: 49 } }));
  const a = val(c, 'succCheck().map(s=>s.id)');
  assert.deepEqual(a.sort(), ['niv20', 'niv5']);
  assert.equal(val(c, 'sv.conso.baume'), 50, 'pile plafonnée à 50');
  assert.equal(val(c, 'sv.conso.tisane'), 2);
  assert.deepEqual(val(c, 'succCheck()'), [], 'pas de second déblocage');
  assert.equal(val(c, 'sv.conso.tisane'), 2, 'récompense non redonnée');
});

test('étincelle de succès : ajoutée une fois, équipable ensuite', () => {
  const c = loadState(JSON.stringify({ niv: 1, met: { herbo: { xp: 0, niv: 20 }, mine: { xp: 0, niv: 20 }, pous: { xp: 0, niv: 20 }, tiss: { xp: 0, niv: 20 } } }));
  vm.runInContext('succCheck()', c);
  assert.deepEqual(val(c, 'sv.etin.got'), ['s_atelier']);
  vm.runInContext('succCheck()', c);
  assert.deepEqual(val(c, 'sv.etin.got'), ['s_atelier']);
});

test('sv.succ corrompu est réinitialisé sans casser la partie', () => {
  const c = loadState(JSON.stringify({ niv: 1, succ: [1] }));
  vm.runInContext('succCheck()', c);
  assert.deepEqual(val(c, 'sv.succ'), {});
});

test('fin de l\'histoire : sv.renc 18 débloque « Le soleil revient »', () => {
  const c = loadState(JSON.stringify({ niv: 1, renc: 18 }));
  assert.ok(val(c, 'succCheck().map(s=>s.id)').includes('boss4'));
});
