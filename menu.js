// MENU : écran à onglets (Jouer, Héros, Lanterne, Atelier, Quêtes). Aucun dessin de grille ici.
let tab='heros',resume=null,combatLive=false;
const TABS=[['heros','Héros','🛡️'],['equip','Équip.','🎒'],['sorts','Sorts','✨'],['lanterne','Lanterne','🏮'],['atelier','Atelier','🔨'],['quetes','Quêtes','📜'],['carte','Carte','🗺️'],['options','Options','⚙️']];
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
EX.on=false;EX.tok++;EX.walking=false;if(t)tab=t=='jouer'?'quetes':t;normL();closeModal();hideBubble();$('game').classList.add('hide');stopAmbience();$('menu').classList.remove('hide');renderMenu();$('mbody').scrollTop=0;if(a){const h=[...$('mbody').querySelectorAll('h3')].find(x=>x.textContent.startsWith(a));if(h)h.scrollIntoView()}}
function hideMenu(){$('menu').classList.add('hide')}
function showGame(){hideMenu();$('game').classList.remove('hide');size();if(EX.on)EX.draw();else if(C)draw()}
function renderMenu(){const sc=$('mbody').scrollTop,need=XP.next(sv.niv);
const cur=TABS.find(x=>x[0]==tab)||TABS[0],closeP=()=>{if(resume=='combat'&&combatLive)showGame();else EX.start()};
$('mhead').innerHTML='<div class="top"><h1>'+cur[2]+' '+cur[1].replace('.','')+'</h1><span class="lv">'+(sv.hero&&sv.hero.nom?escHtml(sv.hero.nom)+' · ':'')+'Niveau <b>'+sv.niv+'</b> · '+(sv.niv>=XP.max?'niveau max':sv.xp+'/'+need+' XP')+'</span></div><div class="bar"><i style="width:'+Math.round(100*XP.part(sv))+'%"></i></div><div class="chips">'+Object.keys(DATA.res).map(k=>'<span class="chip">'+rn(k)+' '+sv.res[k]+'</span>').join('')+(cfg.test?'<span class="chip no">Mode test</span>':'')+'</div>';
{const x=el('button','xbtn','✕');x.setAttribute('aria-label','Retour au jeu');x.onclick=closeP;$('mhead').querySelector('.top').appendChild(x)}
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
const chips='<span class="chips"><span class="chip">'+s.pa+' PA</span><span class="chip">Recharge '+(s.cd||0)+'</span></span>';
const html='<span class="em">'+(unlocked?(equipped?'✨':'⚔️'):'🔒')+'</span><span class="tx"><span class="nm">'+name+'</span><span class="mt">'+(unlocked?descrBody(s):'Niveau '+base.niv)+'</span><span class="mt">'+status+'</span>'+chips+'</span>';
const toggle=()=>{if(base.id==first){toast('Le premier sort est toujours équipé');return}if(equipped)sv.sp.eq=sv.sp.eq.filter(id=>id!=base.id);else if(sv.sp.eq.length+cfg.lueurs.length>=6){toast('Barre de sorts pleine');return}else sv.sp.eq.push(base.id);syncSorts();store();renderMenu()};
entry.appendChild(row(html,unlocked?toggle:null,unlocked?(equipped?'on':''):'lock'));
if(unlocked){const upgrades=el('div','grid2');for(const next of [2,3]){const cost=next==2?1:2,can=rank==next-1&&spLeft()>=cost&&!cfg.test;upgrades.appendChild(btn('Rang '+next+' : '+cost+' point'+(cost>1?'s':''),bonusLabel(base,next),'ghost',()=>{if(!can)return;sv.sp.rg[base.id]=next;store();renderMenu()},!can))}entry.appendChild(upgrades)}
spellCard.appendChild(entry)}
const hasRanks=Object.values(sv.sp.rg).some(rank=>rank>1);
spellCard.appendChild(btn('Réinitialiser les sorts','Rend les points de rang dépensés.','ghost',()=>{sv.sp.rg={};store();renderMenu()},!hasRanks));B.appendChild(spellCard);}
if(part!='sorts'){const G=gear().t,st=el('div','grid2');
st.innerHTML=[[heroMax(),'PV'],['+'+(sv.niv-1+G.dmg),'Dégâts bonus'],[G.res+' %','Résistance'],[DATA.heros.pm+G.pm,'PM par tour']].map(([v,n])=>'<div class="stat"><b>'+v+'</b><span>'+n+'</span></div>').join('');
B.appendChild(card('Statistiques',st,combatLive?'Les changements d\'équipement s\'appliquent au prochain combat.':null));}
if(part=='heros'){const tl=card('Talents','Points disponibles : <b style="color:var(--ember)">'+talLeft()+'</b> (1 par niveau gagné).');
TAL.forEach(([k,n,d,v,max,ic])=>{const cur=sv.tal[k]||0,full=cur>=max;tl.appendChild(row('<span class="em">'+ic+'</span><span class="tx"><span class="nm">'+n+' '+cur+'/'+max+'</span><span class="mt">'+d+'</span></span><span class="chip '+(talLeft()>0&&!full?'ok':'')+'">'+(full?'max':'+1')+'</span>',()=>{if(full){toast('Déjà au maximum');return}if(talLeft()<1){toast('Aucun point disponible : monte de niveau');return}sv.tal[k]=cur+1;store();renderMenu()},talLeft()>0&&!full?'':'lock'))});
if(talSpent())tl.appendChild(btn('Réinitialiser les talents','Récupère tous tes points, gratuit.','ghost',()=>{sv.tal={pv:0,dmg:0,res:0};store();renderMenu()}));
B.appendChild(tl);}
if(part=='equip'){const eq=card('Équipement');
SLOTS.forEach(([s,n,ic])=>{const id=sv.eq[s]&&sv.inv.includes(sv.eq[s])?sv.eq[s]:null,have=sv.inv.filter(i=>DATA.objets[i].slot==slotType(s)).length;
eq.appendChild(id?row(itemRow(id)+'<span class="mt">'+n+'</span>',()=>pickGear(s)):row('<span class="em">'+ic+'</span><span class="tx"><span class="nm">'+n+'</span><span class="mt">'+(have?'Vide : touche pour équiper ('+have+' disponible'+(have>1?'s':'')+')':'Vide : fabrique ou trouve un objet')+'</span></span>',()=>pickGear(s),'empty'))});
const gc=gear().cnt;for(const k in DATA.sets){const S=DATA.sets[k],n=gc[k]||0,l=Object.keys(S.bonus).map(p=>'<span style="color:'+(n>=+p?'var(--ok)':'var(--dim)')+'">'+p+' pièces : '+fmtSt(S.bonus[p])+'</span>').join('<br>');
eq.appendChild(el('div','set','<b>'+S.n+' ('+n+'/'+Math.max(...Object.keys(S.bonus).map(Number))+')</b><br>'+l))}
B.appendChild(eq)}}
function pickGear(slot,back){const t=slotType(slot),own=sv.inv.filter(i=>DATA.objets[i].slot==t),n=el('div','pick','<h2>'+SLOTS.find(s=>s[0]==slot)[1]+'</h2>');
if(!own.length)n.appendChild(el('p','','Aucun objet de ce type pour l\'instant. L\'atelier et les combats en fournissent.'));
own.forEach(id=>{const cur=sv.eq[slot]==id,r=row(itemRow(id,cur?'<span class="mt" style="color:var(--ok)">Équipé ici</span>':(Object.keys(sv.eq).find(s=>sv.eq[s]==id)?'<span class="mt">Équipé ailleurs : sera déplacé</span>':'')),()=>{equip(slot,id);closeModal();renderMenu();if(back)back()});n.appendChild(r)});
if(sv.eq[slot])n.appendChild(row('<span class="em">✖️</span><span class="tx"><span class="nm">Retirer</span></span>',()=>{equip(slot,null);closeModal();renderMenu();if(back)back()}));
modal(n,[['Fermer']])}

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
if(q.cost)L.push(chk(done,'Apporter '+rl(q.cost)+(done?'':' (tu as : '+Object.keys(q.cost).map(k=>(sv.res[k]||0)+' '+rn(k)).join(', ')+')')));
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
(()=>{const s=document.createElement('style');s.textContent=`#tabs{order:5;display:grid;grid-template-columns:repeat(8,1fr);gap:4px;padding:6px 8px calc(6px + env(safe-area-inset-bottom));border-top:1px solid var(--line);border-bottom:0;background:var(--bg)}#tabs button{min-height:0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 0 4px;min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:12px}#tabs button .ic{font-size:20px;line-height:1}#tabs button .nm{font-size:9px;font-weight:600;color:inherit}#tabs button.sel{border-color:var(--ember);background:#ffb45422}#tabs button.sel .nm{color:var(--ember)}#tabs .dot{top:3px;right:5px}#mhead .top{align-items:center}#mhead .xbtn{background:transparent;border:1px solid var(--line);border-radius:10px;color:var(--ink);font-size:16px;padding:4px 12px;min-height:34px;flex:none}.dock{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;width:100%}.dock button{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 0 4px;min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:12px;color:inherit;font:600 9px system-ui,sans-serif}.dock .ic{font-size:20px;line-height:1}.dock .dot{position:absolute;top:3px;right:5px;width:8px;height:8px;border-radius:50%;background:var(--bad)}.bigem{font-size:34px;line-height:1}@media (orientation:landscape) and (min-width:520px){#game{display:block}#stage{position:absolute;left:0;right:0;top:0;bottom:64px}#panel{position:absolute;left:0;right:0;bottom:0;height:64px;width:auto;z-index:4;border:0;border-top:1px solid var(--line);padding:5px 10px;flex-direction:row;align-items:center;justify-content:space-between;gap:10px;overflow:visible}#msgEl{position:fixed;left:50%;bottom:72px;transform:translateX(-50%);max-width:60%;background:#120d1acc;border:1px solid var(--line);border-radius:10px;padding:4px 12px;z-index:4;pointer-events:none}#tip{display:none}#foes{position:fixed;top:52px;right:8px;z-index:4;flex-direction:column;align-items:flex-end;max-width:240px}#bar{display:flex;flex:1;gap:6px;overflow-x:auto}#bar button{min-width:96px;flex:none;min-height:46px}#bar.talk{flex-direction:column;position:fixed;left:10px;bottom:72px;right:auto;width:min(360px,50%);overflow:visible}#foot{flex:none}.dock{width:auto;display:flex}.dock button{width:52px}#hud{right:auto;max-width:62%}#hud .chip:nth-child(n+3){display:none}}`;document.head.appendChild(s);$('menu').insertBefore($('tabs'),$('mfoot'))})();
