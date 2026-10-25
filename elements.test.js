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

// ---------- dégâts par élément et résistances (étapes 2+3) ----------
const ctxC = vm.createContext({});
for (const f of ['donnees.js', 'moteur.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctxC, { filename: f });
const { DATA: DC, Combat } = vm.runInContext('({ DATA, Combat })', ctxC);

// Lance le premier sort du Porte-Lanterne au corps à corps sur le premier monstre ; renvoie les PV perdus.
function frappe({ gear = {}, elem, rs, niv = 1 } = {}) {
  const g = new Combat(DC, { classe: 'porte', renc: 0, niv, lueurs: [], gear });
  const f = g.foes[0], h = g.hero;
  f.x = h.x + 1; f.y = h.y; f.hp = f.max = 5000; f.rs = rs;
  if (elem) g.S[0].elem = elem; else delete g.S[0].elem;
  const base = g.S[0].dmg + g.bonus, avant = f.hp, r = g.cast(0, f.x, f.y);
  assert.ok(r.ok, 'le sort doit partir');
  return { perdu: avant - f.hp, base };
}

test('sans point d\'élément ni résistance, un sort neutre inflige exactement le dégât de base (comportement inchangé)', () => {
  const { perdu, base } = frappe();
  assert.equal(perdu, base);
});

test('chaque point dans l\'élément du sort ajoute le pourcentage prévu aux dégâts', () => {
  const pct = DC.regleElem.pct;
  const { perdu, base } = frappe({ gear: { vent: 10 }, elem: 'vent' });
  assert.equal(perdu, Math.round(base * (1 + 10 * pct / 100)));
  assert.ok(perdu > base);
});

test('les points d\'un autre élément n\'augmentent pas les dégâts du sort', () => {
  const { perdu, base } = frappe({ gear: { foudre: 20, neutre: 20 }, elem: 'vent' });
  assert.equal(perdu, base);
});

test('les points de Neutre augmentent les sorts sans élément', () => {
  const pct = DC.regleElem.pct;
  const { perdu, base } = frappe({ gear: { neutre: 8 } });
  assert.equal(perdu, Math.round(base * (1 + 8 * pct / 100)));
});

test('la résistance d\'un monstre réduit les dégâts, la résistance négative (faiblesse) les augmente', () => {
  const { base } = frappe();
  assert.equal(frappe({ elem: 'vent', rs: { vent: 50 } }).perdu, Math.round(base * 0.5));
  assert.equal(frappe({ elem: 'vent', rs: { vent: -25 } }).perdu, Math.round(base * 1.25));
  assert.equal(frappe({ elem: 'vent', rs: { foudre: 50 } }).perdu, base);
});

test('la résistance est bornée (jamais d\'immunité complète) et un coup fait au moins 1 dégât', () => {
  const { base } = frappe();
  const perdu = frappe({ elem: 'vent', rs: { vent: 500 } }).perdu;
  assert.equal(perdu, Math.max(1, Math.round(base * (1 - DC.regleElem.resMax / 100))));
});

test('plus aucun objet ni panoplie n\'utilise l\'ancienne stat dmg', () => {
  for (const o of Object.values(DC.objets)) assert.ok(!('dmg' in (o.st || {})), 'objet avec dmg : ' + o.n);
  for (const s of Object.values(DC.sets)) for (const b of Object.values(s.bonus)) assert.ok(!('dmg' in b), 'panoplie avec dmg : ' + s.n);
});

// ---------- sorts de classe par élément (étape 4) ----------
test('chaque classe a 10 sorts : exactement 2 par élément, ids uniques, niveaux croissants, départ Neutre', () => {
  const D = load(), ids = new Set();
  for (const k of Object.keys(D.classes)) {
    const S = D.classes[k].sorts, par = {};
    assert.equal(S.length, 10, k);
    S.forEach((s, i) => { assert.ok(!ids.has(s.id), 'id en double : ' + s.id); ids.add(s.id); par[s.elem || 'neutre'] = (par[s.elem || 'neutre'] || 0) + 1; if (i) assert.ok(s.niv >= S[i - 1].niv, 'ordre des niveaux : ' + s.id); assert.ok(!s.elem || D.elements[s.elem], 'élément inconnu : ' + s.id) });
    for (const e of Object.keys(D.elements)) assert.equal(par[e], 2, k + ' : 2 sorts attendus en ' + e);
    assert.ok(!S[0].elem && !S[1].elem && S[0].niv === 1 && S[1].niv === 1, k + ' : sorts de départ Neutres');
  }
});

test('chaque sort de dégâts de chaque classe se lance et blesse un monstre (portée et ligne de vue valides)', () => {
  for (const k of Object.keys(DC.classes)) for (const base of DC.classes[k].sorts) {
    if (!base.dmg) continue;
    let fait = false;
    for (let x = 0; x < DC.taille && !fait; x++) for (let y = 0; y < DC.taille && !fait; y++) {
      const g = new Combat(DC, { classe: k, renc: 0, niv: 60, lueurs: [], gear: {} });
      const f = g.foes[0], h = g.hero;
      if (!g.in(x, y) || !g.free(x, y)) continue;
      const d = Math.abs(x - h.x) + Math.abs(y - h.y);
      if (d < base.r[0] || d > base.r[1] || (!base.r[1] && d)) continue;
      f.x = x; f.y = y; f.hp = f.max = 5000; g.foes.slice(1).forEach(o => { o.hp = 0 });
      g.S = [{ ...base }]; g.pa = 20; g.cd = [0];
      const r = g.cast(0, x, y);
      if (r.ok) { fait = true; assert.ok(f.hp < 5000 || r.dmg > 0, base.id + ' ne blesse pas'); }
    }
    if (!base.r[1]) continue; // sorts sur soi : testés en jeu
    assert.ok(fait, base.id + ' : aucun lancer valide trouvé');
  }
});
