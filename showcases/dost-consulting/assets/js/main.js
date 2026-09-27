'use strict';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const content = window.DOST_CONTENT;
const markets = window.DOST_MARKETS;

// Navigation: a real multi-page site, with a short optional transition.
const menuButton = $('.menu-toggle');
const menu = $('#mobile-menu');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menu.classList.toggle('open', open);
  menu.inert = !open;
  document.body.classList.toggle('menu-open', open);
  $('#main').inert = open;
  $('.site-footer').inert = open;
  if (open) $('a', menu).focus();
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (menuButton.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') { setMenu(false); menuButton.focus(); }
  if (event.key === 'Tab') {
    const items = [menuButton, ...$$('a', menu)];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
matchMedia('(min-width: 951px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
const transition = $('.page-transition');
try {
  const arrival = sessionStorage.getItem('dost-transition');
  if (arrival && !reducedMotion) { transition.textContent = arrival; transition.classList.add('arrive'); sessionStorage.removeItem('dost-transition'); }
} catch (_) { /* Navigation works without storage. */ }
const transitionWords = {approach:'Understand',advisory:'Connect',expansion:'Explore','case-studies':'Consider',insights:'Think',about:'Believe',contact:'Begin',index:'DOST'};
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download') || reducedMotion) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !url.pathname.endsWith('.html') || (url.pathname === location.pathname && url.search === location.search)) return;
  event.preventDefault();
  const word = transitionWords[url.pathname.split('/').pop().replace('.html','')] || 'DOST';
  transition.textContent = word;
  transition.classList.remove('arrive');
  transition.classList.add('go');
  try { sessionStorage.setItem('dost-transition', word); } catch (_) {}
  setTimeout(() => { location.href = url.href; }, 330);
});
window.addEventListener('pageshow', event => { if (event.persisted) { transition.classList.remove('go','arrive'); setMenu(false); } });

// The same connected visual language supports three different questions.
const businessNodes = [
  ['Brand',22,26,'What should the market remember about you?'],
  ['Market',55,10,'Where does your offer have the strongest opportunity?'],
  ['Customer',85,27,'Who needs your offer enough to choose it?'],
  ['Digital',91,54,'Which digital experiences actually support revenue?'],
  ['Growth',72,78,'What makes customer acquisition repeatable?'],
  ['Expansion',34,83,'Does another jurisdiction improve the business?'],
  ['Operations',9,57,'Can the business deliver what the brand promises?']
];
const brandNodes = [
  ['Position',24,23,'Position makes your role in the market clear: who you serve, what you solve and why you matter.'],
  ['Customer',65,12,'Customer understanding determines which needs, expectations and alternatives the brand must address.'],
  ['Promise',89,39,'The promise names the value a customer should consistently receive. It must be credible and deliverable.'],
  ['Voice',79,74,'Voice expresses your point of view in language your customer understands and recognises.'],
  ['Experience',35,83,'Experience is the evidence: every interaction should support the promise, from discovery to delivery.'],
  ['Identity',10,51,'Identity makes the strategy recognisable through a coherent visual and verbal language.']
];
const advisoryDetails = {
  Brand: ['A position that guides the business.', ['Who is the offer for?','What should the market remember?','Which promise can the business prove?','How should that position shape pricing and experience?'], ['Brand & positioning','Digital experience','Commercial growth']],
  Market: ['An opportunity worth entering.', ['Where is demand?','Who already serves it?','How difficult is entry?','What changes in pricing?','What local expectations exist?','How does regulation affect the model?'], ['Market entry','Setup context','International expansion']],
  Customer: ['Understand the decision on the other side.', ['Who makes the buying decision?','What triggers the need?','Which alternatives compete for the same budget?','What evidence creates trust?'], ['Customer research','Offer strategy','Customer experience']],
  Digital: ['A presence with a commercial role.', ['What should the website help a customer do?','Where does intent get lost?','Which channels support the journey?','What information needs to reach the sales process?'], ['Digital & customer experience','Marketing & social','Sales foundation']],
  Revenue: ['A clear path from value to revenue.', ['How does attention become a qualified opportunity?','Is the offer easy to understand and buy?','What drives retention?','Which partnerships improve the economics?'], ['Commercial growth','Marketing & social','Offer design']],
  Expansion: ['Move because the model makes sense.', ['Which opportunity justifies the move?','What must change in the offer?','What will it cost to operate?','Which legal and tax questions need professional review?'], ['International expansion','Market entry','Operating model']],
  Operations: ['Make the promise deliverable.', ['Where is the business losing time or opportunities?','Who owns each customer handoff?','What needs to become repeatable?','Can capacity support the next stage?'], ['Operating model','Customer experience','Performance review']]
};
function renderAdvisory(label) {
  const detail = advisoryDetails[label];
  if (!detail || !$('#advisory-detail')) return;
  $('#advisory-detail').innerHTML = `<p class="eyebrow">The business through the lens of / ${label}</p><h3>${detail[0]}</h3><ul class="question-list">${detail[1].map(x=>`<li>${x}</li>`).join('')}</ul><div class="tags">${detail[2].map(x=>`<span>${x}</span>`).join('')}</div>`;
}
$$('[data-network]').forEach(network => {
  const kind = network.dataset.network;
  const nodes = kind === 'brand' ? brandNodes : businessNodes.map(x => [...x]);
  if (kind === 'advisory') nodes[4][0] = 'Revenue';
  const svg = $('svg',network);
  const lineGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
  nodes.forEach((node,index) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg','path');
    line.setAttribute('d',`M300 264 Q${300+(node[1]*6-300)*.35} ${264+(node[2]*5.5-264)*.8} ${node[1]*6} ${node[2]*5.5}`);
    line.setAttribute('class','connection');
    line.dataset.connection = index;
    lineGroup.appendChild(line);
    const button = document.createElement('button');
    button.className = 'network-node';
    button.style.setProperty('--x',node[1]+'%');
    button.style.setProperty('--y',node[2]+'%');
    button.textContent = node[0].toUpperCase();
    button.setAttribute('aria-pressed','false');
    const activate = () => {
      $$('.network-node',network).forEach(b => { b.classList.toggle('active',b===button); b.setAttribute('aria-pressed',String(b===button)); });
      $$('.connection',network).forEach((l,i)=>l.classList.toggle('active',i===index));
      $('.network-note',network).textContent = kind==='brand' ? `${node[0]} / One part of the whole.` : node[3];
      if (kind === 'brand') $('#brand-description').textContent = node[3];
      if (kind === 'advisory') renderAdvisory(node[0]);
    };
    button.addEventListener('click',activate);
    button.addEventListener('focus',activate);
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse') activate();});
    network.appendChild(button);
  });
  svg.prepend(lineGroup);
  if (kind === 'advisory') $$('.network-node',network)[1].click();
  if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
    let frame;
    network.addEventListener('pointermove',event=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{const r=network.getBoundingClientRect(); network.style.setProperty('--shift-x',((event.clientX-r.left)/r.width-.5)*8+'px'); network.style.setProperty('--shift-y',((event.clientY-r.top)/r.height-.5)*8+'px');});
    });
    network.addEventListener('pointerleave',()=>{network.style.setProperty('--shift-x','0px');network.style.setProperty('--shift-y','0px');});
  }
});

