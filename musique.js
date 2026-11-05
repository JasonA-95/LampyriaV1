// MUSIQUE : boucles Web Audio synthétiques composées (progression d'accords, basse, arpège, mélodie répétée). Aucune ressource externe.
const MUS_S={maj:[0,2,4,5,7,9,11],min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],phr:[0,1,3,5,7,8,10],har:[0,2,3,5,7,8,11],lyd:[0,2,4,6,7,9,11],mix:[0,2,4,5,7,9,10]};
const MUS_P={a:[0,5,3,4],b:[0,5,2,6],c:[0,4,5,3],d:[0,3,5,4],e:[0,6,5,6]};
const MUS_R=[[1,0,0,1,1,0,1,0],[1,0,1,0,1,1,0,0],[1,0,0,0,1,0,1,1],[1,1,0,1,0,1,0,0],[1,0,1,1,1,0,1,1]];
// r: tonique (Hz), s: gamme, p: progression, bpm, w: timbre mélodie, m: rythme mélodie, k: densité arpège, bs: basse (0 tenue, 1 pulsée)
const MUS_T={
titre:{r:196,s:'dor',p:'a',bpm:64,w:'sine',m:0,k:1,bs:0},
village:{r:262,s:'maj',p:'a',bpm:92,w:'triangle',m:3,k:1,bs:0},
foret:{r:220,s:'dor',p:'c',bpm:76,w:'sine',m:1,k:1,bs:0},
collines:{r:247,s:'mix',p:'a',bpm:96,w:'triangle',m:3,k:1,bs:0},
marais:{r:175,s:'min',p:'e',bpm:62,w:'sine',m:2,k:0,bs:0},
roseliere:{r:233,s:'lyd',p:'c',bpm:72,w:'triangle',m:1,k:1,bs:0},
desert:{r:208,s:'har',p:'d',bpm:84,w:'triangle',m:2,k:1,bs:0},
mer:{r:220,s:'maj',p:'c',bpm:68,w:'sine',m:0,k:1,bs:0},
temple:{r:185,s:'phr',p:'b',bpm:60,w:'sine',m:2,k:0,bs:0},
manoir:{r:165,s:'har',p:'e',bpm:58,w:'triangle',m:0,k:0,bs:0},
citadelle:{r:147,s:'min',p:'b',bpm:78,w:'sawtooth',m:1,k:1,bs:0},
serre:{r:277,s:'lyd',p:'a',bpm:70,w:'sine',m:3,k:1,bs:0},
trone:{r:131,s:'phr',p:'d',bpm:54,w:'sawtooth',m:0,k:0,bs:0},
combat:{r:165,s:'min',p:'b',bpm:132,w:'sawtooth',m:4,k:1,bs:1},
boss:{r:139,s:'har',p:'d',bpm:144,w:'sawtooth',m:4,k:1,bs:1}};
// Instruments GM échantillonnés (WebAudioFont, chargés à la demande) : m mélodie, b basse, a arpège, p nappe. Repli sur le synthé si indisponibles.
const MUS_I={titre:{m:46,b:42,a:46,p:89},village:{m:73,b:32,a:46,p:48},foret:{m:73,b:42,a:46,p:89},collines:{m:73,b:32,a:24,p:48},marais:{m:71,b:42,a:46,p:89},roseliere:{m:46,b:42,a:46,p:52},desert:{m:68,b:42,a:46,p:89},mer:{m:46,b:42,a:48,p:52},temple:{m:52,b:42,a:46,p:89},manoir:{m:0,b:42,a:46,p:89},citadelle:{m:56,b:33,a:48,p:48},serre:{m:11,b:42,a:46,p:89},trone:{m:19,b:42,a:46,p:52},combat:{m:56,b:33,a:48,p:48},boss:{m:56,b:33,a:48,p:19}};
const MUS_CDN='https://surikov.github.io/webaudiofontdata/sound/',MUS_PLAYER='https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js',MUS_L={player:null,tried:false,req:{}};
function musScript(src,ok){if(typeof document=='undefined')return;const sc=document.createElement('script');sc.src=src;sc.async=true;sc.onload=ok;sc.onerror=()=>{};document.head.appendChild(sc)}
function musVar(n){const id=String(n*10).padStart(4,'0');return{id,v:'_tone_'+id+'_FluidR3_GM_sf2_file'}}
function musLoad(theme){if(typeof document=='undefined'||!soundAudio)return;const go=()=>{if(!MUS_L.player)try{MUS_L.player=new WebAudioFontPlayer}catch(e){return}
for(const n of Object.values(MUS_I[theme]||{})){const x=musVar(n);if(MUS_L.req[x.id])continue;MUS_L.req[x.id]=1;musScript(MUS_CDN+x.id+'_FluidR3_GM_sf2_file.js',()=>{try{MUS_L.player.loader.decodeAfterLoading(soundAudio,x.v)}catch(e){}})}};
if(typeof WebAudioFontPlayer!='undefined')go();else if(!MUS_L.tried){MUS_L.tried=true;musScript(MUS_PLAYER,()=>musLoad(MUS.theme))}}
function musPreset(n){const x=musVar(n),p=globalThis[x.v];return p&&p.zones&&p.zones.every(z=>z.buffer)?p:null}
function musPlay(voice,hz,t,dur,wave,lvl){try{if(MUS_L.player){const pr=musPreset((MUS_I[MUS.theme]||{})[voice]);if(pr){MUS_L.player.queueWaveTable(soundAudio,MUS.bus,pr,t,Math.round(69+12*Math.log2(hz/440)),dur,Math.min(1,lvl*2.2));return}}}catch(e){}musNote(hz,t,dur,wave,lvl)}
const MUS={theme:null,pend:null,step:0,next:0,timer:null,bus:null,seed:1,ev:[]};
function musRnd(){MUS.seed=(Math.imul(MUS.seed,1664525)+1013904223)>>>0;return MUS.seed/4294967296}
// Compose une boucle de 8 mesures (64 croches) : [croche, Hz, durée en croches, voix]
function musCompose(name){const T=MUS_T[name],sc=MUS_S[T.s],pr=MUS_P[T.p],ev=[];MUS.seed=name.length*7919+name.charCodeAt(0);
const hz=(i,o=0)=>T.r*Math.pow(2,(sc[((i%7)+7)%7]+12*Math.floor(i/7)+12*o)/12);
const tones=c=>[c,c+2,c+4],near=(c,p)=>{let b=null;for(const t of tones(c))for(const o of[-7,0,7]){const x=t+o;if(b==null||Math.abs(x-p)<Math.abs(b-p))b=x}return b};
const rh=MUS_R[T.m],bars=[];let pos=7;
for(let b=0;b<4;b++){const c=pr[b],hits=[];let dir=b%2?-1:1;for(let s=0;s<8;s++){if(!rh[s])continue;if(s%4==0)pos=near(c,pos);else{if(musRnd()<.25)dir=-dir;pos+=dir}pos=Math.max(4,Math.min(12,pos));if(b==3&&s==0)pos=near(pr[3],pos);hits.push([s,pos])}bars.push(hits)}
// mesure 8 = cadence sur la tonique ; mesures 5-7 = reprise de 1-3
const last=bars[3].map(h=>h.slice());last[last.length-1][1]=7;
const mel=[bars[0],bars[1],bars[2],bars[3],bars[0],bars[1],bars[2],last];
for(let m=0;m<8;m++){const c=pr[m%4],hits=mel[m];hits.forEach((h,j)=>{const nx=j+1<hits.length?hits[j+1][0]:8;ev.push([m*8+h[0],hz(h[1]),nx-h[0],'m'])});
ev.push([m*8,hz(c,-1),T.bs?2:8,'b']);ev.push([m*8+4,hz(c,-1),T.bs?2:4,'b']);if(T.bs){for(const s of[2,6])ev.push([m*8+s,hz(c,-1),1,'b'])}
if(T.k){const t=tones(c);for(let s=0;s<8;s+=T.bs?1:2)ev.push([m*8+s,hz(t[(s/(T.bs?1:2))%3|0],0),2,'a'])}
else ev.push([m*8,hz(c+2,0),8,'p'])}
return ev}
function musNote(hz,t,dur,wave,lvl){const o=soundAudio.createOscillator(),g=soundAudio.createGain();o.type=wave;o.frequency.setValueAtTime(hz,t);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(lvl,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(MUS.bus);o.start(t);o.stop(t+dur+.02)}
function musVol(){return Math.max(0,Math.min(1,(OPT.son||0)/100))*.5}
function musTick(){if(!soundAudio)return;if(!OPT.son){if(MUS.bus)MUS.bus.gain.setTargetAtTime(0,soundAudio.currentTime,.05);return}if(!MUS.theme){if(MUS.pend)musStart(MUS.pend);return}
const T=MUS_T[MUS.theme],beat=60/T.bpm/2;MUS.bus.gain.setTargetAtTime(musVol(),soundAudio.currentTime,.1);
while(MUS.next<soundAudio.currentTime+.4){const t=Math.max(MUS.next,soundAudio.currentTime),i=MUS.step%64;
for(const e of MUS.ev)if(e[0]==i){const d=e[2]*beat;switch(e[3]){case'm':musPlay('m',e[1],t,d*1.05,T.w,.42);break;case'b':musPlay('b',e[1],t,d*.95,T.bs?'square':'triangle',T.bs?.26:.5);break;case'a':musPlay('a',e[1],t,d*.9,'triangle',.18);break;case'p':musPlay('p',e[1],t,d,'sine',.16);break}}
MUS.step++;MUS.next+=beat}}
function musStart(name){if(!soundUnlocked||!soundAudio||!OPT.son||!MUS_T[name])return;if(!MUS.bus){MUS.bus=soundAudio.createGain();MUS.bus.gain.value=0;MUS.bus.connect(soundAudio.destination)}
MUS.theme=name;MUS.ev=musCompose(name);musLoad(name);MUS.step=0;MUS.next=soundAudio.currentTime+.05;MUS.bus.gain.cancelScheduledValues(soundAudio.currentTime);MUS.bus.gain.setValueAtTime(0,soundAudio.currentTime);
if(!MUS.timer)MUS.timer=setInterval(musTick,150);musTick()}
function playMusic(name){MUS.pend=name;if(name==MUS.theme&&MUS.timer)return;try{musStart(name)}catch(e){}}
if(typeof window!='undefined'&&window.addEventListener){const go=()=>setTimeout(()=>{if(MUS.pend&&!MUS.theme)playMusic(MUS.pend)},0);window.addEventListener('pointerdown',go,{capture:true});window.addEventListener('keydown',go,{capture:true})}
