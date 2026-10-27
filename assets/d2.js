/* ArshadElectronics-demo2 (26 Oct 2026): the meeting changes that need code on the page. Content comes from
   data/site-content.js (window.D2C), which the admin rewrites.
   - Announcements: a bell in the header with a +1 badge for anything not seen yet; each new announcement pops up once.
   - Google reviews: rating and selected reviews on the homepage, just above the FAQ, linked to the Google page (hidden while empty).
   - Staff login: a small link to the admin in the footer's bottom line.
   - Product videos: a click-to-play video in each product page's specs; YouTube loads only on click (hidden while empty).
   - Homepage FAQ: corona treaters and cap sealers in two tabs.
   Everything is redrawn after each page change (the site replaces #site on navigation). */
(() => {
'use strict';
const site = document.getElementById('site'); if (!site) return;
const D = window.D2C || {};
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const page = () => (window.SITE && SITE.ST && SITE.ST.cur) || (window.DRAFT && DRAFT.page) || '';
const store = { get(k){ try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e){ return null; } }, set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (e){} } };
const safeUrl = u => /^https:\/\//i.test(String(u || '')) ? String(u) : '';
const ICON = {
  bell: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
  star: on => `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.3"/></svg>`
};

/* ---------- announcements ---------- */
const SEEN = 'arshad-demo2-seen', POPPED = 'arshad-demo2-popped';
function active(){
  const now = new Date().toISOString().slice(0, 10);
  return (D.announcements || []).filter(a => a && a.id && a.on !== false && a.title && (!a.start || a.start <= now) && (!a.end || a.end >= now))
    .sort((a, b) => String(b.start || b.id).localeCompare(String(a.start || a.id)));
}
const unseen = () => { const s = store.get(SEEN) || []; return active().filter(a => !s.includes(a.id)); };
const markSeen = list => { const s = new Set(store.get(SEEN) || []); (list || active()).forEach(a => s.add(a.id)); store.set(SEEN, [...s].slice(-50)); };
function annHTML(a){
  const link = safeUrl(a.link);
  return `<article class="d2-ann"><h3>${esc(a.title)}</h3>${a.text ? `<p>${esc(a.text).replace(/\n/g, '<br>')}</p>` : ''}${link ? `<a class="btnp d2-annlink" href="${esc(link)}" target="_blank" rel="noopener">${esc(a.linkText || 'Read more')} <span class="arrow">→</span></a>` : ''}</article>`;
}
function bell(){
  const hdr = site.querySelector('.shdr'); if (!hdr || hdr.querySelector('.d2-bell')) return;
  const anchor = hdr.querySelector('[data-comfort]') || hdr.querySelector('[data-search]'); if (!anchor) return;
  const n = unseen().length;
  const btn = extra => `<button type="button" class="ibtn d2-bell${extra}" data-d2bell aria-label="Announcements${n ? ` (${n} new)` : ''}">${ICON.bell}${n ? `<span class="d2-badge">+${n}</span>` : ''}</button>`;
  anchor.insertAdjacentHTML('afterend', btn(''));
  // phones and narrow windows: the header folds its icons (bell included) into Menu, so the +1 shows on the Menu button
  const burger = hdr.querySelector('.burger'); if (burger && n) burger.insertAdjacentHTML('beforeend', `<span class="d2-badge d2-badge-m" aria-hidden="true">+${n}</span>`);
}
function refreshBell(){ site.querySelectorAll('.d2-bell, .d2-badge-m').forEach(b => b.remove()); bell(); }
let lastFocus = null;
function openPanel(list, title){
  closePanel(); lastFocus = document.activeElement;
  const box = document.createElement('div'); box.className = 'd2-modal'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', title);
  box.innerHTML = `<div class="d2-scrim" data-d2close></div><div class="d2-card"><header><span class="eb">${esc(title)}</span><button type="button" class="d2-x" data-d2close aria-label="Close">×</button></header>
    <div class="d2-body">${list.length ? list.map(annHTML).join('') : '<p class="d2-empty">No announcements right now.</p>'}</div></div>`;
  // the dialog sits outside #site (where the palette lives), so it takes the palette's colours with it
  const cs = getComputedStyle(site); ['--bg', '--surf', '--ink', '--mut', '--brand', '--brandInk'].forEach(k => { const v = cs.getPropertyValue(k).trim(); if (v) box.style.setProperty(k, v); });
  document.body.appendChild(box); requestAnimationFrame(() => box.classList.add('on'));
  const x = box.querySelector('.d2-x'); if (x) x.focus();
  markSeen(list); refreshBell();
}
function closePanel(){ const m = document.querySelector('.d2-modal'); if (!m) return; m.remove(); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
document.addEventListener('click', e => {
  if (e.target.closest('[data-d2bell]')){ e.preventDefault(); openPanel(active(), 'Announcements'); return; }
  if (e.target.closest('[data-d2close]')) closePanel();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.querySelector('.d2-modal')) closePanel(); });
