(function () {
  'use strict';

  var KEY = 'lnm_consent_v1';

  function get() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function set(val) {
    try { localStorage.setItem(KEY, val); } catch (e) {}
  }

  function grantAll() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
      });
    }
    if (typeof fbq === 'function') fbq('consent', 'grant');
  }

  function adjustChatbot(bannerHeight) {
    var offset = bannerHeight + 28;
    var toggle = document.getElementById('cw-toggle');
    var panel  = document.getElementById('cw-panel');
    if (toggle) toggle.style.bottom = offset + 'px';
    if (panel)  panel.style.bottom  = (offset + 72) + 'px';
  }

  function showBanner() {
    var d = document.createElement('div');
    d.id = 'lnm-consent';
    d.setAttribute('style',
      'position:fixed;bottom:0;left:0;right:0;z-index:99999;' +
      'background:#1B3A8B;color:#fff;padding:16px 20px;' +
      'display:flex;align-items:center;justify-content:space-between;' +
      'gap:16px;flex-wrap:wrap;' +
      'font-family:Sarabun,sans-serif;font-size:14px;line-height:1.5;' +
      'box-shadow:0 -4px 20px rgba(0,0,0,.25);'
    );
    d.innerHTML =
      '<span style="flex:1;min-width:200px;">' +
      '🍪 เว็บไซต์นี้ใช้คุกกี้เพื่อวิเคราะห์การใช้งานและปรับปรุงบริการ ' +
      'ตาม <a href="privacy.html" style="color:#F9A825;font-weight:700;">นโยบายความเป็นส่วนตัว</a>' +
      '</span>' +
      '<div style="display:flex;gap:10px;flex-shrink:0;">' +
      '<button onclick="lnmRejectCookies()" style="padding:8px 18px;border-radius:8px;' +
        'border:1.5px solid rgba(255,255,255,.5);background:transparent;color:#fff;' +
        'font-family:Sarabun,sans-serif;font-size:14px;font-weight:600;cursor:pointer;">' +
        'ปฏิเสธ</button>' +
      '<button onclick="lnmAcceptCookies()" style="padding:8px 18px;border-radius:8px;' +
        'border:none;background:#F9A825;color:#1B3A8B;' +
        'font-family:Sarabun,sans-serif;font-size:14px;font-weight:700;cursor:pointer;">' +
        'ยอมรับทั้งหมด</button>' +
      '</div>';
    document.body.appendChild(d);
    adjustChatbot(d.offsetHeight);
  }

  window.lnmAcceptCookies = function () {
    set('granted');
    grantAll();
    var el = document.getElementById('lnm-consent');
    if (el) el.remove();
    adjustChatbot(0);
  };

  window.lnmRejectCookies = function () {
    set('denied');
    var el = document.getElementById('lnm-consent');
    if (el) el.remove();
    adjustChatbot(0);
  };

  var consent = get();
  if (consent === 'granted') {
    grantAll();
  } else if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
