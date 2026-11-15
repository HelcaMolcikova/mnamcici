/* Mňamčíci: společný přehled C, denní detail B, kuchařka z vaultu. */
const normalizuj = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const DATUMY = () => dnyTydne().map(d => PrikrmyApp.core.localDate(d.dt));
const JMENO_JIDLA = j => j.recept ? (RECEPTY[j.recept]?.kratce || RECEPTY[j.recept]?.nazev || j.recept) : j.co;
const KATALOG = Object.fromEntries((window.KUCHARKA || []).map(r => [r.id, r]));
const PLAN_ZDROJE = {sunkofleky:'sunkofleky',rajska:'rajska-polevka-od-maminky',sardinkova:'sardinkova-pomazanka'};
const KATALOG_PLAN = Object.fromEntries(Object.entries(PLAN_ZDROJE).map(([a,b]) => [b,a]));
const TAGY_PLAN = {sunkofleky:['oběd','oblíbené'],rajska:['polévka'],sardinkova:['pomazánka','oblíbené','večeře'],oats:['snídaně']};
const NAZVY_KATEGORII = ['snídaně','oběd','večeře','polévka','pomazánka','salát','pečivo','dezert','svačina','příloha','dip','na-návštěvu'];
let hledani = '', kategorie = '', jenOblibene = false, posledniPrehled = '#recepty';
const pocetPorci = p => `${p} ${p < 5 ? 'porce' : 'porcí'}`;
const upraveneRecepty = Object.entries(RECEPTY).map(([id,r]) => ({...r,id,tags:KATALOG[PLAN_ZDROJE[id]]?.tags || TAGY_PLAN[id] || [],hlavni:KATALOG[PLAN_ZDROJE[id]]?.hlavni || r.suroviny.map(([k]) => SUROVINY[k].n).join(', ')}));
const CELE_RECEPTY = [...upraveneRecepty,...Object.values(KATALOG).filter(r => !KATALOG_PLAN[r.id])];
function navrhPrikrmu(d) { return d.prikrmNavrh && !PrikrmyApp.core.read().plans.some(p=>p.date===PrikrmyApp.core.localDate(d.dt)) ? `<p class="baby-plan"><b>Plán:</b> ${esc(d.prikrmNavrh)}</p>` : ''; }
function nactiDatum(id) { const i = DATUMY().indexOf(id); return i < 0 ? null : {...dnyTydne()[i], i, id}; }
function priprava(d) {
  return [...(d.vari || []),...d.jidla.filter(j=>j.chystas).map(j=>[j.recept,j.chystas])];
}
function vyuziti(id, start) {
  return dnyTydne().slice(start).filter((d,i)=>d.jidla.some(j=>j.recept===id&&(i>0||j.kdy!=='Snídaně'))).slice(0,2).map(d=>DNY[d.dt.getDay()].toLowerCase()).join(' a ');
}
vykresliTyden = function() {
  const dny=dnyTydne(), dates=DATUMY(), dnes=new Date();
  let h=`<div class="top"><p class="eyebrow">Helča a Honza</p><h1>Vaření a náš týden</h1><p class="muted">${datum(dny[0].dt)} - ${datum(dny[6].dt)} ${dny[0].dt.getFullYear()}</p></div><div class="cook-layout"><section><div class="section-head"><h2>Co nachystat</h2></div><div class="cooking-blocks">`;
  let n=0;
  dny.forEach((d,i)=>{
    if (!d.vari?.length) return;
    h+=`<article class="cook-block"><div class="cook-when"><span class="cook-number">${++n}</span>${DNY[d.dt.getDay()]}${d.dt.getDay()===2?' večer':''}</div><h3>${d.vari.map(([id])=>esc(RECEPTY[id].kratce)).join(' a ')}</h3><ul class="cook-list">${d.vari.map(([id,p])=>`<li><a href="#recept/${id}${p?'/'+p:''}">${esc(RECEPTY[id].kratce)}${p?' · '+pocetPorci(p):''}</a><small>${esc(vyuziti(id,i))}${id==='oats'?', pro Helču':''}</small></li>`).join('')}</ul><a class="text-link" href="#den/${dates[i]}">Otevřít den</a></article>`;
  });
  const darovana=dny.flatMap(d=>d.jidla.filter(j=>j.od).map(j=>({d,j})));
  const nachystana=[...darovana,...dny.flatMap(d=>(d.uvareno||[]).map(j=>({d,j:{...j,od:'už upečené'}})))];
  if(nachystana.length)h+=`<div class="already"><b>Už máme nachystáno</b>${nachystana.map(({d,j})=>`<p>${esc(DNY[d.dt.getDay()])}: ${esc(JMENO_JIDLA(j))} ${esc(j.od)}.</p>`).join('')}</div>`;
  h+=`</div></section><section><div class="section-head"><h2>Celý týden</h2><a class="text-link" href="#nakup">Nákup</a></div><div class="week-list">`;
  dny.forEach((d,i)=>{
    h+=`<article class="week-entry${stejnyDen(d.dt,dnes)?' today':''}"><a class="week-day" href="#den/${dates[i]}" aria-label="${DNY[d.dt.getDay()]} ${datum(d.dt)} - otevřít den"><span class="week-date"><b>${DNY[d.dt.getDay()]}</b><small>${datum(d.dt)}${stejnyDen(d.dt,dnes)?' · dnes':''}</small></span><span class="week-meals">${d.jidla.length?d.jidla.map(j=>`<div><small>${esc(j.kdy)}</small><span>${esc(JMENO_JIDLA(j))}${j.od?`<span class="meal-note">${esc(j.od)}</span>`:''}</span></div>`).join(''):'<span class="week-empty">Zatím volno</span>'}</span><span class="chevron" aria-hidden="true">›</span></a><div class="week-baby">${navrhPrikrmu(d)}${PrikrmyApp.dayCard(dates[i])}</div></article>`;
  });
  $('#obsah').innerHTML=h+'</div></section></div>';
  PrikrmyApp.bindDayButtons($('#obsah'));
};
function vykresliDnes() {vykresliDen(PrikrmyApp.core.localDate(new Date()),true);}
function vykresliDen(id,allowOutside=false) {
  let d=nactiDatum(id);
  if(!d&&allowOutside&&/^\d{4}-\d{2}-\d{2}$/.test(id))d={dt:new Date(id+'T12:00:00'),i:-1,id,jidla:[]};
  if(!d)return vykresliTyden();
  const dates=DATUMY(), dny=dnyTydne();
  const jidlo=d.jidla.find(j=>j.kdy==='Večeře'&&(RECEPTY[j.recept]?.foto||RECEPTY[j.recept]?.fotoNahled)) || d.jidla.find(j=>(RECEPTY[j.recept]?.foto||RECEPTY[j.recept]?.fotoNahled)) || d.jidla.find(j=>j.recept) || d.jidla[0];
  const r=jidlo?.recept&&RECEPTY[jidlo.recept];
  const foto=r&&(r.foto||r.fotoNahled);
  let h=`<article class="daily"><a class="back-link" href="#tyden">Zpět na celý týden</a><div class="day-top"><p class="eyebrow">${datum(d.dt)} ${d.dt.getFullYear()} · Helča a Honza</p><h1>${DNY[d.dt.getDay()]} u nás doma</h1></div><nav class="day-rail" aria-label="Dny týdne">${dny.map((x,i)=>`<a href="#den/${dates[i]}" ${i===d.i?'aria-current="date"':''}><span>${DNY[x.dt.getDay()].slice(0,2)}</span><b>${x.dt.getDate()}</b></a>`).join('')}</nav>`;
  if(jidlo)h+=`<div class="hero${foto?'':' no-photo'}">${foto?`<img src="${esc(foto)}" alt="${esc(JMENO_JIDLA(jidlo))}">`:''}<div class="hero-text"><span class="tag">${esc(jidlo.kdy)}</span><h2>${esc(JMENO_JIDLA(jidlo))}</h2>${jidlo.od||jidlo.pozn?`<p>${esc(jidlo.od||jidlo.pozn)}</p>`:''}${r?`<a class="btn" href="#recept/${jidlo.recept}">Otevřít recept</a>`:''}</div></div>`;
  else h+='<div class="hero no-photo"><div class="hero-text"><h2>Na tento den zatím není jídlo</h2><p>V uloženém rodinném plánu na tento den není žádné jídlo.</p><a class="btn line" href="#recepty">Prohlédnout kuchařku</a></div></div>';
  h+=`<div class="day-bottom"><section><div class="day-meals">${['Snídaně','Oběd','Večeře'].map(k=>{const js=d.jidla.filter(j=>j.kdy===k);return `<div class="day-meal"><span class="label">${k}</span><div>${js.length?js.map(j=>`${j.recept?`<a href="#recept/${j.recept}">${esc(JMENO_JIDLA(j))}</a>`:esc(JMENO_JIDLA(j))}${j.od||j.pozn?`<p>${esc(j.od||j.pozn)}</p>`:''}`).join(''):'<span class="muted">Neplánováno</span>'}</div></div>`}).join('')}</div></section><aside><section class="day-prep"><h2>${priprava(d).length?'Dnes chystáš':'Příprava'}</h2>${priprava(d).length?`<ul>${priprava(d).map(([rid,p])=>`<li><a href="#recept/${rid}${p?'/'+p:''}">${esc(RECEPTY[rid].kratce)}</a>${p?' · '+pocetPorci(p):''}</li>`).join('')}</ul>`:'<p class="muted">Na dnešek není naplánované další vaření.</p>'}</section><section class="day-baby p-panel"><h2>Pro Aničku</h2>${navrhPrikrmu(d)}${PrikrmyApp.dayCard(id)}</section></aside></div></article>`;
  $('#obsah').innerHTML=h;PrikrmyApp.bindDayButtons($('#obsah'));
}
function card(r) {
  const tags=r.tags||[],foto=r.fotoNahled||r.foto;
  return `<a class="karta${tags.includes('oblíbené')?' favorite':''}" href="#recept/${esc(r.id)}">${foto?`<img src="${esc(foto)}" alt="" loading="lazy">`:''}<span class="nm">${esc(r.nazev)}</span>${r.cas?`<span class="meta">${esc(r.cas)}</span>`:''}${r.hlavni?`<span class="ingredients">${esc(r.hlavni)}</span>`:''}<span class="card-bottom">${tags.filter(t=>NAZVY_KATEGORII.includes(t)||t==='oblíbené').slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}${r.uplny===false?'<span>Neúplný zápis</span>':''}</span></a>`;
}
function vysledkyKatalogu() {
  const q=normalizuj(hledani).trim().split(/\s+/).filter(Boolean);
  const list=CELE_RECEPTY.filter(r=>(!kategorie||r.tags.includes(kategorie))&&(!jenOblibene||r.tags.includes('oblíbené'))&&q.every(x=>normalizuj(r.nazev+' '+(r.hlavni||'')+' '+(r.tags||[]).join(' ')+' '+(r.sections||[]).filter(s=>s.title.toLowerCase().includes('surovin')).map(s=>s.text).join(' ')).includes(x)));
  list.sort((a,b)=>Number(b.tags.includes('oblíbené'))-Number(a.tags.includes('oblíbené'))||a.nazev.localeCompare(b.nazev,'cs'));
  $('#pocet-receptu').textContent=`Zobrazeno ${list.length} z ${CELE_RECEPTY.length} receptů`;
  $('#vysledky').innerHTML=list.length?`<div class="karty">${list.map(card).join('')}</div>`:'<div class="empty-results">Žádný recept neodpovídá výběru. Zkus jinou surovinu nebo zruš filtr.</div>';
}
vykresliRecepty = function() {
  $('#obsah').innerHTML=`<div class="top"><p class="eyebrow">Naše kuchařka</p><h1>Co si dáme?</h1><p class="muted">Tvoje recepty pohromadě, pro Helču i Honzu.</p></div><div class="catalog-tools"><input type="search" id="hledat-recept" aria-label="Hledat podle názvu nebo suroviny" placeholder="Název jídla nebo surovina" value="${esc(hledani)}"><select id="kategorie-receptu" aria-label="Druh jídla"><option value="">Všechna jídla</option>${NAZVY_KATEGORII.map(t=>`<option ${kategorie===t?'selected':''} value="${t}">${t[0].toUpperCase()+t.slice(1)}</option>`).join('')}</select><label class="favorite-filter"><input id="jen-oblibene" type="checkbox" ${jenOblibene?'checked':''}>Jen oblíbené</label></div><p id="pocet-receptu" class="catalog-count" role="status" aria-live="polite"></p><div id="vysledky"></div>`;
  $('#hledat-recept').addEventListener('input',e=>{hledani=e.target.value;vysledkyKatalogu()});
  $('#kategorie-receptu').addEventListener('change',e=>{kategorie=e.target.value;vysledkyKatalogu()});
  $('#jen-oblibene').addEventListener('change',e=>{jenOblibene=e.target.checked;vysledkyKatalogu()});
  vysledkyKatalogu();
};
// A small safe Markdown renderer: source text is escaped before formatting.
function pracovniText(text) {
  const inline=s=>esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
  let html='',kind='';
  const end=()=>{if(kind){html+=`</${kind}>`;kind=''}};
  for(const raw of text.split('\n')){
    const line=raw.trim();if(!line){end();continue;}
    if(/^#{1,6} /.test(line)){end();html+='<h3>'+inline(line.replace(/^#+ /,''))+'</h3>';continue;}
    const li=line.match(/^(?:[-*] |\d+\. )(.+)$/);
    if(li){const k=/^\d/.test(line)?'ol':'ul';if(kind!==k){end();html+=`<${k}>`;kind=k}html+='<li>'+inline(li[1])+'</li>'}
    else{end();html+='<p>'+inline(line)+'</p>'}
  }end();return html;
}
const planovanyRecept=vykresliRecept;
vykresliRecept=function(id,porce){
  id=KATALOG_PLAN[id]||id;
  if(RECEPTY[id]){planovanyRecept(id,Number.isFinite(porce)&&porce>0?Math.min(porce,100):null);const a=$('#obsah .zpet');if(a){a.href=posledniPrehled;a.textContent=posledniPrehled.startsWith('#den/')?'Zpět na den':posledniPrehled==='#tyden'?'Zpět na týden':'Zpět na recepty'}return;}
  const r=KATALOG[id];if(!r)return vykresliRecepty();
  $('#obsah').innerHTML=`<article class="recept"><a class="back-link" href="${esc(posledniPrehled)}">Zpět do přehledu</a><div class="catalog-detail-head"><p class="eyebrow">Naše kuchařka</p><h1>${esc(r.nazev)}</h1><div class="recipe-info">${r.cas?`<span class="tag">${esc(r.cas)}</span>`:''}${r.tags.filter(t=>NAZVY_KATEGORII.includes(t)||t==='oblíbené').map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>${r.hlavni?`<p class="muted">${esc(r.hlavni)}</p>`:''}${!r.uplny?'<p class="recipe-alert">Ve tvé kuchařce není tento recept dopsaný celý. Zobrazuje se původní dostupný zápis.</p>':''}</div>${r.foto?`<img class="foto" src="${esc(r.foto)}" alt="${esc(r.nazev)}" loading="eager">`: ''}<div class="recipe-text">${r.sections.map(s=>`<section class="recipe-section"><h2>${esc(s.title.replace(/\*\*/g,''))}</h2>${s.text?pracovniText(s.text):'<p class="muted">V původním zápisu zatím není doplněno.</p>'}</section>`).join('')}</div>${r.zdroj?`<p class="recipe-source">Zdroj: <a href="${esc(r.zdroj)}" target="_blank" rel="noopener noreferrer">${esc(new URL(r.zdroj).hostname)}</a></p>`:r.puvod?`<p class="recipe-source">Zdroj: ${esc(r.puvod)}</p>`:''}</article>`;
};
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#recept/"]');if(a&&!location.hash.startsWith('#recept/'))posledniPrehled=location.hash||'#tyden'},true);
const puvodniNakup=vykresliNakup;
vykresliNakup=function(){
  puvodniNakup();
  const editor=document.createElement('details');editor.className='p-panel own-shopping-editor';editor.id='own-shopping-editor';
  editor.innerHTML=`<summary>Přidat vlastní položku</summary><form id="own-shopping-form"><input type="hidden" name="itemId"><div class="p-form-grid"><label class="p-field">Název<input name="name" required maxlength="200" placeholder="Například pečivo"></label><label class="p-field">Množství (volitelné)<input name="amount" maxlength="80" placeholder="Například 2 ks"></label></div><button type="submit" class="btn" ${nakupProblem?'disabled':''}>Uložit položku</button></form>`;
  $('#obsah .akce').after(editor);
  const form=editor.querySelector('form');
  form.onsubmit=ev=>{ev.preventDefault();try{
    const name=form.elements.name.value.trim(),amount=form.elements.amount.value.trim(),id=form.elements.itemId.value;
    if(!name)throw Error('Napiš název položky.');
    const items=nactiVlastniNakup();if(nakupProblem)throw Error(nakupProblem);
    if(id){const item=items.find(x=>x.id===id);if(!item)throw Error('Položka nebyla nalezená.');if(item.name!==name||item.amount!==amount)item.checked=false;item.name=name;item.amount=amount;}
    else {if(items.length>=1000)throw Error('Seznam už obsahuje příliš mnoho vlastních položek.');items.push({id:'vlastni-'+crypto.randomUUID(),name,amount,checked:false});}
    ulozVlastniNakup(items);vykresliNakup();nakupOznam(id?'Položka upravená.':'Položka přidaná.');document.querySelector('#nakup-status').scrollIntoView({block:'center'});
  }catch(err){nakupOznam(err.message);}};
  $('#obsah').querySelectorAll('[data-edit-item]').forEach(b=>b.onclick=()=>{const item=nactiVlastniNakup().find(x=>x.id===b.dataset.editItem);if(!item)return;editor.open=true;form.elements.itemId.value=item.id;form.elements.name.value=item.name;form.elements.amount.value=item.amount;editor.querySelector('summary').textContent='Upravit vlastní položku';form.elements.name.focus();});

  const note=document.createElement('p');note.className='storage-note';note.textContent='Odškrtnutí se ukládá v tomto prohlížeči. Na druhém telefonu se samo nezmění.';$('#obsah .akce').after(note);
  const navrhy=dnyTydne().filter(d=>d.prikrmNavrh&&!PrikrmyApp.core.read().plans.some(p=>p.date===PrikrmyApp.core.localDate(d.dt)));
  if(navrhy.length){const pending=document.createElement('p');pending.className='recipe-alert';pending.textContent='K příkrmu ještě vyber konkrétní zeleninu a hrušku nebo jablko. Tyto nerozhodnuté suroviny zatím nejsou přičtené do nákupu.';note.after(pending)}
  const b=document.createElement('button');b.className='btn line';b.type='button';b.textContent='Zobrazit seznam k předání';$('#obsah .akce').append(b);
  b.addEventListener('click',()=>{const hot=store.get(KLIC_NAKUP,[]);const text=seznam().filter(p=>p.o!=='Doma'&&!jeHotovo(p,hot)).map(p=>'- '+p.n+(mnozstvi(p)?' '+mnozstvi(p):'')).join('\n');let box=$('#seznam-k-predani');if(!box){box=document.createElement('div');box.id='seznam-k-predani';$('#obsah .akce').after(box)}box.innerHTML='<label class="p-field">Nákupní seznam<textarea class="copy-area" readonly></textarea></label><p class="storage-note">Seznam můžeš předat nákupnímu asistentovi. Do košíku na Rohlíku se tím sám nevloží.</p>';const area=box.querySelector('textarea');area.value=text;area.focus();area.select()});
};
route();
