
function initMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const openButton = document.querySelector('.nav-toggle');
  const closeButton = document.getElementById('close-mobile-menu');
  const nav = document.querySelector('nav .main-nav');

  if (!mobileMenu || !openButton || !closeButton || !nav) {
    return;
  }

  const navContainer = mobileMenu.querySelector('.mobile-menu-nav');
  const navClone = nav.cloneNode(true);
  navClone.classList.remove('main-nav');
  navClone.classList.add('mobile-nav');
  navContainer.appendChild(navClone);

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  openButton.addEventListener('click', openMenu);
  closeButton.addEventListener('click', closeMenu);
}

initMobileMenu();
