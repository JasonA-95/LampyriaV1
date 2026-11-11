// Exploration 2.5D (étape 1 : terrain en lecture seule). Module indépendant du combat 3D (rendu3d.js) ; la 2D reste dessinée dessous (logique, dialogues).
// Reprend uniquement les palettes de biome de Rendu3D.BIO. Pas d'interaction pour l'instant.
const Explo3D=(function(){
function start(o){
const B=BABYLON,d=o.carte,N=o.taille,BIO=Rendu3D.BIO,BI=BIO[d.biome]||BIO.foret;
const cv=o.canvas,eng=new B.Engine(cv,true,{stencil:true}),sc=new B.Scene(eng);
const dk=h=>'#'+[1,3,5].map(i=>Math.round(parseInt(h.substr(i,2),16)*.5).toString(16).padStart(2,'0')).join('');
const hx=h=>B.Color3.FromHexString(h),mat=(h,e)=>{const m=new B.StandardMaterial('m',sc);m.diffuseColor=hx(h);m.specularColor=B.Color3.Black();if(e)m.emissiveColor=hx(e);return m};
const M={a:mat(BI.a),b:mat(BI.b),dark:mat('#1a1418'),bark:mat('#5a3e2a'),l1:mat(BI.L[0]),l2:mat(BI.L[1]),l3:mat(BI.L[2]),rock:mat(d.biome=='desert'?'#8a7a62':d.biome=='marais'?'#4a463e':'#6b6258'),rock2:mat(d.biome=='desert'?'#9a8a70':'#7a7066'),stem:mat('#e8d8b8'),cap:mat('#c8503a'),cactus:mat('#4a7a4a'),pil:mat('#8a8096'),dead:mat(d.biome=='marais'?'#3a2e28':'#5a3e2a'),ad:mat(dk(BI.a)),bd:mat(dk(BI.b)),arr:mat('#f0e6c8','#f0e6c8'),don:mat('#b8862e','#5a3a08'),hero:mat('#ffd678','#b8742c'),halo:mat('#ffd678','#ffd678')};
M.arr.alpha=.55;M.arr.disableLighting=true;M.arr.backFaceCulling=false;M.halo.alpha=.85;M.halo.disableLighting=true;
sc.clearColor=B.Color4.FromHexString(BI.sky+'ff');
const rot=-3*Math.PI/4,cam=new B.ArcRotateCamera('cam',rot,Math.acos(1/Math.sqrt(3)),60,new B.Vector3(N/2-.5,0,N/2-.5),sc);cam.mode=B.Camera.ORTHOGRAPHIC_CAMERA;cam.minZ=.1;cam.maxZ=300;
// cadrage : toute la zone jouable visible (caméra fixe, centrée sur la carte)
let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const [x,y] of o.cells){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
const mx=(x0+x1)/2,my=(y0+y1)/2;let eu=0,ew=0;for(const [x,y] of o.cells){eu=Math.max(eu,Math.abs((x-mx)-(y-my))/Math.SQRT2);ew=Math.max(ew,Math.abs((x-mx)+(y-my))/Math.SQRT2/Math.sqrt(3))}
cam.target.set(mx,0,my);
function fit(){const a=eng.getRenderWidth()/eng.getRenderHeight(),h=Math.max(ew+1.8,(eu+1.2)/a);cam.orthoTop=h;cam.orthoBottom=-h;cam.orthoLeft=-h*a;cam.orthoRight=h*a}fit();
new B.HemisphericLight('h',new B.Vector3(-.3,1,-.2),sc).intensity=.75;const dl=new B.DirectionalLight('dl',new B.Vector3(-.5,-.9,-.35),sc);dl.intensity=.7;
// graine stable par carte : le décor ne change pas d'une visite à l'autre
let s=0;for(const ch of o.nom)s=(Math.imul(s,31)+ch.charCodeAt(0))>>>0;const rnd=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296};
const G=new Map(),reg=(m,x)=>{(G.get(m)||G.set(m,[]).get(m)).push(x);return x};
const box=(w,h,dd,m,x,y,z)=>{const b=B.MeshBuilder.CreateBox('b',{width:w,height:h,depth:dd},sc);b.material=m;b.position.set(x,y,z);b.isPickable=false;return reg(m,b)};
const cyl=(dm,h,m,x,y,z,dt)=>{const c=B.MeshBuilder.CreateCylinder('c',{diameterTop:dt==null?dm:dt,diameterBottom:dm,height:h,tessellation:8},sc);c.material=m;c.position.set(x,y,z);c.isPickable=false;return reg(m,c)};
const sph=(dm,m,x,y,z,sy)=>{const p=B.MeshBuilder.CreateSphere('s',{diameter:dm,segments:5},sc);p.material=m;p.position.set(x,y,z);if(sy)p.scaling.y=sy;p.isPickable=false;return reg(m,p)};
// sol : grande dalle sombre (continuité hors carte) + cases en damier
// zone jouable réelle de l'exploration (o.cells = DATA.excells, o.inside = DATA.exin) : un grand losange, pas le carré de l'arène
box(x1-x0+30,.2,y1-y0+30,M.dark,(x0+x1)/2,-.16,(y0+y1)/2);
// sorties par bords entiers (comme l'exploration 2D) : toute case du bord d'un côté qui a une sortie ; entrées de donjon = case unique
const SD={N:[-1,-1],S:[1,1],E:[1,-1],W:[-1,1]},side=new Set(d.exits.filter(e=>!e.don&&e.d).map(e=>e.d)),dons=new Set(d.exits.filter(e=>e.don).map(e=>e.x+','+e.y));
function arrow(cx,cz,dx,dz){const l=Math.hypot(dx,dz);dx/=l;dz/=l;const px=-dz,pz=dx,L=.3,W=.2,m=new B.Mesh('ar',sc),v=new B.VertexData();v.positions=[cx+dx*L,.02,cz+dz*L,cx-dx*L*.6+px*W,.02,cz-dz*L*.6+pz*W,cx-dx*L*.6-px*W,.02,cz-dz*L*.6-pz*W];v.indices=[0,1,2];v.normals=[0,1,0,0,1,0,0,1,0];v.applyToMesh(m);m.material=M.arr;m.isPickable=false;reg(M.arr,m)}
for(const [x,y] of o.cells){const k=x+','+y,sd=(DATA.exside?DATA.exside(x,y):[]).filter(q=>side.has(q)),ex=sd.length||dons.has(k),par=(x+y)&1;
box(1,.12,1,dons.has(k)?M.don:ex?(par?M.ad:M.bd):(par?M.a:M.b),x,-.06,y);
if(sd.length&&par==0)arrow(x,y,SD[sd[0]][0],SD[sd[0]][1])}
function deco(t,x,y){const r=rnd(),l=[M.l1,M.l2,M.l3][Math.floor(rnd()*3)];
if(t=='tree'){cyl(.22,1,M.bark,x,.5,y);sph(1.1+r*.4,l,x,1.4,y,.9)}
else if(t=='mush'){cyl(.2,.5,M.stem,x,.25,y);sph(.8+r*.3,M.cap,x,.6,y,.55)}
else if(t=='dead'){const c=cyl(.14,1.2+r*.4,M.dead,x,.6,y,.05);c.rotation.z=(r-.5)*.5}
else if(t=='cactus'){cyl(.3,1,M.cactus,x,.5,y);cyl(.16,.5,M.cactus,x+.22,.7,y)}
else if(t=='pillar'){cyl(.5,1.8,M.pil,x,.9,y,.42)}
else{const b=box(.7+r*.3,.45+r*.4,.7+r*.3,r>.5?M.rock:M.rock2,x,.25,y);b.rotation.y=r*3}}
const rocks=new Set();for(const [x,y] of d.rocks){rocks.add(x+','+y);deco(BI.obs[Math.floor(rnd()*BI.obs.length)],x,y)}
const exits=new Set(d.exits.filter(e=>e.don).map(e=>e.x+','+e.y));
// anneau de décor autour de la carte (hors cases jouables, hors sorties et rochers déjà posés)
for(let x=x0-3;x<x1+4;x++)for(let y=y0-3;y<y1+4;y++){if(o.inside(x,y))continue;const k=x+','+y;if(rocks.has(k)||exits.has(k))continue;if(rnd()<.42)deco(BI.bord[Math.floor(rnd()*BI.bord.length)],x+(rnd()-.5)*.4,y+(rnd()-.5)*.4)}
// fusion par matériau : quelques appels de dessin au lieu de centaines (mobile)
for(const [m,l] of G){const r=B.Mesh.MergeMeshes(l,true,true);if(r){r.material=m;r.isPickable=false}}
// --- sprites : même technique que le combat (plan en billboard Y, UV mises à jour par image, retournement gauche/droite) ---
const al=cam.alpha,TILT=B.Material.MATERIAL_ALPHATESTANDBLEND;
const fm=(c,a)=>{const m=new B.StandardMaterial('fm',sc);m.diffuseColor=hx(c);m.emissiveColor=hx(c);m.alpha=a;m.disableLighting=true;m.backFaceCulling=false;return m};
const spm=tx=>{const m=new B.StandardMaterial('sm',sc);m.diffuseTexture=tx;m.emissiveTexture=tx;m.disableLighting=true;m.useAlphaFromDiffuseTexture=true;m.backFaceCulling=false;m.transparencyMode=TILT;m.alphaCutOff=.08;return m};
const SHM=fm('#000000',.4),EMC={};
function emojiTex(e){if(EMC[e])return EMC[e];const t=new B.DynamicTexture('e',128,sc,true),c=t.getContext();c.clearRect(0,0,128,128);c.font='100px serif';c.textAlign='center';c.textBaseline='middle';c.fillText(e,64,70);t.update();t.hasAlpha=true;return EMC[e]=t}
function shadow(parent,r){const d=B.MeshBuilder.CreateDisc('sh',{radius:r,tessellation:20},sc);d.parent=parent;d.rotation.x=Math.PI/2;d.position.y=.03;d.material=SHM;d.isPickable=false;return d}
// Pastille d'emoji (PNJ, ressources, coffres, cachettes, monstres sans sprite)
function pastille(e){const t=new B.TransformNode('p',sc),pl=B.MeshBuilder.CreatePlane('pe',{size:.95},sc);pl.parent=t;pl.position.y=.5;pl.billboardMode=B.Mesh.BILLBOARDMODE_Y;pl.material=spm(emojiTex(e));pl.isPickable=false;shadow(t,.34);return{t,frame(){},mat:pl.material}}
// Sprite animé (héros : 2 rangées repos/marche ; monstres : 1 rangée repos). SP = {url,cw,ch,h,rows,lift}
function sprite(SP,isH,fallback){const t=new B.TransformNode('s',sc),H=SP.h||1.9,pl=B.MeshBuilder.CreatePlane('spr',{width:H*SP.cw/SP.ch,height:H,updatable:true},sc);pl.parent=t;pl.position.y=H/2-.02+(SP.lift||0);pl.billboardMode=B.Mesh.BILLBOARDMODE_Y;pl.isPickable=false;pl.alwaysSelectAsActiveMesh=true;
const tx=new B.Texture(SP.url,sc,false,true,B.Texture.TRILINEAR_SAMPLINGMODE,null,()=>{console.error('sprite introuvable',SP.url);pl.dispose();if(fallback)fallback(t)});tx.hasAlpha=true;tx.wrapU=tx.wrapV=B.Texture.CLAMP_ADDRESSMODE;pl.material=spm(tx);shadow(t,isH?.46:Math.max(.3,Math.min(.9,H*.25)));
let ha=null;if(isH){ha=B.MeshBuilder.CreateTorus('ha',{diameter:.98,thickness:.05,tessellation:28},sc);ha.parent=t;ha.position.y=.05;ha.material=fm('#ffd678',.85);ha.isPickable=false}
const uv0=pl.getVerticesData(B.VertexBuffer.UVKind).slice(),st={t:0,face:isH?1:-1,dir:'side',key:''};
function face(vx,vy){const sx=vx*(-Math.sin(al))+vy*Math.cos(al),sy=vx*(-Math.cos(al))+vy*(-Math.sin(al));if(Math.hypot(sx,sy)<.02)return;st.dir=Math.abs(sy)<.4*Math.abs(sx)?'side':sy>0?'back':'front';if(Math.abs(sx)>.02)st.face=sx>0?1:-1}
return{t,frame(dt,mv,vx,vy,now){if(mv)face(vx,vy);const nr=SP.rows||2;st.t+=dt*(mv?(st.dir=='side'?9:6):(nr==1?3:5));const n=st.dir=='side'?5:2,c0=st.dir=='side'?0:st.dir=='front'?5:7,col=c0+Math.floor(st.t)%n,row=nr==1?0:mv?1:0,key=col+'/'+row+'/'+st.face;
if(ha)ha.scaling.x=ha.scaling.z=1+.05*Math.sin(now/260);
if(key!=st.key){st.key=key;const e=.0003,u0=col/9+e,u1=(col+1)/9-e,v0=(nr==1?0:row?0:.5)+e,v1=(nr==1?1:row?.5:1)-e,uv=uv0.slice();for(let q=0;q<uv.length;q+=2){let a=uv0[q]>.5?1:0;const b=uv0[q+1]>.5?1:0;if(st.face<0)a=1-a;uv[q]=a?u1:u0;uv[q+1]=b?v1:v0}pl.updateVerticesData(B.VertexBuffer.UVKind,uv)}}}}
// Héros
const hSP=o.sprites&&o.sprites[o.classe];let hero,hp=o.pos();
{const mk=()=>{const b=B.MeshBuilder.CreateSphere('hb',{diameter:.55,segments:6},sc);b.position.y=.45;b.material=M.hero;b.isPickable=false;return b};
if(hSP){hero=sprite(hSP,true,t=>{mk().parent=t})}else{const t=new B.TransformNode('hn',sc);mk().parent=t;shadow(t,.4);hero={t,frame(){}}}}
hero.t.position.set(hp.x,0,hp.y);
// Entités (PNJ, ressources, groupes de monstres...) : synchronisées 4 fois par seconde avec les données d'exploration
const EN=new Map();let es=0;
function syncEnts(){const L=o.ents(),seen=new Set();for(const q of L){seen.add(q.k);let r=EN.get(q.k);if(r&&r.sig!=q.e+'|'+q.m){r.o.t.dispose();EN.delete(q.k);r=null}
if(!r){const MS=q.m&&o.msprites&&o.msprites[q.m];r={sig:q.e+'|'+q.m,o:MS?sprite(MS,false,t=>{const p=pastille(q.e);p.t.parent=t}):pastille(q.e)};EN.set(q.k,r)}
r.o.t.position.set(q.x,0,q.y);if(r.o.mat)r.o.mat.alpha=q.a==null?1:q.a}
for(const [k,r] of EN)if(!seen.has(k)){r.o.t.dispose();EN.delete(k)}}
// Chemin choisi (aperçu du trajet) : petits disques au sol
const PM=fm('#6fe0e0',.55),PD=[];let psig='';
function syncPath(){const p=o.path()||[],g=p.map(c=>c.join(',')).join(';');if(g==psig)return;psig=g;while(PD.length)PD.pop().dispose();for(const [x,y] of p){const d=B.MeshBuilder.CreateDisc('pd',{radius:.2,tessellation:14},sc);d.rotation.x=Math.PI/2;d.position.set(x,.02,y);d.material=PM;d.isPickable=false;PD.push(d)}}
let last=performance.now(),lf=0,px=hp.x,py=hp.y;
eng.runRenderLoop(()=>{const n=performance.now();if(n-lf<28)return;lf=n;const dt=Math.min(.1,(n-last)/1000);last=n;
if(o.alive&&!o.alive()){if(o.onDead)o.onDead();return}
if(n-es>250){es=n;try{syncEnts();syncPath()}catch(e){console.error('Exploration 3D',e)}}
const p=o.pos(),vx=p.x-px,vy=p.y-py,mv=Math.hypot(vx,vy)>.004;px=p.x;py=p.y;hero.t.position.set(p.x,0,p.y);hero.frame(dt,mv,vx,vy,n);
for(const [,r] of EN)r.o.frame(dt,false,0,0,n);
sc.render()});
// Case sous le doigt : intersection du rayon de la caméra avec le sol (y=0)
function cellAt(cx,cy){const r=cv.getBoundingClientRect();if(cx<r.left||cx>r.right||cy<r.top||cy>r.bottom)return null;const ray=sc.createPickingRay(cx-r.left,cy-r.top,B.Matrix.Identity(),cam);if(Math.abs(ray.direction.y)<1e-4)return null;const t=-ray.origin.y/ray.direction.y;return{x:Math.round(ray.origin.x+ray.direction.x*t),y:Math.round(ray.origin.z+ray.direction.z*t)}}
const onR=()=>{eng.resize();fit()};addEventListener('resize',onR);
return{cellAt,stop(){removeEventListener('resize',onR);eng.stopRenderLoop();sc.dispose();eng.dispose()}}}
return{start}
})();
