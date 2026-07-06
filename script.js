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
  if (progress >= 100) {
    clearInterval(loaderInterval);
    setTimeout(() => {
      loader.classList.add('is-exiting');
      setTimeout(() => {
        loader.classList.add('done');
        loader.style.display = 'none';
        initAnimations();
      }, 850);
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
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ─── Year ───
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()}`;

// ─── Temporary newsletter handoff ───
document.querySelectorAll('[data-newsletter-form]').forEach(form => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value?.trim();
    if (!email) return;

    const subject = encodeURIComponent('Newsletter PWR Design');
    const body = encodeURIComponent(`Cześć,\n\nchcę dołączyć do newslettera PWR Design.\nMój adres e-mail: ${email}\n`);
    window.location.href = `mailto:pwrdesign.pracownia@gmail.com?subject=${subject}&body=${body}`;
  });
});


// ─── Main Animations ───
function initAnimations() {

  // Hero text reveal
  gsap.from('.hero-kicker .line-inner', {
    yPercent: 40,
    duration: 1,
    ease: 'power4.out',
    delay: 0.2
  });

  gsap.from('.title-word', {
    yPercent: 36,
    duration: 1.2,
    stagger: 0.08,
    ease: 'power4.out',
    delay: 0.4
  });

  gsap.from('.hero-desc .line-inner', {
    yPercent: 32,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out',
    delay: 0.9
  });

  gsap.from('.hero-actions', {
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

  // Hero background parallax
  gsap.to('.hero-media img', {
    y: -80,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });


  // ─── Fade Up Elements ───
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.from(el, {
      y: 28,
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
      y: 36,
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
