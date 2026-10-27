/* Arshad site draft 1 (dark): starts the site with the baked-in picks (this replaces the Site Lab's drawer, site-lab.js). */
(() => {
'use strict';
const SITE = window.SITE, ST = SITE.ST, C = window.DRAFT;
const $ = (s, r = document) => r.querySelector(s);

ST.S = Object.assign({}, window.SD.DEFAULTS, C.S);
ST.pins = JSON.parse(JSON.stringify(C.pins));
ST.feat = {};
ST.cur = SITE.PG(C.page) ? C.page : C.idFromPath();
try { history.replaceState({ p: ST.cur }, '', location.href); } catch (e){}

/* links to a section on the same page (#enq, #s-con, ...): <base> points them at the site root, so scroll here instead of leaving */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a || a.dataset.page || e.defaultPrevented) return;
  const id = a.getAttribute('href').slice(1);
  e.preventDefault();
  const el = id ? document.getElementById(id) : null;
  if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  else if (!id || id === 'top') scrollTo({ top: 0, behavior: 'smooth' });
});

/* the corona and induction photos are shown still: the drawn discharge and induction rings over them are left out
   (homepage panels, product verticals). Each still photo is framed exactly as its canvas framed it: same cover crop,
   focus point and light shade. */
const STILL = { corona: ['62% 60%', .28], induction: ['30% 50%', .18] };
function stillPhotos(){
  document.querySelectorAll('#site canvas[data-vis="corona"], #site canvas[data-vis="induction"]').forEach(cv => {
    const src = cv.dataset.photo; if (!src || cv.classList.contains('ph-off')) return;
    const [pos, shade] = STILL[cv.dataset.vis];
    const d = document.createElement('div'); d.className = 'ph-still'; d.setAttribute('aria-hidden', 'true');
    d.style.cssText = `background-image:linear-gradient(rgba(12,14,10,${shade}),rgba(12,14,10,${shade})),url("${src}");background-position:center,${pos}`;
    cv.before(d); cv.classList.add('ph-off');
  });
}
new MutationObserver(stillPhotos).observe(document.getElementById('site'), { childList: true });

I18N.start();
SITE.render();
stillPhotos();
setTimeout(() => SITE.resumeOffer(), 900);
})();
