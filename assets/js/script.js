document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Language ---------- */
applyLanguage(detectInitialLanguage());

const langSwitch = document.getElementById('langSwitch');
const langCurrent = document.getElementById('langCurrent');
const langMenu = document.getElementById('langMenu');

langCurrent.addEventListener('click', () => {
  const isOpen = langSwitch.classList.toggle('open');
  langCurrent.setAttribute('aria-expanded', String(isOpen));
});
langMenu.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', () => {
    applyLanguage(li.getAttribute('data-lang'));
    langSwitch.classList.remove('open');
    langCurrent.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('click', (e) => {
  if (!langSwitch.contains(e.target)) {
    langSwitch.classList.remove('open');
    langCurrent.setAttribute('aria-expanded', 'false');
  }
});

/* ---------- Navbar scroll state ---------- */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('is-scrolled', window.scrollY > 40);
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 720 && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ---------- Reveal on scroll ---------- */
const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

/* ---------- Gallery lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxPanel = document.getElementById('lightboxPanel');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const img = tile.querySelector('img');
    lightboxPanel.innerHTML = '';
    if (img) lightboxPanel.appendChild(img.cloneNode(true));
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

/* ---------- Pause hero Ken Burns animation when off-screen ---------- */
const heroSection = document.querySelector('.hero');
const heroPhoto = document.querySelector('.hero-photo');
if (heroSection && heroPhoto && 'IntersectionObserver' in window) {
  const heroIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      heroPhoto.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });
  heroIO.observe(heroSection);
}
