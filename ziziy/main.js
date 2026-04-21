/* ---- Scroll Reveal ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ---- Hamburger Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    toggleMenu(!drawer.classList.contains('open'));
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) toggleMenu(false);
  });