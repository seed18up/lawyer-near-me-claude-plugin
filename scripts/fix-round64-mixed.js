const fs = require('fs');

// === ป.อ. round 41 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-245', section:'245', chapter:17, chapter_title:'ความผิดเกี่ยวกับเงินตรา', title:'ได้เงินปลอมมาโดยไม่รู้ แล้วรู้ ยังใช้ — จำคุก ≤ 10 ปี', text:'ผู้ใดได้มาซึ่งเงินตราปลอมหรือแปลง โดยไม่รู้ว่าเป็นของปลอมหรือแปลง ภายหลังรู้แล้วยังนำออกใช้ → จำคุก ≤ 10 ปี', summary:'ได้เงินปลอมไม่รู้+รู้ทีหลังยังใช้: ≤10ปี เบากว่ารู้ตั้งแต่แรก(ม.244=1-15ปี)', keywords:['เงินปลอม','ไม่รู้','รู้ทีหลัง','ยังใช้'], dika:[] },
  { id:'crim-247', section:'247', chapter:17, chapter_title:'ความผิดเกี่ยวกับเงินตรา', title:'ทำเงินตราให้ผิดไปจากที่ออกใช้ — จำคุก ≤ 1 ปี', text:'ผู้ใดกระทำด้วยประการใดๆ ให้เงินตราที่รัฐบาลออกใช้ ผิดไปจากที่ได้ออกใช้ → จำคุก ≤ 1 ปี + ปรับ ≤ 20,000', summary:'ทำเงินผิดจากออกใช้: เช่น ขัดเหรียญให้เงา/ทำเครื่องหมายบนธนบัตร→≤1ปี เบากว่าปลอม(ม.240)', keywords:['เงินตรา','ผิดจากออกใช้','ขัดเหรียญ'], dika:[] },
  { id:'crim-259', section:'259', chapter:17, chapter_title:'ความผิดเกี่ยวกับดวงตรา', title:'ปลอมตั๋วรถโดยสาร — จำคุก ≤ 3 ปี', text:'ผู้ใดทำปลอม แก้ไข เพิ่มเติม ตั๋วโดยสาร → จำคุก ≤ 3 ปี', summary:'ปลอมตั๋วโดยสาร: ปลอมตั๋วรถไฟ/รถเมล์/เรือ→≤3ปี คู่กับ ม.256', keywords:['ปลอมตั๋ว','โดยสาร','รถไฟ'], dika:[] },
  { id:'crim-261', section:'261', chapter:17, chapter_title:'ความผิดเกี่ยวกับดวงตรา', title:'ใช้แสตมป์ที่ใช้แล้วซ้ำ — จำคุก ≤ 3 ปี', text:'ผู้ใดใช้แสตมป์ซึ่งทำขึ้นตามมาตรา 260 → จำคุก ≤ 3 ปี + ปรับ ≤ 60,000', summary:'ใช้แสตมป์ซ้ำ: ใช้แสตมป์ที่ล้าง/แก้ไขแล้ว→≤3ปี โทษเท่าผู้ทำ(ม.260)', keywords:['แสตมป์ซ้ำ','ใช้ซ้ำ','ล้าง'], dika:[] },
  { id:'crim-263', section:'263', chapter:17, chapter_title:'ความผิดเกี่ยวกับดวงตรา', title:'มีเครื่องมือสำหรับปลอมดวงตรา — จำคุก ≤ 5 ปี', text:'ผู้ใดทำ มีไว้ ซึ่งเครื่องมือหรือวัตถุสำหรับทำปลอมดวงตรา แสตมป์ → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'เครื่องมือปลอมดวงตรา: ทำ/มีไว้เครื่องมือปลอมตรา/แสตมป์→≤5ปี แม้ยังไม่ได้ปลอม', keywords:['เครื่องมือปลอม','ดวงตรา','แสตมป์','มีไว้'], dika:[] },
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
  { id:'ppc-68', section:'68', chapter:2, chapter_title:'นิติบุคคล', title:'นิติบุคคลต้องจดทะเบียน — มิฉะนั้นไม่มีฐานะนิติบุคคล', text:'นิติบุคคลจะตั้งขึ้นได้ก็แต่ด้วยอาศัยอำนาจกฎหมาย\nและต้องจดทะเบียนตามที่กฎหมายกำหนด', summary:'จดทะเบียน=นิติบุคคล: ไม่จดทะเบียน=ไม่เป็นนิติบุคคล เช่น บริษัทไม่จด=ห้างหุ้นส่วนสามัญ', keywords:['จดทะเบียน','นิติบุคคล','อำนาจกฎหมาย'], dika:[] },
  { id:'ppc-295', section:'295', chapter:8, chapter_title:'หนี้ — ลูกหนี้ร่วม', title:'เจ้าหนี้ปลดหนี้ลูกหนี้ร่วมคนหนึ่ง — ส่วนที่เหลือยังต้องจ่าย', text:'ถ้าเจ้าหนี้ปลดหนี้ให้แก่ลูกหนี้ร่วมคนหนึ่ง → ลูกหนี้ร่วมคนอื่นยังคงต้องรับผิดอยู่เต็มจำนวน หักส่วนของผู้ที่ได้รับปลดหนี้ออก', summary:'ปลดหนี้คนเดียว: ปลดคนหนึ่ง→คนอื่นยังรับผิด(หักส่วนที่ปลดออก) เช่น หนี้1ล้าน 3คนร่วม ปลด1คน→2คนจ่าย666,667', keywords:['ปลดหนี้','ลูกหนี้ร่วม','หักส่วน'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-108', section:'108', chapter:5, chapter_title:'พยานหลักฐาน', title:'พยานต้องสาบานก่อนเบิกความ — เว้นแต่เด็ก/ผู้พิการ', text:'ก่อนเบิกความ พยานต้องสาบานตนตามลัทธิศาสนาของตน หรือปฏิญาณตน\nเว้นแต่เด็กอายุไม่เกิน 14 ปี หรือบุคคลที่ศาลเห็นว่าไม่สมควรให้สาบาน', summary:'สาบานก่อนเบิกความ: พยานต้องสาบาน/ปฏิญาณก่อน ≥14ปี เด็ก<14/พิการ=ไม่ต้องสาบาน', keywords:['สาบาน','เบิกความ','ปฏิญาณ','เด็ก'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-132', section:'132', chapter:10, chapter_title:'การสอบสวน', title:'พนักงานสอบสวนต้องแจ้งข้อหาแก่ผู้ต้องหาทันที', text:'เมื่อมีการแจ้งข้อกล่าวหาแก่ผู้ใด → ให้พนักงานสอบสวนแจ้งข้อกล่าวหาให้ผู้นั้นทราบ\nและแจ้งด้วยว่ามีพยานหลักฐานอะไรบ้างที่กล่าวหา', summary:'แจ้งข้อหา: ส.ส.ต้องแจ้งข้อหา+พยานหลักฐานที่มี ไม่แจ้ง=ละเมิดสิทธิผู้ต้องหา', keywords:['แจ้งข้อหา','ผู้ต้องหา','พยานหลักฐาน'], dika:[] },
  { id:'crp-261', section:'261', chapter:18, chapter_title:'อภัยโทษ', title:'ลดโทษ — พระราชทานลดโทษ', text:'พระมหากษัตริย์ทรงพระราชทานอภัยโทษ เปลี่ยนโทษหนักเป็นเบา หรือลดโทษ ตามที่รัฐมนตรีว่าการกระทรวงยุติธรรมถวายคำแนะนำ', summary:'ลดโทษ: พระราชอำนาจ รมต.ยุติธรรมถวายคำแนะนำ เช่น พ.ร.ฎ.อภัยโทษวันเฉลิมพระชนมพรรษา', keywords:['ลดโทษ','พระราชทาน','อภัยโทษ'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + cvpAdded + crpAdded));
