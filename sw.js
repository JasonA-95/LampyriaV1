const V='lampyria-v164',S='lampyria-sons';
// Pré-chargement à l'installation : le jeu (et le moteur 3D) démarre hors ligne dès la première visite, sans attendre d'avoir tout joué une fois.
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','donnees.js','xp.js','suivi.js','histoire.js','donjons.js','moteur.js','options.js','icones.js','son.js','musique.js','etat.js','succes.js','menu.js','exploration.js','alea.js','scenes.js','rendu.js','titre.js','tuto.js','heros.js','sprites.js','monstres.js','pnj.js','icones-sorts.js','rendu3d.js','explo3d.js','affichage.js','spr-archer.png','spr-fossoyeur.png','spr-mage.png','spr-porte.png','mon-berger.png','mon-bouc.png','mon-champi.png','mon-luc1.png','mon-luc2.png','mon-mouche.png','mon-mouton.png','mon-mycel.png','mon-blaireau-atk.png','mon-cracheur-atk.png','mon-crapaud-atk.png','mon-duchesse-atk.png','mon-grillon-atk.png','mon-heron-atk.png','mon-loup-atk.png','mon-loupbrume-atk.png','mon-sac-atk.png','mon-blaireau.png','mon-cracheur.png','mon-crapaud.png','mon-duchesse.png','mon-grillon.png','mon-heron.png','mon-loup.png','mon-loupbrume.png','mon-sac.png','mon-roi.png','mon-formulaire.png','mon-squelette.png','mon-scorpion.png','mon-chaussette1.png','mon-chameau.png','mon-chaussette2.png','mon-general.png','mon-moustique.png','mon-pelotecanon.png','mon-peloteenragee.png','mon-clerc.png','mon-plume.png','mon-chambellan.png','mon-catapulte.png','mon-classeur.png','mon-greffier.png','mon-papillon.png','mon-chasseur.png','mon-oreiller.png'];
const BAB='https://cdnjs.cloudflare.com/ajax/libs/babylonjs/6.49.0/babylon.js';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(err=>console.warn('Pré-chargement raté',u,err))).concat(c.add(new Request('babylon.js',{cache:'reload'})).catch(()=>fetch(BAB,{mode:'no-cors'}).then(r=>c.put(BAB,r))).catch(err=>console.warn('Pré-chargement raté Babylon',err))))))});
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
        // L'écriture se termine avant de renvoyer la réponse (le navigateur peut arrêter le worker juste après) ; une panne du cache ne bloque pas la réponse.
        if(r.ok||r.type=='opaque')return caches.open(V).then(x=>x.put(e.request,r.clone())).catch(err=>console.warn('Cache non écrit',err)).then(()=>r);
        return r;
      })
      .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode=='navigate'?caches.match('index.html'):null)).then(r=>r||new Response('Hors ligne',{status:503})))
  );
});
