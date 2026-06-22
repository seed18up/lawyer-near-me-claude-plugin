const fs = require('fs');

// === ป.อ. round 19 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-246-1', section:'246/1', chapter:17, chapter_title:'ความผิดเกี่ยวกับเงินตรา', title:'ทำเครื่องมือปลอมเงิน — มีเครื่องพิมพ์/แม่พิมพ์ → จำคุก 5-15 ปี', text:'ผู้ใดทำ มีไว้ นำเข้ามา ซึ่งเครื่องมือหรือวัตถุสำหรับปลอมหรือแปลงเงินตรา → จำคุก 5-15 ปี + ปรับ 100,000-300,000', summary:'เครื่องมือปลอมเงิน: ทำ/มีไว้เครื่องพิมพ์แบงก์ปลอม→5-15ปี แม้ยังไม่ได้ปลอมจริง', keywords:['เครื่องมือปลอมเงิน','แม่พิมพ์','เครื่องพิมพ์'], dika:[] },
  { id:'crim-285', section:'285', chapter:19, chapter_title:'ความผิดเกี่ยวกับเพศ', title:'เจ้าของสถานค้าประเวณี — จำคุก 3-15 ปี', text:'ผู้ใดเป็นเจ้าของ ผู้จัดการ หรือผู้ดูแลสถานที่เพื่อการค้าประเวณี → จำคุก 3-15 ปี + ปรับ 60,000-300,000', summary:'เจ้าของซ่อง: เป็นเจ้าของ/ผู้จัดการสถานค้าประเวณี→3-15ปี ≠ ม.282(จัดหา=1-10ปี)', keywords:['เจ้าของซ่อง','ค้าประเวณี','สถานที่'], dika:[] },
  { id:'crim-365', section:'365', chapter:23, chapter_title:'ความผิดฐานบุกรุก', title:'บุกรุกโดยใช้กำลัง/ข่มขู่/ร่วมกัน — จำคุก ≤ 5 ปี', text:'ถ้าความผิดตามมาตรา 362 363 หรือ 364 ได้กระทำ:\n(1) โดยใช้กำลังประทุษร้ายหรือขู่เข็ญ\n(2) โดยร่วมกัน 2 คนขึ้นไป\n(3) ในเวลากลางคืน\n(4) โดยมีอาวุธ\n→ จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'บุกรุกฉกรรจ์: ใช้กำลัง/ร่วมกัน/กลางคืน/มีอาวุธ→≤5ปี หนักกว่าบุกรุกธรรมดา(ม.362=≤1ปี)', keywords:['บุกรุกฉกรรจ์','ใช้กำลัง','กลางคืน','อาวุธ'], dika:[] },
  { id:'crim-374', section:'374', chapter:24, chapter_title:'ลหุโทษ', title:'ทิ้งซากสัตว์/สิ่งปฏิกูลในที่สาธารณะ — ปรับ ≤ 5,000', text:'ผู้ใดทิ้ง ซากสัตว์ สิ่งหมักหมม สิ่งโสโครก ในถนนสาธารณะ → ปรับ ≤ 5,000', summary:'ทิ้งขยะสาธารณะ: ทิ้งซากสัตว์/สิ่งปฏิกูลในที่สาธารณะ→ปรับ≤5,000 เป็นลหุโทษ', keywords:['ทิ้งขยะ','สิ่งปฏิกูล','ที่สาธารณะ','ลหุโทษ'], dika:[] },
  { id:'crim-376', section:'376', chapter:24, chapter_title:'ลหุโทษ', title:'ปล่อยสัตว์ดุร้ายในที่สาธารณะ — ปรับ ≤ 1,000', text:'ผู้ใดปล่อยสัตว์ดุร้ายหรือสัตว์ที่อาจเป็นอันตรายไปในทางสาธารณะ โดยไม่ระวัง → ปรับ ≤ 1,000\nถ้าเป็นสุนัขดุ → ปรับ ≤ 1,000', summary:'ปล่อยสัตว์ดุ: ปล่อยหมาดุ/สัตว์อันตรายในที่สาธารณะ→ปรับ≤1,000 ทำร้ายคน→รับผิดละเมิดด้วย', keywords:['สัตว์ดุร้าย','ปล่อย','ที่สาธารณะ','หมาดุ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === ป.พ.พ. obligations round 12 + วิ.อาญา round 10 ===
const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-130', section:'130', chapter:2, chapter_title:'นิติบุคคล — มูลนิธิ', title:'มูลนิธิเลิก 5 กรณี — ตามข้อบังคับ/สิ้นกำหนด/สำเร็จ/ล้มละลาย/ศาลสั่ง', text:'มูลนิธิย่อมเลิกด้วยเหตุ:\n(1) เมื่อมีเหตุตามที่กำหนดในข้อบังคับ\n(2) ตั้งเฉพาะระยะเวลา เมื่อสิ้นระยะเวลา\n(3) วัตถุประสงค์สำเร็จหรือพ้นวิสัย\n(4) ล้มละลาย\n(5) ศาลสั่งให้เลิก', summary:'มูลนิธิเลิก: ตามข้อบังคับ/สิ้นกำหนด/สำเร็จ/ล้มละลาย/ศาลสั่ง ทรัพย์สินที่เหลือ→โอนให้มูลนิธิอื่น/แผ่นดิน', keywords:['มูลนิธิเลิก','ข้อบังคับ','ล้มละลาย','ศาลสั่ง'], dika:[] },
  { id:'ppc-193-7', section:'193/7', chapter:5, chapter_title:'ระยะเวลา', title:'วันเริ่มต้นเดือน — วันที่ 1 ของเดือน', text:'ถ้ากำหนดระยะเวลาเป็นเดือน → ให้วันที่หนึ่งเป็นวันต้นเดือน', summary:'ต้นเดือน: วันที่ 1 ใช้ในกรณีนับระยะเวลาเป็นเดือน คู่กับ ม.193/5(ต้นสัปดาห์=จันทร์) ม.193/6(ต้นปี=1ม.ค.)', keywords:['ต้นเดือน','วันที่ 1','เดือน'], dika:[] },
  { id:'ppc-247', section:'247', chapter:7, chapter_title:'หนี้ — สิทธิยึดหน่วง', title:'สิทธิยึดหน่วง — ไม่ตัดสิทธิเรียกค่าเสียหาย', text:'การที่เจ้าหนี้ใช้สิทธิยึดหน่วงนั้น ไม่ตัดสิทธิเรียกค่าสินไหมทดแทน', summary:'ยึดหน่วง+เรียกค่าเสียหาย: ยึดหน่วงไว้แล้ว ยังเรียกค่าเสียหายได้ด้วย ทั้งสองอย่างพร้อมกัน', keywords:['ยึดหน่วง','ค่าเสียหาย','ไม่ตัดสิทธิ'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-41', section:'41', chapter:4, chapter_title:'คดีแพ่งเกี่ยวเนื่อง', title:'ผู้เสียหายฟ้องแพ่งในคดีอาญา — ไม่ต้องเสียค่าธรรมเนียม', text:'ในคดีที่ผู้เสียหายยื่นคำร้องขอเข้าร่วมเป็นโจทก์กับพนักงานอัยการ → ผู้เสียหายไม่ต้องเสียค่าธรรมเนียมในส่วนแพ่ง', summary:'ฟ้องแพ่งในคดีอาญา: ไม่ต้องเสียค่าธรรมเนียม ประหยัด ≠ ฟ้องแพ่งแยกต่างหาก(ต้องเสียค่าขึ้นศาล)', keywords:['ไม่เสียค่าธรรมเนียม','แพ่งในอาญา','ผู้เสียหาย'], dika:[] },
  { id:'crp-58', section:'58', chapter:5, chapter_title:'หมายเรียกและหมายอาญา', title:'หมายอาญา — ต้องมีเหตุตามกฎหมาย ศาลออก', text:'หมายอาญามี 4 ชนิด:\n(1) หมายจับ (ม.66-68)\n(2) หมายค้น (ม.69-70)\n(3) หมายขัง (ม.71-76)\n(4) หมายจำคุก หมายปล่อย', summary:'หมายอาญา 4 ชนิด: จับ/ค้น/ขัง/จำคุก-ปล่อย ศาลออกเท่านั้น(ยกเว้นจับซึ่งหน้า) ≠ หมายเรียก(ม.52-56)', keywords:['หมายอาญา','หมายจับ','หมายค้น','หมายขัง'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + crpAdded));
