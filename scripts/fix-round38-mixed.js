const fs = require('fs');

// === ป.อ. round 20 — ทะลุ 250! ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-377', section:'377', chapter:24, chapter_title:'ลหุโทษ', title:'เล่นดอกไม้เพลิงโดยไม่ระวัง — ปรับ ≤ 500', text:'ผู้ใดเล่นดอกไม้เพลิงในถนนสาธารณะ หรือในที่สาธารณสถาน โดยไม่ระมัดระวังอันสมควร → ปรับ ≤ 500', summary:'เล่นดอกไม้ไฟ: เล่นในที่สาธารณะโดยไม่ระวัง→ปรับ≤500 ลหุโทษ', keywords:['ดอกไม้เพลิง','ดอกไม้ไฟ','ลหุโทษ'], dika:[] },
  { id:'crim-382', section:'382', chapter:24, chapter_title:'ลหุโทษ', title:'แกล้งให้ผู้อื่นกลัว — ปรับ ≤ 1,000', text:'ผู้ใดทำให้ผู้อื่นเกิดความตกใจกลัวโดยขู่เข็ญหรือทำให้ตกใจ → ปรับ ≤ 1,000', summary:'แกล้งให้กลัว: ขู่/แกล้งให้ตกใจ→ปรับ≤1,000 เช่น สวมหน้ากากหลอก ยิงปืนข่มขู่', keywords:['แกล้ง','ตกใจกลัว','ขู่เข็ญ','ลหุโทษ'], dika:[] },
  { id:'crim-386', section:'386', chapter:24, chapter_title:'ลหุโทษ', title:'ไม่แจ้งเกิด/ตาย — ปรับ ≤ 200', text:'ผู้ใดมีหน้าที่แจ้งเกิด แจ้งตาย หรือแจ้งเรื่องอื่นต่อเจ้าพนักงาน ไม่ปฏิบัติตามกฎหมาย → ปรับ ≤ 200', summary:'ไม่แจ้งเกิด/ตาย: มีหน้าที่ต้องแจ้งแต่ไม่แจ้ง→ปรับ≤200 เช่น ไม่แจ้งเกิดลูกภายใน 15 วัน', keywords:['แจ้งเกิด','แจ้งตาย','ไม่แจ้ง','ลหุโทษ'], dika:[] },
  { id:'crim-388', section:'388', chapter:24, chapter_title:'ลหุโทษ', title:'ใช้ชื่อแฝง/ชื่อปลอม — ปรับ ≤ 200', text:'ผู้ใดใช้ชื่อหรือนามแฝงเพื่อให้ผู้อื่นหลงเชื่อว่าตนเป็นผู้อื่น → ปรับ ≤ 200', summary:'ใช้ชื่อปลอม: แอบอ้างชื่อคนอื่น→ปรับ≤200 ≠ ม.269(ปลอมเอกสาร=หนักกว่า)', keywords:['ชื่อปลอม','นามแฝง','แอบอ้าง','ลหุโทษ'], dika:[] },
  { id:'crim-394', section:'394', chapter:24, chapter_title:'ลหุโทษ', title:'หยิบทรัพย์หาย — ≤ 500 บาท ไม่ส่งคืน → ปรับ ≤ 1,000', text:'ผู้ใดเก็บได้ซึ่งทรัพย์สินหาย ซึ่งมีราคาเกินห้าร้อยบาท แล้วไม่ส่งคืนเจ้าของ หรือไม่ส่งแก่เจ้าพนักงาน → ปรับ ≤ 1,000', summary:'เก็บของหาย: ของ>500บาท ไม่ส่งคืน/แจ้งเจ้าหน้าที่→ปรับ≤1,000 ≠ ยักยอก(ม.352=ของที่มอบให้)', keywords:['ของหาย','เก็บได้','ไม่ส่งคืน','ลหุโทษ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === วิ.แพ่ง round 10 + วิ.อาญา round 11 ===
const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-85', section:'85', chapter:5, chapter_title:'พยานหลักฐาน', title:'คู่ความต้องกำหนดประเด็นและภาระพิสูจน์', text:'ในคดีที่โจทก์ฟ้อง → ศาลต้องกำหนดประเด็นข้อพิพาท และกำหนดภาระพิสูจน์ว่าคู่ความฝ่ายใดจะต้องนำสืบก่อน', summary:'กำหนดภาระพิสูจน์: ศาลกำหนดว่าใครต้องพิสูจน์ โจทก์ฟ้อง=โจทก์พิสูจน์ก่อน จำเลยยกข้อต่อสู้=จำเลยพิสูจน์', keywords:['ภาระพิสูจน์','ประเด็น','นำสืบก่อน'], dika:[] },
  { id:'cvp-100', section:'100', chapter:5, chapter_title:'พยานหลักฐาน', title:'พยานบอกเล่า — รับฟังได้แต่น้ำหนักน้อย', text:'พยานบอกเล่า คือ พยานที่ไม่ได้เห็น ไม่ได้ยิน ไม่ได้รู้เหตุการณ์ด้วยตนเอง แต่ได้ยินมาจากผู้อื่น → รับฟังได้ แต่ศาลจะให้น้ำหนักเพียงใดก็ได้', summary:'พยานบอกเล่า: ได้ยินมาจากคนอื่น→รับฟังได้แต่น้ำหนักน้อย ≠ พยานโดยตรง(เห็นเอง=น้ำหนักมาก)', keywords:['พยานบอกเล่า','น้ำหนัก','Hearsay'], dika:[] },
  { id:'cvp-349', section:'349', chapter:11, chapter_title:'การบังคับคดี', title:'การบังคับคดีในกรณีให้ส่งคืนทรัพย์เฉพาะสิ่ง', text:'ถ้าคำพิพากษาหรือคำสั่งบังคับให้ส่งคืนหรือส่งมอบทรัพย์เฉพาะสิ่ง → ให้เจ้าพนักงานบังคับคดียึดทรัพย์สินนั้นจากลูกหนี้แล้วส่งมอบให้เจ้าหนี้', summary:'บังคับส่งคืนทรัพย์: ศาลสั่งคืนของ→เจ้าพนักงานยึดจากลูกหนี้แล้วส่งให้เจ้าหนี้ ถ้าหาไม่เจอ→ชดใช้ราคา', keywords:['ส่งคืนทรัพย์','ทรัพย์เฉพาะสิ่ง','ยึด','ส่งมอบ'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-12', section:'12', chapter:1, chapter_title:'หลักทั่วไป', title:'คำกล่าวโทษ — บุคคลอื่นที่ไม่ใช่ผู้เสียหายแจ้งเจ้าหน้าที่', text:'คำกล่าวโทษ หมายความถึง การที่บุคคลอื่นซึ่งไม่ใช่ผู้เสียหายได้กล่าวหาต่อเจ้าหน้าที่ว่ามีบุคคลรู้ตัวหรือไม่ก็ดี ได้กระทำความผิดอย่างหนึ่งขึ้น', summary:'คำกล่าวโทษ: คนอื่น(ไม่ใช่ผู้เสียหาย)แจ้งเจ้าหน้าที่ ≠ คำร้องทุกข์(ผู้เสียหายแจ้ง+ประสงค์ลงโทษ)', keywords:['คำกล่าวโทษ','บุคคลอื่น','ไม่ใช่ผู้เสียหาย'], dika:[] },
  { id:'crp-230', section:'230', chapter:16, chapter_title:'พยานหลักฐาน', title:'พยานหลักฐานที่เกี่ยวกับจำเลย — ต้องเป็นพยานชั้นดี', text:'ห้ามมิให้ศาลพิพากษาลงโทษ ถ้าพยานหลักฐานยังมีความสงสัยว่าจำเลยกระทำผิดจริงหรือไม่ → ให้ยกประโยชน์แห่งความสงสัยให้จำเลย', summary:'พยานชั้นดี: ต้องปราศจากข้อสงสัย สงสัย=ยกประโยชน์ให้จำเลย คู่กับ ม.227(Beyond Reasonable Doubt)', keywords:['พยานชั้นดี','ปราศจากข้อสงสัย','ยกประโยชน์'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + cvpAdded + crpAdded));
