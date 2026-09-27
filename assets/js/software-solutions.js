(() => {
  const fragments = [...document.querySelectorAll('[data-fragment-target]')];
  const fragmentRail = document.querySelector('.fragment-rail');
  const detail = document.querySelector('#fragment-detail');
  const detailKicker = document.querySelector('.fragment-detail-kicker');
  const detailName = document.querySelector('.fragment-detail-name');
  const detailFlow = document.querySelector('.fragment-detail-flow');
  const detailCopy = document.querySelector('.fragment-detail-copy');
  const detailLink = document.querySelector('.fragment-detail-link');

  const scrollToChapter = id => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  if (fragments.length && detail && detailKicker && detailName && detailFlow && detailCopy && detailLink) {
    let activeIndex = 0;
    let rotationTimer;
    const activateFragment = (button, moveFocus = false) => {
      activeIndex = fragments.indexOf(button);
      if (activeIndex < 0) return;
      fragments.forEach((item, index) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        if (active) item.dataset.index = String(index);
      });
      detailKicker.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${button.dataset.fragmentCategory}`;
      detailName.textContent = button.dataset.fragmentName;
      detailFlow.textContent = button.dataset.fragmentFlow;
      detailCopy.textContent = button.dataset.fragmentCopy;
      detailLink.href = `#${button.dataset.fragmentTarget}`;
      if (moveFocus) button.focus();
    };
    const rotate = () => activateFragment(fragments[(activeIndex + 1) % fragments.length]);
    const stopRotation = () => { if (rotationTimer) window.clearInterval(rotationTimer); rotationTimer = null; };
    const startRotation = () => {
      if (rotationTimer || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;
      rotationTimer = window.setInterval(rotate, 5200);
    };

    fragments.forEach((button, index) => {
      button.tabIndex = index === 0 ? 0 : -1;
      button.addEventListener('click', () => activateFragment(button));
      button.addEventListener('keydown', event => {
        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? fragments.length - 1 : (index + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + fragments.length) % fragments.length;
        activateFragment(fragments[next], true);
      });
    });
    detailLink.addEventListener('click', event => {
      event.preventDefault();
      scrollToChapter(detailLink.getAttribute('href').slice(1));
    });
    fragmentRail?.addEventListener('mouseenter', stopRotation);
    fragmentRail?.addEventListener('mouseleave', startRotation);
    fragmentRail?.addEventListener('focusin', stopRotation);
    fragmentRail?.addEventListener('focusout', event => { if (!fragmentRail.contains(event.relatedTarget)) startRotation(); });
    document.addEventListener('visibilitychange', () => document.hidden ? stopRotation() : startRotation());
    activateFragment(fragments[0]);
    startRotation();
  }

  const chapters = [...document.querySelectorAll('[data-project-section]')];
  const links = [...document.querySelectorAll('[data-index-link]')];
  if (!chapters.length || !links.length) return;

  const activate = id => {
    links.forEach(link => link.classList.toggle('is-active', link.dataset.indexLink === id));
  };

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) activate(visible[0].target.id);
  }, { rootMargin: '-28% 0px -52% 0px', threshold: [0, .2, .5, .8] });
  chapters.forEach(chapter => observer.observe(chapter));

  links.forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });
})();
