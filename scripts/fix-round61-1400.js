const fs = require('fs');

// === ป.อ. round 39 — ทะลุ 350! ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-135-crim', section:'135', chapter:11, chapter_title:'ความผิดเกี่ยวกับความมั่นคง', title:'กระทำความผิดต่อสัมพันธไมตรี — ประทุษร้ายประมุขรัฐต่างประเทศ', text:'ผู้ใดประทุษร้ายต่อร่างกาย หรือต่อเสรีภาพของประมุขรัฐต่างประเทศ → จำคุก 1-7 ปี', summary:'ประทุษร้ายประมุขต่างประเทศ: ทำร้ายร่างกาย/เสรีภาพประธานาธิบดี/กษัตริย์ต่างประเทศ→1-7ปี', keywords:['ประมุขต่างประเทศ','ประทุษร้าย','สัมพันธไมตรี'], dika:[] },
  { id:'crim-158-cr', section:'158', chapter:12, chapter_title:'ความผิดต่อตำแหน่งหน้าที่ราชการ', title:'เจ้าพนักงานทำสำเนาเอกสารเท็จ — จำคุก 1-10 ปี', text:'ผู้ใดเป็นเจ้าพนักงาน มีหน้าที่ทำเอกสาร รับรองสำเนาเอกสาร กรอกข้อความอันเป็นเท็จ → จำคุก 1-10 ปี + ปรับ 20,000-200,000', summary:'รับรองสำเนาเท็จ: จ.พง.รับรองสำเนาเอกสารที่เป็นเท็จ→1-10ปี เช่น นายอำเภอรับรองสำเนาทะเบียนบ้านเท็จ', keywords:['รับรองสำเนา','เอกสารเท็จ','เจ้าพนักงาน'], dika:[] },
  { id:'crim-183', section:'183', chapter:13, chapter_title:'ความผิดต่อเจ้าพนักงานในการยุติธรรม', title:'ช่วยนักโทษหนีจากการพาตัว — จำคุก ≤ 3 ปี', text:'ผู้ใดช่วยผู้ถูกคุมขังให้หลุดพ้น ในระหว่างพาตัวไป หรือพาตัวกลับจากศาล → จำคุก ≤ 3 ปี + ปรับ ≤ 60,000', summary:'ช่วยหนีระหว่างพาตัว: ช่วยนักโทษหนีขณะพาไป/กลับศาล→≤3ปี', keywords:['ช่วยหนี','พาตัว','ศาล'], dika:[] },
  { id:'crim-192', section:'192', chapter:13, chapter_title:'ความผิดต่อเจ้าพนักงานในการยุติธรรม', title:'แหกที่คุมขัง — ผู้ถูกคุมขังทำลายที่คุมขัง → จำคุก ≤ 5 ปี', text:'ผู้ใดถูกคุมขัง ทำให้เสียหาย ทำลาย ซึ่งที่คุมขัง เพื่อหลุดพ้น → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'นักโทษแหกคุก: ทำลายสถานที่คุมขังเพื่อหนี→≤5ปี ≠ หนีธรรมดา(ม.181=≤3ปี)', keywords:['แหกคุก','ทำลาย','ที่คุมขัง','หลุดพ้น'], dika:[] },
  { id:'crim-193-cr', section:'193', chapter:13, chapter_title:'ความผิดต่อเจ้าพนักงานในการยุติธรรม', title:'ทำลายตรายึด/ตราอายัด — จำคุก ≤ 2 ปี', text:'ผู้ใดทำลาย ถอน หรือทำให้ไร้ประโยชน์ ซึ่งตรา เครื่องหมาย ที่เจ้าพนักงานประทับ หรือหมายไว้ที่สิ่งใด ในการยึด อายัด → จำคุก ≤ 2 ปี + ปรับ ≤ 40,000', summary:'ทำลายตรายึด: ฉีกป้ายอายัด/ทำลายตรายึดของศาล→≤2ปี ≠ ม.141(ทำลายตราจ.พง.=≤5ปี)', keywords:['ตรายึด','ตราอายัด','ทำลาย'], dika:[] },
  { id:'crim-228', section:'228', chapter:16, chapter_title:'ความผิดเกี่ยวกับการก่อภยันตราย', title:'กระทำให้เกิดเพลิงไหม้ป่า — จำคุก 2-7 ปี', text:'ผู้ใดกระทำให้เกิดเพลิงไหม้แก่ป่า → จำคุก 2-7 ปี + ปรับ 40,000-140,000', summary:'เผาป่า: วางเพลิงเผาป่า→2-7ปี เช่น ลักลอบเผาไร่แล้วลามไปเผาป่า', keywords:['เผาป่า','เพลิงไหม้','ป่า'], dika:[] },
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
  { id:'ppc-73', section:'73', chapter:2, chapter_title:'นิติบุคคล', title:'นิติบุคคลต้องมีสำนักงาน — ที่ตั้งสำนักงานจดทะเบียน', text:'นิติบุคคลต้องมีสำนักงาน ณ ที่ตั้งที่ได้จดทะเบียนไว้', summary:'สำนักงานนิติบุคคล: ต้องมีที่ตั้งจดทะเบียน เปลี่ยนที่ตั้ง=ต้องจดทะเบียนเปลี่ยน สำคัญเรื่องภูมิลำเนา(ม.66)', keywords:['สำนักงาน','นิติบุคคล','จดทะเบียน'], dika:[] },
  { id:'ppc-302', section:'302', chapter:8, chapter_title:'หนี้ — ลูกหนี้ร่วม', title:'เจ้าหนี้ร่วม — เจ้าหนี้หลายคน ลูกหนี้ชำระให้คนใดก็หลุดพ้น', text:'ถ้าบุคคลหลายคนมีสิทธิเรียกร้องชำระหนี้ โดยลูกหนี้จะชำระให้แก่คนใดคนหนึ่งก็ได้ → เจ้าหนี้ร่วม\nเมื่อชำระแล้ว → ลูกหนี้หลุดพ้น', summary:'เจ้าหนี้ร่วม: เจ้าหนี้หลายคน ลูกหนี้จ่ายให้คนไหนก็หลุดหนี้ คนที่รับ→ต้องแบ่งให้คนอื่นตามส่วน', keywords:['เจ้าหนี้ร่วม','ชำระให้คนใด','หลุดพ้น'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-181-crp', section:'181/1', chapter:12, chapter_title:'การพิจารณา', title:'ศาลมีอำนาจพิจารณาลับ — คดีเพศ/เด็ก/ความมั่นคง', text:'ศาลจะสั่งให้พิจารณาเป็นการลับก็ได้ ในกรณี:\n(1) เพื่อความสงบเรียบร้อย\n(2) เพื่อศีลธรรมอันดี\n(3) เพื่อความปลอดภัยของรัฐ\n(4) คดีเกี่ยวกับเพศ', summary:'พิจารณาลับ: คดีเพศ/เด็ก/ความมั่นคง→ลับได้ ห้ามเผยแพร่ ≠ ปกติ(ม.178=เปิดเผย)', keywords:['พิจารณาลับ','คดีเพศ','เด็ก','ความมั่นคง'], dika:[] },
  { id:'crp-258', section:'258', chapter:17, chapter_title:'ค่าธรรมเนียม', title:'ค่าธรรมเนียมชั้นอุทธรณ์/ฎีกา — ไม่เสียค่าธรรมเนียม', text:'ในคดีอาญา → ไม่ต้องเสียค่าธรรมเนียมศาลในทุกชั้นศาล ทั้งชั้นต้น อุทธรณ์ และฎีกา', summary:'ค่าธรรมเนียมอาญาทุกชั้น: ฟรีทุกชั้นศาล (ชั้นต้น/อุทธรณ์/ฎีกา) ≠ คดีแพ่ง(ต้องจ่ายทุกชั้น)', keywords:['ค่าธรรมเนียม','ทุกชั้นศาล','ฟรี'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + crpAdded));
