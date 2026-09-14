document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Language ---------- */
applyLanguage(detectInitialLanguage());
updateHeroStatus();

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
    updateHeroStatus();
    langSwitch.classList.remove('open');
    langCurrent.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Open/closed status (Thu-Mon 12:00-16:00 & 19:00-23:00, Europe/Madrid time) ---------- */
function isRestaurantOpenNow() {
  const SCHEDULE = {
    0: [[720, 960], [1140, 1380]], // Sunday
    1: [[720, 960], [1140, 1380]], // Monday
    2: [],                         // Tuesday - closed
    3: [],                         // Wednesday - closed
    4: [[720, 960], [1140, 1380]], // Thursday
    5: [[720, 960], [1140, 1380]], // Friday
    6: [[720, 960], [1140, 1380]]  // Saturday
  };
  const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  const map = {};
  parts.forEach(p => { map[p.type] = p.value; });
  let hour = parseInt(map.hour, 10);
  if (hour === 24) hour = 0;
  const minutes = hour * 60 + parseInt(map.minute, 10);
  const day = WEEKDAY_MAP[map.weekday];
  return (SCHEDULE[day] || []).some(([start, end]) => minutes >= start && minutes < end);
}

function updateHeroStatus() {
  const heroStatus = document.getElementById('heroStatus');
  const heroStatusText = document.getElementById('heroStatusText');
  if (!heroStatus || !heroStatusText) return;
  const lang = document.documentElement.getAttribute('lang') || 'es';
  const dict = (typeof I18N !== 'undefined' && I18N[lang]) ? I18N[lang] : {};
  const open = isRestaurantOpenNow();
  heroStatus.classList.toggle('is-open', open);
  heroStatus.classList.toggle('is-closed', !open);
  heroStatusText.textContent = open
    ? (dict['hero.statusOpen'] || 'Abierto ahora')
    : (dict['hero.statusClosed'] || 'Cerrado ahora');
}
setInterval(updateHeroStatus, 60000);
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
