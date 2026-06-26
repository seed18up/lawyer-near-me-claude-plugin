const fs = require('fs');

// === ป.พ.พ. obligations — เพิ่มมาตราที่ยังขาด ===
const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-70', section:'70', chapter:2, chapter_title:'นิติบุคคล', title:'นิติบุคคลมีภูมิลำเนา — ตามที่จดทะเบียน', text:'นิติบุคคลมีภูมิลำเนา ณ ที่ตั้งสำนักงานใหญ่ หรือที่ตั้งที่ได้จดทะเบียนไว้\nถ้ามีสำนักงานหลายแห่ง → ถือเอาแห่งใดแห่งหนึ่งที่ทำกิจการเป็นภูมิลำเนา', summary:'ภูมิลำเนานิติบุคคล: สำนักงานใหญ่=ภูมิลำเนา หลายสาขา→เลือกแห่งไหนก็ได้ คู่กับ ม.66', keywords:['ภูมิลำเนา','นิติบุคคล','สำนักงานใหญ่','สาขา'], dika:[] },
  { id:'ppc-72', section:'72', chapter:2, chapter_title:'นิติบุคคล', title:'นิติบุคคลมีชื่อ — ต้องใช้ชื่อตามที่จดทะเบียน', text:'นิติบุคคลต้องมีชื่อ → ชื่อนิติบุคคลต้องใช้ตามที่จดทะเบียนไว้', summary:'ชื่อนิติบุคคล: ต้องใช้ตามจดทะเบียน ใช้ชื่ออื่น→ไม่ผูกพัน เช่น บจ.ABC ทำสัญญาในชื่อ XYZ=ไม่ผูกพัน', keywords:['ชื่อนิติบุคคล','จดทะเบียน','ชื่อ'], dika:[] },
  { id:'ppc-193-11-ob', section:'193/11', chapter:6, chapter_title:'อายุความ', title:'นับอายุความรวมวันหยุด — ไม่หักเสาร์อาทิตย์', text:'ในการนับอายุความ ไม่ให้หักวันหยุดออก ให้นับรวมทุกวัน\nแต่ถ้าวันสุดท้ายของอายุความตรงกับวันหยุด → ให้วันถัดไปเป็นวันสุดท้าย', summary:'อายุความนับวันหยุด: นับรวมทุกวัน(เสาร์อาทิตย์ด้วย) แต่วันสุดท้ายตรงวันหยุด=เลื่อนวันถัดไป', keywords:['อายุความ','วันหยุด','นับรวม','วันสุดท้าย'], dika:[] },
  { id:'ppc-298', section:'298', chapter:8, chapter_title:'หนี้ — ลูกหนี้ร่วม', title:'ลูกหนี้ร่วมคนหนึ่งขาดอายุความ — คนอื่นยังรับผิด', text:'การที่อายุความสิทธิเรียกร้องสำเร็จเป็นประโยชน์แก่ลูกหนี้ร่วมคนหนึ่ง → ไม่เป็นประโยชน์แก่ลูกหนี้ร่วมคนอื่น', summary:'อายุความลูกหนี้ร่วม: คนหนึ่งขาดอายุความ→คนอื่นยังรับผิด เหตุส่วนตัว≠กระทบคนอื่น', keywords:['อายุความ','ลูกหนี้ร่วม','ไม่กระทบ'], dika:[] },
  { id:'ppc-415', section:'415', chapter:13, chapter_title:'ลาภมิควรได้', title:'ลาภมิควรได้ — ผู้รับโอนทรัพย์ต่อ → ผู้รับโอนต้องคืนแทน', text:'ถ้าผู้ได้ลาภมิควรได้ ได้โอนทรัพย์สินนั้นไปให้บุคคลภายนอกโดยเสน่หา → บุคคลภายนอกนั้นต้องคืนลาภมิควรได้แทน', summary:'โอนทรัพย์ต่อ: ผู้รับโอนต่อโดยเสน่หา(ไม่จ่ายเงิน)→ต้องคืนแทน ≠ ซื้อโดยสุจริต(ไม่ต้องคืน)', keywords:['โอนทรัพย์','บุคคลภายนอก','เสน่หา','คืนแทน'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

// === วิ.แพ่ง + วิ.อาญา ===
const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-123', section:'123', chapter:5, chapter_title:'พยานเอกสาร', title:'เอกสารมหาชน — สันนิษฐานว่าแท้จริง', text:'เอกสารมหาชน คือ เอกสารที่พนักงานเจ้าหน้าที่ทำขึ้นหรือรับรองในหน้าที่\n→ ให้สันนิษฐานไว้ก่อนว่าเป็นของแท้จริง ฝ่ายที่โต้แย้งต้องพิสูจน์', summary:'เอกสารมหาชน: ราชการทำ→สันนิษฐานว่าแท้จริง ผู้โต้แย้งต้องพิสูจน์ เช่น โฉนด/ทะเบียนบ้าน/สูติบัตร', keywords:['เอกสารมหาชน','สันนิษฐาน','แท้จริง','ราชการ'], dika:[] },
  { id:'cvp-245', section:'245', chapter:8, chapter_title:'อุทธรณ์', title:'ศาลอุทธรณ์มีคำสั่งชั่วคราว — สั่งทุเลาการบังคับคดีได้', text:'ระหว่างอุทธรณ์ → ศาลอุทธรณ์อาจสั่งทุเลาการบังคับคดีไว้ก่อนก็ได้ เมื่อคู่ความร้องขอ', summary:'ทุเลาบังคับคดี: ระหว่างอุทธรณ์→ศาลสั่งหยุดบังคับคดีไว้ก่อนได้ เช่น ชะลอการยึดทรัพย์', keywords:['ทุเลา','บังคับคดี','อุทธรณ์','หยุดชั่วคราว'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-150-crp2', section:'150/1', chapter:11, chapter_title:'การชันสูตรพลิกศพ', title:'ชันสูตรพลิกศพ — ต้องมีพนักงานสอบสวน + แพทย์', text:'การชันสูตรพลิกศพ → ต้องทำโดยพนักงานสอบสวนร่วมกับแพทย์\nพนักงานสอบสวนต้องทำรายงานการชันสูตรพลิกศพ', summary:'ชันสูตร: ส.ส.+แพทย์ร่วมกัน ทำรายงาน ระบุสาเหตุ/พฤติการณ์การตาย เป็นพยานหลักฐานสำคัญ', keywords:['ชันสูตร','พนักงานสอบสวน','แพทย์','รายงาน'], dika:[] },
  { id:'crp-211', section:'211', chapter:14, chapter_title:'อุทธรณ์', title:'อุทธรณ์คำสั่งระหว่างพิจารณา — อุทธรณ์พร้อมคำพิพากษา', text:'คำสั่งระหว่างพิจารณา → ห้ามอุทธรณ์จนกว่าจะมีคำพิพากษา\nเมื่อมีคำพิพากษาแล้ว → อุทธรณ์คำสั่งระหว่างพิจารณาพร้อมอุทธรณ์คำพิพากษาได้', summary:'อุทธรณ์คำสั่งระหว่าง: อุทธรณ์แยกไม่ได้ ต้องรอพิพากษาก่อน คล้าย วิ.แพ่ง ม.235', keywords:['คำสั่งระหว่างพิจารณา','อุทธรณ์พร้อม','คำพิพากษา'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (obAdded + cvpAdded + crpAdded));
