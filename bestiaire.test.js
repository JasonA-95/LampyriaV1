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
    TextEncoder, btoa, atob,
    localStorage: { getItem: () => rawSave, setItem: () => {} }
  });
  for (const f of ['donnees.js', 'xp.js', 'donjons.js', 'etat.js']) vm.runInContext(source(f), context, { filename: f });
  return context;
}
const val = (ctx, expr) => { const r = vm.runInContext('JSON.stringify(' + expr + ')', ctx); return r === undefined ? undefined : JSON.parse(r); };

test('ancienne sauvegarde sans bestiaire : sv.bes vide par défaut', () => {
  const c = loadState(JSON.stringify({ niv: 5, xp: 0 }));
  assert.deepEqual(val(c, 'sv.bes'), {});
});

test('sv.bes corrompu (tableau, texte) est réinitialisé', () => {
  assert.deepEqual(val(loadState(JSON.stringify({ niv: 5, bes: [1, 2] })), 'sv.bes'), {});
  assert.deepEqual(val(loadState(JSON.stringify({ niv: 5, bes: 'x' })), 'sv.bes'), {});
});

test('sv.bes valide conservé', () => {
  assert.deepEqual(val(loadState(JSON.stringify({ niv: 5, bes: { 'La mouche à braise': 4 } })), 'sv.bes'), { 'La mouche à braise': 4 });
});

test('besNote compte chaque monstre vaincu, ignore les entités de forme (voile) et le mode test passe par l\'appelant', () => {
  const c = loadState(JSON.stringify({ niv: 1 }));
  vm.runInContext("besNote({m:[{n:'A'},{n:'A'},{n:'B'},{n:'Voile',form:1}]});besNote({m:[{n:'A'}]})", c);
  assert.deepEqual(val(c, 'sv.bes'), { A: 3, B: 1 });
});

test('besIndex : toutes les rencontres sont indexées, sans doublon ni entité de forme', () => {
  const c = loadState(JSON.stringify({ niv: 1 }));
  const idx = val(c, 'besIndex()');
  const noms = Object.keys(idx);
  assert.ok(noms.length >= 50, 'au moins 50 monstres distincts, trouvé ' + noms.length);
  for (const n of noms) { assert.ok(idx[n].e, 'emoji manquant : ' + n); assert.ok(idx[n].hp > 0, 'PV manquants : ' + n); }
  const formes = val(c, "DATA.rencontres.flatMap(r=>r.m).filter(m=>m.form).map(m=>m.n)");
  for (const f of formes) assert.ok(!(f in idx) || vm.runInContext(`DATA.rencontres.some(r=>r.m.some(m=>m.n==${JSON.stringify(f)}&&!m.form))`, c), 'forme indexée : ' + f);
  assert.ok(idx['La mouche à braise'] && idx['La mouche à braise'].zones.length >= 1);
});
