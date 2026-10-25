// MENU : écran à onglets (Jouer, Héros, Lanterne, Atelier, Quêtes). Aucun dessin de grille ici.
let tab='heros',resume=null,combatLive=false;
const TABS=[['heros','Héros','🛡️'],['equip','Inventaire','🎒'],['sorts','Sorts','✨'],['lanterne','Lanterne','🏮'],['atelier','Atelier','🔨'],['quetes','Quêtes','📜'],['carte','Carte','🗺️'],['options','Options','⚙️']];
const craftables=()=>Object.keys(DATA.objets).filter(id=>DATA.objets[id].cout&&!sv.inv.includes(id));
const canCraftAny=()=>craftables().some(id=>canPay(DATA.objets[id].cout));
const questReady=()=>Object.keys(DATA.quetes).some(id=>{const s=(sv.q||{})[id];return s&&s.s==1&&(s.n||0)>=DATA.quetes[id].need});
const heroMax=()=>DATA.classes[cfg.classe].hp+8*(sv.niv-1)+gear().t.pv;

function itemRow(id,extra){const o=DATA.objets[id];
return '<span class="em">'+o.e+'</span><span class="tx"><span class="nm" style="color:'+RC[o.r]+'">'+o.n+'</span><span class="mt">'+RAR[o.r]+' · '+fmtSt(o.st)+(o.set?' · '+DATA.sets[o.set].n:'')+'</span>'+(extra||'')+'</span>'}
function card(title,...kids){const c=el('div','card',title?'<h3>'+title+'</h3>':'');kids.forEach(k=>{if(k)c.appendChild(typeof k=='string'?el('p','',k):k)});return c}
function row(html,fn,cls){const r=el(fn?'button':'div','row '+(cls||''),html);if(fn)r.onclick=fn;return r}
function bonusLabel(s,rank){const b=s.rg[rank-2]||{},parts=[];if(b.dmg)parts.push((b.dmg>0?'+':'')+b.dmg+' dégâts');if(b.pa)parts.push((b.pa>0?'+':'')+b.pa+' PA');if(b.cd)parts.push((b.cd>0?'+':'')+b.cd+' recharge');if(b.rmax)parts.push('+'+b.rmax+' portée max');if(b.push)parts.push('+'+b.push+' poussée');if(b.garde)parts.push('+'+b.garde+' tour de garde');return parts.join(' · ')||'aucun bonus'}
function saveCode(){const bytes=new TextEncoder().encode(JSON.stringify(sv));let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return 'LAMPYRIA1:'+btoa(binary)}
function saveTextarea(value,readOnly){const t=el('textarea');t.value=value;t.readOnly=readOnly;t.setAttribute('aria-label',readOnly?'Code de sauvegarde':'Code de sauvegarde à importer');t.style.cssText='display:block;width:100%;height:9rem;max-height:45vh;resize:vertical;padding:10px;border:1px solid var(--line);border-radius:8px;background:#120d1a;color:var(--ink);font:12px/1.4 monospace';return t}
function exportSave(){const code=saveCode(),body=el('div','pick','<h2>Exporter ma sauvegarde</h2><p>Conserve ce code pour restaurer ta progression.</p>'),text=saveTextarea(code,true);
body.appendChild(text);body.appendChild(btn('Copier','','pri',async()=>{try{await navigator.clipboard.writeText(code);toast('Sauvegarde copiée')}catch(e){text.focus();text.select();toast('Copie impossible : code sélectionné')}}));modal(body,[['Fermer']])}
function importSave(){const text=saveTextarea('',false),body=el('div','pick','<h2>Importer une sauvegarde</h2><p>Colle ici le code de sauvegarde.</p>');body.appendChild(text);
modal(body,[['Annuler'],['Importer',()=>{let data;
try{const code=text.value.trim(),prefix='LAMPYRIA1:';if(!code.startsWith(prefix))throw Error();const raw=atob(code.slice(prefix.length)),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));data=JSON.parse(new TextDecoder().decode(bytes));if(!data||typeof data!='object'||Array.isArray(data)||typeof data.niv!='number'||!data.res||typeof data.res!='object'||Array.isArray(data.res)||!Array.isArray(data.inv))throw Error()}catch(e){toast('Code invalide');return}
const confirm=el('div','','<h2>Remplacer ta sauvegarde actuelle ?</h2><p>Cette action est définitive.</p>');modal(confirm,[['Annuler'],['Importer',()=>{try{localStorage.setItem(slotKey(SLOT),JSON.stringify(data))}catch(e){toast('Impossible d’enregistrer la sauvegarde');return}location.reload()},'danger']])
}]])}

