// SON : bruitages Web Audio synthétiques, sans ressource externe.
let soundAudio=null,soundUnlocked=false,soundNoiseSeed=0x4c414d50;
function unlockSound(){soundUnlocked=true;try{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return false;if(!soundAudio)soundAudio=new Audio();if(soundAudio.state=='suspended')soundAudio.resume().catch(()=>{});return true}catch(e){soundAudio=null;return false}}
function soundTone(startHz,endHz,duration,wave='sine',delay=0,level=.7){const time=soundAudio.currentTime+delay,osc=soundAudio.createOscillator(),gain=soundAudio.createGain(),peak=Math.max(.0001,Math.min(.09,(OPT.son/100)*.09)*level);
osc.type=wave;osc.frequency.setValueAtTime(startHz,time);osc.frequency.linearRampToValueAtTime(endHz,time+duration);gain.gain.setValueAtTime(peak,time);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
osc.connect(gain);gain.connect(soundAudio.destination);osc.start(time);osc.stop(time+duration+.01)}
function soundNoise(duration,level=.6){const length=Math.max(1,Math.floor(soundAudio.sampleRate*duration)),buffer=soundAudio.createBuffer(1,length,soundAudio.sampleRate),data=buffer.getChannelData(0);let state=soundNoiseSeed;
for(let i=0;i<length;i++){state=(Math.imul(state,1664525)+1013904223)>>>0;data[i]=((state>>>8)/8388608)-1}soundNoiseSeed=state;
const source=soundAudio.createBufferSource(),filter=soundAudio.createBiquadFilter(),gain=soundAudio.createGain(),time=soundAudio.currentTime;source.buffer=buffer;filter.type='lowpass';filter.frequency.setValueAtTime(1800,time);gain.gain.setValueAtTime(Math.max(.0001,Math.min(.09,(OPT.son/100)*.09)*level),time);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);source.connect(filter);filter.connect(gain);gain.connect(soundAudio.destination);source.start(time);source.stop(time+duration+.01)}
function playSound(type){if(!soundUnlocked||!soundAudio||!OPT.son)return false;try{switch(type){
case'click':soundTone(720,520,.045,'sine',0,.3);break;
case'step':soundNoise(.035,.23);break;
case'shot':soundTone(960,340,.14,'sawtooth',0,.48);break;
case'magic':soundTone(420,1080,.2,'triangle',0,.45);soundTone(740,1220,.13,'sine',.035,.22);break;
case'melee':soundNoise(.085,.52);soundTone(170,75,.11,'triangle',0,.3);break;
case'heal':soundTone(520,1040,.22,'sine',0,.38);soundTone(780,1320,.18,'triangle',.06,.25);break;
case'zone':soundTone(280,150,.22,'triangle',0,.4);soundNoise(.09,.18);break;
case'hit':soundNoise(.075,.48);soundTone(210,90,.1,'square',0,.2);break;
case'death':soundTone(330,85,.28,'sine',0,.35);soundNoise(.11,.2);break;
case'harvest':soundTone(620,1160,.18,'triangle',0,.4);break;
case'level':soundTone(520,660,.16,'sine',0,.4);soundTone(660,880,.18,'sine',.13,.4);soundTone(880,1180,.24,'sine',.29,.45);break;
case'victory':soundTone(440,660,.18,'triangle',0,.4);soundTone(550,825,.22,'triangle',.14,.38);soundTone(660,990,.3,'sine',.3,.4);break;
case'defeat':soundTone(360,180,.22,'triangle',0,.4);soundTone(240,90,.3,'sine',.17,.35);break;
case'state':soundTone(560,780,.12,'sine',0,.25);break;
case'stun':soundTone(260,160,.18,'triangle',0,.28);break;
case'dialogue':soundTone(600,550,.055,'sine',0,.12);break;
case'succes':soundTone(660,880,.14,'triangle',0,.4);soundTone(880,1100,.14,'triangle',.12,.4);soundTone(1100,1320,.3,'sine',.24,.45);soundTone(1320,1320,.35,'sine',.24,.18);break;
case'quete':soundTone(440,520,.1,'sine',0,.35);soundTone(660,780,.16,'sine',.1,.35);break;
case'quete_fin':soundTone(520,660,.12,'triangle',0,.38);soundTone(660,880,.12,'triangle',.11,.38);soundTone(880,1040,.24,'sine',.22,.42);break;
case'invoque':soundTone(110,220,.3,'sawtooth',0,.3);soundTone(330,165,.25,'sine',.08,.3);soundNoise(.18,.18);break;
case'boss':soundTone(110,82,.5,'sawtooth',0,.5);soundTone(165,82,.55,'square',.05,.3);soundNoise(.25,.3);break;
case'coffre':soundTone(520,780,.1,'triangle',0,.4);soundTone(780,1170,.12,'triangle',.09,.4);soundTone(1040,1560,.25,'sine',.19,.42);break;
case'foudre':soundNoise(.06,.5);soundTone(1400,200,.13,'sawtooth',0,.3);break;
case'lumiere':soundTone(880,1320,.2,'sine',0,.3);soundTone(1320,1760,.16,'sine',.05,.2);break;
case'tenebres':soundTone(220,70,.3,'sawtooth',0,.3);soundTone(150,60,.28,'sine',.04,.3);break;
case'vent':soundNoise(.22,.3);soundTone(300,700,.2,'sine',0,.12);break;
default:return false}return true}catch(e){return false}}
if(typeof window!='undefined'&&window.addEventListener){window.addEventListener('pointerdown',unlockSound,{once:true,capture:true});window.addEventListener('keydown',unlockSound,{once:true,capture:true})}