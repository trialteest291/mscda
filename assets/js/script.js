/* ============================================================
   MSCDA – Morelos se Construye de Acero  ·  v2.0
   Script Principal — Animaciones e Interactividad
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. NAVBAR — Ocultar/Mostrar al hacer scroll
  // ============================================================
  const header = document.querySelector('.site-header');
  let lastScrollY = 0;
  const scrollThreshold = 80;

  function handleNavbarScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > scrollThreshold) {
      if (currentScrollY > lastScrollY) {
        // Scrolling down → hide
        header.classList.add('hidden');
      } else {
        // Scrolling up → show
        header.classList.remove('hidden');
      }
    } else {
      // At top → always show
      header.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ============================================================
  // 2. MENÚ MÓVIL — Toggle hamburguesa
  // ============================================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('open');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        navToggle.classList.remove('open');
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('open');
      }
    });
  }

  // ============================================================
  // 3. INTERSECTION OBSERVER — Animación .reveal
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ============================================================
  // 4. INTERSECTION OBSERVER — Stagger .tienda__card
  // ============================================================
  const tiendaCards = document.querySelectorAll('.tienda__card');

  if (tiendaCards.length > 0) {
    const cardObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger: each card gets a delay based on index
            var cards = Array.from(tiendaCards);
            var index = cards.indexOf(entry.target);
            var delay = index * 120; // 120ms between each card

            setTimeout(function () {
              entry.target.classList.add('visible');
            }, delay);

            cardObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    tiendaCards.forEach(function (card) {
      cardObserver.observe(card);
    });
  }

  // ============================================================
  // 5. CONTADORES ANIMADOS — animateStats()
  // ============================================================
  function animateStats() {
    var statNumbers = document.querySelectorAll('.stat__number[data-target]');

    if (statNumbers.length === 0) return;

    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute('data-target'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            var prefix = el.getAttribute('data-prefix') || '';
            var duration = 2000;
            var startTime = null;

            function updateCounter(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);

              // Ease-out cubic
              var eased = 1 - Math.pow(1 - progress, 3);
              var current = Math.floor(eased * target);

              el.textContent = prefix + current.toLocaleString('es-MX') + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = prefix + target.toLocaleString('es-MX') + suffix;
              }
            }

            requestAnimationFrame(updateCounter);
            statsObserver.unobserve(el);
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    statNumbers.forEach(function (num) {
      statsObserver.observe(num);
    });
  }

  animateStats();

  // ============================================================
  // 6. COTIZADOR → WHATSAPP
  // ============================================================
  var cotizadorForm = document.getElementById('cotizadorForm');

  if (cotizadorForm) {
    cotizadorForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form data
      var nombre = (document.getElementById('cot-nombre') || {}).value || '';
      var telefono = (document.getElementById('cot-telefono') || {}).value || '';
      var producto = (document.getElementById('cot-producto') || {}).value || '';
      var cantidad = (document.getElementById('cot-cantidad') || {}).value || '';
      var mensaje = (document.getElementById('cot-mensaje') || {}).value || '';

      // Build WhatsApp message
      var text = '¡Hola! Quiero solicitar una cotización:%0A%0A';
      if (nombre) text += '👤 *Nombre:* ' + encodeURIComponent(nombre) + '%0A';
      if (telefono) text += '📱 *Teléfono:* ' + encodeURIComponent(telefono) + '%0A';
      if (producto) text += '📦 *Producto:* ' + encodeURIComponent(producto) + '%0A';
      if (cantidad) text += '🔢 *Cantidad:* ' + encodeURIComponent(cantidad) + '%0A';
      if (mensaje) text += '💬 *Mensaje:* ' + encodeURIComponent(mensaje) + '%0A';

      // Open WhatsApp with the number 527772582878
      var waURL = 'https://wa.me/527772582878?text=' + text;
      window.open(waURL, '_blank');
    });
  }

  // ============================================================
  // 7. SMOOTH SCROLL — Para los anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================================
  // 8. ACTIVE NAV LINK — Highlight on scroll
  // ============================================================
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.navbar__links a[href^="#"]');

  function highlightNavLink() {
    var scrollY = window.scrollY + 200;

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinksAll.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  if (sections.length > 0 && navLinksAll.length > 0) {
    window.addEventListener('scroll', highlightNavLink, { passive: true });
  }

})();
