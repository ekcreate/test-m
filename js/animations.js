document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.length > 1 && document.querySelector(targetId)) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
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
});
