const fs = require('fs');

// === ป.อ. round 25 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-135-2', section:'135/2', chapter:11, chapter_title:'ความผิดเกี่ยวกับการก่อการร้าย', title:'สนับสนุนการก่อการร้าย — จัดหาเงิน/อาวุธ → จำคุก 2-10 ปี', text:'ผู้ใดให้ จัดหา รวบรวม หรือรับเงิน ทรัพย์สิน อาวุธ หรือวัตถุอื่นใด เพื่อสนับสนุนการก่อการร้าย → จำคุก 2-10 ปี + ปรับ 40,000-200,000', summary:'สนับสนุนก่อการร้าย: จัดหาเงิน/อาวุธให้→2-10ปี ≠ ก่อการร้ายจริง(ม.135/1=ประหาร/3-20ปี)', keywords:['สนับสนุนก่อการร้าย','เงิน','อาวุธ'], dika:[] },
  { id:'crim-207', section:'207', chapter:14, chapter_title:'ความผิดเกี่ยวกับศาสนา', title:'ก่อความวุ่นวายในพิธีกรรมทางศาสนา — จำคุก 1-7 ปี', text:'ผู้ใดก่อให้เกิดความวุ่นวายขึ้นในที่ประชุมศาสนิกชนที่ประชุมกันเพื่อกระทำพิธีกรรมทางศาสนา → จำคุก 1-7 ปี + ปรับ 20,000-140,000', summary:'วุ่นวายพิธีกรรม: ก่อกวนในพิธีศาสนา→1-7ปี เช่น บุกรุกวัด/โบสถ์ขณะทำพิธี', keywords:['พิธีกรรม','ศาสนา','วุ่นวาย'], dika:[] },
  { id:'crim-211', section:'211', chapter:15, chapter_title:'ความผิดเกี่ยวกับความสงบสุข', title:'สมคบเพื่อกระทำผิดร้ายแรง — ≥ 2 คน จำคุก ≤ 5 ปี', text:'ผู้ใดสมคบกันตั้งแต่สองคนขึ้นไปเพื่อกระทำความผิดที่มีโทษจำคุกอย่างสูงตั้งแต่หนึ่งปีขึ้นไป → ถ้าบุคคลหนึ่งบุคคลใดได้ลงมือกระทำ → จำคุก ≤ 5 ปี', summary:'สมคบ: ≥2คน ตกลงกระทำผิด+ลงมือ→≤5ปี ≠ อั้งยี่(ม.209=องค์กรลับ) ≠ ซ่องโจร(ม.210=≥5คน)', keywords:['สมคบ','2 คน','ลงมือ'], dika:[] },
  { id:'crim-238', section:'238', chapter:16, chapter_title:'ความผิดเกี่ยวกับการก่อภยันตราย', title:'ทำให้เกิดมลพิษ — ปล่อยสารพิษลงน้ำ/อากาศ → จำคุก ≤ 10 ปี', text:'ผู้ใดกระทำด้วยประการใดๆ ให้เกิดมลพิษในอากาศ น้ำ ดิน จนเป็นเหตุให้เกิดอันตรายแก่สุขภาพของประชาชน → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000\nถ้ากระทำในเชิงอุตสาหกรรม → จำคุก 1-10 ปี', summary:'ก่อมลพิษ: ปล่อยสารพิษลงน้ำ/อากาศ/ดิน→≤5ปี อุตสาหกรรม=1-10ปี บาดเจ็บ=≤10ปี ตาย=≤20ปี', keywords:['มลพิษ','สารพิษ','น้ำ','อากาศ','อุตสาหกรรม'], dika:[] },
  { id:'crim-397', section:'397', chapter:24, chapter_title:'ลหุโทษ', title:'ทำอนาจารในที่สาธารณะ — ปรับ ≤ 5,000', text:'ผู้ใดกระทำการอันควรขายหน้าต่อหน้าประชาชน โดยเปลือยหรือเปิดเผยร่างกาย → ปรับ ≤ 5,000', summary:'อนาจารสาธารณะ: เปลือย/เปิดเผยร่างกายต่อหน้าประชาชน→ปรับ≤5,000 ลหุโทษ', keywords:['อนาจาร','สาธารณะ','เปลือย','ลหุโทษ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === วิ.แพ่ง round 12 + วิ.อาญา round 12 ===
const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-4jat', section:'4 จัตวา', chapter:1, chapter_title:'เขตอำนาจศาล', title:'ระยะเวลาที่ศาลขยาย/ย่น — ศาลมีอำนาจขยายหรือย่นได้', text:'ระยะเวลาตามที่กำหนดไว้ในประมวลกฎหมายนี้ หรือตามที่ศาลกำหนด → ศาลอาจขยายหรือย่นได้ตามความจำเป็น เมื่อมีพฤติการณ์พิเศษ', summary:'ศาลขยาย/ย่นเวลา: มีเหตุพิเศษ→ศาลขยายระยะเวลาได้ เช่น น้ำท่วม/เจ็บป่วยหนัก ต้องร้องขอก่อนครบกำหนด', keywords:['ขยายเวลา','ย่นเวลา','พฤติการณ์พิเศษ'], dika:[] },
  { id:'cvp-74', section:'74', chapter:4, chapter_title:'การยื่นและส่งคำคู่ความ', title:'ส่งหมายเรียกและสำเนาคำฟ้อง — ส่งให้จำเลยโดยตรง', text:'ในการส่งหมายเรียกและสำเนาคำฟ้องให้แก่จำเลย → เจ้าพนักงานศาลต้องส่งให้แก่จำเลยโดยตรง ณ ภูมิลำเนาหรือสำนักทำการงานของจำเลย', summary:'ส่งหมายเรียก: ส่งให้จำเลยโดยตรงที่บ้าน/ที่ทำงาน ไม่อยู่→ส่งให้คนในบ้าน ≥20ปี หาไม่ได้→ปิดหมาย(ม.78)', keywords:['ส่งหมาย','จำเลย','ภูมิลำเนา','สำนักทำการงาน'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-32', section:'32', chapter:4, chapter_title:'การฟ้องคดีอาญา', title:'ผู้เสียหายขอเข้าร่วมเป็นโจทก์กับอัยการ', text:'ในคดีที่พนักงานอัยการเป็นโจทก์ → ผู้เสียหายจะยื่นคำร้องขอเข้าร่วมเป็นโจทก์ก่อนศาลชั้นต้นพิพากษาก็ได้', summary:'ร่วมเป็นโจทก์: ผู้เสียหายขอเข้าร่วมกับอัยการได้ก่อนพิพากษา มีสิทธิถามค้าน/นำพยาน/อุทธรณ์', keywords:['ร่วมเป็นโจทก์','ผู้เสียหาย','อัยการ'], dika:[] },
  { id:'crp-76', section:'76', chapter:5, chapter_title:'หมายอาญา', title:'หมายจำคุก/หมายปล่อย — ศาลออกเมื่อพิพากษาลงโทษ/ยกฟ้อง', text:'เมื่อศาลพิพากษาลงโทษจำคุก → ศาลออกหมายจำคุก\nเมื่อศาลพิพากษายกฟ้อง หรือจำเลยพ้นโทษ → ศาลออกหมายปล่อย', summary:'หมายจำคุก/ปล่อย: ลงโทษ→หมายจำคุก ยกฟ้อง/พ้นโทษ→หมายปล่อย ทั้งสองเป็นหมายอาญา', keywords:['หมายจำคุก','หมายปล่อย','ยกฟ้อง','พ้นโทษ'], dika:[] },
  { id:'crp-239', section:'239', chapter:16, chapter_title:'พยานหลักฐาน', title:'พยานเอกสารในคดีอาญา — ต้นฉบับหรือสำเนาที่รับรอง', text:'พยานเอกสาร → ให้นำต้นฉบับมาแสดง\nถ้าหาต้นฉบับไม่ได้ → ให้ใช้สำเนาที่รับรองถูกต้อง หรือพยานบุคคลที่รู้เห็นเนื้อหาของเอกสาร', summary:'พยานเอกสาร: ต้นฉบับเป็นหลัก หาไม่ได้→สำเนารับรอง/พยานบุคคล ≠ วิ.แพ่ง ม.94(ห้ามพยานบุคคลหักล้าง)', keywords:['พยานเอกสาร','ต้นฉบับ','สำเนา','รับรอง'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + cvpAdded + crpAdded));
