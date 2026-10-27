/* ArshadElectronics-demo1 (16 Oct 2026): the "Product pictures" switch in the drawer (Layout > Product pages).
   On "Photos from arshadelectronics.com" the drawer puts every product page except Simco-Ion on the site's own
   photo stage (site.js siteStage, the site's product photos instead of the 3D models). This dresses that stage in the
   product opening only: the photo stands on a plinth with a soft spotlight, and the series thumbnails sit under it in
   the series row's order. A thumbnail picks its series through the page's own series button, so description, specs
   and photo all follow; a series button moves the photo and the thumbnail mark the same way. */
(() => {
'use strict';
const site = document.getElementById('site'); if (!site) return;
const on = () => document.documentElement.dataset.lPPics === 'site';
const txt = el => el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
const isOn = b => b.getAttribute('aria-pressed') === 'true' || b.getAttribute('aria-selected') === 'true';
const rowBtns = hero => { const r = hero.querySelector('.l3-series'); return r ? [...r.querySelectorAll('button')] : []; };
const seriesBtn = (hero, name) => rowBtns(hero).find(b => txt(b.querySelector('b')) === name);

function dress(){
  if (!on()) return;
  const hero = site.querySelector('.pp .thero'), box = hero && hero.querySelector('.vis .mvsite'); if (!box) return;
  if (!box.classList.contains('d1-ph')){
    const img = box.querySelector('.mvs-p'); if (!img) return;
    const big = document.createElement('div'); big.className = 'd1-big';
    big.innerHTML = '<span class="d1-glow" aria-hidden="true"></span><span class="d1-plinth" aria-hidden="true"></span>';
    img.before(big); big.appendChild(img);
    box.classList.add('d1-ph'); box.closest('.vis').classList.add('d1-vis');
    const th = box.querySelector('.mvs-th');
    if (th){
      th.setAttribute('role', 'group'); th.setAttribute('aria-label', 'Series photos');
      // runs before the stage's own handler, which only swaps the photo
      th.addEventListener('click', e => { const t = e.target.closest('[data-sph]'), s = t && seriesBtn(hero, t.title); if (s && !isOn(s)) s.click(); });
    }
  }
  order(hero, box);
}
// thumbnails in the same order as the series buttons (the row fills in a moment after the page starts)
function order(hero, box){
  const th = box.querySelector('.mvs-th'); if (!th || th.dataset.d1o) return;
  const names = rowBtns(hero).map(b => txt(b.querySelector('b'))); if (!names.length) return;
  const at = c => { const i = names.indexOf(c.title); return i < 0 ? 99 : i; };
  [...th.children].sort((a, b) => at(a) - at(b)).forEach(c => th.appendChild(c));
  th.dataset.d1o = '1';
}

let raf = 0;
new MutationObserver(() => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; dress(); }); }).observe(site, { childList: true, subtree: true });
addEventListener('load', dress);
})();