// ---------- ouverture / fermeture ----------
function openMenu(t,a){if(EX.on)resume='ex';else if(combatLive&&!$('game').classList.contains('hide'))resume='combat';else if(!combatLive)resume=null;
EX.on=false;EX.tok++;EX.walking=false;if(t)tab=t=='jouer'?'quetes':t;normL();closeModal();hideBubble();stopAmbience();$('menu').classList.remove('hide');renderMenu();$('mbody').scrollTop=0;if(a){const h=[...$('mbody').querySelectorAll('h3')].find(x=>x.textContent.startsWith(a));if(h)h.scrollIntoView()}}
function hideMenu(){$('menu').classList.add('hide')}
function showGame(){hideMenu();$('game').classList.remove('hide');size();if(EX.on)EX.draw();else if(C)draw()}
function renderMenu(){const sc=$('mbody').scrollTop,need=XP.next(sv.niv);
const cur=TABS.find(x=>x[0]==tab)||TABS[0],closeP=()=>{if(resume=='combat'&&combatLive)showGame();else EX.start()};
$('mhead').innerHTML='<div class="top"><h1>'+cur[2]+' '+cur[1].replace('.','')+'</h1><span class="lv">'+(sv.hero&&sv.hero.nom?escHtml(sv.hero.nom)+' · ':'')+'Niveau <b>'+sv.niv+'</b> · '+(sv.niv>=XP.max?'niveau max':sv.xp+'/'+need+' XP')+'</span></div><div class="bar"><i style="width:'+Math.round(100*XP.part(sv))+'%"></i></div><div class="chips">'+(cfg.test?'<span class="chip no">Mode test</span>':'')+'</div>';
$('menu').onclick=e=>{if(e.target===$('menu'))closeP()};{const x=el('button','xbtn','✕');x.setAttribute('aria-label','Retour au jeu');x.onclick=closeP;$('mhead').querySelector('.top').appendChild(x)}
const T=$('tabs');T.innerHTML='';TABS.forEach(([id,n,ic])=>{const b=el('button',id==tab?'sel':'','<span class="ic">'+ic+'</span><span class="nm">'+n+'</span>');
if((id=='heros'&&talLeft()>0)||(id=='sorts'&&spLeft()>0)||(id=='atelier'&&canCraftAny())||(id=='quetes'&&questReady()))b.appendChild(el('span','dot'));b.onclick=()=>{tab=id;renderMenu();$('mbody').scrollTop=0};T.appendChild(b)});
const B=$('mbody');B.innerHTML='';({heros:tabHeros,equip:tabEquip,sorts:tabSorts,lanterne:tabLanterne,atelier:tabAtelier,quetes:tabQuetes,carte:tabCarte,options:tabOptions})[tab](B);B.scrollTop=sc;
$('mfoot').style.display='none'}

// ---------- onglet Jouer ----------
function jouerPart(B,part){const m=DATA.cartes[sv.map||'village'];
if(false){B.appendChild(card('Aventure','Tu es à : <b>'+m.n+'</b>. Explore, parle aux habitants, récolte et affronte les monstres pour progresser.',
questReady()?el('div','chips','<span class="chip ok">Une quête est prête à être rendue</span>'):null));}
if(part=='opt'){if(combatLive)B.appendChild(card('Combat en cours','Un combat est en pause. Tu peux le reprendre avec le bouton en bas, ou y renoncer.',btn('Abandonner le combat','','danger',leaveFight)));}
if(part=='train'){const t=card('Combat d\'entraînement','Rejoue un combat déjà débloqué pour gagner de l\'XP, des ressources et du butin.');
DATA.rencontres.forEach((e,i)=>{if(i>sv.renc)return;const d=(e.drops||[]).filter(x=>!sv.inv.includes(x.id)).length;
t.appendChild(row('<span class="em">⚔️</span><span class="tx"><span class="nm">'+e.n+'</span><span class="mt">'+XP.rencontre({niv:e.niv||1+i*3,m:XP.m[e.type||(e.m.some(z=>z.boss)?'boss':'normal')]||1},sv.niv,true)+' XP · '+(d?d+' objet(s) à obtenir':'tout obtenu')+'</span></span>',()=>startTraining(i),combatLive?'lock':''))});
B.appendChild(t);}
if(part=='opt'){const o=card('Options');
const fxNames={eleve:'élevé',reduit:'réduit',off:'désactivé'},fxDescriptions={eleve:'Textures détaillées avec de légères variations.',reduit:'Textures atténuées, avec des détails plus discrets.',off:'Cases en couleurs plates, rendu classique.'};
o.appendChild(row('<span class="em">🎨</span><span class="tx"><span class="nm">Effets visuels : '+fxNames[OPT.fx]+'</span><span class="mt">'+fxDescriptions[OPT.fx]+' Toucher pour changer.</span></span>',()=>{cycleFx();renderMenu()}));
const soundLabel=OPT.son===0?'coupé':OPT.son<=45?'bas':'normal';
o.appendChild(row('<span class="em">🔊</span><span class="tx"><span class="nm">Son : '+soundLabel+'</span><span class="mt">Effets sonores générés, sans musique. Toucher pour changer.</span></span>',()=>{cycleSon();renderMenu()}));
o.appendChild(row('<span class="em">💡</span><span class="tx"><span class="nm">Conseils des Lueurs : '+(tutoOn()?'activés':'désactivés')+'</span><span class="mt">Toucher pour changer.</span></span>',()=>{tutoToggle();renderMenu()}));
o.appendChild(row('<span class="em">🔁</span><span class="tx"><span class="nm">Revoir les conseils</span><span class="mt">Ils réapparaîtront au bon moment.</span></span>',()=>{tutoReset();toast('Conseils réinitialisés.');renderMenu()}));
o.appendChild(row('<span class="em">🧪</span><span class="tx"><span class="nm">Mode test : '+(cfg.test?'activé':'désactivé')+'</span><span class="mt">Toutes les Lueurs, capacité 12, aucun gain.</span></span>',()=>{cfg.test=!cfg.test;normL();renderMenu()}));
if(cfg.test)o.appendChild(row('<span class="em">🎭</span><span class="tx"><span class="nm">Voir les scènes</span><span class="mt">Lancer une scène en exploration, sans sauvegarder ses effets.</span></span>',()=>{const list=el('div','pick','<h2>Scènes</h2>');Object.entries(DATA.scenes).forEach(([id,scene])=>list.appendChild(row('<span class="tx"><span class="nm">'+id+'</span><span class="mt">'+scene.declencheur.quand+'</span></span>',()=>{if(combatLive){toast('Quitte le combat en cours avant de lancer une scène.');return}EX.start({storyId:id})})));modal(list,[['Fermer']])}));
o.appendChild(row('<span class="em">🏠</span><span class="tx"><span class="nm">Changer de personnage</span><span class="mt">Retour à l\'écran titre : créer, choisir ou supprimer un personnage.</span></span>',()=>{store();location.reload()}));
o.appendChild(row('<span class="em">📤</span><span class="tx"><span class="nm">Exporter ma sauvegarde</span><span class="mt">Créer un code de secours à conserver.</span></span>',exportSave));
o.appendChild(row('<span class="em">📥</span><span class="tx"><span class="nm">Importer une sauvegarde</span><span class="mt">Restaurer une progression depuis un code.</span></span>',importSave));
B.appendChild(o);o.appendChild(el('p','sp','Version '+VERSION))}}

