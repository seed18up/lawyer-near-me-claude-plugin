const fs = require('fs');

// === ป.อ. round 34 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-197', section:'197', chapter:13, chapter_title:'ความผิดต่อเจ้าพนักงานในการยุติธรรม', title:'ช่วยผู้ถูกคุมขังหนี — โดยใช้กำลัง → จำคุก 1-7 ปี', text:'ถ้าการกระทำตามมาตรา 192 หรือ 196 ได้กระทำโดยใช้กำลังประทุษร้าย หรือขู่เข็ญว่าจะใช้กำลังประทุษร้าย → จำคุก 1-7 ปี + ปรับ 20,000-140,000', summary:'ช่วยหนี+ใช้กำลัง: ช่วยนักโทษหนีโดยใช้กำลัง→1-7ปี หนักกว่าช่วยหนีธรรมดา(ม.196=≤5ปี)', keywords:['ช่วยหนี','ใช้กำลัง','คุมขัง'], dika:[] },
  { id:'crim-198', section:'198', chapter:13, chapter_title:'ความผิดต่อเจ้าพนักงานในการยุติธรรม', title:'เจ้าพนักงานจงใจปล่อยนักโทษ — จำคุก 1-10 ปี', text:'ถ้าผู้กระทำความผิดตามมาตรา 192 ถึง 197 เป็นเจ้าพนักงานผู้มีหน้าที่ควบคุมผู้ถูกคุมขัง → ระวางโทษเป็นสองเท่า', summary:'จ.พง.ปล่อยนักโทษ: โทษ 2 เท่าของคนธรรมดา เพราะละเมิดหน้าที่ เช่น ผู้คุมปล่อยนักโทษหนี', keywords:['เจ้าพนักงาน','ปล่อยนักโทษ','2 เท่า'], dika:[] },
  { id:'crim-269-8', section:'269/8', chapter:17, chapter_title:'ความผิดเกี่ยวกับหนังสือเดินทาง', title:'ปลอมวีซ่า/ตราประทับหนังสือเดินทาง — จำคุก 1-10 ปี', text:'ผู้ใดทำปลอมขึ้นซึ่งตรวจลงตรา (วีซ่า) → จำคุก 1-10 ปี + ปรับ 20,000-200,000', summary:'ปลอมวีซ่า: ปลอมตรวจลงตรา/ตราประทับในพาสปอร์ต→1-10ปี ใช้วีซ่าปลอม=โทษเท่ากัน', keywords:['วีซ่า','ตรวจลงตรา','ปลอม','หนังสือเดินทาง'], dika:[] },
  { id:'crim-269-9', section:'269/9', chapter:17, chapter_title:'ความผิดเกี่ยวกับหนังสือเดินทาง', title:'ใช้หนังสือเดินทางของผู้อื่น — จำคุก 1-10 ปี', text:'ผู้ใดใช้หนังสือเดินทางของผู้อื่น หรือให้ผู้อื่นใช้หนังสือเดินทางของตน → จำคุก 1-10 ปี + ปรับ 20,000-200,000', summary:'ใช้พาสปอร์ตคนอื่น: ใช้เอง/ให้คนอื่นใช้พาสปอร์ตของตน→1-10ปี', keywords:['หนังสือเดินทาง','ใช้ของผู้อื่น','พาสปอร์ต'], dika:[] },
  { id:'crim-239', section:'239', chapter:16, chapter_title:'ความผิดเกี่ยวกับการก่อภยันตราย', title:'ทำให้อุทกภัย — ปล่อยน้ำให้ท่วมจนเกิดอันตราย → จำคุก ≤ 10 ปี', text:'ผู้ใดกระทำให้เกิดอุทกภัย → จำคุก ≤ 10 ปี + ปรับ ≤ 200,000\nถ้าเป็นเหตุให้ผู้อื่นตาย → จำคุก 5-20 ปี', summary:'ก่ออุทกภัย: ปล่อยน้ำท่วม/ทำลายเขื่อนจนท่วม→≤10ปี ตาย=5-20ปี', keywords:['อุทกภัย','น้ำท่วม','เขื่อน','อันตราย'], dika:[] },
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
  { id:'ppc-193-18', section:'193/18', chapter:6, chapter_title:'อายุความ', title:'อายุความ — คำนวณนับถอยหลังจากวันที่บังคับสิทธิได้', text:'ให้เริ่มนับอายุความตั้งแต่ขณะที่อาจบังคับสิทธิเรียกร้องได้เป็นต้นไป สิทธิเรียกร้องใดมีเงื่อนเวลาเริ่มต้น → อายุความเริ่มนับเมื่อถึงกำหนดเวลานั้น', summary:'เริ่มนับอายุความ: เมื่อบังคับสิทธิได้ มีเงื่อนเวลา→เมื่อถึงกำหนด เช่น หนี้ครบกำหนด=เริ่มนับ', keywords:['เริ่มนับอายุความ','บังคับสิทธิ','เงื่อนเวลา'], dika:[] },
  { id:'ppc-281', section:'281', chapter:7, chapter_title:'หนี้ — บุริมสิทธิ', title:'ผลบุริมสิทธิ — ได้รับชำระก่อนเจ้าหนี้สามัญ', text:'ผู้ทรงบุริมสิทธิย่อมมีสิทธิได้รับชำระหนี้ก่อนเจ้าหนี้สามัญ จากทรัพย์สินอันเป็นหลักแห่งบุริมสิทธินั้น', summary:'ผลบุริมสิทธิ: ได้ชำระก่อนเจ้าหนี้สามัญ ≠ เจ้าหนี้จำนอง(ม.728=บังคับจากทรัพย์จำนอง)', keywords:['บุริมสิทธิ','ชำระก่อน','เจ้าหนี้สามัญ'], dika:[] },
  { id:'ppc-413', section:'413', chapter:13, chapter_title:'ลาภมิควรได้', title:'ลาภมิควรได้ — ผู้รับสุจริต คืนเท่าที่ยังเหลือ', text:'ถ้าผู้รับลาภมิควรได้ ได้รับไว้โดยสุจริต → ต้องคืนลาภมิควรได้เพียงเท่าที่ยังเหลืออยู่ในขณะเมื่อเรียกคืน', summary:'ผู้รับสุจริต: คืนเฉพาะที่เหลือ ใช้ไปแล้ว→ไม่ต้องคืนส่วนที่ใช้ ≠ ทุจริต(ม.417=คืนทั้งหมด+ดอกเบี้ย)', keywords:['สุจริต','คืนเท่าที่เหลือ','ลาภมิควรได้'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-219', section:'219', chapter:15, chapter_title:'ฎีกา', title:'ห้ามฎีกาคดีจำเลยรับสารภาพ — เฉพาะข้อกฎหมาย/กำหนดโทษ', text:'ในคดีที่จำเลยให้การรับสารภาพ → ห้ามฎีกาในปัญหาข้อเท็จจริง\nฎีกาได้เฉพาะ ข้อกฎหมาย หรือ กำหนดโทษ', summary:'รับสารภาพห้ามฎีกา: จำเลยรับแล้ว→ฎีกาข้อเท็จจริงไม่ได้ ข้อกฎหมาย/กำหนดโทษ=ฎีกาได้', keywords:['ห้ามฎีกา','รับสารภาพ','ข้อกฎหมาย'], dika:[] },
  { id:'crp-223', section:'223', chapter:15, chapter_title:'ฎีกา', title:'ฎีกาในคดีอาญา — ยื่นภายใน 1 เดือน', text:'การฎีกาคำพิพากษาของศาลอุทธรณ์ → ต้องยื่นภายในหนึ่งเดือนนับแต่วันอ่านคำพิพากษาศาลอุทธรณ์', summary:'ยื่นฎีกา: ภายใน 1 เดือนนับแต่อ่านคำพิพากษาศาลอุทธรณ์ เท่ากับ วิ.แพ่ง(ม.247)', keywords:['ฎีกา','1 เดือน','ศาลอุทธรณ์'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + crpAdded));
