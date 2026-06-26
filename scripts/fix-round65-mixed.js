const fs = require('fs');

// === ป.อ. round 42 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-251', section:'251', chapter:17, chapter_title:'ความผิดเกี่ยวกับดวงตรา', title:'ปลอมตราครั่ง/ตราผนึก — จำคุก ≤ 5 ปี', text:'ผู้ใดทำปลอมขึ้นซึ่งดวงตรา ตราครั่ง ตราผนึก → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'ปลอมตราครั่ง: ปลอมตราครั่ง/ตราผนึกราชการ→≤5ปี ≠ ปลอมดวงตราทบวงการ(ม.252=1-7ปี)', keywords:['ตราครั่ง','ตราผนึก','ปลอม'], dika:[] },
  { id:'crim-255', section:'255', chapter:17, chapter_title:'ความผิดเกี่ยวกับดวงตรา', title:'ทำลายดวงตราต่างประเทศ — จำคุก ≤ 3 ปี', text:'ผู้ใดทำให้เสียหาย ทำลาย ดวงตรา แสตมป์ของรัฐบาลต่างประเทศ → จำคุก ≤ 3 ปี + ปรับ ≤ 60,000', summary:'ทำลายดวงตราต่างประเทศ: ≤3ปี เบากว่าทำลายดวงตราไทย(ม.254=1-5ปี)', keywords:['ดวงตรา','ต่างประเทศ','ทำลาย'], dika:[] },
  { id:'crim-269-13', section:'269/13', chapter:17, chapter_title:'ความผิดเกี่ยวกับหนังสือเดินทาง', title:'ยึดหนังสือเดินทางผู้อื่น — จำคุก ≤ 3 ปี', text:'ผู้ใดยึดถือ เอาไว้ หรือทำให้เสียหาย ซึ่งหนังสือเดินทางของผู้อื่น โดยมิชอบ → จำคุก ≤ 3 ปี + ปรับ ≤ 60,000', summary:'ยึดพาสปอร์ตคนอื่น: ยึดหนังสือเดินทางไม่คืน→≤3ปี เช่น นายจ้างยึดพาสปอร์ตแรงงานต่างด้าว', keywords:['ยึดหนังสือเดินทาง','มิชอบ','แรงงาน'], dika:[] },
  { id:'crim-269-14', section:'269/14', chapter:17, chapter_title:'ความผิดเกี่ยวกับหนังสือเดินทาง', title:'ทำลายหนังสือเดินทาง — จำคุก ≤ 3 ปี', text:'ผู้ใดทำให้เสียหาย ทำลาย ซ่อนเร้น ซึ่งหนังสือเดินทางของผู้อื่น → จำคุก ≤ 3 ปี + ปรับ ≤ 60,000', summary:'ทำลายพาสปอร์ต: ทำลาย/ซ่อนหนังสือเดินทางผู้อื่น→≤3ปี', keywords:['ทำลายหนังสือเดินทาง','ซ่อนเร้น'], dika:[] },
  { id:'crim-384', section:'384', chapter:24, chapter_title:'ลหุโทษ', title:'ใช้รถยนต์/รถจักรยาน ไม่มีเครื่องหมาย — ปรับ ≤ 1,000', text:'ผู้ใดใช้รถยนต์ รถจักรยานยนต์ หรือรถจักรยาน โดยไม่จดทะเบียนหรือไม่มีเครื่องหมายตามกฎหมาย → ปรับ ≤ 1,000', summary:'รถไม่มีเครื่องหมาย: ไม่จดทะเบียน/ไม่มีป้ายทะเบียน→ปรับ≤1,000 ลหุโทษ ≠ พ.ร.บ.รถยนต์(โทษหนักกว่า)', keywords:['รถยนต์','ไม่จดทะเบียน','เครื่องหมาย','ลหุโทษ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === วิ.แพ่ง + วิ.อาญา + ป.พ.พ. ===
const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-33', section:'33', chapter:1, chapter_title:'อำนาจและหน้าที่ของศาล', title:'ศาลเลื่อนคดีได้ — เมื่อมีเหตุจำเป็น', text:'ศาลจะเลื่อนการนั่งพิจารณาคดีได้ เมื่อมีเหตุจำเป็นอันมิอาจก้าวล่วงเสียได้', summary:'เลื่อนคดี: ศาลเลื่อนได้เมื่อจำเป็น เช่น พยานป่วย/ทนายไม่มา/คู่ความไม่พร้อม ≠ เลื่อนไม่มีเหตุ', keywords:['เลื่อนคดี','เหตุจำเป็น','นั่งพิจารณา'], dika:[] },
  { id:'cvp-244', section:'244', chapter:8, chapter_title:'อุทธรณ์', title:'ศาลอุทธรณ์มีอำนาจพิพากษาใหม่ — ไม่จำกัดเฉพาะที่อุทธรณ์', text:'ศาลอุทธรณ์จะวินิจฉัยได้เฉพาะในประเด็นที่ได้อุทธรณ์เท่านั้น\nเว้นแต่เป็นปัญหาอันเกี่ยวด้วยความสงบเรียบร้อย → ศาลยกขึ้นวินิจฉัยเองได้', summary:'อำนาจศาลอุทธรณ์: วินิจฉัยเฉพาะที่อุทธรณ์ ยกเว้น ปัญหาความสงบเรียบร้อย=ศาลยกเองได้', keywords:['ศาลอุทธรณ์','ประเด็น','ความสงบเรียบร้อย'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-235-crp', section:'235', chapter:16, chapter_title:'พยานบุคคล', title:'พยานให้การไม่ตรงกัน — ศาลเรียกมาเผชิญกันได้', text:'ถ้าพยานหลายคนให้การไม่ตรงกัน → ศาลจะเรียกพยานเหล่านั้นมาเผชิญกัน (Confrontation) ก็ได้', summary:'เผชิญพยาน: พยานขัดกัน→ศาลเรียกมาเผชิญหน้ากัน ถามต่อหน้ากัน ดูว่าใครน่าเชื่อกว่า', keywords:['เผชิญพยาน','Confrontation','ไม่ตรงกัน'], dika:[] },
  { id:'crp-238', section:'238', chapter:16, chapter_title:'พยานเอกสาร', title:'พยานเอกสารในคดีอาญา — ต้องส่งสำเนาให้คู่ความก่อน', text:'ถ้าคู่ความฝ่ายใดจะอ้างเอกสาร → ต้องส่งสำเนาเอกสารให้คู่ความอีกฝ่ายทราบก่อน', summary:'ส่งสำเนาเอกสาร: อ้างเอกสาร→ส่งสำเนาให้อีกฝ่ายก่อน เพื่อให้เตรียมตัวค้าน', keywords:['สำเนาเอกสาร','ส่งก่อน','คู่ความ'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + cvpAdded + crpAdded));