// ---------- onglet Héros ----------
function heroPart(B,part){const cl=el('div','grid');
if(part=='heros'){for(const k in DATA.classes){if(!cfg.test&&cfg.classe!=k)continue;const c=DATA.classes[k];cl.appendChild(btn(c.e+' '+c.n,c.info,cfg.classe==k?'on':'',()=>{if(!cfg.test)return;cfg.classe=k;normL();saveCfg();renderMenu()}))}
B.appendChild(card('Classe',cl,cfg.test?'Mode test : tu peux changer de classe.':'Ta classe est définitive. Seul le mode test permet d\'en changer.'));}
if(part=='sorts'){const spellCard=card('Sorts','Emplacements : <b>'+(sv.sp.eq.length+cfg.lueurs.length)+'/6</b> · Points de sort : <b>'+spLeft()+'</b>'),current=DATA.classes[cfg.classe].sorts,first=current[0].id;
for(const base of current){const unlocked=cfg.test||base.niv<=sv.niv,rank=cfg.test?3:(sv.sp.rg[base.id]||1),s=applyRang(base,rank),equipped=sv.sp.eq.includes(base.id),entry=el('div','pick');
const name=s.n+(rank>1?' ★'+rank:'')+(base.id==first?' 🔒':'');
const status=!unlocked?'Niveau '+base.niv:base.id==first?'Toujours équipé':equipped?'Équipé · touche pour retirer':'Libre · touche pour équiper';
const E0=DATA.elements[base.elem||'neutre'],chips='<span class="chips"><span class="chip el">'+E0.e+' '+E0.n+'</span><span class="chip">'+s.pa+' PA</span><span class="chip">Recharge '+(s.cd||0)+'</span></span>';
const html='<span class="em">'+(unlocked?(equipped?'✨':'⚔️'):'🔒')+'</span><span class="tx"><span class="nm">'+name+'</span><span class="mt">'+(unlocked?descrBody(s):'Niveau '+base.niv)+'</span><span class="mt">'+status+'</span>'+chips+'</span>';
const toggle=()=>{if(base.id==first){toast('Le premier sort est toujours équipé');return}if(equipped)sv.sp.eq=sv.sp.eq.filter(id=>id!=base.id);else if(sv.sp.eq.length+cfg.lueurs.length>=6){toast('Barre de sorts pleine');return}else sv.sp.eq.push(base.id);syncSorts();store();renderMenu()};
entry.appendChild(row(html,unlocked?toggle:null,(unlocked?(equipped?'on':''):'lock')+' esp e-'+(base.elem||'neutre')));
if(unlocked){const upgrades=el('div','grid2');for(const next of [2,3]){const cost=next==2?1:2,can=rank==next-1&&spLeft()>=cost&&!cfg.test;upgrades.appendChild(btn('Rang '+next+' : '+cost+' point'+(cost>1?'s':''),bonusLabel(base,next),'ghost',()=>{if(!can)return;sv.sp.rg[base.id]=next;store();renderMenu()},!can))}entry.appendChild(upgrades)}
spellCard.appendChild(entry)}
const hasRanks=Object.values(sv.sp.rg).some(rank=>rank>1);
spellCard.appendChild(btn('Réinitialiser les sorts','Rend les points de rang dépensés.','ghost',()=>{sv.sp.rg={};store();renderMenu()},!hasRanks));B.appendChild(spellCard);}
if(part=='heros'){const G=gear().t,st=el('div','grid2');
st.innerHTML=[[heroMax(),'PV'],['+'+(sv.niv-1),'Dégâts de base'],[G.res+' %','Résistance'],[DATA.heros.pm+G.pm,'PM par tour']].concat(EL_IDS.map(k=>[G["r"+k]+" %",DATA.elements[k].e+" Résistance "+DATA.elements[k].n])).concat(EL_IDS.filter(k=>G[k]>0).map(k=>['+'+Math.round(G[k]*RE.pct*10)/10+' %',DATA.elements[k].e+' '+DATA.elements[k].n+' ('+G[k]+' pts)'])).map(([v,n])=>'<div class="stat"><b>'+v+'</b><span>'+n+'</span></div>').join('');
B.appendChild(card('Statistiques',st,combatLive?'Les changements d\'équipement s\'appliquent au prochain combat.':null));}
if(part=='heros'){const tl=card('Talents','Points disponibles : <b style="color:var(--ember)">'+talLeft()+'</b> (1 par niveau gagné).');
TAL.forEach(([k,n,d,v,max,ic])=>{const cur=sv.tal[k]||0,full=cur>=max;tl.appendChild(row('<span class="em">'+ic+'</span><span class="tx"><span class="nm">'+n+' '+cur+'/'+max+'</span><span class="mt">'+d+'</span></span><span class="chip '+(talLeft()>0&&!full?'ok':'')+'">'+(full?'max':'+1')+'</span>',()=>{if(full){toast('Déjà au maximum');return}if(talLeft()<1){toast('Aucun point disponible : monte de niveau');return}sv.tal[k]=cur+1;store();renderMenu()},talLeft()>0&&!full?'':'lock'))});
if(talSpent())tl.appendChild(btn('Réinitialiser les talents','Récupère tous tes points, gratuit.','ghost',()=>{sv.tal=Object.fromEntries(TAL.map(t=>[t[0],0]));store();renderMenu()}));
B.appendChild(tl);}
if(part=='equip')invPart(B);}
// ---------- inventaire : emplacements du héros + sac par catégories, glisser-déposer ----------
let invCat='equip',invSel=null,invFilt='tout';
const INV_FILT=[['tout','Tout',''],['arme','Armes','⚔️'],['tete','Têtes','🎩'],['corps','Corps','🧥'],['bottes','Bottes','👢'],['acc','Acc.','💍']];
const INV_CATS=[['equip','Équipements'],['conso','Consommables'],['res','Ressources'],['quete','Quête']],INV_AREA={acc1:'a',tete:'b',acc2:'c',arme:'d',corps:'e',bottes:'h'};
function questItems(){const Q=sv.q||{},o=[];for(const id in Q){const q=DATA.quetes[id],s=Q[id];if(!q||s.s!=1||(q.kind!='pick'&&q.kind!='hide'))continue;o.push({e:q.kind=='hide'?'🌿':'🎒',n:q.n,m:(q.kind=='hide'?'Cachettes trouvées ':'Objets ramassés ')+Math.min(s.n||0,q.need)+'/'+q.need})}return o}
function invDrag(node,id,from){const o=DATA.objets[id];let st=null,timer=null,D=null;
const clean=()=>{clearTimeout(timer);timer=null;if(D){D.ghost.remove();$('mbody').querySelectorAll('.islot').forEach(s=>s.classList.remove('ok','over'));$('mbody').querySelector('.invbag')?.classList.remove('drop')}D=null;st=null},
begin=e=>{try{node.setPointerCapture(st.pid)}catch(_){}const ghost=el('div','idrag',o.e);document.body.appendChild(ghost);D={ghost};node._dragged=true;
$('mbody').querySelectorAll('.islot').forEach(s=>s.classList.toggle('ok',slotType(s.dataset.slot)==o.slot));if(from)$('mbody').querySelector('.invbag')?.classList.add('drop');pos(e)},
pos=e=>{D.ghost.style.left=e.clientX+'px';D.ghost.style.top=e.clientY+'px';const t=document.elementFromPoint(e.clientX,e.clientY),s=t&&t.closest('.islot');$('mbody').querySelectorAll('.islot').forEach(x=>x.classList.toggle('over',x===s&&x.classList.contains('ok')))};
node.addEventListener('pointerdown',e=>{if(e.button>0)return;node._dragged=false;st={x:e.clientX,y:e.clientY,pid:e.pointerId,touch:e.pointerType!='mouse'};if(!st.touch){try{node.setPointerCapture(st.pid)}catch(_){}}if(st.touch)timer=setTimeout(()=>{if(st&&!D)begin({clientX:st.x,clientY:st.y})},220)});
node.addEventListener('pointermove',e=>{if(!st)return;const d=Math.hypot(e.clientX-st.x,e.clientY-st.y);if(!D){if(st.touch){if(d>10){clearTimeout(timer);st=null}}else if(d>5)begin(e);return}pos(e)});
node.addEventListener('touchmove',e=>{if(D&&e.cancelable)e.preventDefault()},{passive:false});
const end=e=>{if(!st&&!D)return;if(D){const t=document.elementFromPoint(e.clientX,e.clientY),s=t&&t.closest('.islot'),bag=t&&t.closest('.invbag');let ch=false;
if(s&&e.type=='pointerup'&&slotType(s.dataset.slot)==o.slot){equip(s.dataset.slot,id);invSel={id,slot:s.dataset.slot};ch=true}
else if(bag&&from&&e.type=='pointerup'){equip(from,null);invSel={id,slot:null};ch=true}
clean();if(ch)renderMenu();return}clean()};
node.addEventListener('pointerup',end);node.addEventListener('pointercancel',end);node.addEventListener('contextmenu',e=>{if(e.pointerType!='mouse')e.preventDefault()})}
function invPart(B){const sel=invSel&&invSel.id&&sv.inv.includes(invSel.id)?invSel:null,eqIds=Object.values(sv.eq),wrap=el('div','inv'),left=el('div','card'),right=el('div','card invbag');
left.appendChild(el('h3','','Équipement'));const sl=el('div','invslots');
SLOTS.forEach(([s,n,ic])=>{const id=sv.eq[s]&&sv.inv.includes(sv.eq[s])?sv.eq[s]:null,b=el('button','islot'+(id?' full':'')+(sel&&sel.slot==s?' sel':''),id?'<span class="ie">'+DATA.objets[id].e+'</span>':'<span class="ie ghostic">'+ic+'</span>');b.dataset.slot=s;b.style.gridArea=INV_AREA[s];b.title=n;b.setAttribute('aria-label',n);
if(id){b.style.setProperty('--rc',RC[DATA.objets[id].r]);invDrag(b,id,s)}
b.onclick=()=>{if(b._dragged){b._dragged=false;return}invSel=id?{id,slot:s}:{id:null,slot:s};renderMenu()};sl.appendChild(b)});left.appendChild(sl);
const tot=Object.fromEntries(Object.entries(gear().t).filter(([k,v])=>v));left.appendChild(el('p','mt','Total équipé : '+(Object.keys(tot).length?fmtSt(tot):'aucun bonus')));
const gc=gear().cnt;for(const k in DATA.sets){const S=DATA.sets[k],n=gc[k]||0;if(!n)continue;const l=Object.keys(S.bonus).map(p=>'<span style="color:'+(n>=+p?'var(--ok)':'var(--dim)')+'">'+p+' pièces : '+fmtSt(S.bonus[p])+'</span>').join('<br>');left.appendChild(el('div','set','<b>'+S.n+' ('+n+'/'+Math.max(...Object.keys(S.bonus).map(Number))+')</b><br>'+l))}
const cats=el('div','icats');INV_CATS.forEach(([k,n])=>cats.appendChild(btn(n,'',invCat==k?'on':'',()=>{invCat=k;renderMenu()})));right.appendChild(cats);
if(invCat=='equip'){const ft=el('div','icats ifilt');INV_FILT.forEach(([k,n,ic])=>{const b=btn((ic?ic+' ':'')+n,'',invFilt==k?'on':'',()=>{invFilt=k;renderMenu()});b.setAttribute('aria-label',n);ft.appendChild(b)});right.appendChild(ft);
const own=sv.inv.filter(i=>DATA.objets[i]&&!eqIds.includes(i)&&(invFilt=='tout'||DATA.objets[i].slot==invFilt)).sort((a,b)=>SLOTS.findIndex(s=>slotType(s[0])==DATA.objets[a].slot)-SLOTS.findIndex(s=>slotType(s[0])==DATA.objets[b].slot)||DATA.objets[b].r-DATA.objets[a].r),g=el('div','igrid');
own.forEach(id=>{const o=DATA.objets[id],b=el('button','icell'+(sel&&sel.id==id&&!sel.slot?' sel':''),o.e);b.style.setProperty('--rc',RC[o.r]);b.title=o.n;b.setAttribute('aria-label',o.n);invDrag(b,id,null);b.onclick=()=>{if(b._dragged){b._dragged=false;return}invSel={id,slot:null};renderMenu()};g.appendChild(b)});
right.appendChild(own.length?g:el('p','',invFilt=='tout'?'Rien dans le sac. L\'atelier et les combats fournissent des objets.':'Aucun objet de ce type dans le sac.'));
const d=el('div','idet');if(sel){d.innerHTML='<div class="row" style="pointer-events:none">'+itemRow(sel.id,sel.slot?'<span class="mt" style="color:var(--ok)">Équipé</span>':'')+'</div>';const o=DATA.objets[sel.id];
if(sel.slot)d.appendChild(btn('Retirer','','',()=>{equip(sel.slot,null);invSel={id:sel.id,slot:null};renderMenu()}));
else{const f=SLOTS.filter(s=>slotType(s[0])==o.slot).map(s=>s[0]),to=f.find(s=>!sv.eq[s])||f[0];d.appendChild(btn('Équiper','Ou glisse l\'objet sur un emplacement.','pri',()=>{equip(to,sel.id);invSel={id:sel.id,slot:to};renderMenu()}))}}
else d.appendChild(el('p','','Glisse un objet du sac sur un emplacement, ou touche-le pour le détail. Glisse un objet équipé dans le sac pour le retirer.'));right.appendChild(d)}
else if(invCat=='conso')right.appendChild(el('p','','Aucun consommable pour l\'instant.'));
else if(invCat=='res'){const ks=Object.keys(DATA.res).filter(k=>sv.res[k]>0);if(!ks.length)right.appendChild(el('p','','Aucune ressource. Elles se récoltent en explorant et en combattant.'));ks.forEach(k=>{const[e,...n]=DATA.res[k].split(' ');right.appendChild(row('<span class="em">'+e+'</span><span class="tx"><span class="nm">'+n.join(' ')+'</span></span><span class="chip">×'+sv.res[k]+'</span>'))})}
else{const q=questItems();if(!q.length)right.appendChild(el('p','','Aucun objet de quête pour l\'instant.'));q.forEach(x=>right.appendChild(row('<span class="em">'+x.e+'</span><span class="tx"><span class="nm">'+escHtml(x.n)+'</span><span class="mt">'+x.m+'</span></span>')))}
wrap.append(left,right);B.appendChild(wrap)}

