const pageKey = document.body.dataset.page || '';
const breadcrumbs = document.querySelector('.breadcrumbs');
const breadcrumbsText = document.getElementById('breadcrumbs-text');
const pageNames = {
  home: 'Главная',
  about: 'О компании',
  services: 'Услуги',
  price: 'Прайс-лист',
  regulations: 'Нормативная база',
  news: 'Новости',
  blog: 'Блог',
  faq: 'Вопросы-Ответы',
  contacts: 'Контакты'
};

function setBreadcrumb(baseText, sectionText) {
  if (!breadcrumbsText) return;
  if (sectionText) {
    breadcrumbsText.textContent = `Главная > ${baseText} > ${sectionText}`;
  } else {
    breadcrumbsText.textContent = baseText === 'Главная' ? 'Главная' : `Главная > ${baseText}`;
  }
}

function initBreadcrumb() {
  if (!breadcrumbs) return;
  const base = pageNames[pageKey] || 'Главная';
  if (pageKey === 'home') {
    breadcrumbs.classList.remove('show');
    setBreadcrumb('Главная');
  } else {
    breadcrumbs.classList.add('show');
    setBreadcrumb(base);
  }
}

initBreadcrumb();

function injectFloatingMessengers() {
  if (document.querySelector('.floating-messengers')) return;
  const wrap = document.createElement('div');
  wrap.className = 'floating-messengers';
  wrap.innerHTML = `
    <a class="whatsapp" href="#" aria-label="WhatsApp">WA</a>
    <a class="telegram" href="#" aria-label="Telegram">TG</a>
  `;
  document.body.appendChild(wrap);
}
injectFloatingMessengers();

// Offcanvas menu
function initOffcanvas() {
  const nav = document.querySelector('nav .main-nav');
  if (!nav) return;

  let backdrop = document.querySelector('.offcanvas-backdrop');
  let panel = document.querySelector('.offcanvas-panel');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'offcanvas-backdrop';
    document.body.appendChild(backdrop);
  }
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'offcanvas-panel';
    document.body.appendChild(panel);
  }

  panel.innerHTML = `
    <div class="offcanvas-header">
      <h3>Меню</h3>
      <button class="offcanvas-close" aria-label="Закрыть">×</button>
    </div>
    <div class="offcanvas-nav"></div>
    <div class="offcanvas-cta">
      <button class="pill-btn" type="button" data-open-modal="lead-modal">Оставить заявку</button>
      <a class="ghost-btn" href="tel:+74951234567">Позвонить</a>
    </div>
    <div class="offcanvas-contacts">
      <div class="contact-chip phone"><svg viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l1.47-1.47a1 1 0 0 1 1-.24 11.05 11.05 0 0 0 3.46.55 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h2.78a1 1 0 0 1 1 1 11.05 11.05 0 0 0 .55 3.46 1 1 0 0 1-.25 1Z" fill="currentColor"/></svg><a href="tel:+74951234567">+7 (495) 123-45-67</a></div>
    </div>
  `;

  const navContainer = panel.querySelector('.offcanvas-nav');
  navContainer.innerHTML = '';
  const navClone = nav.cloneNode(true);
  navClone.classList.remove('main-nav');
  navClone.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('megamenu'));
  navContainer.appendChild(navClone);

  function closeOffcanvas() {
    panel.classList.remove('open');
    backdrop.classList.remove('show');
  }
  function openOffcanvas() {
    panel.classList.add('open');
    backdrop.classList.add('show');
  }

  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.onclick = openOffcanvas;
  });
  backdrop.onclick = closeOffcanvas;
  panel.querySelector('.offcanvas-close')?.addEventListener('click', closeOffcanvas);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeOffcanvas));

  // Accordion for dropdowns inside offcanvas
  navContainer.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
      const submenu = link.nextElementSibling;
      if (submenu && submenu.classList.contains('dropdown-menu')) {
        e.preventDefault();
        submenu.classList.toggle('show');
      }
    });
  });
}
initOffcanvas();

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.length > 1 && document.querySelector(targetId)) {
      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      targetEl.scrollIntoView({ behavior: 'smooth' });
      const heading = targetEl.querySelector('h2, h3, h4') || document.querySelector(`${targetId} h2`);
      setBreadcrumb(pageNames[pageKey] || 'Главная', heading ? heading.textContent.trim() : '');
    }
  });
});

// Disable desktop dropdowns (offcanvas handles navigation)
function disableDropdowns() {
  document.querySelectorAll('.main-nav .dropdown-menu').forEach(menu => menu.classList.remove('show'));
  document.querySelectorAll('.main-nav .dropdown-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
}
disableDropdowns();

// Accordions
document.querySelectorAll('.accordion').forEach(acc => {
  acc.addEventListener('click', e => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;
    const body = header.nextElementSibling;
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('show');
  });
});

// Services tabs
document.querySelectorAll('.services-menu button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.services-menu button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.service-category').forEach(cat => cat.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.target);
    if (target) target.classList.add('active');
    updateBreadcrumbs('#services');
  });
});

// Modal handling
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.style.display = 'flex'; modal.setAttribute('aria-hidden', 'false'); }
}
function closeModal(modal) {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.openModal));
});
document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.closest('.modal-backdrop')));
});
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal(backdrop);
  });
});

// Back to top + breadcrumbs on scroll
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  if (window.scrollY > 400) backToTop.classList.add('show'); else backToTop.classList.remove('show');
});
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  initBreadcrumb();
});

// Reveal on scroll
function initReveal() {
  const targets = document.querySelectorAll('.section, .card, .service-card, .news-item, .blog-post, .faq-group, .cta, .accordion, .hero');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('reveal-visible'));
    return;
  }
  targets.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => observer.observe(el));
}
initReveal();

