(() => {
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const $ = (s, root = document) => root.querySelector(s);

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const menuButton = $('.menu-toggle');
  const nav = $('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .09 });
  $$('.reveal').forEach(el => observer.observe(el));

  const glow = $('.cursor-glow');
  if (glow && matchMedia('(pointer:fine)').matches) {
    addEventListener('mousemove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.classList.add('show');
    });
    addEventListener('mouseleave', () => glow.classList.remove('show'));
  }

  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    $$('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });

    $$('.magnetic').forEach(button => {
      button.addEventListener('mousemove', e => {
        const r = button.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width/2)) * .12;
        const y = (e.clientY - (r.top + r.height/2)) * .12;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });
      button.addEventListener('mouseleave', () => button.style.transform = '');
    });
  }

  $$('[data-filter-group]').forEach(group => {
    const itemsRoot = $('[data-filter-items]');
    if (!itemsRoot) return;
    const items = $$('[data-category]', itemsRoot);
    $$('.filter', group).forEach(btn => btn.addEventListener('click', () => {
      $$('.filter', group).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const categories = (item.dataset.category || '').split(/\s+/);
        const show = filter === 'all' || categories.includes(filter);
        item.classList.toggle('is-hidden', !show);
      });
    }));
  });

  const projectModal = $('#project-modal');
  if (projectModal) {
    const modalKicker = $('#project-modal-kicker', projectModal);
    const modalTitle = $('#project-modal-title', projectModal);
    const modalSummary = $('#project-modal-summary', projectModal);
    const modalTags = $('#project-modal-tags', projectModal);
    const modalImpact = $('#project-modal-impact', projectModal);
    const modalScale = $('#project-modal-scale', projectModal);
    const modalRole = $('#project-modal-role', projectModal);

    $$('[data-project-open]').forEach(button => button.addEventListener('click', () => {
      const card = button.closest('[data-project]');
      if (!card) return;

      modalKicker.textContent = card.dataset.projectKicker || 'Project details';
      modalTitle.textContent = $('h3', card)?.textContent || '';
      modalSummary.textContent = $('p', card)?.textContent || '';
      modalImpact.textContent = card.dataset.projectImpact || '';
      modalScale.textContent = card.dataset.projectScale || '';
      modalRole.textContent = card.dataset.projectRole || '';
      modalTags.replaceChildren(...$$('.tag-row span', card).map(tag => {
        const item = document.createElement('span');
        item.textContent = tag.textContent;
        return item;
      }));

      projectModal.showModal();
      document.body.classList.add('modal-open');
    }));

    $$('[data-project-close]', projectModal).forEach(button => {
      button.addEventListener('click', () => projectModal.close());
    });
    projectModal.addEventListener('click', event => {
      if (event.target === projectModal) projectModal.close();
    });
    projectModal.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });
  }

  // Smoothly highlight same-page nav links while scrolling on the homepage.
  if (document.body.dataset.page === 'home') {
    const sections = $$('main section[id]');
    const links = $$('.nav-links a[href^="#"]');
    const navMap = new Map(links.map(link => [link.getAttribute('href').slice(1), link]));
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && navMap.has(entry.target.id)) {
          links.forEach(l => l.classList.remove('active'));
          navMap.get(entry.target.id).classList.add('active');
        }
      });
    }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
    sections.forEach(s => activeObserver.observe(s));
  }
})();
