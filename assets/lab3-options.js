/* Arshad Site Lab 3 (16 Oct 2026): the Lab 2 options drawer, forked for the Lab 3 redesign (lab3.css + lab3.js).
   Lab 2 is left as it was. Changes from Lab 2:
   - backgrounds are solid colours or textured solids only, painted on every section sheet (no drawn backgrounds);
   - a Motion tab: section transitions, content entrance, picture reveals, card style, page change, typeface;
   - picks are kept apart from Lab 2's (own storage key).
   Lab 2's notes follow.
   1. colour palettes (ground + accent),
   2. positional layout options that keep every page's text and information exactly the same.
   Layout variants taken from the Site Lab were each checked by rendering every page and comparing all of its text
   with draft 1; only variants with identical text are offered. The rest are new arrangements of the same blocks
   (mirroring, alignment, width, section order).
   Loaded before draft.js: picks saved on this device are applied before the first render. */
(() => {
'use strict';
const C = window.DRAFT, KEY = 'arshad-demo2-picks';
// ArshadElectronics-demo1 opens on the user's picks of 16 Oct 2026 (Warm paper, Linen at Subtle, flat cards; the rest as Lab 3)
const DEMO_PICKS = { pal: 'paperwarm', back: 'linen', fxCards: 'flat', pPics: 'site', d1v: 2 };
const clone = o => JSON.parse(JSON.stringify(o));
const ORIG = { S: clone(C.S), pins: clone(C.pins) };

/* ---------- 1. colour palettes ---------- */
// look: the Site Lab look the palette starts from; vars: the colour tokens it changes; sw: swatches shown in the drawer
const PALETTES = [
  { k: 'olive', g: 'Dark grounds', name: 'Olive night', note: 'Draft 1: near-black olive with the logo green.', look: 'dark', sw: ['#11150C', '#181D11', '#E8EBDF', '#576630', '#AFBF80'] },
  { k: 'graphite', g: 'Dark grounds', name: 'Graphite', note: 'Neutral charcoal, no green cast; the logo green carries the brand.', look: 'dark',
    vars: { bg: '#121314', surf: '#1A1B1D', surf2: '#202225', ink: '#ECEDEA', mut: '#A4A7A1', line: '#2E3033', brandTx: '#B5C48A', logoC: '#C9D5A2' } },
  { k: 'forest', g: 'Dark grounds', name: 'Deep forest', note: 'Rich dark green, softer and warmer than olive night.', look: 'dark',
    vars: { bg: '#0C1A13', surf: '#12231A', surf2: '#172A20', ink: '#E6EFE8', mut: '#9DB3A6', line: '#22392E', brand: '#4E7B45', brandD: '#3A5E33', brandTx: '#A6CF9A', logoC: '#BFD8B4' } },
  { k: 'midnight', g: 'Dark grounds', name: 'Midnight steel', note: 'Blue-grey night with olive accents; more engineering, less earthy.', look: 'dark',
    vars: { bg: '#0E1319', surf: '#141B23', surf2: '#19212B', ink: '#E7ECF1', mut: '#9AA6B2', line: '#26313D', brand: '#5E6E31', brandD: '#48552A', brandTx: '#C2CF8E', logoC: '#C9D5A2' } },
  { k: 'blueprint', g: 'Dark grounds', name: 'Blueprint', note: 'Lighter dark olive with a faint drawing grid.', look: 'blueprint', sw: ['#26301A', '#2D381F', '#E7EADD', '#576630', '#C9D2A6'] },
  { k: 'light', g: 'Light grounds', name: 'Clean light', note: 'Off-white with the logo green; closest to the current site.', look: 'light', sw: ['#F5F5EF', '#FFFFFF', '#1B1F14', '#576630', '#576630'] },
  { k: 'paperwarm', g: 'Light grounds', name: 'Warm paper', note: 'Cream ground, charcoal text, olive actions; printed-brochure feel.', look: 'light',
    vars: { bg: '#F5F1E8', surf: '#FFFDF8', surf2: '#ECE6D8', ink: '#1F1D17', mut: '#625C4E', line: '#DDD5C3', brandTx: '#4A5728' } },
  { k: 'steel', g: 'Light grounds', name: 'Steel grey', note: 'Cool light grey, crisp and technical.', look: 'light',
    vars: { bg: '#EDEFF1', surf: '#FFFFFF', surf2: '#E2E5E9', ink: '#161A1F', mut: '#566069', line: '#CDD2D8', brandTx: '#4F5E2A' } },
  { k: 'sage', g: 'Light grounds', name: 'Sage', note: 'Muted grey-green throughout.', look: 'sage', sw: ['#E4E6DE', '#F3F4EE', '#1B1F14', '#576630', '#576630'] },
  { k: 'paper', g: 'Light grounds', name: 'Studio white', note: 'Pure white, hairline borders, square corners.', look: 'paper', sw: ['#FFFFFF', '#F7F7F4', '#101210', '#576630', '#576630'] },
  { k: 'ivory', g: 'Light grounds', name: 'Ivory', note: 'The lightest warm ground: soft ivory with white cards.', look: 'light',
    vars: { bg: '#FBF8F1', surf: '#FFFFFF', surf2: '#F1ECDF', ink: '#1C1B16', mut: '#5F5B4E', line: '#E4DDCB', brandTx: '#4A5728' } },
  { k: 'sand', g: 'Light grounds', name: 'Sand beige', note: 'Beige ground with cream cards and warm charcoal text.', look: 'light',
    vars: { bg: '#EFE6D6', surf: '#FAF5EA', surf2: '#E3D8C3', ink: '#221E15', mut: '#5E5646', line: '#D3C6AC', brandTx: '#46522A' } },
  { k: 'stone', g: 'Light grounds', name: 'Stone', note: 'Warm light grey, between beige and steel.', look: 'light',
    vars: { bg: '#E9E6DF', surf: '#F7F5F0', surf2: '#DCD7CC', ink: '#1D1C19', mut: '#59554C', line: '#CBC5B7', brandTx: '#4A5728' } },
  { k: 'palegreen', g: 'Light grounds', name: 'Pale green', note: 'A very light green ground with white cards and a fresher green.', look: 'light',
    vars: { bg: '#EFF4EA', surf: '#FFFFFF', surf2: '#E0EAD8', ink: '#16201A', mut: '#4F5E52', line: '#CBD8C2', brand: '#4E7B45', brandD: '#3A5E33', brandTx: '#356B30' } },
  { k: 'mist', g: 'Light grounds', name: 'Mist', note: 'Near-white with a cool tint; the airiest of the set.', look: 'light',
    vars: { bg: '#F6F8F7', surf: '#FFFFFF', surf2: '#E9EEEC', ink: '#161A19', mut: '#566260', line: '#D7DEDB', brandTx: '#4A5728' } },
  { k: 'bbwg', g: 'Beige, black, white and green', name: 'Beige, black, white, green', note: 'Beige pages, white cards, black type with a black opening and footer, green for buttons and links.', look: 'lightdark',
    vars: { bg: '#EDE3D0', surf: '#FFFFFF', surf2: '#E1D5BD', ink: '#0C0C0A', mut: '#544E3F', line: '#D2C5AA', brand: '#2E6B3A', brandD: '#24552D', brandTx: '#285F33', heroBg: '#0B0B0A', heroInk: '#FFFFFF', heroMut: '#CFC8B8', heroLine: '#2B2A26' },
    sw: ['#EDE3D0', '#0B0B0A', '#FFFFFF', '#2E6B3A', '#285F33'],
    css: `html[data-pal="bbwg"] .hp .ftr{--surf:#0B0B0A;--surf2:#17171A;--ink:#FFFFFF;--mut:#C9C2B2;--line:#2B2A26;--brandTx:#9FD39A;background:#0B0B0A;color:#FFFFFF}
html[data-pal="bbwg"] .hp .hero{--brandTx:#9FD39A}` },
  { k: 'bbwg2', g: 'Beige, black, white and green', name: 'White, beige bands, black, green', note: 'The same four colours the other way round: white pages, beige cards and bands.', look: 'lightdark',
    vars: { bg: '#FFFFFF', surf: '#F3EBDB', surf2: '#E8DDC8', ink: '#0C0C0A', mut: '#544E3F', line: '#DCD1BA', brand: '#2E6B3A', brandD: '#24552D', brandTx: '#285F33', heroBg: '#0B0B0A', heroInk: '#FFFFFF', heroMut: '#CFC8B8', heroLine: '#2B2A26' },
    sw: ['#FFFFFF', '#0B0B0A', '#EDE3D0', '#2E6B3A', '#285F33'],
    css: `html[data-pal="bbwg2"] .hp .ftr{--surf:#0B0B0A;--surf2:#17171A;--ink:#FFFFFF;--mut:#C9C2B2;--line:#2B2A26;--brandTx:#9FD39A;background:#0B0B0A;color:#FFFFFF}
html[data-pal="bbwg2"] .hp .hero{--brandTx:#9FD39A}` },
  { k: 'lightdark', g: 'Mixed', name: 'Light, dark hero', note: 'Light pages that open on a dark hero.', look: 'lightdark', sw: ['#141810', '#F5F5EF', '#1B1F14', '#576630', '#C9D5A2'] },
  { k: 'green', g: 'Mixed', name: 'Brand green bands', note: 'Light pages with bold logo-green hero and bands.', look: 'green', sw: ['#576630', '#F5F5EF', '#FFFFFF', '#576630', '#E7ECD6'] }
];
PALETTES.forEach(p => { if (!p.sw){ const v = p.vars; p.sw = [v.bg, v.surf, v.ink, v.brand || '#576630', v.brandTx]; } });
const DARK = new Set(['dark', 'blueprint']);
// accent: the action / brand colour (buttons, links, highlights); tx = text colour on dark / light grounds
const ACCENTS = [
  { k: 'olive', name: 'Logo olive', note: 'Draft 1', sw: '#576630' },
  { k: 'lime', name: 'Bright olive', fill: '#6F8A2E', d: '#56701F', txD: '#C2D98A', txL: '#55701C', sw: '#6F8A2E' },
  { k: 'amber', name: 'Amber', fill: '#B9781A', d: '#93600F', txD: '#E9B866', txL: '#8F5A0C', sw: '#B9781A' },
  { k: 'violet', name: 'Corona violet', fill: '#6A55C2', d: '#5242A0', txD: '#BBA8FF', txL: '#5A45B0', sw: '#6A55C2' },
  { k: 'steelblue', name: 'Steel blue', fill: '#3E6A87', d: '#2F546D', txD: '#9CC3DB', txL: '#2F5B78', sw: '#3E6A87' }
];
const css = [];
PALETTES.forEach(p => { if (p.vars) css.push(`html[data-pal="${p.k}"] .hp{${Object.entries(p.vars).map(([k, v]) => `--${k}:${v}`).join(';')}}`); if (p.css) css.push(p.css); });
ACCENTS.forEach(a => { if (!a.fill) return;
  css.push(`html[data-acc="${a.k}"] .hp{--brand:${a.fill};--brandD:${a.d};--brandInk:#FFFFFF;--brandTx:${a.txL}}`);
  css.push(`html[data-acc="${a.k}"][data-pdark="1"] .hp{--brandTx:${a.txD}}`); });

/* ---------- 1b. surfaces: solid colour or a textured solid ---------- */
// Lab 3 paints the surface on every section sheet and on the tray behind them, so a texture is a small tile tinted
// with the palette's text colour (made again whenever the palette changes), not a mask on one fixed layer.
const BACKS = [
  { k: 'plain', g: 'Solid', name: 'Solid colour', note: 'The palette ground only, no texture.' },
  // fine finishes: the quietest, close to a solid colour
  { k: 'grain', g: 'Fine finishes', name: 'Fine grain', note: 'Matt and slightly grainy, like uncoated paper.' },
  { k: 'sand', g: 'Fine finishes', name: 'Sandblasted', note: 'A coarser, even grit, like a blasted metal panel.' },
  { k: 'satin', g: 'Fine finishes', name: 'Satin', note: 'Soft, long streaks with a low sheen.' },
  { k: 'frost', g: 'Fine finishes', name: 'Frosted glass', note: 'A soft cloudiness, like etched glass.' },
  { k: 'powder', g: 'Fine finishes', name: 'Powder coat', note: 'A fine speckle, like a powder-coated machine cover.' },
  // metal and industrial
  { k: 'brushed', g: 'Metal and industrial', name: 'Brushed metal', note: 'Fine horizontal streaks, like a brushed steel panel.' },
  { k: 'anodised', g: 'Metal and industrial', name: 'Anodised aluminium', note: 'Very fine, even lines, like an anodised extrusion.' },
  { k: 'hammer', g: 'Metal and industrial', name: 'Hammertone', note: 'The dimpled paint finish found on machine cabinets.' },
  { k: 'mesh', g: 'Metal and industrial', name: 'Expanded metal', note: 'An open diamond mesh, like a machine guard.' },
  { k: 'hex', g: 'Metal and industrial', name: 'Honeycomb', note: 'Small hexagon cells.' },
  { k: 'corrugated', g: 'Metal and industrial', name: 'Corrugated sheet', note: 'Soft upright waves, like a corrugated panel.' },
  { k: 'ribbed', g: 'Metal and industrial', name: 'Ribbed', note: 'Fine upright ribs, like an extruded sheet.' },
  { k: 'knurl', g: 'Metal and industrial', name: 'Knurled', note: 'A fine diamond crosshatch, like a knurled roller.' },
  { k: 'perf', g: 'Metal and industrial', name: 'Perforated sheet', note: 'Small staggered holes, like a punched metal guard.' },
  { k: 'plate', g: 'Metal and industrial', name: 'Chequer plate', note: 'The raised lozenges of factory floor plate.' },
  { k: 'carbon', g: 'Metal and industrial', name: 'Carbon weave', note: 'A tight twill weave.' },
  // stone and mineral
  { k: 'concrete', g: 'Stone and mineral', name: 'Concrete', note: 'Soft uneven patches with a fine grain.' },
  { k: 'terrazzo', g: 'Stone and mineral', name: 'Terrazzo', note: 'Scattered chips of different sizes.' },
  { k: 'slate', g: 'Stone and mineral', name: 'Slate', note: 'Faint layers running across.' },
  { k: 'sandstone', g: 'Stone and mineral', name: 'Sandstone', note: 'A warm, uneven grain.' },
  // paper and fabric
  { k: 'recycled', g: 'Paper and fabric', name: 'Recycled paper', note: 'A soft grain with the odd fleck.' },
  { k: 'kraft', g: 'Paper and fabric', name: 'Kraft paper', note: 'Grain with short fibres.' },
  { k: 'linen', g: 'Paper and fabric', name: 'Linen', note: 'Fine uneven threads running both ways.' },
  { k: 'canvas', g: 'Paper and fabric', name: 'Canvas', note: 'A plain, even weave.' },
  { k: 'woven', g: 'Paper and fabric', name: 'Woven', note: 'A small basket weave, a nod to woven fabric.' },
  { k: 'twill', g: 'Paper and fabric', name: 'Twill', note: 'Fine diagonal ribs, like workwear cloth.' },
  { k: 'felt', g: 'Paper and fabric', name: 'Felt', note: 'A soft, fuzzy matt surface.' }
];
// demo1: the surfaces the user kept (16 Oct); Linen is the starting surface
const D1_DROP = new Set(['grain', 'sand', 'satin', 'frost', 'powder', 'hex', 'corrugated', 'plate', 'perf', 'knurl', 'sandstone', 'recycled', 'woven', 'canvas', 'mesh', 'terrazzo']);
for (let i = BACKS.length - 1; i >= 0; i--) if (D1_DROP.has(BACKS[i].k)) BACKS.splice(i, 1);
const BACK0 = 'linen';
const STRENGTH = [['faint', 'Faint'], ['', 'Subtle'], ['strong', 'Stronger']];
// tile = [width, height, svg body, base opacity]; INK is replaced by the text colour, R G B by its channels (0-1)
const noise = (f, o, g, off, seed) => `<filter id='n${seed}' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='${f}' numOctaves='${o}' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 R 0 0 0 0 G 0 0 0 0 B 0 0 0 ${g} ${off}'/></filter><rect width='100%' height='100%' filter='url(#n${seed})'/>`;
const TEX = {
  grain: [240, 240, noise('.8', 2, 1.5, -.42, 4), .11],
  brushed: [600, 240, noise('.004 .5', 3, 2.2, -.75, 7), .05],
  powder: [220, 220, noise('.6', 1, 10, -6.1, 11), .2],
  woven: [12, 12, `<path d='M0 1h5v4H0zM6 7h6v4H6zM7 0h4v5H7zM1 6h4v6H1z' fill='INK'/>`, .038],
  concrete: [520, 520, noise('.011', 4, 2.4, -.95, 5) + noise('.9', 2, .9, -.3, 6), .07],
  linen: [300, 300, noise('.9 .035', 2, 1.7, -.55, 8) + noise('.035 .9', 2, 1.7, -.55, 9), .09],
  recycled: [360, 360, noise('.75', 2, 1.1, -.36, 12) + noise('.16', 1, 12, -7.9, 13), .12],
  hammer: [420, 420, noise('.1', 2, 3.6, -1.6, 14), .05],
  ribbed: [7, 8, `<g fill='INK'><rect width='1' height='8'/><rect x='1' width='1' height='8' opacity='.55'/><rect x='2' width='1' height='8' opacity='.22'/></g>`, .06],
  knurl: [9, 9, `<path d='M-1 -1L10 10M10 -1L-1 10' stroke='INK' stroke-width='.9' fill='none'/>`, .07],
  carbon: [10, 10, `<defs><linearGradient id='a' x2='0' y2='1'><stop offset='0' stop-color='INK'/><stop offset='1' stop-color='INK' stop-opacity='.12'/></linearGradient><linearGradient id='b'><stop offset='0' stop-color='INK'/><stop offset='1' stop-color='INK' stop-opacity='.12'/></linearGradient></defs><path d='M0 0h5v5H0zM5 5h5v5H5z' fill='url(#a)'/><path d='M5 0h5v5H5zM0 5h5v5H0z' fill='url(#b)'/>`, .07],
  perf: [12, 12, `<g fill='INK'><circle cx='3' cy='3' r='1.7'/><circle cx='9' cy='9' r='1.7'/></g>`, .09],
  plate: [36, 36, `<g fill='INK'><ellipse cx='9' cy='9' rx='7' ry='1.9' transform='rotate(45 9 9)'/><ellipse cx='27' cy='27' rx='7' ry='1.9' transform='rotate(45 27 27)'/><ellipse cx='27' cy='9' rx='7' ry='1.9' transform='rotate(-45 27 9)'/><ellipse cx='9' cy='27' rx='7' ry='1.9' transform='rotate(-45 9 27)'/></g>`, .05],
  // round 2 (16 Oct 2026): more still textures
  sand: [200, 200, noise('.55', 1, 1.6, -.5, 22), .1],
  satin: [520, 320, noise('.003 .02', 2, 1.3, -.42, 23), .07],
  frost: [360, 360, noise('.06', 2, .95, -.26, 24), .08],
  anodised: [4, 3, `<g fill='INK'><rect width='4' height='1' opacity='.55'/><rect y='2' width='4' height='1' opacity='.22'/></g>`, .05],
  mesh: [24, 14, `<path d='M0 7L12 0L24 7L12 14Z' fill='none' stroke='INK' stroke-width='1.6'/>`, .07],
  hex: [28, 49, `<path fill='INK' d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/>`, .05],
  corrugated: [16, 8, `<defs><linearGradient id='cg'><stop offset='0' stop-color='INK' stop-opacity='0'/><stop offset='.5' stop-color='INK'/><stop offset='1' stop-color='INK' stop-opacity='0'/></linearGradient></defs><rect width='16' height='8' fill='url(#cg)'/>`, .05],
  terrazzo: [320, 320, noise('.09', 1, 14, -9.4, 25) + noise('.35', 1, 14, -9.9, 26), .14],
  slate: [520, 320, noise('.006 .05', 4, 2, -.8, 27), .08],
  sandstone: [400, 400, noise('.04', 3, 1.4, -.55, 28) + noise('.9', 1, .9, -.35, 29), .08],
  kraft: [360, 360, noise('.9', 2, 1.2, -.4, 30) + noise('.12 .5', 2, 2.2, -1.1, 31), .09],
  canvas: [6, 6, `<g fill='INK'><rect width='6' height='2' opacity='.6'/><rect width='2' height='6' opacity='.45'/></g>`, .06],
  twill: [8, 8, `<path d='M0 8L8 0M-2 2L2 -2M6 10L10 6' stroke='INK' stroke-width='2'/>`, .06],
  felt: [300, 300, noise('.35', 3, 1, -.32, 32), .1]
};
const hex6 = c => { c = (c || '').trim(); const m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i); if (m){ let h = m[1]; if (h.length === 3) h = h.replace(/./g, x => x + x); return '#' + h; } const n = c.match(/[\d.]+/g); return n ? '#' + n.slice(0, 3).map(v => (+v | 0).toString(16).padStart(2, '0')).join('') : '#888888'; };
// the tinted tile as a CSS background layer ("url(...) 0 0/240px 240px"), or none for a solid colour
function texLayer(k, ink, mult){
  const t = TEX[k]; if (!t) return 'none';
  const hx = hex6(ink), [r, g, b] = [1, 3, 5].map(i => (parseInt(hx.slice(i, i + 2), 16) / 255).toFixed(3));
  const body = t[2].replace(/INK/g, hx).replace(/ R 0 0 0 0 G 0 0 0 0 B /g, ` ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} `);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${t[0]}' height='${t[1]}'><g opacity='${texAlpha(k, mult).toFixed(3)}'>${body}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0/${t[0]}px ${t[1]}px`;
}
// readability (16 Oct 2026): a texture under text is capped at 15% of the text colour, and "Stronger" goes less far,
// so even the strongest setting keeps text readable (drawer swatches, mult 2.2, are only previews and may go higher)
const TEX_CAP = .15;
const texAlpha = (k, mult) => { const t = TEX[k]; return t ? Math.min(mult > 2 ? .6 : TEX_CAP, t[3] * mult) : 0; };
const strengthMult = () => { const light = document.documentElement.dataset.pdark === '0'; const k = picks.backK || ''; return (k === 'faint' ? (light ? .45 : .55) : k === 'strong' ? (light ? 1.2 : 1.4) : (light ? .8 : 1)); };
/* readability guard: muted text, labels and family names are nudged toward the text colour, only as far as needed,
   so they stay at 4.5:1 or more on the palette's grounds with the current texture over them */
const GUARD = ['--mut', '--brandTx', '--acF', '--acS', '--acI', '--acP', '--famF', '--famS', '--famI', '--famP'];
const pcol = c => { let m = (c || '').match(/^rgba?\(([^)]+)\)/); if (m){ const v = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat); return v.slice(0, 3); }
  m = (c || '').match(/^color\(srgb ([^)]+)\)/); if (m){ const v = m[1].split(/[\s\/]+/).filter(Boolean).map(parseFloat); return v.slice(0, 3).map(x => x * 255); } return null; };
