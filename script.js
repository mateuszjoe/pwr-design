/* ============================================
   PWR DESIGN — Premium Interactions
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

// ─── Loader ───
const loader = document.getElementById('loader');
const loaderNum = document.getElementById('loader-num');
const loaderLine = loader.querySelector('.loader-line');
let progress = 0;

const loaderInterval = setInterval(() => {
  progress += Math.random() * 12;
  if (progress > 100) progress = 100;
  loaderNum.textContent = Math.round(progress);
  loaderLine.style.setProperty('--w', progress + '%');
  loaderLine.querySelector('::after') // won't work, use CSS instead

  if (progress >= 100) {
    clearInterval(loaderInterval);
    setTimeout(() => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
        onComplete: () => {
          loader.classList.add('done');
          loader.style.display = 'none';
          initAnimations();
        }
      });
    }, 400);
  }
}, 80);

// Update loader line width via CSS custom property
const style = document.createElement('style');
document.head.appendChild(style);

const updateLoaderLine = () => {
  style.textContent = `.loader-line::after { width: ${progress}% !important; }`;
  if (progress < 100) requestAnimationFrame(updateLoaderLine);
};
updateLoaderLine();


// ─── Pen Trail ───
const trailCanvas = document.getElementById('pen-trail');
if (trailCanvas && window.matchMedia('(pointer: fine)').matches) {
  const ctx = trailCanvas.getContext('2d');
  let trailPoints = [];
  const maxPoints = 40;

  const resizeCanvas = () => {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('mousemove', (e) => {
    trailPoints.push({ x: e.clientX, y: e.clientY, life: 1.0 });
    if (trailPoints.length > maxPoints) trailPoints.shift();
  });

  const drawTrail = () => {
    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    if (trailPoints.length > 2) {
      for (let i = 1; i < trailPoints.length; i++) {
        const p = trailPoints[i];
        const prev = trailPoints[i - 1];
        const progress = i / trailPoints.length;

        p.life -= 0.02;
        if (p.life <= 0) continue;

        const alpha = p.life * progress * 0.12;
        const width = progress * 1.5;

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(200, 149, 108, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    trailPoints = trailPoints.filter(p => p.life > 0);
    requestAnimationFrame(drawTrail);
  };

  drawTrail();
}

// ─── Custom Cursor ───
const cursor = document.querySelector('.cursor');
const cursorPen = document.querySelector('.cursor-pen');
const cursorRing = document.querySelector('.cursor-ring');

let cursorX = -100, cursorY = -100;
let penX = -100, penY = -100;
let ringX = -100, ringY = -100;

if (cursor && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  const animateCursor = () => {
    penX += (cursorX - penX) * 0.45;
    penY += (cursorY - penY) * 0.45;
    ringX += (cursorX - ringX) * 0.12;
    ringY += (cursorY - ringY) * 0.12;

    cursor.style.transform = `translate(${penX}px, ${penY}px)`;
    cursorRing.style.left = `${ringX - penX}px`;
    cursorRing.style.top = `${ringY - penY}px`;

    requestAnimationFrame(animateCursor);
  };

  animateCursor();
} else if (cursor) {
  cursor.style.display = 'none';
}


// ─── Magnetic Buttons ───
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
});


// ─── Navigation ───
const nav = document.getElementById('nav');
const burger = document.getElementById('nav-burger');
const mobileNav = document.getElementById('mobile-nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  burger.classList.toggle('active');
  burger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('[data-mobile-nav]').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 80 },
        duration: 1.2,
        ease: 'power3.inOut'
      });
    }
  });
});

// Load ScrollTo plugin inline since we're using CDN
gsap.registerPlugin({
  name: 'scrollTo',
  init(target, value) {
    // Fallback: use native smooth scroll
  }
});

// Override smooth scroll with native for simplicity
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ─── Year ───
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()}`;


// ─── Hero Particles ───
const particlesContainer = document.getElementById('hero-particles');
if (particlesContainer) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('hero-particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    particlesContainer.appendChild(p);

    gsap.to(p, {
      opacity: Math.random() * 0.5 + 0.1,
      scale: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to(p, {
      y: `random(-60, 60)`,
      x: `random(-40, 40)`,
      duration: Math.random() * 8 + 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
}


// ─── Main Animations ───
function initAnimations() {

  // Hero text reveal
  gsap.from('.hero-kicker .line-inner', {
    yPercent: 100,
    duration: 1,
    ease: 'power4.out',
    delay: 0.2
  });

  gsap.from('.title-word', {
    yPercent: 120,
    opacity: 0,
    duration: 1.2,
    stagger: 0.08,
    ease: 'power4.out',
    delay: 0.4
  });

  gsap.from('.hero-desc .line-inner', {
    yPercent: 100,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out',
    delay: 0.9
  });

  gsap.from('.hero-actions', {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power3.out',
    delay: 1.2
  });

  gsap.from('.hero-scroll-hint', {
    opacity: 0,
    duration: 1,
    delay: 1.5
  });

  // Hero images
  gsap.from('#hero-img-main', {
    opacity: 0,
    scale: 0.9,
    y: 60,
    duration: 1.4,
    ease: 'power3.out',
    delay: 0.6
  });

  gsap.from('#hero-img-float', {
    opacity: 0,
    x: -40,
    y: 40,
    duration: 1.2,
    ease: 'power3.out',
    delay: 1
  });

  // Hero parallax on scroll
  gsap.to('#hero-img-main', {
    y: -80,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('#hero-img-float', {
    y: -40,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });


  // ─── Fade Up Elements ───
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });


  // ─── Section Titles ───
  gsap.utils.toArray('.section-title, .manifesto-text, .contact-title, .portrait-text h2').forEach(title => {
    gsap.from(title, {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });


  // ─── Kickers ───
  gsap.utils.toArray('.kicker').forEach(k => {
    gsap.from(k, {
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: k,
        start: 'top 90%'
      }
    });
  });


  // ─── Image Reveals ───
  gsap.utils.toArray('.img-reveal').forEach(wrap => {
    const img = wrap.querySelector('img');

    gsap.fromTo(wrap, {
      clipPath: 'inset(100% 0 0 0)'
    }, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.4,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: wrap,
        start: 'top 80%'
      }
    });

    gsap.from(img, {
      scale: 1.3,
      duration: 1.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: wrap,
        start: 'top 80%'
      }
    });
  });


  // ─── Parallax Images ───
  gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.to(img, {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.parallax-wrap'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });


  // ─── Offer Cards ───
  gsap.utils.toArray('.offer-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.offer-grid',
        start: 'top 80%'
      }
    });
  });


  // ─── Gallery Horizontal Scroll ───
  const galleryTrack = document.getElementById('gallery-track');
  const gallerySection = document.querySelector('.gallery-section');
  if (galleryTrack && gallerySection && window.innerWidth > 768) {
    const setupGallery = () => {
      const scrollAmount = galleryTrack.scrollWidth - gallerySection.offsetWidth;
      if (scrollAmount <= 0) return;

      // Pin the gallery-scroll container (not the whole section)
      // so the header scrolls away naturally first
      const galleryScroll = document.getElementById('gallery-scroll');

      gsap.to(galleryTrack, {
        x: -scrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: galleryScroll,
          start: 'top top+=60',
          end: `+=${scrollAmount + window.innerHeight * 0.3}`,
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true
        }
      });
    };

    // Run immediately since initAnimations is called after loader
    setTimeout(() => {
      setupGallery();
      ScrollTrigger.refresh();
    }, 100);
  }


  // ─── Process Timeline Fill ───
  const processFill = document.getElementById('process-line-fill');
  if (processFill) {
    gsap.to(processFill, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 60%',
        end: 'bottom 60%',
        scrub: 1
      }
    });
  }



}
