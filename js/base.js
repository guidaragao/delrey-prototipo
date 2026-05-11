/* SPLASH */
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (splash) setTimeout(() => splash.classList.add('is-hidden'), 600);
});

/* MOBILE MENU */
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('is-open');
    nav.classList.remove('is-open');
  }));
}

/* HEADER HIDE ON SCROLL */
const header = document.getElementById('header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  if (!header) return;
  const y = window.scrollY;
  if (y > lastScroll && y > 200) header.classList.add('is-hidden');
  else header.classList.remove('is-hidden');
  lastScroll = y;
}, {passive:true});

/* REVEAL ON SCROLL */
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => obs.observe(el));
}

/* LIGHTBOX UNIVERSAL */
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg = document.getElementById('lbImg');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let lbList = [];
  let lbIdx = 0;

  function showLb(){
    lbImg.src = lbList[lbIdx];
    if (lbCounter) lbCounter.textContent = `${lbIdx+1} / ${lbList.length}`;
  }
  function openLb(list, idx){
    lbList = list; lbIdx = idx;
    showLb();
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb(){
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function navLb(d){
    lbIdx = (lbIdx + d + lbList.length) % lbList.length;
    showLb();
  }

  window.openGallery = openLb;

  lbClose.addEventListener('click', closeLb);
  if (lbPrev) lbPrev.addEventListener('click', e => { e.stopPropagation(); navLb(-1); });
  if (lbNext) lbNext.addEventListener('click', e => { e.stopPropagation(); navLb(1); });
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  lbImg.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') navLb(-1);
    if (e.key === 'ArrowRight') navLb(1);
  });

  // Swipe mobile
  let tx = 0;
  lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, {passive:true});
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) navLb(dx > 0 ? -1 : 1);
  }, {passive:true});
}
