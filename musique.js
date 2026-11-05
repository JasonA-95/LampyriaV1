// MUSIQUE : boucles Web Audio synthétiques par thème (biome, combat, boss, titre). Aucune ressource externe.
const MUS_T={
titre:{r:196,s:[0,2,3,7,9],bpm:62,w:'sine',d:.5,b:[0,-12,-7,-12]},
village:{r:262,s:[0,2,4,7,9],bpm:84,w:'triangle',d:.55,b:[0,-12,-5,-12]},
foret:{r:220,s:[0,2,4,7,9],bpm:72,w:'sine',d:.45,b:[0,-12,-8,-5]},
collines:{r:247,s:[0,2,4,7,9],bpm:88,w:'triangle',d:.5,b:[0,-7,-12,-5]},
marais:{r:175,s:[0,3,5,7,10],bpm:60,w:'sine',d:.4,b:[0,-12,-12,-9]},
roseliere:{r:233,s:[0,2,4,7,9],bpm:68,w:'triangle',d:.45,b:[0,-12,-7,-12]},
desert:{r:208,s:[0,1,4,5,7,8],bpm:76,w:'triangle',d:.45,b:[0,-12,0,-7]},
mer:{r:220,s:[0,2,4,7,9],bpm:64,w:'sine',d:.5,b:[0,-12,-5,-12]},
temple:{r:185,s:[0,2,3,7,8],bpm:58,w:'sine',d:.4,b:[0,-12,-12,-7]},
manoir:{r:165,s:[0,2,3,5,7,8],bpm:56,w:'triangle',d:.35,b:[0,-12,-9,-12]},
citadelle:{r:147,s:[0,2,3,5,7,8,10],bpm:70,w:'sawtooth',d:.3,b:[0,-12,-12,-5]},
serre:{r:277,s:[0,2,4,7,9],bpm:66,w:'sine',d:.5,b:[0,-12,-7,-12]},
trone:{r:131,s:[0,1,3,5,7,8],bpm:52,w:'sawtooth',d:.3,b:[0,-12,-12,-6]},
combat:{r:165,s:[0,2,3,5,7,8,10],bpm:128,w:'sawtooth',d:.22,b:[0,0,-5,-7],bass:1},
boss:{r:139,s:[0,1,3,5,7,8],bpm:140,w:'sawtooth',d:.25,b:[0,0,-4,-6],bass:1}};
const MUS={theme:null,pend:null,step:0,next:0,timer:null,bus:null,seed:1};
function musRnd(){MUS.seed=(Math.imul(MUS.seed,1664525)+1013904223)>>>0;return MUS.seed/4294967296}
function musNote(hz,t,dur,wave,lvl){const o=soundAudio.createOscillator(),g=soundAudio.createGain();o.type=wave;o.frequency.setValueAtTime(hz,t);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(lvl,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(MUS.bus);o.start(t);o.stop(t+dur+.02)}
function musVol(){return Math.max(0,Math.min(1,(OPT.son||0)/100))*.5}
function musTick(){if(!soundAudio)return;if(!OPT.son){if(MUS.bus)MUS.bus.gain.setTargetAtTime(0,soundAudio.currentTime,.05);return}if(!MUS.theme){if(MUS.pend)musStart(MUS.pend);return}const T=MUS_T[MUS.theme],beat=60/T.bpm/2;MUS.bus.gain.setTargetAtTime(musVol(),soundAudio.currentTime,.1);
while(MUS.next<soundAudio.currentTime+.4){const i=MUS.step,t=Math.max(MUS.next,soundAudio.currentTime),bar=Math.floor(i/8)%4,k=Math.pow(2,T.b[bar]/12);
if(i%4==0)musNote(T.r*k/2,t,beat*(T.bass?1.6:3.2),T.bass?'square':'sine',.5);
if(T.bass&&i%2==1)musNote(T.r*k/2,t,beat*.6,'square',.25);
if(musRnd()<T.d){const deg=T.s[Math.floor(musRnd()*T.s.length)],oct=musRnd()<.3?2:1;musNote(T.r*oct*Math.pow(2,deg/12),t,beat*(1.5+musRnd()*2),T.w,.35)}
MUS.step++;MUS.next+=beat}}
function musStart(name){if(!soundUnlocked||!soundAudio||!OPT.son||!MUS_T[name])return;if(!MUS.bus){MUS.bus=soundAudio.createGain();MUS.bus.gain.value=0;MUS.bus.connect(soundAudio.destination)}
MUS.theme=name;MUS.seed=name.length*7919+1;MUS.step=0;MUS.next=soundAudio.currentTime+.05;MUS.bus.gain.cancelScheduledValues(soundAudio.currentTime);MUS.bus.gain.setValueAtTime(0,soundAudio.currentTime);
if(!MUS.timer)MUS.timer=setInterval(musTick,150);musTick()}
function playMusic(name){MUS.pend=name;if(name==MUS.theme&&MUS.timer)return;try{musStart(name)}catch(e){}}
if(typeof window!='undefined'&&window.addEventListener){const go=()=>setTimeout(()=>{if(MUS.pend&&!MUS.theme)playMusic(MUS.pend)},0);window.addEventListener('pointerdown',go,{capture:true});window.addEventListener('keydown',go,{capture:true})}
