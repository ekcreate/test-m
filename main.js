// --- Глобальные переменные и утилиты для хлебных крошек ---
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

// --- Внедрение плавающих кнопок мессенджеров ---
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

// --- Инициализация мобильного меню ---
function initMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const openButton = document.querySelector('.nav-toggle');
  const closeButton = document.getElementById('close-mobile-menu');
  const nav = document.querySelector('nav .main-nav');

  if (!mobileMenu || !openButton || !closeButton || !nav) return;

  const navContainer = mobileMenu.querySelector('.mobile-menu-nav');
  if (navContainer.querySelector('.mobile-nav')) return; // Предотвращаем дублирование

  const navClone = nav.cloneNode(true);
  navClone.classList.remove('main-nav');
  navClone.classList.add('mobile-nav');
  navContainer.appendChild(navClone);

  openButton.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
  });

  closeButton.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
}

// --- Плавный скролл к якорям ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.length > 1 && document.querySelector(targetId)) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        targetEl.scrollIntoView({ behavior: 'smooth' });
        const heading = targetEl.querySelector('h2, h3, h4');
        if (heading) {
            setBreadcrumb(pageNames[pageKey] || 'Главная', heading.textContent.trim());
        }
      }
    });
  });
}

// --- Инициализация аккордеонов ---
function initAccordions() {
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
}

// --- Инициализация табов на странице услуг ---
function initTabs() {
  const servicesMenu = document.querySelector('.services-menu');
  if (!servicesMenu) return;

  servicesMenu.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    document.querySelectorAll('.services-menu button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.service-category').forEach(cat => cat.classList.remove('active'));

    button.classList.add('active');
    const target = document.getElementById(button.dataset.target);
    if (target) target.classList.add('active');
  });
}

// --- Обработка модальных окон ---
function initModals() {
    const openButtons = document.querySelectorAll('[data-open-modal]');
    const closeButtons = document.querySelectorAll('[data-close-modal]');

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.openModal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('open');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal(modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-backdrop');
            if (modal) closeModal(modal);
        });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (event) => {
            if (event.target === backdrop) closeModal(backdrop);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.open').forEach(closeModal);
        }
    });
}

// --- Обработка AJAX форм ---
function initAjaxForms() {
    document.querySelectorAll('form[action="send_mail.php"]').forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const oldMessage = form.nextElementSibling;
            if (oldMessage && oldMessage.classList.contains('form-message')) oldMessage.remove();

            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"], input[type="submit"]');
            const originalButtonText = submitButton ? (submitButton.tagName === 'INPUT' ? submitButton.value : submitButton.textContent) : '';

            if (submitButton) {
                submitButton.disabled = true;
                if (submitButton.tagName === 'INPUT') submitButton.value = 'Отправка...';
                else submitButton.textContent = 'Отправка...';
            }

            fetch('send_mail.php', { method: 'POST', body: formData })
            .then(response => response.json().then(data => ({ ok: response.ok, data })))
            .then(({ ok, data }) => {
                const messageEl = document.createElement('div');
                messageEl.classList.add('form-message');
                messageEl.textContent = data.message;
                if (ok) {
                    messageEl.classList.add('success');
                    this.reset();
                } else {
                    messageEl.classList.add('error');
                }
                this.insertAdjacentElement('afterend', messageEl);
            })
            .catch(error => {
                console.error('Ошибка отправки формы:', error);
                const messageEl = document.createElement('div');
                messageEl.classList.add('form-message', 'error');
                messageEl.textContent = 'Произошла критическая ошибка. Пожалуйста, попробуйте еще раз.';
                this.insertAdjacentElement('afterend', messageEl);
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    if (submitButton.tagName === 'INPUT') submitButton.value = originalButtonText;
                    else submitButton.textContent = originalButtonText;
                }
            });
        });
    });
}

// --- Кнопка "Наверх" ---
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  const checkVisibility = () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  };

  // Проверяем состояние при загрузке
  checkVisibility();

  // И добавляем обработчик на скролл
  window.addEventListener('scroll', checkVisibility);

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initBreadcrumb(); // Сбрасываем хлебные крошки
  });
}

// --- Анимация появления элементов при скролле ---
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
  }, { threshold: 0.1 });
  targets.forEach(el => observer.observe(el));
}


// --- DOMContentLoaded: Запускаем все инициализации ---
document.addEventListener('DOMContentLoaded', () => {
    initBreadcrumb();
    injectFloatingMessengers();
    initMobileMenu();
    initSmoothScroll();
    initAccordions();
    initTabs();
    initModals();
    initAjaxForms();
    initBackToTop();
    initReveal();
});
