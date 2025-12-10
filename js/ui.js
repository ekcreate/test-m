document.addEventListener('DOMContentLoaded', () => {

  // New mobile navigation
  function initMobileNav() {
    const toggleButtons = document.querySelectorAll('.nav-toggle-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const body = document.body;

    if (!mobileNavOverlay || toggleButtons.length === 0) return;

    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        mobileNavOverlay.classList.toggle('open');
        button.setAttribute('aria-expanded', !isExpanded);
        body.style.overflow = mobileNavOverlay.classList.contains('open') ? 'hidden' : '';
      });
    });

    // Add event listener to close overlay when a link inside it is clicked
    mobileNavOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        mobileNavOverlay.classList.remove('open');
        body.style.overflow = '';
        toggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    }));

    // Add event listener to close overlay when cta button inside it is clicked
    const ctaButton = mobileNavOverlay.querySelector('.pill-btn');
    if(ctaButton) {
        ctaButton.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('open');
            body.style.overflow = '';
            toggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        });
    }
  }
  initMobileNav();

  // Set active navigation link
  function setActiveNavLink() {
      const currentPage = document.body.dataset.page;
      if (!currentPage) return;

      const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav a');
      navLinks.forEach(link => {
          const linkPage = new URL(link.href).pathname.split('/').pop().replace('.html', '');
          const pageName = (linkPage === 'index' || linkPage === '') ? 'home' : linkPage;
          if (pageName === currentPage) {
              link.classList.add('active');
          }
      });
  }
  setActiveNavLink();

  // Floating messengers
  function initFloatingMessengers() {
    const messengers = document.querySelector('.floating-messengers');
    if (!messengers) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        messengers.classList.add('show');
      } else {
        messengers.classList.remove('show');
      }
    });
  }
  initFloatingMessengers();

  // Modal handling
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    }
  }
  function closeModal(modal) {
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-open-modal]')) {
      openModal(e.target.dataset.openModal);
    } else if (e.target.matches('[data-close-modal]')) {
      closeModal(e.target.closest('.modal-backdrop'));
    } else if (e.target.matches('.modal-backdrop')) {
      closeModal(e.target);
    }
  });


  // Accordions
  document.body.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;
    const body = header.nextElementSibling;
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!expanded));
    if(body) body.classList.toggle('show');
  });


  // Services tabs
  const servicesMenu = document.querySelector('.services-menu');
  if (servicesMenu) {
    servicesMenu.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      document.querySelectorAll('.services-menu button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.service-category').forEach(cat => cat.classList.remove('active'));
      e.target.classList.add('active');
      const target = document.getElementById(e.target.dataset.target);
      if (target) target.classList.add('active');
    });
  }
});
