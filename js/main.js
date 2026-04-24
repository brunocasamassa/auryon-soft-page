/* ==========================================================================
   Bruno Casamassa — main.js
   Loader, custom cursor, GSAP reveals, phone timer, São Paulo clock.
   ========================================================================== */

(function() {

  // =========================================================================
  // LOADER — counts 00 → 100 while page assets settle
  // =========================================================================
  const loader = document.getElementById('loader');
  const countEl = document.querySelector('[data-count]');

  function runLoader(onDone) {
    if (!loader || !countEl) { onDone && onDone(); return; }
    let n = 0;
    const tick = () => {
      // ease-out toward 100
      const step = Math.max(1, Math.round((100 - n) * 0.05));
      n = Math.min(100, n + step);
      countEl.textContent = String(n).padStart(2, '0');
      if (n < 100) {
        setTimeout(tick, 40);
      } else {
        setTimeout(() => {
          loader.classList.add('done');
          onDone && onDone();
        }, 300);
      }
    };
    tick();
  }

  // =========================================================================
  // CUSTOM CURSOR
  // =========================================================================
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorState = { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: 0, ty: 0 };

  if (cursor && cursorDot && window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorState.tx = e.clientX;
      cursorState.ty = e.clientY;
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    function cursorTick() {
      cursorState.x += (cursorState.tx - cursorState.x) * 0.18;
      cursorState.y += (cursorState.ty - cursorState.y) * 0.18;
      cursor.style.transform = `translate(${cursorState.x}px, ${cursorState.y}px)`;
      requestAnimationFrame(cursorTick);
    }
    cursorTick();

    document.querySelectorAll('[data-cursor]').forEach(el => {
      const mode = el.getAttribute('data-cursor');
      el.addEventListener('mouseenter', () => {
        cursor.classList.remove('hover', 'media');
        cursor.classList.add(mode === 'media' ? 'media' : 'hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover', 'media');
      });
    });
  }

  // =========================================================================
  // HERO / TITLE REVEAL — GSAP staggered
  // =========================================================================
  function runHeroReveal() {
    if (typeof gsap === 'undefined') return;

    // split words per .line of any [data-split] title
    document.querySelectorAll('[data-split] .word').forEach(word => {
      word.style.transform = 'translateY(110%)';
    });

    gsap.to('.hero-title .word', {
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.08,
      delay: 0.1,
    });
    gsap.from('.hero-meta-line, .hero-sub, .hero-cta, .hero-ticker', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 0.8,
    });
  }

  // =========================================================================
  // SCROLL-TRIGGERED REVEALS
  // =========================================================================
  function runScrollReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // fallback: IntersectionObserver for [data-reveal]
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 });
      document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // titles with [data-split] — animate words when in view
    document.querySelectorAll('section .section-title[data-split], .contact-title[data-split]').forEach(title => {
      const words = title.querySelectorAll('.word');
      gsap.set(words, { y: '110%' });
      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            y: 0,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.07,
          });
        }
      });
    });

    // generic reveal
    document.querySelectorAll('[data-reveal]').forEach(el => {
      gsap.set(el, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
        }
      });
    });
  }

  // =========================================================================
  // PHONE TIMER — animates countdown + progress ring
  // =========================================================================
  function runPhoneTimer() {
    const numEl = document.getElementById('timer-num');
    const ringEl = document.getElementById('timer-fg');
    if (!numEl || !ringEl) return;

    const CIRC = 2 * Math.PI * 88; // r=88 in viewBox
    ringEl.setAttribute('stroke-dasharray', String(CIRC));

    let total = 47 * 60 + 32; // 47:32
    const start = total;
    let last = performance.now();

    function fmt(sec) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function loop(now) {
      const dt = (now - last) / 1000;
      last = now;
      total = Math.max(0, total - dt);
      numEl.textContent = fmt(total);
      const progress = 1 - total / start;
      const offset = CIRC - (CIRC * (1 - progress * 0.35)); // slow visible progress
      ringEl.setAttribute('stroke-dashoffset', String(offset));
      if (total > 0) requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // =========================================================================
  // LIVE CLOCK — São Paulo time in footer
  // =========================================================================
  function runClock() {
    const el = document.getElementById('footer-time');
    if (!el) return;

    function update() {
      const now = new Date();
      const spTime = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      el.textContent = `SP · ${spTime}`;
    }
    update();
    setInterval(update, 1000);
  }

  // =========================================================================
  // SMOOTH ANCHOR SCROLL
  // =========================================================================
  function runAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 40, behavior: 'smooth' });
      });
    });
  }

  // =========================================================================
  // INIT
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    runLoader(() => {
      runHeroReveal();
    });
    // run non-blocking pieces
    setTimeout(() => {
      runScrollReveals();
      runPhoneTimer();
      runClock();
      runAnchors();
    }, 300);
  });

})();