// a new announcement pops up once per visitor, a moment after the page settles
function popOnce(){
  const popped = store.get(POPPED) || [], fresh = active().filter(a => !popped.includes(a.id) && a.popup !== false);
  if (!fresh.length) return;
  setTimeout(() => { if (document.querySelector('.d2-modal, #lab2.open')) return; store.set(POPPED, [...popped, ...fresh.map(a => a.id)].slice(-50)); openPanel(fresh, 'New announcement'); }, 1600);
}

/* ---------- Google reviews (homepage, just above the FAQ) ----------
   The user's picks from the Review Cards Lab (27 Oct): glass cards (Glass), the rating counting up as the section
   arrives (J), and the cards waiting fanned like a hand (R) that spring apart into a coverflow (Q) as the reveal.
   After that it is a coverflow: arrows, dots, a click on a side card, and a turn every 6 s while in view. */
let rv = null;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const onScreen = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
function reviews(){
  if (page() !== 'home' || site.querySelector('#s-rev')) return;
  const R = D.reviews || {}, items = (R.items || []).filter(r => r && r.text).slice(0, 20), rating = Number(R.rating);
  if (!items.length && !(rating > 0)) return;
  // just above the FAQ ("Help me choose"); the last section if the homepage has no FAQ
  const secs = site.querySelectorAll('main .pgwrap > section'), help = site.querySelector('#s-help'), last = secs[secs.length - 1]; if (!help && !last) return;
  const url = safeUrl(R.url), five = ICON.star(true).repeat(5);
  // initials from the first and last name (Padma S Vankar -> PV)
  const ini = n => { const w = String(n || '').trim().split(/\s+/).filter(Boolean); return ((w[0] || 'G')[0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase(); };
  const pct = rating > 0 ? Math.max(0, Math.min(100, rating / 5 * 100)) : 0;
  const sec = document.createElement('section'); sec.className = 'sec d2-rev'; sec.id = 's-rev'; sec.dataset.sec = 'Reviews';
  sec.innerHTML = `<div class="wrap"><div class="sh"><span class="eb">Google reviews</span><h2>What customers say on Google</h2></div>
    ${rating > 0 ? `<div class="d2-rate"><b class="d2-num">${rating.toFixed(1)}</b><div><span class="d2-bar" role="img" aria-label="${rating.toFixed(1)} out of 5">${five}<span class="d2-fill" style="--w:${pct}%">${five}</span></span>${R.count ? `<p>${esc(R.count)} reviews on Google</p>` : ''}</div></div>` : ''}
    ${items.length ? `<div class="d2-glass"><div class="d2-cf" aria-roledescription="carousel" aria-label="Google reviews">${items.map((r, i) => `<figure class="d2-gcard" data-c="${i}"><div class="d2-gtop"><span class="d2-av" aria-hidden="true">${esc(ini(r.name))}</span><div><b>${esc(r.name)}</b><small>Google review${r.date ? ' · ' + esc(r.date) : ''}</small></div><span class="d2-g" aria-hidden="true">G</span></div>${r.stars ? `<span class="d2-stars" aria-label="${Number(r.stars)} out of 5">${[1, 2, 3, 4, 5].map(k => ICON.star(k <= Number(r.stars))).join('')}</span>` : ''}<blockquote>${esc(r.text)}</blockquote></figure>`).join('')}</div>
      ${items.length > 1 ? `<div class="d2-cfbar"><button type="button" class="d2-circ" data-cfp aria-label="Previous review">←</button><span class="d2-dots" aria-hidden="true">${items.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</span><button type="button" class="d2-circ" data-cfx aria-label="Next review">→</button></div>` : ''}</div>` : ''}
    ${url ? `<a class="btng d2-revlink" href="${esc(url)}" target="_blank" rel="noopener">Read all reviews on Google <span class="arrow">→</span></a>` : ''}</div>`;
  if (help) help.before(sec); else last.after(sec);
  setupReviews(sec, rating, pct);
}
function setupReviews(sec, rating, pct){
  const cf = sec.querySelector('.d2-cf'), cards = cf ? [...cf.children] : [], n = cards.length;
  const st = rv = { sec, cf, cards, n, cur: 0, mode: reduceMotion() ? 'cf' : 'fan', hover: false, lay };
  function lay(){
    if (!cf || !cf.isConnected) return;
    cf.style.height = Math.max(...cards.map(c => c.offsetHeight)) + 24 + 'px';
    const narrow = cf.clientWidth < 640;
    cards.forEach((c, i) => {
      if (st.mode === 'fan'){ // a hand of up to five cards, the middle one in front; the rest wait unseen behind
        const m = Math.min(n, 5), k = i - (m - 1) / 2, inHand = i < m;
        c.style.transform = `translateX(calc(-50% + ${inHand ? k * (narrow ? 14 : 34) : 0}px)) rotate(${inHand ? k * 6 : 0}deg)`;
        c.style.opacity = inHand ? '1' : '0'; c.style.zIndex = String(inHand ? 10 - Math.round(Math.abs(k)) : 0); c.classList.remove('side'); c.removeAttribute('aria-hidden'); return;
      }
      let d = ((i - st.cur) % n + n) % n; if (d > n / 2) d -= n;
      const show = Math.abs(d) <= 1;
      c.style.transform = `translateX(calc(-50% + ${d * (narrow ? 36 : 58)}%)) rotateY(${d * -38}deg) scale(${d ? 0.84 : 1})`;
      c.style.opacity = show ? (d ? '.78' : '1') : '0'; c.style.zIndex = String(d ? 1 : 3); c.style.pointerEvents = show ? '' : 'none';
      c.classList.toggle('side', !!d); if (d) c.setAttribute('aria-hidden', 'true'); else c.removeAttribute('aria-hidden');
    });
    sec.querySelectorAll('.d2-dots i').forEach((dot, i) => dot.classList.toggle('on', i === st.cur));
  }
  st.go = i => { st.cur = ((i % n) + n) % n; if (st.mode !== 'cf') st.mode = 'cf'; lay(); };
  const num = sec.querySelector('.d2-num'), fill = sec.querySelector('.d2-fill');
  function reveal(){
    if (st.revealed) return; st.revealed = true;
    if (num && !reduceMotion()){
      const t0 = performance.now(), dur = 1300;
      const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); num.textContent = (rating * e).toFixed(1); if (k < 1 && num.isConnected) requestAnimationFrame(step); };
      requestAnimationFrame(step);
      if (fill) requestAnimationFrame(() => fill.style.setProperty('--w', pct + '%'));
    }
    if (cf && st.mode === 'fan') setTimeout(() => { cf.classList.add('d2-spring'); st.mode = 'cf'; lay(); setTimeout(() => cf.classList.remove('d2-spring'), 1200); }, 500);
  }
  if (!reduceMotion() && 'IntersectionObserver' in window){
    if (num) num.textContent = (0).toFixed(1);
    if (fill) fill.style.setProperty('--w', '0%');
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)){ io.disconnect(); reveal(); } }, { threshold: 0.3 });
    io.observe(sec.querySelector('.d2-glass') || sec);
  } else reveal();
  if (!cf) return;
  sec.addEventListener('click', e => {
    if (e.target.closest('[data-cfp]')) st.go(st.cur - 1);
    else if (e.target.closest('[data-cfx]')) st.go(st.cur + 1);
    else { const c = e.target.closest('.d2-gcard.side'); if (c) st.go(+c.dataset.c); }
  });
  const glass = sec.querySelector('.d2-glass');
  glass.addEventListener('pointerenter', () => { st.hover = true; }); glass.addEventListener('pointerleave', () => { st.hover = false; });
  glass.addEventListener('focusin', () => { st.hover = true; }); glass.addEventListener('focusout', () => { st.hover = false; });
  glass.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') st.go(st.cur - 1); if (e.key === 'ArrowRight') st.go(st.cur + 1); });
  requestAnimationFrame(lay);
}
// one timer for the whole site: turns the coverflow while it is on screen and nobody is pointing at it
setInterval(() => { if (rv && rv.sec.isConnected && rv.mode === 'cf' && rv.n > 1 && !rv.hover && !reduceMotion() && document.visibilityState === 'visible' && onScreen(rv.cf)) rv.go(rv.cur + 1); }, 6000);
addEventListener('resize', () => { if (rv && rv.sec.isConnected) rv.lay(); });

