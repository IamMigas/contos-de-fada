/* Contos de Fada 2.0 — personal workspace, no remote backend. */
(() => {
'use strict';
const VERSION='2.0.0', KEY='contos-de-fada-workspace-v2', DATA='contos-de-fada-data-v1';
const $=id=>document.getElementById(id), safeParse=(s,f)=>{try{return JSON.parse(s)||f}catch{return f}};
let state=Object.assign({favorites:[],sets:[],gathered:{},store:{},lastCategory:'armas'},safeParse(localStorage.getItem(KEY),{}));
let lastRaw={}, filter='all', undo=null, ready=false;
const make=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
const button=(text,fn)=>{const b=make('button',text,'pro-button');b.type='button';b.onclick=fn;return b};
const notice=make('div','','pro-notice');notice.id='proNotice';notice.setAttribute('role','status');document.body.append(notice);
function say(text){notice.textContent=text;notice.hidden=false;clearTimeout(say.timer);say.timer=setTimeout(()=>notice.hidden=true,6000)}
function save(){if(!ready)return;STORE[currentCat]={s:selectedWeapons,o:ownedComponents};state.store=STORE;state.lastCategory=currentCat;try{localStorage.setItem(KEY,JSON.stringify(state));$('saveState').textContent='Guardado neste navegador'}catch{$('saveState').textContent='Não foi possível guardar';say('Armazenamento cheio ou indisponível. Exporta uma cópia de segurança.')}}
function snapshot(){save();return {workspace:JSON.parse(JSON.stringify(state)),data:safeParse(localStorage.getItem(DATA),{markers:{},recipes:{}})}}
function checkpoint(){undo=snapshot();$('undoAction').disabled=false}
const tools=make('section',undefined,'pro-tools');tools.setAttribute('aria-label','Progresso e cópias de segurança');
const version=make('strong','OFICINA · v'+VERSION);version.id='appVersion';tools.append(version);
const saved=make('span','Guardado neste navegador');saved.id='saveState';tools.append(saved);
const favId=name=>currentCat+'|'+name;
const controls=make('div',undefined,'pro-actions');tools.append(controls);
controls.append(button('Guardar conjunto',()=>{const name=prompt('Nome do conjunto de crafts:');if(!name?.trim())return;if(!Object.keys(selectedWeapons).length){say('Seleciona pelo menos uma receita.');return}state.sets.push({name:name.trim().slice(0,60),cat:currentCat,selection:{...selectedWeapons}});save();renderSets();say('Conjunto guardado.')}));
const sets=document.createElement('select');sets.id='savedSets';sets.setAttribute('aria-label','Carregar conjunto guardado');controls.append(sets);
sets.onchange=()=>{if(sets.value==='')return;const s=state.sets[Number(sets.value)];if(!s)return;checkpoint();setCategory(s.cat);selectedWeapons={...s.selection};updateAll();sets.value='';say('Conjunto carregado. Podes desfazer.');};
controls.append(button('Apagar conjunto',()=>{const names=state.sets.map((s,i)=>(i+1)+'. '+s.name).join('\n');if(!names){say('Ainda não há conjuntos guardados.');return}const i=Number(prompt('Número do conjunto a apagar:\n'+names))-1;if(!Number.isInteger(i)||!state.sets[i])return;if(confirm('Apagar «'+state.sets[i].name+'»?')){checkpoint();state.sets.splice(i,1);save();renderSets();}}));
function renderSets(){sets.replaceChildren(new Option('Carregar conjunto…',''));state.sets.forEach((s,i)=>sets.add(new Option(s.name+' · '+CATS[s.cat]?.sub,i)))}
controls.append(button('Exportar dados',()=>{const blob=new Blob([JSON.stringify({app:'contos-de-fada',schema:2,version:VERSION,exportedAt:new Date().toISOString(),...snapshot()},null,2)],{type:'application/json'});const a=make('a');a.href=URL.createObjectURL(blob);a.download='contos-de-fada-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);say('Cópia de segurança exportada.')}));
const file=make('input');file.type='file';file.accept='.json,application/json';file.hidden=true;controls.append(file,button('Importar dados',()=>file.click()));
const isObj=x=>x&&typeof x==='object'&&!Array.isArray(x);
function validateBackup(x){
 if(x?.app!=='contos-de-fada'||x.schema!==2||!isObj(x.workspace)||!isObj(x.data))throw Error('O ficheiro não é uma cópia de segurança compatível.');
 const bad=new Set(['__proto__','prototype','constructor']);
 function walk(v){if(isObj(v)||Array.isArray(v))for(const [k,a] of Object.entries(v)){if(bad.has(k))throw Error('Chave inválida.');walk(a)}}walk(x);
 const validName=n=>typeof n==='string'&&n.length>0&&n.length<=100&&!/[<>"'`\\]/.test(n);
 for(const c of ['markers','recipes'])if(!isObj(x.data[c]))throw Error('Dados personalizados inválidos.');
 for(const m of Object.values(x.data.markers))if(!Number.isFinite(m.x)||!Number.isFinite(m.y)||m.x<0||m.x>1||m.y<0||m.y>1||!validName(m.title))throw Error('Marcador inválido.');
 for(const r of Object.values(x.data.recipes)){if(!CATS[r.cat]||!['item','component'].includes(r.kind)||!validName(r.name)||!Array.isArray(r.ing)||!r.ing.length||r.ing.some(i=>!validName(i.n)||!Number.isSafeInteger(i.q)||i.q<1))throw Error('Receita personalizada inválida.');}
 const ws=x.workspace;if(!Array.isArray(ws.favorites)||ws.favorites.some(n=>typeof n!=='string')||!Array.isArray(ws.sets)||!isObj(ws.gathered)||!isObj(ws.store))throw Error('Progresso inválido.');
 const quantities=(o,max)=>isObj(o)&&Object.values(o).every(n=>Number.isSafeInteger(n)&&n>=0&&n<=max);
 for(const [cat,s] of Object.entries(ws.store))if(!CATS[cat]||!quantities(s.s,99)||!quantities(s.o,1000000000))throw Error('Inventário inválido.');
 for(const s of ws.sets)if(!validName(s.name)||!CATS[s.cat]||!quantities(s.selection,99))throw Error('Conjunto inválido.');
 if(!quantities(ws.gathered,1000000000))throw Error('Lista de recolha inválida.');
 // Validate dependency cycles against both base and imported recipes.
 for(const cat of Object.keys(CATS)){const graph={...CATS[cat].recipes,...CATS[cat].items};for(const r of Object.values(x.data.recipes).filter(r=>r.cat===cat)){if(Object.hasOwn(graph,r.name)&&!CUSTOM.some(c=>c.name===r.name))throw Error('Uma receita importada tenta substituir uma receita base.');graph[r.name]=Object.fromEntries(r.ing.map(i=>[i.n,i.q]));}const visit=(n,path)=>{if(path.has(n))throw Error('Dependência circular nas receitas.');if(!graph[n])return;const next=new Set(path);next.add(n);for(const ingredient of Object.keys(graph[n]))visit(ingredient,next)};for(const n of Object.keys(graph))visit(n,new Set());}
 return x;
}
function restore(x){const beforeData=localStorage.getItem(DATA),beforeState=localStorage.getItem(KEY);try{localStorage.setItem(DATA,JSON.stringify(x.data));localStorage.setItem(KEY,JSON.stringify(x.workspace));}catch(e){if(beforeData!==null)localStorage.setItem(DATA,beforeData);if(beforeState!==null)localStorage.setItem(KEY,beforeState);throw e}location.reload()}
file.onchange=async()=>{const f=file.files[0];if(!f)return;try{if(f.size>5000000)throw Error('O ficheiro excede 5 MB.');const x=validateBackup(JSON.parse(await f.text()));if(confirm('Importar esta cópia e substituir os dados atuais? Exporta primeiro se quiseres manter uma cópia.'))restore(x);}catch(e){say('Não foi possível importar: '+e.message)}file.value=''};
const undoButton=button('Desfazer',()=>{if(!undo)return;const value=undo;undo=null;restore(value)});undoButton.id='undoAction';undoButton.disabled=true;controls.append(undoButton);
const help=make('details');help.append(make('summary','Como usar e onde ficam os meus dados'));help.append(make('p','1. Seleciona receitas e quantidades. 2. Indica os componentes que já tens. 3. Regista os materiais recolhidos. Usa «Ver no mapa» para abrir um local. Tudo fica neste navegador; exporta uma cópia para transferir para outro dispositivo. Não existe sincronização automática entre pessoas.'));tools.append(help);
document.querySelector('.workspace-intro').after(tools);
const filters=make('div',undefined,'pro-filters');filters.setAttribute('aria-label','Filtrar receitas');
for(const [value,label] of [['all','Todas'],['favorites','Favoritas'],['located','Com localização'],['selected','Selecionadas']]){const b=button(label,()=>{filter=value;filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filterRecipes()});b.setAttribute('aria-pressed',String(value==='all'));filters.append(b)}$('weaponsGrid').before(filters);
const origFilter=filterRecipes;filterRecipes=function(){origFilter();let count=0;document.querySelectorAll('.weapon-card').forEach(card=>{const name=card.dataset.name||card.getAttribute('aria-label');const match=filter==='all'||filter==='favorites'&&state.favorites.includes(favId(name))||filter==='located'&&currentCat==='armas'&&Object.hasOwn(CRAFT_LOCATIONS,name)||filter==='selected'&&selectedWeapons[name]>0;card.hidden=card.hidden||!match;if(!card.hidden)count++});$('catalogCount').textContent=count+' receitas disponíveis';$('searchEmpty').hidden=count!==0;};
function decorate(){document.querySelectorAll('.weapon-card').forEach(card=>{const name=card.getAttribute('aria-label');card.dataset.name=name;card.removeAttribute('role');card.removeAttribute('tabindex');card.removeAttribute('aria-pressed');card.onclick=null;card.onkeydown=null;
 const select=button((selectedWeapons[name]?'✓ Selecionada':'Selecionar'),()=>toggleWeapon(name));select.className='pro-select';select.setAttribute('aria-label','Selecionar '+name);select.setAttribute('aria-pressed',String(!!selectedWeapons[name]));
 const actions=make('div',undefined,'card-actions');actions.append(select);
 const fav=button(state.favorites.includes(favId(name))?'★ Favorita':'☆ Favorita',()=>{const id=favId(name);state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();renderWeapons()});fav.setAttribute('aria-pressed',String(state.favorites.includes(favId(name))));fav.setAttribute('aria-label','Favorita: '+name);actions.append(fav);
 const loc=currentCat==='armas'&&CRAFT_LOCATIONS[name];if(loc){const info=LOCATION_DETAILS[loc.site];const hint=card.querySelector('.craft-location-link');if(hint)hint.textContent='⌖ '+(info?.region||'Local de craft')+' · referência fornecida';actions.append(button('Ver no mapa',()=>{if(!selectedWeapons[name]){selectedWeapons[name]=1;updateAll()}showCraftLocation(name)}));}
 card.querySelector('.card-actions')?.remove();card.append(actions);
 });filterRecipes();}
const origRender=renderWeapons;renderWeapons=function(){origRender();decorate()};
const origUpdate=updateAll;updateAll=function(){origUpdate();decorate();save();if(!Object.keys(selectedWeapons).length){lastRaw={};renderCollection()}updateSummary()};
const origOwned=updateOwned;updateOwned=function(...args){origOwned(...args);save();updateSummary()};
const origClear=clearAll;clearAll=function(){if(!confirm('Limpar a seleção e os componentes desta categoria?'))return;checkpoint();origClear();say('Seleção limpa. Podes desfazer.')};
const origCategory=setCategory;setCategory=function(c){origCategory(c);save();updateSummary()};
const origShow=showCraftLocation;showCraftLocation=function(name){origShow(name);const detail=LOCATION_DETAILS[CRAFT_LOCATIONS[name]?.site];if(!detail)return;const info=$('craftLocationInfo');info.querySelector('p').textContent=detail.region+' · '+detail.description+' '+detail.status;let reference=info.querySelector('details');if(!reference){reference=make('details');reference.append(make('summary','Ver imagem de referência'));const image=make('img');image.className='location-reference';reference.append(image);info.append(reference)}const image=reference.querySelector('img');image.src=detail.reference;image.alt='Ponto de craft em '+detail.region+' assinalado na referência fornecida';};
// Short labels on the map; full names in the location panel.
const origPins=renderCraftMarkers;renderCraftMarkers=function(...args){origPins(...args);document.querySelectorAll('.craft-pin').forEach(pin=>{const names=pin.title.replace(' — local de craft','').split(' · ');if(names.length>1){const loc=CRAFT_LOCATIONS[names[0]];pin.querySelector('.craft-pin-label').textContent=(LOCATION_DETAILS[loc?.site]?.region||'Craft')+' · '+names.length+' armas'}})};
const collection=make('section',undefined,'pro-collection');collection.id='collectionPanel';collection.append(make('h2','Lista de recolha'),make('p','Materiais brutos em falta, depois de descontar os componentes que já tens. O recolhido é partilhado entre categorias; não é consumido automaticamente.'));
const progress=make('progress');progress.id='gatherProgress';progress.max=100;progress.setAttribute('aria-label','Progresso de recolha');collection.append(progress);
const rows=make('div');rows.id='gatherRows';collection.append(rows);$('resultsPanel').after(collection);
const origRaw=renderRawMaterials;renderRawMaterials=function(totals){lastRaw={...totals};origRaw(totals);renderCollection();updateSummary()};
function renderCollection(){collection.hidden=!Object.keys(lastRaw).length;rows.replaceChildren();let total=0,done=0;
 for(const [name,needed] of Object.entries(lastRaw).sort((a,b)=>a[0].localeCompare(b[0],'pt'))){const owned=Number(state.gathered[name])||0;total+=needed;done+=Math.min(needed,owned);const row=make('div',undefined,'gather-row');row.append(make('strong',name));const label=make('label','Recolhido ');const input=make('input');input.type='number';input.min='0';input.max='1000000000';input.step='1';input.value=owned;input.setAttribute('aria-label','Material recolhido: '+name);label.append(input);row.append(label);const missing=make('span','Faltam '+Math.max(0,needed-owned)+' / '+needed);row.append(missing);input.oninput=()=>{state.gathered[name]=Math.max(0,Math.min(1000000000,Math.floor(Number(input.value)||0)));save();missing.textContent='Faltam '+Math.max(0,needed-state.gathered[name])+' / '+needed;updateProgress();updateSummary()};row.append(button('Completar',()=>{state.gathered[name]=needed;save();renderCollection();updateSummary()}));rows.append(row)}updateProgress();}
function updateProgress(){const total=Object.values(lastRaw).reduce((a,b)=>a+b,0);const done=Object.entries(lastRaw).reduce((s,[n,q])=>s+Math.min(q,state.gathered[n]||0),0);progress.value=total?Math.round(done/total*100):0;progress.setAttribute('aria-valuetext',Math.round(progress.value)+'% recolhido');}
const summary=make('aside',undefined,'pro-summary');summary.setAttribute('aria-label','Resumo do craft');const summaryText=make('span');summary.append(summaryText,button('Ver materiais',()=>{setCategory(currentCat);(collection.hidden?$('selectedPanel'):collection).scrollIntoView({behavior:'smooth',block:'start'})}));document.body.append(summary);
function updateSummary(){const qty=Object.values(selectedWeapons).reduce((a,b)=>a+b,0),missing=Object.entries(lastRaw).reduce((s,[n,q])=>s+Math.max(0,q-(state.gathered[n]||0)),0);summary.hidden=!qty;summaryText.textContent=qty+' itens · '+Object.keys(lastRaw).length+' materiais · '+missing+' unidades em falta';}
// Record deletions so users can recover a recipe or marker during this session.
const db=makeDb(),originalCollection=db.collection;db.collection=function(c){const col=originalCollection(c),originalDoc=col.doc;col.doc=function(id){const doc=originalDoc(id),remove=doc.delete;doc.delete=async()=>{checkpoint();await remove();say('Registo apagado. Podes recuperar com Desfazer.')};return doc};return col};markersCol=db.collection('markers');recipesCol=db.collection('recipes');
// Accessible map navigation and intentional marker placement.
mapFrame.tabIndex=0;mapFrame.setAttribute('aria-label','Mapa. Setas para mover, mais e menos para ampliar, zero para repor.');mapFrame.addEventListener('keydown',e=>{if(e.target!==mapFrame)return;const shifts={ArrowLeft:[60,0],ArrowRight:[-60,0],ArrowUp:[0,60],ArrowDown:[0,-60]};if(shifts[e.key]){e.preventDefault();panX+=shifts[e.key][0];panY+=shifts[e.key][1];updateMapTransform()}else if(['+','=','-','0'].includes(e.key)){e.preventDefault();if(e.key==='0')$('mapReset').click();else zoomMapBy(e.key==='-'?1/1.35:1.35)}});
const place=button('Adicionar marcador: desligado',()=>{placing=!placing;place.textContent='Adicionar marcador: '+(placing?'ligado':'desligado');place.setAttribute('aria-pressed',String(placing));say(placing?'Clica no mapa para criar um marcador.':'Navegação do mapa ativa.')});let placing=false;place.setAttribute('aria-pressed','false');document.querySelector('.map-toolbar').prepend(place);
mapFrame.addEventListener('click',e=>{if(!placing&&!e.target.closest('.map-marker'))e.stopImmediatePropagation()},true);
$('mapHelp').textContent='Arrasta para mover. Usa +/− para ampliar. Ativa «Adicionar marcador» para criar um ponto. No teclado, usa as setas.';
document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-label',t.textContent.trim()));
// Restore after custom recipes have been loaded by the local adapter.
for(const cat of Object.keys(CATS)){const st=state.store[cat];if(st&&isObj(st.s)&&isObj(st.o)){STORE[cat]={s:Object.fromEntries(Object.entries(st.s).filter(([n,q])=>Object.hasOwn(CATS[cat].items,n)&&Number.isInteger(q)&&q>0&&q<=99)),o:st.o}}}
currentCat=CATS[state.lastCategory]?state.lastCategory:'armas';selectedWeapons=STORE[currentCat]?.s||{};ownedComponents=STORE[currentCat]?.o||{};RECIPES=CATS[currentCat].recipes;WEAPONS=CATS[currentCat].items;
ready=true;renderSets();setCategory(currentCat);renderWeapons();updateAll();
window.addEventListener('beforeunload',save);window.addEventListener('storage',e=>{if(e.key===KEY)say('O progresso foi alterado noutra aba. Recarrega antes de continuar.')});
window.ContosQA={validateBackup,snapshot,version:VERSION};
})();

// Dialog keyboard behavior: Escape, focus containment and return focus.
(() => {
let returnFocus=null;
const dialog=dlgBody;dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Editar receitas ou marcadores');
const previousClose=closeDialog;closeDialog=function(){previousClose();returnFocus?.focus();returnFocus=null};
for(const key of ['openRecipeDialog','openMarkerDialog','openNewMarkerDialog']){if(typeof window[key]!=='function')continue;const open=window[key];window[key]=function(...args){if(dlg.style.display!=='flex')returnFocus=document.activeElement;return open(...args)}}
dlg.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeDialog();return}if(e.key!=='Tab')return;const all=[...dlg.querySelectorAll('button,input,select,textarea,a[href],[tabindex="0"]')].filter(x=>!x.disabled&&!x.hidden);const first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}});
})();