const lumi = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cratio = (a, b) => { const x = lumi(a), y = lumi(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const cmix = (a, b, t) => a.map((v, i) => v * (1 - t) + b[i] * t);
const chex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
function guard(alpha){
  const site = document.getElementById('site'); if (!site) return;
  GUARD.forEach(k => { site.style.removeProperty(k); document.body.style.removeProperty(k); });
  const pr = document.createElement('span'); pr.setAttribute('aria-hidden', 'true'); pr.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  // measured inside the page's main area, not as a direct child of #site: adding to #site would count as a page change and run this again
  (site.querySelector('main') || site).appendChild(pr);
  const rc = v => { pr.style.color = ''; pr.style.color = v; return pcol(getComputedStyle(pr).color); };
  // checked against at least an 11% texture and aimed a little above 4.5:1, for a margin
  const ink = rc('var(--ink)'), grounds = ['var(--bg)', 'var(--surf2)'].map(rc).filter(Boolean).map(g => cmix(g, ink, Math.max(alpha, .11)));
  const cs = getComputedStyle(site);
  GUARD.forEach(k => {
    if (!cs.getPropertyValue(k).trim()) return;
    const c = rc(`var(${k})`); if (!c || !ink) return;
    let t = 0, cur = c; const low = () => Math.min(...grounds.map(g => cratio(cur, g)));
    while (t < 1 && low() < 4.7){ t += .04; cur = cmix(c, ink, t); }
    if (t > 0){ const h = chex(cur); site.style.setProperty(k, h); document.body.style.setProperty(k, h); }
  });
  pr.remove();
}
// after each render the palette's tokens are on the page: tint the tile and hand it to lab3.css as --l3tex
function paintTex(){
  const site = document.getElementById('site'); if (!site) return;
  const ink = getComputedStyle(site).getPropertyValue('--ink');
  document.documentElement.style.setProperty('--l3tex', texLayer(back().k, ink, strengthMult()));
  guard(texAlpha(back().k, strengthMult()));
  document.querySelectorAll('#lab2 [data-sw]').forEach(el => { el.style.background = `${texLayer(el.dataset.sw, ink, 2.2)}, ${getComputedStyle(site).getPropertyValue('--bg')}`; });
}
const st = document.createElement('style'); st.id = 'lab2-pal'; st.textContent = css.join('\n'); document.head.appendChild(st);

/* ---------- 1c. motion and finish (Lab 3) ---------- */
const EFFECTS = [
  { k: 'fxSheets', label: 'Section transitions', opts: [['', 'Layered sheets: each section slides over the last, which sinks back'], ['rise', 'Overlapping sheets, nothing sinks'], ['flat', 'Off: one continuous page']] },
  { k: 'fxEnter', label: 'Content entrance', opts: [['', 'Blur-up, staggered'], ['fade', 'Simple fade'], ['off', 'Off']] },
  { k: 'fxImg', label: 'Pictures', opts: [['', 'Mask reveal with depth parallax'], ['off', 'Still']] },
  { k: 'fxCards', label: 'Cards and panels', opts: [['', 'Machined trays with a spotlight edge'], ['flat', 'Flat, as draft 1']] },
  { k: 'fxPage', label: 'Changing page', opts: [['', 'Layered wipe'], ['none', 'Instant']] },
  { k: 'type', label: 'Typeface', opts: [['', 'Geist and Geist Mono'], ['d1', 'Montserrat and Inter (draft 1)']] }
];
const FX = {}; EFFECTS.forEach(e => { FX[e.k] = e; });

/* ---------- 2. layout options ---------- */
// t: 'S' = a site setting (the page is redrawn), 'A' = an arrangement done in CSS on the same blocks
// the first choice is always draft 1; for 'S' settings it means "as draft 1", including the per-page picks
const D1 = 'As draft 1';
const LAYOUT = [
  { g: 'Whole site', pages: '*', items: [
    { k: 'hdr', t: 'S', label: 'Header', opts: [['', D1 + ' (floating pill)'], ['a', 'Full-width bar with email and phone strip']] },
    { k: 'width', t: 'A', label: 'Page width', opts: [['', 'Standard'], ['narrow', 'Narrow'], ['wide', 'Wide']] },
    { k: 'heads', t: 'A', label: 'Section headings', opts: [['', 'Left'], ['center', 'Centred'], ['split', 'Heading left, intro right']] }
  ] },
  { g: 'Homepage', pages: ['home'], items: [
    { k: 'heroTop', t: 'A', label: 'Opening headline', opts: [['', 'Headline left, intro right'], ['stack', 'Stacked'], ['center', 'Centred']] },
    { k: 'hero', t: 'S', label: 'Product panels', opts: [['', D1 + ' (expanding panels)'], ['a', 'Four equal doors'], ['b', 'Two big, two small']] },
    { k: 'story', t: 'A', label: 'Our story', opts: [['', 'Photo left'], ['right', 'Photo right']] },
    { k: 'proof', t: 'A', label: 'Numbers', opts: [['', 'Globe left'], ['right', 'Globe right'], ['top', 'Globe above numbers']] },
    { k: 'why', t: 'A', label: 'Why Arshad', opts: [['', 'Four in a row'], ['grid', 'Two by two'], ['list', 'One column']] },
    { k: 'pars', t: 'A', label: 'Partners', opts: [['', 'Three in a row'], ['list', 'Stacked']] },
    { k: 'help', t: 'A', label: 'Help me choose + FAQ', opts: [['', 'Side by side'], ['stack', 'Stacked']] }
  ] },
  { g: 'Contact (homepage and Contact page)', pages: ['home', 'contact'], items: [
    { k: 'con', t: 'A', label: 'Contact block', opts: [['', 'Details left, form right'], ['swap', 'Form left, details right']] }
  ] },
  { g: 'Product verticals (Fluxomatic, Fluxosealer)', pages: ['fluxomatic', 'fluxosealer'], items: [
    { k: 'hubHero', t: 'S', label: 'Opening', opts: [['', D1], ['split', 'Text and picture side by side'], ['photo', 'Text over the photo'], ['type', 'Big type, picture below']] },
    { k: 'hubSeries', t: 'S', label: 'Series', opts: [['', D1 + ' (cards)'], ['rail', 'Sideways rail'], ['list', 'List']] },
    { k: 'two', t: 'A', label: 'Overview columns', opts: [['', 'As built'], ['swap', 'Swapped']] }
  ] },
  { g: 'Product pages (all six change together)', pages: ['films', 'woven', 'objects', 'brezo', 'aurae', 'simco'], note: 'Every product page shares one layout: an opening with the picture or 3D model, the description and the series buttons, then specs, how it works, demos, industries, FAQ and the enquiry. Each option here changes all six pages at once, except Product pictures: Simco-Ion keeps its own product photos either way.', items: [
    { k: 'pPics', t: 'S', label: 'Product pictures', opts: [['', '3D models and current images'], ['site', 'Product photos']] },
    { k: 'pOpen', t: 'A', label: 'Opening arrangement', opts: [['', 'Text left, picture right'], ['left', 'Picture left, text right'], ['above', 'Picture full width above the text']] },
    { k: 'pSeries', t: 'A', label: 'Series buttons', opts: [['', 'Pill row under the description'], ['tabs', 'Tabs above the picture'], ['list', 'List beside the picture']] },
    { k: 'pSpecs', t: 'A', label: 'Specs', opts: [['', 'Table panel'], ['cards', 'Compact cards']] },
    { k: 'tDemo', t: 'S', label: 'Demos', opts: [['', 'Stacked'], ['tabs', 'Tabs, one at a time'], ['grid', 'Grid']] },
    { k: 'order', t: 'A', label: 'Section order', opts: [['', 'Specs, how it works, demos, industries, FAQ, enquiry'], ['how', 'How it works before specs'], ['demos', 'Demos straight after the opening']] }
  ] },
  { g: 'About us', pages: ['about'], items: [
    { k: 'abTimeline', t: 'S', label: 'Timeline', opts: [['', D1 + ' (rail)'], ['vertical', 'Vertical'], ['chapters', 'Chapters']] },
    { k: 'abStrengths', t: 'S', label: 'Strengths', opts: [['', D1 + ' (grid)'], ['list', 'List']] },
    { k: 'two', t: 'A', label: 'Our focus columns', opts: [['', 'As built'], ['swap', 'Swapped']] }
  ] },
  { g: 'Testimonials (About us and Clients)', pages: ['about', 'clients'], items: [
    { k: 'abQuotes', t: 'S', label: 'Testimonials', opts: [['', D1 + ' (cards)'], ['slider', 'Slider']] }
  ] },
  { g: 'FAQ page', pages: ['faq'], items: [
    { k: 'faqLayout', t: 'S', label: 'Questions', opts: [['', D1 + ' (grouped)'], ['tabs', 'Tabs'], ['cols', 'Two columns']] }
  ] }
];
const ITEMS = {}; LAYOUT.forEach(g => g.items.forEach(i => { ITEMS[i.k] = i; }));
const FILMKEYS = new Set(['tHero', 'tHow', 'tModels', 'tSpecs', 'tDemo', 'tInd', 'tFaq', 'tEnq']);
// the agreed order is built into the page (site.js ORDER.template); these are the alternatives offered in the drawer
const ORDERS = {
  how: ['How it works', 'Specs', 'Demos', 'Industries', 'More', 'FAQ', 'Enquiry'],
  demos: ['Demos', 'Specs', 'How it works', 'Industries', 'More', 'FAQ', 'Enquiry']
};

/* ---------- picks ---------- */
let picks = {};
try { const saved = localStorage.getItem(KEY); picks = saved ? (JSON.parse(saved) || {}) : Object.assign({}, DEMO_PICKS); } catch (e){ picks = Object.assign({}, DEMO_PICKS); }
// picks saved before the Product pictures switch existed start on the site photos too
if (picks.d1v !== 2){ picks.pPics = 'site'; picks.d1v = 2; }
// the drawer offers colour, surface and product images only: every other pick comes from the demo1 picks
{ const keep = ['pal', 'acc', 'back', 'backK', 'pPics', 'd1v'];
  Object.keys(picks).forEach(k => { if (!keep.includes(k)) delete picks[k]; });
  Object.keys(DEMO_PICKS).forEach(k => { if (!keep.includes(k)) picks[k] = DEMO_PICKS[k]; });
  if (picks.back && D1_DROP.has(picks.back)) picks.back = 'linen'; }
const pal = () => PALETTES.find(p => p.k === picks.pal) || PALETTES[0];
// some palettes bring their own action colour; the first accent choice then means "as the palette"
const ownAcc = () => (pal().vars || {}).brand;
const back = () => BACKS.find(b => b.k === (picks.back || BACK0)) || BACKS[1];
function toDraft(){
  const S = clone(ORIG.S), pins = clone(ORIG.pins);
  S.look = pal().look;
  // Lab 3: no drawn backgrounds anywhere (solid colours and textures only, painted by lab3.css), plain section flow
  // (lab3.css adds its own sheets and transitions), and the layered wipe between pages unless it is switched off
  S.bg = 'off'; S.pbg = 'same'; Object.values(pins).forEach(p => delete p.pbg);
  S.sheets = 'flat'; S.trans = picks.fxPage === 'none' ? 'none' : 'wipe';
  // round 2: every product page on the one shared template and opening, no per-page layout pins; no Share buttons
  S.uni = 'template'; S.tHero = 'split'; S.share = 0;
  Object.values(pins).forEach(p => ['uni', 'tHero', 'tHow', 'tModels', 'tSpecs', 'tDemo', 'tInd', 'tFaq', 'tEnq', 'treat'].forEach(k => delete p[k]));
  Object.entries(picks).forEach(([k, v]) => { const it = ITEMS[k]; if (!it || it.t !== 'S' || !v) return; S[k] = v; Object.values(pins).forEach(p => delete p[k]); });
  // demo1: the site's own product photos in every product opening (Simco-Ion is on its photos already)
  if (picks.pPics === 'site') ['films', 'woven', 'objects', 'brezo', 'aurae'].forEach(p => { (pins[p] = pins[p] || {}).mview = 'site'; });
  S.rail = 0; Object.values(pins).forEach(p => delete p.rail); // demo1: no section tracker on the left
  C.S = S; C.pins = pins;
}
function toHtml(){
  const h = document.documentElement.dataset, p = pal();
  h.pal = p.k; h.pdark = DARK.has(p.look) ? '1' : '0'; h.acc = picks.acc || 'olive';
  h.l3back = back().k;
  if (picks.pPics) h.lPPics = picks.pPics; else delete h.lPPics;
  EFFECTS.forEach(e => { const n = 'l3' + e.k[0].toUpperCase() + e.k.slice(1), v = picks[e.k] || ''; if (v) h[n] = v; else delete h[n]; });
  // 'A' options style the page directly; the product page settings are also exposed so the film page (its own layout) can follow them
  Object.values(ITEMS).forEach(it => { if (it.t === 'A' || FILMKEYS.has(it.k)){ const n = 'l' + it.k[0].toUpperCase() + it.k.slice(1), v = picks[it.k] || ''; if (v) h[n] = v; else delete h[n]; } });
}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(picks)); } catch (e){} }
toDraft(); toHtml();

