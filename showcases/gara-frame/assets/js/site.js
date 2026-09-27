/* GARA FRAME — dependency-free progressive enhancement. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 800px)');
  const base = document.body.dataset.base || '';
  const imagePath = name => `${base}assets/images/${name}.jpg`;
  const storage = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be unavailable in private browsing. */ } }
  };
  let toastTimer;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 4500);
  }
  function downloadText(text, filename) {
    const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Native dialogs provide modal focus containment and restore focus on close.
  const menu = $('#menu-dialog');
  const menuButton = $('.menu-toggle');
  menuButton?.addEventListener('click', () => {
    menu.showModal(); document.body.classList.add('locked'); menuButton.setAttribute('aria-expanded', 'true');
  });
  function closeMenu(){menu.close();document.body.classList.remove('locked');menuButton.setAttribute('aria-expanded','false');}
  $('.menu-close')?.addEventListener('click', closeMenu);
  menu?.addEventListener('cancel',e=>{e.preventDefault();closeMenu();});
  menu?.addEventListener('close', () => { document.body.classList.remove('locked'); menuButton.setAttribute('aria-expanded', 'false'); });

  const transition = $('.page-transition');
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (!['http:', 'https:', 'file:'].includes(url.protocol) || url.origin !== location.origin || !url.pathname.endsWith('.html')) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    if (reduced.matches) return;
    e.preventDefault();
    if (menu?.open) menu.close();
    transition.classList.add('leaving');
    setTimeout(() => location.assign(url.href), 390);
  });
  window.addEventListener('pageshow', () => { transition?.classList.remove('leaving'); document.body.classList.remove('locked'); });

  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.06, rootMargin:'0px 0px -25px 0px'});
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));

  // One animation frame per scroll event, with transforms only for photo motion.
  const progress = $('.progress i');
  const stack = $('.photo-stack-section');
  const prints = $$('.printed-photo');
  const stackCaption = $('.stack-current');
  const film = $('.film-section');
  const filmTrack = $('.film-track');
  const floating = $$('.float-image');
  let scrollPending = false, currentStack = -1;
  const clamp = (n,min=0,max=1) => Math.min(max,Math.max(min,n));
  function drawScroll() {
    scrollPending = false;
    const vh = innerHeight;
    const height = document.documentElement.scrollHeight - vh;
    if (progress) progress.style.transform = `scaleY(${height > 0 ? scrollY / height : 0})`;
    if (reduced.matches) return;
    if (stack) {
      const rect = stack.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const p = clamp(-rect.top / Math.max(1,rect.height-vh));
        prints.forEach((el,i) => {
          const phase = i === 0 ? 0 : clamp(p * 3.5 - (3-i));
          const direction = i%2 ? 1 : -1;
          const distance = mobile.matches ? 220 : 510;
          el.style.transform = `translate(${phase * direction * distance}px, ${phase * -60}px) rotate(${[ -8,5,-3,2 ][i] + phase * direction * 9}deg)`;
          el.style.opacity = String(1-clamp((phase-.65)/.35));
        });
        const index = Math.max(0, 3-Math.min(3,Math.floor(p*3.5)));
        if (index !== currentStack && stackCaption) {
          currentStack = index;
          $('small', stackCaption).textContent = `0${index+1} / A FEW THINGS WORTH KEEPING`;
          $('span', stackCaption).textContent = prints[index].dataset.title;
        }
      }
    }
    if (film && !mobile.matches) {
      const rect = film.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const p = clamp(-rect.top / Math.max(1,rect.height-vh));
        filmTrack.style.transform = `translateX(${-p * Math.max(0,filmTrack.scrollWidth-innerWidth)}px)`;
      }
    }
    if (!mobile.matches) floating.forEach((el,i) => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) el.style.transform = `translateY(${(rect.top / vh) * [50,-45,70,-55][i]}px)`;
    });
  }
  window.addEventListener('scroll', () => { if (!scrollPending) { requestAnimationFrame(drawScroll); scrollPending = true; } }, {passive:true});
  window.addEventListener('resize', drawScroll, {passive:true});
  drawScroll();

  // The desktop contact strip can also be gently scrubbed by dragging.
  if(filmTrack){
    let drag=null;
    filmTrack.addEventListener('dragstart',e=>e.preventDefault());
    filmTrack.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='mouse'||mobile.matches||reduced.matches)return;
      drag={x:e.clientX,scroll:scrollY};filmTrack.setPointerCapture(e.pointerId);
    });
    filmTrack.addEventListener('pointermove',e=>{
      if(!drag)return;
      const travel=Math.max(1,filmTrack.scrollWidth-innerWidth);
      const distance=Math.max(1,film.offsetHeight-innerHeight);
      window.scrollTo({top:drag.scroll+(drag.x-e.clientX)*distance/travel,behavior:'instant'});
    });
    const endDrag=()=>drag=null;
    filmTrack.addEventListener('pointerup',endDrag);filmTrack.addEventListener('pointercancel',endDrag);filmTrack.addEventListener('lostpointercapture',endDrag);
  }

  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced.matches) {
    const cursor = $('.cursor');
    let cx=0,cy=0,cursorPending=false;
    document.addEventListener('pointermove', e => {
      cx=e.clientX;cy=e.clientY;
      document.body.classList.add('cursor-ready');
      if (!cursorPending) { cursorPending=true;requestAnimationFrame(() => {cursor.style.left=`${cx}px`;cursor.style.top=`${cy}px`;cursorPending=false;}); }
    }, {passive:true});
    document.addEventListener('pointerover', e => {
      const target = e.target.closest('[data-cursor]');
      cursor.textContent = target?.dataset.cursor || '';
      cursor.classList.toggle('active', Boolean(target));
    });
    document.documentElement.addEventListener('pointerleave', () => document.body.classList.remove('cursor-ready'));
  }

  const preview = $('.category-preview img');
  $$('.category-list a').forEach(a => {
    const change = () => { if(preview) {preview.src=imagePath(a.dataset.image);preview.srcset='';preview.alt=a.dataset.alt;$('#category-caption').textContent=a.dataset.label;} };
    a.addEventListener('pointerenter',change);a.addEventListener('focus',change);
  });
  $$('.sheet-thumbs button').forEach(button => {
    const select = () => {
      const img=$('.sheet-main img');img.src=imagePath(button.dataset.image);img.srcset='';img.alt=$('img',button).alt;
      $$('.sheet-thumbs button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    };
    button.addEventListener('pointerenter',select);button.addEventListener('focus',select);button.addEventListener('click',select);
  });

  // Portfolio filters preserve each complete event story.
  const portfolio = $('.portfolio-list');
  function filterStories(category) {
    if (!portfolio) return;
    const valid = ['all','forums','events','ceremonies'].includes(category) ? category : 'all';
    $$('.filter').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===valid)));
    let count=0;
    $$('.story',portfolio).forEach(story=>{story.hidden=valid!=='all'&&story.dataset.category!==valid;if(!story.hidden)count++;});
    portfolio.classList.toggle('is-filtered',valid!=='all');
    $('.filter-count').textContent=`0${count} STORIES`;
  }
  $$('.filter').forEach(b=>b.addEventListener('click',()=>{filterStories(b.dataset.filter);const url=new URL(location.href);if(b.dataset.filter==='all')url.searchParams.delete('category');else url.searchParams.set('category',b.dataset.filter);try{history.replaceState(null,'',url);}catch{}}));
  filterStories(new URLSearchParams(location.search).get('category')||'all');

  // Shared, keyboard- and touch-accessible full screen viewer.
  const viewer=$('#lightbox');
  let viewerItems=[],viewerIndex=0,slideTimer=null,touchX=null;
  function renderViewer() {
    const item=viewerItems[viewerIndex];if(!item)return;
    const image=$('.lightbox-image',viewer);image.src=item.src;image.alt=item.alt;
    $('.lightbox-counter',viewer).textContent=`${String(viewerIndex+1).padStart(2,'0')} / ${String(viewerItems.length).padStart(2,'0')}`;
    $('.lightbox-caption',viewer).textContent=item.alt;
  }
  function stepViewer(delta){viewerIndex=(viewerIndex+delta+viewerItems.length)%viewerItems.length;renderViewer();}
  function stopSlideshow(){clearInterval(slideTimer);slideTimer=null;$('.slideshow-toggle',viewer).textContent='PLAY';$('.slideshow-toggle',viewer).setAttribute('aria-pressed','false');}
  function openViewer(items,index=0,play=false){
    if(!items.length)return;viewerItems=items;viewerIndex=index;renderViewer();viewer.showModal();document.body.classList.add('locked');
    if(play){slideTimer=setInterval(()=>stepViewer(1),4000);$('.slideshow-toggle',viewer).textContent='PAUSE';$('.slideshow-toggle',viewer).setAttribute('aria-pressed','true');}
  }
  function closeViewer(){stopSlideshow();document.body.classList.remove('locked');viewer.close();}
  $('.lightbox-close',viewer)?.addEventListener('click',closeViewer);
  $('.lightbox-prev',viewer)?.addEventListener('click',()=>{stopSlideshow();stepViewer(-1);});
  $('.lightbox-next',viewer)?.addEventListener('click',()=>{stopSlideshow();stepViewer(1);});
  $('.slideshow-toggle',viewer)?.addEventListener('click',()=>{if(slideTimer)stopSlideshow();else{slideTimer=setInterval(()=>stepViewer(1),4000);$('.slideshow-toggle',viewer).textContent='PAUSE';$('.slideshow-toggle',viewer).setAttribute('aria-pressed','true');}});
  viewer?.addEventListener('close',()=>{stopSlideshow();document.body.classList.remove('locked');});
  viewer?.addEventListener('cancel',e=>{e.preventDefault();closeViewer();});
  viewer?.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeViewer();}else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();stopSlideshow();stepViewer(e.key==='ArrowRight'?1:-1);}});
  $('.lightbox-image',viewer)?.addEventListener('load',e=>{if(!reduced.matches)e.target.animate([{opacity:.25},{opacity:1}],{duration:300,easing:'ease-out'});});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSlideshow();});
  viewer?.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX;},{passive:true});
  viewer?.addEventListener('touchend',e=>{const delta=e.changedTouches[0].screenX-touchX;if(touchX!==null&&Math.abs(delta)>45){stopSlideshow();stepViewer(delta<0?1:-1);}touchX=null;},{passive:true});
  document.addEventListener('click',e=>{
    const button=e.target.closest('.open-photo');if(!button)return;
    const container=button.closest('.event-editorial,.client-grid');
    const buttons=$$('.open-photo',container).filter(b=>!b.closest('figure').hidden);
    openViewer(buttons.map(b=>({src:b.dataset.full||$('img',b).src,alt:$('img',b).alt})),buttons.indexOf(button));
  });

  // FRONTEND SHOWCASE ONLY: this code is public and grants no real access protection.
  // Production private galleries require backend authentication and protected storage.
  const accessForm=$('#gallery-access');
  const gallery=$('#client-gallery');
  const galleryEntry=$('#gallery-entry');
  if(accessForm){
    const savedFavorites=storage.get('gara-frame-favorites',[]);
    const favorites=new Set((Array.isArray(savedFavorites)?savedFavorites:[]).filter(id=>/^00[1-8]$/.test(id)));
    let favoritesOnly=false;
    function updateFavorites(){
      $$('.client-photo').forEach(photo=>{
        const selected=favorites.has(photo.dataset.id);
        const button=$('.favorite',photo);button.setAttribute('aria-pressed',String(selected));button.textContent=selected?'♥':'♡';
        button.setAttribute('aria-label',`${selected?'Remove':'Add'} photograph ${photo.dataset.id} ${selected?'from':'to'} favorites`);
        photo.hidden=favoritesOnly&&!selected;
      });
      $('#favorite-count').textContent=String(favorites.size);
      $('#gallery-empty').hidden=!(favoritesOnly&&favorites.size===0);
      storage.set('gara-frame-favorites',[...favorites]);
    }
    accessForm.addEventListener('submit',e=>{
      e.preventDefault();
      if($('#gallery-code').value.trim().toUpperCase()!=='FRAME2026'){
        $('#gallery-error').textContent='That code doesn’t match. Try the demo code FRAME2026.';$('#gallery-code').setAttribute('aria-invalid','true');return;
      }
      $('#gallery-error').textContent='';$('#gallery-code').removeAttribute('aria-invalid');galleryEntry.hidden=true;gallery.hidden=false;updateFavorites();
      window.scrollTo({top:0,behavior:'instant'});$('h1',gallery).focus({preventScroll:true});
    });
    $('#fill-demo')?.addEventListener('click',()=>{$('#gallery-code').value='FRAME2026';$('#gallery-code').focus();});
    $$('.favorite').forEach(button=>button.addEventListener('click',()=>{const id=button.closest('figure').dataset.id;if(favorites.has(id))favorites.delete(id);else favorites.add(id);updateFavorites();}));
    $('#toggle-favorites').addEventListener('click',e=>{favoritesOnly=!favoritesOnly;e.currentTarget.setAttribute('aria-pressed',String(favoritesOnly));updateFavorites();});
    $$('[data-gallery-view]').forEach(button=>button.addEventListener('click',()=>{$('.client-grid').classList.toggle('large-view',button.dataset.galleryView==='large');$$('[data-gallery-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
    $('#gallery-slideshow').addEventListener('click',()=>{const photos=$$('.client-photo').filter(p=>!p.hidden);if(!photos.length){toast('Add a few favorites to start a slideshow.');return;}openViewer(photos.map(p=>({src:$('.open-photo',p).dataset.full,alt:$('img',p).alt})),0,true);});
    $('#gallery-download').addEventListener('click',()=>{
      if(favorites.size){downloadText(`GARA FRAME — Executive Meeting\nFavorite selections\n\n${[...favorites].sort().map(id=>`Frame ${id}`).join('\n')}\n\nDemonstration selection list. High-resolution gallery delivery is a production feature.`, 'Gara-Frame-favorites.txt');toast('Your favorite selection list has been downloaded.');}
      else toast('Select your favorites to download a selection list. Full-resolution delivery is shown as a demo.');
    });
    $('#gallery-share').addEventListener('click',()=>{toast('Sharing preview: in a live gallery, you could invite your team with a private link.');});
    $('#gallery-exit').addEventListener('click',()=>{gallery.hidden=true;galleryEntry.hidden=false;$('#gallery-code').value='';$('#gallery-code').focus();window.scrollTo({top:0,behavior:'instant'});});
    updateFavorites();
  }

  // The inquiry stays in memory. No personal information is transmitted or stored.
  const inquiry=$('#inquiry-form');
  if(inquiry){
    const steps=$$('.inquiry-step',inquiry);let step=0;
    const labels=['The occasion','The date','The setting','The guests','The coverage','The details','About you'];
    const eventParam=new URLSearchParams(location.search).get('event');
    if(eventParam)$$('input[name=occasion]',inquiry).forEach(input=>{if(input.value.toLowerCase()===eventParam.toLowerCase())input.checked=true;});
    const collection=new URLSearchParams(location.search).get('coverage');
    const collectionCoverage={Essential:'Short Coverage',Signature:'Full Event','Full Story':'Full Story'}[collection];
    if(collectionCoverage)$$('input[name=coverage]',inquiry).forEach(input=>input.checked=input.value===collectionCoverage);
    function showStep(index,focus=true){
      step=index;steps.forEach((el,i)=>{el.hidden=i!==step;el.disabled=i!==step;});
      $('#step-number').textContent=`0${step+1} / 07`;$('#step-label').textContent=labels[step];$('.step-progress i').style.width=`${(step+1)/7*100}%`;
      $('#inquiry-back').disabled=step===0;$('#inquiry-next .button-label').textContent=step===6?'Review your story':'Continue';$('#inquiry-error').textContent='';
      if(focus){const legend=$('legend',steps[step]);legend.tabIndex=-1;legend.focus({preventScroll:true});if(mobile.matches)inquiry.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});}
    }
    function validStep(){
      const fields=$$('input,textarea',steps[step]);
      fields.filter(field=>field.type==='text'||field.type==='email').forEach(field=>field.value=field.value.trim());
      for(const field of fields)if(!field.checkValidity()){field.reportValidity();$('#inquiry-error').textContent='Please complete this detail before continuing.';return false;}
      return true;
    }
    function inquiryData(){steps.forEach(s=>s.disabled=false);const data=Object.fromEntries(new FormData(inquiry));steps.forEach((s,i)=>s.disabled=i!==step);return data;}
    const summaryFields=[['occasion','Occasion'],['date','Date'],['location','Location'],['guests','Guests'],['coverage','Coverage'],['details','Your story'],['name','Name'],['email','Email'],['phone','Phone']];
    let finalData={};
    inquiry.addEventListener('submit',e=>{
      e.preventDefault();if(!validStep())return;
      if(step<6){showStep(step+1);return;}
      finalData=inquiryData();const list=$('.summary-list');list.replaceChildren();
      summaryFields.forEach(([key,label])=>{const row=document.createElement('div');const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=finalData[key]||'Not specified';row.append(dt,dd);list.append(row);});
      inquiry.hidden=true;$('#inquiry-summary').hidden=false;$('#inquiry-summary h2').focus({preventScroll:true});$('#inquiry-summary').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
    });
    $('#inquiry-back').addEventListener('click',()=>{if(step>0)showStep(step-1);});
    $('#edit-inquiry').addEventListener('click',()=>{$('#inquiry-summary').hidden=true;inquiry.hidden=false;showStep(0);});
    $('#download-inquiry').addEventListener('click',()=>{downloadText(`GARA FRAME\nYOUR STORY STARTS HERE.\n\n${summaryFields.map(([k,l])=>`${l}: ${finalData[k]||'Not specified'}`).join('\n\n')}\n\nThis is a saved inquiry preview. It has not been sent to a studio.`, 'Gara-Frame-your-inquiry.txt');toast('Your inquiry has been saved to your device.');});
    showStep(0,false);
  }
})();
