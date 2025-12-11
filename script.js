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
  wrap.className = 'floating-messengers messengers';
  wrap.innerHTML = `
    <a class="messenger-icon wa" href="https://wa.me/74951234567" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp">
        <i class="fa-brands fa-whatsapp"></i>
    </a>
    <a class="messenger-icon tg" href="https://t.me/username" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram">
        <i class="fa-brands fa-telegram"></i>
    </a>
  `;
  document.body.appendChild(wrap);
}
injectFloatingMessengers();


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
