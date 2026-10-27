/* ArshadElectronics-demo2 (26 Oct 2026): puts the admin-edited content (data/site-content.js, window.D2C) into the
   site's own data before any page is drawn. Runs after the data scripts (pages-data, home-data, site-data, draft-data)
   and before the page code, so every place that shows a phone, email or address shows the admin's values.
   Also adds the Spanish and Russian words for demo2's new labels. */
(() => {
'use strict';
const C = window.D2C || {}, c = C.contact || {};
const pairs = (c.pairs || []).filter(p => p && (p.phone || p.email)).map(p => ({ label: String(p.label || ''), phone: String(p.phone || ''), email: String(p.email || '') }));
const pick = i => pairs[i] || pairs[0] || {};
if (pairs.length){
  const phones = pairs.map(p => p.phone).filter(Boolean), emails = pairs.map(p => p.email).filter(Boolean);
  if (window.SD && SD.CONTACT){
    Object.assign(SD.CONTACT, { pairs, phones, emails, mobile: pick(c.primary || 0).phone || phones[0] || '' });
    if (c.address) SD.CONTACT.addr = String(c.address);
    SD.CONTACT.map = String(c.mapUrl || '');
  }
  if (window.PD && PD.company){
    Object.assign(PD.company, { pairs, phones, email: pick(c.primary || 0).email || emails[0] || '' });
    if (c.address) PD.company.addr = String(c.address);
    PD.company.map = String(c.mapUrl || '');
    // the Simco-Ion page shows one contact (the first one unless the admin picks another)
    PD.company.simco = pick(c.simco || 0);
  }
}
// Plasmaright replaces Anvertech in the affiliations, with the same wording in every language
const ADD = {
  es: { 'Sales': 'Ventas', 'Service': 'Servicio', 'Open in Google Maps': 'Abrir en Google Maps', 'Announcements': 'Anuncios', 'Close': 'Cerrar',
    'No announcements right now.': 'No hay anuncios por ahora.', 'New announcement': 'Nuevo anuncio', 'Read more': 'Leer más',
    'What customers say on Google': 'Lo que dicen los clientes en Google', 'Google reviews': 'Reseñas de Google', 'Read all reviews on Google': 'Leer todas las reseñas en Google',
    'Corona treaters': 'Tratadores corona', 'Cap sealers': 'Selladoras de tapas', 'Watch the video': 'Ver el vídeo', 'Product video': 'Vídeo del producto',
    'Plasmaright (opens their website)': 'Plasmaright (abre su sitio web)', 'Staff login': 'Acceso del personal', '{0} reviews': '{0} reseñas', '{0} reviews on Google': '{0} reseñas en Google', 'Previous review': 'Reseña anterior', 'Next review': 'Reseña siguiente' },
  ru: { 'Sales': 'Продажи', 'Service': 'Сервис', 'Open in Google Maps': 'Открыть в Google Картах', 'Announcements': 'Объявления', 'Close': 'Закрыть',
    'No announcements right now.': 'Сейчас объявлений нет.', 'New announcement': 'Новое объявление', 'Read more': 'Подробнее',
    'What customers say on Google': 'Что говорят клиенты в Google', 'Google reviews': 'Отзывы в Google', 'Read all reviews on Google': 'Все отзывы в Google',
    'Corona treaters': 'Установки коронной обработки', 'Cap sealers': 'Индукционные запайщики', 'Watch the video': 'Смотреть видео', 'Product video': 'Видео о продукте',
    'Plasmaright (opens their website)': 'Plasmaright (откроется их сайт)', 'Staff login': 'Вход для сотрудников', '{0} reviews': '{0} отзывов', '{0} reviews on Google': '{0} отзывов в Google', 'Previous review': 'Предыдущий отзыв', 'Next review': 'Следующий отзыв' }
};
if (window.I18N_ES) Object.keys(ADD.es).forEach(k => { if (!(k in I18N_ES)) I18N_ES[k] = ADD.es[k]; });
if (window.I18N_RU) Object.keys(ADD.ru).forEach(k => { if (!(k in I18N_RU)) I18N_RU[k] = ADD.ru[k]; });
})();
