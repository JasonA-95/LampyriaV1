// TITRE : écran d'accueil, 3 emplacements de sauvegarde et création du héros.
// Le changement d'emplacement recharge la page (sv est lu une seule fois au chargement) ; 'lampyria_auto' relance ensuite l'action voulue.
const HERO_ASP=['🧑','👩','🧔','👧','🧓','🦊'],SLOT_COUNT=3;
function slotRead(n){try{const raw=localStorage.getItem(slotKey(n));if(!raw)return null;const d=JSON.parse(raw);return d&&typeof d=='object'&&!Array.isArray(d)?d:null}catch(e){return null}}
function slotInfo(n){const d=slotRead(n);if(!d)return null;const cl=DATA.classes[d.classe]||DATA.classes.porte,m=DATA.cartes[d.map]||DATA.cartes.village;
return{nom:(d.hero&&d.hero.nom)||'Livreur',classe:cl,asp:(d.hero&&d.hero.asp)||cl.e,niv:Math.max(1,Math.floor(d.niv)||1),carte:m.n,maj:+d.maj||0}}
function goSlot(n,action){try{localStorage.setItem('lampyria_slot',String(n));if(action)sessionStorage.setItem('lampyria_auto',action)}catch(e){}location.reload()}
function hideTitle(){$('titre').classList.add('hide')}
function startPlay(){hideTitle();EX.start()}
function playSlot(n){if(n==SLOT)startPlay();else goSlot(n,'play')}
function dateCourte(t){if(!t)return'';try{return new Date(t).toLocaleDateString('fr-BE',{day:'numeric',month:'short'})}catch(e){return''}}
function showTitle(){let auto=null;try{auto=sessionStorage.getItem('lampyria_auto');sessionStorage.removeItem('lampyria_auto')}catch(e){}
if(auto=='play'){startPlay();return}
$('menu').classList.add('hide');$('game').classList.add('hide');renderTitle()}
function titleSparks(T){if(OPT.fx=='off')return;const box=el('div','sparks');box.setAttribute('aria-hidden','true');
for(let i=0;i<(OPT.fx=='eleve'?16:7);i++){const s=el('i');s.style.cssText='left:'+(5+Math.random()*90).toFixed(1)+'%;top:'+(10+Math.random()*80).toFixed(1)+'%;animation-delay:'+(-Math.random()*8).toFixed(1)+'s;animation-duration:'+(5+Math.random()*6).toFixed(1)+'s';box.appendChild(s)}T.appendChild(box)}
function renderTitle(){const T=$('titre');T.className='';T.replaceChildren();titleSparks(T);
const main=el('div','tmain'),infos=[1,2,3].map(slotInfo),any=infos.some(Boolean);
main.appendChild(el('div','tlamp','🏮'));main.appendChild(el('h1','','Lampyria'));main.appendChild(el('p','tsub','Les Sept Lueurs'));
const list=el('div','tslots');
infos.forEach((info,i)=>{const n=i+1,b=el('button','slot'+(info?'':' vide'));
b.innerHTML=info?'<span class="em">'+escHtml(info.asp)+'</span><span class="tx"><span class="nm">'+escHtml(info.nom)+'</span><span class="mt">'+escHtml(info.classe.n)+' · Niveau '+info.niv+' · '+escHtml(info.carte)+(info.maj?' · '+dateCourte(info.maj):'')+'</span></span><span class="chip">'+n+'</span>':'<span class="em">＋</span><span class="tx"><span class="nm">Emplacement '+n+'</span><span class="mt">Vide : touche pour créer un héros</span></span>';
b.onclick=()=>{if(typeof playSound=='function')playSound('click');info?slotMenu(n,info):renderCreate(n)};list.appendChild(b)});
main.appendChild(list);
const act=el('div','tact');
if(any){const best=[1,2,3].filter(n=>infos[n-1]).sort((a,b)=>(infos[b-1].maj-infos[a-1].maj)||(a==SLOT?-1:b==SLOT?1:0))[0];act.appendChild(btn('Continuer',escHtml(infos[best-1].nom)+' · emplacement '+best,'pri',()=>playSlot(best)))}
act.appendChild(btn('Nouvelle partie','','',()=>{const free=[1,2,3].find(n=>!infos[n-1]);if(free)renderCreate(free);else toast('Les 3 emplacements sont pris : efface-en un.')}));
act.appendChild(btn('Options','','ghost',titleOptions));main.appendChild(act);main.appendChild(el('p','tver','Version '+VERSION));T.appendChild(main)}
function slotMenu(n,info){const b=el('div','pick','<h2>Emplacement '+n+'</h2><p><b>'+escHtml(info.nom)+'</b> · '+escHtml(info.classe.n)+' · Niveau '+info.niv+'<br>'+escHtml(info.carte)+'</p>');
modal(b,[['Annuler'],['Effacer',()=>eraseSlot(n),'danger'],['Jouer',()=>playSlot(n),'pri']])}
function eraseSlot(n){modal(el('div','','<h2>Effacer l\'emplacement '+n+' ?</h2><p>Cette progression sera perdue. Cette action est définitive.</p>'),[['Annuler'],['Effacer',()=>{try{localStorage.removeItem(slotKey(n))}catch(e){}goSlot(SLOT,null)},'danger']])}
function titleOptions(){const fxNames={eleve:'élevé',reduit:'réduit',off:'désactivé'},soundLabel=OPT.son===0?'coupé':OPT.son<=45?'bas':'normal',b=el('div','pick','<h2>Options</h2>');
b.appendChild(row('<span class="em">🎨</span><span class="tx"><span class="nm">Effets visuels : '+fxNames[OPT.fx]+'</span><span class="mt">Toucher pour changer.</span></span>',()=>{cycleFx();closeModal();renderTitle();titleOptions()}));
b.appendChild(row('<span class="em">🔊</span><span class="tx"><span class="nm">Son : '+soundLabel+'</span><span class="mt">Toucher pour changer.</span></span>',()=>{cycleSon();closeModal();titleOptions()}));
modal(b,[['Fermer']])}
// ---------- création du héros ----------
function renderCreate(n,st){st=st||{nom:'',classe:'porte',asp:null};const T=$('titre');T.replaceChildren();titleSparks(T);
const main=el('div','tmain tcreate');main.appendChild(el('h2','','Nouveau héros'));main.appendChild(el('p','tsub','Emplacement '+n));
const inp=el('input');inp.type='text';inp.maxLength=16;inp.placeholder='Nom du héros (ex. Livreur)';inp.value=st.nom;inp.setAttribute('aria-label','Nom du héros');inp.autocomplete='off';inp.oninput=()=>{st.nom=inp.value};
const cn=el('div','card');cn.appendChild(el('h3','','Nom'));cn.appendChild(inp);main.appendChild(cn);
const cc=el('div','card');cc.appendChild(el('h3','','Classe'));const grid=el('div','grid');
for(const k in DATA.classes){const c=DATA.classes[k];grid.appendChild(btn(c.e+' '+c.n,c.info,st.classe==k?'on':'',()=>{st.classe=k;renderCreate(n,st)}))}cc.appendChild(grid);main.appendChild(cc);
const ca=el('div','card');ca.appendChild(el('h3','','Apparence'));const asp=el('div','aspects');
[null,...HERO_ASP].forEach(a=>{const e=a||DATA.classes[st.classe].e,b=el('button','asp'+(st.asp===a?' on':''),escHtml(e));b.setAttribute('aria-label','Apparence '+e);b.onclick=()=>{if(typeof playSound=='function')playSound('click');st.asp=a;renderCreate(n,st)};asp.appendChild(b)});ca.appendChild(asp);main.appendChild(ca);
const foot=el('div','tact');foot.appendChild(btn('Retour','','ghost',renderTitle));
foot.appendChild(btn('Commencer l\'aventure','','pri',()=>createHero(n,st)));main.appendChild(foot);T.appendChild(main)}
function createHero(n,st){const nom=(st.nom||'').trim().slice(0,16)||'Livreur',data={classe:st.classe,lueurs:['gourmande'],hero:{nom,asp:st.asp||null},hist:{vus:[],flags:{nouvellePartie:true}},maj:Date.now()};
try{localStorage.setItem(slotKey(n),JSON.stringify(data))}catch(e){toast('Impossible d\'enregistrer la sauvegarde');return}goSlot(n,'play')}
