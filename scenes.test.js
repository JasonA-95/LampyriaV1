const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = __dirname;
const source = file => fs.readFileSync(path.join(root, file), 'utf8');

function loadLogic() {
  const context = vm.createContext({});
  vm.runInContext(source('donnees.js'), context, { filename: 'donnees.js' });
  vm.runInContext(source('histoire.js'), context, { filename: 'histoire.js' });
  vm.runInContext(source('scenes.js'), context, { filename: 'scenes.js' });
  return vm.runInContext('({ DATA, STORY_LOGIC })', context);
}

function loadState(rawSave) {
  let stored = rawSave;
  const context = vm.createContext({
    document: (() => {   // faux DOM minimal : menu.js construit des éléments au chargement
      const el = () => new Proxy(function () {}, { get: (_t, k) => (k === 'style' ? {} : k === 'classList' ? { add() {}, remove() {}, toggle() {} } : k === 'children' ? [] : el()), apply: () => el(), set: () => true });
      return { createElement: el, head: el(), body: el(), getElementById: el, querySelector: el, querySelectorAll: () => [] };
    })(),
    TextEncoder,
    btoa,
    atob,
    localStorage: {
      getItem: () => rawSave,
      setItem: (_key, value) => { stored = value; }
    }
  });
  vm.runInContext(source('donnees.js'), context, { filename: 'donnees.js' });
  vm.runInContext(source('xp.js'), context, { filename: 'xp.js' });
  vm.runInContext(source('donjons.js'), context, { filename: 'donjons.js' });
  vm.runInContext(source('etat.js'), context, { filename: 'etat.js' });
  return { context, getStored: () => stored };
}

test('conditions flag, pasFlag, renc, niv et etats de quete', () => {
  const { STORY_LOGIC } = loadLogic();
  const sv = {
    niv: 8, renc: 3, hist: { vus: [], flags: { cle: true } },
    q: { q1: { s: 1, n: 2 }, q2: { s: 1, n: 3 }, q3: { s: 2, n: 3 } }
  };
  assert.equal(STORY_LOGIC.condition({ flag: 'cle', renc: { min: 3 }, niv: { min: 8 } }, sv), true);
  assert.equal(STORY_LOGIC.condition({ pasFlag: 'cle' }, sv), false);
  assert.equal(STORY_LOGIC.condition({ renc: { min: 4 } }, sv), false);
  assert.equal(STORY_LOGIC.condition({ niv: { min: 9 } }, sv), false);
  assert.equal(STORY_LOGIC.questState(sv, 'absente'), 'aucune');
  assert.equal(STORY_LOGIC.condition({ quete: { id: 'q1', etat: 'cours' } }, sv), true);
  assert.equal(STORY_LOGIC.condition({ quete: { id: 'q2', etat: 'prete' } }, sv), true);
  assert.equal(STORY_LOGIC.condition({ quete: { id: 'q3', etat: 'finie' } }, sv), true);
  assert.equal(STORY_LOGIC.condition({ quete: { id: 'q1', etat: 'prete' } }, sv), false);
  const lampiste = loadLogic().DATA.cartes.village.npcs.find(p => p.n === 'Maître Lampiste');
  const variante = lampiste.variantes.find(v => v.si && v.si.quete && v.si.quete.id === 'q1');
  assert.ok(variante);
  assert.equal(STORY_LOGIC.condition(variante.si, sv), false);
  sv.q.q1 = { s: 2, n: 3 };
  assert.equal(STORY_LOGIC.condition(variante.si, sv), true);
});

test('selection ordonnee pour chaque declencheur', () => {
  const { STORY_LOGIC } = loadLogic();
  const sv = { niv: 5, renc: 4, q: {}, hist: { vus: [], flags: {} } };
  const scenes = {
    entree: { declencheur: { quand: 'entree', carte: 'village' } },
    parle: { declencheur: { quand: 'parle', pnj: 'Maître Lampiste' } },
    avant: { declencheur: { quand: 'avantCombat', renc: 3 } },
    apres: { declencheur: { quand: 'apresCombat', renc: 3, issue: 'win' } },
    quete: { declencheur: { quand: 'quete', id: 'q1', etat: 'acceptee' } },
    autre: { declencheur: { quand: 'entree', carte: 'foret' } }
  };
  assert.equal(Array.from(STORY_LOGIC.select(scenes, { quand: 'entree', carte: 'village' }, sv)).join(','), 'entree');
  assert.equal(Array.from(STORY_LOGIC.select(scenes, { quand: 'parle', pnj: 'Maître Lampiste' }, sv)).join(','), 'parle');
  assert.equal(Array.from(STORY_LOGIC.select(scenes, { quand: 'avantCombat', renc: 3 }, sv)).join(','), 'avant');
  assert.equal(Array.from(STORY_LOGIC.select(scenes, { quand: 'apresCombat', renc: 3, issue: 'win' }, sv)).join(','), 'apres');
  assert.equal(Array.from(STORY_LOGIC.select(scenes, { quand: 'quete', id: 'q1', etat: 'acceptee' }, sv)).join(','), 'quete');
});

