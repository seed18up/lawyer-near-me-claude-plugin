const fs = require('fs');
const path = require('path');

const lawDir = 'law';

const categoryMap = {
  'criminal': 'law/criminal/criminal.json',
  'criminal-procedure': 'law/criminal-procedure/criminal-procedure.json',
  'civil-procedure': 'law/civil-procedure/civil-procedure.json',
  'administrative': 'law/administrative/administrative.json',
  'bankruptcy': 'law/bankruptcy/bankruptcy.json',
  'cheque': 'law/cheque/cheque.json',
  'condo': 'law/condo/condo.json',
  'computer-crime': 'law/computer-crime/computer-crime.json',
  'constitution': 'law/constitution/constitution.json',
  'consumer-protection': 'law/consumer-protection/consumer-protection.json',
  'court-organization': 'law/court-organization/court-organization.json',
  'debt-collection': 'law/debt-collection/debt-collection.json',
  'intellectual-property': 'law/intellectual-property/intellectual-property.json',
  'juvenile': 'law/juvenile/juvenile.json',
  'labor-relations': 'law/labor-relations/labor-relations.json',
  'labor': 'law/labor/labor.json',
  'narcotics': 'law/narcotics/narcotics.json',
  'pdpa': 'law/pdpa/pdpa.json',
  'social-security': 'law/social-security/social-security.json',
  'tax': 'law/tax/tax.json',
  'traffic': 'law/traffic/traffic.json',
};

const ppcMap = {
  'obligations': 'law/ppc/obligations/obligations.json',
  'sales': 'law/ppc/sales/sales.json',
  'loans': 'law/ppc/loans/loans.json',
  'property': 'law/ppc/property/property.json',
  'family': 'law/ppc/family/family.json',
  'inheritance': 'law/ppc/inheritance/inheritance.json',
};

function getCount(jsonPath) {
  if (!fs.existsSync(jsonPath)) return null;
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  return data.sections ? data.sections.length : null;
}

function updateHtml(htmlPath, count) {
  if (!fs.existsSync(htmlPath)) return false;
  let html = fs.readFileSync(htmlPath, 'utf8');
  const re = /(\d+)( มาตราสำคัญ<\/span>)/;
  if (!re.test(html)) return false;
  const oldNum = parseInt(html.match(re)[1]);
  if (oldNum === count) return false;
  html = html.replace(re, count + '$2');
  fs.writeFileSync(html, htmlPath, 'utf8');
  return true;
}

let total = 0;
let changed = 0;

// 1) Update each category sub-page
for (const [cat, jsonPath] of Object.entries(categoryMap)) {
  const count = getCount(jsonPath);
  if (count === null) continue;
  total += count;
  const htmlPath = `law/${cat}/index.html`;
  if (!fs.existsSync(htmlPath)) continue;
  let html = fs.readFileSync(htmlPath, 'utf8');
  const re = /(\d+)( มาตราสำคัญ<\/span>)/;
  if (re.test(html)) {
    const oldNum = parseInt(html.match(re)[1]);
    if (oldNum !== count) {
      html = html.replace(re, count + '$2');
      fs.writeFileSync(htmlPath, html, 'utf8');
      console.log(`${cat}: ${oldNum} → ${count}`);
      changed++;
    }
  }
}

// 2) Update ppc sub-pages
let ppcTotal = 0;
for (const [cat, jsonPath] of Object.entries(ppcMap)) {
  const count = getCount(jsonPath);
  if (count === null) continue;
  ppcTotal += count;
  total += count;
  const htmlPath = `law/ppc/${cat}/index.html`;
  if (!fs.existsSync(htmlPath)) continue;
  let html = fs.readFileSync(htmlPath, 'utf8');
  const re = /(\d+)( มาตราสำคัญ<\/span>)/;
  if (re.test(html)) {
    const oldNum = parseInt(html.match(re)[1]);
    if (oldNum !== count) {
      html = html.replace(re, count + '$2');
      fs.writeFileSync(htmlPath, html, 'utf8');
      console.log(`ppc/${cat}: ${oldNum} → ${count}`);
      changed++;
    }
  }
}

// 3) Update ppc/index.html (6 บรรพ cards)
const ppcIndex = 'law/ppc/index.html';
if (fs.existsSync(ppcIndex)) {
  let html = fs.readFileSync(ppcIndex, 'utf8');
  const bookLinks = [
    { href: './obligations/', count: getCount(ppcMap['obligations']) },
    { href: './sales/', count: getCount(ppcMap['sales']) },
    { href: './loans/', count: getCount(ppcMap['loans']) },
    { href: './property/', count: getCount(ppcMap['property']) },
    { href: './family/', count: getCount(ppcMap['family']) },
    { href: './inheritance/', count: getCount(ppcMap['inheritance']) },
  ];
  for (const b of bookLinks) {
    if (b.count === null) continue;
    const re = new RegExp(`(href="${b.href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?✓ )(\\d+)( มาตราสำคัญ)`);
    if (re.test(html)) {
      const oldNum = parseInt(html.match(re)[2]);
      if (oldNum !== b.count) {
        html = html.replace(re, '$1' + b.count + '$3');
        console.log(`ppc/index(${b.href}): ${oldNum} → ${b.count}`);
        changed++;
      }
    }
  }
  fs.writeFileSync(ppcIndex, html, 'utf8');
}

// 4) Update main law/index.html
const mainIndex = 'law/index.html';
if (fs.existsSync(mainIndex)) {
  let html = fs.readFileSync(mainIndex, 'utf8');

  const mainLinks = {
    './criminal/': getCount(categoryMap['criminal']),
    './criminal-procedure/': getCount(categoryMap['criminal-procedure']),
    './ppc/': ppcTotal,
    './civil-procedure/': getCount(categoryMap['civil-procedure']),
    './labor/': getCount(categoryMap['labor']),
    './constitution/': getCount(categoryMap['constitution']),
    './tax/': getCount(categoryMap['tax']),
    './pdpa/': getCount(categoryMap['pdpa']),
    './bankruptcy/': getCount(categoryMap['bankruptcy']),
    './intellectual-property/': getCount(categoryMap['intellectual-property']),
    './administrative/': getCount(categoryMap['administrative']),
    './court-organization/': getCount(categoryMap['court-organization']),
    './juvenile/': getCount(categoryMap['juvenile']),
    './computer-crime/': getCount(categoryMap['computer-crime']),
    './consumer-protection/': getCount(categoryMap['consumer-protection']),
    './traffic/': getCount(categoryMap['traffic']),
    './narcotics/': getCount(categoryMap['narcotics']),
    './debt-collection/': getCount(categoryMap['debt-collection']),
    './social-security/': getCount(categoryMap['social-security']),
    './labor-relations/': getCount(categoryMap['labor-relations']),
    './cheque/': getCount(categoryMap['cheque']),
    './condo/': getCount(categoryMap['condo']),
  };

  for (const [href, count] of Object.entries(mainLinks)) {
    if (count === null) continue;
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(href="${escaped}"[\\s\\S]*?)(\\d+)( มาตราสำคัญ)`);
    if (re.test(html)) {
      const oldNum = parseInt(html.match(re)[2]);
      if (oldNum !== count) {
        html = html.replace(re, '$1' + count + '$3');
        console.log(`index(${href}): ${oldNum} → ${count}`);
        changed++;
      }
    }
  }
  fs.writeFileSync(mainIndex, html, 'utf8');
}

console.log(`\nDone. Changed: ${changed} | Total sections: ${total}`);
