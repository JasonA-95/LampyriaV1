const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = __dirname;
const source = file => fs.readFileSync(path.join(root, file), 'utf8');

function canvasContext() {
  return new Proxy({
    createLinearGradient: () => ({ addColorStop() {} }),
    save() {}, restore() {}, beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, clip() {},
    fill() {}, stroke() {}, fillRect() {}, drawImage(...args) { this.drawArgs = args; }, arc() {}, ellipse() {}, quadraticCurveTo() {}, rotate() {}, translate() {}, clearRect() {},
    createRadialGradient: () => ({ addColorStop() {} })
  }, { set(target, key, value) { target[key] = value; return true; } });
}

function loadRenderer() {
  let canvases = 0, clock = 0, nextFrame = 0;
  const frames = new Map();
  const context = vm.createContext({
    OPT: { fx: 'eleve' },
    performance: { now: () => clock },
    requestAnimationFrame: callback => { const id=++nextFrame;frames.set(id,callback);return id; },
    cancelAnimationFrame: id => frames.delete(id),
    document: { createElement: () => { canvases++; return { width: 0, height: 0, getContext: canvasContext }; } }
  });
  vm.runInContext(source('rendu.js'), context, { filename: 'rendu.js' });
  return { api: vm.runInContext('({ terrainHash, terrainRandom, terrainVariant: (x,y) => terrainHash(x,y)%TERRAIN_VARIANTS, tuile, TERRAIN_CACHE, obstacleTextures, drawTerrainObstacle, terrainDecorCells, ambienceFps, ambienceShouldRun, ambienceFrameDue, ambienceParticles, animateUnitMove, displayPosition, displayPending, waitForDisplay })', context),
    context, getCanvases: () => canvases, getFrames: () => frames.size,
    advance: time => { clock=time;const pending=Array.from(frames.values());frames.clear();for(const callback of pending)callback(time); } };
}

function optionsContext({ stored = null, reduced = false, memory, cores } = {}) {
  const values = new Map(stored == null ? [] : [['lampyria_opts', stored]]);
  const context = vm.createContext({
    navigator: { deviceMemory: memory, hardwareConcurrency: cores },
    matchMedia: () => ({ matches: reduced }),
    localStorage: { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) }
  });
  vm.runInContext(source('options.js'), context, { filename: 'options.js' });
  return { context, values };
}

test('le générateur pseudo-aléatoire et le choix de variante sont déterministes', () => {
  const { api } = loadRenderer(), another = loadRenderer().api;
  const first = api.terrainRandom(12345), second = api.terrainRandom(12345);
  assert.deepEqual([first(), first(), first()], [second(), second(), second()]);
  assert.equal(api.terrainVariant(4, 9), another.terrainVariant(4, 9));
  assert.ok(api.terrainVariant(4, 9) >= 0 && api.terrainVariant(4, 9) < 4);
  assert.notEqual(api.terrainHash(4, 9), api.terrainHash(9, 4));
});

test('le cache génère une seule fois quatre textures par biome', () => {
  const { api, getCanvases } = loadRenderer();
  const g = canvasContext();
  api.tuile(g, 30, 20, 40, 20, 'foret', 2, 3, .5);
  assert.equal(getCanvases(), 4);
  api.tuile(g, 30, 20, 40, 20, 'foret', 2, 3, .5);
  assert.equal(getCanvases(), 4);
  api.tuile(g, 30, 20, 40, 20, 'marais', 2, 3, .5);
  assert.equal(getCanvases(), 8);
});

test('les obstacles ont trois variantes en cache et restent sous la hauteur maximale', () => {
  const { api, getCanvases } = loadRenderer(), g = canvasContext();
  assert.equal(api.obstacleTextures('desert').length, 3);
  assert.equal(getCanvases(), 3);
  api.obstacleTextures('desert');
  assert.equal(getCanvases(), 3);
  api.drawTerrainObstacle(g, 40, 30, 48, 24, 'desert', 2, 5);
  const [sprite, x, y, width, height] = g.drawArgs;
  assert.equal(sprite.width, 96);
  assert.ok(height <= 48 * .75);
  assert.ok(Number.isFinite(x + y + width));
});

test('la position interpolée ne modifie pas le moteur et la boucle s’arrête à la fin', async () => {
  const { api, advance, getFrames } = loadRenderer(), unit={x:0,y:0};
  assert.deepEqual(JSON.parse(JSON.stringify(api.displayPosition(unit,0,0))),{x:0,y:0});
  assert.equal(api.animateUnitMove(unit,{x:0,y:0},{x:2,y:0},new Set()),true);
  assert.equal(getFrames(),1);
  const finished=api.waitForDisplay();
  advance(120);
  const middle=api.displayPosition(unit,2,0);
  assert.equal(middle.x,1);
  assert.equal(unit.x,0);
  assert.equal(unit.y,0);
  assert.equal(getFrames(),1);
  advance(240);
  await finished;
  assert.equal(api.displayPending(),false);
  assert.equal(getFrames(),0);
});

