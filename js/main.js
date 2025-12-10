document.addEventListener('DOMContentLoaded', () => {
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
});