if ($('#home-method')) $('#home-method').innerHTML = content.phases.map((p,i)=>`<a class="method-row" data-method="${i}" href="approach.html#phase-${i+1}"><span class="num">0${i+1}</span><div><h3>${p.name}</h3><p>${p.line}</p></div><span class="arrow">↗</span></a>`).join('');
if ($('#phases')) $('#phases').innerHTML = content.phases.map((p,i)=>`<article class="phase" id="phase-${i+1}"><span class="serif">0${i+1}</span><div><h2>${p.name}</h2><p class="result">THE OUTCOME / ${p.result}</p></div><div><p>${p.copy}</p><ul>${p.items.map(x=>`<li>${x}</li>`).join('')}</ul></div></article>`).join('');

// IntersectionObserver drives scroll storytelling without a scroll-event loop.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
  $$('.reveal').forEach(el=>revealObserver.observe(el));
  const decisionObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
    if (!entry.isIntersecting) return;
    const el = entry.target, index=Number(el.dataset.index);
    $$('.decision-step').forEach(x=>x.classList.toggle('active',x===el));
    $('#decision-index').textContent=String(index+1).padStart(2,'0');
    $('#decision-title').textContent=el.dataset.title;
    $('#decision-caption').textContent=el.dataset.caption;
    $$('.decision-track i').forEach((x,i)=>x.classList.toggle('on',i<=index));
  }),{rootMargin:'-20% 0px -40% 0px',threshold:0});
  $$('.decision-step').forEach(el=>decisionObserver.observe(el));
  const methodObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('.method-row').forEach(x=>x.classList.toggle('active',x===entry.target));$('#method-number').textContent=String(Number(entry.target.dataset.method)+1).padStart(2,'0');const orb=$('.method-orb');orb.style.transform=`rotate(${Number(entry.target.dataset.method)*12}deg)`;}}),{rootMargin:'-35% 0px -40% 0px'});
  $$('.method-row').forEach(el=>methodObserver.observe(el));
} else $$('.reveal').forEach(el=>el.classList.add('visible'));

