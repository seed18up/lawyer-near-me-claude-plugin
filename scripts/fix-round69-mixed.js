const fs = require('fs');

// === ป.อ. round 45 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-50', section:'50', chapter:3, chapter_title:'วิธีการเพื่อความปลอดภัย', title:'วิธีการเพื่อความปลอดภัย — ศาลแก้ไขเปลี่ยนแปลงได้', text:'ศาลจะแก้ไขเปลี่ยนแปลงคำสั่งเกี่ยวกับวิธีการเพื่อความปลอดภัยเมื่อใดก็ได้ ตามที่เห็นสมควร', summary:'แก้ไขวิธีการฯ: ศาลเปลี่ยนได้ทุกเมื่อ เช่น เปลี่ยนจากกักกัน→ห้ามเขต หรือเพิ่ม/ลดระยะเวลา', keywords:['แก้ไข','วิธีการเพื่อความปลอดภัย','เปลี่ยนแปลง'], dika:[] },
  { id:'crim-52', section:'52', chapter:3, chapter_title:'วิธีเพิ่มโทษ ลดโทษ', title:'เพิ่มโทษกระทำผิดอีก — ภายใน 3 ปี (ลหุโทษ)', text:'ถ้าผู้ใดต้องคำพิพากษาให้ลงโทษ แล้วกระทำผิดอีกเป็นความผิดลหุโทษ ภายใน 3 ปี → ศาลจะเพิ่มโทษกึ่งหนึ่ง', summary:'เพิ่มโทษลหุโทษ: ทำผิดลหุโทษซ้ำใน 3 ปี→เพิ่มกึ่งหนึ่ง ≠ ความผิดทั่วไป(ม.92=5ปี)', keywords:['เพิ่มโทษ','ลหุโทษ','3 ปี','กึ่งหนึ่ง'], dika:[] },
  { id:'crim-53', section:'53', chapter:3, chapter_title:'วิธีเพิ่มโทษ ลดโทษ', title:'ลดโทษ — ศาลลดโทษตามดุลพินิจ', text:'ถ้ามีเหตุบรรเทาโทษ → ศาลจะลงโทษผู้กระทำผิดน้อยกว่าที่กฎหมายกำหนดไว้เพียงใดก็ได้\nเหตุบรรเทาโทษ: ผู้กระทำผิดเป็นผู้เยาว์ ให้ความร่วมมือ สำนึกผิด ชดใช้ค่าเสียหาย', summary:'ลดโทษ: มีเหตุบรรเทา(เยาว์/สำนึกผิด/ชดใช้)→ศาลลดได้ ≠ ม.78ป.อ.(อายุ>70=ลดกึ่งหนึ่ง)', keywords:['ลดโทษ','เหตุบรรเทา','สำนึกผิด','ชดใช้'], dika:[] },
  { id:'crim-55', section:'55', chapter:3, chapter_title:'วิธีเพิ่มโทษ ลดโทษ', title:'รอการลงโทษ — กำหนดเงื่อนไข คุมประพฤติ', text:'ในกรณีที่ศาลสั่งรอการลงโทษ → ศาลจะกำหนดเงื่อนไขเพื่อคุมความประพฤติผู้กระทำผิดด้วยก็ได้\nเงื่อนไข: รายงานตัว ทำงานบริการสังคม ห้ามเข้าสถานที่ ฯลฯ', summary:'รอลงอาญา+คุมประพฤติ: ศาลกำหนดเงื่อนไข เช่น รายงานตัว/ทำงานบริการสังคม/ห้ามเข้าสถานที่', keywords:['รอลงอาญา','คุมประพฤติ','เงื่อนไข','ทำงานบริการสังคม'], dika:[] },
  { id:'crim-77', section:'77', chapter:4, chapter_title:'ความรับผิดในทางอาญา', title:'เด็กอายุ 12-15 ปี — ไม่ต้องรับโทษ แต่ใช้มาตรการพิเศษ', text:'เด็กอายุกว่า 12 ปี แต่ยังไม่เกิน 15 ปี กระทำการอันกฎหมายบัญญัติเป็นความผิด → ไม่ต้องรับโทษ\nแต่ศาลอาจใช้มาตรการ: ว่ากล่าวตักเตือน/วางข้อกำหนด/ส่งไปสถานพินิจ', summary:'เด็ก12-15ปี: ไม่ต้องรับโทษ แต่ศาลใช้มาตรการ(ตักเตือน/สถานพินิจ) ≠ <12ปี(ม.73=ไม่มีโทษเลย)', keywords:['เด็ก 12-15','ไม่รับโทษ','มาตรการ','สถานพินิจ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === ป.พ.พ. + วิ.แพ่ง + วิ.อาญา ===
const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-91', section:'91', chapter:2, chapter_title:'นิติบุคคล — สมาคม', title:'สมาชิกสมาคมลาออกได้ — ลาออกเมื่อใดก็ได้', text:'สมาชิกของสมาคมจะลาออกจากสมาคมเมื่อใดก็ได้ เว้นแต่ข้อบังคับของสมาคมจะกำหนดไว้เป็นอย่างอื่น', summary:'ลาออกจากสมาคม: ลาออกเมื่อไหร่ก็ได้ เว้นแต่ข้อบังคับกำหนดเป็นอย่างอื่น', keywords:['สมาคม','ลาออก','สมาชิก'], dika:[] },
  { id:'ppc-193-34-ob', section:'193/34', chapter:6, chapter_title:'อายุความ', title:'อายุความ 2 ปี — ค่าสินค้า ค่าจ้างทำของ ค่ารักษา ค่าอาหาร', text:'สิทธิเรียกร้องดังต่อไปนี้ มีกำหนดอายุความ 2 ปี:\n(1) ผู้ประกอบการค้า เรียกค่าของที่ส่งมอบ\n(2) ผู้ประกอบอุตสาหกรรม เรียกค่าของ\n(3) ผู้ประกอบเกษตรกรรม\n(4) ผู้รับจ้างทำของ เรียกค่าจ้าง\n(5) ผู้รักษาพยาบาล เรียกค่ารักษา', summary:'อายุความ 2 ปี: ค่าสินค้า/ค่าจ้างทำของ/ค่ารักษาพยาบาล/ค่าอาหาร/ค่าเครื่องดื่ม', keywords:['อายุความ 2 ปี','ค่าสินค้า','ค่าจ้าง','ค่ารักษา'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-130-crp', section:'130/1', chapter:10, chapter_title:'การสอบสวน', title:'บันทึกวิดีโอการสอบสวน — คดีร้ายแรง ต้องบันทึกภาพเสียง', text:'ในคดีที่มีอัตราโทษจำคุกอย่างสูงตั้งแต่สิบปีขึ้นไป → ให้พนักงานสอบสวนบันทึกภาพและเสียงการสอบสวนไว้ด้วย', summary:'บันทึกวิดีโอสอบสวน: คดีโทษ≥10ปี→ต้องบันทึกภาพเสียง ป้องกันบังคับสารภาพ', keywords:['บันทึกวิดีโอ','สอบสวน','ภาพเสียง','10 ปี'], dika:[] },
  { id:'crp-206', section:'206', chapter:14, chapter_title:'อุทธรณ์', title:'อุทธรณ์คดีอาญา — ยื่นภายใน 1 เดือน', text:'คู่ความมีสิทธิอุทธรณ์คำพิพากษาของศาลชั้นต้น → ต้องยื่นภายใน 1 เดือนนับแต่วันอ่านคำพิพากษา', summary:'ยื่นอุทธรณ์อาญา: ภายใน 1 เดือนนับแต่อ่านคำพิพากษา เท่ากับ วิ.แพ่ง ม.229', keywords:['อุทธรณ์','1 เดือน','คำพิพากษา'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + crpAdded));
