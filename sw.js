const V='lampyria-v127',S='lampyria-sons';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('lampyria-')&&n!=V&&n!=S).map(n=>caches.delete(n)))).then(()=>clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!='GET') return;
  // Instruments (gros fichiers, immuables) : cache persistant, jamais retéléchargés à chaque session ni à chaque version.
  if(/_FluidR3_GM_sf2_file\.js$/.test(new URL(e.request.url).pathname)){
    e.respondWith(caches.open(S).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok||n.type=='opaque')c.put(e.request,n.clone()).catch(()=>{});return n}))));
    return;
  }
  e.respondWith(
    fetch(e.request,{cache:'no-store'})
      .then(r=>{
        // On ne garde que les réponses réussies (ou opaques, pour les scripts de CDN) : jamais une erreur 404/500.
        if(r.ok||r.type=='opaque'){const c=r.clone();e.waitUntil(caches.open(V).then(x=>x.put(e.request,c)).catch(err=>console.warn('Cache non écrit',err)))}
        return r;
      })
      .catch(()=>caches.match(e.request).then(r=>r||new Response('Hors ligne',{status:503})))
  );
});