/* ---------- product videos (in the specs section of each product page) ---------- */
const ytId = u => { const m = String(u || '').match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/); return m ? m[1] : ''; };
function seriesName(){
  const b = site.querySelector('.pp .thero .l3-series [aria-pressed="true"], .pp .thero .l3-series [aria-selected="true"]');
  const n = b && b.querySelector('b'); return n ? n.textContent.replace(/\s+/g, ' ').trim() : '';
}
function video(){
  const p = page(), V = D.videos || {}, specs = site.querySelector('.pp > section[data-sec="Specs"] > .wrap'); if (!specs) return;
  const s = seriesName(), url = (s && V[p + '/' + s]) || V[p] || '', id = ytId(url);
  const cur = specs.querySelector('.d2-vid');
  if (cur && cur.dataset.yt === id) return;
  if (cur) cur.remove();
  if (!id) return;
  const fig = document.createElement('figure'); fig.className = 'd2-vid'; fig.dataset.yt = id;
  fig.innerHTML = `<button type="button" class="d2-vplay" data-d2yt="${id}" aria-label="Watch the video${s ? ': ' + esc(s) : ''}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="d2-pbtn">${ICON.play}</span></button>
    <figcaption><span class="eb">Product video</span><b>${esc(s || (document.querySelector('.pp .thero h1, .pp .thero h2') || {}).textContent || '')}</b></figcaption>`;
  const slot = specs.querySelector(':scope > .slot'); if (slot) slot.before(fig); else specs.appendChild(fig);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-d2yt]'); if (!b) return;
  const id = b.dataset.d2yt; if (!/^[\w-]{11}$/.test(id)) return;
  b.outerHTML = `<div class="d2-vframe"><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Product video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>`;
});

