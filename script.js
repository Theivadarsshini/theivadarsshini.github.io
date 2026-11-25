// Interactive details: cursor glow, twinkling stars, reveal animations, tilt cards and email form.
const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    glow.style.opacity = '1';
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
});
document.addEventListener('pointerleave', () => { if (glow) glow.style.opacity = '0'; });

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuToggle.setAttribute('aria-label', nav.classList.contains('open') ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Subtle card tilt on desktop.
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    if (window.innerWidth < 800 || !window.matchMedia('(pointer:fine)').matches) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-5px) perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

// Tiny star particles in the background.
const canvas = document.getElementById('stars');
const ctx = canvas?.getContext('2d');
let stars = [];
function resizeStars() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 12)) }, () => ({
    x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + .25, a: Math.random() * .65 + .15,
    speed: Math.random() * .18 + .04, phase: Math.random() * Math.PI * 2
  }));
}
function drawStars(t = 0) {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach(s => {
    const alpha = s.a * (.65 + Math.sin(t * .001 * s.speed + s.phase) * .35);
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(225,220,255,${alpha})`; ctx.fill();
    s.y -= s.speed * .12;
    if (s.y < -3) { s.y = window.innerHeight + 3; s.x = Math.random() * window.innerWidth; }
  });
  requestAnimationFrame(drawStars);
}
if (ctx) { resizeStars(); requestAnimationFrame(drawStars); window.addEventListener('resize', resizeStars); }

// This form opens the visitor's email app; it does not send or store messages itself.
document.getElementById('contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const recipient = 'your.email@example.com'; // Replace with your real email address.
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Hi Theivadarsshini,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);
  document.getElementById('formNote').textContent = 'Opening your email app… replace the demo email address in script.js first.';
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