if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
  const cursor=$('.custom-cursor');
  let cursorFrame;
  document.addEventListener('pointermove',event=>{
    cancelAnimationFrame(cursorFrame);
    cursorFrame=requestAnimationFrame(()=>{cursor.style.left=event.clientX+'px';cursor.style.top=event.clientY+'px';const target=event.target.closest('[data-cursor]');cursor.classList.toggle('visible',Boolean(target));if(target)cursor.textContent=target.dataset.cursor;});
  });
  document.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));
}

// Business Compass: explicit deterministic rules, never an AI claim.
const compassQuestions = [
  {key:'stage',title:'What stage are you at?',options:['Idea','Launching','Operating','Growing','Expanding Internationally']},
  {key:'unclear',title:'What is currently unclear?',options:['Brand','Customer Acquisition','Digital Presence','Market','Growth','International Expansion']},
  {key:'market',title:'Where do you currently operate?',options:['UAE','Azerbaijan','Europe','Other']},
  {key:'objective',title:'What is your next objective?',options:['Launch','Reposition','Acquire customers','Enter another market','Improve profitability','Build a stronger digital presence']},
  {key:'size',title:'What is your company size?',options:['Solo / Founder','2–10','11–50','50+']}
];
function compassRecommendation(a) {
  let priority, path, why;
  if (a.objective==='Enter another market'||a.unclear==='International Expansion'||a.stage==='Expanding Internationally') {
    priority='Market readiness + entry direction'; path=['Understand','Position','Enter']; why='An expansion decision needs customer evidence, a transferable position and a realistic operating model before structural commitments.';
  } else if(a.stage==='Idea'||a.stage==='Launching'||a.objective==='Launch'||a.unclear==='Market') {
    priority='Positioning + market validation'; path=['Understand','Position','Build']; why='A launch or an unclear market calls for evidence of customer demand and a precise offer before investing in a full business presence.';
  } else if(a.objective==='Improve profitability') {
    priority='Commercial diagnosis + performance'; path=['Understand','Optimize']; why='Profitability calls for a review of offer economics, conversion and operational friction before adding more acquisition spend.';
  } else if(a.unclear==='Brand'||a.objective==='Reposition') {
    priority='Customer clarity + positioning'; path=['Understand','Position','Build']; why='A clearer position should shape the offer, language and customer experience before the business amplifies its message.';
  } else if(a.unclear==='Digital Presence'||a.objective==='Build a stronger digital presence') {
    priority='Digital journey + commercial purpose'; path=['Understand','Build','Grow']; why='A digital presence needs a clear role in the buyer journey and a deliberate handoff from attention to qualified conversation.';
  } else {
    priority='Acquisition + a repeatable growth system'; path=['Understand','Grow','Optimize']; why='Connect the customer, channel and sales process, then measure where opportunities are gained or lost.';
  }
  const marketNote = a.market==='UAE' ? 'Validate the actual buyer segment within the UAE; a local base is not proof of demand.' : a.market==='Europe' ? 'Treat Europe as multiple buyer contexts; identify the actual countries, languages and sales requirements.' : a.market==='Azerbaijan' ? 'Use evidence from your Azerbaijan customer base to test which parts of the offer can travel.' : 'Define the present customer geography before narrowing any market shortlist.';
  const sizeNote = a.size==='Solo / Founder' ? 'For a founder-led business, choose one priority and a small validation step before adding delivery complexity.' : a.size==='2–10' ? 'With a small team, assign one owner to each customer handoff and protect capacity for delivery.' : a.size==='11–50' ? 'With a growing team, align decision owners, channel measures and operating responsibilities.' : 'For a larger team, establish shared decision criteria across functions before scaling the initiative.';
  return {priority,path,why,marketNote,sizeNote};
}
window.DOST_COMPASS_RECOMMEND = compassRecommendation;
if ($('#compass-tool')) {
  const root=$('#compass-tool'), answers={};let step=0;
  function render(focus=false) {
    const q=compassQuestions[step];
    root.innerHTML=`<p class="eyebrow">Business Compass / ${String(step+1).padStart(2,'0')} of 05</p><div class="tool-progress" aria-hidden="true">${compassQuestions.map((_,i)=>`<span class="${i<=step?'done':''}"></span>`).join('')}</div><div class="tool-step"><h3 tabindex="-1">${q.title}</h3><p>Choose the answer that best reflects the business today.</p><div class="choices" role="group" aria-label="${q.title}">${q.options.map(x=>`<button class="choice ${answers[q.key]===x?'selected':''}" aria-pressed="${answers[q.key]===x}" data-value="${esc(x)}">${x}</button>`).join('')}</div><p class="tool-status" role="status"></p><div class="tool-controls"><button class="tool-back" ${step===0?'disabled':''}>← Back</button><button class="btn next">${step===4?'Find my direction':'Continue'} <span>↗</span></button></div></div>`;
    $$('.choice',root).forEach(button=>button.addEventListener('click',()=>{answers[q.key]=button.dataset.value;$$('.choice',root).forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});$('.tool-status',root).textContent='';}));
    $('.tool-back',root).addEventListener('click',()=>{step--;render(true);});
    $('.next',root).addEventListener('click',()=>{if(!answers[q.key]){$('.tool-status',root).textContent='Choose an answer to continue.';return;}if(step<4){step++;render(true);}else showResult();});
    if(focus){$('h3',root).focus({preventScroll:true});if(root.getBoundingClientRect().top<0)root.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});}
  }
  function showResult(){
    const r=compassRecommendation(answers);
    root.innerHTML=`<div class="tool-result"><p class="eyebrow">Your starting direction</p><h3 tabindex="-1">${r.priority}</h3><p>${r.why}</p><div class="flow">${r.path.map((x,i)=>`${i?'<i>→</i>':''}<span>${x.toUpperCase()}</span>`).join('')}</div><p>${r.marketNote}</p><p>${r.sizeNote}</p><div class="actions"><a class="btn" href="contact.html?focus=${encodeURIComponent(r.priority)}">Discuss this direction ↗</a><button class="text-link restart">Start again ↺</button></div><p class="result-meta">Based on: ${Object.values(answers).map(esc).join(' · ')}<br>This is a structured starting point, not a diagnosis or professional recommendation. Your next conversation can challenge it.</p></div>`;
    $('.restart',root).addEventListener('click',()=>{Object.keys(answers).forEach(k=>delete answers[k]);step=0;render(true);});
    $('h3',root).focus({preventScroll:true});
  }
  render();
}