// ---------- onglet Lanterne ----------
function whereLueur(k){const r=DATA.rencontres.find(e=>e.unlock===k);if(r)return 'Récompense : '+r.n;
const q=Object.keys(DATA.quetes).find(id=>DATA.quetes[id].rew&&DATA.quetes[id].rew.lueur===k);return q?'Quête : '+DATA.quetes[q].n:'Débloquée au fil de l\'aventure'}
function tabLanterne(B){const cap=capNow(),used=sum();
let seg='';const cells=[];cfg.lueurs.forEach(k=>{for(let i=0;i<DATA.lueurs[k].t;i++)cells.push('f')});for(let i=0;i<cap;i++)seg+='<i class="'+(cells[i]||'')+'"></i>';
const c=card('Lanterne','<div class="seg">'+seg+'</div><span class="sp"><b>'+used+'/'+cap+'</b> de capacité utilisée · <b>'+cfg.lueurs.length+'/4</b> Lueurs</span>');
const up=DATA.lampiste.find(u=>u.cap>sv.cap);
if(up&&!cfg.test){const ok=canPay(up.cout);c.appendChild(row('<span class="em">🔧</span><span class="tx"><span class="nm">Maître Lampiste : capacité '+up.cap+'</span><span class="mt">'+costChips(up.cout)+'</span></span>',()=>{if(!ok){toast('Ressources insuffisantes');return}pay(up.cout);sv.cap=up.cap;store();toast('Lanterne agrandie : capacité '+up.cap);renderMenu()},ok?'':'lock'))}
else if(!cfg.test)c.appendChild(el('p','','Capacité maximale atteinte.'));
B.appendChild(c);
const L=card('Lueurs','Chaque Lueur ajoute un sort. Les grandes Lueurs prennent plus de place dans la lanterne.');
const av=avail();
Object.keys(DATA.lueurs).forEach(k=>{const l=DATA.lueurs[k];
if(!av.includes(k)){L.appendChild(row('<span class="em">🔒</span><span class="tx"><span class="nm">'+l.n+'</span><span class="mt">'+whereLueur(k)+'</span></span>',null,'lock'));return}
const on=cfg.lueurs.includes(k),why=!on&&(used+l.t>cap?'Pas assez de place dans la lanterne':cfg.lueurs.length>=4?'4 Lueurs maximum':'');
const b=el('button','lu'+(on?' on':''),'<span class="em" style="font-size:22px">'+(on?'✨':'💡')+'</span><span class="tx"><span class="nm">'+l.n+'</span><span class="mt">'+l.sort.n+' : '+descrBody(l.sort)+'</span>'+(why?'<span class="mt" style="color:var(--bad)">'+why+'</span>':'')+'</span><span class="sz">taille '+l.t+'</span>');
if(why)b.classList.add('dim');
b.onclick=()=>{if(!on&&sv.sp.eq.length+cfg.lueurs.length>=6){toast('Barre de sorts pleine : retire un sort de classe');return}if(why){toast(why);return}cfg.lueurs=on?cfg.lueurs.filter(z=>z!=k):[...cfg.lueurs,k];normL();saveCfg();renderMenu()};L.appendChild(b)});
B.appendChild(L)}

