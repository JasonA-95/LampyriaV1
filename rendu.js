// RENDU : textures procédurales partagées par les grilles de combat et d'exploration.
const TERRAIN_SIZE=128,TERRAIN_VARIANTS=4,TERRAIN_CACHE=Object.create(null);
const OBSTACLE_SIZE=96,OBSTACLE_VARIANTS=3,OBSTACLE_CACHE=Object.create(null);
const DECOR_CACHE=Object.create(null),AMBIENCE_CACHE=Object.create(null);
const TERRAIN={
village:{base:'#55483b',light:'#71604a',grain:'#c3a77d'},
foret:{base:'#35443a',light:'#4b5a43',grain:'#91a36e'},
collines:{base:'#485665',light:'#637083',grain:'#a4b0b7'},
manoir:{base:'#494350',light:'#625868',grain:'#a497a8'},
marais:{base:'#41483f',light:'#59604a',grain:'#a4a17a'},
roseliere:{base:'#3e5651',light:'#52736d',grain:'#89b2a7'},
serre:{base:'#5b5a58',light:'#77736a',grain:'#c1c2ae'},
desert:{base:'#655642',light:'#806b4b',grain:'#baa276'},
temple:{base:'#6b5a3a',light:'#8f7a48',grain:'#e0c27a'},
mer:{base:'#35505e',light:'#4d7384',grain:'#9cc4d6'},
citadelle:{base:'#3f3a4c',light:'#575069',grain:'#9a8fb0'},
trone:{base:'#2c2a36',light:'#46414f',grain:'#c9a85a'}
};
function terrainHash(x,y){let h=Math.imul((x|0)^0x9e3779b9,0x85ebca6b);h=Math.imul(h^((y|0)+0x7f4a7c15),0xc2b2ae35);h^=h>>>16;return h>>>0}
function terrainRandom(seed){let state=seed>>>0;return()=>{state=(state+0x6d2b79f5)>>>0;let n=state;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return((n^(n>>>14))>>>0)/4294967296}}
function terrainSeed(biome,variant){let h=2166136261;for(const char of biome+'-'+variant)h=Math.imul(h^char.charCodeAt(0),16777619);return h>>>0}
function terrainDiamond(ctx){ctx.beginPath();ctx.moveTo(64,0);ctx.lineTo(128,32);ctx.lineTo(64,64);ctx.lineTo(0,32);ctx.closePath()}
function terrainDetail(ctx,biome,random){
const count=biome=='manoir'||biome=='serre'?170:230;
for(let i=0;i<count;i++){const x=random()*128,y=random()*64,size=.35+random()*1.1;ctx.globalAlpha=.025+random()*.055;ctx.fillStyle=random()<.5?'#080b0c':TERRAIN[biome].grain;ctx.fillRect(x,y,size,size)}
ctx.globalAlpha=.25;
if(biome=='village'){
for(let i=0;i<8;i++){const x=12+random()*104,y=8+random()*48;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+3+random()*4,y-4-random()*3);ctx.strokeStyle='#91a078';ctx.lineWidth=.8;ctx.stroke()}
for(let i=0;i<5;i++){const x=16+random()*96,y=9+random()*46;ctx.fillStyle='#95836b';ctx.fillRect(x,y,3+random()*5,1+random()*2)}
}else if(biome=='foret'){
for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(16+random()*96,8+random()*48,2+random()*4,0,Math.PI*2);ctx.fillStyle='#81965e';ctx.globalAlpha=.12;ctx.fill()}
for(let i=0;i<3;i++){const x=random()*128,y=10+random()*44;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+10,y+random()*8,x+18,y-5);ctx.strokeStyle='#9a9270';ctx.lineWidth=.8;ctx.globalAlpha=.22;ctx.stroke()}
}else if(biome=='collines'){
for(let i=0;i<9;i++){const x=random()*128,y=4+random()*56;ctx.beginPath();ctx.ellipse(x,y,1.5+random()*2,.7+random(),random(),0,Math.PI*2);ctx.fillStyle='#b0b5b7';ctx.globalAlpha=.2;ctx.fill()}
}else if(biome=='manoir'){
ctx.strokeStyle='#17151c';ctx.lineWidth=1;ctx.globalAlpha=.22;ctx.beginPath();ctx.moveTo(0,21);ctx.lineTo(128,21);ctx.moveTo(0,43);ctx.lineTo(128,43);ctx.moveTo(32,0);ctx.lineTo(32,21);ctx.moveTo(96,21);ctx.lineTo(96,43);ctx.moveTo(48,43);ctx.lineTo(48,64);ctx.stroke();
for(let i=0;i<3;i++){const x=random()*128,y=5+random()*54;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+3,y+2);ctx.lineTo(x+1,y+5);ctx.stroke()}
}else if(biome=='marais'){
for(let i=0;i<4;i++){const x=12+random()*104,y=7+random()*50;ctx.beginPath();ctx.ellipse(x,y,4+random()*7,1+random()*2,random()*.4,0,Math.PI*2);ctx.fillStyle='#96a08a';ctx.globalAlpha=.12;ctx.fill()}
for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(random()*128,random()*64,.8+random()*1.2,0,Math.PI*2);ctx.strokeStyle='#bdba94';ctx.globalAlpha=.28;ctx.stroke()}
}else if(biome=='roseliere'){
for(let i=0;i<6;i++){const x=random()*128,y=random()*64;ctx.beginPath();ctx.ellipse(x,y,4+random()*6,1+random()*2,-.2,0,Math.PI*2);ctx.strokeStyle='#a4c3b2';ctx.lineWidth=.7;ctx.globalAlpha=.24;ctx.stroke()}
}else if(biome=='serre'){
ctx.strokeStyle='#c7c2ac';ctx.lineWidth=1;ctx.globalAlpha=.23;ctx.beginPath();ctx.moveTo(0,16);ctx.lineTo(128,16);ctx.moveTo(0,32);ctx.lineTo(128,32);ctx.moveTo(0,48);ctx.lineTo(128,48);ctx.moveTo(32,0);ctx.lineTo(32,64);ctx.moveTo(64,0);ctx.lineTo(64,64);ctx.moveTo(96,0);ctx.lineTo(96,64);ctx.stroke();
}else if(biome=='temple'){
ctx.strokeStyle='#f0d58a';ctx.lineWidth=1;ctx.globalAlpha=.2;for(let i=0;i<7;i++){const a=i*Math.PI/7;ctx.beginPath();ctx.moveTo(64,32);ctx.lineTo(64+Math.cos(a)*70,32+Math.sin(a)*35);ctx.stroke()}ctx.globalAlpha=.16;ctx.beginPath();ctx.ellipse(64,32,14,7,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(64,32,30,15,0,0,Math.PI*2);ctx.stroke();
}else if(biome=='citadelle'){
ctx.strokeStyle='#14121a';ctx.lineWidth=1.2;ctx.globalAlpha=.4;for(let i=0;i<3;i++){let x=10+random()*108,y=6+random()*20;ctx.beginPath();ctx.moveTo(x,y);for(let k=0;k<4;k++){x+=(random()-.5)*26;y+=6+random()*8;ctx.lineTo(x,y)}ctx.stroke()}
}else if(biome=='trone'){
ctx.strokeStyle='#d9b45f';ctx.lineWidth=1.2;ctx.globalAlpha=.3;ctx.beginPath();ctx.moveTo(0,32);ctx.lineTo(128,32);ctx.moveTo(64,0);ctx.lineTo(64,64);ctx.stroke();ctx.globalAlpha=.18;ctx.beginPath();ctx.ellipse(64,32,24,12,0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#0d0c12';ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(20,10);ctx.lineTo(34,22);ctx.lineTo(30,36);ctx.stroke();
}else if(biome=='mer'){
ctx.strokeStyle='#a8d0e0';ctx.lineWidth=1;ctx.globalAlpha=.22;for(let i=0;i<5;i++){const y=7+i*12+(random()-.5)*3;ctx.beginPath();ctx.moveTo(4,y);ctx.quadraticCurveTo(24,y-5,44,y);ctx.quadraticCurveTo(64,y+5,84,y);ctx.quadraticCurveTo(104,y-4,124,y);ctx.stroke()}
}else if(biome=='desert'){
ctx.strokeStyle='#c0a578';ctx.lineWidth=1;ctx.globalAlpha=.22;for(let i=0;i<5;i++){const y=6+i*12+(random()-.5)*4;ctx.beginPath();ctx.moveTo(4,y);ctx.quadraticCurveTo(38,y-5,64,y);ctx.quadraticCurveTo(95,y+5,124,y-1);ctx.stroke()}
}
ctx.globalAlpha=1
}
function makeTerrainTile(biome,variant){const canvas=document.createElement('canvas');canvas.width=TERRAIN_SIZE;canvas.height=TERRAIN_SIZE/2;const ctx=canvas.getContext('2d'),palette=TERRAIN[biome],gradient=ctx.createLinearGradient(0,0,128,64),random=terrainRandom(terrainSeed(biome,variant));
gradient.addColorStop(0,palette.base);gradient.addColorStop(1,palette.light);ctx.save();terrainDiamond(ctx);ctx.clip();ctx.fillStyle=gradient;ctx.fillRect(0,0,128,64);terrainDetail(ctx,biome,random);ctx.restore();return canvas}
function terrainTextures(biome){if(!TERRAIN[biome])biome='village';if(!TERRAIN_CACHE[biome])TERRAIN_CACHE[biome]=Array.from({length:TERRAIN_VARIANTS},(_,i)=>makeTerrainTile(biome,i));return TERRAIN_CACHE[biome]}
function obstaclePath(ctx,points,color){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fillStyle=color;ctx.fill()}
function makeObstacle(biome,variant){const canvas=document.createElement('canvas');canvas.width=OBSTACLE_SIZE;canvas.height=OBSTACLE_SIZE;const ctx=canvas.getContext('2d'),rand=terrainRandom(terrainSeed(biome,variant+11));
ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(48,84,32,7,0,0,Math.PI*2);ctx.fill();
if(biome=='village'&&variant==0){ctx.fillStyle='#95745a';ctx.fillRect(26,47,46,34);obstaclePath(ctx,[[18,49],[48,19],[80,49]],'#553b36');ctx.fillStyle='#f4c66d';ctx.fillRect(34,56,8,9);ctx.fillRect(55,56,8,9);ctx.fillStyle='#302b31';ctx.fillRect(45,62,9,19)}
else if(biome=='village'&&variant==1){ctx.strokeStyle='#51453b';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(48,85);ctx.lineTo(48,29);ctx.stroke();ctx.fillStyle='#b78439';ctx.fillRect(37,24,22,18);ctx.fillStyle='#ffe09a';ctx.fillRect(42,28,12,10);ctx.fillStyle='#68503a';ctx.fillRect(37,20,22,5)}
else if(biome=='village'){ctx.fillStyle='#8a6043';ctx.fillRect(30,48,36,32);ctx.fillStyle='#593e34';ctx.fillRect(28,44,40,7);ctx.fillRect(28,58,40,5);ctx.fillStyle='#b6865b';ctx.fillRect(35,53,26,5);ctx.fillRect(35,66,26,5)}
else if(biome=='foret'&&variant==1){ctx.fillStyle='#d7c29a';ctx.fillRect(44,50,10,32);ctx.beginPath();ctx.ellipse(49,45,25,15,0,Math.PI,Math.PI*2);ctx.fillStyle='#d18d68';ctx.fill();ctx.fillStyle='#e6c780';ctx.beginPath();ctx.ellipse(49,45,12,5,0,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#d7c29a';ctx.fillRect(20,65,7,17);ctx.beginPath();ctx.ellipse(23,61,13,8,0,Math.PI,Math.PI*2);ctx.fillStyle='#ab765b';ctx.fill()}
else if(biome=='foret'){ctx.strokeStyle='#72523d';ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(47,84);ctx.quadraticCurveTo(38,54,56,27);ctx.stroke();ctx.fillStyle=variant?'#486849':'#5b7651';ctx.beginPath();ctx.arc(46,32,20,0,Math.PI*2);ctx.arc(62,40,17,0,Math.PI*2);ctx.arc(34,43,14,0,Math.PI*2);ctx.fill()}
else if(biome=='collines'&&variant==1){ctx.fillStyle='#4e624d';ctx.fillRect(20,53,57,28);for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(25+i*9,52-rand()*5,10,0,Math.PI*2);ctx.fillStyle=i%2?'#607354':'#53694e';ctx.fill()}}
else if(biome=='collines'){obstaclePath(ctx,[[17,76],[24,53],[40,45],[50,28],[69,44],[79,70],[67,80]],'#696f71');obstaclePath(ctx,[[27,56],[41,48],[50,34],[60,48],[49,53]],'#71806a');ctx.strokeStyle='#879078';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(30,59);ctx.lineTo(40,52);ctx.lineTo(46,54);ctx.stroke()}
else if(biome=='manoir'&&variant==0){ctx.fillStyle='#77717b';ctx.fillRect(32,26,32,57);ctx.fillRect(26,23,44,8);ctx.fillRect(27,77,42,7);ctx.fillStyle='#4f4a53';ctx.fillRect(40,33,4,39);ctx.fillRect(55,33,4,39)}
else if(biome=='manoir'&&variant==1){ctx.fillStyle='#6d6870';ctx.fillRect(31,41,34,39);ctx.fillRect(25,35,45,9);ctx.fillRect(34,25,27,13);ctx.fillStyle='#423d47';ctx.fillRect(38,48,20,27);ctx.strokeStyle='#a49ba1';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(42,25);ctx.lineTo(38,18);ctx.lineTo(51,14);ctx.stroke()}
else if(biome=='manoir'){ctx.fillStyle='#594c52';ctx.fillRect(23,58,50,9);ctx.save();ctx.translate(48,58);ctx.rotate(-.18);ctx.fillStyle='#796f73';ctx.fillRect(-20,-25,40,8);ctx.fillRect(-16,-20,7,30);ctx.fillRect(10,-20,7,30);ctx.restore();ctx.fillStyle='#918b8d';ctx.fillRect(65,42,9,17)}
else if(biome=='marais'&&variant==1){ctx.strokeStyle='#56604c';ctx.lineWidth=6;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(26+i*10,82);ctx.quadraticCurveTo(22+i*11,57-rand()*12,31+i*10,25+rand()*15);ctx.stroke()}ctx.fillStyle='#7b8063';ctx.fillRect(22,78,52,8)}
else if(biome=='marais'&&variant==2){obstaclePath(ctx,[[15,75],[23,52],[37,47],[45,29],[58,36],[72,49],[81,74]],'#292f32');ctx.fillStyle='#48504a';ctx.fillRect(35,49,10,4)}
else if(biome=='marais'){ctx.fillStyle='#554d3b';ctx.fillRect(28,50,40,32);ctx.fillStyle='#74664a';ctx.fillRect(24,47,48,9);ctx.strokeStyle='#382f29';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(48,51);ctx.lineTo(44,75);ctx.moveTo(34,49);ctx.lineTo(40,54);ctx.stroke()}
else if(biome=='roseliere'&&variant==2){ctx.save();ctx.translate(48,59);ctx.rotate(-.16);ctx.fillStyle='#554638';ctx.fillRect(-35,-8,70,16);ctx.fillStyle='#8a7659';for(let i=-28;i<33;i+=12){ctx.fillRect(i,-6,3,12)}ctx.restore()}
else if(biome=='roseliere'){ctx.strokeStyle=variant?'#677d61':'#71845f';ctx.lineWidth=4;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(22+i*10,84);ctx.quadraticCurveTo(15+i*11,52,25+i*10,18+rand()*18);ctx.stroke();ctx.fillStyle='#879265';ctx.beginPath();ctx.ellipse(25+i*10,22+rand()*18,4,11,-.2,0,Math.PI*2);ctx.fill()}}
else if(biome=='serre'&&variant==1){ctx.strokeStyle='#626b59';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(22,78);ctx.lineTo(22,30);ctx.lineTo(74,30);ctx.lineTo(74,78);ctx.moveTo(22,67);ctx.lineTo(74,37);ctx.moveTo(22,42);ctx.lineTo(74,72);ctx.stroke();ctx.fillStyle='#607553';ctx.beginPath();ctx.arc(48,35,16,Math.PI,Math.PI*2);ctx.fill()}
else if(biome=='serre'){ctx.fillStyle='#a16e4c';ctx.fillRect(35,65,26,17);ctx.fillStyle='#714f3e';ctx.fillRect(32,61,32,6);ctx.fillStyle='#648052';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(34+i*7,51-rand()*8,10,0,Math.PI*2);ctx.fill()}}
else if(biome=='temple'&&variant==0){ctx.fillStyle='#8a7444';ctx.fillRect(34,24,28,56);ctx.fillStyle='#c9aa5e';ctx.fillRect(30,20,36,8);ctx.fillRect(30,76,36,8);ctx.fillStyle='#e8cf85';ctx.fillRect(40,28,4,48);ctx.fillRect(52,28,4,48);ctx.fillStyle='#ffe9a8';ctx.beginPath();ctx.arc(48,14,7,0,Math.PI*2);ctx.fill()}
else if(biome=='temple'&&variant==1){ctx.fillStyle='#5b4a30';ctx.fillRect(34,58,28,22);ctx.fillRect(28,52,40,8);ctx.fillStyle='#ffb347';ctx.beginPath();ctx.moveTo(48,18);ctx.quadraticCurveTo(66,40,56,52);ctx.lineTo(40,52);ctx.quadraticCurveTo(30,40,48,18);ctx.fill();ctx.fillStyle='#ffe08a';ctx.beginPath();ctx.moveTo(48,32);ctx.quadraticCurveTo(56,44,52,52);ctx.lineTo(44,52);ctx.quadraticCurveTo(40,44,48,32);ctx.fill()}
else if(biome=='temple'){obstaclePath(ctx,[[20,80],[28,56],[38,48],[48,30],[58,48],[68,56],[76,80]],'#9c8450');ctx.fillStyle='#e8cf85';ctx.beginPath();ctx.arc(48,38,9,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e8cf85';ctx.lineWidth=2;for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(48+Math.cos(a)*11,38+Math.sin(a)*11);ctx.lineTo(48+Math.cos(a)*17,38+Math.sin(a)*17);ctx.stroke()}}
else if(biome=='citadelle'&&variant==0){ctx.fillStyle='#5b5568';ctx.fillRect(30,34,36,48);ctx.fillStyle='#463f52';for(let i=0;i<3;i++)ctx.fillRect(30+i*14,26,10,10);ctx.fillStyle='#2a2631';ctx.fillRect(42,52,12,30);ctx.fillStyle='#7a7388';ctx.fillRect(34,38,4,40)}
else if(biome=='citadelle'&&variant==1){ctx.fillStyle='#6a6378';ctx.fillRect(20,56,56,26);ctx.save();ctx.translate(48,52);ctx.rotate(-.25);ctx.fillStyle='#544d62';ctx.fillRect(-22,-14,44,14);ctx.restore();ctx.fillStyle='#8a8298';ctx.fillRect(28,60,12,5);ctx.fillRect(52,68,14,5)}
else if(biome=='citadelle'){obstaclePath(ctx,[[18,80],[26,58],[40,50],[52,34],[66,52],[78,80]],'#4a4457');obstaclePath(ctx,[[34,60],[50,40],[62,60]],'#625b72');ctx.fillStyle='#b64d6a';ctx.fillRect(46,62,4,18)}
else if(biome=='trone'&&variant==0){ctx.fillStyle='#1d1b24';ctx.fillRect(34,20,28,62);ctx.fillStyle='#d9b45f';ctx.fillRect(30,16,36,6);ctx.fillRect(30,78,36,6);ctx.fillRect(46,28,4,46)}
else if(biome=='trone'&&variant==1){ctx.fillStyle='#2a2733';ctx.fillRect(32,56,32,24);ctx.fillRect(26,50,44,8);ctx.fillStyle='#8b5cf6';ctx.beginPath();ctx.moveTo(48,16);ctx.quadraticCurveTo(66,38,56,50);ctx.lineTo(40,50);ctx.quadraticCurveTo(30,38,48,16);ctx.fill();ctx.fillStyle='#d9c2ff';ctx.beginPath();ctx.moveTo(48,30);ctx.quadraticCurveTo(54,42,51,50);ctx.lineTo(45,50);ctx.quadraticCurveTo(42,42,48,30);ctx.fill()}
else if(biome=='trone'){ctx.fillStyle='#2a2733';ctx.fillRect(28,48,40,34);ctx.fillStyle='#d9b45f';ctx.fillRect(34,36,28,14);ctx.beginPath();ctx.moveTo(34,36);ctx.lineTo(38,24);ctx.lineTo(44,34);ctx.lineTo(48,22);ctx.lineTo(52,34);ctx.lineTo(58,24);ctx.lineTo(62,36);ctx.fill();ctx.fillStyle='#14121a';ctx.fillRect(34,52,28,24)}
else if(biome=='mer'&&variant==0){obstaclePath(ctx,[[14,80],[24,58],[40,50],[52,32],[66,50],[80,58],[86,80]],'#47525e');obstaclePath(ctx,[[30,62],[52,40],[64,62]],'#5e6c78');ctx.strokeStyle='#4f8a5a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(28,80);ctx.quadraticCurveTo(22,66,30,56);ctx.stroke()}
else if(biome=='mer'&&variant==1){ctx.fillStyle='#6a4a2c';ctx.fillRect(30,46,36,36);ctx.fillStyle='#8a6840';ctx.fillRect(30,46,36,8);ctx.fillStyle='#3a2a1c';ctx.fillRect(30,60,36,4);ctx.fillRect(30,74,36,4)}
else if(biome=='mer'){ctx.save();ctx.translate(48,60);ctx.rotate(-.22);ctx.fillStyle='#5a4230';ctx.fillRect(-34,-8,68,16);ctx.fillStyle='#7a5c3c';for(let i=0;i<4;i++)ctx.fillRect(-30+i*16,-8,3,16);ctx.restore();ctx.fillStyle='#4a3626';ctx.fillRect(44,30,6,34)}
else if(biome=='desert'&&variant==1){ctx.fillStyle='#41624b';ctx.fillRect(44,37,10,47);ctx.fillRect(31,48,15,7);ctx.fillRect(31,39,7,16);ctx.fillRect(53,59,15,7);ctx.fillRect(61,48,7,18);ctx.fillStyle='#78905c';ctx.fillRect(47,32,4,18)}
else if(biome=='desert'&&variant==2){obstaclePath(ctx,[[12,80],[26,57],[45,48],[57,21],[70,47],[85,80]],'#855340');obstaclePath(ctx,[[42,51],[57,24],[63,51]],'#a15c45')}
else{obstaclePath(ctx,[[13,79],[23,56],[36,49],[48,29],[61,39],[75,54],[84,79]],'#884c3b');obstaclePath(ctx,[[25,58],[48,37],[57,49]],'#a45d43')}
return canvas}
function obstacleTextures(biome){if(!TERRAIN[biome])biome='village';if(!OBSTACLE_CACHE[biome])OBSTACLE_CACHE[biome]=Array.from({length:OBSTACLE_VARIANTS},(_,i)=>makeObstacle(biome,i));return OBSTACLE_CACHE[biome]}
function drawTerrainObstacle(g,cx,cy,tw,th,biome,x,y){const sprite=obstacleTextures(biome)[terrainHash(x,y)%OBSTACLE_VARIANTS],size=tw*.72;g.drawImage(sprite,cx-size/2,cy+th*.22-size,size,size)}
function terrainDecorCells(size,biome,blocked,excluded,density){const amount=Math.max(0,Math.min(1,density??.16)),cacheKey=size+':'+biome+':'+amount,salt=terrainSeed(biome,37);let candidates=DECOR_CACHE[cacheKey];
if(!candidates){candidates=[];for(let y=0;y<size;y++)for(let x=0;x<size;x++){const hash=terrainHash(x+salt,y-salt);if(hash/4294967296>=amount)continue;const random=terrainRandom(hash);candidates.push({x,y,variant:hash%3,dx:(random()-.5)*.36,dy:(random()-.5)*.12})}DECOR_CACHE[cacheKey]=candidates}
return candidates.filter(cell=>{const key=cell.x+','+cell.y;return!blocked.has(key)&&!(excluded&&excluded.has(key))})}
function drawTerrainDecor(g,cx,cy,tw,th,biome,detail){const x=cx+detail.dx*tw,y=cy+th*.12+detail.dy*tw,size=tw*(.14+(detail.variant%2)*.025);g.save();g.globalAlpha=.32;
if(biome=='village'||biome=='collines'){g.strokeStyle=biome=='village'?'#a7a07a':'#aab2a3';g.lineWidth=Math.max(1,tw*.018);g.beginPath();g.moveTo(x-size*.5,y+size*.35);g.lineTo(x-size*.15,y-size*.35);g.lineTo(x,y+size*.2);g.lineTo(x+size*.3,y-size*.4);g.stroke()}
else if(biome=='foret'||biome=='serre'){g.fillStyle=biome=='foret'?'#84a66c':'#b1a879';g.beginPath();g.arc(x,y,size*.3,0,Math.PI*2);g.fill();g.fillStyle='#c5b98a';g.fillRect(x-size*.07,y,size*.14,size*.3)}
else if(biome=='marais'||biome=='roseliere'){g.strokeStyle=biome=='marais'?'#a5aa83':'#94b5a1';g.lineWidth=Math.max(1,tw*.015);g.beginPath();g.ellipse(x,y,size*.6,size*.18,-.1,0,Math.PI*2);g.stroke();if(detail.variant==0){g.beginPath();g.moveTo(x,y);g.lineTo(x+size*.1,y-size*.9);g.stroke()}}
else if(biome=='manoir'){g.fillStyle='#a49aa1';g.fillRect(x-size*.42,y-size*.08,size*.75,size*.15)}
else{g.fillStyle='#b69a6b';g.beginPath();g.ellipse(x,y,size*.42,size*.16,0,0,Math.PI*2);g.fill()}
g.restore()}
function drawGroundShadow(g,cx,cy,tw,th,scale=1){const shadow=g.createRadialGradient(cx,cy+th*.2,0,cx,cy+th*.2,tw*.29*scale);shadow.addColorStop(0,'rgba(0,0,0,.32)');shadow.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=shadow;g.beginPath();g.ellipse(cx,cy+th*.2,tw*.29*scale,th*.19*scale,0,0,Math.PI*2);g.fill()}
function tuile(g,cx,cy,tw,th,biome,x,y,l){
const points=()=>{g.beginPath();g.moveTo(cx,cy-th/2);g.lineTo(cx+tw/2,cy);g.lineTo(cx,cy+th/2);g.lineTo(cx-tw/2,cy);g.closePath()};
if(OPT.fx=='off'){
const shade=Math.max(0,Math.min(1,l));points();g.fillStyle='rgb('+[38+82*shade,32+52*shade,51-3*shade].map(Math.round)+')';g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.stroke();return}
const textures=terrainTextures(biome),texture=textures[terrainHash(x,y)%TERRAIN_VARIANTS],shade=Math.max(0,Math.min(1,l)),overlay=OPT.fx=='reduit'?.66:.5;
g.save();points();g.clip();g.drawImage(texture,cx-tw/2,cy-th/2,tw,th);g.fillStyle='rgba('+[38+82*shade,32+52*shade,51-3*shade].map(Math.round).join(',')+','+overlay+')';g.fillRect(cx-tw/2,cy-th/2,tw,th);g.restore();points();g.strokeStyle='rgba(0,0,0,.25)';g.stroke()
}
function ambienceFps(fx){return fx=='eleve'?30:fx=='reduit'?15:0}
function ambienceShouldRun(fx,pageHidden,gameHidden,reducedMotion){return ambienceFps(fx)>0&&!pageHidden&&!gameHidden&&!reducedMotion}
function ambienceFrameDue(last,time,fx){const fps=ambienceFps(fx);return fps>0&&(last===0||time-last>=1000/fps)}
function ambienceParticles(biome,count){const cacheKey=biome+':'+count;if(AMBIENCE_CACHE[cacheKey])return AMBIENCE_CACHE[cacheKey];const random=terrainRandom(terrainSeed(biome,count+71)),particles=[];
for(let i=0;i<count;i++)particles.push({x:random()*13,y:random()*13,phase:random()*Math.PI*2,speed:.04+random()*.12,size:.035+random()*.035,drift:(random()-.5)*.18});AMBIENCE_CACHE[cacheKey]=particles;return particles}
function mistSprite(){if(AMBIENCE_CACHE.mist)return AMBIENCE_CACHE.mist;const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(128,64,5,128,64,120);gradient.addColorStop(0,'rgba(180,195,182,.2)');gradient.addColorStop(.55,'rgba(145,165,157,.11)');gradient.addColorStop(1,'rgba(120,145,140,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,256,128);AMBIENCE_CACHE.mist=canvas;return canvas}
function drawAmbience(ctx,width,height,biome,gridSize,ox,oy,tw,th,time,fx,style){ctx.clearRect(0,0,width,height);if(!ambienceFps(fx)||!style)return 0;const particles=ambienceParticles(biome,fx=='eleve'?40:15),seconds=time/1000,type=style.type;let drawn=0;
if(type=='brume'){const fog=mistSprite();for(let i=0;i<2;i++){const x=width*(.28+i*.44)+Math.sin(seconds*.12+i*2)*width*.04,y=height*(.62+i*.09);ctx.globalAlpha=.12;ctx.drawImage(fog,x-tw*1.7,y-th*.65,tw*3.4,th*1.3);drawn++}}
for(const p of particles){const wx=((p.x+p.drift*seconds+gridSize)%gridSize),wy=((p.y+p.speed*seconds+gridSize)%gridSize),x=(wx-wy)*tw/2+ox,y=(wx+wy)*th/2+oy,phase=seconds*p.speed*5+p.phase;
if(x< -tw||x>width+tw||y< -th||y>height+th)continue;const alpha=(type=='lucioles'?.12+(.08*(.5+.5*Math.sin(phase))):type=='brume'?.045:type=='poussiere'?.1:type=='cendres'?.09:type=='sable'?.12:type=='eclats'?.17:.11);ctx.globalAlpha=alpha;
if(type=='sable'){ctx.strokeStyle='#dfc28c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+tw*.16,y-th*.025);ctx.stroke()}
else{const color=type=='lucioles'?'#ffd985':type=='spores'?'#a7d887':type=='poussiere'?'#d4b77d':type=='cendres'?'#c8c5b7':type=='eclats'?'#ffd978':'#d6c59a';ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,Math.max(.7,tw*p.size),0,Math.PI*2);ctx.fill()}
drawn++}ctx.globalAlpha=1;return drawn}
const DISPLAY_MOVES=new Map(),DISPLAY_TARGETS=new WeakMap(),DISPLAY_EFFECTS=[],DISPLAY_TEXTS=[],DISPLAY_WAITERS=[];
let displayRAF=0;
function displayNow(){return typeof performance!='undefined'?performance.now():Date.now()}
function displayDuration(ms){return OPT.fx=='reduit'?Math.max(60,Math.round(ms*.65)):ms}
function displayPath(from,to,blocked,anchor){const size=typeof DATA!='undefined'?DATA.taille:13,inb=(x,y)=>typeof DATA!='undefined'&&typeof DATA.in=='function'?!!DATA.in(x,y):(x>=0&&y>=0&&x<size&&y<size),sx=anchor?anchor.x:Math.round(from.x),sy=anchor?anchor.y:Math.round(from.y),tx=to.x,ty=to.y,key=(x,y)=>x+','+y,start=key(sx,sy),target=key(tx,ty),queue=[[sx,sy]],previous=new Map([[start,null]]);let found=start===target;
while(queue.length&&!found){const [x,y]=queue.shift();for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(!inb(nx,ny)||previous.has(k)||(blocked&&blocked.has(k)&&k!==target))continue;previous.set(k,key(x,y));if(k===target){found=true;break}queue.push([nx,ny])}}
let cells=[];if(found){let k=target;while(k){const [x,y]=k.split(',').map(Number);cells.unshift({x,y});k=previous.get(k)}}else{let x=sx,y=sy;while(x!==tx){x+=Math.sign(tx-x);cells.push({x,y})}while(y!==ty){y+=Math.sign(ty-y);cells.push({x,y})}}
const points=[{x:from.x,y:from.y}];if(sx!==from.x||sy!==from.y)points.push({x:sx,y:sy});for(const cell of cells)if(cell.x!==points.at(-1).x||cell.y!==points.at(-1).y)points.push(cell);return points}
function sampleDisplayMove(move,time){if(time>=move.end)return{x:move.to.x,y:move.to.y};let elapsed=time-move.start;
for(const segment of move.segments){if(elapsed<=segment.duration){const p=Math.max(0,elapsed/segment.duration),ease=p*p*(3-2*p);return{x:segment.from.x+(segment.to.x-segment.from.x)*ease,y:segment.from.y+(segment.to.y-segment.from.y)*ease}}elapsed-=segment.duration}return{x:move.to.x,y:move.to.y}}
function pruneDisplay(time=displayNow()){for(const [unit,move]of DISPLAY_MOVES)if(time>=move.end)DISPLAY_MOVES.delete(unit);
for(let i=DISPLAY_EFFECTS.length-1;i>=0;i--)if(time>=DISPLAY_EFFECTS[i].start+DISPLAY_EFFECTS[i].duration)DISPLAY_EFFECTS.splice(i,1);
for(let i=DISPLAY_TEXTS.length-1;i>=0;i--)if(time>=DISPLAY_TEXTS[i].start+DISPLAY_TEXTS[i].duration)DISPLAY_TEXTS.splice(i,1)}
function displayHasWork(){return DISPLAY_MOVES.size>0||DISPLAY_EFFECTS.length>0||DISPLAY_TEXTS.length>0}
function finishDisplayWaiters(){if(displayHasWork())return;for(const resolve of DISPLAY_WAITERS.splice(0))resolve()}
function displayFrame(time){displayRAF=0;pruneDisplay(time);if(typeof draw=='function')draw();pruneDisplay(time);if(displayHasWork())requestDisplayFrame();else finishDisplayWaiters()}
function requestDisplayFrame(){if(!displayRAF&&typeof requestAnimationFrame=='function')displayRAF=requestAnimationFrame(displayFrame)}
function animateUnitMove(unit,from,to,blocked,kind='move'){if(!unit)return false;const time=displayNow(),active=DISPLAY_MOVES.get(unit),start=active?sampleDisplayMove(active,time):{x:from.x,y:from.y};DISPLAY_TARGETS.set(unit,{x:to.x,y:to.y});
if(OPT.fx=='off'){DISPLAY_MOVES.delete(unit);pruneDisplay(time);finishDisplayWaiters();return false}
const points=displayPath(start,to,blocked,active&&time<active.end?active.to:null),stepMs=OPT.fx=='reduit'?70:120,segments=[];let duration=0;
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.abs(b.x-a.x)+Math.abs(b.y-a.y);if(!length)continue;const part=stepMs*length;segments.push({from:a,to:b,duration:part});duration+=part}
if(!segments.length)return false;DISPLAY_MOVES.set(unit,{from:start,to:{x:to.x,y:to.y},segments,start:time,end:time+duration,kind});requestDisplayFrame();return true}
function displayPosition(unit,x=unit.x,y=unit.y,blocked){const time=displayNow(),target=DISPLAY_TARGETS.get(unit);if(!target){DISPLAY_TARGETS.set(unit,{x,y});return{x,y}}
if(target.x!==x||target.y!==y){const move=DISPLAY_MOVES.get(unit),from=move?sampleDisplayMove(move,time):target;animateUnitMove(unit,from,{x,y},blocked)}
const move=DISPLAY_MOVES.get(unit);if(move&&time<move.end)return sampleDisplayMove(move,time);if(move)DISPLAY_MOVES.delete(unit);return{x,y}}
function displayUnitStyle(unit,time=displayNow(),tw=1,th=.5){const style={x:0,y:0,alpha:1,scale:1,flash:0};for(const effect of DISPLAY_EFFECTS){if(effect.unit!==unit)continue;const p=Math.max(0,Math.min(1,(time-effect.start)/effect.duration));
if(effect.kind=='hit'){style.x+=Math.sin(p*Math.PI*8)*(1-p)*tw*.1;style.flash=Math.max(style.flash,(1-p)*(.35+.35*Math.sin(p*Math.PI*10)))}
else if(effect.kind=='death'){style.alpha*=1-p;style.scale*=1-.14*p}
else if(effect.kind=='spawn'){style.alpha*=p;style.y-=th*.22*(1-p)}}return style}
function displayUnitActive(unit){return DISPLAY_MOVES.has(unit)||DISPLAY_EFFECTS.some(effect=>effect.unit===unit)}
function addDisplayEffect(kind,options={}){if(OPT.fx=='off')return false;const duration=displayDuration(options.duration||260);DISPLAY_EFFECTS.push({...options,kind,start:displayNow(),duration});requestDisplayFrame();return true}
function addDisplayText(unit,text,color){if(OPT.fx=='off'||!unit)return false;DISPLAY_TEXTS.push({x:unit.x,y:unit.y,text,color,start:displayNow(),duration:displayDuration(650)});requestDisplayFrame();return true}
function displayPending(){pruneDisplay();return displayHasWork()}
function waitForDisplay(){if(!displayPending())return Promise.resolve();return new Promise(resolve=>DISPLAY_WAITERS.push(resolve))}
function drawDisplayEffects(ctx,tw,th,ox,oy,time=displayNow()) {for(const effect of DISPLAY_EFFECTS){const p=Math.max(0,Math.min(1,(time-effect.start)/effect.duration)),alpha=1-p,point=effect.to||effect.at||effect.unit;
if(effect.kind=='transition')continue;
if(!point)continue;const x=(point.x-point.y)*tw/2+ox,y=(point.x+point.y)*th/2+oy;
if(effect.kind=='hit'){ctx.fillStyle='rgba(255,45,45,'+(alpha*.28)+')';ctx.beginPath();ctx.ellipse(x,y-th*.06,tw*.35,th*.25,0,0,Math.PI*2);ctx.fill()}
else if(effect.kind=='projectile'){const from=effect.from||point,fx=(from.x-from.y)*tw/2+ox,fy=(from.x+from.y)*th/2+oy,q=p;const px=fx+(x-fx)*q,py=fy+(y-fy)*q;if(OPT.fx=='eleve'){ctx.globalAlpha=alpha*.2;ctx.strokeStyle=effect.color||'#fff';ctx.lineWidth=Math.max(1,tw*.07);ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(px,py);ctx.stroke()}ctx.globalAlpha=alpha*.8;ctx.fillStyle=effect.color||'#fff';ctx.beginPath();ctx.arc(px,py,Math.max(2,tw*.1),0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
else if(effect.kind=='zone'||effect.kind=='wave'||effect.kind=='pulse'||effect.kind=='heal'){const radius=(effect.radius||1)*p,rx=Math.max(1,tw*.42*radius),ry=Math.max(1,th*.42*radius);ctx.globalAlpha=alpha*(effect.kind=='heal'?.6:.48);ctx.strokeStyle=effect.color||'#fff';ctx.lineWidth=Math.max(1,tw*.035);ctx.beginPath();if(effect.kind=='zone'){ctx.moveTo(x,y-ry);ctx.lineTo(x+rx,y);ctx.lineTo(x,y+ry);ctx.lineTo(x-rx,y);ctx.closePath()}else ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.stroke();
if(effect.kind=='heal'&&OPT.fx=='eleve'){ctx.fillStyle=effect.color||'#7fd18b';for(let i=0;i<5;i++){const angle=(i/5)*Math.PI*2+p*3;ctx.beginPath();ctx.arc(x+Math.cos(angle)*rx,y+Math.sin(angle)*ry,Math.max(1,tw*.035),0,Math.PI*2);ctx.fill()}}ctx.globalAlpha=1}}}
function drawDisplayTexts(ctx,tw,th,ox,oy,time=displayNow()){for(const item of DISPLAY_TEXTS){const p=Math.max(0,Math.min(1,(time-item.start)/item.duration)),x=(item.x-item.y)*tw/2+ox,y=(item.x+item.y)*th/2+oy-th*(.55+p*.65);ctx.globalAlpha=(1-p)*(1-p);ctx.font='bold '+Math.round(tw*.55)+'px Georgia,serif';ctx.lineWidth=4;ctx.strokeStyle='#120d1a';ctx.strokeText(item.text,x,y);ctx.fillStyle=item.color;ctx.fillText(item.text,x,y)}ctx.globalAlpha=1}
function updateDisplayTransition(time=displayNow()){const overlay=document.getElementById('screenFade');if(!overlay)return;let alpha=0;for(const effect of DISPLAY_EFFECTS)if(effect.kind=='transition'){const p=Math.max(0,Math.min(1,(time-effect.start)/effect.duration));alpha=Math.max(alpha,Math.sin(p*Math.PI)*.9)}overlay.style.opacity=String(alpha);overlay.classList.toggle('hide',alpha==0)}
function showZoneBanner(name){if(!name||typeof EX!='undefined'&&EX.sceneActive)return;const banner=document.getElementById('zoneBanner');if(!banner)return;clearTimeout(showZoneBanner.timer);banner.textContent=name;banner.classList.remove('hide');banner.classList.add('show');showZoneBanner.timer=setTimeout(()=>{banner.classList.remove('show');banner.classList.add('hide')},2000)}
function startScreenTransition(name){if(OPT.fx=='off')return;if(name)showZoneBanner(name);addDisplayEffect('transition',{duration:250})}