// Sourced market information is maintained exclusively in assets/data/markets.js.
function sourceMarkup(m, includeBusiness=false) {
  return `<span class="source">${esc(m.name)} · Last reviewed ${m.lastReviewed}<br>Official source: ${esc(m.taxAuthority)} · <a href="${m.taxSource}" target="_blank" rel="noopener noreferrer">View source ↗</a>${m.extraSource?` · <a href="${m.extraSource}" target="_blank" rel="noopener noreferrer">Free-zone context ↗</a>`:''}${includeBusiness?`<br>Business reference: <a href="${m.businessSource}" target="_blank" rel="noopener noreferrer">${m.businessAuthority} ↗</a>`:''}</span>`;
}
if ($('#market-atlas')) {
  const entries=Object.entries(markets);
  $('#market-atlas').insertAdjacentHTML('beforeend',entries.map(([key,m])=>`<button class="market-pin" style="--x:${m.x}%;--y:${m.y}%" data-market="${key}" data-cursor="EXPLORE" aria-pressed="false">${m.code}</button>`).join(''));
  $('#market-tabs').innerHTML=entries.map(([key,m])=>`<button data-market="${key}" aria-pressed="false">${m.name}</button>`).join('');
  function chooseMarket(key){
    const m=markets[key];
    $$('[data-market]').forEach(button=>{const selected=button.dataset.market===key;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});
    $('#market-snapshot').innerHTML=`<p class="eyebrow">Strategic snapshot / ${m.code}</p><h3>${m.name}</h3><dl class="snapshot-list"><dt>Corporate tax context</dt><dd>${m.tax}${sourceMarkup(m)}</dd><dt>Business setup & operating environment</dt><dd>${m.setup} ${m.operations}</dd><dt>Customer access & connectivity</dt><dd>${m.access} ${m.international}</dd><dt>Residency considerations</dt><dd>${m.residency}</dd><dt>Business models to investigate</dt><dd>${m.fit}</dd></dl><span class="source">Business dimensions are investigation prompts.<br>Official reference: <a href="${m.businessSource}" target="_blank" rel="noopener noreferrer">${m.businessAuthority} ↗</a></span>`;
  }
  $$('[data-market]').forEach(button=>button.addEventListener('click',()=>chooseMarket(button.dataset.market)));
  chooseMarket('uae');
  ['market-a','market-b'].forEach(id=>$('#'+id).innerHTML=entries.map(([key,m])=>`<option value="${key}">${m.name}</option>`).join(''));
  $('#market-a').value='uae';$('#market-b').value='estonia';
  function compare(changed){
    const a=$('#market-a'), b=$('#market-b');
    if(a.value===b.value){const other=changed==='market-a'?b:a;other.value=entries.find(([key])=>key!==a.value)[0];}
    const m1=markets[a.value],m2=markets[b.value];
    const dimensions=[['Corporate tax context','tax'],['Business setup','setup'],['Target market access','access'],['Operating environment','operations'],['Founder residency context','residency'],['Digital business suitability','digital'],['Local market','local'],['International positioning','international']];
    $('#comparison').innerHTML=`<table class="compare-table"><caption class="sr-only">Strategic comparison of ${m1.name} and ${m2.name}. No overall ranking.</caption><thead><tr><th scope="col">Dimension</th><th scope="col">${m1.name}</th><th scope="col">${m2.name}</th></tr></thead><tbody>${dimensions.map(([label,key])=>`<tr><th scope="row">${label}</th><td>${m1[key]}${key==='tax'?sourceMarkup(m1,true):''}</td><td>${m2[key]}${key==='tax'?sourceMarkup(m2,true):''}</td></tr>`).join('')}</tbody></table>`;
  }
  ['market-a','market-b'].forEach(id=>$('#'+id).addEventListener('change',()=>compare(id)));compare();
  const businessFactors={
    'Software Company':'Map IP ownership, development-team location, subscription contracting, payment access and data obligations.',
    'Consulting Business':'Map where advice is delivered, client procurement needs, professional permissions and the founder’s actual working location.',
    'E-commerce Brand':'Model landed product cost, fulfilment, returns, consumer obligations, product permissions and indirect-tax review.',
    'Creative Agency':'Check client contracting, intellectual-property assignments, contractor relationships and cross-border delivery costs.',
    'Trading Company':'Investigate product classification, customs, import/export permissions, inventory finance and logistics.',
    'Service Business':'Check local licensing, staffing, service delivery capacity, customer support and recurring demand.'
  };
  const customerFactors={Local:'Name the actual local market. Interview prospective buyers and test the offer against their current alternatives.',GCC:'Assess each GCC destination separately: local procurement, distribution, service expectations and ability to contract.',Europe:'Select specific European markets; review language, buyer access, cross-border fulfilment and applicable data and consumer rules.',Global:'Map the main customer concentrations. Review contracts, payment coverage and where activity could create local obligations.'};
  const priorityFactors={'Market access':'Test the route to a real buyer: channel partners, procurement requirements, a pilot and a credible sales cycle.',Cost:'Build a full annual operating budget, including renewals, people, compliance, travel, banking and delivery.',Residency:'Separate company ownership from the founder’s residence and work permissions; verify an eligible route with a qualified professional.','Tax environment':'Commission a fact-specific review covering residence, management, source of income, permanent establishments, distributions and relevant taxes.',Reputation:'Interview target buyers about the evidence, references and operating presence they need to trust the offer.','Investor access':'Investigate likely investors’ entity preferences, governance expectations, fundraising stage and access to a relevant network.'};
  function scenario(){const b=$('#scenario-business').value,c=$('#scenario-customers').value,p=$('#scenario-priority').value;$('#scenario-result').innerHTML=`<p class="eyebrow">Factors to investigate / ${b}</p><h3>A decision brief, not a destination.</h3><ol><li>${businessFactors[b]}</li><li>${customerFactors[c]}</li><li>${priorityFactors[p]}</li><li>Define a small validation step, a spending limit and the evidence needed before committing to a jurisdiction.</li></ol><a class="text-link" href="contact.html?focus=${encodeURIComponent(b+' / '+c+' customers / '+p)}">Bring this scenario to a conversation ↗</a>`;}
  $$('.scenario-fields select').forEach(select=>select.addEventListener('change',scenario));scenario();
}