// ---------- onglet Atelier ----------
function craft(id){const o=DATA.objets[id];if(sv.inv.includes(id)||!canPay(o.cout)){toast('Impossible');return}
pay(o.cout);sv.inv.push(id);const e=autoEquip(id);store();toast(o.n+' fabriqué'+(e?' et équipé':''));renderMenu()}
let atOnly=false;
function tabAtelier(B){const all=craftables(),list=atOnly?all.filter(id=>canPay(DATA.objets[id].cout)):all;
B.appendChild(row('<span class="em">🔎</span><span class="tx"><span class="nm">Afficher : '+(atOnly?'ce que je peux fabriquer maintenant':'tout')+'</span><span class="mt">Toucher pour changer.</span></span>',()=>{atOnly=!atOnly;renderMenu()}));
const c=card('Fabrication','Transforme tes ressources en équipement. Chaque objet se fabrique une seule fois. Les panoplies donnent un bonus à partir de 2 pièces portées.');
if(!all.length)c.appendChild(el('p','','Tout est fabriqué !'));else if(!list.length)c.appendChild(el('p','','Rien n’est fabricable pour l’instant : récolte des ressources.'));
const groups={};list.forEach(id=>{const k=DATA.objets[id].set||'_';(groups[k]=groups[k]||[]).push(id)});
const order=Object.keys(groups).sort((x,y)=>(x=='_')-(y=='_')||Object.keys(DATA.objets).indexOf(groups[x][0])-Object.keys(DATA.objets).indexOf(groups[y][0]));
order.forEach(k=>{let title='Équipement simple',sub='';if(k!='_'){const S=DATA.sets[k],tot=Object.keys(DATA.objets).filter(i=>DATA.objets[i].set==k),own=tot.filter(i=>sv.inv.includes(i)).length;title=S.n+' ('+own+'/'+tot.length+')';sub=Object.keys(S.bonus).map(n=>'('+n+') '+fmtSt(S.bonus[n])).join(' · ')}
c.appendChild(el('h3','',title));if(sub)c.appendChild(el('p','mt',sub));
groups[k].sort((x,y)=>canPay(DATA.objets[y].cout)-canPay(DATA.objets[x].cout)).forEach(id=>{const o=DATA.objets[id],ok=canPay(o.cout);c.appendChild(row(itemRow(id,'<span class="mt">'+costChips(o.cout)+'</span>'),()=>craft(id),ok?'':'lock'))})});
B.appendChild(c);
const d=card('À trouver en combat','Ces objets ne se fabriquent pas : ils tombent sur les monstres, une garantie évite la malchance trop longue. Les boss lâchent les meilleurs.');
DATA.rencontres.forEach((e,i)=>{if(i>sv.renc+1)return;const L=(e.drops||[]).filter(x=>DATA.objets[x.id]&&!DATA.objets[x.id].cout);if(!L.length)return;
const got=L.filter(x=>sv.inv.includes(x.id)).length;d.appendChild(el('h3','',e.n+' ('+got+'/'+L.length+')'));
L.forEach(x=>{const own=sv.inv.includes(x.id);d.appendChild(row(itemRow(x.id,'<span class="mt">'+(own?'<span style="color:var(--ok)">Obtenu</span>':'Chance : '+x.p+' %')+'</span>'),null,own?'':'lock'))})});
const sp=Object.keys(DATA.objets).filter(id=>!DATA.objets[id].cout&&!DATA.rencontres.some(e=>(e.drops||[]).some(x=>x.id==id)));
if(sp.length){d.appendChild(el('h3','','Récompenses spéciales'));sp.forEach(id=>{const own=sv.inv.includes(id);d.appendChild(row(itemRow(id,'<span class="mt">'+(own?'<span style="color:var(--ok)">Obtenu</span>':'Récompense de quête ou d’événement')+'</span>'),null,own?'':'lock'))})}
B.appendChild(d)}

