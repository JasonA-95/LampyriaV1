// RENDU 3D : scène Babylon.js du combat 2.5D (module autonome, sans dépendance au DOM du jeu).
// Utilise le moteur Combat tel quel (lecture seule) ; le jeu appelle Rendu3D.start({canvas,labels,C,biome,equip,onTap}).
const Rendu3D=(function(){
const BIO={foret:{a:'#54402f',b:'#4a3527',sky:'#1b1322',L:['#2f5a46','#3d6f55','#4a8062'],obs:['rock','mush'],bord:['tree','tree','mush']},
collines:{a:'#5a5a34',b:'#505030',sky:'#1c2028',L:['#3f6a3a','#4d7b45','#5c8c52'],obs:['rock','rock','tree'],bord:['tree','rock']},
marais:{a:'#3f3a34',b:'#363029',sky:'#1a1618',L:['#4a4a3a','#5a5a46','#6a6a52'],obs:['rock','dead'],bord:['dead','dead','mush']},
desert:{a:'#9a7a4a',b:'#8c6e42',sky:'#2a1e22',L:['#6a8a4a','#7a9a56','#8aaa62'],obs:['rock','cactus'],bord:['cactus','rock']},
mer:{a:'#3a5a6a',b:'#33505f',sky:'#10202c',L:['#5a7a8a','#6a8a9a','#7a9aaa'],obs:['rock'],bord:['rock','rock','mush']},
temple:{a:'#5a4a5a',b:'#4e4050',sky:'#1c1426',L:['#5a4a7a','#6a5a8a','#7a6a9a'],obs:['rock','pillar'],bord:['pillar','rock']}};
BIO.manoir=BIO.citadelle=BIO.trone=BIO.serre=BIO.roseliere=BIO.temple;BIO.village=BIO.foret;
const DIRS3=[[1,0],[-1,0],[0,1],[0,-1]];
// obstacles aléatoires (remplace C.rocks) : NON appelé automatiquement, à décider à l'intégration
function obstacles(C,seed,keep){keep=keep||[];let s=seed>>>0;const rnd=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296};
const inC=new Set(C.cells.map(a=>a.join(','))),H=C.hero,foes=C.foes.filter(f=>f.hp>0),near=(x,y)=>keep.some(c=>c[0]==x&&c[1]==y)||Math.abs(x-H.x)+Math.abs(y-H.y)<=2||foes.some(f=>Math.abs(x-f.x)+Math.abs(y-f.y)<=1);
const rocks=new Set(),target=18+Math.floor(rnd()*10),free=C.cells.filter(([x,y])=>!near(x,y));
function reachable(rk){const q=[[H.x,H.y]],seen=new Set([H.x+','+H.y]);while(q.length){const [x,y]=q.shift();for(const [dx,dy] of DIRS3){const k=(x+dx)+','+(y+dy);if(inC.has(k)&&!rk.has(k)&&!seen.has(k)){seen.add(k);q.push([x+dx,y+dy])}}}return keep.every(c=>seen.has(c.join(',')))&&foes.every(f=>DIRS3.some(([dx,dy])=>seen.has((f.x+dx)+','+(f.y+dy))||seen.has(f.x+','+f.y)))}
for(let t=0;t<400&&rocks.size<target;t++){const [x,y]=free[Math.floor(rnd()*free.length)],k=x+','+y;if(rocks.has(k)||C.at(x,y))continue;rocks.add(k);if(!reachable(rocks))rocks.delete(k)}
C.rocks=rocks;return rocks}
function start(o){
if(!document.getElementById('r3css')){const st=document.createElement('style');st.id='r3css';st.textContent='.lab{position:absolute;transform:translate(-50%,-100%);text-align:center;font-size:9px;opacity:.8;white-space:nowrap;color:#f3e7cf;text-shadow:0 1px 2px #000;pointer-events:none}.lab .bar{width:34px;height:3px;background:#3a1f1f;border:1px solid #120a0e;margin:2px auto 0}.lab .bar i{display:block;height:100%;background:#e5564a}.lab.h .bar i{background:#6fcf7a}';document.head.appendChild(st)}
const B=BABYLON,C=o.C,cv=o.canvas,DIRS=DIRS3,biome=o.biome||'foret',BI=BIO[biome]||BIO.foret;
const eng=new B.Engine(cv,true,{stencil:true}),sc=new B.Scene(eng);let rot=-3*Math.PI/4,Z=1;
const hx=h=>B.Color3.FromHexString(h),mat=(h,e)=>{const m=new B.StandardMaterial('m',sc);m.diffuseColor=hx(h);m.specularColor=B.Color3.Black();if(e)m.emissiveColor=hx(e);return m};
const M={a:mat('#54402f'),b:mat('#4a3527'),reach:mat('#2f8f90','#134a4a'),range:mat('#e08a2c','#7a4010'),range2:mat('#7a5230','#2e1a0a'),hover:mat('#8a7a50','#3a3220'),bark:mat('#5a3e2a'),leaf1:mat('#2f5a46'),leaf2:mat('#3d6f55'),leaf3:mat('#4a8062'),rock:mat('#6b6258'),rock2:mat('#7a7066'),stem:mat('#e8d8b8'),cap:mat('#c8503a'),hero:mat('#b8742c'),cream:mat('#e8d9b0'),skin:mat('#e0b894'),foe:mat('#8a5ac0'),ring:mat('#e5564a','#7a1c1c'),path:mat('#6fe0e0','#2a7a7a'),aoe:mat('#d04040','#6a1818')};
M.a.diffuseColor=hx(BI.a);M.b.diffuseColor=hx(BI.b);M.leaf1.diffuseColor=hx(BI.L[0]);M.leaf2.diffuseColor=hx(BI.L[1]);M.leaf3.diffuseColor=hx(BI.L[2]);sc.clearColor=B.Color4.FromHexString(BI.sky+'ff');
if(biome=='desert'){M.rock.diffuseColor=hx('#8a7a62');M.rock2.diffuseColor=hx('#9a8a70');M.cactus=mat('#4a7a4a')}if(biome=='marais'){M.bark.diffuseColor=hx('#3a2e28');M.rock.diffuseColor=hx('#4a463e')}M.pil=mat('#8a8096');M.cactus=M.cactus||mat('#4a7a4a');
const cam=new B.ArcRotateCamera('cam',rot,Math.acos(1/Math.sqrt(3)),60,new B.Vector3(6.5,0,6.5),sc);cam.mode=B.Camera.ORTHOGRAPHIC_CAMERA;cam.minZ=.1;cam.maxZ=300;
function fit(){const a=eng.getRenderWidth()/eng.getRenderHeight(),h=Math.max(11/a,5.8)*Z;cam.orthoTop=h;cam.orthoBottom=-h;cam.orthoLeft=-h*a;cam.orthoRight=h*a}fit();
new B.HemisphericLight('h',new B.Vector3(-.3,1,-.2),sc).intensity=.75;const dl=new B.DirectionalLight('d',new B.Vector3(-.5,-.9,-.35),sc);dl.intensity=.7;
function fin(m,mt,ol=true){m.material=mt;if(m.convertToFlatShadedMesh&&!m.name.startsWith('b'))m.convertToFlatShadedMesh();if(ol){m.renderOutline=true;m.outlineWidth=.025;m.outlineColor=new B.Color3(.07,.04,.05)}return m}
const root=n=>new B.TransformNode(n,sc);
function tree(x,z,s,alt){const t=root('t');t.position.set(x,0,z);const k=B.MeshBuilder.CreateCylinder('k',{height:.9*s,diameterTop:.18*s,diameterBottom:.26*s,tessellation:5},sc);k.position.y=.45*s;k.parent=t;fin(k,M.bark);
[[.65,1.1,.45,M.leaf1],[.52,1.0,1.05,M.leaf2],[.36,.9,1.6,M.leaf3]].forEach(([r,h,y,m],i)=>{const c=B.MeshBuilder.CreateCylinder('l',{height:h*s,diameterTop:.04*s,diameterBottom:r*2*s,tessellation:6},sc);c.position.y=(y+.4)*s;c.rotation.y=i*.5;c.parent=t;fin(c,alt?M.foe:m)});return t}
function rock(x,z,s,seed){const t=root('r');t.position.set(x,0,z);[[0,0,.38,M.rock],[.28,.1,.22,M.rock2]].forEach(([dx,dz,r,m],i)=>{const b=B.MeshBuilder.CreateIcoSphere('b',{radius:r*s,subdivisions:1,flat:true},sc);b.scaling.y=.7;b.position.set(dx*s,.16*s,dz*s);b.rotation.y=seed+i;b.parent=t;fin(b,m)});return t}
function mush(x,z,s,cap){const t=root('m');t.position.set(x,0,z);const st=B.MeshBuilder.CreateCylinder('s',{height:.6*s,diameter:.28*s,tessellation:6},sc);st.position.y=.3*s;st.parent=t;fin(st,M.stem);const c=B.MeshBuilder.CreateSphere('c',{diameter:.9*s,segments:5,slice:.5},sc);c.position.y=.55*s;c.parent=t;fin(c,cap||M.cap);return t}
function dead(x,z,s){const t=root('d');t.position.set(x,0,z);const k=B.MeshBuilder.CreateCylinder('k',{height:1.5*s,diameterTop:.06*s,diameterBottom:.22*s,tessellation:5},sc);k.position.y=.75*s;k.parent=t;fin(k,M.bark);const br=B.MeshBuilder.CreateCylinder('k',{height:.8*s,diameterTop:.03*s,diameterBottom:.1*s,tessellation:4},sc);br.position.set(.2*s,1.1*s,0);br.rotation.z=-.9;br.parent=t;fin(br,M.bark);return t}
function cactus(x,z,s){const t=root('c');t.position.set(x,0,z);const k=B.MeshBuilder.CreateCylinder('k',{height:1.1*s,diameter:.3*s,tessellation:6},sc);k.position.y=.55*s;k.parent=t;fin(k,M.cactus);const a=B.MeshBuilder.CreateCylinder('k',{height:.45*s,diameter:.18*s,tessellation:5},sc);a.position.set(.25*s,.7*s,0);a.parent=t;fin(a,M.cactus);return t}
function pillar(x,z,s){const t=root('p');t.position.set(x,0,z);const k=B.MeshBuilder.CreateCylinder('k',{height:1.3*s,diameterTop:.4*s,diameterBottom:.5*s,tessellation:6},sc);k.position.y=.65*s;k.parent=t;fin(k,M.pil);return t}
const BUILD={rock:(x,y,h)=>rock(x,y,.9+(h%3)*.15,h),tree:(x,y,h)=>tree(x,y,.9+(h%3)*.15,false),mush:(x,y,h)=>mush(x,y,1.1,h&1?M.cap:M.foe),dead:(x,y,h)=>dead(x,y,.9+(h%3)*.15),cactus:(x,y,h)=>cactus(x,y,.9+(h%3)*.15),pillar:(x,y,h)=>pillar(x,y,.9+(h%3)*.1)};
const tiles={},tl=[];for(const [x,y] of C.cells){const b=B.MeshBuilder.CreateBox('c',{width:1,height:.5,depth:1},sc);b.position.set(x,-.25,y);b.material=(x+y)&1?M.b:M.a;b.metadata={x,y,base:b.material};tiles[x+','+y]=b;tl.push(b)}
// décor : rochers réels + arbres/champignons en bordure
for(const k of C.rocks){const [x,y]=k.split(',').map(Number),h=Math.abs(x*3+y);BUILD[BI.obs[h%BI.obs.length]](x,y,h)}
const IN=new Set(C.cells.map(a=>a[0]+','+a[1])),seen=new Set();let n=0;
for(const [x,y] of C.cells)for(const [dx,dy] of DIRS){const X=x+dx,Y=y+dy,k=X+','+Y;if(IN.has(k)||seen.has(k))continue;seen.add(k);const h=((X*7+Y*13)%5+5)%5;n++;if(h<4)BUILD[BI.bord[h%BI.bord.length]](X,Y,h+Math.abs(X*3+Y))}
const OBJ=Array.isArray(DATA.objets)?Object.fromEntries(DATA.objets):DATA.objets,hcol=id=>{let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))>>>0;return '#'+['b8742c','7a4a2a','8a3a3a','4a5a7a','5a7a4a','8a6a9a'][h%6]};
let EQ=(o.equip||[]).filter(x=>OBJ[x]);
const part=(o,m,y,x=0,z=0)=>{m.parent=o.eq;m.position.set(x,y,z);return m};
const EQB={
tete:(o,id)=>{const c=mat(hcol(id)),n=(OBJ[id].n||'').toLowerCase();if(/casquette|bonnet|chapeau/.test(n)&&!/chapeau/.test(n)){fin(part(o,B.MeshBuilder.CreateCylinder('t',{height:.16,diameter:.5,tessellation:6},sc),1.2),c);fin(part(o,B.MeshBuilder.CreateBox('t',{width:.3,height:.05,depth:.22},sc),1.14,0,.27),c)}else{fin(part(o,B.MeshBuilder.CreateCylinder('t',{height:.38,diameterTop:0,diameterBottom:.55,tessellation:6},sc),1.3),c)}},
corps:(o,id)=>{const c=mat(hcol(id));fin(part(o,B.MeshBuilder.CreateCylinder('v',{height:.5,diameterTop:.36,diameterBottom:.62,tessellation:6},sc),.5),c);fin(part(o,B.MeshBuilder.CreateCylinder('v',{height:.08,diameter:.4,tessellation:6},sc),.76),M.cream)},
bottes:(o,id)=>{const c=mat('#3a2418');[-.12,.12].forEach(x=>fin(part(o,B.MeshBuilder.CreateBox('b',{width:.17,height:.14,depth:.24},sc),.07,x,.03),c))},
arme:(o,id)=>{const c=mat(hcol(id)),e=mat('#ffb04a','#ff7a20');const t=part(o,B.MeshBuilder.CreateCylinder('w',{height:.85,diameter:.07,tessellation:5},sc),.6,.4);t.rotation.z=-.25;fin(t,c);part(o,B.MeshBuilder.CreateSphere('g',{diameter:.14,segments:4},sc),1.04,.48).material=e},
acc:(o,id)=>{fin(part(o,B.MeshBuilder.CreateTorus('a',{diameter:.42,thickness:.04,tessellation:10},sc),.9),mat(hcol(id)))}};
function dress(){const o=U.get(C.hero);if(!o||!o.eq)return;o.eq.getChildMeshes().forEach(m=>m.dispose());EQ.forEach(id=>{const f=EQB[OBJ[id].slot];if(f)f(o,id)})}
const U=new Map();
function unit(u,ally){const t=root('u');const isH=u===C.hero;const body=B.MeshBuilder.CreateCylinder('b',{height:.75,diameterTop:.3,diameterBottom:.55,tessellation:6},sc);body.position.y=.38;body.parent=t;fin(body,isH?M.hero:ally?M.cream:mat(u.boss?'#7a2a3a':'#7a4a66'));
const hd=B.MeshBuilder.CreateSphere('h',{diameter:.42,segments:5},sc);hd.position.y=1.0;hd.parent=t;fin(hd,isH?M.skin:ally?M.cream:mat(u.boss?'#9a3a4a':'#8a5ac0'));
let eq=null;if(isH){eq=root('eq');eq.parent=t}
const l=document.createElement('div');l.className='lab'+(isH?' h':'');l.innerHTML='<span></span><div class=bar><i></i></div>';o.labels.appendChild(l);
const ob={t,l,x:u.x,y:u.y,eq};t.position.set(u.x,0,u.y);U.set(u,ob);return ob}
let drag=null,moved=0,pt=new Map(),pinch=null;
cv.addEventListener('wheel',e=>{e.preventDefault();Z=Math.max(.2,Math.min(1.6,Z*(e.deltaY<0?.87:1.15)));fit()},{passive:false});
cv.addEventListener('pointerdown',e=>{pt.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pt.size==2){const [p,q]=[...pt.values()];pinch={d:Math.hypot(p.x-q.x,p.y-q.y)||1,z:Z};moved+=99}});
cv.addEventListener('pointermove',e=>{if(!pt.has(e.pointerId))return;pt.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pt.size==2&&pinch){const [p,q]=[...pt.values()];Z=Math.max(.2,Math.min(1.6,pinch.z*pinch.d/(Math.hypot(p.x-q.x,p.y-q.y)||1)));fit()}});
const pu=e=>{pt.delete(e.pointerId);if(pt.size<2)pinch=null};cv.addEventListener('pointerup',pu);cv.addEventListener('pointercancel',pu);
sc.onPointerObservable.add(pi=>{const e=pi.event;
if(pi.type==B.PointerEventTypes.POINTERDOWN){drag={x:e.clientX,y:e.clientY};moved=0}
else if(pi.type==B.PointerEventTypes.POINTERUP)drag=null;
else if(pi.type==B.PointerEventTypes.POINTERMOVE&&drag&&pt.size<2){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag={x:e.clientX,y:e.clientY};moved+=Math.abs(dx)+Math.abs(dy);const k=2*cam.orthoTop/cv.clientHeight;cam.target.x+=-dx*k*(-Math.sin(rot))+dy*k/.816*(-Math.cos(rot));cam.target.z+=-dx*k*Math.cos(rot)+dy*k/.816*(-Math.sin(rot))}
else if(pi.type==B.PointerEventTypes.POINTERTAP&&moved<12){const p=sc.pick(sc.pointerX,sc.pointerY,m=>tl.includes(m));if(p.hit&&o.onTap)o.onTap(p.pickedMesh.metadata.x,p.pickedMesh.metadata.y)}});
let t0=performance.now();
sc.onBeforeRenderObservable.add(()=>{const dt=Math.min(.05,(performance.now()-t0)/1000);t0=performance.now();
cam.alpha+=(rot-cam.alpha)*Math.min(1,dt*8);
const list=[C.hero,...C.foes,...C.allies],W=eng.getRenderWidth(),H=eng.getRenderHeight(),tm=sc.getTransformMatrix(),vp=cam.viewport.toGlobal(W,H),rc=cv.getBoundingClientRect(),lr=o.labels.getBoundingClientRect();
for(const u of list){const alive=u.hp>0;let ob=U.get(u);if(!ob){if(!alive)continue;ob=unit(u,C.allies.includes(u))}
if(u===C.hero&&!ob.dressed){ob.dressed=1;dress()}ob.t.setEnabled(alive);ob.l.style.display=alive?'':'none';if(!alive)continue;
const k=Math.min(1,dt*9);ob.x+=(u.x-ob.x)*k;ob.y+=(u.y-ob.y)*k;ob.t.position.set(ob.x,0,ob.y);
const p=B.Vector3.Project(new B.Vector3(ob.x,1.9,ob.y),B.Matrix.Identity(),tm,vp);ob.l.style.left=(rc.left-lr.left+p.x/W*rc.width)+'px';ob.l.style.top=(rc.top-lr.top+p.y/H*rc.height)+'px';
ob.l.firstChild.textContent=(u===C.hero?(o.heroName||'Livreur'):u.n||'')+' '+Math.max(0,u.hp);ob.l.querySelector('i').style.width=Math.max(0,u.hp/(u.max||1)*100)+'%'}});
let lf=0;eng.runRenderLoop(()=>{const n=performance.now();if(n-lf<28)return;lf=n;sc.render()});const onR=()=>{eng.resize();fit()};addEventListener('resize',onR);
return{
setTiles(map){for(const k in tiles){const b=tiles[k],c=map&&map[k];b.material=c=='aoe'?M.aoe:c=='path'?M.path:c=='reach'?M.reach:c=='range'?M.range:c=='range2'?M.range2:b.metadata.base}},
cellAt(cx,cy){const r=cv.getBoundingClientRect();if(cx<r.left||cx>r.right||cy<r.top||cy>r.bottom)return null;const p=sc.pick(cx-r.left,cy-r.top,m=>tl.includes(m));return p.hit?{x:p.pickedMesh.metadata.x,y:p.pickedMesh.metadata.y}:null},
project(x,y,h){const W=eng.getRenderWidth(),H=eng.getRenderHeight(),r=cv.getBoundingClientRect(),q=B.Vector3.Project(new B.Vector3(x,h==null?1.2:h,y),B.Matrix.Identity(),sc.getTransformMatrix(),cam.viewport.toGlobal(W,H));return{x:r.left+q.x/W*r.width,y:r.top+q.y/H*r.height}},
zoom(f){Z=Math.max(.2,Math.min(1.6,Z*f));fit()},rotate(d){rot+=d*Math.PI/2},
setEquip(list){EQ=(list||[]).filter(x=>OBJ[x]);dress()},
stop(){removeEventListener('resize',onR);eng.stopRenderLoop();for(const [,ob] of U)ob.l.remove();sc.dispose();eng.dispose()}}}
return{available:()=>typeof BABYLON!='undefined',start,obstacles,BIO}
})();
