// TUTORIEL : conseils contextuels des Lueurs, affichés une seule fois au bon moment (sauvegardés par emplacement).
const TUTO=[
{id:'bouger',spk:'Gourmande',ok:()=>EX.on&&EX.map,txt:'Touche une case pour voir le trajet, puis touche-la encore pour y aller. Les monstres, les habitants et les sorties sont aussi des cases.'},
{id:'parler',spk:'Gourmande',ok:()=>EX.on&&EX.steps>=3,txt:'Les habitants ont toujours quelque chose à raconter, et souvent un service à demander. Approche-toi et touche-les.'},
{id:'combat',spk:'Colérique',ok:()=>combatLive&&!EX.on&&!$('game').classList.contains('hide'),txt:'Chaque tour : 6 PA pour les sorts, 3 PM pour bouger. Touche un sort pour voir sa portée, touche la cible pour confirmer. Quand tu n\'as plus rien à faire, termine ton tour.'},
{id:'quete',spk:'Peureuse',ok:()=>EX.on&&Object.keys(sv.q||{}).length>0,txt:'Le menu garde tes quêtes dans l\'onglet 📜. Tu y verras quoi faire, pour qui, et où aller.'},
{id:'niveau',spk:'Têtue',ok:()=>EX.on&&sv.niv>=2,txt:'Tu as gagné un niveau ! Passe par l\'onglet Héros : points de talent, nouveaux sorts, rangs d\'amélioration.'},
{id:'lanterne',spk:'Rêveuse',ok:()=>EX.on&&sv.deb.length>1,txt:'Une nouvelle Lueur nous a rejoints… Dans l\'onglet Lanterne, tu choisis lesquelles emporter. Seulement hors combat, et la place est comptée.'},
{id:'atelier',spk:'Farceuse',ok:()=>EX.on&&typeof canCraftAny=='function'&&canCraftAny(),txt:'Hé hé, tu as de quoi fabriquer quelque chose ! File à l\'onglet Atelier, c\'est gratuit de regarder.'}
];
const tutoOn=()=>{try{return localStorage.getItem('lampyria_tuto')!=='0'}catch(e){return true}};
function tutoToggle(){try{localStorage.setItem('lampyria_tuto',tutoOn()?'0':'1')}catch(e){}if(!tutoOn())tutoHide()}
function tutoReset(){sv.tuto={vus:[]};store();try{localStorage.setItem('lampyria_tuto','1')}catch(e){}}
function tutoHide(){const t=$('tuto');if(t)t.classList.add('hide')}
function tutoShow(t){let d=$('tuto');if(!d){d=el('div','hide');d.id='tuto';document.body.appendChild(d)}
const col=(typeof SPK!='undefined'&&SPK[t.spk])||'#c17b26';d.className='';d.style.borderLeftColor=col;
d.innerHTML='<b style="color:'+col+'">💡 '+t.spk+'</b><p>'+t.txt+'</p>';
const b=el('div','tb');b.appendChild(btn('Compris','','pri',()=>{tutoHide()}));
b.appendChild(btn('Plus de conseils','','ghost',()=>{tutoToggle();tutoHide();toast('Conseils désactivés (réactivables dans le menu).')}));d.appendChild(b)}
function tutoTick(){try{if(!tutoOn()||typeof sv=='undefined'||!$('titre').classList.contains('hide')||!$('menu').classList.contains('hide')||!$('modal').classList.contains('hide')||(typeof STORY_RUN!='undefined'&&STORY_RUN))return;
if(!sv.tuto||!Array.isArray(sv.tuto.vus)){sv.tuto={vus:sv.hist&&sv.hist.flags&&sv.hist.flags.nouvellePartie?[]:TUTO.map(t=>t.id)};store()}
const d=$('tuto');if(d&&!d.classList.contains('hide'))return;
const t=TUTO.find(t=>!sv.tuto.vus.includes(t.id)&&t.ok());if(!t)return;
sv.tuto.vus.push(t.id);store();tutoShow(t)}catch(e){}}
(function(){const s=document.createElement('style');s.textContent='#tuto{position:fixed;z-index:30;left:10px;right:10px;top:64px;max-width:460px;margin:0 auto;background:#fff7e6;color:#3a2a14;border-radius:12px;border-left:6px solid #c17b26;padding:10px 12px;box-shadow:0 6px 24px #0008;font-size:14px}#tuto.hide{display:none}#tuto p{margin:4px 0 8px;line-height:1.35}#tuto .tb{display:flex;gap:8px}#tuto .tb button{flex:1;padding:8px;font-size:13px}';document.head.appendChild(s);setInterval(tutoTick,700)})();
