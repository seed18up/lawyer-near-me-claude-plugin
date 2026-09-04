/**
 * gen-search-index.js — สร้าง law/search-index.json สำหรับ global search ข้ามทุกกฎหมาย
 */
const fs = require('fs');
const path = require('path');

const categories = [
  { dir: 'law/criminal', json: 'criminal.json', short: 'ป.อาญา' },
  { dir: 'law/criminal-procedure', json: 'criminal-procedure.json', short: 'ป.วิ.อาญา' },
  { dir: 'law/administrative', json: 'administrative.json', short: 'ป.ปกครอง' },
  { dir: 'law/civil-procedure', json: 'civil-procedure.json', short: 'ป.วิ.แพ่ง' },
  { dir: 'law/bankruptcy', json: 'bankruptcy.json', short: 'ล้มละลาย' },
  { dir: 'law/tax', json: 'tax.json', short: 'รัษฎากร' },
  { dir: 'law/pdpa', json: 'pdpa.json', short: 'PDPA' },
  { dir: 'law/constitution', json: 'constitution.json', short: 'รัฐธรรมนูญ' },
  { dir: 'law/court-organization', json: 'court-organization.json', short: 'ศาลยุติธรรม' },
  { dir: 'law/juvenile', json: 'juvenile.json', short: 'เยาวชน' },
  { dir: 'law/ppc/obligations', json: 'obligations.json', short: 'ป.พ.พ. นิติกรรม' },
  { dir: 'law/ppc/inheritance', json: 'inheritance.json', short: 'ป.พ.พ. มรดก' },
  { dir: 'law/ppc/loans', json: 'loans.json', short: 'ป.พ.พ. กู้ยืม' },
  { dir: 'law/ppc/property', json: 'property.json', short: 'ป.พ.พ. ทรัพย์สิน' },
  { dir: 'law/ppc/sales', json: 'sales.json', short: 'ป.พ.พ. ซื้อขาย' },
  { dir: 'law/computer-crime', json: 'computer-crime.json', short: 'คอมพิวเตอร์' },
  { dir: 'law/consumer-protection', json: 'consumer-protection.json', short: 'คุ้มครองผู้บริโภค' },
  { dir: 'law/traffic', json: 'traffic.json', short: 'จราจร' },
  { dir: 'law/narcotics', json: 'narcotics.json', short: 'ยาเสพติด' },
  { dir: 'law/debt-collection', json: 'debt-collection.json', short: 'ทวงหนี้' },
  { dir: 'law/social-security', json: 'social-security.json', short: 'ประกันสังคม' },
  { dir: 'law/labor', json: 'labor.json', short: 'แรงงาน' },
  { dir: 'law/labor-relations', json: 'labor-relations.json', short: 'แรงงานสัมพันธ์' },
  { dir: 'law/workmen-compensation', json: 'workmen-compensation.json', short: 'เงินทดแทน' },
  { dir: 'law/labor-court', json: 'labor-court.json', short: 'ศาลแรงงาน' },
  { dir: 'law/tort-liability', json: 'tort-liability.json', short: 'ละเมิดเจ้าหน้าที่' },
  { dir: 'law/jurisdictional-disputes', json: 'jurisdictional-disputes.json', short: 'ชี้ขาดอำนาจศาล' },
  { dir: 'law/magistrate-court', json: 'magistrate-court.json', short: 'ศาลแขวง' },
  { dir: 'law/prosecutor', json: 'prosecutor.json', short: 'อัยการ' },
  { dir: 'law/administrative-court', json: 'administrative-court.json', short: 'ศาลปกครอง' },
  { dir: 'law/copyright', json: 'copyright.json', short: 'ลิขสิทธิ์' },
  { dir: 'law/patent', json: 'patent.json', short: 'สิทธิบัตร' },
  { dir: 'law/trademark', json: 'trademark.json', short: 'เครื่องหมายการค้า' },
  { dir: 'law/trade-secrets', json: 'trade-secrets.json', short: 'ความลับทางการค้า' },
  { dir: 'law/bankruptcy-court', json: 'bankruptcy-court.json', short: 'ศาลล้มละลาย' },
  { dir: 'law/maritime-transport', json: 'maritime-transport.json', short: 'รับขนทางทะเล' },
  { dir: 'law/ip-court', json: 'ip-court.json', short: 'ศาลทรัพย์สินทางปัญญา' },
  { dir: 'law/constitutional-court-procedure', json: 'constitutional-court-procedure.json', short: 'วิ.รัฐธรรมนูญ' },
  { dir: 'law/specialized-appeal-court', json: 'specialized-appeal-court.json', short: 'ศาลอุทธรณ์ชำนัญ' },
  { dir: 'law/cheque', json: 'cheque.json', short: 'เช็ค' },
  { dir: 'law/condo', json: 'condo.json', short: 'อาคารชุด' },
  { dir: 'law/ppc/family', json: 'family.json', short: 'ป.พ.พ. ครอบครัว' },
  { dir: 'law/ppc/agency', json: 'agency.json', short: 'ป.พ.พ. ตัวแทน' },
  { dir: 'law/ppc/company', json: 'company.json', short: 'ป.พ.พ. บริษัท' },
  { dir: 'law/land', json: 'land.json', short: 'ที่ดิน' },
];

const entries = [];

for (const cat of categories) {
  const jsonPath = path.join(cat.dir, cat.json);
  if (!fs.existsSync(jsonPath)) continue;
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const url = '/' + cat.dir + '/';

  for (const s of data.sections || []) {
    entries.push({
      law: cat.short,
      url: url,
      section: s.section,
      title: s.title || '',
      summary: s.summary || '',
      keywords: (s.keywords || []).join(' '),
      chapter: s.chapter_title || '',
      dika: (s.dika || []).slice(0, 2),
    });
  }
}

fs.writeFileSync('law/search-index.json', JSON.stringify(entries), 'utf8');
console.log('search-index.json: ' + entries.length + ' entries from ' + categories.length + ' laws');
