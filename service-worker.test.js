const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');

function createWorker({ cacheNames = [], seeded = {}, fetchImpl = async () => new Response('online'), openError = false, putDelay } = {}) {
  const listeners = {};
  const names = new Set(cacheNames);
  const stored = new Map(Object.entries(seeded).map(([name, entries]) => [name, new Map(Object.entries(entries))]));
  const puts = [];
  const state = { fetchImpl };
  const caches = {
    keys: async () => [...names],
    delete: async name => names.delete(name),
    open: async name => {
      if (openError) throw new Error('cache unavailable');
      names.add(name);
      if (!stored.has(name)) stored.set(name, new Map());
      const entries = stored.get(name);
      return {
        match: async request => entries.get(request.url) || null,
        put: async (request, response) => {
          if (putDelay) await putDelay;
          entries.set(request.url, response);
          puts.push({ name, url: request.url });
        }
      };
    },
    match: async request => {
      for (const entries of stored.values()) {
        if (entries.has(request.url)) return entries.get(request.url);
      }
      return null;
    }
  };
  const context = vm.createContext({
    self: { addEventListener: (name, callback) => { listeners[name] = callback; }, skipWaiting: async () => {} },
    caches,
    clients: { claim: async () => {} },
    fetch: request => state.fetchImpl(request),
    URL,
    Response,
    console: { warn() {} }
  });
  vm.runInContext(source, context);

  return {
    listeners,
    names,
    puts,
    state,
    async activate() {
      let promise;
      listeners.activate({ waitUntil: value => { promise = value; } });
      await promise;
    },
    async fetch(url, method = 'GET') {
      let promise;
      listeners.fetch({
        request: { url, method },
        respondWith: value => { promise = value; }
      });
      return promise;
    }
  };
}

test('activation supprime uniquement les anciens caches de version Lampyria', async () => {
  const worker = createWorker({
    cacheNames: ['lampyria-v126', 'lampyria-v127', 'lampyria-sons', 'autre-app-v3', 'autre-cache']
  });

  await worker.activate();

  assert.deepEqual([...worker.names].sort(), ['autre-app-v3', 'autre-cache', 'lampyria-sons', 'lampyria-v127']);
});

test('une réponse réseau réussie est mise en cache avant d’être renvoyée', async () => {
  let releasePut;
  const putDelay = new Promise(resolve => { releasePut = resolve; });
  const worker = createWorker({ fetchImpl: async () => new Response('ok', { status: 200 }), putDelay });

  let completed = false;
  const responsePromise = worker.fetch('https://lampyria.test/index.html').then(response => {
    completed = true;
    return response;
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(completed, false);
  releasePut();
  const response = await responsePromise;

  assert.equal(response.status, 200);
  assert.deepEqual(worker.puts, [{ name: 'lampyria-v127', url: 'https://lampyria.test/index.html' }]);
});

test('une réponse HTTP en erreur n’est pas mise en cache', async () => {
  const worker = createWorker({ fetchImpl: async () => new Response('not found', { status: 404 }) });

  const response = await worker.fetch('https://lampyria.test/missing.js');

  assert.equal(response.status, 404);
  assert.equal(worker.puts.length, 0);
});

test('le cache hors ligne est utilisé si la requête réseau échoue', async () => {
  const url = 'https://lampyria.test/game.js';
  const worker = createWorker({
    seeded: { 'lampyria-v127': { [url]: new Response('cached') } },
    fetchImpl: async () => { throw new Error('offline'); }
  });

  const response = await worker.fetch(url);

  assert.equal(await response.text(), 'cached');
});

test('les instruments restent dans leur cache et sont disponibles hors ligne', async () => {
  const url = 'https://lampyria.test/_FluidR3_GM_sf2_file.js';
  const worker = createWorker({ fetchImpl: async () => new Response('soundfont') });

  assert.equal(await (await worker.fetch(url)).text(), 'soundfont');
  assert.deepEqual(worker.puts, [{ name: 'lampyria-sons', url }]);
  worker.state.fetchImpl = async () => { throw new Error('offline'); };
  assert.equal(await (await worker.fetch(url)).text(), 'soundfont');
});

test('une panne du cache ne bloque pas une réponse réseau réussie', async () => {
  const worker = createWorker({ fetchImpl: async () => new Response('ok'), openError: true });

  const response = await worker.fetch('https://lampyria.test/index.html');

  assert.equal(response.status, 200);
  assert.equal(worker.puts.length, 0);
});
