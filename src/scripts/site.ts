// Site-wide behaviour: smooth scroll, reveals, clock, theme, header, menu.
import Lenis from 'lenis';

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Smooth scroll ──────────────────────────────────────── */
let lenis: Lenis | null = null;
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.09, anchors: { offset: -40 }, autoRaf: true });
}
(window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;

/* ── Reveal on scroll ───────────────────────────────────── */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
);
document.querySelectorAll('[data-reveal], .lines, [data-draw-group]').forEach((el) => {
  // Anything already in the first screen reveals straight away, without waiting on the observer.
  if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add('is-in');
  else io.observe(el);
});

/* ── Clock (Tiruchirappalli, IST) ───────────────────────── */
const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
const fmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kolkata',
});
const tick = () => {
  const t = fmt.format(new Date());
  clocks.forEach((c) => (c.textContent = t));
};
tick();
setInterval(tick, 1000);

/* ── Theme ──────────────────────────────────────────────── */
const setTheme = (t: 'light' | 'dark') => {
  root.dataset.theme = t;
  try {
    localStorage.setItem('theme', t);
  } catch {}
  window.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  document.querySelectorAll<HTMLButtonElement>('[data-theme-set]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.themeSet === t));
  });
};
document.querySelectorAll<HTMLButtonElement>('[data-theme-set]').forEach((b) => {
  b.setAttribute('aria-pressed', String(b.dataset.themeSet === root.dataset.theme));
  b.addEventListener('click', () => setTheme(b.dataset.themeSet as 'light' | 'dark'));
});

/* ── Header: hide on scroll down, show on scroll up ─────── */
const header = document.querySelector<HTMLElement>('[data-header]');
let lastY = window.scrollY;
const onScroll = () => {
  const y = window.scrollY;
  if (header) header.classList.toggle('is-hidden', y > 160 && y > lastY + 2);
  if (y < lastY - 2 || y < 160) header?.classList.remove('is-hidden');
  lastY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Mobile menu ────────────────────────────────────────── */
const menu = document.querySelector<HTMLElement>('[data-menu]');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeMenu = () => {
  menu?.classList.remove('is-open');
  openBtn?.setAttribute('aria-expanded', 'false');
  lenis?.start();
};
openBtn?.addEventListener('click', () => {
  menu?.classList.add('is-open');
  openBtn.setAttribute('aria-expanded', 'true');
  lenis?.stop();
  menu?.querySelector<HTMLElement>('[data-menu-close]')?.focus();
});
menu?.querySelector('[data-menu-close]')?.addEventListener('click', closeMenu);
menu?.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ── Magnetic cursor bubble (contact section) ───────────── */
const zones = document.querySelectorAll<HTMLElement>('[data-bubble-zone]');
zones.forEach((zone) => {
  const bubble = zone.querySelector<HTMLElement>('[data-bubble]');
  if (!bubble || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  const loop = () => {
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    bubble.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    raf = requestAnimationFrame(loop);
  };
  zone.addEventListener('pointerenter', (e) => {
    const r = zone.getBoundingClientRect();
    x = tx = e.clientX - r.left;
    y = ty = e.clientY - r.top;
    bubble.classList.add('is-on');
    cancelAnimationFrame(raf);
    loop();
  });
  zone.addEventListener('pointermove', (e) => {
    const r = zone.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
  });
  zone.addEventListener('pointerleave', () => {
    bubble.classList.remove('is-on');
    setTimeout(() => cancelAnimationFrame(raf), 500);
  });
});
