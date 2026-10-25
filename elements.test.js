const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function load() {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'donnees.js'), 'utf8') + ';this.D=DATA', context, { filename: 'donnees.js' });
  return context.D;
}

test('les éléments sont Neutre, Vent, Foudre, Ténèbres, Lumière (pas de Feu)', () => {
  const ids = Object.keys(load().elements).sort();
  assert.deepEqual(ids, ['foudre', 'lumiere', 'neutre', 'tenebres', 'vent']);
});

test('chaque élément a une faiblesse, sauf le Neutre', () => {
  const E = load().elements;
  assert.equal(E.neutre.faiblesse, null);
  for (const id of Object.keys(E).filter(k => k !== 'neutre')) {
    assert.ok(E[E[id].faiblesse] && E[id].faiblesse !== 'neutre' && E[id].faiblesse !== id, 'faiblesse invalide : ' + id);
  }
});

test('le cycle est fermé : chaque élément bat exactement un autre (Vent > Foudre > Ténèbres > Lumière > Vent)', () => {
  const E = load().elements, bat = {};
  for (const id of Object.keys(E).filter(k => k !== 'neutre')) bat[E[id].faiblesse] = (bat[E[id].faiblesse] || []).concat(id);
  for (const id of Object.keys(E).filter(k => k !== 'neutre')) assert.equal((bat[id] || []).length, 1, id + ' doit battre un seul élément');
  assert.deepEqual(bat.vent, ['foudre']);
  assert.deepEqual(bat.foudre, ['tenebres']);
  assert.deepEqual(bat.tenebres, ['lumiere']);
  assert.deepEqual(bat.lumiere, ['vent']);
});

test('chaque sort marqué a un élément connu', () => {
  const D = load();
  for (const k in D.classes) for (const s of D.classes[k].sorts) assert.ok(!s.elem || D.elements[s.elem], 'élément inconnu : ' + s.id);
});
