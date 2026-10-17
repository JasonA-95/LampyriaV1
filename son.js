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
default:return false}return true}catch(e){return false}}
if(typeof window!='undefined'&&window.addEventListener){window.addEventListener('pointerdown',unlockSound,{once:true,capture:true});window.addEventListener('keydown',unlockSound,{once:true,capture:true})}