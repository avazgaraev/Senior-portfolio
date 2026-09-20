(() => {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const page = document.body.dataset.page;
  const homeLink = section => page === 'home' ? `#${section}` : `index.html#${section}`;
  const current = name => page === name ? ' class="active" aria-current="page"' : '';
  const garaActive = page === 'projects' || page === 'ai-department';
  const solutions = [
    { page: 'projects', href: 'projects.html', label: 'Software Solutions' },
    { page: 'ai-department', href: 'your-ai-department.html', label: 'Your AI Department' }
  ];

  // Shared by every page. Make all navbar content changes here.
  header.innerHTML = `
    <div class="container nav-shell">
      <a class="brand" href="index.html" aria-label="Avaz Garayev home">
        <span class="brand-mark"><img src="assets/img/garatech.png" alt="Gara Tech" width="2164" height="727" /></span>
        <span>Avaz Garayev</span>
      </a>
      <button class="menu-toggle" type="button" aria-label="Toggle navigation" aria-controls="primary-navigation" aria-expanded="false">
        <span></span><span></span>
      </button>
      <nav class="nav-links" id="primary-navigation" aria-label="Primary navigation">
        <a href="${homeLink('home')}"${current('home')}>Home</a>
        <a href="${homeLink('about')}">About</a>
        <a href="${homeLink('experience')}">Experience</a>
        <div class="nav-dropdown">
          <button class="nav-dropdown-toggle${garaActive ? ' active' : ''}" type="button" aria-expanded="false" aria-controls="gara-tech-menu">
            Gara Tech <span class="nav-chevron" aria-hidden="true"></span>
          </button>
          <div class="nav-dropdown-menu" id="gara-tech-menu" hidden>
            ${solutions.map(item => `<a href="${item.href}"${current(item.page)}>${item.label}</a>`).join('')}
          </div>
        </div>
        <a href="blog.html"${current('blog')}>Blog</a>
        <a href="${homeLink('contact')}">Contact</a>
      </nav>
      <div class="nav-actions">
        <a class="icon-link" href="https://linkedin.com/in/avaz-garayev" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
        <a class="icon-link" href="mailto:avazgarayev@gmail.com" aria-label="Email">@</a>
        <a class="btn btn-ghost btn-small" href="assets/resume/Avaz_Garayev_Resume.pdf" target="_blank" rel="noreferrer">Resume <span aria-hidden="true">↗</span></a>
      </div>
    </div>`;

  const menuButton = header.querySelector('.menu-toggle');
  const nav = header.querySelector('.nav-links');
  const dropdown = header.querySelector('.nav-dropdown');
  const dropdownButton = header.querySelector('.nav-dropdown-toggle');
  const dropdownMenu = header.querySelector('.nav-dropdown-menu');
  const mobileLayout = matchMedia('(max-width: 1050px)');

  const setDropdown = open => {
    dropdownButton.setAttribute('aria-expanded', String(open));
    dropdownMenu.hidden = !open;
  };
  const setMenu = open => {
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    if (!open) setDropdown(false);
  };

  menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  dropdownButton.addEventListener('click', () => setDropdown(dropdownMenu.hidden));
  dropdownButton.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setDropdown(true);
      dropdownMenu.querySelector('a').focus();
    }
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', event => {
    if (!dropdown.contains(event.target)) setDropdown(false);
    if (!header.contains(event.target)) setMenu(false);
  });
  header.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!dropdownMenu.hidden) {
      event.preventDefault();
      setDropdown(false);
      dropdownButton.focus();
    } else if (nav.classList.contains('open')) {
      event.preventDefault();
      setMenu(false);
      menuButton.focus();
    }
  });
  header.addEventListener('focusout', event => {
    if (!dropdown.contains(event.relatedTarget)) setDropdown(false);
    if (!header.contains(event.relatedTarget)) setMenu(false);
  });
  mobileLayout.addEventListener('change', () => setMenu(false));

  const renderFooterNavigation = () => {
    document.querySelectorAll('[data-footer-navigation]').forEach(footerNav => {
      footerNav.innerHTML = `
        <b>Navigate</b>
        <a href="${homeLink('about')}">About</a>
        <a href="${homeLink('experience')}">Experience</a>
        ${solutions.map(item => `<a href="${item.href}">${item.label}</a>`).join('')}
        <a href="blog.html">Blog</a>`;
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooterNavigation, { once: true });
  } else {
    renderFooterNavigation();
  }
})();
