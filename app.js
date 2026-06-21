document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initNav();
  initScrollProgress();
  initReveals();
  initMobReveal();
});

/* ─── HERO ENTRANCE ───────────────────────────────── */
function initHero() {
  const heroRight = document.getElementById('heroRight');
  if (!heroRight) return; // páginas internas não têm hero animado
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  heroRight.classList.add('revealed');
  if (reduce || typeof gsap === 'undefined') {
    document.querySelectorAll('.hero-h1 .line > span').forEach(s => { s.style.transform = 'none'; });
    ['heroEyebrow','heroSub','heroBtns','heroProof'].forEach(id => { const e = document.getElementById(id); if(e){e.style.opacity=1;e.style.transform='none';} });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('#heroEyebrow', { opacity: 1, duration: .6 }, .15)
    .to('.hero-h1 .line > span', { y: '0%', duration: 1, stagger: .12 }, .25)
    .to('#heroSub', { opacity: 1, y: 0, duration: .8 }, .6)
    .to('#heroBtns', { opacity: 1, y: 0, duration: .8 }, .75)
    .to('#heroProof', { opacity: 1, y: 0, duration: .8 }, .85);
}

/* ─── NAV ─────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('mainNav');
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    if (y > 140) {
      if (y > last + 4) nav.classList.add('hidden');
      else if (y < last - 4) nav.classList.remove('hidden');
    } else nav.classList.remove('hidden');
    last = y;
  }, { passive: true });
}

/* ─── SCROLL PROGRESS ─────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = (scrollY / (document.body.scrollHeight - innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ─── SCROLL REVEALS ──────────────────────────────── */
function initReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in-view');
      // title-reveal: anima os filhos .ti
      if (el.classList.contains('title-reveal')) {
        el.querySelectorAll('.ti').forEach((ti, i) => {
          setTimeout(() => { ti.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1), opacity .9s cubic-bezier(.16,1,.3,1)'; ti.style.transform = 'translateY(0)'; ti.style.opacity = '1'; }, i * 110);
        });
      }
      // contadores
      if (el.classList.contains('about-stats')) animateCounters(el);
      io.unobserve(el);
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -5% 0px' });

  const SEL = '.sec-eyebrow,.rule,.title-reveal,.pos-card,.about-frame,.about-img,.about-body p,.tag,.about-stats,.approach-visual,.protocol,.service-card,.result-card,.diff-card,.test-card,.form-card,.treat-link,.post-card,.map-frame,.book-card';
  const els = document.querySelectorAll(SEL);
  els.forEach((el, i) => {
    if (el.classList.contains('pos-card')||el.classList.contains('service-card')||el.classList.contains('result-card')||el.classList.contains('diff-card')||el.classList.contains('test-card')||el.classList.contains('protocol')||el.classList.contains('tag')||el.classList.contains('about-body')) {
      el.style.transitionDelay = (i % 6 * 0.06) + 's';
    }
    io.observe(el);
  });

  // Rede de segurança: revela qualquer elemento já visível que o observer não pegou
  const sweep = () => {
    els.forEach(el => {
      if (el.classList.contains('in-view')) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.98 && r.bottom > 0) {
        el.classList.add('in-view');
        if (el.classList.contains('title-reveal')) el.querySelectorAll('.ti').forEach((ti, i) => setTimeout(() => { ti.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1), opacity .9s cubic-bezier(.16,1,.3,1)'; ti.style.transform = 'translateY(0)'; ti.style.opacity = '1'; }, i * 90));
        if (el.classList.contains('about-stats')) animateCounters(el);
        io.unobserve(el);
      }
    });
  };
  window.addEventListener('load', () => setTimeout(sweep, 300));
  window.addEventListener('scroll', sweep, { passive: true });
}

function animateCounters(scope) {
  scope.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const dur = 1400; const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ─── MOBILE MENU ─────────────────────────────────── */
function initMobReveal() {}
function toggleMob() {
  const m = document.getElementById('mobMenu');
  m.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}

/* ─── FAQ ─────────────────────────────────────────── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const body = item.querySelector('.faq-body');
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => { el.classList.remove('open'); el.querySelector('.faq-body').style.maxHeight = '0'; });
  if (!open) { item.classList.add('open'); body.style.maxHeight = body.scrollHeight + 24 + 'px'; }
}

/* ─── FORM → WHATSAPP ─────────────────────────────── */
function sendToWA(e) {
  e.preventDefault();
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const q = document.getElementById('fqueixa').value;
  const msg = encodeURIComponent(`Olá Helenice! Meu nome é ${name} (${phone}). Minha principal queixa: ${q}. Gostaria de agendar uma avaliação.`);
  window.open(`https://wa.me/5531998283254?text=${msg}`, '_blank');
}

/* ─── AUDIO PLAYERS ───────────────────────────────── */
const players = {};
function initPlayer(id) {
  if (players[id]) return;
  const audio = document.getElementById('audio' + id);
  players[id] = { audio, playing: false };
  audio.addEventListener('loadedmetadata', () => { document.getElementById('dur' + id).textContent = fmt(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    document.getElementById('fill' + id).style.width = pct + '%';
    document.getElementById('cur' + id).textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('ended', () => { setState(id, false); document.getElementById('fill' + id).style.width = '0%'; document.getElementById('cur' + id).textContent = '0:00'; });
}
function fmt(s) { const m = Math.floor(s/60); const sec = Math.floor(s%60); return `${m}:${sec<10?'0':''}${sec}`; }
function setState(id, playing) {
  players[id].playing = playing;
  const player = document.getElementById('player' + id);
  const btn = document.getElementById('btn' + id);
  player.classList.toggle('playing', playing);
  btn.querySelector('.play-icon').style.display = playing ? 'none' : 'block';
  btn.querySelector('.pause-icon').style.display = playing ? 'block' : 'none';
}
function togglePlay(id) {
  initPlayer(id);
  const p = players[id];
  if (p.playing) { p.audio.pause(); setState(id, false); }
  else { Object.keys(players).forEach(k => { if (k != id && players[k].playing) { players[k].audio.pause(); setState(k, false); } }); p.audio.play().catch(()=>{}); setState(id, true); }
}
function seekAudio(e, id) { initPlayer(id); const bar = e.currentTarget; const ratio = e.offsetX / bar.offsetWidth; const p = players[id]; if (p.audio.duration) p.audio.currentTime = ratio * p.audio.duration; }

/* ═══════════════════════════════════════════════════
   MOBILE EXTRAS — FAB · BOTTOM NAV ATIVO
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initFab();
  initBottomNav();
});

function initFab() {
  const fab = document.getElementById('fabWa');
  if (!fab) return;
  const toggle = () => fab.classList.toggle('show', window.scrollY > 400);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

/* destaca o item do bottom-nav conforme a seção visível (só na home) */
function initBottomNav() {
  const items = document.querySelectorAll('.bn-item[data-section]');
  if (!items.length) return;
  const map = {};
  items.forEach(i => { map[i.dataset.section] = i; });
  const sections = Object.keys(map).map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        items.forEach(i => i.classList.remove('active'));
        const it = map[e.target.id];
        if (it) it.classList.add('active');
      }
    });
  }, { threshold: .4, rootMargin: '-20% 0px -40% 0px' });
  sections.forEach(s => io.observe(s));
}

/* ═══════════════════════════════════════════════════
   MAPA — alternância Mapa / Satélite (keyless, sem chave)
═══════════════════════════════════════════════════ */
function setMap(tab, mode) {
  const iframe = document.getElementById('mapFrame');
  if (!iframe) return;
  const q = iframe.dataset.q;
  // t=m roadmap | t=k satélite
  const t = mode === 'sat' ? 'k' : 'm';
  const z = mode === 'sat' ? 18 : 16;
  iframe.src = `https://maps.google.com/maps?q=${q}&t=${t}&z=${z}&output=embed`;
  document.querySelectorAll('.map-tab').forEach(b => b.classList.remove('active'));
  tab.classList.add('active');
}