// ---------- onglet Quêtes (journal) ----------
let showDone=false;
const qMapOf=(id,key)=>{for(const m of Object.values(DATA.cartes)){const l=(m[key]||[]);if(key=='npcs'?l.some(n=>(n.quests||[]).includes(id)):l.some(o=>o.quest==id))return m.n}return null};
const qGiver=(id)=>{const q=DATA.quetes[id];return q.donneur||'Maître Lampiste'};
const qGiverPlace=(id)=>qMapOf(id,'npcs')||'le village';
const qRew=r=>{if(!r)return '';const t=[];const xp=r.xpq?XP.quete(r.xpq[0],XP.k[r.xpq[1]]||XP.k.normale):r.xp;if(xp)t.push('✨ '+xp+' XP');if(r.res)t.push(rl(r.res));if(r.item&&DATA.objets[r.item])t.push(DATA.objets[r.item].e+' '+DATA.objets[r.item].n);if(r.lueur&&DATA.lueurs[r.lueur])t.push('🏮 Lueur '+DATA.lueurs[r.lueur].n);return t.join(' · ')};
function qGoals(id,s){const q=DATA.quetes[id],got=(s&&s.got)||[],n=s?Math.min(s.n||0,q.need):0,done=s&&s.s==2,L=[];
const chk=(ok,t)=>'<div class="qg'+(ok?' ok':'')+'">'+(ok?'✔':'☐')+' '+t+'</div>';
if(q.kind=='livre'){[].concat(q.to).forEach(x=>L.push(chk(done||got.includes(x),'Voir '+x)))}
else if(q.kind=='pick'){L.push(chk(done||n>=q.need,'Ramasser '+q.need+' objets'+(qMapOf(id,'picks')?' — '+qMapOf(id,'picks'):'')+' ('+(done?q.need:n)+'/'+q.need+')'))}
else if(q.kind=='hide'){L.push(chk(done||n>=q.need,'Trouver '+q.need+' cachettes 🌿'+(qMapOf(id,'hides')?' — '+qMapOf(id,'hides'):'')+' ('+(done?q.need:n)+'/'+q.need+')'))}
else if(q.kind=='win'){const r=DATA.rencontres[q.renc];L.push(chk(done||n>=q.need,'Repousser '+q.need+' groupes'+(r?' — '+r.n:'')+' ('+(done?q.need:n)+'/'+q.need+')'))}
else if(q.kind=='don'){}
if(q.cost)L.push(chk(done,'Apporter '+rl(q.cost)));
return L.join('')}
function questCard(id,st){const q=DATA.quetes[id],s=(sv.q||{})[id],n=s?Math.min(s.n||0,q.need):0;
const lab={rendre:'🟢 À rendre',cours:'🟡 En cours',dispo:'⚪ Disponible',fini:'✔ Terminée'}[st];
const c=card(lab,'<b style="color:var(--ink);font-size:15px">'+q.n+'</b>');
c.appendChild(el('p','',q.desc));
if(st!='dispo')c.appendChild(el('div','qgs',qGoals(id,s)));
if(s&&q.need&&st!='fini')c.appendChild(el('div','bar','<i style="width:'+Math.round(100*(q.need?n/q.need:1))+'%"></i>'));
const where=st=='dispo'?'Parle à '+qGiver(id)+' ('+qGiverPlace(id)+').':st=='rendre'?'Retourne voir '+qGiver(id)+' ('+qGiverPlace(id)+').':st=='cours'?'Donneur : '+qGiver(id)+' ('+qGiverPlace(id)+').':'';
if(where)c.appendChild(el('p','mt',where));
const rw=qRew(q.rew);if(rw)c.appendChild(el('p','mt',(st=='fini'?'Récompense reçue : ':'Récompense : ')+rw));
return c}
function questPart(B){const Q=sv.q||{},g={rendre:[],cours:[],dispo:[],fini:[]};
for(const id in DATA.quetes){const q=DATA.quetes[id],s=Q[id];
if(!s){if((q.req||0)<=sv.renc&&(!q.apres||((Q[q.apres]||{}).s==2)))g.dispo.push(id);continue}
if(s.s==2)g.fini.push(id);else if((s.n||0)>=q.need&&(q.need>0||!q.cost||Object.keys(q.cost).every(k=>(sv.res[k]||0)>=q.cost[k])))g.rendre.push(id);else g.cours.push(id)}
const tot=Object.keys(DATA.quetes).length;
B.appendChild(card('Journal','<b style="color:var(--ink)">'+g.fini.length+' quête'+(g.fini.length>1?'s':'')+' terminée'+(g.fini.length>1?'s':'')+'</b> · '+(g.rendre.length+g.cours.length)+' en cours · '+g.dispo.length+' disponible'+(g.dispo.length>1?'s':'')));
['rendre','cours','dispo'].forEach(k=>g[k].forEach(id=>B.appendChild(questCard(id,k))));
if(!g.rendre.length&&!g.cours.length&&!g.dispo.length)B.appendChild(card('Quêtes','Rien à faire pour l\'instant. Explore de nouvelles zones : de nouveaux habitants auront du travail pour toi.'));
if(g.fini.length){B.appendChild(row('<span class="em">📚</span><span class="tx"><span class="nm">Quêtes terminées ('+g.fini.length+')</span><span class="mt">'+(showDone?'Toucher pour masquer.':'Toucher pour afficher.')+'</span></span>',()=>{showDone=!showDone;renderMenu()}));
if(showDone)g.fini.forEach(id=>B.appendChild(questCard(id,'fini')))}}

