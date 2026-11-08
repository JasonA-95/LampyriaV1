const V='lampyria-v127',S='lampyria-sons';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(n=>/^lampyria-v\d+$/.test(n)&&n!=V).map(n=>caches.delete(n)))).then(()=>clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!='GET') return;
  const instrument=/_FluidR3_GM_sf2_file\.js$/.test(new URL(e.request.url).pathname);
  if(instrument){
    e.respondWith((async()=>{
      let cache;
      try{
        cache=await caches.open(S);
        const hit=await cache.match(e.request);
        if(hit)return hit;
      }catch(error){console.warn('Lampyria : lecture du cache des instruments impossible.',error)}
      const response=await fetch(e.request);
      if(cache&&(response.ok||response.type=='opaque')){
        try{await cache.put(e.request,response.clone())}
        catch(error){console.warn('Lampyria : enregistrement des instruments impossible.',error)}
      }
      return response;
    })());
    return;
  }
  e.respondWith(fetch(e.request,{cache:'no-store'})
    .then(async response=>{
      if(response.ok||response.type=='opaque'){
        try{
          const cache=await caches.open(V);
          await cache.put(e.request,response.clone());
        }catch(error){console.warn('Lampyria : enregistrement du cache hors ligne impossible.',error)}
      }
      return response;
    })
    .catch(async()=>{
      try{
        const cached=await caches.match(e.request);
        if(cached)return cached;
      }catch(error){console.warn('Lampyria : lecture du cache hors ligne impossible.',error)}
      return new Response('Hors ligne',{status:503});
    })
  );
});
