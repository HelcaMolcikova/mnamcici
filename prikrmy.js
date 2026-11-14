/* Soukromé záznamy zůstávají v prohlížeči. Tento soubor neobsahuje osobní deník. */
const PrikrmyApp = (() => {
  'use strict';
  const KEY = 'molcuchyne-prikrmy-v1';
  const empty = () => ({version:1, plans:[], batches:[], stock:[], logs:[], foods:[]});
  const catalog = [
    ['dyne','Máslová dýně'],['hokkaido','Dýně hokkaido'],['hruska','Hruška'],['jablko','Jablko'],
    ['batat','Batát'],['brokolice','Brokolice'],['cuketa','Cuketa'],['mrkev','Mrkev'],['brambor','Brambory'],
    ['kure','Kuřecí maso'],['hovezi','Hovězí maso'],['ryze','Rýže'],['cocka','Čočka'],
    ['vejce','Vejce','Vejce'],['jogurt','Bílý jogurt','Mléko'],['mleko','Mléko','Mléko'],
    ['psenice','Pšenice','Lepek'],['vlocky','Ovesné vločky','Lepek'],['ryba','Ryba','Ryby'],
    ['arasid','Arašídy','Arašídy'],['mandle','Mandle','Skořápkové plody'],['sezam','Sezam','Sezam'],
    ['soja','Sója','Sója'],['celer','Celer','Celer'],['horcice','Hořčice','Hořčice']
  ].map(([id,name,allergen])=>({id,name,allergen:allergen||''}));
  const recipes = [
    {id:'dyne-hruska',name:'Máslová dýně s hruškou',foods:['dyne','hruska'],photo:'fotky/prikrm-dyne-hruska.png'},
    {id:'hokkaido-jablko',name:'Hokkaido s jablkem',foods:['hokkaido','jablko'],photo:'fotky/prikrm-hokkaido-jablko.png'},
    {id:'batat-jablko',name:'Batát s jablkem',foods:['batat','jablko'],photo:'fotky/prikrm-batat-jablko.png'},
    {id:'brokolice-hruska',name:'Brokolice s hruškou',foods:['brokolice','hruska'],photo:'fotky/prikrm-brokolice-hruska.png'},
    {id:'cuketa-hruska',name:'Cuketa s hruškou',foods:['cuketa','hruska']},
    {id:'mrkev-jablko',name:'Mrkev s jablkem',foods:['mrkev','jablko'],photo:'fotky/prikrm-mrkev-jablko.png'}
  ];
  const e = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid = () => crypto.randomUUID();
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const next = (s,n=1) => {const d=new Date(s+'T12:00:00'); d.setDate(d.getDate()+n);return iso(d)};
  const today = () => iso(new Date());
  const dtNow = () => `${today()}T${new Date().toTimeString().slice(0,5)}`;
  const showDate = s => s ? new Date(s.slice(0,10)+'T12:00:00').toLocaleDateString('cs-CZ',{day:'numeric',month:'numeric'}) : 'datum neuvedeno';
  const field = (label,input) => `<label class="p-field"><span>${label}</span>${input}</label>`;
  const text = (name,value='',required=false) => `<input name="${name}" value="${e(value)}" ${required?'required':''} maxlength="300">`;
  const button = (label,attrs='') => `<button class="btn line" type="button" ${attrs}>${label}</button>`;
  let problem = '';
  function validate(s) {
    if (!s || s.version!==1 || !['plans','batches','stock','logs','foods'].every(k=>Array.isArray(s[k]))) throw Error('Neznámý formát zálohy.');
    const str=(v,max=1000)=>typeof v==='string'&&v.length<=max;
    const date=v=>v===''||(str(v,10)&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(new Date(v+'T12:00:00Z'))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v);
    const time=v=>v===''||(str(v,5)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(v));
    const stamp=v=>v===''||(str(v,30)&&!isNaN(new Date(v)));
    for(const key of ['plans','batches','stock','logs','foods']) {
      if(s[key].length>20000)throw Error('Záloha je příliš velká.');
      const ids=new Set();
      for(const x of s[key]) {
        if(!x||!str(x.id,100)||!x.id||ids.has(x.id))throw Error('Neplatné nebo duplicitní záznamy.');ids.add(x.id);
        if(key==='foods') {if(!str(x.name,100)||!str(x.allergen,100))throw Error('Neplatná potravina.');continue;}
        if(key==='batches') {if(!stamp(x.preparedAt)||!date(x.plannedDate))throw Error('Neplatné datum přípravy.');continue;}
        if(!str(x.title,300)||!x.title.trim()||!Array.isArray(x.foods)||x.foods.length>100||!x.foods.every(f=>str(f,100)))throw Error('Neplatné složení jídla.');
        if(key==='stock') {if(!stamp(x.preparedAt)||!x.preparedAt||!stamp(x.frozenAt)||!x.frozenAt||!str(x.usedBy,100))throw Error('Neplatná porce v mrazáku.');}
        else if(!date(x.date))throw Error('Neplatné datum jídla.');
        if(key==='plans'&&(!['fresh','fridge','frozen'].includes(x.source)||!str(x.batchId,100)||!str(x.stockId,100)))throw Error('Neplatný plán.');
        if(key==='logs'&&(!time(x.time)||!['offered','tasted','ate','unknown'].includes(x.result)||!['unknown','none','symptom'].includes(x.reaction)||!str(x.note,3000)||!str(x.amount,100)||!stamp(x.onset)||!stamp(x.thawedAt)||!str(x.planId,100)||!str(x.stockId,100)||!str(x.batchId,100)||!str(x.source,20)))throw Error('Neplatná ochutnávka.');
      }
    }
    const names=new Set([...catalog,...s.foods].map(f=>f.id));
    const dates=new Set();
    for(const x of [...s.plans,...s.stock,...s.logs]) if(!x.foods.every(id=>names.has(id)))throw Error('V záloze chybí některá potravina.');
    for(const p of s.plans) {
      if(!p.date||dates.has(p.date))throw Error('Více plánů pro stejný den.');dates.add(p.date);
      if(p.source==='frozen'&&!s.stock.some(x=>x.id===p.stockId))throw Error('V plánu chybí porce z mrazáku.');
      if(p.source!=='frozen'&&!s.batches.some(x=>x.id===p.batchId))throw Error('V plánu chybí várka.');
    }
    for(const x of s.stock) if(x.usedBy&&!s.logs.some(l=>l.id===x.usedBy&&l.stockId===x.id))throw Error('U porce chybí záznam použití.');
    for(const l of s.logs) {
      if(l.stockId&&!s.stock.some(x=>x.id===l.stockId))throw Error('U ochutnávky chybí porce.');
      if(l.batchId&&!s.batches.some(x=>x.id===l.batchId))throw Error('U ochutnávky chybí várka.');
    }
    return s;
  }
  function read() {
    try {const raw=localStorage.getItem(KEY);return raw?validate(JSON.parse(raw)):empty();}
    catch(err){problem='Deník se nepodařilo načíst. Původní data zůstávají beze změny. V záložce Záloha si stáhni jejich kopii.';return empty();}
  }
  function write(s) {
    if(problem)throw Error(problem);
    validate(s);
    try{localStorage.setItem(KEY,JSON.stringify(s));}catch(err){throw Error('Zápis se neuložil. Prohlížeč nepovolil uložení nebo je plný. Stáhni zálohu a zkus to znovu.');}
  }
  function foods(s) {return [...catalog,...s.foods];}
  function food(s,id){return foods(s).find(f=>f.id===id)||{id,name:id,allergen:''};}
  function actual(log){return ['tasted','ate'].includes(log.result);}
  function tried(s,id){return s.logs.some(l=>actual(l)&&l.foods.includes(id));}
  function newFoods(s,ids){return ids.filter(id=>!tried(s,id));}
  function flags(s,ids){
    const fresh=newFoods(s,ids), alerts=ids.filter(id=>s.logs.some(l=>l.reaction==='symptom'&&l.foods.includes(id)));
    return `${fresh.length?`<p class="p-new">Nové podle deníku: ${e(fresh.map(id=>food(s,id).name).join(', '))}</p>`:''}${alerts.length?`<p class="p-warning">U tohoto složení už je zaznamenaný příznak. Před opakováním projdi deník a domluv další postup s pediatrem.</p>`:''}`;
  }
  function expiry(batch,ids) {
    if(!batch?.preparedAt)return null;
    const t=new Date(batch.preparedAt).getTime();
    return Math.min(new Date(next(iso(new Date(t)),2)+'T00:00:00').getTime(),t+(ids.includes('ryze')?24:48)*3600000);
  }
  function batchWarning(s,p,at=Date.now()) {
    if(p.source==='frozen')return 'Porce z mrazáku. Při zápisu doplň čas úplného rozmrazení.';
    const b=s.batches.find(b=>b.id===p.batchId), exp=expiry(b,p.foods);
    if(!exp)return 'Příprava zatím nepotvrzená.';
    if(at<new Date(b.preparedAt).getTime())return 'Podání nemůže být před přípravou.';
    return at>=exp?'Tuto várku už nenabízet. Naplánuj nové vaření nebo porci z mrazáku.':`Připraveno ${showDate(b.preparedAt)} v ${b.preparedAt.slice(11,16)}. Nejpozději ${new Date(exp).toLocaleString('cs-CZ',{day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'})}; platí jen při správném skladování.`;
  }
  function selections(s,selected=[]) {return `<fieldset class="p-foods"><legend>Složení jídla</legend>${foods(s).map(f=>`<label><input type="checkbox" name="foods" value="${e(f.id)}" ${selected.includes(f.id)?'checked':''}>${e(f.name)}${f.allergen?` <small>${e(f.allergen)}</small>`:''}</label>`).join('')}</fieldset>`;}
  function chosen(form){return new FormData(form).getAll('foods');}
  function options(selected=''){return `<option value="">Vlastní kombinace</option>${recipes.map(r=>`<option value="${r.id}" ${r.id===selected?'selected':''}>${e(r.name)}</option>`).join('')}`;}
  function wireRecipe(form) {
    form.elements.recipe?.addEventListener('change',()=>{
      const r=recipes.find(r=>r.id===form.elements.recipe.value);if(!r)return;
      form.elements.title.value=r.name;
      form.querySelectorAll('[name="foods"]').forEach(i=>i.checked=r.foods.includes(i.value));
    });
  }
  function run(fn){return ev=>{ev?.preventDefault();try{fn(ev);}catch(err){alert(err.message);}};}
  function planFor(s,date){return s.plans.find(p=>p.date===date);}
  function dayCard(date) {
    const s=read(),p=planFor(s,date);
    return `<div class="p-day"><span class="kdy">Anička</span>${p?`<a href="#prikrmy/plan"><b>${e(p.title)}</b></a><span class="small muted">${{fresh:'Připravit',fridge:'Druhá porce',frozen:'Z mrazáku'}[p.source]}</span>${flags(s,p.foods)}${button('Zapsat',`data-p-log="${e(p.id)}"`)}${p.source==='fresh'&&!s.batches.find(b=>b.id===p.batchId)?.preparedAt?button('Potvrdit přípravu',`data-p-prep="${e(p.id)}"`):''}`:`<a href="#prikrmy/plan">Naplánovat příkrm</a>`}</div>`;
  }
  function bindDayButtons(root=document) {
    root.querySelectorAll('[data-p-log]').forEach(b=>b.onclick=()=>logForm(b.dataset.pLog));
    root.querySelectorAll('[data-p-prep]').forEach(b=>b.onclick=()=>prepForm(b.dataset.pPrep));
  }
  function shopping() {
    const s=read(), seen=new Set(), out=[];
    for(const p of s.plans.filter(p=>p.date>=TYDEN.od&&p.date<next(TYDEN.od,7)&&p.source==='fresh')){
      if(seen.has(p.batchId))continue;seen.add(p.batchId);
      for(const id of p.foods){const f=food(s,id);out.push({id,name:f.name,title:p.title});}
    }
    return out;
  }
  function top(tab){return `<div class="top"><h1>Příkrmy pro Aničku</h1><p class="muted">Plán, první chutě a malé pokroky.</p></div><nav class="p-tabs" aria-label="Příkrmy">${[['plan','Plán'],['foods','Potraviny'],['diary','Deník'],['recipes','Recepty'],['freezer','Mrazák'],['backup','Záloha']].map(([id,n])=>`<a href="#prikrmy/${id}" ${id===tab?'aria-current="page"':''}>${n}</a>`).join('')}</nav>${problem?`<p role="alert" class="p-warning">${e(problem)}</p>`:''}`;}
  function frame(tab,html) {document.querySelector('#obsah').innerHTML=top(tab)+html;}
  function planView() {
    const s=read();let h=`<div class="p-toolbar">${button('Naplánovat na dva dny','id="p-add-plan"')}${button('Zapsat jiné jídlo','id="p-add-log"')}</div><p class="small muted">Plán se do ochutnávek zapíše až po tvém potvrzení. Zápisy jsou jen v tomto prohlížeči.</p><div class="p-week">`;
    const start=today()<TYDEN.od?TYDEN.od:today();
    for(let i=0;i<7;i++){const date=next(start,i),p=planFor(s,date);h+=`<section class="p-panel"><h2>${new Date(date+'T12:00:00').toLocaleDateString('cs-CZ',{weekday:'long',day:'numeric',month:'numeric'})}</h2>${dayCard(date)}${p?`<p class="small muted">${e(batchWarning(s,p,new Date(date+'T12:00:00').getTime()))}</p>`:''}</section>`;}
    frame('plan',h+'</div>');document.querySelector('#p-add-plan').onclick=()=>planForm();document.querySelector('#p-add-log').onclick=()=>logForm();bindDayButtons();
  }
  function planForm(recipeId='') {
    const s=read();
    frame('plan',`<form id="p-form" class="p-panel"><h2>Naplánovat příkrm</h2><div class="p-form-grid">${field('První den',`<input type="date" name="date" value="${today()<TYDEN.od?TYDEN.od:today()}" required>`)}${field('Recept',`<select name="recipe">${options()}</select>`)}${field('Název',text('title','',true))}${field('Příprava',`<select name="source"><option value="fresh">Uvařit na tento a následující den</option><option value="frozen">Jedna porce z mrazáku</option></select>`)}</div><div id="p-stock-choice" hidden>${field('Porce z mrazáku',`<select name="stockId"><option value="">Vyber porci</option>${s.stock.filter(x=>!x.usedBy&&!s.plans.some(p=>p.stockId===x.id)).map(x=>`<option value="${e(x.id)}">${e(x.title)} - zmrazeno ${showDate(x.frozenAt)}</option>`).join('')}</select>`)}</div>${selections(s)}<p class="small muted">Vyber skutečné složení. Nový alergen plánuj jednotlivě; ostatní suroviny by už měla znát. Vejce podávej důkladně tepelně upravené.</p><div class="p-toolbar"><button class="btn">Uložit plán</button><a href="#prikrmy/plan">Zpět</a></div></form>`);
    const f=document.querySelector('#p-form');wireRecipe(f);
    f.elements.source.onchange=()=>document.querySelector('#p-stock-choice').hidden=f.elements.source.value!=='frozen';
    f.elements.stockId.onchange=()=>{const x=s.stock.find(x=>x.id===f.elements.stockId.value);if(!x)return;f.elements.title.value=x.title;f.querySelectorAll('[name="foods"]').forEach(i=>i.checked=x.foods.includes(i.value));};
    if(recipeId){f.elements.recipe.value=recipeId;f.elements.recipe.dispatchEvent(new Event('change'));}
    f.onsubmit=run(()=>{
      const state=read(),d=new FormData(f),date=d.get('date'),source=d.get('source');let title=d.get('title').trim(),ids=chosen(f),stockId='';
      if(source==='frozen'){const x=state.stock.find(x=>x.id===d.get('stockId')&&!x.usedBy);if(!x||state.plans.some(p=>p.stockId===x.id))throw Error('Vyber volnou porci z mrazáku.');ids=x.foods;title=x.title;stockId=x.id;}
      if(!ids.length||!title)throw Error('Vyplň název a složení.');
      const newAllergens=new Set(newFoods(state,ids).map(id=>food(state,id).allergen).filter(Boolean));
      if(newAllergens.size>1&&!confirm('V jídle je podle zdejšího deníku více nových alergenů. Doporučené je zavádět je jednotlivě. Přesto uložit tento plán?'))return;
      const dates=source==='fresh'?[date,next(date)]:[date];
      if(state.plans.some(p=>dates.includes(p.date))&&!confirm('Na některý z těchto dnů už je plán. Upravit jej? Dosavadní ochutnávky zůstanou zachované.'))return;
      const batchId=source==='fresh'?uid():'';
      if(batchId)state.batches.push({id:batchId,plannedDate:date,preparedAt:''});
      dates.forEach((date,i)=>{
        const old=planFor(state,date),p={id:old?.id||uid(),date,title,foods:ids.slice(),source:source==='frozen'?'frozen':i?'fridge':'fresh',batchId,stockId};
        if(old)state.plans[state.plans.indexOf(old)]=p;else state.plans.push(p);
      });write(state);render('plan');
    });
  }
  function prepForm(id) {
    const s=read(),p=s.plans.find(p=>p.id===id);if(!p)return;
    frame('plan',`<form id="p-form" class="p-panel"><h2>Příprava: ${e(p.title)}</h2>${field('Skutečný čas uvaření',`<input type="datetime-local" name="prepared" value="${dtNow()}" required>`)}<p>Příkrm rozděl do samostatných porcí. Druhou rychle zchlaď a uchovej v lednici. Nedojedenou podanou porci neuchovávej.</p><button class="btn">Potvrdit přípravu</button></form>`);
    document.querySelector('#p-form').onsubmit=run(ev=>{const at=new FormData(ev.target).get('prepared');if(new Date(at)>new Date())throw Error('Příprava nemůže být v budoucnu.');const state=read(),b=state.batches.find(b=>b.id===p.batchId);if(!b)throw Error('Várka nebyla nalezena.');b.preparedAt=at;write(state);render('plan');});
  }
  function logForm(planId='',editId='') {
    const s=read(),old=s.logs.find(l=>l.id===editId),p=s.plans.find(p=>p.id===planId),base=old||p||{};
    const date=old?old.date:(p?.date||today()),time=old?.time||'';
    frame('diary',`<form id="p-form" class="p-panel"><h2>${old?'Upravit zápis':'Zapsat ochutnávku'}</h2><div class="p-form-grid">${field('Datum (neznámé může zůstat prázdné)',`<input type="date" name="date" value="${e(date)}" max="${today()}">`)}${field('Čas podání (volitelně)',`<input type="time" name="time" value="${e(time)}">`)}${field('Jídlo',text('title',base.title||'',true))}${field('Jak to šlo',`<select name="result"><option value="offered">Nabídnuto, neochutnala</option><option value="tasted">Ochutnala</option><option value="ate">Jedla</option><option value="unknown">Není jisté, zda ochutnala</option></select>`)}${field('Množství (volitelně)',text('amount',old?.amount||''))}${field('Reakce',`<select name="reaction"><option value="unknown">Reakce nezaznamenaná</option><option value="none">Bez pozorovaných příznaků</option><option value="symptom">Pozorovaný příznak</option></select>`)}</div>${selections(s,base.foods||[])}${base.source==='frozen'?field('Čas úplného rozmrazení porce',`<input name="thawed" type="datetime-local" value="${e(old?.thawedAt||'')}" required>`):''}${field('Začátek příznaku (pokud nastal)',`<input name="onset" type="datetime-local" value="${e(old?.onset||'')}">`)}${field('Poznámka: chuť, příznak a okolnosti',`<textarea name="note" rows="3" maxlength="3000">${e(old?.note||'')}</textarea>`)}<p class="small muted">Zápis pomáhá dohledat souvislosti. Příznak sám neurčuje příčinu ani diagnózu. Další reakci můžeš doplnit později úpravou zápisu.</p><div class="p-toolbar"><button class="btn">Uložit zápis</button><a href="#prikrmy/diary">Zpět</a></div></form>`);
    const f=document.querySelector('#p-form');if(old){f.elements.result.value=old.result;f.elements.reaction.value=old.reaction;}
    f.onsubmit=run(()=>{
      const state=read(),d=new FormData(f),ids=chosen(f),day=d.get('date'),clock=d.get('time');
      if(!ids.length)throw Error('Vyber skutečně nabídnuté suroviny.');
      if(clock&&!day)throw Error('K času podání doplň datum, nebo ponech obojí prázdné.');
      if(!d.get('title').trim())throw Error('Doplň název jídla.');
      const at=day?new Date(day+'T'+(clock||'12:00')).getTime():null;
      if(day>today()||(clock&&at>Date.now()))throw Error('Ochutnávka se zatím nestala. Uprav datum nebo čas.');
      const symptom=d.get('reaction')==='symptom';
      if(symptom&&!d.get('note').trim())throw Error('Popiš pozorovaný příznak.');
      const thawed=d.get('thawed')||'';
      if(base.source==='frozen'&&(!day||!clock))throw Error('U rozmrazené porce doplň přesný čas podání.');
      if(thawed&&(at<new Date(thawed).getTime()||at-new Date(thawed).getTime()>=24*3600000)&&!confirm('Časy podání a rozmrazení nejsou v doporučeném limitu 24 hodin. Porci už nenabízej. Chceš přesto zaznamenat, co se skutečně stalo?'))return;
      if(d.get('onset')&&new Date(d.get('onset'))>new Date())throw Error('Začátek příznaku nemůže být v budoucnu.');
      // Deník smí zachytit i historickou chybu skladování; nic neblokuje záznam skutečnosti.
      let note=d.get('note').trim();
      if(p&&p.source!=='frozen'&&at){const warning=batchWarning(state,p,at);if(warning.includes('už nenabízet')&&!confirm(warning+' Pokud zapisuješ, co už skutečně proběhlo, můžeš záznam uložit. Pokračovat?'))return;}
      const log={id:old?.id||uid(),date:day,time:clock,title:d.get('title').trim(),foods:ids,result:d.get('result'),amount:d.get('amount').slice(0,100),reaction:d.get('reaction'),onset:d.get('onset')||'',note,thawedAt:thawed,planId:old?.planId||p?.id||'',stockId:base.stockId||'',batchId:base.batchId||'',source:base.source||'other'};
      if(log.stockId&&!old){const stock=state.stock.find(x=>x.id===log.stockId);if(!stock||stock.usedBy)throw Error('Tato porce už byla použitá. Zapiš skutečné jídlo samostatně.');stock.usedBy=log.id;}
      if(old)state.logs[state.logs.findIndex(l=>l.id===old.id)]=log;else state.logs.push(log);
      write(state);render('diary');
    });
  }
  function diaryView() {
    const s=read(),logs=s.logs.slice().sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
    frame('diary',`<div class="p-toolbar">${button('Zapsat jídlo','id="p-add-log"')}</div><p class="small muted">Nezaznamenaná reakce neznamená potvrzenou toleranci. Při příznaku porovnej i jídla z předchozích dnů.</p>${logs.length?logs.map(l=>`<section class="p-panel"><p class="small muted">${showDate(l.date)} ${e(l.time)}</p><h2>${e(l.title)}</h2><p>${e(l.foods.map(id=>food(s,id).name).join(', '))}</p><p>${{offered:'Nabídnuto bez ochutnání',tasted:'Ochutnala',ate:'Jedla',unknown:'Nabídnuto, ochutnání neupřesněno'}[l.result]}${l.amount?' - '+e(l.amount):''}</p><p class="${l.reaction==='symptom'?'p-warning':'muted'}">${{unknown:'Reakce nezaznamenaná',none:'Bez pozorovaných příznaků',symptom:'Pozorovaný příznak'}[l.reaction]}${l.onset?' od '+showDate(l.onset)+' '+e(l.onset.slice(11,16)):''}</p>${l.note?`<p class="p-note">${e(l.note)}</p>`:''}${button('Upravit / doplnit reakci',`data-p-edit="${e(l.id)}"`)}</section>`).join(''):'<p>Zatím tu není žádná ochutnávka. Starší jídla můžeš doplnit i bez přesného data.</p>'}`);
    document.querySelector('#p-add-log').onclick=()=>logForm();document.querySelectorAll('[data-p-edit]').forEach(b=>b.onclick=()=>logForm('',b.dataset.pEdit));
  }
  function foodView() {
    const s=read();frame('foods',`<div class="p-toolbar"><input id="p-search" type="search" placeholder="Hledat potravinu" aria-label="Hledat potravinu"><select id="p-filter" aria-label="Filtr potravin"><option value="all">Všechny</option><option value="tried">Ochutnané</option><option value="new">Ještě neochutnané</option><option value="allergens">Alergeny</option><option value="symptom">Se záznamem příznaku</option></select></div><p class="small muted">Přehled vychází pouze z tohoto deníku. Jedna ochutnávka bez příznaků nepotvrzuje, že alergie nemůže nastat.</p><div id="p-food-list" class="p-week"></div><details class="p-panel"><summary>Přidat vlastní potravinu</summary><form id="p-food-form">${field('Název',text('name','',true))}${field('Alergen (pokud je)',text('allergen'))}<button class="btn">Přidat potravinu</button></form></details>`);
    const update=()=>{const q=document.querySelector('#p-search').value.toLocaleLowerCase('cs'),filter=document.querySelector('#p-filter').value;
      document.querySelector('#p-food-list').innerHTML=foods(s).filter(f=>f.name.toLocaleLowerCase('cs').includes(q)).map(f=>{const logs=s.logs.filter(l=>actual(l)&&l.foods.includes(f.id)),symptoms=s.logs.filter(l=>l.reaction==='symptom'&&l.foods.includes(f.id));if(filter==='tried'&&!logs.length||filter==='new'&&logs.length||filter==='allergens'&&!f.allergen||filter==='symptom'&&!symptoms.length)return '';const dates=logs.map(l=>l.date).filter(Boolean).sort();return `<section class="p-panel"><h2>${e(f.name)}</h2>${f.allergen?`<span class="p-tag">${e(f.allergen)}</span>`:''}<p>${logs.length?`Ochutnala ${logs.length}×${dates.length?' - poprvé doloženo '+showDate(dates[0])+', naposledy '+showDate(dates.at(-1)):'. Datum neznáme.'}`:'Zatím bez potvrzené ochutnávky'}</p>${symptoms.length?`<p class="p-warning">Příznak zaznamenán u ${symptoms.length} jídel s touto surovinou. Příčinu nelze určit z deníku.</p>`:''}${logs.length||symptoms.length?`<details><summary>Podání a poznámky</summary>${[...new Set([...logs,...symptoms])].map(l=>`<p>${showDate(l.date)} ${e(l.time)}: ${e(l.title)}${l.note?' - '+e(l.note):''}</p>`).join('')}</details>`:''}</section>`;}).join('')||'<p>Žádné odpovídající potraviny.</p>';};
    document.querySelector('#p-search').oninput=update;document.querySelector('#p-filter').onchange=update;update();
    document.querySelector('#p-food-form').onsubmit=run(ev=>{const d=new FormData(ev.target),state=read(),name=d.get('name').trim();if(!name)throw Error('Napiš název.');if(foods(state).some(f=>f.name.toLocaleLowerCase('cs')===name.toLocaleLowerCase('cs')))throw Error('Tato potravina už v přehledu je.');state.foods.push({id:'vlastni-'+uid(),name:name.slice(0,100),allergen:d.get('allergen').trim().slice(0,100)});write(state);render('foods');});
  }
  function recipesView() {
    const s=read();frame('recipes',`<div class="karty">${recipes.map(r=>`<section class="karta">${r.photo?`<img src="${r.photo}" alt="${e(r.name)}" loading="lazy">`:''}<h2>${e(r.name)}</h2><p>${e(r.foods.map(id=>food(s,id).name).join(', '))}</p>${flags(s,r.foods)}<p class="small muted">Zeleninu i ovoce připrav do měkka. Rozmixuj na vhodnou konzistenci, bez soli a cukru.</p>${button('Naplánovat na dva dny',`data-p-recipe="${r.id}"`)}</section>`).join('')}</div><p class="small muted">Plán a evidenci jsme inspirovali aplikací <a href="https://solidstarts.com/app/" target="_blank" rel="noopener">Solid Starts</a>. Jde o vlastní rodinný nástroj.</p>`);
    document.querySelectorAll('[data-p-recipe]').forEach(b=>b.onclick=()=>planForm(b.dataset.pRecipe));
  }
  function freezerView() {
    const s=read();frame('freezer',`<p class="small muted">Každá položka je jedna samostatná porce. V plánu ji vybereš přes „Jedna porce z mrazáku“.</p>${s.stock.filter(x=>!x.usedBy).map(x=>`<section class="p-panel"><h2>${e(x.title)}</h2><p>Připraveno ${showDate(x.preparedAt)}, zamrazeno ${showDate(x.frozenAt)}</p><p class="muted">${s.plans.some(p=>p.stockId===x.id)?'Rezervováno v plánu':'Volná porce'}</p></section>`).join('')||'<p>Mrazák zatím nemá žádné zapsané porce.</p>'}<details class="p-panel"><summary>Přidat porce do mrazáku</summary><form id="p-form"><div class="p-form-grid">${field('Recept',`<select name="recipe">${options()}</select>`)}${field('Název',text('title','',true))}${field('Skutečný čas přípravy',`<input name="prepared" type="datetime-local" required>`)}${field('Skutečný čas zamrazení',`<input name="frozen" type="datetime-local" value="${dtNow()}" required>`)}${field('Počet samostatných porcí',`<input name="count" type="number" min="1" max="30" value="1" required>`)}</div>${selections(s)}<p class="small muted">Zamrazení neobnovuje čerstvost starého jídla. Zapisuj správně zchlazené a oddělené porce.</p><button class="btn">Přidat porce</button></form></details>`);
    const f=document.querySelector('#p-form');wireRecipe(f);f.onsubmit=run(()=>{const state=read(),d=new FormData(f),ids=chosen(f),prepared=d.get('prepared'),frozen=d.get('frozen');if(!ids.length)throw Error('Vyber složení.');if(!d.get('title').trim())throw Error('Doplň název jídla.');if(new Date(frozen)>new Date()||new Date(prepared)>new Date(frozen))throw Error('Zkontroluj pořadí a čas přípravy a zmrazení.');if(new Date(frozen).getTime()>=expiry({preparedAt:prepared},ids))throw Error('V době zmrazení už uplynul limit pro tuto várku. Takovou porci neplánuj k podání.');for(let i=0;i<Number(d.get('count'));i++)state.stock.push({id:uid(),title:d.get('title').trim(),foods:ids.slice(),preparedAt:prepared,frozenAt:frozen,usedBy:''});write(state);render('freezer');});
  }
  function download(data,name,type='application/json') {const url=URL.createObjectURL(new Blob([data],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function merge(a,b) {
    validate(a);validate(b);const result=structuredClone(a);
    for(const k of ['foods','plans','batches','stock','logs']) for(const x of b[k]){const old=result[k].find(y=>y.id===x.id);if(old&&JSON.stringify(old)!==JSON.stringify(x))throw Error('Záloha má odlišnou verzi stejného záznamu. Nic se nezměnilo. Použij nejprve zálohu současného deníku a rozdíl zkontroluj.');if(!old){if(k==='plans'&&result.plans.some(p=>p.date===x.date))throw Error('Záloha obsahuje jiný plán pro stejný den. Nic se nezměnilo.');result[k].push(structuredClone(x));}}
    return validate(result);
  }
  function backupView() {
    const s=read();frame('backup',`<section class="p-panel"><h2>Deník zůstává u tebe</h2><p>Plán příkrmů, ochutnávky a reakce jsou jen v tomto prohlížeči. Na jiném telefonu se samy neobjeví. Vymazání dat prohlížeče nebo anonymní režim je může ztratit.</p><p>Záloha obsahuje soukromé záznamy. Ulož si ji bezpečně.</p><p>${s.logs.length} zápisů, ${s.plans.length} plánovaných jídel, ${s.stock.filter(x=>!x.usedBy).length} porcí v mrazáku.</p>${button(problem?'Stáhnout původní data':'Stáhnout zálohu','id="p-export"')}<hr>${field('Načíst zálohu (doplní chybějící záznamy)',`<input id="p-import" type="file" accept="application/json,.json" ${problem?'disabled':''}>`)}<p class="small muted">Import nic nemaže. Stejný záznam se nepřidá dvakrát. Při odlišných verzích téhož záznamu se import zastaví.</p><p id="p-import-status" role="status"></p><p class="small muted">Skladování a časové limity: <a href="https://www.nhs.uk/best-start-in-life/baby/weaning/safe-weaning/storing-and-reheating-food/" target="_blank" rel="noopener">NHS</a>. Zavádění alergenů a příznaky: <a href="https://www.nhs.uk/baby/weaning-and-feeding/food-allergies-in-babies-and-young-children/" target="_blank" rel="noopener">NHS</a>.</p></section>`);
    document.querySelector('#p-export').onclick=run(()=>download(problem?(localStorage.getItem(KEY)||''):JSON.stringify(read(),null,2),'molcuchyne-prikrmy-'+today()+'.json'));
    document.querySelector('#p-import').onchange=async ev=>{const file=ev.target.files[0];if(!file)return;try{if(file.size>10*1024*1024)throw Error('Záloha je příliš velká.');const imported=validate(JSON.parse(await file.text()));const merged=merge(read(),imported);write(merged);render('backup');document.querySelector('#p-import-status').textContent='Záloha načtená. Záznamy zůstaly zachované.';}catch(err){document.querySelector('#p-import-status').textContent='Import se neprovedl: '+err.message;}};
  }
  function render(tab='plan') {read();({plan:planView,foods:foodView,diary:diaryView,recipes:recipesView,freezer:freezerView,backup:backupView}[tab]||planView)();}
  return {render,dayCard,bindDayButtons,shopping,core:{empty,validate,merge,next,expiry,actual,tried,newFoods,read,write,recipes,catalog,localDate:iso,batchWarning}};
})();
