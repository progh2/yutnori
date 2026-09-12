// ================= 내려받은 에셋을 다음 방문에도 재활용 =================
// GitHub Pages는 cache-control: max-age=600을 고정으로 내려주고 헤더를 바꿀
// 방법이 없다. 그래서 10분마다 재검증이 붙고, VRM 5개 30MB(gzip 15MB)는
// 브라우저 HTTP 캐시에서 밀려나기 쉬워 — 특히 iOS Safari — 조용히 다시
// 받게 된다. 여기서 캐시 정책을 직접 정해 그 낭비를 없앤다.
//
// 에셋(.vrm/.glb/.ogg/글꼴/CDN 스크립트)은 캐시 우선: 파일 이름이 곧 판본이라
// 내용이 바뀌면 이름이나 아래 CACHE 버전이 바뀐다. HTML은 네트워크 우선이라
// 배포하면 바로 반영된다.
//
// 단, 받아오는 길에 캐시에 담지는 않는다. response.clone()을 끼우면 페이지가
// 읽는 속도가 디스크 쓰기에 발목을 잡힌다 — 헤드리스 Chrome에서 6MB 모델을
// 15번씩 받아 재어 보니 파일당 중앙값 38ms → 68ms였다(그냥 통과시킬 때는 35ms로
// 차이가 없었다). 담는 일은 페이지가 한가해진 뒤 보내주는 'warm' 소식이 맡는다.
// 그때는 HTTP 캐시에서 바로 나오므로 아무도 기다리지 않는다.
const CACHE = 'yut-v1';

// 캐시 우선으로 다룰 것들. 그 밖(HTML·문서)은 네트워크 우선.
const ASSET_RE = /\.(vrm|glb|gltf|ogg|mp3|wav|woff2?|ttf|png|jpe?g|webp)$/i;
const ASSET_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

function isAsset(url){
  return ASSET_RE.test(url.pathname) || ASSET_HOSTS.includes(url.hostname);
}

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

// 캐시에 있으면 그대로 준다. 없으면 그냥 지나가게 둔다.
async function fromCache(request){
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  return hit || fetch(request);
}

// 새 판본을 먼저 물어보고, 네트워크가 없으면 지난 판본으로 버틴다.
// HTML은 200KB짜리 한 장이라 오는 길에 베껴 담아도 티가 나지 않는다.
async function networkFirst(request){
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request);
    if (res && res.ok) cache.put(request, res.clone()).catch(() => {});
    return res;
  } catch (err){
    const hit = await cache.match(request);
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
  event.respondWith(isAsset(url) ? fromCache(request) : networkFirst(request));
});

// ---- 페이지가 한가해지면 알려주는 목록을 하나씩 캐시에 담는다 ----
// 이미 화면에 쓴 것들은 HTTP 캐시에 있으니 네트워크를 다시 타지 않고, 아직
// 쓰지 않은 모델은 지금 받아둬서 3·4인을 골랐을 때 기다리지 않게 한다.
// 페이지는 지나간 것을 전부 넘기고, 담을 값어치가 있는지는 여기서 가린다 —
// 내주는 규칙과 담는 규칙이 어긋나면 캐시에 있어도 못 쓰는 것이 생긴다.
// 하나가 404여도(없는 소품이 하나 있다) 나머지는 계속 담는다.
async function warm(urls){
  const cache = await caches.open(CACHE);
  let added = 0;
  for (const url of urls || []){
    try {
      const parsed = new URL(url, self.location.href);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') continue;
      if (!isAsset(parsed)) continue;
      if (await cache.match(url)) continue;
      try {
        await cache.add(url);
      } catch (err){
        // 다른 출처가 CORS를 내주지 않으면 opaque로라도 담아둔다
        const res = await fetch(url, { mode: 'no-cors' });
        await cache.put(url, res);
      }
      added++;
    } catch (err){ /* 하나 못 담았다고 게임이 달라지지는 않는다 */ }
  }
  return added;
}

self.addEventListener('message', event => {
  const data = event.data;
  if (!data || data.type !== 'warm') return;
  const done = warm(data.urls).then(added => {
    if (event.ports && event.ports[0]) event.ports[0].postMessage({ warmed: added });
  });
  if (event.waitUntil) event.waitUntil(done);
});
