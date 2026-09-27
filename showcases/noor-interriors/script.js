/* GARA INTERIORS — dependency-free, file:// compatible. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 801px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const imagePath = file => `assets/images/${file}`;
  let reducedMotion = motion.matches;
  const header = $('.site-header');
  const preloader = $('.preloader');
  preloader.addEventListener('animationend', event => {
    if (event.animationName === 'loader-out') preloader.remove();
  });
  // Also release the entry layer if the tab was backgrounded during its animation.
  setTimeout(() => preloader.remove(), 2800);
  $('#year').textContent = new Date().getFullYear();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  $$('.reveal, .image-reveal').forEach(element => revealObserver.observe(element));

  // Preserve the editorial emphasis while revealing individual words.
  const introTitle = $('.word-reveal');
  function wrapWords(element) {
    [...element.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(word => {
          if (!word.trim()) fragment.append(document.createTextNode(word));
          else {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            fragment.append(span);
          }
        });
        node.replaceWith(fragment);
      } else if (node.nodeType === Node.ELEMENT_NODE) wrapWords(node);
    });
  }
  wrapWords(introTitle);
  const introWords = $$('.word', introTitle);

  const menu = $('#mobile-menu');
  const menuToggle = $('.menu-toggle');
  const projectDialog = $('.project-dialog');
  function syncBodyLock() {
    document.body.classList.toggle('modal-open', menu.open || projectDialog.open);
  }
  menuToggle.addEventListener('click', () => {
    menu.showModal();
    menuToggle.setAttribute('aria-expanded', 'true');
    syncBodyLock();
  });
  function closeMenu() {
    menu.close();
    menuToggle.setAttribute('aria-expanded', 'false');
    syncBodyLock();
  }
  $('.menu-close').addEventListener('click', closeMenu);
  menu.addEventListener('close', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    syncBodyLock();
  });
  $$('a', menu).forEach(link => link.addEventListener('click', closeMenu));
  desktop.addEventListener('change', () => { if (desktop.matches && menu.open) closeMenu(); });

  const projects = {
    ivory: {
      title: 'The Ivory Residence', image: 'detail.jpg', location: 'Baku, Azerbaijan', year: '2026', type: 'Full interior', area: '180 m²', room: 'Full Interior',
      description: 'A home composed around light. Arched windows and exposed timber set the rhythm; ivory upholstery, tactile textiles and carefully scaled furniture make room for everyday life. A study in warmth, proportion and restraint.',
      materials: [['oak', 'Natural oak'], ['stone', 'Travertine'], ['textile', 'Linen']]
    },
    walnut: {
      title: 'Walnut House', image: 'dining.jpg', location: 'Mardakan, Azerbaijan', year: '2025', type: 'Design & furniture', area: '240 m²', room: 'Full Interior',
      description: 'The garden becomes part of the room. Full-height glazing and a continuous walnut plane create a calm setting for open-plan living. Bespoke storage keeps the practical details close, without interrupting the architecture.',
      materials: [['walnut', 'Walnut'], ['textile', 'Woven wool'], ['metal', 'Brushed metal']]
    },
    atelier: {
      title: 'Atelier Kitchen', image: 'kitchen-design.jpg', location: 'Baku, Azerbaijan', year: '2025', type: 'Kitchen & joinery', area: '32 m²', room: 'Kitchen',
      description: 'A kitchen designed around the pleasure of using it. A generous working surface anchors the space, with carefully placed storage and a quiet palette that keeps the room feeling open. Every dimension has a purpose.',
      materials: [['oak', 'Oak'], ['marble', 'Honed stone'], ['metal', 'Satin metal']]
    },
    office: {
      title: 'No. 17 Office', image: 'office.jpg', location: 'Baku, Azerbaijan', year: '2024', type: 'Commercial interior', area: '310 m²', room: 'Commercial Space',
      description: 'A more human place to work. Shared tables, honest surfaces and daylight create an environment for conversation and concentration. The design balances the energy of a team with quieter places to think.',
      materials: [['walnut', 'Warm timber'], ['metal', 'Steel'], ['stone', 'Mineral surfaces']]
    }
  };
  let activeProject;
  function addDefinition(list, label, value) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const definition = document.createElement('dd');
    term.textContent = label;
    definition.textContent = value;
    row.append(term, definition);
    list.append(row);
  }
  $$('[data-project]').forEach(button => button.addEventListener('click', () => {
    activeProject = projects[button.dataset.project];
    $('#dialog-image').src = imagePath(activeProject.image);
    $('#dialog-image').alt = `${activeProject.title}, ${activeProject.type.toLowerCase()} concept`;
    $('#dialog-kicker').textContent = `SELECTED SPACES / ${activeProject.year}`;
    $('#project-dialog-title').textContent = activeProject.title;
    $('#dialog-description').textContent = activeProject.description;
    $('#dialog-details').replaceChildren();
    [['Location', activeProject.location], ['Year', activeProject.year], ['Scope', activeProject.type], ['Area', activeProject.area]].forEach(([label, value]) => addDefinition($('#dialog-details'), label, value));
    $('#dialog-materials').replaceChildren();
    activeProject.materials.forEach(([texture, name]) => {
      const sample = document.createElement('span');
      const swatch = document.createElement('i');
      swatch.className = `sample ${texture}`;
      swatch.setAttribute('aria-hidden', 'true');
      sample.append(swatch, document.createTextNode(name));
      $('#dialog-materials').append(sample);
    });
    projectDialog.showModal();
    projectDialog.scrollTop = 0;
    syncBodyLock();
  }));
  function closeProject() { projectDialog.close(); syncBodyLock(); }
  $('.dialog-close').addEventListener('click', closeProject);
  projectDialog.addEventListener('close', syncBodyLock);
  projectDialog.addEventListener('click', event => {
    const rect = projectDialog.getBoundingClientRect();
    if (event.target === projectDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeProject();
  });
  $('#dialog-start').addEventListener('click', () => {
    selectRoom(activeProject.room);
    closeProject();
  });

  // One passive scroll listener and one scheduled frame drive all storytelling.
  const story = $('.room-story');
  const storyStage = $('.story-stage');
  const storyAfter = $('.story-after');
  const storyGrid = $('.story-grid');
  const storyMaterials = $('.story-materials');
  const storySteps = $$('.story-steps button');
  const collections = $('.collections');
  const collectionTrack = $('.collection-track');
  const collectionProgress = $('.collection-progress span');
  const process = $('.process-list');
  const planAccent = $('.plan-accent');
  const visual = $('.visual-break');
  const visualImage = $('.visual-break>img');
  const hero = $('.hero-frame');
  const heroImage = $('.hero-image');
  const pageProgress = $('.scroll-progress');
  const phases = [
    ['Space', 'First, we listen to the room. Its light. Its rhythm. Its possibilities.'],
    ['Material', 'Honest timber. Tactile linen. A palette chosen to feel as good as it looks.'],
    ['Form', 'Every piece finds its place. Proportion creates a room that simply works.'],
    ['Detail', 'The quiet decisions make the difference. A texture. A curve. A pool of light.'],
    ['Living', 'The design becomes your everyday. Now, the room is ready for your story.']
  ];
  let currentStage = -1;
  let horizontalDistance = 0;
  let framePending = false;
  let pointerX = 0, pointerY = 0;
  function setStage(index) {
    if (currentStage === index) return;
    currentStage = index;
    $('.story-number').textContent = String(index + 1).padStart(2, '0');
    $('#story-name').textContent = phases[index][0];
    $('#story-description').textContent = phases[index][1];
    storySteps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
      if (i === index) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  }
  function measureHorizontal() {
    horizontalDistance = Math.max(0, collectionTrack.scrollWidth - innerWidth);
    if (desktop.matches && !reducedMotion) collections.style.height = `${horizontalDistance + innerHeight}px`;
    else collections.style.removeProperty('height');
  }
  function renderScroll() {
    framePending = false;
    // All geometry reads happen before style writes.
    const viewport = innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const heroRect = hero.getBoundingClientRect();
    const introRect = introTitle.getBoundingClientRect();
    const storyRect = story.getBoundingClientRect();
    const collectionRect = collections.getBoundingClientRect();
    const processRect = process.getBoundingClientRect();
    const visualRect = visual.getBoundingClientRect();
    const stickyTop = innerWidth > 800 ? 76 : innerWidth > 540 ? 70 : 66;
    const storyProgress = clamp((stickyTop - storyRect.top) / Math.max(1, storyRect.height - viewport + stickyTop));
    const horizontalProgress = clamp((stickyTop - collectionRect.top) / Math.max(1, collectionRect.height - viewport + stickyTop));
    const processProgress = clamp((viewport * .7 - processRect.top) / processRect.height);
    pageProgress.style.transform = `scaleX(${clamp(scrollY / Math.max(1, documentHeight - viewport))})`;
    header.classList.toggle('scrolled', scrollY > 35);
    if (reducedMotion) return;
    if (heroRect.bottom > 0) heroImage.style.transform = `translate3d(${pointerX}px,${clamp(-heroRect.top * .13, -20, 110) + pointerY}px,0) scale(1.07)`;
    const wordProgress = clamp((viewport * .87 - introRect.top) / (viewport * .52));
    introWords.forEach((word, index) => { word.style.opacity = wordProgress > index / introWords.length ? '1' : '.3'; });
    if (storyRect.top < viewport && storyRect.bottom > 0) {
      setStage(Math.min(4, Math.floor(storyProgress * 5)));
      storyAfter.style.clipPath = `inset(0 ${(1 - clamp((storyProgress - .12) / .7)) * 100}% 0 0)`;
      storyGrid.style.opacity = String(1 - clamp(storyProgress * 2.6));
      storyMaterials.style.opacity = String(clamp((storyProgress - .12) * 6));
    }
    if (desktop.matches) {
      collectionTrack.style.transform = `translate3d(${-horizontalDistance * horizontalProgress}px,0,0)`;
      collectionProgress.style.transform = `scaleX(${.1 + horizontalProgress * .9})`;
    }
    process.style.setProperty('--process-progress', String(processProgress));
    planAccent.style.strokeDashoffset = String(1300 * (1 - processProgress));
    if (visualRect.top < viewport && visualRect.bottom > 0) {
      const progress = clamp((viewport - visualRect.top) / (viewport + visualRect.height));
      visualImage.style.transform = `scale(${1.03 + progress * .09}) translateY(${(progress - .5) * 25}px)`;
    }
  }
  function scheduleScroll() {
    if (!framePending) { framePending = true; requestAnimationFrame(renderScroll); }
  }
  storySteps.forEach((button, index) => button.addEventListener('click', () => {
    if (reducedMotion) { setStage(index); return; }
    const top = innerWidth > 800 ? 76 : innerWidth > 540 ? 70 : 66;
    const travel = story.offsetHeight - innerHeight + top;
    const target = story.getBoundingClientRect().top + scrollY - top + travel * (index / 5 + .06);
    window.scrollTo({ top: target, behavior: 'smooth' });
  }));
  $$('.collection').forEach(collection => collection.addEventListener('focus', () => {
    if (!desktop.matches || reducedMotion) return;
    const rect = collection.getBoundingClientRect();
    if (rect.left >= 0 && rect.right <= innerWidth) return;
    const sectionTop = collections.getBoundingClientRect().top + scrollY;
    const travel = collections.offsetHeight - innerHeight + 76;
    const leftInset = parseFloat(getComputedStyle(collectionTrack).paddingLeft);
    const progress = clamp((collection.offsetLeft - leftInset) / Math.max(1, horizontalDistance));
    requestAnimationFrame(() => {
      $('.collections-sticky').scrollLeft = 0;
      window.scrollTo({ top: sectionTop - 76 + travel * progress, behavior: 'instant' });
    });
  }));
  hero.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion) return;
    const rect = hero.getBoundingClientRect();
    pointerX = (event.clientX / innerWidth - .5) * 9;
    pointerY = ((event.clientY - rect.top) / rect.height - .5) * 7;
    scheduleScroll();
  });
  hero.addEventListener('pointerleave', () => { pointerX = pointerY = 0; scheduleScroll(); });
  addEventListener('scroll', scheduleScroll, { passive: true });
  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { measureHorizontal(); scheduleScroll(); }, 120);
  }, { passive: true });
  motion.addEventListener('change', () => {
    reducedMotion = motion.matches;
    if (reducedMotion) {
      introWords.forEach(word => { word.style.opacity = '1'; });
      setStage(4);
      cursor.classList.remove('visible');
    }
    measureHorizontal(); scheduleScroll();
  });
  setStage(reducedMotion ? 4 : 0);
  measureHorizontal(); scheduleScroll();
  document.fonts.ready.then(() => { measureHorizontal(); scheduleScroll(); });
  addEventListener('load', () => { measureHorizontal(); scheduleScroll(); });

  const cursor = $('.cursor');
  const cursorLabel = $('span', cursor);
  let cursorTargetX = -100, cursorTargetY = -100, cursorFrame = false;
  function paintCursor() {
    cursorFrame = false;
    cursor.style.transform = `translate3d(${cursorTargetX}px,${cursorTargetY}px,0) translate(-50%,-50%)`;
  }
  document.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion || event.pointerType === 'touch') return;
    cursorTargetX = event.clientX; cursorTargetY = event.clientY;
    const target = event.target.closest('[data-cursor]');
    cursor.classList.toggle('active', Boolean(target));
    cursor.classList.add('visible');
    cursorLabel.textContent = target ? target.dataset.cursor : '';
    if (!cursorFrame) { cursorFrame = true; requestAnimationFrame(paintCursor); }
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('visible'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) cursor.classList.remove('visible'); });

  // Image changes are intentional, and also work with keyboard focus.
  let serviceImageToken = 0;
  function setServicePreview(service) {
    const image = $('#service-preview');
    const token = ++serviceImageToken;
    const apply = () => {
      if (token !== serviceImageToken) return;
      image.src = imagePath(service.dataset.image);
      image.alt = `${$('h3', service).textContent}: a considered interior reference`;
      $('#service-caption').textContent = service.dataset.caption;
      image.style.opacity = '1';
    };
    if (reducedMotion) apply();
    else { image.style.opacity = '.2'; setTimeout(apply, 150); }
  }
  $$('.service').forEach(service => {
    service.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') setServicePreview(service); });
    service.addEventListener('focusin', () => setServicePreview(service));
    service.addEventListener('toggle', () => {
      if (!service.open) return;
      $$('.service').forEach(other => { if (other !== service) other.open = false; });
      setServicePreview(service);
    });
  });

  const materials = {
    oak: { name: 'Natural oak', display: 'Oak.', type: 'Warm / tactile / timeless', texture: 'oak', image: 'detail.jpg', copy: 'An open grain that catches the light. Oak brings a gentle warmth to cabinetry, flooring and the pieces you touch every day.' },
    walnut: { name: 'American walnut', display: 'Walnut.', type: 'Rich / expressive / grounded', texture: 'walnut', image: 'dining.jpg', copy: 'Deep, expressive grain with a beautifully quiet presence. Walnut gives bespoke furniture and architectural joinery a sense of depth.' },
    travertine: { name: 'Natural travertine', display: 'Stone.', type: 'Earthy / porous / individual', texture: 'stone', image: 'living.jpg', copy: 'Layered by nature, never quite the same twice. A soft mineral palette for surfaces that feel as though they have always belonged.' },
    marble: { name: 'Honed marble', display: 'Marble.', type: 'Cool / sculptural / enduring', texture: 'marble', image: 'kitchen-design.jpg', copy: 'A natural drawing held in stone. Honed finishes soften the reflection, letting the veining become a quiet focal point.' },
    textile: { name: 'Natural woven linen', display: 'Linen.', type: 'Soft / breathable / lived-in', texture: 'textile', image: 'hero.jpg', copy: 'Texture that invites you to stay. Natural woven fibres soften a room, giving seating, curtains and everyday rituals a gentler touch.' },
    metal: { name: 'Brushed metal', display: 'Metal.', type: 'Precise / subtle / architectural', texture: 'metal', image: 'office.jpg', copy: 'A fine edge, a considered handle, a slender frame. A satin surface adds precision without taking the attention from the whole.' }
  };
  let selectedMaterial = 'oak';
  let briefMaterial = '';
  let materialAnimation;
  $$('.material-button').forEach((button, index) => button.addEventListener('click', () => {
    selectedMaterial = button.dataset.material;
    const material = materials[selectedMaterial];
    $$('.material-button').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
    });
    $('#material-texture').className = `material-texture ${material.texture}`;
    $('#material-texture').setAttribute('aria-label', `Illustrative ${material.name.toLowerCase()} texture sample`);
    $('.material-art').dataset.material = selectedMaterial;
    $('#material-display').textContent = material.display;
    $('#material-code').textContent = `M—${String(index + 1).padStart(3, '0')}`;
    $('#material-type').textContent = material.type;
    $('#material-name').textContent = material.name;
    $('#material-copy').textContent = material.copy;
    $('#material-context-image').src = imagePath(material.image);
    $('#material-context-image').alt = `Interior inspiration for ${material.name.toLowerCase()}`;
    $('#save-material').replaceChildren(document.createTextNode(`Include ${selectedMaterial} in my brief `), makeArrow());
    $('#material-status').textContent = briefMaterial === material.name ? 'Included in your project brief.' : '';
    if (!reducedMotion) {
      materialAnimation?.cancel();
      materialAnimation = $('#material-display').animate([{ opacity: 0, transform: 'translateY(25px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)' });
      $('#material-context-image').animate([{ opacity: .25, transform: 'scale(1.04)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 650 });
    }
  }));
  function makeArrow() { const span = document.createElement('span'); span.textContent = '↗'; return span; }
  $('#save-material').addEventListener('click', () => {
    briefMaterial = materials[selectedMaterial].name;
    $('#material-status').textContent = `${briefMaterial} is included in your project brief.`;
    $('.material-brief-note').textContent = `From your material library: ${briefMaterial}.`;
    if (briefFinished) renderBriefSummary();
  });

  const moods = {
    Modern: { name: 'Modern clarity', image: 'living.jpg', style: 'Modern', colors: ['#d9dad3', '#8d9187', '#484b45'], copy: 'Confident lines. Open space. Architecture and furniture in a precise, effortless conversation.' },
    Warm: { name: 'Warm contemporary', image: 'dining.jpg', style: 'Warm Contemporary', colors: ['#e3dfd2', '#ad9577', '#705442'], copy: 'Soft edges. Warm timber. A palette that makes the everyday feel a little more grounded.' },
    Minimal: { name: 'Quiet minimalism', image: 'quiet.jpg', style: 'Minimal', colors: ['#edece4', '#c7c4b8', '#a4a293'], copy: 'A little less, with a little more intention. Light, space and the beauty of what is left.' },
    Dark: { name: 'A deeper mood', image: 'office.jpg', style: 'Modern', colors: ['#333932', '#625c4b', '#999485'], copy: 'A richer palette, balanced by daylight. Dark timber and tactile surfaces create a sense of quiet retreat.' },
    Natural: { name: 'Naturally at home', image: 'hero.jpg', style: 'Warm Contemporary', colors: ['#dfdac7', '#b9a078', '#76795c'], copy: 'Sun-warmed wood. Honest textures. A gentle connection between the room and the world outside.' }
  };
  let selectedMood = 'Warm';
  let briefMood = '';
  $$('.mood-options button').forEach(button => button.addEventListener('click', () => {
    selectedMood = button.dataset.mood;
    const mood = moods[selectedMood];
    $$('.mood-options button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    $('#mood-image').src = imagePath(mood.image);
    $('#mood-image').alt = `Interior inspiration: ${mood.name.toLowerCase()}`;
    $('#mood-name').textContent = mood.name;
    $('#mood-copy').textContent = mood.copy;
    $$('.mood-palette i').forEach((swatch, index) => { swatch.style.background = mood.colors[index]; });
    $('.mood-palette').setAttribute('aria-label', `${mood.name} color palette`);
    $('#mood-status').textContent = briefMood === mood.name ? 'Included in your project brief.' : '';
    if (!reducedMotion) $('#mood-image').animate([{ opacity: .3, transform: 'scale(1.025)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 650, easing: 'ease-out' });
  }));
  $('#save-mood').addEventListener('click', () => {
    const mood = moods[selectedMood];
    briefMood = mood.name;
    const styleInput = $$('input[name="style"]').find(input => input.value === mood.style);
    if (styleInput) styleInput.checked = true;
    $('#mood-status').textContent = `${mood.name} is now the starting point for your brief.`;
    if (briefFinished) renderBriefSummary();
  });

  const comparison = $('.comparison');
  $('#comparison-range').addEventListener('input', event => {
    const value = Number(event.target.value);
    comparison.style.setProperty('--split', `${value}%`);
    event.target.setAttribute('aria-valuetext', `${value}% before, ${100 - value}% after`);
  });
  // The native range remains the keyboard and touch control; only its visuals are custom.

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const end = Number(element.dataset.count);
      const suffix = element.dataset.suffix || '';
      counterObserver.unobserve(element);
      if (reducedMotion) { element.textContent = `${end}${suffix}`; return; }
      const start = performance.now();
      function animateCounter(now) {
        const t = clamp((now - start) / 1600);
        element.textContent = `${Math.round(end * (1 - Math.pow(1 - t, 3)))}${suffix}`;
        if (t < 1 && !reducedMotion) requestAnimationFrame(animateCounter);
        else element.textContent = `${end}${suffix}`;
      }
      requestAnimationFrame(animateCounter);
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(counter => counterObserver.observe(counter));

  // Animate native details without compromising their semantic keyboard behavior.
  $$('.faq-list details').forEach(details => {
    const summary = $('summary', details);
    let animation;
    let finishTimer;
    let desiredOpen = details.open;
    summary.addEventListener('click', event => {
      if (reducedMotion) return;
      event.preventDefault();
      const startHeight = details.offsetHeight;
      desiredOpen = !desiredOpen;
      animation?.cancel();
      clearTimeout(finishTimer);
      details.style.height = '';
      details.open = true;
      const endHeight = desiredOpen ? details.offsetHeight : summary.offsetHeight + 1;
      details.style.overflow = 'hidden';
      animation = details.animate([{ height: `${startHeight}px` }, { height: `${endHeight}px` }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' });
      const finish = () => {
        clearTimeout(finishTimer);
        details.open = desiredOpen;
        details.style.overflow = '';
        details.style.height = '';
        animation = null;
      };
      animation.onfinish = finish;
      // Finish semantic state even when a background tab suspends compositor callbacks.
      finishTimer = setTimeout(finish, 340);
    });
  });

  // Six-step local project brief. No fetch, analytics, storage or backend submission.
  const form = $('#brief-form');
  const steps = $$('.form-step', form);
  const error = $('#form-error');
  let activeStep = 0;
  let referenceFiles = [];
  let briefFinished = false;
  let lastDownloadUrl = '';
  const stepNames = ['room', 'size', 'budget', 'style'];
  function selectRoom(value) {
    const radio = $$('input[name="room"]').find(input => input.value === value);
    if (radio) radio.checked = true;
    if (briefFinished) { briefFinished = false; $('.brief-complete').hidden = true; form.hidden = false; }
    showStep(0, false);
  }
  $$('[data-room]').forEach(link => link.addEventListener('click', () => selectRoom(link.dataset.room)));
  function showStep(index, focus = true) {
    activeStep = clamp(index, 0, 5);
    steps.forEach((step, i) => { step.hidden = i !== activeStep; });
    $('.brief-step-count').textContent = `${String(activeStep + 1).padStart(2, '0')} / 06`;
    $('.brief-progress span').style.transform = `scaleX(${(activeStep + 1) / 6})`;
    $('.brief-back').disabled = activeStep === 0;
    $('.brief-next').replaceChildren(document.createTextNode(activeStep === 5 ? 'Prepare my brief ' : activeStep === 4 && referenceFiles.length === 0 ? 'Skip for now ' : 'Continue '), makeArrow());
    error.textContent = '';
    if (focus) {
      const legend = $('legend', steps[activeStep]);
      legend.tabIndex = -1;
      legend.focus({ preventScroll: true });
      const panelRect = $('.brief-panel').getBoundingClientRect();
      if (panelRect.top < 70 || panelRect.top > innerHeight * .55) $('.brief-panel').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    }
  }
  function validateStep() {
    if (activeStep < 4) {
      if (!$(`input[name="${stepNames[activeStep]}"]:checked`, form)) {
        error.textContent = 'Please choose an option to continue.';
        $('input', steps[activeStep]).focus({ preventScroll: true });
        return false;
      }
    }
    if (activeStep === 5) {
      const name = form.elements.namedItem('name');
      const email = form.elements.namedItem('email');
      name.value = name.value.trim(); email.value = email.value.trim();
      for (const field of [name, email]) {
        const invalid = !field.checkValidity();
        field.setAttribute('aria-invalid', String(invalid));
        if (invalid) {
          error.textContent = field === name ? 'Please add your name.' : 'Please enter a valid email address.';
          field.setAttribute('aria-describedby', 'form-error');
          field.focus({ preventScroll: true });
          return false;
        }
        field.removeAttribute('aria-describedby');
      }
    }
    return true;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateStep()) return;
    if (activeStep < 5) showStep(activeStep + 1);
    else completeBrief();
  });
  form.addEventListener('change', event => {
    if (event.target.type === 'radio') error.textContent = '';
    if (event.target.name === 'style') briefMood = '';
  });
  $('.brief-back').addEventListener('click', () => showStep(activeStep - 1));
  function renderFiles() {
    $('#file-list').replaceChildren();
    referenceFiles.forEach((file, index) => {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
      const remove = document.createElement('button');
      remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.addEventListener('click', () => {
        referenceFiles.splice(index, 1); renderFiles();
        $('#references').focus();
      });
      li.append(label, remove); $('#file-list').append(li);
    });
    if (activeStep === 4) $('.brief-next').replaceChildren(document.createTextNode(referenceFiles.length ? 'Continue ' : 'Skip for now '), makeArrow());
  }
  function addFiles(files) {
    const messages = [];
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    [...files].forEach(file => {
      if (referenceFiles.some(existing => existing.name === file.name && existing.size === file.size)) return;
      if (!allowed.includes(file.type)) { messages.push(`${file.name}: choose a JPG, PNG, WebP or PDF.`); return; }
      if (file.size > 10 * 1024 * 1024) { messages.push(`${file.name}: the limit is 10 MB per file.`); return; }
      if (referenceFiles.length >= 3) { messages.push('You can add up to 3 references.'); return; }
      referenceFiles.push(file);
    });
    renderFiles();
    error.textContent = [...new Set(messages)].join(' ');
  }
  $('#references').addEventListener('change', event => { addFiles(event.target.files); event.target.value = ''; });
  const upload = $('.upload-area');
  ['dragenter', 'dragover'].forEach(type => upload.addEventListener(type, event => { event.preventDefault(); upload.classList.add('dragging'); }));
  ['dragleave', 'drop'].forEach(type => upload.addEventListener(type, event => { event.preventDefault(); upload.classList.remove('dragging'); }));
  upload.addEventListener('drop', event => addFiles(event.dataTransfer.files));
  function briefData() {
    const values = new FormData(form);
    return [
      ['Space', values.get('room') || 'To be discussed'], ['Size', values.get('size') || 'To be discussed'], ['Budget', values.get('budget') || 'To be discussed'], ['Style', values.get('style') || 'To be discussed'],
      ...(briefMood ? [['Mood', briefMood]] : []), ...(briefMaterial ? [['Material', briefMaterial]] : []),
      ['Name', values.get('name') || ''], ['Email', values.get('email') || ''],
      ...(values.get('phone')?.trim() ? [['Phone', values.get('phone').trim()]] : []),
      ...(values.get('notes')?.trim() ? [['Notes', values.get('notes').trim()]] : []),
      ['References', referenceFiles.length ? referenceFiles.map(file => file.name).join(', ') : 'None added']
    ];
  }
  function renderBriefSummary() {
    $('#brief-summary').replaceChildren();
    briefData().forEach(([label, value]) => addDefinition($('#brief-summary'), label, value));
  }
  function completeBrief() {
    briefFinished = true;
    renderBriefSummary();
    form.hidden = true;
    $('.brief-complete').hidden = false;
    $('.brief-step-count').textContent = 'COMPLETE';
    $('.brief-complete h3').focus({ preventScroll: true });
    $('.brief-panel').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
  }
  $('#edit-brief').addEventListener('click', () => {
    briefFinished = false; $('.brief-complete').hidden = true; form.hidden = false; showStep(0);
  });
  $('#download-brief').addEventListener('click', () => {
    const content = ['GARA INTERIORS', 'YOUR PERSONAL PROJECT BRIEF', 'Prepared ' + new Date().toLocaleDateString('en-GB'), '', ...briefData().map(([label, value]) => `${label}: ${value}`), '', 'This brief was prepared locally in the Gara Interiors showcase.', 'No enquiry has been sent. Reference files are listed by name, not embedded.', 'A showcase concept by Gara Tech Software Solutions.'].join('\r\n');
    if (lastDownloadUrl) URL.revokeObjectURL(lastDownloadUrl);
    lastDownloadUrl = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = lastDownloadUrl; link.download = 'Gara-Interiors-Project-Brief.txt';
    document.body.append(link); link.click(); link.remove();
  });
  addEventListener('pagehide', () => { if (lastDownloadUrl) URL.revokeObjectURL(lastDownloadUrl); });
  showStep(0, false);
})();
