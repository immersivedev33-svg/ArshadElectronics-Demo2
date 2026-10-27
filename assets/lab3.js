/* Arshad Site Lab 3 (16 Oct 2026): the small runtime behind lab3.css.
   After every render it marks picture frames (mask reveal + depth parallax) and cards (machined trays with a
   spotlight edge), keeps sheets that hold fixed-position parts out of the sinking transition, and, in browsers
   without CSS scroll timelines, opens the picture masks with an IntersectionObserver instead. No scroll listeners. */
(() => {
'use strict';
const site = document.getElementById('site'); if (!site) return;
const TIMELINE = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
const SHEETS = 'main :is(.pgwrap>section,.pp>section)';
// panels and cards that read as objects on the page (not rails, marquees, header or drawer parts)
const CARDS = ['.tile', '.scard', '.strengths>div', '.quotes figure', '.why4>*', '.par', '.wiz', '.form', '.mapc .card2', '.p-card', '.bz-photo',
  '.prevnext a', '.tind .tiles>div', '.p-help>div', '.thow[data-v="cards"] .steps>div', '.tpanel[data-v="panel"]>.wrap>.slot', '.ind>div', '.p-safe>div', '.fm-sys>div', '.chap .stick', '.help2>*'].join(',');
const NOT_CARD = '.shdr, #lab2, .ftr, .marq, .rail, [class*="marquee"], .door, .doors';
const SKIP_IMG = '.lgi, .logos, .clis, .door, .doors, .langs, .mega, .shdr, .ftr, .marq, [class*="marquee"]';
let io = null;

function frames(root){
  root.querySelectorAll(`${SHEETS} img`).forEach(img => {
    if (img.closest(SKIP_IMG) || img.classList.contains('l3-pic')) return;
    const tag = () => {
      const p = img.parentElement; if (!p || !img.isConnected) return;
      const r = img.getBoundingClientRect(), q = p.getBoundingClientRect();
      if (r.width < 220 || q.width < 220 || q.height < 140) return;
      const ov = getComputedStyle(p).overflow;
      // parallax only where the frame clips the picture and the picture fills it
      if (!/hidden|clip/.test(ov) || r.width < q.width * .95 || r.height < q.height * .95) return;
      p.classList.add('l3-frame'); img.classList.add('l3-pic');
      if (!TIMELINE && io) io.observe(p);
    };
    if (img.complete && img.naturalWidth) tag(); else img.addEventListener('load', tag, { once: true });
  });
}
function cards(root){
  root.querySelectorAll(CARDS).forEach(el => {
    if (el.classList.contains('l3-card') || el.closest(NOT_CARD) || !el.closest('main')) return;
    const cs = getComputedStyle(el);
    if (getComputedStyle(el, '::after').content !== 'none') return; // the card already draws something there
    if (cs.position === 'static') el.style.position = 'relative';
    el.classList.add('l3-card');
  });
}
// a transformed ancestor would move fixed-position parts (shortlist drawers, floating buttons) with the sheet
function noSink(root){
  root.querySelectorAll(SHEETS).forEach(sec => {
    const fixed = [...sec.querySelectorAll('[class*="fab"],[class*="drawer"],[class*="pop"],[class*="modal"],[class*="fly"],[class*="toast"],[class*="sticky"],[class*="stick"]')]
      .some(el => { const p = getComputedStyle(el).position; return p === 'fixed'; });
    sec.classList.toggle('l3-nosink', fixed);
  });
}
/* ---------- product pages: one row of series buttons in every opening ----------
   Each button works through the page's own controls, so the picture, description and specs follow the pick:
   film series use the page's own series switch; Brezo keeps its model ladder; 3D objects switches FTS-3D / ACT CBL
   through its view tabs; Aurae picks its MS or SS 304 build; Simco-Ion swaps the product photo and marks the product;
   woven fabric has one series, shown as a single selected button. */
const FILM_ORDER = ['ACT MML', 'ACT MML IBC', 'ACT MNL', 'ACT ABA', 'ACT CM/BR', 'ACT NCF', 'ACT LBL CM'];
const SIMCO_PH = [['img/site/simco-system.webp', 'Simco-Ion IQ Power static eliminator system'], ['img/site/simco-bar.webp', 'Simco-Ion IQ Easy static eliminator bar']];
const txt = el => el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
const btn = (name, sub, on, attrs = '') => `<button type="button" aria-pressed="${on}" ${attrs}><b>${name}</b>${sub ? `<span>${sub}</span>` : ''}</button>`;
const escH = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function seriesRow(){
  const pp = site.querySelector('.pp'), hero = pp && pp.querySelector('.thero'); if (!hero || hero.dataset.l3series) return;
  const ctrls = hero.querySelector('.ctrls'); if (!ctrls) return;
  const page = (window.SITE && SITE.ST && SITE.ST.cur) || '';
  let row = null;
  if (page === 'brezo'){ row = ctrls.querySelector('.bz-ladder'); if (row) row.classList.add('l3-series'); }
  else {
    let html = '';
    if (page === 'films'){
      const cards = [...pp.querySelectorAll('#fmCards [data-s]')]; if (!cards.length) return; // the page has not started yet
      cards.sort((a, b2) => FILM_ORDER.indexOf(txt(a.querySelector('b'))) - FILM_ORDER.indexOf(txt(b2.querySelector('b'))));
      html = cards.map(c => btn(escH(txt(c.querySelector('b'))), escH(txt(c.querySelector('span')).split(' · ')[0]), c.getAttribute('aria-pressed') === 'true', `data-s="${c.dataset.s}"`)).join('');
    } else if (page === 'objects'){
      const chips = [...pp.querySelectorAll('[data-spec]')]; if (!chips.length) return;
      html = chips.map(c => { const [n, sub] = txt(c).split(' · '); return btn(escH(n), escH(sub || ''), c.getAttribute('aria-pressed') === 'true', `data-l3k="${c.dataset.spec === 'cbl' ? 'cable' : 'part'}" data-l3spec="${c.dataset.spec}"`); }).join('');
    } else if (page === 'aurae'){
      const name = txt(pp.querySelector('.p-hold .p-mini b')) || 'Aurae 3';
      const vars = [...pp.querySelectorAll('.p-var [data-var]')].filter(v => !/^\+/.test(v.dataset.var));
      html = vars.length ? vars.map((v, i) => btn(escH(name), escH(txt(v.querySelector('b'))), v.getAttribute('aria-pressed') === 'true' || (i === 0 && !vars.some(x => x.getAttribute('aria-pressed') === 'true')), `data-l3var="${escH(v.dataset.var)}"`)).join('') : btn(escH(name), '', true);
    } else if (page === 'simco'){
      const cardsS = [...pp.querySelectorAll('.io-apps .p-card')]; if (!cardsS.length) return;
      html = cardsS.map((c, i) => btn(escH(txt(c.querySelector('h3'))), escH(txt(c.querySelector('.p-kick'))), i === 0, `data-l3ph="${i}"`)).join('');
      cardsS.forEach((c, i) => c.classList.toggle('l3-pick', i === 0));
    } else if (page === 'woven'){
      html = btn(escH(txt(pp.querySelector('.p-hold .p-mini b')) || 'FTS-WS'), '', true, 'data-l3one');
    } else return;
    row = document.createElement('div'); row.className = 'l3-series'; row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'Series');
    row.innerHTML = html; ctrls.appendChild(row);
    row.addEventListener('click', e => {
      const b2 = e.target.closest('button'); if (!b2) return;
      if (b2.dataset.l3k){ const t = pp.querySelector(`.ob-tabs [data-k="${b2.dataset.l3k}"]`); if (t) t.click(); }
      if (b2.dataset.l3var){ const v = pp.querySelector(`.p-var [data-var="${CSS.escape(b2.dataset.l3var)}"]`); if (v && v.getAttribute('aria-pressed') !== 'true') v.click(); }
      if (b2.dataset.l3ph !== undefined){ const i = +b2.dataset.l3ph, im = hero.querySelector('.l3-photo img'); if (im){ im.src = SIMCO_PH[i][0]; im.alt = SIMCO_PH[i][1]; } pp.querySelectorAll('.io-apps .p-card').forEach((c, k) => c.classList.toggle('l3-pick', k === i)); }
      if (!b2.dataset.s) row.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b2)));
    });
    // 3D objects: the view tabs on the picture also change the series
    if (page === 'objects') pp.addEventListener('click', e => { const t = e.target.closest('.ob-tabs [data-k]'); if (t) row.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.l3k === (t.dataset.k === 'cable' ? 'cable' : 'part')))); });
  }
  hero.dataset.l3series = '1';
  placeSeries();
}
// drawer option "Series buttons": under the description (default), as tabs above the picture, or as a list beside it
function placeSeries(){
  const hero = site.querySelector('.pp .thero'), row = hero && hero.querySelector('.l3-series'); if (!row) return;
  const how = document.documentElement.dataset.lPSeries || '', vis = hero.querySelector('.vis'), ctrls = hero.querySelector('.ctrls');
  if (how === 'tabs'){ if (vis && row.parentElement !== vis) vis.prepend(row); }
  else if (how === 'list'){ if (vis && row.nextElementSibling !== vis) vis.before(row); }
  else if (ctrls && row.parentElement !== ctrls) ctrls.prepend(row);
}
new MutationObserver(placeSeries).observe(document.documentElement, { attributes: true, attributeFilter: ['data-l-p-series'] });