test('once, ordre des scenes, flags de choix et enchainement', () => {
  const { STORY_LOGIC } = loadLogic();
  const sv = { niv: 1, renc: 0, hist: { vus: [], flags: {} } };
  const scenes = {
    first: { once: true, declencheur: { quand: 'entree', carte: 'village' } },
    second: { once: true, declencheur: { quand: 'entree', carte: 'village' } }
  };
  assert.equal(Array.from(STORY_LOGIC.select(scenes, { quand: 'entree', carte: 'village' }, sv)).join(','), 'first,second');
  STORY_LOGIC.markSeen(sv, 'first');
  assert.equal(Array.from(STORY_LOGIC.select(scenes, { quand: 'entree', carte: 'village' }, sv)).join(','), 'second');
  assert.equal(Array.from(STORY_LOGIC.select(scenes, { quand: 'entree', carte: 'village' }, sv, { test: true })).join(','), 'first,second');
  const runtimeFlags = { ...sv.hist.flags };
  STORY_LOGIC.setFlags(sv, runtimeFlags, { prologue_fige: true });
  assert.equal(sv.hist.flags.prologue_fige, true);
  assert.equal(JSON.stringify(STORY_LOGIC.choiceTransition('prologue', 5, { scene: 'suite' })), JSON.stringify({ id: 'suite', index: 0, chained: true }));
  assert.equal(JSON.stringify(STORY_LOGIC.choiceTransition('prologue', 5, {})), JSON.stringify({ id: 'prologue', index: 6, chained: false }));
});

test('le mode test ne modifie ni vus ni flags persistants', () => {
  const { STORY_LOGIC } = loadLogic();
  const sv = { hist: { vus: ['old'], flags: { keep: true } } };
  const runtimeFlags = { ...sv.hist.flags };
  STORY_LOGIC.markSeen(sv, 'scene', true);
  STORY_LOGIC.setFlags(sv, runtimeFlags, { temporary: true }, true);
  assert.deepEqual(JSON.parse(JSON.stringify(sv.hist)), { vus: ['old'], flags: { keep: true } });
  assert.equal(runtimeFlags.temporary, true);
});

test('une nouvelle partie pose nouvellePartie et une sauvegarde ancienne evite le prologue', () => {
  const fresh = loadState(null);
  const freshSave = vm.runInContext('sv', fresh.context);
  assert.equal(freshSave.hist.flags.nouvellePartie, true);
  assert.equal(fresh.getStored(), null);   // rien n'est enregistré avant la création du héros (écran titre)

  const legacy = loadState(JSON.stringify({ niv: 7, xp: 0, res: {}, inv: [] }));
  const oldSave = vm.runInContext('sv', legacy.context);
  assert.ok(oldSave.hist.vus.includes('prologue'));
  assert.equal(oldSave.hist.flags.nouvellePartie, undefined);
  assert.ok(JSON.parse(legacy.getStored()).hist.vus.includes('prologue'));
});

test('export et import par JSON transportent hist sans format particulier', () => {
  const state = loadState(JSON.stringify({ niv: 2, xp: 0, res: {}, inv: [], hist: { vus: ['prologue'], flags: { route: true } } }));
  const { context } = state;
  vm.runInContext(source('menu.js'), context, { filename: 'menu.js' });
  const code = vm.runInContext('saveCode()', context);
  const exported = JSON.parse(Buffer.from(code.slice('LAMPYRIA1:'.length), 'base64').toString('utf8'));
  assert.deepEqual(JSON.parse(JSON.stringify(exported.hist)), { vus: ['prologue'], flags: { route: true } });
  vm.runInContext("localStorage.setItem('lampyria', JSON.stringify(JSON.parse(atob(saveCode().slice('LAMPYRIA1:'.length)))))", context);
  assert.deepEqual(JSON.parse(state.getStored()).hist.flags, { route: true });
});

test('les textes de dialogue et de choix tiennent dans 140 caracteres', () => {
  const { DATA } = loadLogic();
  for (const scene of Object.values(DATA.scenes)) for (const step of scene.etapes) {
    if (step.txt) assert.ok(Array.from(step.txt).length <= 140);
    if (step.hero) assert.ok(Array.from(step.hero + step.act).length <= 140);
    for (const choice of step.choix || []) assert.ok(Array.from(choice.t).length <= 140);
  }
});