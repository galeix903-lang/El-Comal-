document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Simple open/closed indicator based on published info (opens 19:00)
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const hour = new Date().getHours();
const isOpenNow = hour >= 19 || hour < 1;
if (isOpenNow) {
  statusBadge.classList.add('is-open');
  statusText.textContent = 'Abierto ahora';
} else {
  statusText.textContent = 'Cerrado ahora · Abre a las 19:00';
}
