/* ArshadElectronics-demo2 (27 Oct 2026): the 2026 catalogue, Arshad_Electronics_FULL_FINAL_Print.pdf.
   - model cards per series in the Blown / cast film specs, from the catalogue's model table (page 4)
   - photo view: the product photo sits on a catalogue plate with series, model count and generator range, and follows
     the series buttons. ACT LBL CM has no 3D model and the 3D objects page switches to ACT CBL through its view tabs,
     so neither moves the photo by itself
   - 3D view: ACT LBL CM shows its catalogue photo on the stage
   - Fluxomatic page: the generator group shot in the opening, and the corona glow photo behind "What is corona treatment?"
   - Spanish and Russian for the new text
   Loads after d2-content.js and before the page code; site.js calls ACT.family() and ACT.glow() when it draws the
   Fluxomatic page. */
(() => {
'use strict';
// [series, model, treatment width, line speed (m/min), generators], as printed in the model table
const M = [
  ['MNL', 'MNL V 2/2', '500 – 800 mm', '40', ['FTS 1000']],
  ['MNL', 'MNL S 2/2', '625 – 800 mm', '40', ['FTS 1000']],
  ['ABA', 'ABA 3/2', '750 – 900 mm', '80', ['FTS 2000']],
  ['ABA', 'ABA 4/3', '900 – 1000 mm', '80', ['FTS 2000']],
  ['MML', 'MML P 4/3', '1000 – 1500 mm', '80', ['FTS 3000', 'FTS 5000']],
  ['MML', 'MML P 6/5', '1500 – 1800 mm', '80 – 100', ['FTS 5000', 'FTS 7500']],
  ['MML', 'MML M 4/3', '1250 – 1500 mm', '80', ['FTS 3000', 'FTS 5000']],
  ['MML', 'MML M 6/4', '1600 – 1800 mm', '80', ['FTS 5000', 'FTS 7500']],
  ['MML', 'MML M 6/5', '1800 – 2100 mm', '80 – 100', ['FTS 7500', 'FTS 9000']],
  ['IBC', 'IBC 6/5', '1800 – 2500 mm', '100 – 120', ['FTS 9000', 'FTS 12000']],
  ['NCF', 'NCF S 6/3', '1500 mm', '100', ['FTS 3000', 'FTS 5000']],
  ['NCF', 'NCF S2 6/3', '1500 mm', '200', ['FTS 5000', 'FTS 7500']],
  ['CM/BR', 'BR 2 (6/3)', '1350 mm', '80 – 100', ['FTS 3000', 'FTS 5000']],
  ['CM/BR', 'BR 3 (8/3)', '1350 mm', '150 – 200', ['FTS 5000', 'FTS 7500']],
  ['CM/BR', 'BR 4 (8/3)', '1350 mm', '200 – 250', ['FTS 7500']],
  ['CM/BR', 'CM 3 6/3', '1310 mm', '100 – 150', ['FTS 3000', 'FTS 5000']],
  ['CM/BR', 'CM 4 6/4', '1310 mm', '150 – 200', ['FTS 5000', 'FTS 7500']],
  ['CM/BR', 'CM 6 6/4', '1310 mm', '200 – 300', ['FTS 7500']],
  ['CBL', 'CBL', '400 mm', '100', ['FTS 1000', 'FTS 2000']],
  ['LBL CM', 'LBL CM 2 4/2', '400 mm', '50 – 100', ['FTS 1000', 'FTS 2000']],
  ['LBL CM', 'LBL CM 3 6/3', '400 mm', '100 – 150', ['FTS 2000']],
  ['LBL CM', 'LBL CM 4 6/3', '400 mm', '100 – 150', ['FTS 2000']]
];
const NAME = { 'MNL': 'ACT MNL', 'ABA': 'ACT ABA', 'MML': 'ACT MML', 'IBC': 'ACT MML IBC', 'NCF': 'ACT NCF', 'CM/BR': 'ACT CM/BR', 'LBL CM': 'ACT LBL CM', 'CBL': 'ACT CBL' };
const KEY = Object.fromEntries(Object.entries(NAME).map(([k, n]) => [n, k]));
// the photo view's photo for each series button (site.js SITEPH ids)
const PH = { 'ACT MNL': 'mnl', 'ACT ABA': 'mnl-aba', 'ACT MML': 'mml', 'ACT MML IBC': 'mml-ibc', 'ACT NCF': 'ncf', 'ACT CM/BR': 'cm-br', 'ACT LBL CM': 'lbl-cm', 'ACT CBL': 'act/cbl', 'FTS-3D': 'cds-3d' };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const txt = el => el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
const num = s => +String(s).replace(/\D/g, '');
const rows = k => M.filter(m => m[0] === k);
function genRange(k){
  const g = [...new Set(rows(k).flatMap(m => m[4]))].sort((a, b) => num(a) - num(b));
  return g.length > 1 ? `${g[0]} – ${num(g[g.length - 1])}` : g[0];
}

window.ACT = {
  models: M,
  family: () => `<figure class="act-fam"><div class="act-fam-pic"><img class="zoomable" src="img/act/family.webp" alt="Four FTS corona generators of different sizes, side by side"></div>
    <figcaption>FTS generators, from FTS 1000 to FTS 12000</figcaption></figure>`,
  glow: (head, body) => `<div class="act-glow"><img src="img/act/glow-band.jpg" alt="Violet corona discharge between the electrode and the treater roll" loading="lazy" decoding="async">
    <div class="act-glow-tx">${head}<div class="prose">${body}</div></div></div>`
};

const site = document.getElementById('site'); if (!site) return;
const photoMode = () => document.documentElement.dataset.lPPics === 'site';
const page = () => (window.SITE && SITE.ST && SITE.ST.cur) || '';
const picked = () => txt(site.querySelector('.pp .thero .l3-series button[aria-pressed="true"] b'));

// Blown / cast film: the selected series' models, under its spec table
function cards(){
  if (page() !== 'films') return;
  const nm = site.querySelector('#fmName'), spec = site.querySelector('#fmSpec'); if (!nm || !spec) return;
  const k = KEY[txt(nm)]; let box = site.querySelector('.act-models');
  if (!k){ if (box) box.remove(); return; }
  if (!box){ box = document.createElement('div'); box.className = 'act-models'; spec.after(box); }
  if (box.dataset.k === k) return;
  box.dataset.k = k;
  const rs = rows(k);
  box.innerHTML = `<div class="act-mh"><b>${esc(NAME[k])}</b><span>${rs.length} ${rs.length > 1 ? 'models' : 'model'}</span></div>
    <div class="act-cards">${rs.map(m => `<article class="act-mc"><b>${esc(m[1])}</b><dl><dt>Width</dt><dd>${esc(m[2])}</dd><dt>Line speed</dt><dd>${esc(m[3])} m/min</dd>
      <dt>Generator</dt><dd>${m[4].map(g => `<span class="act-gen">${esc(g)}</span>`).join('')}</dd></dl></article>`).join('')}</div>
    <p class="p-note act-src">From the model table in Arshad’s 2026 catalogue.</p>`;
}

// photo view on the film and 3D objects pages: the catalogue plate, its strip, and the photo following the series
function plate(){
  const pg = page(), box = site.querySelector('.pp .thero .vis .mvsite');
  if (!box || !photoMode() || (pg !== 'films' && pg !== 'objects')) return;
  box.classList.add('act-plate');
  const name = picked(), k = KEY[name], f = PH[name], img = box.querySelector('.mvs-p');
  if (f && img && !String(img.getAttribute('src')).endsWith('/' + f.split('/').pop() + '.webp')){ const t = box.querySelector(`[data-sph="${f}"]`); if (t) t.click(); }
  let s = box.querySelector('.act-strip');
  if (!k){ if (s) s.hidden = true; return; }
  if (!s){ s = document.createElement('div'); s.className = 'act-strip'; box.appendChild(s); }
  s.hidden = false;
  if (s.dataset.k === k) return;
  s.dataset.k = k;
  s.innerHTML = `<div><small>Series</small><b>${esc(NAME[k])}</b></div><div><small>Models</small><b>${rows(k).length}</b></div><div><small>Generator</small><b>${esc(genRange(k))}</b></div>`;
}

// 3D view: ACT LBL CM has no model yet, so the stage shows its catalogue photo
function noModel(){
  const show = page() === 'films' && !photoMode() && txt(site.querySelector('#fmName')) === 'ACT LBL CM';
  let ov = site.querySelector('.act-nomodel');
  if (!show){ if (ov) ov.remove(); return; }
  const stage = site.querySelector('#fmStage'); if (ov || !stage) return;
  ov = document.createElement('div'); ov.className = 'act-nomodel';
  ov.innerHTML = `<img src="img/act/lbl-cm.webp" alt="ACT LBL CM: two narrow web label treater stations"><span>Catalogue photo. There is no 3D model of this series yet.</span>`;
  stage.appendChild(ov);
}

function run(){ cards(); plate(); noModel(); }
let raf = 0;
const later = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; run(); }); };
new MutationObserver(later).observe(site, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed'] });
new MutationObserver(later).observe(document.documentElement, { attributes: true, attributeFilter: ['data-l-p-pics'] });
addEventListener('load', later);

// Spanish and Russian for the new text (figures are looked up as {0}, {1}, ...)
const D = {
  'For monolayer blown film extrusion lines that need reliable treatment before printing. A high-frequency generator, an oil-cooled high-voltage transformer, a pneumatically operated electrode assembly and ozone extraction keep the treatment stable and uniform.': [
    'Para líneas de extrusión de película soplada monocapa que necesitan un tratamiento fiable antes de imprimir. Un generador de alta frecuencia, un transformador de alta tensión refrigerado por aceite, un conjunto de electrodos de accionamiento neumático y la extracción de ozono mantienen el tratamiento estable y uniforme.',
    'Для линий экструзии однослойной рукавной плёнки, которым нужна надёжная обработка перед печатью. Высокочастотный генератор, высоковольтный трансформатор с масляным охлаждением, пневматический электродный узел и удаление озона обеспечивают стабильную и равномерную обработку.'],
  'For A-B-A blown film extrusion lines. A high-frequency generator, an oil-cooled high-voltage transformer, a pneumatically operated electrode assembly and ozone extraction give efficient, consistent treatment.': [
    'Para líneas de extrusión de película soplada A-B-A. Un generador de alta frecuencia, un transformador de alta tensión refrigerado por aceite, un conjunto de electrodos de accionamiento neumático y la extracción de ozono dan un tratamiento eficiente y constante.',
    'Для линий экструзии рукавной плёнки A-B-A. Высокочастотный генератор, высоковольтный трансформатор с масляным охлаждением, пневматический электродный узел и удаление озона дают эффективную и стабильную обработку.'],
  'For multilayer blown film extrusion in demanding production. A high-frequency generator, an oil-cooled transformer, a precision electrode assembly and integrated ozone extraction give uniform treatment.': [
    'Para la extrusión de película soplada multicapa en producciones exigentes. Un generador de alta frecuencia, un transformador refrigerado por aceite, un conjunto de electrodos de precisión y la extracción de ozono integrada dan un tratamiento uniforme.',
    'Для экструзии многослойной рукавной плёнки в напряжённом производстве. Высокочастотный генератор, трансформатор с масляным охлаждением, прецизионный электродный узел и встроенное удаление озона дают равномерную обработку.'],
  'For IBC blown film lines: stable, uniform treatment at higher production speeds. With a high-frequency generator, an oil-cooled transformer, a pneumatically operated electrode assembly and integrated ozone extraction.': [
    'Para líneas de película soplada IBC: tratamiento estable y uniforme a mayores velocidades de producción. Con generador de alta frecuencia, transformador refrigerado por aceite, conjunto de electrodos de accionamiento neumático y extracción de ozono integrada.',
    'Для линий рукавной плёнки с IBC: стабильная, равномерная обработка на высоких скоростях производства. Высокочастотный генератор, трансформатор с масляным охлаждением, пневматический электродный узел и встроенное удаление озона.'],
  'For non-conductive films and paper in coating, laminating, boosting and printing. Its precision electrode design treats evenly and runs reliably.': [
    'Para películas no conductoras y papel en recubrimiento, laminación, refuerzo e impresión. Su diseño de electrodos de precisión trata de forma uniforme y funciona con fiabilidad.',
    'Для непроводящих плёнок и бумаги при нанесении покрытий, ламинировании, усилении обработки и печати. Прецизионная конструкция электродов обрабатывает равномерно и работает надёжно.'],
  'For conductive and non-conductive substrates in laminating and boosting, with consistent treatment levels for better adhesion and a reliable process. Two electrode models.': [
    'Para sustratos conductores y no conductores en laminación y refuerzo, con niveles de tratamiento constantes para una mejor adhesión y un proceso fiable. Dos modelos de electrodo.',
    'Для проводящих и непроводящих материалов при ламинировании и усилении обработки: стабильный уровень обработки для лучшей адгезии и надёжного процесса. Две модели электродов.'],
  'For conductive and non-conductive narrow web labels on printing machines, with consistent treatment levels for better adhesion and a reliable process.': [
    'Para etiquetas de banda estrecha conductoras y no conductoras en máquinas de impresión, con niveles de tratamiento constantes para una mejor adhesión y un proceso fiable.',
    'Для проводящих и непроводящих узкорулонных этикеток на печатных машинах: стабильный уровень обработки для лучшей адгезии и надёжного процесса.'],
  'Treats cables before printing and marking, for better ink adhesion and a cleaner finish.': [
    'Trata cables antes de la impresión y el marcado, para una mejor adhesión de la tinta y un acabado más limpio.',
    'Обрабатывает кабели перед печатью и маркировкой: лучшая адгезия краски и более чистый вид.'],
  'Narrow web labels': ['Etiquetas de banda estrecha', 'Узкорулонные этикетки'],
  'Fin-type electrodes, easy to maintain': ['Electrodos de aletas, de fácil mantenimiento', 'Пластинчатые электроды, простые в обслуживании'],
  'Better bonding for long-lasting printability and lamination. Seven series, from {0} mm label lines to {1} mm lamination lines running at {2} m/min.': [
    'Mejor adhesión para una imprimibilidad y laminación duraderas. Siete series, desde líneas de etiquetas de {0} mm hasta líneas de laminación de {1} mm a {2} m/min.',
    'Лучшая адгезия для долговечной печати и ламинирования. Семь серий: от линий этикеток шириной {0} мм до линий ламинирования шириной {1} мм на скорости {2} м/мин.'],
  '{0} – {1} m/min (printing)': ['{0} – {1} m/min (impresión)', '{0} – {1} м/мин (печать)'],
  '{0} models': ['{0} modelos', 'Моделей: {0}'],
  '{0} model': ['{0} modelo', 'Моделей: {0}'],
  'Generator': ['Generador', 'Генератор'],
  'From the model table in Arshad’s {0} catalogue.': ['De la tabla de modelos del catálogo {0} de Arshad.', 'Из таблицы моделей в каталоге Arshad {0} года.'],
  'Catalogue photo. There is no 3D model of this series yet.': ['Foto del catálogo. Aún no hay modelo 3D de esta serie.', 'Фото из каталога. 3D-модели этой серии пока нет.'],
  'FTS generators, from FTS {0} to FTS {1}': ['Generadores FTS, del FTS {0} al FTS {1}', 'Генераторы FTS: от FTS {0} до FTS {1}'],
  'Four FTS corona generators of different sizes, side by side': ['Cuatro generadores corona FTS de distintos tamaños, uno al lado del otro', 'Четыре генератора FTS разного размера рядом'],
  'Violet corona discharge between the electrode and the treater roll': ['Descarga corona violeta entre el electrodo y el rodillo de tratamiento', 'Фиолетовый коронный разряд между электродом и валом'],
  'ACT LBL CM: two narrow web label treater stations': ['ACT LBL CM: dos estaciones de tratamiento para etiquetas de banda estrecha', 'ACT LBL CM: две станции обработки узкорулонных этикеток'],
  'What is corona treatment?': ['¿Qué es el tratamiento corona?', 'Что такое коронная обработка?'],
  'Product photos': ['Fotos de producto', 'Фото продукции'],
  // labels on the film and 3D objects pages that had no translation yet
  'film series': ['series de película', 'серий для плёнки'],
  'web widths': ['anchos de banda', 'ширина полотна'],
  'top line speed': ['velocidad máxima de línea', 'макс. скорость линии'],
  'Fluxomatic® · Multilayer blown film': ['Fluxomatic® · Película soplada multicapa', 'Fluxomatic® · Многослойная рукавная плёнка'],
  'Fluxomatic® · IBC blown film': ['Fluxomatic® · Película soplada IBC', 'Fluxomatic® · Рукавная плёнка IBC'],
  'Fluxomatic® · Monolayer blown film': ['Fluxomatic® · Película soplada monocapa', 'Fluxomatic® · Однослойная рукавная плёнка'],
  'Fluxomatic® · Narrow web labels': ['Fluxomatic® · Etiquetas de banda estrecha', 'Fluxomatic® · Узкорулонные этикетки'],
  'Multilayer blown film · {0} – {1} mm': ['Película soplada multicapa · {0} – {1} mm', 'Многослойная рукавная плёнка · {0} – {1} мм'],
  'IBC blown film · {0} – {1} mm': ['Película soplada IBC · {0} – {1} mm', 'Рукавная плёнка IBC · {0} – {1} мм'],
  'Monolayer blown film · {0} – {1} mm': ['Película soplada monocapa · {0} – {1} mm', 'Однослойная рукавная плёнка · {0} – {1} мм'],
  'Narrow web labels · {0} mm': ['Etiquetas de banda estrecha · {0} mm', 'Узкорулонные этикетки · {0} мм'],
  'Narrow web labels · up to {0} m/min': ['Etiquetas de banda estrecha · hasta {0} m/min', 'Узкорулонные этикетки · до {0} м/мин'],
  'ACT LBL CM · Narrow web labels': ['ACT LBL CM · Etiquetas de banda estrecha', 'ACT LBL CM · Узкорулонные этикетки'],
  'ACT CBL · Cables': ['ACT CBL · Cables', 'ACT CBL · Кабели'],
  'ACT CBL · cables': ['ACT CBL · cables', 'ACT CBL · кабели'],
  'Fin-type electrodes, micro gap adjustment': ['Electrodos de aletas, con ajuste micrométrico del entrehierro', 'Пластинчатые электроды, микрорегулировка зазора'],
  'Dynamically balanced aluminium rollers, dielectric sleeve': ['Rodillos de aluminio equilibrados dinámicamente, con funda dieléctrica', 'Динамически сбалансированные алюминиевые валы с диэлектрической оболочкой'],
  'Entry and exit guide rollers': ['Rodillos guía de entrada y salida', 'Направляющие валы на входе и выходе'],
  'More about Blown / cast film': ['Más sobre película soplada / cast', 'Подробнее о рукавной и литой плёнке'],
  'The ACT MML IBC series is designed for IBC blown film extruders. It consists of the generator, an oil-cooled high voltage transformer, a pneumatic operated electrode assembly and an ozone extraction system.': [
    'La serie ACT MML IBC está diseñada para extrusoras de película soplada IBC. Consta del generador, un transformador de alta tensión refrigerado por aceite, un conjunto de electrodos de accionamiento neumático y un sistema de extracción de ozono.',
    'Серия ACT MML IBC предназначена для экструдеров рукавной плёнки с IBC. Она состоит из генератора, высоковольтного трансформатора с масляным охлаждением, пневматического электродного узла и системы удаления озона.'],
  'Series photos': ['Fotos de las series', 'Фото серий'],
  '{0} out of {1}': ['{0} de {1}', '{0} из {1}'],
  'FAQ topics': ['Temas de preguntas frecuentes', 'Темы вопросов']
};
const add = (dict, i) => { if (dict) Object.keys(D).forEach(k => { if (!(k in dict)) dict[k] = D[k][i]; }); };
add(window.I18N_ES, 0); add(window.I18N_RU, 1);
})();