// Fictional cases and complete editorial articles.
if ($('#case-story')) {
  function showCase(index){
    const c=content.cases[index];
    $$('[data-case]').forEach(button=>{button.classList.toggle('active',Number(button.dataset.case)===index);button.setAttribute('aria-pressed',String(Number(button.dataset.case)===index));});
    $('#case-story').innerHTML=`<div class="case-story">${window.DOST_ART[index]}<article class="case-content"><p class="eyebrow">Fictional strategy scenario / ${c.sector}</p><h2>${c.title}</h2>${[['Before','before'],['Decision','decision'],['Strategy','strategy'],['System','system'],['Next move','next']].map(([label,key])=>`<div class="story-step"><h4>${label}</h4><p>${c[key]}</p></div>`).join('')}<p class="result-meta">${c.outcome}<br>A fictional demonstration of the method. No real engagement or measured outcome is implied.</p><div class="actions"><a class="btn" href="contact.html?focus=${encodeURIComponent(c.label)}">Discuss a similar decision ↗</a></div></article></div>`;
    const url=new URL(location.href);url.searchParams.set('case',String(index));history.replaceState(null,'',url);
  }
  $$('[data-case]').forEach(button=>button.addEventListener('click',()=>showCase(Number(button.dataset.case))));
  const initial=Number(new URLSearchParams(location.search).get('case')||0);showCase(Number.isInteger(initial)&&initial>=0&&initial<content.cases.length?initial:0);
}
if ($('#article-list')) {
  $('#article-list').innerHTML=content.insights.slice(1).map(a=>`<button class="insight-row" data-article="${a.id}" data-cursor="READ"><span class="eyebrow">${a.category}<br>${a.read}</span><h3>${a.title}</h3><span class="arrow">↗</span></button>`).join('');
  const dialog=$('#article-dialog');
  let articleTrigger;
  function openArticle(id,trigger){
    const a=content.insights.find(x=>x.id===id);if(!a)return;
    articleTrigger=trigger;
    $('#article-content').innerHTML=`<p class="eyebrow">DOST Perspective / ${a.category} / ${a.read}</p><h2 id="article-title">${a.title}</h2><p style="color:var(--ink)">${a.intro}</p>${a.sections.map(([h,p])=>`<h3>${h}</h3><p>${p}</p>`).join('')}<div class="actions"><a class="text-link" href="contact.html">Bring your question to DOST ↗</a></div><p class="disclaimer">An editorial perspective from this showcase concept. Legal, tax and regulated matters require verification with qualified professionals.</p>`;
    if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
    const url=new URL(location.href);url.searchParams.set('article',id);history.replaceState(null,'',url);
  }
  $$('[data-article]').forEach(button=>button.addEventListener('click',()=>openArticle(button.dataset.article,button)));
  $('.article-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{const url=new URL(location.href);url.searchParams.delete('article');history.replaceState(null,'',url);if(articleTrigger)articleTrigger.focus();});
  const articleId=new URLSearchParams(location.search).get('article');if(articleId)openArticle(articleId);
}

// Consultation brief. In-memory only: personal information never enters storage or URLs.
if ($('#brief-tool')) {
  const questions=[
    {key:'building',title:'What are you building?',options:['New Business','Existing Business','New Brand','Expansion','Repositioning','Other']},
    {key:'market',title:'Where are you currently operating?',options:['UAE','Azerbaijan','Europe','Other']},
    {key:'decision',title:'What decision are you trying to make?',options:['Position the brand','Enter a new market','Improve digital presence','Improve marketing','Grow sales','Choose business jurisdiction','Clarify strategy','Other']},
    {key:'barriers',title:'What is holding the business back?',multi:true,options:['Unclear positioning','Not enough customers','Weak digital presence','Market uncertainty','Limited capacity','Unclear economics','Too many priorities','Not sure yet']},
    {key:'stage',title:'What stage is the business at?',options:['Idea','Pre-launch','Operating','Growth','Expansion']},
    {key:'revenue',title:'Approximate annual revenue?',optional:true,options:['Pre-revenue','Under USD 100,000','USD 100,000–500,000','USD 500,000–1 million','USD 1–5 million','Over USD 5 million','Prefer not to say']},
    {key:'consultation',title:'What kind of conversation would help?',options:['Strategic Review','Brand & Market Review','Expansion Review','Full Business Advisory','Not Sure']},
    {key:'contact',title:'Who is behind the business?'}
  ];
  const answers={barriers:[],contact:{name:'',email:'',company:'',notes:''}};
  const context=new URLSearchParams(location.search).get('focus');
  let step=0;
  const root=$('#brief-tool');
  function potentialFocus(){const d=answers.decision||'';if(/market|jurisdiction/i.test(d)||answers.stage==='Expansion')return 'Market entry · Positioning · Operating model';if(/brand/i.test(d))return 'Customer · Positioning · Brand system';if(/digital/i.test(d))return 'Customer journey · Digital presence · Conversion';if(/marketing|sales/i.test(d))return 'Positioning · Acquisition · Sales process';return answers.building==='New Business'?'Validation · Positioning · Business foundation':'Business diagnosis · Prioritisation';}
  function live(){const rows=[['Business stage',answers.stage||'Taking shape'],['Primary question',answers.decision||'To be defined'],['Current market',answers.market||'To be defined'],['Potential focus',potentialFocus()]];$('#live-summary').innerHTML=rows.map(([k,v])=>`<div class="summary-line"><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');}
  function render(focus=false){
    const q=questions[step];
    root.innerHTML=`<p class="eyebrow">Consultation brief / ${String(step+1).padStart(2,'0')} of 08</p><div class="tool-progress" aria-hidden="true">${questions.map((_,i)=>`<span class="${i<=step?'done':''}"></span>`).join('')}</div><div class="tool-step"><h3 tabindex="-1">${q.title}</h3><p>${q.key==='contact'?'Name and email are required to label your downloadable brief. Nothing will be submitted.':q.multi?'Select all that apply.':q.optional?'Optional. You can skip this question.':'Choose the closest answer.'}</p>${step===0&&context?`<p class="result-meta">Starting direction: ${esc(context.slice(0,250))}</p>`:''}${q.options?`<div class="choices" role="group" aria-label="${esc(q.title)}">${q.options.map(x=>{const selected=q.multi?answers[q.key].includes(x):answers[q.key]===x;return `<button type="button" class="choice ${selected?'selected':''}" aria-pressed="${selected}" data-value="${esc(x)}">${x}</button>`;}).join('')}</div>`:`<form id="contact-details" class="contact-fields"><div class="field"><label for="brief-name">Your name *</label><input id="brief-name" name="name" autocomplete="name" required maxlength="120" value="${esc(answers.contact.name)}"></div><div class="field"><label for="brief-email">Email address *</label><input id="brief-email" name="email" type="email" autocomplete="email" required maxlength="180" value="${esc(answers.contact.email)}"></div><div class="field full"><label for="brief-company">Company / project (optional)</label><input id="brief-company" name="company" autocomplete="organization" maxlength="180" value="${esc(answers.contact.company)}"></div><div class="field full"><label for="brief-notes">Anything else we should understand? (optional)</label><textarea id="brief-notes" name="notes" rows="3" maxlength="2000">${esc(answers.contact.notes)}</textarea></div><button type="submit" class="sr-only" tabindex="-1">Create brief</button></form>`}<p class="tool-status" role="status"></p><div class="tool-controls"><button class="tool-back" ${step===0?'disabled':''}>← Back</button><button class="btn next">${step===7?'Create my brief':q.optional?'Continue / skip':'Continue'} <span>↗</span></button></div></div>`;
    $$('.choice',root).forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.value;if(q.multi){if(answers[q.key].includes(value))answers[q.key]=answers[q.key].filter(x=>x!==value);else answers[q.key].push(value);}else answers[q.key]=value;$$('.choice',root).forEach(b=>{const on=q.multi?answers[q.key].includes(b.dataset.value):answers[q.key]===b.dataset.value;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});$('.tool-status',root).textContent='';live();}));
    const form=$('#contact-details');
    if(form){form.addEventListener('input',()=>{$$('input,textarea',form).forEach(input=>answers.contact[input.name]=input.value);});form.addEventListener('submit',event=>{event.preventDefault();next();});}
    $('.tool-back',root).addEventListener('click',()=>{step--;render(true);});
    $('.next',root).addEventListener('click',next);
    function next(){
      if(q.key==='contact'){if(!form.reportValidity())return;if(!answers.contact.name.trim()){$('.tool-status',root).textContent='Please enter your name.';$('#brief-name').focus();return;}ready();return;}
      if(!q.optional&&(!answers[q.key]||(q.multi&&!answers[q.key].length))){$('.tool-status',root).textContent=q.multi?'Choose at least one area to continue.':'Choose an answer to continue.';return;}
      if(q.optional&&!answers[q.key])answers[q.key]='Prefer not to say';step++;render(true);live();
    }
    if(focus){$('h3',root).focus({preventScroll:true});if(root.getBoundingClientRect().top<0)root.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});}
  }
  function ready(){
    const rows=questions.filter(q=>q.options).map(q=>[q.title,Array.isArray(answers[q.key])?answers[q.key].join(', '):answers[q.key]]);
    rows.push(['Potential focus',potentialFocus()],['Name',answers.contact.name],['Email',answers.contact.email]);
    if(answers.contact.company)rows.push(['Company / project',answers.contact.company]);
    if(context)rows.push(['Starting direction',context.slice(0,250)]);
    if(answers.contact.notes)rows.push(['Additional context',answers.contact.notes]);
    $('#brief-layout').innerHTML=`<section class="brief-ready"><p class="eyebrow"><span class="dot"></span> Your brief is ready</p><h2 tabindex="-1">A clearer beginning.<br><em>Your next conversation.</em></h2><p>Review your strategic summary and save a copy. This showcase has no submission service: your brief has not been sent and no consultation has been booked.</p><dl>${rows.map(([k,v])=>`<div class="summary-line"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><div class="actions"><button class="btn" id="download-brief">Download your brief ↓</button><button class="text-link" id="edit-brief">Review answers ↺</button></div><p class="disclaimer">Personal information is held only in this page’s memory and is cleared when the page is reloaded or closed. The downloaded copy remains wherever you save it.</p></section>`;
    $('#download-brief').addEventListener('click',()=>{const text='DOST CONSULTING — CONSULTATION BRIEF\nDubai, United Arab Emirates\n\n'+rows.map(([k,v])=>k.toUpperCase()+'\n'+v).join('\n\n')+'\n\nShowcase concept. Not submitted. No consultation booked.\nPotential focus is a discussion starting point, not a diagnosis.\n';const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='DOST-consultation-brief.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    $('#edit-brief').addEventListener('click',()=>{
      $('#brief-layout').innerHTML='';
      $('#brief-layout').appendChild(root);
      const summary=document.createElement('aside');summary.className='brief-summary';summary.setAttribute('aria-label','Live strategy summary');summary.innerHTML='<p class="eyebrow">Your direction, taking shape</p><h3>One business.<br>A clearer picture.</h3><dl id="live-summary" aria-live="polite"></dl><p>Nothing is submitted. Your answers remain in this page only.</p>';$('#brief-layout').appendChild(summary);step=0;render(true);live();
    });
    $('.brief-ready h2').focus({preventScroll:true});$('.brief-ready').scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});
  }
  render();live();
}

// Resolve dynamic phase anchors after their content has been inserted.
if(location.hash.startsWith('#phase-')) requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
