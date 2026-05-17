/* ── Navigation ────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const sections  = [...document.querySelectorAll('section[id]')];
const navLinks  = [...document.querySelectorAll('.nav-link')];

window.addEventListener('scroll', () => {
  // Scrolled class for glass effect
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Active nav link
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
}, { passive: true });

hamburger.addEventListener('click', () => navbar.classList.toggle('open'));

document.querySelectorAll('.mobile-link').forEach(l =>
  l.addEventListener('click', () => navbar.classList.remove('open'))
);

/* ── Typewriter ─────────────────────────────────────────── */
const phrases = [
  'cloud infrastructure.',
  'CI/CD pipelines.',
  'automation workflows.',
  'scalable systems.',
  'IaC with Terraform.',
  'endpoint management.',
];

const typed = document.getElementById('typed');
let pi = 0, ci = 0, deleting = false;

function tick() {
  const phrase = phrases[pi];
  typed.textContent = deleting ? phrase.slice(0, ci - 1) : phrase.slice(0, ci + 1);
  deleting ? ci-- : ci++;

  let delay = deleting ? 45 : 75;

  if (!deleting && ci === phrase.length) {
    delay = 2200;
    deleting = true;
  } else if (deleting && ci === 0) {
    deleting = false;
    pi = (pi + 1) % phrases.length;
    delay = 350;
  }

  setTimeout(tick, delay);
}

// Start after hero animations settle
setTimeout(tick, 1000);

/* ── Intersection Observer — reveal ─────────────────────── */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    revealIO.unobserve(e.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* ── Counter animation ──────────────────────────────────── */
function animCount(el) {
  const target = +el.dataset.target;
  const dur = 1600;
  const t0 = performance.now();

  const frame = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - (1 - p) ** 3; // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.count').forEach(animCount);
    counterIO.unobserve(e.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat').forEach(el => counterIO.observe(el));

/* ── Stagger timeline items ─────────────────────────────── */
document.querySelectorAll('.tl-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 55}ms`;
});

/* ── Stagger skill cards ─────────────────────────────────── */
document.querySelectorAll('.sk-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
});

/* ── Tilt effect on skill cards ─────────────────────────── */
document.querySelectorAll('.sk-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
    card.style.transform = `translateY(-5px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform .05s linear, box-shadow .3s, border-color .3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .3s var(--ease), box-shadow .3s, border-color .3s';
  });
});

/* ── Animate progress bars when visible ─────────────────── */
const progIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.prog-fill').forEach(bar => {
      bar.style.width = bar.style.getPropertyValue('--pct') || getComputedStyle(bar).getPropertyValue('--pct');
    });
    progIO.unobserve(e.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.edu-card').forEach(el => {
  el.querySelectorAll('.prog-fill').forEach(bar => { bar.style.width = '0'; });
  progIO.observe(el);
});