/* ---------- homepage FAQ: corona treaters | cap sealers ---------- */
// (the two groups are drawn by site-home.js faqHTML, patched in build_demo2.py; this switches them)
function showGroup(k){
  const box = site.querySelector('#faqs'); if (!box) return;
  site.querySelectorAll('[data-fqt]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.fqt === k)));
  box.querySelectorAll('[data-fqg]').forEach(g => { g.hidden = !!k && g.dataset.fqg !== k; });
}
document.addEventListener('click', e => { const t = e.target.closest('[data-fqt]'); if (t) showGroup(t.dataset.fqt); });
// while searching, answers from both groups show; clearing the search returns to the chosen tab
let fqTab = 'ct';
document.addEventListener('input', e => {
  if (!e.target || e.target.id !== 'fqs') return;
  const sel = site.querySelector('[data-fqt][aria-selected="true"]'); if (sel) fqTab = sel.dataset.fqt;
  if (e.target.value.trim()) showGroup(''); else showGroup(fqTab);
});
function faqTabs(){}

/* ---------- staff login link (footer bottom line) ---------- */
function staffLink(){
  const base = site.querySelector('.ftr .base > span'); if (!base || base.querySelector('.d2-staff')) return;
  base.insertAdjacentHTML('beforeend', ' · <a class="d2-staff" href="admin/" rel="nofollow">Staff login</a>');
}

/* ---------- run after every page draw ---------- */
let raf = 0;
function run(){ raf = 0; bell(); reviews(); video(); faqTabs(); staffLink(); }
new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(run); }).observe(site, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed', 'aria-selected'] });
run(); popOnce();
window.D2 = { active, unseen, ytId };
})();
