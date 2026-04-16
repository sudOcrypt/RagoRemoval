/* ═══════════════════════════════════════════════════════════════
   RAGO REMOVAL — Main Script
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── LOADER ───────────────────────────────────────────────────
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // trigger hero animations
      initHeroAnimations();
    }, 1600);
  });

  // ─── HERO ANIMATIONS ──────────────────────────────────────────
  function initHeroAnimations() {
    const fadeUps = document.querySelectorAll('#heroContent .animate-fadeup');
    const fadeIns = document.querySelectorAll('#heroContent .animate-fadein');

    fadeUps.forEach(el => {
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    });

    fadeIns.forEach(el => {
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s ease';
        el.style.opacity = '1';
      }, delay);
    });
  }

  // ─── PARTICLES ────────────────────────────────────────────────
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const left  = Math.random() * 100;
      const dur   = 8 + Math.random() * 14;
      const delay = Math.random() * 12;
      const drift = (Math.random() - 0.5) * 120;
      const size  = 2 + Math.random() * 3;
      p.style.cssText = `
        left: ${left}%;
        bottom: -10px;
        width: ${size}px;
        height: ${size}px;
        --dur: ${dur}s;
        --delay: ${delay}s;
        --drift: ${drift}px;
        opacity: 0;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  // ─── NAV SCROLL EFFECT ────────────────────────────────────────
  const nav = document.getElementById('nav');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Sticky nav style — only go opaque after scrolling past the hero fold
    if (y > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Back-to-top button
    if (y > 500) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }

    // Hide scroll indicator
    const scrollInd = document.getElementById('scrollIndicator');
    if (scrollInd) {
      scrollInd.style.opacity = y > 80 ? '0' : '1';
    }
    // No parallax — background-attachment: fixed handles it via CSS

  }, { passive: true });

  // ─── BACK TO TOP ──────────────────────────────────────────────
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── HAMBURGER / MOBILE DRAWER ────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileDrawer.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ─── SCROLL REVEAL ────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── REVIEWS CAROUSEL ─────────────────────────────────────────
  const track = document.getElementById('reviewsTrack');
  const cards = track ? track.querySelectorAll('.review-card') : [];
  const dotsContainer = document.getElementById('reviewDots');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');

  if (track && cards.length > 0) {
    let current = 0;
    let perView = getPerView();
    let total = Math.ceil(cards.length / perView);
    let autoTimer;
    const gap = 24;

    function getPerView() {
      if (window.innerWidth < 640)  return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function setCardWidths() {
      const wrapWidth = track.parentElement.offsetWidth;
      const cardW = (wrapWidth - (perView - 1) * gap) / perView;
      cards.forEach(c => {
        c.style.width = cardW + 'px';
        c.style.minWidth = cardW + 'px';
      });
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'review-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', `Go to review group ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, total - 1));
      const cardWidth = cards[0].offsetWidth + gap;
      track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
      buildDots();
      resetAuto();
    }

    function next() { goTo(current < total - 1 ? current + 1 : 0); }
    function prev() { goTo(current > 0 ? current - 1 : total - 1); }

    function startAuto() { autoTimer = setInterval(next, 5500); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Touch / swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    });

    window.addEventListener('resize', () => {
      const newPer = getPerView();
      perView = newPer;
      total = Math.ceil(cards.length / perView);
      current = 0;
      setCardWidths();
      goTo(0);
    });

    setCardWidths();
    buildDots();
    startAuto();
  }

  // ─── CONTACT FORM ─────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = 'rgba(239, 68, 68, 0.6)';
          field.style.boxShadow  = '0 0 0 3px rgba(239, 68, 68, 0.08)';
          valid = false;
        }
      });

      if (!valid) {
        const firstEmpty = [...contactForm.querySelectorAll('[required]')].find(f => !f.value.trim());
        if (firstEmpty) firstEmpty.focus();
        return;
      }

      // Simulate submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('visible');
      }, 1200);
    });

    // Live validation clearing
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.style.boxShadow   = '';
      });
    });
  }

  // ─── SET YEAR ─────────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── ACTIVE NAV LINK ON SCROLL ────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? '#22c55e'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ─── SMOOTH ANCHOR CLICKS ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      if (anchor.classList.contains('service-cta')) return;
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── CARD TILT EFFECT (subtle 3D) ────────────────────────────
  document.querySelectorAll('.service-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─── COUNTER ANIMATION ────────────────────────────────────────
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNums = entry.target.querySelectorAll('.stat-num');
        statNums.forEach(el => {
          const text = el.textContent.trim();
          if (text === '500+') animateCounter(el, 500, '+');
          else if (text === '5★') { /* keep as-is */ }
          else if (text === 'Same Day') { /* keep as-is */ }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // ─── POPUP MODAL ──────────────────────────────────────────────
  const popupOverlay  = document.getElementById('popupOverlay');
  const popupClose    = document.getElementById('popupClose');
  const popupForm     = document.getElementById('popupForm');
  const popupSuccess  = document.getElementById('popupSuccess');
  const popupSuccessClose = document.getElementById('popupSuccessClose');

  function openPopup() {
    if (popupOverlay) popupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    if (popupOverlay) popupOverlay.classList.remove('active');
    document.body.style.overflow = '';

    // Reset popup to fresh state so re-opening always shows the form
    if (popupForm) {
      popupForm.reset();
      popupForm.classList.remove('hidden');
      const submit = popupForm.querySelector('button[type="submit"]');
      if (submit) { submit.innerHTML = 'Request My Free Pickup <i class="ri-arrow-right-line"></i>'; submit.disabled = false; }
      popupForm.querySelectorAll('.popup-field').forEach(f => f.style.borderColor = '');
    }
    if (popupSuccess) popupSuccess.classList.remove('visible');
  }

  // Auto-open after 5 seconds (only once per session)
  if (!sessionStorage.getItem('popupShown')) {
    setTimeout(() => {
      openPopup();
      sessionStorage.setItem('popupShown', '1');
    }, 5000);
  }

  // Close on X button
  if (popupClose) popupClose.addEventListener('click', closePopup);

  // Close on backdrop click
  if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) closePopup();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });

  function openPopupWithService(serviceValue) {
    if (serviceValue) {
      const radio = popupOverlay.querySelector(`input[name="popup-service"][value="${serviceValue}"]`);
      if (radio) radio.checked = true;
    }
    openPopup();
  }

  document.querySelectorAll('.service-card[data-service] .service-cta').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const card = link.closest('.service-card');
      openPopupWithService(card.dataset.service);
    });
  });

  document.querySelectorAll('.service-card[data-service]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('.service-cta')) return;
      openPopupWithService(card.dataset.service);
    });
  });

  // Popup form submit
  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name  = popupForm.querySelector('[name="popup-name"]');
      const phone = popupForm.querySelector('[name="popup-phone"]');
      let valid = true;

      [name, phone].forEach(f => {
        if (f && !f.value.trim()) {
          f.closest('.popup-field').style.borderColor = 'rgba(239,68,68,0.6)';
          valid = false;
        }
      });

      if (!valid) return;

      const submit = popupForm.querySelector('button[type="submit"]');
      submit.textContent = 'Sending…';
      submit.disabled = true;

      setTimeout(() => {
        popupForm.classList.add('hidden');
        if (popupSuccess) popupSuccess.classList.add('visible');
      }, 1000);
    });

    // Clear error styles on input
    popupForm.querySelectorAll('input').forEach(f => {
      f.addEventListener('input', () => {
        const wrap = f.closest('.popup-field');
        if (wrap) wrap.style.borderColor = '';
      });
    });
  }

  // Success close
  if (popupSuccessClose) {
    popupSuccessClose.addEventListener('click', closePopup);
  }

});