/* readability (16 Oct 2026): running text at 16px at least, notes at 14px; only paragraphs and list items over 60
   characters (labels, figures and captions keep their size) */
function bodySize(root){
  root.querySelectorAll('main :is(p,li,dd,blockquote)').forEach(el => {
    if (el.dataset.l3fs || el.closest('#lab2, .shdr, .ftr')) return;
    if (el.textContent.replace(/\s+/g, ' ').trim().length <= 60) return; // check again if it fills later
    el.dataset.l3fs = '1';
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (el.matches('.p-note')){ if (fs < 14) el.classList.add('l3-note'); }
    else if (fs < 16) el.classList.add('l3-body');
  });
}
function run(){ frames(site); cards(site); noSink(site); seriesRow(); bodySize(site); }

if (!TIMELINE && 'IntersectionObserver' in window){
  document.documentElement.classList.add('l3-notl');
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('l3-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
}

// spotlight edge: the card under the pointer gets the pointer position (one write per frame at most)
let pend = null, raf = 0;
document.addEventListener('pointermove', e => {
  pend = e; if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0; const ev = pend; const c = ev.target.closest && ev.target.closest('.l3-card'); if (!c) return;
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (ev.clientX - r.left) + 'px'); c.style.setProperty('--my', (ev.clientY - r.top) + 'px');
  });
}, { passive: true });

new MutationObserver(() => requestAnimationFrame(run)).observe(site, { childList: true });
requestAnimationFrame(run);
// a product page fills its own parts after it starts (film series cards, Aurae variants): try the series row again shortly
let subRaf = 0;
new MutationObserver(() => { if (subRaf) return; subRaf = requestAnimationFrame(() => { subRaf = 0; if (site.querySelector('.pp .thero:not([data-l3series])')) seriesRow(); bodySize(site); }); }).observe(site, { childList: true, subtree: true });
addEventListener('load', run);
window.LAB3FX = { run };
})();