/* product section order: moves the page's own sections, nothing else changes */
const FILMSECS = [['#finder', 'Models'], ['#series', 'Specs'], ['#how', 'How it works'], ['.fm-pen-sec', 'Demos'], ['section.p-sec:has(.p-grid2 .p-chips):not(#series)', 'Industries'], ['#p-faq', 'FAQ'], ['#enq', 'Enquiry']];
function applyOrder(){
  const want = ORDERS[picks.order]; if (!want) return;
  const pp = document.querySelector('#site .pp'); if (!pp) return;
  let secs;
  if (pp.querySelector(':scope > .fm-hero')){ // the film page: label its own sections once
    FILMSECS.forEach(([sel, name]) => { const el = pp.querySelector(':scope > ' + sel); if (el) el.dataset.l2sec = name; });
    secs = [...pp.children].filter(c => c.dataset.l2sec);
  } else secs = [...pp.children].filter(c => c.matches('.tsec:not(.thero)'));
  if (secs.length < 2) return;
  const name = s => s.dataset.l2sec || s.dataset.sec;
  const rank = s => { const i = want.indexOf(name(s)); return i < 0 ? 99 : i; };
  const sorted = secs.slice().sort((a, b) => rank(a) - rank(b));
  if (sorted.every((s, i) => s === secs[i])) return;
  const anchor = secs[secs.length - 1].nextSibling;
  sorted.forEach(s => pp.insertBefore(s, anchor));
}

