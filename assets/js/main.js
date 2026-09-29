(() => {
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const $ = (s, root = document) => root.querySelector(s);

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Contact forms use a hidden native target so the message is submitted
  // immediately without opening the FormSubmit response page.
  $$('[data-contact-form]').forEach((form, index) => {
    const status = $('[data-form-status]', form);
    const submit = $('button[type="submit"]', form);
    if (!status || !submit) return;

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (form.elements._honey?.value) return;
      const originalLabel = submit.innerHTML;
      submit.disabled = true;
      submit.textContent = 'Sending…';
      status.className = 'contact-form-status';
      status.textContent = '';

      const frame = document.createElement('iframe');
      const frameName = `contact-submit-${Date.now()}-${index}`;
      frame.name = frameName;
      frame.hidden = true;
      frame.setAttribute('aria-hidden', 'true');
      document.body.append(frame);

      const previousTarget = form.getAttribute('target');
      form.setAttribute('target', frameName);
      try {
        HTMLFormElement.prototype.submit.call(form);
        form.reset();
        status.className = 'contact-form-status is-success';
        status.textContent = 'Thanks — your message has been sent. I’ll get back to you soon.';
      } catch (error) {
        status.className = 'contact-form-status is-error';
        status.textContent = 'Your message could not be sent right now. Please try again.';
      } finally {
        if (previousTarget === null) form.removeAttribute('target');
        else form.setAttribute('target', previousTarget);
        setTimeout(() => frame.remove(), 10000);
        submit.disabled = false;
        submit.innerHTML = originalLabel;
      }
    });
  });

  // Portrait labels follow the metric titles, keeping both views in sync.
  const portraitBadges = $('[data-portrait-badges]');
  if (portraitBadges) {
    $$('.metrics .metric strong').forEach((title, index) => {
      const badge = document.createElement('div');
      badge.className = `floating-badge badge-${index + 1}`;
      const number = document.createElement('span');
      number.textContent = String(index + 1).padStart(2, '0');
      const label = document.createElement('b');
      label.textContent = title.textContent;
      badge.append(number, label);
      portraitBadges.append(badge);
    });
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