test('le décor déterministe évite obstacles et toutes les cases réservées des cartes', () => {
  const { api } = loadRenderer(), dataContext = vm.createContext({});
  vm.runInContext(source('donnees.js'), dataContext, { filename: 'donnees.js' });
  const maps = JSON.parse(vm.runInContext('JSON.stringify(Object.values(DATA.cartes))', dataContext));
  let placements = 0;
  for (const map of maps) {
    const key = ([x,y]) => x+','+y, blocked = new Set(map.rocks.map(key));
    for (const field of ['groups','nodes','npcs','picks','hides']) for (const item of map[field]||[]) blocked.add(item.x+','+item.y);
    const excluded = new Set([key(map.start), ...(map.exits||[]).map(exit=>exit.x+','+exit.y)]);
    const first = api.terrainDecorCells(13, map.biome, blocked, excluded, .5);
    const second = api.terrainDecorCells(13, map.biome, blocked, excluded, .5);
    assert.deepEqual(JSON.parse(JSON.stringify(first)), JSON.parse(JSON.stringify(second)));
    placements += first.length;
    for (const cell of first) assert.ok(!blocked.has(cell.x+','+cell.y) && !excluded.has(cell.x+','+cell.y), map.n+' : '+cell.x+','+cell.y);
  }
  assert.ok(placements>0);
});

test('l’ambiance respecte les cadences maximales et s’arrête si elle est masquée', () => {
  const { api } = loadRenderer();
  assert.equal(api.ambienceFps('eleve'), 30);
  assert.equal(api.ambienceFps('reduit'), 15);
  assert.equal(api.ambienceFps('off'), 0);
  assert.equal(api.ambienceFrameDue(100, 132, 'eleve'), false);
  assert.equal(api.ambienceFrameDue(100, 134, 'eleve'), true);
  assert.equal(api.ambienceFrameDue(100, 166, 'reduit'), false);
  assert.equal(api.ambienceFrameDue(100, 167, 'reduit'), true);
  assert.equal(api.ambienceShouldRun('eleve', true, false, false), false);
  assert.equal(api.ambienceShouldRun('eleve', false, true, false), false);
  assert.equal(api.ambienceShouldRun('eleve', false, false, true), false);
  assert.equal(api.ambienceShouldRun('off', false, false, false), false);
  assert.deepEqual(JSON.parse(JSON.stringify(api.ambienceParticles('village', 40))), JSON.parse(JSON.stringify(api.ambienceParticles('village', 40))));
});

test('le mode désactivé conserve la couleur plate et ne génère pas de texture', () => {
  const { api, context, getCanvases } = loadRenderer();
  vm.runInContext("OPT.fx='off'", context);
  const g = canvasContext();
  api.tuile(g, 30, 20, 40, 20, 'village', 2, 3, .5);
  assert.equal(g.fillStyle, 'rgb(79,58,50)');
  assert.equal(getCanvases(), 0);
});

test('les options FX appliquent le défaut adapté et persistent hors sauvegarde', () => {
  const standard = optionsContext({ memory: 8, cores: 8 });
  assert.equal(vm.runInContext('OPT.fx', standard.context), 'eleve');
  assert.equal(vm.runInContext('OPT.son', standard.context), 50);
  assert.deepEqual(JSON.parse(standard.values.get('lampyria_opts')), { fx: 'eleve', son: 50 });
  vm.runInContext('cycleFx()', standard.context);
  assert.equal(JSON.parse(standard.values.get('lampyria_opts')).fx, 'reduit');
  assert.equal(standard.values.has('lampyria'), false);
  vm.runInContext('cycleSon();cycleSon();cycleSon();cycleSon()', standard.context);
  assert.equal(JSON.parse(standard.values.get('lampyria_opts')).son, 0);

  assert.equal(vm.runInContext('OPT.fx', optionsContext({ reduced: true }).context), 'reduit');
  assert.equal(vm.runInContext('OPT.fx', optionsContext({ memory: 2, cores: 8 }).context), 'reduit');
  assert.equal(vm.runInContext('OPT.fx', optionsContext({ memory: 8, cores: 4 }).context), 'reduit');
  const imported = optionsContext({ stored: '{"fx":"off","son":150}' });
  assert.equal(vm.runInContext('OPT.fx', imported.context), 'off');
  assert.equal(vm.runInContext('OPT.son', imported.context), 100);
});

test('le module son reste sans erreur quand Web Audio est indisponible', () => {
  const context = vm.createContext({ OPT: { son: 60 }, window: { addEventListener() {} } });
  vm.runInContext(source('son.js'), context, { filename: 'son.js' });
  assert.equal(vm.runInContext("playSound('click')", context), false);
  assert.equal(vm.runInContext('unlockSound()', context), false);
  assert.equal(vm.runInContext("playSound('victory')", context), false);
});

test('chaque carte et chaque rencontre déclarent un biome pris en charge', () => {
  const context = vm.createContext({});
  vm.runInContext(source('donnees.js'), context, { filename: 'donnees.js' });
  const biomes = vm.runInContext("JSON.stringify({cartes:Object.values(DATA.cartes).map(d=>d.biome),rencontres:DATA.rencontres.map(d=>d.biome),ambiance:Object.keys(DATA.ambiance)})", context);
  const { cartes, rencontres, ambiance } = JSON.parse(biomes);
  const supported = ['village', 'foret', 'collines', 'manoir', 'marais', 'roseliere', 'serre', 'desert', 'temple', 'citadelle', 'trone'];
  assert.ok(cartes.every(biome => supported.includes(biome)));
  assert.ok(rencontres.every(biome => supported.includes(biome)));
  assert.ok(cartes.length >= 7 && rencontres.length >= 7);
  assert.ok(supported.every(biome => ambiance.includes(biome)));
});