/* ---------- the drawer ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let tab = 'col', open = false;
try { tab = sessionStorage.getItem('arshad-demo2-tab') || 'col'; open = sessionStorage.getItem('arshad-demo2-open') === '1'; } catch (e){}
if (!['col', 'bg', 'img'].includes(tab)) tab = 'col';
function cur(){ return (window.SITE && SITE.ST && SITE.ST.cur) || C.page; }
function colHTML(){
  const groups = [...new Set(PALETTES.map(p => p.g))];
  return groups.map(g => `<h4>${esc(g)}</h4><div class="l2-pals">${PALETTES.filter(p => p.g === g).map(p => `<button type="button" class="l2-pal" data-pal="${p.k}" aria-pressed="${pal().k === p.k}"><span class="sw">${p.sw.map(c => `<i style="background:${c}"></i>`).join('')}</span><b>${esc(p.name)}${p.k === 'olive' ? ' <em>draft 1</em>' : ''}</b><small>${esc(p.note)}</small></button>`).join('')}</div>`).join('')
    + `<h4>Accent (buttons and highlights)</h4><div class="l2-accs">${ACCENTS.map(a => { const own = a.k === 'olive' && ownAcc(); return `<button type="button" class="l2-acc" data-acc="${a.k}" aria-pressed="${(picks.acc || 'olive') === a.k}"><i style="background:${own || a.sw}"></i><span>${own ? 'The palette green' : esc(a.name) + (a.k === 'olive' ? ' <em>draft 1</em>' : '')}</span></button>`; }).join('')}</div>
    <p class="l2-note">Palettes change the colours only. Product photos, 3D stages and the brand logo shape stay as they are.</p>`;
}
function backHTML(){
  const groups = [...new Set(BACKS.map(b => b.g))], k = back().k;
  return `<p class="l2-note">Every section is a sheet of this surface, with a slightly darker tray behind. Solid colours and textured solids only. Swatches are drawn stronger than the page so you can tell them apart.</p>`
    + [0].map(() => `<div class="l2-backs">${BACKS.map(b => `<button type="button" class="l2-back" data-back="${b.k}" aria-pressed="${k === b.k}"><span class="l2b" data-sw="${b.k}"></span><b>${esc(b.name)}</b><small>${esc(b.note)}</small></button>`).join('')}</div>`).join('')
    + `<h4>Texture strength</h4><div class="l2-seg">${STRENGTH.map(([v, n]) => `<button type="button" data-bk="${v}" aria-pressed="${(picks.backK || '') === v}"${k !== 'plain' ? '' : ' disabled'}>${n}</button>`).join('')}</div>
    <p class="l2-note">Textures follow the colour palette: light on dark grounds, dark on light ones.</p>`;
}
function fxHTML(){
  return `<p class="l2-note">How sections meet, how things arrive and how the page feels. None of these change text or layout. Motion is switched off for visitors who ask their system to reduce motion.</p>`
    + EFFECTS.map(e => `<div class="l2-row l3-fxrow"><span>${esc(e.label)}</span><div class="l2-seg">${e.opts.map(([v, n], i) => `<button type="button" data-fk="${e.k}" data-fv="${v}" aria-pressed="${(picks[e.k] || '') === v}">${esc(n)}${i === 0 ? ' <em>lab 3</em>' : ''}</button>`).join('')}</div></div>`).join('');
}
function layHTML(){
  const c = cur();
  const here = LAYOUT.filter(g => g.pages === '*' || g.pages.includes(c)), other = LAYOUT.filter(g => !here.includes(g));
  const grp = (g, on) => `<details class="l2-grp"${on ? ' open' : ''}><summary>${esc(g.g)}${on && g.pages !== '*' ? ' <em>on this page</em>' : ''}</summary>${g.note ? `<p class="l2-note">${esc(g.note)}</p>` : ''}${g.items.map(it => `<div class="l2-row"><span>${esc(it.label)}</span><div class="l2-seg">${it.opts.map(([v, n]) => `<button type="button" data-lk="${it.k}" data-lv="${v}" aria-pressed="${(picks[it.k] || '') === v}">${esc(n)}</button>`).join('')}</div></div>`).join('')}</details>`;
  return `<p class="l2-note">Every option keeps each page's text and information exactly as in draft 1; only positions change. Options for other pages apply when you visit them.</p>${here.map(g => grp(g, true)).join('')}${other.map(g => grp(g, false)).join('')}`;
}
function summary(){
  const p = pal(), a = ACCENTS.find(x => x.k === (picks.acc || 'olive'));
  const lines = ['ARSHADELECTRONICS-DEMO1: YOUR PICKS', '', `Colours: ${p.name}${p.k === 'olive' ? ' (draft 1)' : ''} · accent ${a.k === 'olive' && ownAcc() ? 'the palette green' : a.name + (a.k === 'olive' ? ' (draft 1)' : '')}`];
  const bk = back(); lines.push(`Surface: ${bk.name}${bk.k !== 'plain' ? ' · strength ' + STRENGTH.find(x => x[0] === (picks.backK || ''))[1] : ''}`);
  lines.push('Motion and finish: ' + EFFECTS.map(e => `${e.label.toLowerCase()} ${(e.opts.find(o => o[0] === (picks[e.k] || '')) || e.opts[0])[1].split(':')[0]}`).join(' · '));
  const lay = [];
  LAYOUT.forEach(g => g.items.forEach(it => { const v = picks[it.k]; if (!v) return; const o = it.opts.find(x => x[0] === v); if (o && !lay.some(l => l.startsWith(it.label + ' '))) lay.push(`${it.label} = ${o[1]} (${g.g})`); }));
  lines.push('Layout: ' + (lay.length ? '' : 'as draft 1'));
  lay.forEach(l => lines.push('  ' + l));
  if (lay.length) lines.push('  Everything else as draft 1');
  return lines.join('\n');
}
function pickHTML(){ return `<p class="l2-note">Copy this and paste it to Claude to build the next draft from your picks.</p><textarea readonly rows="12">${esc(summary())}</textarea><div class="l2-acts"><button type="button" class="l2-btn" data-copy>Copy picks</button><button type="button" class="l2-btn ghost" data-reset>Back to the demo1 picks</button></div>`; }
function imgHTML(){
  const it = ITEMS.pPics;
  return `<p class="l2-note">The pictures in the first section of each product page. Simco-Ion keeps its own product photos either way.</p>`
    + `<div class="l2-row"><span>${esc(it.label)}</span><div class="l2-seg">${it.opts.map(([v, n]) => `<button type="button" data-lk="${it.k}" data-lv="${v}" aria-pressed="${(picks[it.k] || '') === v}">${esc(n)}</button>`).join('')}</div></div>`;
}
function drawer(){
  let d = document.getElementById('lab2');
  if (!d){ d = document.createElement('aside'); d.id = 'lab2'; d.setAttribute('translate', 'no'); d.setAttribute('aria-label', 'ArshadElectronics-demo2 options'); document.body.appendChild(d); d.addEventListener('click', onClick); }
  d.classList.toggle('open', open);
  d.innerHTML = `<button type="button" class="l2-tab" data-toggle aria-expanded="${open}">${open ? '×' : 'Options'}</button>
    <div class="l2-panel"><header><b>ArshadElectronics-demo2</b><span>Colour, surface and product images</span></header>
    <div class="l2-tabs" role="tablist">${[['col', 'Colour'], ['bg', 'Surface'], ['img', 'Product images']].map(([k, n]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${tab === k}">${n}</button>`).join('')}</div>
    <div class="l2-body">${tab === 'bg' ? backHTML() : tab === 'img' ? imgHTML() : colHTML()}</div></div>`;
}
function flash(msg){ const t = document.getElementById('ltoast'); if (t){ t.textContent = msg; t.classList.add('on'); clearTimeout(flash.t); flash.t = setTimeout(() => t.classList.remove('on'), 1800); } }
function commit(redraw){
  save(); toDraft(); toHtml();
  if (redraw && window.SITE){
    const ST = SITE.ST, y = scrollY;
    ST.S = Object.assign({}, window.SD.DEFAULTS, C.S); ST.pins = clone(C.pins);
    SITE.render();
    requestAnimationFrame(() => scrollTo(0, y));
  }
  applyOrder();
  const b = document.querySelector('#lab2 .l2-body'), top = b ? b.scrollTop : 0;
  drawer();
  const b2 = document.querySelector('#lab2 .l2-body'); if (b2) b2.scrollTop = top;
  paintTex();
}
function onClick(e){
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.toggle !== undefined){ open = !open; try { sessionStorage.setItem('arshad-demo2-open', open ? '1' : '0'); } catch (x){} drawer(); return; }
  if (t.dataset.tab){ tab = t.dataset.tab; try { sessionStorage.setItem('arshad-demo2-tab', tab); } catch (x){} drawer(); paintTex(); return; }
  if (t.dataset.pal){ picks.pal = t.dataset.pal === 'olive' ? undefined : t.dataset.pal; commit(true); return; }
  if (t.dataset.acc){ picks.acc = t.dataset.acc === 'olive' ? undefined : t.dataset.acc; commit(true); return; }
  if (t.dataset.back !== undefined){ picks.back = t.dataset.back === BACK0 ? undefined : t.dataset.back; commit(false); return; }
  if (t.dataset.bk !== undefined){ picks.backK = t.dataset.bk || undefined; commit(false); return; }
  if (t.dataset.fk){ picks[t.dataset.fk] = t.dataset.fv || undefined; commit(t.dataset.fk === 'fxPage' || t.dataset.fk === 'type'); return; }
  if (t.dataset.lk){ const it = ITEMS[t.dataset.lk]; picks[it.k] = t.dataset.lv || undefined; commit(it.t === 'S'); return; }
  if (t.dataset.copy !== undefined){ const s = summary(); (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject()).then(() => flash('Picks copied'), () => { const ta = document.querySelector('#lab2 textarea'); ta.select(); document.execCommand('copy'); flash('Picks copied'); }); return; }
  if (t.dataset.reset !== undefined){ picks = Object.assign({}, DEMO_PICKS); commit(true); flash('Back to the demo1 picks'); }
}
// keep the drawer's "on this page" groups and the section order in step with page changes
const boot = () => {
  drawer(); applyOrder(); paintTex();
  const site = document.getElementById('site'); let last = cur();
  new MutationObserver(() => { applyOrder(); paintTex(); if (cur() !== last){ last = cur(); if (tab === 'lay') drawer(); } }).observe(site, { childList: true });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
// product photos (e.g. Aurae 3 on its page): if a photo fails to load, try it once more
document.addEventListener('error', e => { const i = e.target; if (!i || !i.matches || !i.matches('#site img.mvs-p, #site img.sitepic') || i.dataset.retry) return; i.dataset.retry = '1'; setTimeout(() => { const u = i.getAttribute('src').split('?')[0]; i.src = u + '?r=' + Date.now(); }, 500); }, true);
window.LAB2 = window.LAB3 = { PALETTES, ACCENTS, BACKS, EFFECTS, LAYOUT, get picks(){ return picks; }, summary, paintTex };
})();
