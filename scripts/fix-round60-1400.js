const fs = require('fs');

// === ป.อ. round 38 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-140-cr', section:'140', chapter:11, chapter_title:'ความผิดต่อเจ้าพนักงาน', title:'ข่มขืนใจเจ้าพนักงาน — บังคับให้ปฏิบัติ/ไม่ปฏิบัติหน้าที่ → จำคุก ≤ 4 ปี', text:'ผู้ใดข่มขืนใจเจ้าพนักงานให้ปฏิบัติการอันมิชอบด้วยหน้าที่ หรือให้ละเว้นการปฏิบัติ → จำคุก ≤ 4 ปี + ปรับ ≤ 80,000', summary:'ข่มขืนใจ จ.พง.: บังคับให้ จ.พง.ทำ/ไม่ทำหน้าที่→≤4ปี ≠ ม.138(ต่อสู้ จ.พง.=≤1ปี/4ปี)', keywords:['ข่มขืนใจ','เจ้าพนักงาน','บังคับ'], dika:[] },
  { id:'crim-142', section:'142', chapter:11, chapter_title:'ความผิดต่อเจ้าพนักงาน', title:'แจ้งเหตุเท็จต่อเจ้าพนักงาน — จำคุก ≤ 3 เดือน', text:'ผู้ใดแจ้งเหตุอันควรเชื่อว่ามิได้เกิดมีขึ้น ต่อเจ้าพนักงาน → จำคุก ≤ 3 เดือน + ปรับ ≤ 5,000', summary:'แจ้งเหตุเท็จ: แจ้งเหตุที่ไม่มีจริง(เช่น แจ้งว่าถูกปล้นทั้งที่ไม่ได้ถูก)→≤3เดือน ≠ ม.172(แจ้งความเท็จคดีอาญา=≤2ปี)', keywords:['แจ้งเหตุเท็จ','ไม่มีจริง','เจ้าพนักงาน'], dika:[] },
  { id:'crim-145', section:'145', chapter:11, chapter_title:'ความผิดต่อเจ้าพนักงาน', title:'แสดงตนเป็นเจ้าพนักงาน — แอบอ้างเป็นตำรวจ/ทหาร → จำคุก ≤ 1 ปี', text:'ผู้ใดแสดงตนเป็นเจ้าพนักงาน กระทำการตามตำแหน่ง → จำคุก ≤ 1 ปี + ปรับ ≤ 20,000', summary:'แอบอ้างเป็น จ.พง.: แอบอ้างเป็นตำรวจ/ทหาร+ใช้อำนาจ→≤1ปี ≠ ม.380ลหุโทษ(แค่แต่งเครื่องแบบ=ปรับ≤10,000)', keywords:['แสดงตนเป็น','เจ้าพนักงาน','แอบอ้าง'], dika:[] },
  { id:'crim-146', section:'146', chapter:11, chapter_title:'ความผิดต่อเจ้าพนักงาน', title:'สวมตำแหน่งเจ้าพนักงาน — จำคุก ≤ 2 ปี', text:'ผู้ใดไม่มีอำนาจที่จะสั่งเจ้าพนักงานให้กระทำการหรือไม่กระทำการ กลับสั่ง → จำคุก ≤ 2 ปี + ปรับ ≤ 40,000', summary:'สวมตำแหน่ง: สั่งการ จ.พง.โดยไม่มีอำนาจ→≤2ปี เช่น แอบอ้างเป็นนายอำเภอสั่งกำนัน', keywords:['สวมตำแหน่ง','ไม่มีอำนาจ','สั่งการ'], dika:[] },
  { id:'crim-161', section:'161', chapter:12, chapter_title:'ความผิดต่อตำแหน่งหน้าที่ราชการ', title:'เจ้าพนักงานรับราชการซ้อน — จำคุก ≤ 2 ปี', text:'ผู้ใดเป็นเจ้าพนักงาน ทำหรือเปิดเผยแผนที่ แบบ สัญญา สิ่งอื่นอันเป็นความลับในราชการ → จำคุก ≤ 10 ปี', summary:'เปิดเผยความลับราชการ: เปิดเผยแผนที่/แบบ/สัญญา/ราชการลับ→≤10ปี หนักกว่า ม.155(ความลับทั่วไป=≤5ปี)', keywords:['ความลับราชการ','แผนที่','แบบ','สัญญา'], dika:[] },
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
  { id:'ppc-75', section:'75', chapter:2, chapter_title:'นิติบุคคล', title:'นิติบุคคลต้องมีผู้แทน — ผู้แทนทำการแทนนิติบุคคล', text:'ถ้านิติบุคคลไม่มีผู้แทน หรือผู้แทนทำหน้าที่ไม่ได้ → ศาลจะตั้งผู้แทนชั่วคราวให้ เมื่อมีผู้มีส่วนได้เสียร้องขอ', summary:'นิติบุคคลไม่มีผู้แทน: ศาลตั้งผู้แทนชั่วคราวได้ เช่น กรรมการลาออกหมด→ศาลตั้งแทน', keywords:['นิติบุคคล','ไม่มีผู้แทน','ผู้แทนชั่วคราว'], dika:[] },
  { id:'ppc-297', section:'297', chapter:8, chapter_title:'หนี้ — ลูกหนี้ร่วม', title:'ลูกหนี้ร่วมคนหนึ่งผิดนัด — ไม่กระทบคนอื่น', text:'การผิดนัดของลูกหนี้ร่วมคนหนึ่ง → ไม่เป็นผลเสียแก่ลูกหนี้ร่วมคนอื่น\nหนี้ที่ถึงกำหนดชำระโดยลูกหนี้ร่วมคนหนึ่งผิดนัด → ลูกหนี้ร่วมคนอื่นยังไม่ถือว่าผิดนัด', summary:'ผิดนัดคนเดียว: ลูกหนี้ร่วมคนหนึ่งผิดนัด→คนอื่นไม่ถือว่าผิดนัด เหตุส่วนตัว≠กระทบคนอื่น', keywords:['ลูกหนี้ร่วม','ผิดนัด','ไม่กระทบ'], dika:[] },
  { id:'ppc-419', section:'419', chapter:13, chapter_title:'ลาภมิควรได้', title:'ลาภมิควรได้ — ให้ทรัพย์เพื่อวัตถุประสงค์ผิดกฎหมาย → เรียกคืนไม่ได้', text:'ผู้ใดได้ให้ทรัพย์สินเพื่อชำระหนี้อันเป็นการฝ่าฝืนศีลธรรมอันดี หรือเป็นการต้องห้ามชัดแจ้งโดยกฎหมาย → ผู้นั้นจะเรียกทรัพย์สินคืนไม่ได้', summary:'ให้เพื่อผิดกฎหมาย: จ่ายเงินเพื่อจ้างฆ่า/ค้ายาเสพติด→เรียกคืนไม่ได้ ทั้งสองฝ่ายผิดเท่ากัน', keywords:['ผิดกฎหมาย','ศีลธรรม','เรียกคืนไม่ได้'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-8', section:'8', chapter:1, chapter_title:'เขตอำนาจศาล', title:'คดีที่ฟ้องผิดเขตศาล — ศาลรับไว้แล้ว จะโอนหรือพิจารณาต่อก็ได้', text:'เมื่อศาลได้รับคำฟ้องไว้แล้ว แม้ภายหลังจะปรากฏว่าคดีนั้นอยู่นอกเขตอำนาจ → ศาลจะดำเนินกระบวนพิจารณาต่อไปก็ได้ ถ้าคู่ความไม่คัดค้าน', summary:'ฟ้องผิดเขต: ศาลรับไว้แล้ว+ไม่มีใครคัดค้าน→พิจารณาต่อได้ ≠ ต้องยกฟ้องเสมอ', keywords:['ผิดเขตศาล','ไม่คัดค้าน','พิจารณาต่อ'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + cvpAdded));
