/* ===================================
   MORELOS CONSTRUYE — JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- NAVBAR SCROLL HIDE/SHOW ---------- */
  const navbar = document.getElementById('navbar');
  const hero = document.querySelector('.hero');
  let lastScrollY = window.scrollY;
  let heroBottom = 0;

  function updateHeroBottom() {
    if (hero) heroBottom = hero.offsetTop + hero.offsetHeight;
  }
  updateHeroBottom();
  window.addEventListener('resize', updateHeroBottom);

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > heroBottom) {
      if (currentScrollY > lastScrollY) {
        navbar.classList.add('navbar--hidden');
      } else {
        navbar.classList.remove('navbar--hidden');
      }
    } else {
      navbar.classList.remove('navbar--hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  /* ---------- MOBILE MENU TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('open');
    });
  });

  /* ---------- ACTIVE NAV LINK HIGHLIGHT ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');

  function highlightNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '/#' + id || a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- STAGGER ANIMATION FOR TIENDA CARDS ---------- */
  const tiendaCards = document.querySelectorAll('.tienda__card');
  const tiendaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tiendaCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
        tiendaObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  if (tiendaCards.length > 0) {
    tiendaCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    tiendaObserver.observe(document.querySelector('.tienda__grid'));
  }

  /* ---------- STAT COUNTER ANIMATION ---------- */
  const stats = document.querySelectorAll('.stat__number');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    stats.forEach(stat => {
      const text = stat.textContent.trim();
      const hasPlus = text.includes('+');
      const target = parseInt(text.replace(/[^0-9]/g, ''));
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * eased);
        stat.textContent = current + (hasPlus ? '+' : '');
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  const statsSection = document.querySelector('.hero__stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  /* ---------- COTIZADOR FORM → WHATSAPP ---------- */
  const form = document.getElementById('cotizadorForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const producto = document.getElementById('producto').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      let text = `¡Hola Morelos Construye! 🏗️%0A%0A`;
      text += `*Nombre:* ${encodeURIComponent(nombre)}%0A`;
      text += `*Teléfono:* ${encodeURIComponent(telefono)}%0A`;
      text += `*Producto de interés:* ${encodeURIComponent(producto)}%0A`;
      if (mensaje) {
        text += `*Mensaje:* ${encodeURIComponent(mensaje)}%0A`;
      }
      text += `%0A_Enviado desde la web de Morelos Construye_`;

      window.open(`https://wa.me/527772582878?text=${text}`, '_blank');
    });
  }

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Extraemos solo el ancla (ej: #inicio de /#inicio)
      const targetId = href.includes('#') ? href.substring(href.indexOf('#')) : null;
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        // Solo prevenimos el comportamiento por defecto si el elemento existe en esta página
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});