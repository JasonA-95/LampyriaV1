// Exploration 2.5D (étape 1 : terrain en lecture seule). Module indépendant du combat 3D (rendu3d.js) ; la 2D reste dessinée dessous (logique, dialogues).
// Reprend uniquement les palettes de biome de Rendu3D.BIO. Pas d'interaction pour l'instant.
const Explo3D=(function(){
function start(o){
const B=BABYLON,d=o.carte,N=o.taille,BIO=Rendu3D.BIO,BI=BIO[d.biome]||BIO.foret;
const cv=o.canvas,eng=new B.Engine(cv,true,{stencil:true}),sc=new B.Scene(eng);
const hx=h=>B.Color3.FromHexString(h),mat=(h,e)=>{const m=new B.StandardMaterial('m',sc);m.diffuseColor=hx(h);m.specularColor=B.Color3.Black();if(e)m.emissiveColor=hx(e);return m};
const M={a:mat(BI.a),b:mat(BI.b),dark:mat('#1a1418'),bark:mat('#5a3e2a'),l1:mat(BI.L[0]),l2:mat(BI.L[1]),l3:mat(BI.L[2]),rock:mat(d.biome=='desert'?'#8a7a62':d.biome=='marais'?'#4a463e':'#6b6258'),rock2:mat(d.biome=='desert'?'#9a8a70':'#7a7066'),stem:mat('#e8d8b8'),cap:mat('#c8503a'),cactus:mat('#4a7a4a'),pil:mat('#8a8096'),dead:mat(d.biome=='marais'?'#3a2e28':'#5a3e2a'),exit:mat('#e0a040','#7a4a10'),hero:mat('#ffd678','#b8742c'),halo:mat('#ffd678','#ffd678')};
M.halo.alpha=.85;M.halo.disableLighting=true;
sc.clearColor=B.Color4.FromHexString(BI.sky+'ff');
const rot=-3*Math.PI/4,cam=new B.ArcRotateCamera('cam',rot,Math.acos(1/Math.sqrt(3)),60,new B.Vector3(N/2-.5,0,N/2-.5),sc);cam.mode=B.Camera.ORTHOGRAPHIC_CAMERA;cam.minZ=.1;cam.maxZ=300;
function fit(){const a=eng.getRenderWidth()/eng.getRenderHeight(),h=Math.max(8/a,5.2);cam.orthoTop=h;cam.orthoBottom=-h;cam.orthoLeft=-h*a;cam.orthoRight=h*a}fit();
new B.HemisphericLight('h',new B.Vector3(-.3,1,-.2),sc).intensity=.75;const dl=new B.DirectionalLight('dl',new B.Vector3(-.5,-.9,-.35),sc);dl.intensity=.7;
// graine stable par carte : le décor ne change pas d'une visite à l'autre
let s=0;for(const ch of o.nom)s=(Math.imul(s,31)+ch.charCodeAt(0))>>>0;const rnd=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296};
const G=new Map(),reg=(m,x)=>{(G.get(m)||G.set(m,[]).get(m)).push(x);return x};
const box=(w,h,dd,m,x,y,z)=>{const b=B.MeshBuilder.CreateBox('b',{width:w,height:h,depth:dd},sc);b.material=m;b.position.set(x,y,z);b.isPickable=false;return reg(m,b)};
const cyl=(dm,h,m,x,y,z,dt)=>{const c=B.MeshBuilder.CreateCylinder('c',{diameterTop:dt==null?dm:dt,diameterBottom:dm,height:h,tessellation:8},sc);c.material=m;c.position.set(x,y,z);c.isPickable=false;return reg(m,c)};
const sph=(dm,m,x,y,z,sy)=>{const p=B.MeshBuilder.CreateSphere('s',{diameter:dm,segments:5},sc);p.material=m;p.position.set(x,y,z);if(sy)p.scaling.y=sy;p.isPickable=false;return reg(m,p)};
// sol : grande dalle sombre (continuité hors carte) + cases en damier
box(N+24,.2,N+24,M.dark,N/2-.5,-.16,N/2-.5);
for(let x=0;x<N;x++)for(let y=0;y<N;y++)box(1,.12,1,(x+y)%2?M.a:M.b,x,-.06,y);
function deco(t,x,y){const r=rnd(),l=[M.l1,M.l2,M.l3][Math.floor(rnd()*3)];
if(t=='tree'){cyl(.22,1,M.bark,x,.5,y);sph(1.1+r*.4,l,x,1.4,y,.9)}
else if(t=='mush'){cyl(.2,.5,M.stem,x,.25,y);sph(.8+r*.3,M.cap,x,.6,y,.55)}
else if(t=='dead'){const c=cyl(.14,1.2+r*.4,M.dead,x,.6,y,.05);c.rotation.z=(r-.5)*.5}
else if(t=='cactus'){cyl(.3,1,M.cactus,x,.5,y);cyl(.16,.5,M.cactus,x+.22,.7,y)}
else if(t=='pillar'){cyl(.5,1.8,M.pil,x,.9,y,.42)}
else{const b=box(.7+r*.3,.45+r*.4,.7+r*.3,r>.5?M.rock:M.rock2,x,.25,y);b.rotation.y=r*3}}
const rocks=new Set();for(const [x,y] of d.rocks){rocks.add(x+','+y);deco(BI.obs[Math.floor(rnd()*BI.obs.length)],x,y)}
const exits=new Set(d.exits.map(e=>e.x+','+e.y));
// anneau de décor autour de la carte (hors cases jouables, hors sorties et rochers déjà posés)
for(let x=-3;x<N+3;x++)for(let y=-3;y<N+3;y++){if(x>=0&&x<N&&y>=0&&y<N)continue;const k=x+','+y;if(rocks.has(k)||exits.has(k))continue;if(rnd()<.42)deco(BI.bord[Math.floor(rnd()*BI.bord.length)],x+(rnd()-.5)*.4,y+(rnd()-.5)*.4)}
// sorties : dalle lumineuse
for(const e of d.exits)box(1,.14,1,M.exit,e.x,-.04,e.y);
// fusion par matériau : quelques appels de dessin au lieu de centaines (mobile)
for(const [m,l] of G){const r=B.Mesh.MergeMeshes(l,true,true);if(r){r.material=m;r.isPickable=false}}
// marqueur du héros (provisoire, avant les sprites de l'étape 2)
const hero=new B.TransformNode('hero',sc),body=sph(.55,M.hero,0,.45,0);body.parent=hero;const ha=B.MeshBuilder.CreateTorus('ha',{diameter:.98,thickness:.05,tessellation:28},sc);ha.parent=hero;ha.position.y=.05;ha.material=M.halo;
let hx0=o.pos().x,hy0=o.pos().y;hero.position.set(hx0,0,hy0);cam.target.set(hx0,0,hy0);
let last=performance.now(),lf=0;
eng.runRenderLoop(()=>{const n=performance.now();if(n-lf<28)return;lf=n;const dt=Math.min(.1,(n-last)/1000);last=n;
if(o.alive&&!o.alive()){if(o.onDead)o.onDead();return}
const p=o.pos();hero.position.set(p.x,0,p.y);ha.scaling.x=ha.scaling.z=1+.05*Math.sin(n/260);
const k=Math.min(1,dt*6);cam.target.x+=(p.x-cam.target.x)*k;cam.target.z+=(p.y-cam.target.z)*k;sc.render()});
const onR=()=>{eng.resize();fit()};addEventListener('resize',onR);
return{stop(){removeEventListener('resize',onR);eng.stopRenderLoop();sc.dispose();eng.dispose()}}}
return{start}
})();
