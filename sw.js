const V='lampyria-v80';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(n=>n!=V).map(n=>caches.delete(n)))).then(()=>clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!='GET') return;
  e.respondWith(
    fetch(e.request,{cache:'no-store'})
      .then(r=>{
        const c=r.clone();
        caches.open(V).then(x=>x.put(e.request,c)).catch(()=>{});
        return r;
      })
      .catch(()=>caches.match(e.request).then(r=>r||new Response('Hors ligne',{status:503})))
  );
});
