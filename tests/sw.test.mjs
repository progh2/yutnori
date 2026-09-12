/**
 * Cache tests for game/sw.js.
 *
 * The Service Worker decides what gets re-downloaded on a second visit, so its
 * routing is worth pinning: a cached model is served without touching the
 * network, nothing is copied into the cache on the way in (that measured
 * 38ms → 68ms per 6MB model), the page itself always asks the network first,
 * and 'warm' is what fills the cache afterwards. There is no browser here, so
 * the worker runs inside a vm context with stubs for self/caches/fetch and its
 * handlers are called directly.
 *
 *   node tests/sw.test.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, '..', 'game', 'sw.js'), 'utf8');
const CACHE_NAME = (source.match(/const CACHE = '([^']+)'/) || [])[1];

// ---------------------------------------------------------------- test runner
let passed = 0;
const failures = [];
async function test(name, fn){
  try { await fn(); passed++; }
  catch (err){ failures.push({ name, err }); }
}

// ------------------------------------------------------------ browser doubles
// Just enough of Cache/CacheStorage to tell a hit from a miss, plus a log of
// every network request so a test can prove the network was never asked.
// `cached` is seeded before the worker starts, the way a real cache would be
// waiting for it on a second visit.
async function makeEnv({ offline = false, cached = [], missing = [] } = {}){
  const stores = new Map();
  const fetched = [];
  const urlOf = req => (typeof req === 'string' ? req : req.url);
  const body = url => ({ body: 'network:' + url, ok: true, type: 'basic', clone(){ return this; } });
  const cacheFor = name => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      store,
      async match(req){ return store.get(urlOf(req)); },
      async put(req, res){ store.set(urlOf(req), res); },
      async add(req){
        const url = urlOf(req);
        const res = await env.fetch({ url });
        if (!res.ok) throw new Error('bad response for ' + url);
        store.set(url, res);
      },
      async keys(){ return [...store.keys()].map(url => ({ url })); },
    };
  };
  const env = {
    URL,
    handlers: {},
    fetched,
    caches: {
      async open(name){ return cacheFor(name); },
      async keys(){ return [...stores.keys()]; },
      async delete(name){ return stores.delete(name); },
    },
    async fetch(req, opts){
      const url = urlOf(req);
      fetched.push(url + (opts && opts.mode ? ' [' + opts.mode + ']' : ''));
      if (offline) throw new Error('offline');
      if (missing.includes(url)) return { ok: false, status: 404, type: 'basic', clone(){ return this; } };
      return body(url);
    },
  };
  const seeded = cacheFor(CACHE_NAME);
  cached.forEach(url => seeded.store.set(url, { body: 'cached:' + url, ok: true, type: 'basic', clone(){ return this; } }));

  const self = {
    location: { href: 'https://x.test/' },
    addEventListener(type, fn){ env.handlers[type] = fn; },
    skipWaiting(){},
    clients: { claim: async () => {} },
  };
  vm.createContext(env);
  vm.runInContext(`(function(self, caches, fetch){\n${source}\n})`, env, { filename: 'sw.js' })(self, env.caches, env.fetch);
  await new Promise(r => setTimeout(r, 0));   // let the worker read the cache index
  return env;
}

// Drive the worker's fetch handler the way the browser would. `undefined` means
// the worker kept its hands off and the browser will fetch it itself.
async function request(env, url, opts = {}){
  let answer;
  env.handlers.fetch({
    request: { url, method: opts.method || 'GET', ...opts },
    respondWith(p){ answer = p; },
  });
  return answer === undefined ? undefined : await answer;
}

// Drive the worker's message handler the way postMessage would.
async function warm(env, urls){
  let done;
  env.handlers.message({ data: { type: 'warm', urls }, ports: [], waitUntil(p){ done = p; } });
  await done;
}

// ------------------------------------------------------------------- the tests
await test('a cached .vrm is served without touching the network', async () => {
  const url = 'https://x.test/models/shino.vrm';
  const env = await makeEnv({ cached: [url] });
  const res = await request(env, url);
  assert.equal(res.body, 'cached:' + url);
  assert.deepEqual(env.fetched, [], 'the network was asked for a model it already had');
});

await test('a .vrm that is not cached yet just passes through', async () => {
  const env = await makeEnv();
  const url = 'https://x.test/models/vita.vrm';
  const res = await request(env, url);
  assert.equal(res.body, 'network:' + url);
  assert.deepEqual(env.fetched, [url]);
  // nothing is copied on the way in: that is what warm is for
  const cache = await env.caches.open(CACHE_NAME);
  assert.equal(await cache.match({ url }), undefined,
    'the model was copied into the cache while the page was waiting for it');
});

await test('every asset kind the game loads is served from the cache', async () => {
  for (const url of [
    'https://x.test/models/props/log.glb',
    'https://x.test/audio/bgm.ogg',
    'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js',
    'https://fonts.gstatic.com/s/jua/v1/font.woff2',
    'https://fonts.googleapis.com/css2?family=Jua',
  ]){
    const env = await makeEnv({ cached: [url] });
    const res = await request(env, url);
    assert.equal(res && res.body, 'cached:' + url, url + ' did not come from the cache');
  }
});

await test('warm puts the listed assets in the cache', async () => {
  const env = await makeEnv();
  const urls = ['https://x.test/models/props/log.glb', 'https://x.test/audio/bgm.ogg',
                'https://x.test/models/shino.vrm'];
  await warm(env, urls);
  const cache = await env.caches.open(CACHE_NAME);
  for (const url of urls) assert.ok(await cache.match({ url }), url + ' was not kept');
});

await test('warm keeps a CDN script but not the page it was listed with', async () => {
  const env = await makeEnv();
  const cdn = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
  const page = 'https://x.test/index.html';
  await warm(env, [cdn, page, 'data:image/png;base64,AAAA']);
  const cache = await env.caches.open(CACHE_NAME);
  assert.ok(await cache.match({ url: cdn }), 'the pinned CDN script was not kept');
  assert.equal(await cache.match({ url: page }), undefined,
    'the page was cached by warm, which would freeze a deploy');
});

await test('what warm kept is served from the cache right away', async () => {
  const url = 'https://x.test/models/vivi.vrm';
  const env = await makeEnv();
  await warm(env, [url]);
  env.fetched.length = 0;
  await request(env, url);
  assert.deepEqual(env.fetched, [], 'it went back to the network for what warm had kept');
});

await test('warm skips what is already cached', async () => {
  const url = 'https://x.test/audio/bgm.ogg';
  const env = await makeEnv({ cached: [url] });
  await warm(env, [url]);
  assert.deepEqual(env.fetched, [], 'warm re-downloaded something it already had');
});

await test('warm keeps going past a missing prop', async () => {
  const gone = 'https://x.test/models/props/nope.glb';
  const url = 'https://x.test/models/props/log.glb';
  const env = await makeEnv({ missing: [gone] });
  await warm(env, [gone, url]);
  const cache = await env.caches.open(CACHE_NAME);
  assert.ok(await cache.match({ url }), 'one 404 stopped the rest of the list');
});

await test('a CDN file that refuses CORS is kept as opaque', async () => {
  const url = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
  const env = await makeEnv({ missing: [url] });   // cache.add rejects on a bad response
  await warm(env, [url]);
  const cache = await env.caches.open(CACHE_NAME);
  assert.ok(await cache.match({ url }), 'the CDN file was not kept');
  assert.ok(env.fetched.some(f => f.includes('[no-cors]')), 'no-cors was never tried');
});

await test('the page itself asks the network first, so a deploy lands', async () => {
  const env = await makeEnv({ cached: ['https://x.test/'] });
  const res = await request(env, 'https://x.test/');
  assert.equal(res.body, 'network:https://x.test/');
  assert.deepEqual(env.fetched, ['https://x.test/']);
});

await test('with no network the page falls back to the cached copy', async () => {
  const env = await makeEnv({ offline: true, cached: ['https://x.test/'] });
  const res = await request(env, 'https://x.test/');
  assert.equal(res.body, 'cached:https://x.test/');
});

await test('with no network and nothing cached the page request rejects', async () => {
  const env = await makeEnv({ offline: true });
  await assert.rejects(() => request(env, 'https://x.test/'));
});

await test('non-GET and non-http requests are left alone', async () => {
  const env = await makeEnv({ cached: ['https://x.test/models/shino.vrm'] });
  assert.equal(await request(env, 'https://x.test/', { method: 'POST' }), undefined);
  assert.equal(await request(env, 'data:text/plain,hi'), undefined);
  assert.equal(await request(env, 'chrome-extension://abc/x.png'), undefined);
});

await test('activating drops caches from older versions', async () => {
  const env = await makeEnv();
  await env.caches.open('yut-v0');
  await env.caches.open(CACHE_NAME);
  let done;
  env.handlers.activate({ waitUntil(p){ done = p; } });
  await done;
  assert.deepEqual(await env.caches.keys(), [CACHE_NAME]);
});

// -------------------------------------------------------------------- report
const total = passed + failures.length;
if (failures.length){
  console.error(`\n${failures.length} of ${total} cache tests failed:\n`);
  failures.forEach(({ name, err }) => {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message.split('\n').join('\n    ')}\n`);
  });
  process.exit(1);
}
console.log(`✓ ${passed} cache tests passed`);
