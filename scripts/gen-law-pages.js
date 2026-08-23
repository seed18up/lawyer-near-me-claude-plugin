const fs = require('fs');
const path = require('path');

const categories = [
  { dir: 'law/criminal', json: 'criminal.json', emoji: '⚖️', cta: 'คดีอาญา/โทษ', depth: 2 },
  { dir: 'law/criminal-procedure', json: 'criminal-procedure.json', emoji: '📋', cta: 'วิ.อาญา', depth: 2 },
  { dir: 'law/administrative', json: 'administrative.json', emoji: '🏛️', cta: 'ปกครอง', depth: 2 },
  { dir: 'law/civil-procedure', json: 'civil-procedure.json', emoji: '📑', cta: 'คดีแพ่ง', depth: 2 },
  { dir: 'law/bankruptcy', json: 'bankruptcy.json', emoji: '💰', cta: 'ล้มละลาย/ฟื้นฟูกิจการ', depth: 2 },
  { dir: 'law/tax', json: 'tax.json', emoji: '🧾', cta: 'ภาษี', depth: 2 },
  { dir: 'law/intellectual-property', json: 'intellectual-property.json', emoji: '💡', cta: 'ทรัพย์สินทางปัญญา', depth: 2 },
  { dir: 'law/pdpa', json: 'pdpa.json', emoji: '🔐', cta: 'PDPA/ข้อมูลส่วนบุคคล', depth: 2 },
  { dir: 'law/constitution', json: 'constitution.json', emoji: '📜', cta: 'รัฐธรรมนูญ', depth: 2 },
  { dir: 'law/court-organization', json: 'court-organization.json', emoji: '🏛️', cta: 'ศาลยุติธรรม', depth: 2 },
  { dir: 'law/juvenile', json: 'juvenile.json', emoji: '👦', cta: 'เยาวชน/ครอบครัว', depth: 2 },
  { dir: 'law/ppc/obligations', json: 'obligations.json', emoji: '📜', cta: 'นิติกรรม/หนี้', depth: 3 },
  { dir: 'law/ppc/inheritance', json: 'inheritance.json', emoji: '📋', cta: 'มรดก/พินัยกรรม', depth: 3 },
  { dir: 'law/ppc/loans', json: 'loans.json', emoji: '💳', cta: 'กู้ยืม/ค้ำประกัน', depth: 3 },
  { dir: 'law/ppc/property', json: 'property.json', emoji: '🏠', cta: 'ทรัพย์สิน/ที่ดิน', depth: 3 },
  { dir: 'law/ppc/sales', json: 'sales.json', emoji: '🛒', cta: 'ซื้อขาย/เช่า', depth: 3 },
  { dir: 'law/computer-crime', json: 'computer-crime.json', emoji: '💻', cta: 'คอมพิวเตอร์/ออนไลน์', depth: 2 },
  { dir: 'law/consumer-protection', json: 'consumer-protection.json', emoji: '🛡️', cta: 'คุ้มครองผู้บริโภค', depth: 2 },
  { dir: 'law/traffic', json: 'traffic.json', emoji: '🚗', cta: 'จราจร/ขับรถ', depth: 2 },
  { dir: 'law/narcotics', json: 'narcotics.json', emoji: '🚫', cta: 'ยาเสพติด', depth: 2 },
  { dir: 'law/debt-collection', json: 'debt-collection.json', emoji: '📞', cta: 'ทวงถามหนี้', depth: 2 },
  { dir: 'law/social-security', json: 'social-security.json', emoji: '🏥', cta: 'ประกันสังคม', depth: 2 },
  { dir: 'law/labor', json: 'labor.json', emoji: '👷', cta: 'แรงงาน/ค่าจ้าง', depth: 2 },
  { dir: 'law/labor-relations', json: 'labor-relations.json', emoji: '✊', cta: 'แรงงานสัมพันธ์/สหภาพ', depth: 2 },
  { dir: 'law/cheque', json: 'cheque.json', emoji: '💸', cta: 'เช็ค/เช็คเด้ง', depth: 2 },
  { dir: 'law/condo', json: 'condo.json', emoji: '🏢', cta: 'คอนโด/อาคารชุด', depth: 2 },
  { dir: 'law/ppc/family', json: 'family.json', emoji: '👨‍👩‍👧', cta: 'ครอบครัว/สมรส/หย่า', depth: 3 },
  { dir: 'law/ppc/agency', json: 'agency.json', emoji: '🤝', cta: 'ตัวแทน/นายหน้า/ประกัน', depth: 3 },
  { dir: 'law/ppc/company', json: 'company.json', emoji: '🏢', cta: 'หุ้นส่วน/บริษัท', depth: 3 },
];

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function buildPage(cat, data) {
  var m = data.meta;
  var sc = data.sections.length;
  var cc = data.chapters.length;
  var root = cat.depth === 3 ? '../../../' : '../../';
  var lawHub = cat.depth === 3 ? '../../index.html' : '../index.html';
  var shortName = m.short.split(' — ')[0];
  var desc = m.short.split(' — ')[1] || m.short;

  var h = '';
  h += '<!DOCTYPE html>\n<html lang="th">\n<head>\n';
  h += '  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  h += '  <title>' + esc(shortName) + ' — สารบัญรายหมวด | ทนายใกล้ฉัน</title>\n';
  h += '  <meta name="description" content="' + esc(m.short) + ' สรุปมาตราสำคัญเข้าใจง่าย พร้อมคำอธิบาย">\n';
  h += '  <link rel="canonical" href="https://lawyernearme.in.th/' + cat.dir + '/">\n';
  h += '  <meta property="og:type" content="website">\n';
  h += '  <meta property="og:url" content="https://lawyernearme.in.th/' + cat.dir + '/">\n';
  h += '  <meta property="og:title" content="' + esc(shortName) + ' — สารบัญรายหมวด | ทนายใกล้ฉัน">\n';
  h += '  <meta property="og:description" content="' + esc(m.short) + '">\n';
  h += '  <meta property="og:locale" content="th_TH">\n  <meta property="og:site_name" content="ทนายใกล้ฉัน">\n';

  h += '  <script type="application/ld+json">\n  {\n';
  h += '    "@context": "https://schema.org", "@type": "Article",\n';
  h += '    "name": "' + m.law + '", "description": "' + m.short + '",\n';
  h += '    "url": "https://lawyernearme.in.th/' + cat.dir + '/",\n';
  h += '    "publisher": { "@type": "Organization", "name": "ทนายใกล้ฉัน", "url": "https://lawyernearme.in.th" },\n';
  h += '    "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [\n';
  h += '      {"@type":"ListItem","position":1,"name":"หน้าหลัก","item":"https://lawyernearme.in.th"},\n';
  h += '      {"@type":"ListItem","position":2,"name":"คลังกฎหมาย","item":"https://lawyernearme.in.th/law/"},\n';
  h += '      {"@type":"ListItem","position":3,"name":"' + esc(shortName) + '"}\n';
  h += '    ]}\n  }\n  </script>\n';

  // Analytics
  h += '  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",wait_for_update:2000});</script>\n';
  h += '  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f)})(window,document,"script","dataLayer","GTM-KZKBV537");</script>\n';
  h += '  <script async src="https://www.googletagmanager.com/gtag/js?id=G-FYSB53VGB0"></script>\n';
  h += '  <script>gtag("js",new Date());gtag("config","G-FYSB53VGB0");</script>\n';
  h += '  <script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("consent","revoke");fbq("init","1496615012260180");fbq("track","PageView");</script>\n';

  // Fonts & styles
  h += '  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n';
  h += '  <link href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">\n';

  h += '  <style>\n';
  h += '    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n';
  h += '    :root{--navy:#1B3A8B;--navy-dark:#112566;--navy-deeper:#0b1a48;--navy-light:#e8edf8;--navy-mid:#2a4fa8;--gold:#F9A825;--gold-light:#fff8e1;--white:#fff;--gray-bg:#f5f7fc;--gray-border:#e2e8f0;--gray-100:#f1f5f9;--gray-200:#e2e8f0;--text-main:#111827;--text-muted:#6b7280;--text-light:#9ca3af;--font:"Sarabun",sans-serif;--radius-sm:6px;--radius:10px;--radius-lg:16px;--shadow-sm:0 1px 3px rgba(0,0,0,.08);--shadow:0 4px 16px rgba(27,58,139,.10)}\n';
  h += '    html{scroll-behavior:smooth} body{font-family:var(--font);background:var(--white);color:var(--text-main);line-height:1.65;font-size:16px} a{text-decoration:none} button{cursor:pointer;font-family:var(--font)}\n';
  h += '    .navbar{position:sticky;top:0;left:0;right:0;height:64px;background:var(--white);border-bottom:1px solid var(--gray-border);display:flex;align-items:center;justify-content:space-between;padding:0 32px;z-index:100;box-shadow:0 2px 12px rgba(27,58,139,.07)}\n';
  h += '    .navbar-brand{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:800;color:var(--navy)}\n';
  h += '    .brand-icon{width:38px;height:38px;background:var(--navy);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}\n';
  h += '    .navbar-nav{display:flex;align-items:center;gap:4px}\n';
  h += '    .nav-link{font-size:14px;font-weight:600;color:var(--text-muted);padding:8px 14px;border-radius:var(--radius-sm);transition:color .15s,background .15s}\n';
  h += '    .nav-link:hover,.nav-link.active{color:var(--navy);background:var(--navy-light)}\n';
  h += '    .nav-cta{background:#B71C1C;color:var(--white);font-size:14px;font-weight:700;padding:9px 22px;border-radius:var(--radius-sm);margin-left:8px;transition:background .2s,transform .1s}\n';
  h += '    .nav-cta:hover{background:#8f1515;transform:translateY(-1px)}\n';
  h += '    .breadcrumb{background:var(--gray-100);border-bottom:1px solid var(--gray-200);padding:10px 32px}\n';
  h += '    .breadcrumb-inner{max-width:1120px;margin:0 auto;display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted)}\n';
  h += '    .breadcrumb-inner a{color:var(--text-muted);transition:color .15s} .breadcrumb-inner a:hover{color:var(--navy)} .breadcrumb-sep{color:var(--text-light)}\n';
  h += '    .page-hero{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%);padding:48px 32px;color:var(--white)}\n';
  h += '    .hero-inner{max-width:1120px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}\n';
  h += '    .hero-left{flex:1;min-width:280px} .eyebrow{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:10px}\n';
  h += '    .page-hero h1{font-size:28px;font-weight:800;margin-bottom:6px} .page-hero .subtitle{font-size:14px;color:rgba(255,255,255,.7)}\n';
  h += '    .hero-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:14px} .hero-tag{font-size:12px;font-weight:600;background:rgba(255,255,255,.15);color:rgba(255,255,255,.85);padding:4px 12px;border-radius:12px}\n';
  h += '    .hero-right{flex-shrink:0} .search-wrap{position:relative;width:340px}\n';
  h += '    .search-wrap input{width:100%;padding:13px 44px 13px 18px;border-radius:var(--radius);border:none;font-family:var(--font);font-size:14px;background:rgba(255,255,255,.18);color:var(--white);outline:none;transition:background .2s}\n';
  h += '    .search-wrap input::placeholder{color:rgba(255,255,255,.5)} .search-wrap input:focus{background:rgba(255,255,255,.26)}\n';
  h += '    .search-icon{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none}\n';
  h += '    .result-info{font-size:12px;color:rgba(255,255,255,.5);margin-top:8px;text-align:right}\n';
  h += '    .law-section{padding:40px 32px 64px;background:var(--gray-bg)} .law-inner{max-width:1120px;margin:0 auto}\n';
  h += '    .section-title{font-size:18px;font-weight:800;color:var(--navy);margin-bottom:20px}\n';
  h += '    .chapter-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}\n';
  h += '    .ch-card{background:var(--white);border:1.5px solid var(--gray-200);border-radius:var(--radius-lg);padding:20px 18px 18px;transition:box-shadow .2s,transform .2s,border-color .2s;cursor:pointer}\n';
  h += '    .ch-card:hover{box-shadow:var(--shadow);transform:translateY(-2px);border-color:var(--navy)}\n';
  h += '    .ch-num{font-size:11px;font-weight:800;letter-spacing:.5px;color:var(--navy);background:var(--navy-light);padding:3px 10px;border-radius:var(--radius-sm);display:inline-block;margin-bottom:10px}\n';
  h += '    .ch-title{font-size:14px;font-weight:700;color:var(--text-main);line-height:1.4;margin-bottom:6px}\n';
  h += '    .ch-range{font-size:12px;color:var(--text-muted);margin-bottom:10px}\n';
  h += '    .ch-badge{display:inline-block;font-size:11px;font-weight:700;padding:3px 10px;border-radius:12px;background:#e8f5e9;color:#2e7d32}\n';
  h += '    .law-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:24px}\n';
  h += '    .law-card{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:20px 22px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:10px}\n';
  h += '    .law-card.hidden{display:none}\n';
  h += '    .card-badges{display:flex;gap:6px;flex-wrap:wrap}\n';
  h += '    .section-badge{font-size:11px;font-weight:800;background:var(--navy-light);color:var(--navy);padding:4px 10px;border-radius:var(--radius-sm);white-space:nowrap}\n';
  h += '    .chapter-badge{font-size:11px;font-weight:600;background:var(--gray-100);color:var(--text-muted);padding:4px 10px;border-radius:var(--radius-sm);white-space:nowrap}\n';
  h += '    .card-title{font-size:15px;font-weight:700;color:var(--text-main);line-height:1.35}\n';
  h += '    .card-summary{font-size:14px;color:var(--text-muted);line-height:1.7;flex:1}\n';
  h += '    .card-text-toggle{font-size:12px;font-weight:600;color:var(--navy);cursor:pointer;display:inline-flex;align-items:center;gap:4px;background:none;border:none;padding:0}\n';
  h += '    .card-text-toggle:hover{text-decoration:underline}\n';
  h += '    .card-text-body{display:none;font-size:13px;color:var(--text-main);background:var(--gray-100);border-left:3px solid var(--navy-light);padding:12px 14px;border-radius:0 var(--radius-sm) var(--radius-sm) 0;margin-top:4px}\n';
  h += '    .card-text-body.open{display:block}\n';
  h += '    .law-para{text-indent:2em;margin:0 0 5px;line-height:1.85;font-size:13px} .law-para:last-child{margin-bottom:0}\n';
  h += '    .law-sub{text-indent:0;padding-left:2em;margin:6px 0 2px;line-height:1.85;font-size:13px;font-weight:500}\n';
  h += '    .law-sub-cont{text-indent:2em;padding-left:2em;margin:0 0 4px;line-height:1.85;font-size:13px}\n';
  h += '    .card-keywords{display:flex;flex-wrap:wrap;gap:6px}\n';
  h += '    .kw-tag{font-size:11px;font-weight:600;background:var(--gray-100);color:var(--text-muted);padding:2px 8px;border-radius:10px}\n';
  h += '    .card-footer{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:8px;padding-top:10px;border-top:1px solid var(--gray-200);margin-top:auto}\n';
  h += '    .card-law-name{font-size:12px;color:var(--text-muted)}\n';
  h += '    .no-result{display:none;text-align:center;padding:56px 0;color:var(--text-muted);font-size:15px}\n';
  h += '    .law-disclaimer{margin-top:32px;padding:16px 20px;background:var(--gold-light);border:1px solid rgba(249,168,37,.35);border-radius:var(--radius);font-size:13px;color:var(--text-muted);line-height:1.6}\n';
  h += '    .cta-banner{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%);border-radius:var(--radius-lg);padding:36px 40px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}\n';
  h += '    .cta-banner-text h2{font-size:22px;font-weight:800;color:var(--white);margin-bottom:6px} .cta-banner-text p{font-size:14px;color:rgba(255,255,255,.75)}\n';
  h += '    .cta-btn{background:var(--gold);color:var(--navy-deeper);font-size:15px;font-weight:800;padding:13px 28px;border-radius:var(--radius-sm);flex-shrink:0;transition:background .2s,transform .1s} .cta-btn:hover{background:#e6971a;transform:translateY(-1px)}\n';
  h += '    footer{background:var(--navy-deeper);padding:48px 32px 24px} .footer-inner{max-width:1120px;margin:0 auto}\n';
  h += '    .footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:32px;margin-bottom:32px}\n';
  h += '    .footer-brand-name{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:800;color:var(--white);margin-bottom:8px}\n';
  h += '    .footer-brand-icon{width:32px;height:32px;background:var(--navy-mid);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}\n';
  h += '    .footer-tagline{font-size:13px;color:rgba(255,255,255,.5);line-height:1.6}\n';
  h += '    .footer-col-title{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:12px}\n';
  h += '    .footer-links{display:flex;flex-direction:column;gap:8px} .footer-links a{font-size:13px;color:rgba(255,255,255,.6);transition:color .15s} .footer-links a:hover{color:var(--white)}\n';
  h += '    .footer-bottom{border-top:1px solid rgba(255,255,255,.08);padding-top:20px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}\n';
  h += '    .footer-copy{font-size:12px;color:rgba(255,255,255,.35)} .footer-disclaimer{font-size:11px;color:rgba(255,255,255,.3);max-width:500px;text-align:right;line-height:1.5}\n';
  h += '    @media(max-width:900px){.chapter-grid{grid-template-columns:repeat(2,1fr)} .hero-inner{flex-direction:column} .search-wrap{width:100%} .result-info{text-align:left}}\n';
  h += '    @media(max-width:680px){.chapter-grid{grid-template-columns:1fr} .law-grid{grid-template-columns:1fr} .page-hero h1{font-size:22px} .footer-top{grid-template-columns:1fr 1fr} .cta-banner{flex-direction:column}}\n';
  h += '  </style>\n</head>\n<body>\n';

  // Navbar
  h += '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KZKBV537" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n';
  h += '<nav class="navbar">\n';
  h += '  <a class="navbar-brand" href="' + root + 'index.html"><div class="brand-icon">⚖️</div>ทนายใกล้ฉัน</a>\n';
  h += '  <div class="navbar-nav">\n';
  h += '    <a class="nav-link" href="' + root + 'index.html">หน้าหลัก</a>\n';
  h += '    <a class="nav-link" href="' + root + 'news.html">ข่าวกฎหมาย</a>\n';
  h += '    <a class="nav-link" href="' + root + 'blog/">บทความ</a>\n';
  h += '    <a class="nav-link" href="' + root + 'dika/">คลังฎีกา</a>\n';
  h += '    <a class="nav-link active" href="' + lawHub + '">คลังกฎหมาย</a>\n';
  h += '    <a class="nav-link" href="' + root + 'consult.html">ปรึกษาทนาย</a>\n';
  h += '    <a class="nav-cta" href="' + root + 'consult.html">ค้นหาทนาย ➜</a>\n';
  h += '  </div>\n</nav>\n';

  // Breadcrumb
  h += '<div class="breadcrumb"><div class="breadcrumb-inner">\n';
  h += '  <a href="' + root + 'index.html">หน้าหลัก</a><span class="breadcrumb-sep">›</span>\n';
  h += '  <a href="' + lawHub + '">คลังกฎหมาย</a><span class="breadcrumb-sep">›</span>\n';
  h += '  <span>' + esc(shortName) + '</span>\n';
  h += '</div></div>\n';

  // Hero
  h += '<section class="page-hero"><div class="hero-inner">\n';
  h += '  <div class="hero-left">\n';
  h += '    <div class="eyebrow">' + cat.emoji + ' ' + esc(shortName) + '</div>\n';
  h += '    <h1>' + esc(m.law) + '</h1>\n';
  h += '    <p class="subtitle">' + esc(desc) + '</p>\n';
  h += '    <div class="hero-meta">\n';
  h += '      <span class="hero-tag">' + m.total_sections + ' มาตรา</span>\n';
  h += '      <span class="hero-tag">' + cc + ' หมวด</span>\n';
  h += '      <span class="hero-tag">' + sc + ' มาตราสำคัญ</span>\n';
  h += '    </div>\n  </div>\n';
  h += '  <div class="hero-right">\n';
  h += '    <div class="search-wrap"><input type="text" id="law-search" placeholder="ค้นหามาตรา..." autocomplete="off"><span class="search-icon">🔍</span></div>\n';
  h += '    <div class="result-info" id="result-info" style="display:none">พบ <span id="result-count">0</span> มาตรา</div>\n';
  h += '  </div>\n</div></section>\n';

  // Law section
  h += '<section class="law-section"><div class="law-inner">\n';
  h += '  <div id="toc-view"><div class="section-title">เลือกหมวดที่ต้องการ</div><div class="chapter-grid" id="chapter-grid"></div></div>\n';
  h += '  <div id="search-view" style="display:none"><div class="section-title" id="search-title">ผลการค้นหา</div></div>\n';
  h += '  <div class="law-grid" id="law-grid" style="display:none"></div>\n';
  h += '  <div class="no-result" id="no-result">ไม่พบมาตราที่ค้นหา ลองใช้คำอื่น</div>\n';
  h += '  <div class="law-disclaimer">⚠️ <strong>หมายเหตุ:</strong> เนื้อหานี้จัดทำเพื่อการศึกษาทั่วไป ไม่ใช่ข้อความกฎหมายฉบับเต็ม ควรตรวจสอบจากราชกิจจานุเบกษาหรือปรึกษาทนายความก่อนนำไปใช้อ้างอิงในคดีจริง</div>\n';
  h += '</div></section>\n';

  // CTA
  h += '<section style="padding:0 32px 56px;background:var(--gray-bg);"><div style="max-width:1120px;margin:0 auto;">\n';
  h += '  <div class="cta-banner"><div class="cta-banner-text">\n';
  h += '    <h2>มีปัญหาเรื่อง' + esc(cat.cta) + '? ปรึกษาทนายได้เลย</h2>\n';
  h += '    <p>ค้นหาทนายความที่เชี่ยวชาญ เปรียบเทียบโปรไฟล์ และนัดปรึกษาได้ทันที</p>\n';
  h += '  </div><a class="cta-btn" href="' + root + 'consult.html">ปรึกษาฟรี ➜</a></div>\n';
  h += '</div></section>\n';

  // Footer
  h += '<footer><div class="footer-inner"><div class="footer-top">\n';
  h += '  <div><div class="footer-brand-name"><div class="footer-brand-icon">⚖️</div>ทนายใกล้ฉัน</div>\n';
  h += '    <p style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:8px;line-height:1.5;">บริษัท พีอาร์ การบัญชีและกฎหมาย จำกัด</p>\n';
  h += '    <p class="footer-tagline">แพลตฟอร์มเชื่อมผู้ใช้กับทนายความที่ใช่<br>ในพื้นที่ใกล้บ้าน — เข้าถึงง่าย โปร่งใส น่าเชื่อถือ</p></div>\n';
  h += '  <div><div class="footer-col-title">บริการ</div><div class="footer-links">\n';
  h += '    <a href="' + root + 'index.html#practice">ค้นหาทนายความ</a><a href="' + root + 'consult.html">ปรึกษาออนไลน์</a><a href="' + root + 'for-developers.html">สำหรับทนายความ</a></div></div>\n';
  h += '  <div><div class="footer-col-title">เนื้อหา</div><div class="footer-links">\n';
  h += '    <a href="' + root + 'news.html">ข่าวกฎหมาย</a><a href="' + root + 'blog/">บทความกฎหมาย</a><a href="' + root + 'dika/">คลังฎีกา</a><a href="' + lawHub + '">คลังกฎหมาย</a></div></div>\n';
  h += '  <div><div class="footer-col-title">กฎหมาย</div><div class="footer-links">\n';
  h += '    <a href="' + root + 'privacy.html">นโยบายความเป็นส่วนตัว</a><a href="' + root + 'privacy.html#7">นโยบาย Cookies</a><a href="' + root + 'privacy.html">นโยบาย PDPA</a></div></div>\n';
  h += '</div><div class="footer-bottom">\n';
  h += '  <div class="footer-copy">© 2026 ทนายใกล้ฉัน — บริษัท พีอาร์ การบัญชีและกฎหมาย จำกัด · lawyernearme.in.th</div>\n';
  h += '  <div class="footer-disclaimer">เนื้อหาบนเว็บไซต์นี้มีวัตถุประสงค์เพื่อการศึกษาทั่วไปเท่านั้น ไม่ถือเป็นคำปรึกษาทางกฎหมาย กรุณาปรึกษาทนายความที่ได้รับใบอนุญาต</div>\n';
  h += '</div></div></footer>\n';

  // Script
  h += '<script>\n';
  h += 'var tocView=document.getElementById("toc-view"),searchView=document.getElementById("search-view"),lawGrid=document.getElementById("law-grid"),noResult=document.getElementById("no-result"),resultInfo=document.getElementById("result-info"),resultCount=document.getElementById("result-count"),searchTitle=document.getElementById("search-title");\n';
  h += 'function renderCard(s){var chLabel="หมวด "+s.chapter;var kwHtml=(s.keywords||[]).map(function(k){return\'<span class="kw-tag">\'+k+"</span>"}).join("");';
  h += 'function fmtText(raw){var inSub=false;return raw.split("\\n").map(function(ln){var t=ln.trim();if(!t)return"";if(/^\\(/.test(t)){inSub=true;return\'<p class="law-sub">\'+t+"</p>";}else if(inSub){return\'<p class="law-sub-cont">\'+t+"</p>";}else{return\'<p class="law-para">\'+t+"</p>";}}).join("");}';
  h += 'var textHtml=s.text?\'<button class="card-text-toggle" onclick="toggleText(this)">📄 ดูข้อความกฎหมาย ▾</button><div class="card-text-body">\'+fmtText(s.text)+\'</div>\':"";';
  h += 'return\'<div class="law-card" data-ch="\'+s.chapter+\'" data-search="\'+((s.section+" "+s.title+" "+s.summary+" "+(s.keywords||[]).join(" ")+" "+s.chapter_title).toLowerCase())+\'">\'+';
  h += '\'<div class="card-badges"><span class="section-badge">มาตรา \'+s.section+\'</span><span class="chapter-badge">\'+chLabel+" — "+(s.chapter_title||"")+\'</span></div>\'+';
  h += '\'<div class="card-title">\'+s.title+\'</div><div class="card-summary">\'+s.summary+"</div>"+textHtml+';
  h += '\'<div class="card-keywords">\'+kwHtml+\'</div><div class="card-footer"><span class="card-law-name">⚖️ ' + esc(shortName) + '</span></div></div>\'}\n';
  h += 'function toggleText(btn){var body=btn.nextElementSibling;var open=body.classList.toggle("open");btn.textContent=open?"📄 ซ่อนข้อความกฎหมาย ▴":"📄 ดูข้อความกฎหมาย ▾"}\n';
  h += 'function showAll(){tocView.style.display="";searchView.style.display="none";resultInfo.style.display="none";lawGrid.style.display="none";lawGrid.querySelectorAll(".law-card").forEach(function(c){c.classList.remove("hidden")});noResult.style.display="none"}\n';
  h += 'function filterByChapter(ch){lawGrid.style.display="";lawGrid.querySelectorAll(".law-card").forEach(function(card){card.classList.toggle("hidden",card.getAttribute("data-ch")!==String(ch))});tocView.style.display="none";searchView.style.display="";noResult.style.display="none";var v=lawGrid.querySelectorAll(".law-card:not(.hidden)").length;resultInfo.style.display="";resultCount.textContent=v;searchTitle.innerHTML="หมวด "+ch+\' <a href="javascript:showAll()" style="font-size:13px;color:var(--navy);margin-left:12px;">← ดูทั้งหมด</a>\'}\n';
  h += 'function doSearch(q){if(!q){showAll();return}lawGrid.style.display="";tocView.style.display="none";searchView.style.display="";resultInfo.style.display="";var cards=lawGrid.querySelectorAll(".law-card");var v=0;cards.forEach(function(card){var match=card.getAttribute("data-search").includes(q.toLowerCase());card.classList.toggle("hidden",!match);if(match)v++});resultCount.textContent=v;searchTitle.textContent="ผลการค้นหา \\""+q+"\\"";noResult.style.display=(v===0)?"block":"none"}\n';
  h += 'fetch("./' + cat.json + '").then(function(r){return r.json()}).then(function(data){var countMap={};data.sections.forEach(function(s){countMap[s.chapter]=(countMap[s.chapter]||0)+1});var grid=document.getElementById("chapter-grid");var html="";data.chapters.forEach(function(ch){var count=countMap[ch.num]||0;html+=\'<div class="ch-card" onclick="filterByChapter(\'+ch.num+\')">\'+\'<div class="ch-num">หมวด \'+ch.num+\'</div><div class="ch-title">\'+ch.title+\'</div><div class="ch-range">มาตรา \'+ch.range+\'</div><span class="ch-badge">\'+(count>0?"✓ "+count+" มาตรา":"เร็วๆ นี้")+\'</span></div>\'});grid.innerHTML=html;lawGrid.innerHTML=data.sections.map(renderCard).join("")});\n';
  h += 'document.getElementById("law-search").addEventListener("input",function(){doSearch(this.value.trim())});\n';
  h += '</script>\n</body>\n</html>';

  return h;
}

var count = 0;
for (var i = 0; i < categories.length; i++) {
  var cat = categories[i];
  var jsonPath = path.join(cat.dir, cat.json);
  if (!fs.existsSync(jsonPath)) { console.log('SKIP (no JSON):', jsonPath); continue; }
  var indexPath = path.join(cat.dir, 'index.html');
  if (fs.existsSync(indexPath)) { console.log('SKIP (exists):', indexPath); continue; }
  var data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  var html = buildPage(cat, data);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Created:', indexPath);
  count++;
}
console.log('\nTotal created:', count);