function tabHeros(B){heroPart(B,'heros')}
function tabEquip(B){heroPart(B,'equip')}
function tabSorts(B){heroPart(B,'sorts')}
function tabQuetes(B){questPart(B);jouerPart(B,'train')}
function tabOptions(B){jouerPart(B,'opt')}
function tabCarte(B){const c=EX.carteNode();B.appendChild(c);c.center()}
(()=>{const s=document.createElement('style');s.textContent=`#tabs{order:5;display:grid;grid-template-columns:repeat(8,1fr);gap:4px;padding:6px 8px calc(6px + env(safe-area-inset-bottom));border-top:1px solid var(--line);border-bottom:0;background:var(--bg)}#tabs button{min-height:0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 0 4px;min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:12px}#tabs button .ic{font-size:20px;line-height:1}#tabs button .nm{font-size:9px;font-weight:600;color:inherit}#tabs button.sel{border-color:var(--ember);background:#ffb45422}#tabs button.sel .nm{color:var(--ember)}#tabs .dot{top:3px;right:5px}#mhead .top{align-items:center}#mhead .xbtn{background:transparent;border:1px solid var(--line);border-radius:10px;color:var(--ink);font-size:16px;padding:4px 12px;min-height:34px;flex:none}.dock{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;width:100%}.dock button{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 0 4px;min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:12px;color:inherit;font:600 9px system-ui,sans-serif}.dock .ic{font-size:20px;line-height:1}.dock .dot{position:absolute;top:3px;right:5px;width:8px;height:8px;border-radius:50%;background:var(--bad)}.bigem{font-size:34px;line-height:1}@media (orientation:landscape) and (min-width:520px){#game{display:block}#stage{position:absolute;left:0;right:176px;top:0;bottom:0}#panel{position:absolute;right:0;top:0;bottom:0;width:176px;height:auto;z-index:4;border:0;border-left:1px solid var(--line);padding:6px;display:flex;flex-direction:column;gap:6px;overflow-y:auto}#msgEl{position:fixed;left:calc((100% - 176px)/2);bottom:8px;transform:translateX(-50%);max-width:50%;background:#120d1acc;border:1px solid var(--line);border-radius:10px;padding:4px 12px;z-index:4;pointer-events:none}#tip{display:none}#foes{position:fixed;top:52px;right:184px;z-index:4;flex-direction:column;align-items:flex-end;max-width:210px}#bar{display:grid;grid-template-columns:1fr 1fr;gap:5px}#bar button{min-width:0;min-height:44px;padding:3px 4px}#bar button .nm{font-size:11px}#bar.talk{grid-template-columns:1fr;position:fixed;left:10px;bottom:8px;right:auto;width:min(360px,45%);z-index:5}#foot{flex-direction:column}#foot:has(.pri){margin-top:auto}#foot button{flex:none}.dock{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:5px}.dock button{width:auto;flex-direction:row;justify-content:flex-start;gap:4px;padding:6px 4px;min-height:44px;font-size:10.5px;overflow:hidden}.dock .ic{font-size:18px}#hud{right:auto;max-width:62%}#hud .chip:nth-child(n+3){display:none}}`;document.head.appendChild(s);$('mwin').insertBefore($('tabs'),$('mfoot'))})();
