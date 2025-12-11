
function initMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const openButton = document.querySelector('.nav-toggle');
  const closeButton = document.getElementById('close-mobile-menu');
  const nav = document.querySelector('nav .main-nav');

  if (!mobileMenu || !openButton || !closeButton || !nav) {
    return;
  }

  const navContainer = mobileMenu.querySelector('.mobile-menu-nav');
  // Проверяем, не было ли меню уже добавлено
  if (navContainer.querySelector('.mobile-nav')) {
      return;
  }

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


function initAjaxForms() {
    const forms = document.querySelectorAll('form[action="send_mail.php"]');
    if (!forms.length) return;

    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const oldMessage = form.nextElementSibling;
            if (oldMessage && oldMessage.classList.contains('form-message')) {
                oldMessage.remove();
            }

            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"], input[type="submit"]');
            let originalButtonText = '';
            if(submitButton) {
                originalButtonText = submitButton.tagName === 'INPUT' ? submitButton.value : submitButton.textContent;
                submitButton.disabled = true;
                if(submitButton.tagName === 'INPUT') {
                    submitButton.value = 'Отправка...';
                } else {
                    submitButton.textContent = 'Отправка...';
                }
            }

            fetch('send_mail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(data => {
                const messageEl = document.createElement('div');
                messageEl.classList.add('form-message');

                if (data.status === 'success') {
                    messageEl.classList.add('success');
                    this.reset();
                } else {
                    messageEl.classList.add('error');
                }
                messageEl.textContent = data.message;
                this.insertAdjacentElement('afterend', messageEl);
            })
            .catch(error => {
                console.error('Ошибка отправки формы:', error);
                const messageEl = document.createElement('div');
                messageEl.classList.add('form-message', 'error');
                messageEl.textContent = error.message || 'Произошла ошибка. Пожалуйста, попробуйте еще раз.';
                this.insertAdjacentElement('afterend', messageEl);
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                     if(submitButton.tagName === 'INPUT') {
                        submitButton.value = originalButtonText;
                    } else {
                        submitButton.textContent = originalButtonText;
                    }
                }
            });
        });
    });
}

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
            if (modal) {
                closeModal(modal);
            }
        });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (event) => {
            if (event.target === backdrop) {
                closeModal(backdrop);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.open').forEach(closeModal);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initAjaxForms();
    initModals();
});
