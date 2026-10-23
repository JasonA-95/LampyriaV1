const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = __dirname;
const context = vm.createContext({});
for (const file of ['donnees.js', 'moteur.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const { DATA, Combat } = vm.runInContext('({ DATA, Combat })', context);

function combat(renc = 0, lueurs = [], gear = {}) {
  return new Combat(DATA, { classe: 'porte', renc, niv: 1, lueurs, gear });
}

test('les etats ne se cumulent pas et gardent les valeurs les plus fortes', () => {
  const game = combat();
  game.addEtat(game.hero, { id: 'brule', t: 2, v: 1 });
  game.addEtat(game.hero, { id: 'brule', t: 1, v: 3 });
  assert.equal(game.hero.etats.length, 1);
  assert.equal(game.hero.etats[0].t, 2);
  assert.equal(game.hero.etats[0].v, 3);
  game.addEtat(game.hero, { id: 'brule', t: 4, v: 2 });
  assert.equal(game.hero.etats[0].t, 4);
  assert.equal(game.hero.etats[0].v, 3);
});

test('brulure precede poison, ignore resistance et Mur, puis est absorbee par le bouclier', () => {
  const game = combat(0, [], { res: 40 });
  const hero = game.hero;
  hero.hp = 50;
  hero.mur = 2;
  game.addEtat(hero, { id: 'brule', t: 2, v: 2 });
  game.addEtat(hero, { id: 'poison', t: 1, v: 4 });
  game.addEtat(hero, { id: 'bouclier', t: 2, v: 2 });
  const tick = game.tickEtats(hero);
  assert.equal(hero.hp, 46);
  assert.equal(Array.from(tick.events, e => e.couleur).slice(0, 3).join(','), '#ff9a45,#9ecbff,#477d45');
  assert.equal(game.hasEtat(hero, 'poison'), false);
  assert.equal(hero.etats.find(e => e.id === 'brule').t, 1);
  assert.equal(game.hasEtat(hero, 'bouclier'), false);
});

test('le poison reduit les soins et le Festin applique son bouclier', () => {
  const game = combat(0, ['gourmande']);
  const hero = game.hero;
  hero.hp -= 20;
  game.addEtat(hero, { id: 'poison', t: 2, v: 1 });
  assert.equal(game.heal(hero, 10), 5);
  const feast = game.S.findIndex(s => s.n === 'Festin');
  game.pa = 6;
  const result = game.cast(feast, hero.x, hero.y);
  assert.equal(result.ok, true);
  assert.equal(hero.etats.find(e => e.id === 'bouclier').v, 6);
});

test('le poison reduit aussi le drain d Ombre douce et la Berceuse du berger', () => {
  const shadow = combat(0, ['melancolique']);
  const foe = shadow.foes[0];
  foe.x = 2;
  foe.y = 6;
  shadow.hero.hp = 20;
  shadow.addEtat(shadow.hero, { id: 'poison', t: 2, v: 1 });
  const before = shadow.hero.hp;
  const shadowSpell = shadow.S.findIndex(s => s.n === 'Ombre douce');
  shadow.cast(shadowSpell, foe.x, foe.y);
  assert.equal(shadow.hero.hp - before, 6);

  const sheep = combat(2);
  const shepherd = sheep.foes.find(f => f.ia === 'soin');
  const ally = sheep.foes.find(f => f !== shepherd && !f.form);
  const soin = shepherd.sort.heal;   // valeur lue dans les données : le test ne dépend plus des réglages d'équilibrage
  ally.hp = ally.max - 2 * soin;
  sheep.addEtat(ally, { id: 'poison', t: 2, v: 1 });
  assert.equal(sheep.castFoe(shepherd, shepherd.sort, ally).dmg, 0);
  assert.equal(ally.hp, ally.max - 2 * soin + Math.ceil(soin / 2));   // poison : soin réduit de moitié
});

test('un bouclier absorbe partiellement puis disparait a epuisement', () => {
  const game = combat();
  game.addEtat(game.hero, { id: 'bouclier', t: 3, v: 6 });
  assert.equal(game.hurtHero(4), 0);
  assert.equal(game.hero.etats.find(e => e.id === 'bouclier').v, 2);
  assert.equal(game.hurtHero(5), 3);
  assert.equal(game.hasEtat(game.hero, 'bouclier'), false);
});

test('ralenti et rage combines laissent au moins un PM', () => {
  const game = combat();
  game.malus = 2;
  game.addEtat(game.hero, { id: 'ralenti', t: 1, v: 3 });
  game.newTurn();
  assert.equal(game.pm, 1);
});

test('le ralenti limite aussi le deplacement du monstre a un PM minimum', () => {
  const game = combat(1);
  const foe = game.foes[0];
  game.hero.x = foe.x - 1;
  game.hero.y = foe.y;
  const start = [foe.x, foe.y];
  game.addEtat(foe, { id: 'ralenti', t: 1, v: 99 });
  game.foeTurn(foe);
  assert.ok(game.dist({ x: start[0], y: start[1] }, foe) <= 1);
});

test('un heros etourdi perd PA et PM pour son tour', () => {
  const game = combat();
  game.addEtat(game.hero, { id: 'etourdi', t: 1 });
  const turn = game.newTurn();
  assert.equal(turn.blocked, true);
  assert.equal(game.pa, 0);
  assert.equal(game.pm, 0);
  assert.equal(game.hasEtat(game.hero, 'etourdi'), false);
});

test('un monstre etourdi passe son tour et un boss resiste', () => {
  const game = combat(3);
  const boss = game.foes.find(f => f.boss);
  const ordinary = game.foes.find(f => !f.boss && !f.form);
  assert.equal(game.addEtat(boss, { id: 'etourdi', t: 1 }), false);
  const events = [];
  game.applyEtats(boss, [{ id: 'etourdi', t: 1 }], events);
  assert.match(events[0].text, /résiste/);
  const position = [ordinary.x, ordinary.y];
  game.addEtat(ordinary, { id: 'etourdi', t: 1 });
  assert.equal(game.foeTurn(ordinary).skip, true);
  assert.deepEqual([ordinary.x, ordinary.y], position);

  const protectedBoss = combat(3);
  const protectedTarget = protectedBoss.foes.find(f => f.boss);
  protectedBoss.hero.x = protectedTarget.x - 2;
  protectedBoss.hero.y = protectedTarget.y;
  protectedBoss.S.push({ n: 'Zone etourdissante', pa: 0, r: [1, 3], dmg: 1, aoe: 1, etats: [{ id: 'etourdi', t: 1 }] });
  const cast = protectedBoss.cast(protectedBoss.S.length - 1, protectedTarget.x, protectedTarget.y);
  assert.ok(cast.events.some(e => e.cible === protectedTarget && e.text.includes('résiste')));
  assert.equal(protectedBoss.hasEtat(protectedTarget, 'etourdi'), false);
});

test('affaibli reduit les degats infliges avec arrondi et minimum', () => {
  const game = combat();
  const target = game.foes[0];
  target.x = 2;
  target.y = 6;
  game.addEtat(game.hero, { id: 'affaibli', t: 2, v: 25 });
  const before = target.hp;
  game.cast(0, target.x, target.y);
  assert.equal(before - target.hp, 11);
  assert.equal(game.damageFrom(game.hero, 1), 1);
});

test('une brulure tue le dernier monstre et declare la victoire', () => {
  const game = combat();
  const [target, other] = game.foes;
  other.hp = 0;
  target.hp = 3;
  game.addEtat(target, { id: 'brule', t: 1, v: 3 });
  game.foeTurn(target);
  assert.equal(game.result, 'win');
});

test('le poison peut tuer le heros au debut de son tour', () => {
  const game = combat();
  game.hero.hp = 2;
  game.addEtat(game.hero, { id: 'poison', t: 2, v: 3 });
  game.newTurn();
  assert.equal(game.hero.hp, 0);
  assert.equal(game.result, 'lose');
});

test('la mort periodique du sac declenche son eclatement', () => {
  const game = combat(5);
  const sac = game.foes.find(f => f.mort);
  for (const foe of game.foes) if (foe !== sac) foe.hp = 0;
  game.hero.x = sac.x;
  game.hero.y = sac.y - 1;
  sac.hp = 3;
  game.addEtat(sac, { id: 'brule', t: 1, v: 3 });
  const turn = game.foeTurn(sac);
  assert.equal(game.hero.hp, game.hero.max - sac.mort.dmg);
  assert.match(turn.text, /Éclatement/);
  assert.equal(game.result, 'win');
});

test('une cible endormie brule sans etre reveillee par les degats periodiques', () => {
  const game = combat();
  const target = game.foes[0];
  target.sleep = true;
  target.hp = 20;
  game.addEtat(target, { id: 'brule', t: 2, v: 3 });
  const turn = game.foeTurn(target);
  assert.equal(turn.sleep, true);
  assert.equal(target.hp, 17);
});

test('le formulaire ne peut recevoir aucun etat', () => {
  const game = combat(3);
  const form = game.foes.find(f => f.form);
  assert.equal(game.addEtat(form, { id: 'poison', t: 2, v: 3 }), false);
  assert.equal(form.etats.length, 0);
});

test('les sorts de monstre appliquent les etats et les descriptions de donnees existent', () => {
  const game = combat(3);
  const boss = game.foes.find(f => f.boss);
  game.castFoe(boss, boss.sort, game.hero);
  assert.equal(game.hasEtat(game.hero, 'affaibli'), true);
  assert.deepEqual(Array.from(Object.keys(DATA.etats)).sort(), ['affaibli', 'bouclier', 'brule', 'etourdi', 'poison', 'ralenti']);
  assert.equal(DATA.rencontres[4].m[0].sort.etats[0].id, 'poison');
  assert.equal(DATA.rencontres[6].m[0].sort.etats[0].id, 'brule');
  assert.equal(DATA.classes.porte.sorts.find(s => s.id === 'ardente').etats[0].id, 'brule');
  assert.equal(DATA.classes.mage.sorts.find(s => s.id === 'flaque').etats[0].id, 'brule');
  assert.equal(DATA.classes.archer.sorts.find(s => s.id === 'retrait').etats[0].id, 'poison');
  assert.equal(DATA.classes.mage.sorts.find(s => s.id === 'tempete').etats[0].id, 'etourdi');
  assert.equal(DATA.lueurs.gourmande.sort.etatsSoi[0].id, 'bouclier');
  assert.equal(DATA.rencontres[1].m[0].sort.etats[0].id, 'ralenti');
  assert.equal(DATA.rencontres[3].m[0].sort.etats[0].id, 'affaibli');
});

test('un sort peut appliquer un etat sans infliger de degats', () => {
  const game = combat();
  const target = game.foes[0];
  target.x = 2;
  target.y = 6;
  game.S.push({ n: 'Sort de test', pa: 0, r: [1, 3], etats: [{ id: 'poison', v: 2, t: 2 }] });
  const result = game.cast(game.S.length - 1, target.x, target.y);
  assert.equal(result.ok, true);
  assert.equal(game.hasEtat(target, 'poison'), true);
});