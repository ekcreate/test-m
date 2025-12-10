document.addEventListener('DOMContentLoaded', () => {
  // Offcanvas menu
  function initOffcanvas() {
    const nav = document.querySelector('nav .main-nav');
    if (!nav) return;

    let backdrop = document.querySelector('.offcanvas-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'offcanvas-backdrop';
      document.body.appendChild(backdrop);
    }

    let panel = document.querySelector('.offcanvas-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'offcanvas-panel';
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
          <span class="contact-chip phone"><img src="assets/icons/phone.svg" alt="" width="16" height="16"><a href="tel:+74951234567">+7 (495) 123-45-67</a></span>
        </div>
      `;
      document.body.appendChild(panel);
    }

    const navContainer = panel.querySelector('.offcanvas-nav');
    navContainer.innerHTML = '';
    const navClone = nav.cloneNode(true);
    navClone.classList.remove('main-nav');
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
      btn.addEventListener('click', openOffcanvas);
    });
    backdrop.addEventListener('click', closeOffcanvas);
    panel.querySelector('.offcanvas-close')?.addEventListener('click', closeOffcanvas);

    // Add event listener to close offcanvas when a link inside it is clicked
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeOffcanvas));

    const offcanvasCtaButton = panel.querySelector('.offcanvas-cta button[data-open-modal]');
    if (offcanvasCtaButton) {
      offcanvasCtaButton.addEventListener('click', () => {
        closeOffcanvas();
        // The main modal listener will handle opening the modal
      });
    }
  }
  initOffcanvas();

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
