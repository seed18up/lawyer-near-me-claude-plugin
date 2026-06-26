const fs = require('fs');

// === ป.อ. round 44 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-44', section:'44', chapter:3, chapter_title:'วิธีการเพื่อความปลอดภัย', title:'คุมตัวในสถานพยาบาล — ผู้ติดยาเสพติด/จิตบกพร่อง', text:'ถ้าศาลเห็นว่าผู้กระทำผิดเป็นผู้ติดยาเสพติด หรือเป็นผู้มีจิตบกพร่อง → ศาลจะสั่งคุมตัวในสถานพยาบาลเพื่อบำบัดรักษาก็ได้', summary:'คุมตัวบำบัด: ผู้ติดยา/จิตบกพร่อง→ศาลสั่งบำบัดแทนจำคุก ≤เท่ากำหนดโทษ คู่กับ ม.43', keywords:['คุมตัว','บำบัด','ยาเสพติด','จิตบกพร่อง'], dika:[] },
  { id:'crim-46', section:'46', chapter:3, chapter_title:'วิธีการเพื่อความปลอดภัย', title:'ห้ามประกอบอาชีพ — ศาลสั่งเฉพาะอาชีพที่เกี่ยวกับความผิด', text:'ในการสั่งห้ามประกอบอาชีพ → ศาลจะสั่งห้ามเฉพาะอาชีพที่เกี่ยวข้องกับความผิดที่ได้กระทำ\nห้ามได้ไม่เกิน 5 ปีนับแต่พ้นโทษ', summary:'ห้ามอาชีพเฉพาะ: ห้ามเฉพาะอาชีพที่เกี่ยวกับความผิด ≤5ปี เช่น แพทย์ทำผิดจรรยาบรรณ→ห้ามรักษา', keywords:['ห้ามอาชีพ','เฉพาะ','5 ปี','พ้นโทษ'], dika:[] },
  { id:'crim-47', section:'47', chapter:3, chapter_title:'วิธีการเพื่อความปลอดภัย', title:'วิธีการเพื่อความปลอดภัย — ไม่ถือเป็นโทษ', text:'วิธีการเพื่อความปลอดภัยนั้น มิใช่โทษ\nให้ศาลสั่งได้แม้ผู้กระทำผิดจะไม่ต้องรับโทษ', summary:'ไม่ใช่โทษ: กักกัน/ห้ามเขต/ทัณฑ์บน/คุมตัว/ห้ามอาชีพ ≠ โทษ(จำคุก/ปรับ) สั่งได้แม้ไม่ต้องรับโทษ', keywords:['ไม่ใช่โทษ','วิธีการเพื่อความปลอดภัย','ศาลสั่งได้'], dika:[] },
  { id:'crim-48', section:'48', chapter:3, chapter_title:'วิธีการเพื่อความปลอดภัย', title:'วิธีการเพื่อความปลอดภัย — ใช้กฎหมายขณะศาลสั่ง', text:'วิธีการเพื่อความปลอดภัย → ให้ใช้ตามกฎหมายที่ใช้อยู่ในขณะที่ศาลมีคำสั่ง ไม่ใช่กฎหมายขณะกระทำผิด', summary:'ใช้กฎหมายขณะสั่ง: ≠ โทษ(ใช้กฎหมายขณะกระทำผิด ม.2) วิธีการฯ ใช้กฎหมายใหม่ได้เสมอ', keywords:['กฎหมายขณะสั่ง','วิธีการเพื่อความปลอดภัย'], dika:[] },
  { id:'crim-49', section:'49', chapter:3, chapter_title:'วิธีการเพื่อความปลอดภัย', title:'วิธีการเพื่อความปลอดภัย — ศาลเพิกถอนได้ทุกเมื่อ', text:'ศาลจะเพิกถอนคำสั่งเกี่ยวกับวิธีการเพื่อความปลอดภัยเมื่อใดก็ได้ ถ้าเห็นว่าไม่จำเป็นแล้ว', summary:'เพิกถอนได้: ศาลเพิกถอนวิธีการฯ ได้ทุกเมื่อ ถ้าไม่จำเป็นแล้ว เช่น ผู้ป่วยหายดีแล้ว→ปล่อย', keywords:['เพิกถอน','วิธีการเพื่อความปลอดภัย','ไม่จำเป็น'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === ป.พ.พ. + วิ.อาญา ===
const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-193-6-ob', section:'193/6', chapter:5, chapter_title:'ระยะเวลา', title:'ต้นปี — 1 มกราคม (คู่กับ ม.193/5 ต้นสัปดาห์=จันทร์)', text:'ถ้ากำหนดระยะเวลาเป็นปี → ให้วันที่หนึ่งมกราคมเป็นวันต้นปี', summary:'ต้นปี=1ม.ค.: ใช้นับอายุความเป็นปี คู่กับ ม.193/5(จันทร์) ม.193/7(วันที่1)', keywords:['ต้นปี','1 มกราคม','นับปี'], dika:[] },
  { id:'ppc-299', section:'299', chapter:8, chapter_title:'หนี้ — ลูกหนี้ร่วม', title:'ลูกหนี้ร่วมคนหนึ่งรับสภาพหนี้ — ไม่กระทบคนอื่น', text:'การที่ลูกหนี้ร่วมคนหนึ่งได้รับสภาพหนี้ → ไม่เป็นผลเสียแก่ลูกหนี้ร่วมคนอื่น', summary:'รับสภาพหนี้คนเดียว: คนหนึ่งรับสภาพ→คนอื่นไม่กระทบ อายุความคนอื่นไม่สะดุด', keywords:['รับสภาพหนี้','ลูกหนี้ร่วม','ไม่กระทบ'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-242-crp', section:'242', chapter:16, chapter_title:'พยานวัตถุ', title:'พยานวัตถุ — ศาลตรวจดูวัตถุพยานด้วยตนเอง', text:'เมื่อคู่ความอ้างพยานวัตถุ → ศาลต้องตรวจดูวัตถุพยานนั้น\nศาลจะไปตรวจดู ณ ที่ที่วัตถุนั้นอยู่ก็ได้', summary:'ศาลตรวจพยานวัตถุ: ศาลต้องดูของจริง ไปดูที่สถานที่จริงได้ เช่น ไปดูอาวุธ/ที่เกิดเหตุ', keywords:['พยานวัตถุ','ตรวจดู','สถานที่จริง'], dika:[] },
  { id:'crp-244-1', section:'244/1', chapter:16, chapter_title:'ผู้เชี่ยวชาญ', title:'ผู้เชี่ยวชาญ — ศาลแต่งตั้งหรือคู่ความอ้าง', text:'ศาลอาจแต่งตั้งผู้เชี่ยวชาญเพื่อให้ความเห็นในปัญหาที่ต้องอาศัยความรู้เฉพาะด้าน\nผู้เชี่ยวชาญอาจถูกซักถามค้านได้เช่นเดียวกับพยานบุคคล', summary:'ผู้เชี่ยวชาญ: ศาลแต่งตั้ง/คู่ความอ้าง ถูกถามค้านได้ เช่น แพทย์นิติเวช/IT forensics/นักบัญชี', keywords:['ผู้เชี่ยวชาญ','ศาลแต่งตั้ง','ถามค้าน'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + crpAdded));
