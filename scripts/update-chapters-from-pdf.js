const fs = require('fs');

// ── Chapter data extracted from PDF references ──────────────────────────────

const CHAPTERS = {

  'law/civil-procedure/civil-procedure.json': [
    { num:1,  title:'บทวิเคราะห์ศัพท์',                          range:'1–1',       part:'ภาค 1 บททั่วไป' },
    { num:2,  title:'ศาล',                                        range:'2–54',      part:'ภาค 1 บททั่วไป' },
    { num:3,  title:'คู่ความ',                                    range:'55–66',     part:'ภาค 1 บททั่วไป' },
    { num:4,  title:'การยื่นและส่งคำคู่ความและเอกสาร',           range:'67–83/8',   part:'ภาค 1 บททั่วไป' },
    { num:5,  title:'พยานหลักฐาน',                               range:'84–130',    part:'ภาค 1 บททั่วไป' },
    { num:6,  title:'คำพิพากษาและคำสั่ง',                        range:'131–169/3', part:'ภาค 1 บททั่วไป' },
    { num:7,  title:'วิธีพิจารณาสามัญในศาลชั้นต้น',             range:'170–188',   part:'ภาค 2 วิธีพิจารณาในศาลชั้นต้น' },
    { num:8,  title:'วิธีพิจารณาวิสามัญในศาลชั้นต้น',           range:'189–222/49',part:'ภาค 2 วิธีพิจารณาในศาลชั้นต้น' },
    { num:9,  title:'อุทธรณ์',                                    range:'223–246',   part:'ภาค 3 อุทธรณ์และฎีกา' },
    { num:10, title:'ฎีกา',                                       range:'247–252',   part:'ภาค 3 อุทธรณ์และฎีกา' },
    { num:11, title:'วิธีการชั่วคราวก่อนพิพากษา',               range:'253–270',   part:'ภาค 4 วิธีการชั่วคราวและการบังคับคดี' },
    { num:12, title:'การบังคับคดีตามคำพิพากษาหรือคำสั่ง',       range:'271–367',   part:'ภาค 4 วิธีการชั่วคราวและการบังคับคดี' },
  ],

  'law/criminal-procedure/criminal-procedure.json': [
    { num:1,  title:'หลักทั่วไป',                                         range:'1–15',      part:'ภาค 1 ข้อความเบื้องต้น' },
    { num:2,  title:'อำนาจพนักงานสอบสวนและศาล',                          range:'16–27',     part:'ภาค 1 ข้อความเบื้องต้น' },
    { num:3,  title:'การฟ้องคดีอาญาและคดีแพ่งที่เกี่ยวเนื่องกับคดีอาญา', range:'28–51',   part:'ภาค 1 ข้อความเบื้องต้น' },
    { num:4,  title:'หมายเรียกและหมายอาญา',                              range:'52–76',     part:'ภาค 1 ข้อความเบื้องต้น' },
    { num:5,  title:'จับ ขัง จำคุก ค้น ปล่อยชั่วคราว',                  range:'77–119/ทวิ',part:'ภาค 1 ข้อความเบื้องต้น' },
    { num:6,  title:'หลักทั่วไปในการสอบสวน',                             range:'120–129',   part:'ภาค 2 สอบสวน' },
    { num:7,  title:'การสอบสวน',                                          range:'130–156',   part:'ภาค 2 สอบสวน' },
    { num:8,  title:'การฟ้องคดีอาญาและไต่สวนมูลฟ้อง',                   range:'157–171',   part:'ภาค 3 วิธีพิจารณาในศาลชั้นต้น' },
    { num:9,  title:'การพิจารณา',                                         range:'172–181',   part:'ภาค 3 วิธีพิจารณาในศาลชั้นต้น' },
    { num:10, title:'คำพิพากษาและคำสั่ง',                                range:'182–192',   part:'ภาค 3 วิธีพิจารณาในศาลชั้นต้น' },
    { num:11, title:'อุทธรณ์',                                            range:'193–215',   part:'ภาค 4 อุทธรณ์และฎีกา' },
    { num:12, title:'ฎีกา',                                               range:'216–225',   part:'ภาค 4 อุทธรณ์และฎีกา' },
    { num:13, title:'พยานและหลักฐาน',                                     range:'226–244/1', part:'ภาค 5 พยานและหลักฐาน' },
    { num:14, title:'การบังคับตามคำพิพากษาและค่าธรรมเนียม',             range:'245–258',   part:'ภาค 6 การบังคับตามคำพิพากษาและค่าธรรมเนียม' },
    { num:15, title:'อภัยโทษ เปลี่ยนโทษหนักเป็นโทษเบา และลดโทษ',       range:'259–267',   part:'ภาค 7 อภัยโทษฯ' },
  ],

  'law/ppc/obligations/obligations.json': [
    { num:1,  title:'บุคคล',                        range:'1–3',         part:'บรรพ 1 บทเบ็ดเสร็จทั่วไป' },
    { num:2,  title:'นิติบุคคล',                    range:'4–14',        part:'บรรพ 1 บทเบ็ดเสร็จทั่วไป' },
    { num:3,  title:'ทรัพย์',                       range:'15–64',       part:'บรรพ 1 บทเบ็ดเสร็จทั่วไป' },
    { num:4,  title:'นิติกรรม',                     range:'65–148',      part:'บรรพ 1 บทเบ็ดเสร็จทั่วไป' },
    { num:5,  title:'บทเบ็ดเสร็จทั่วไป (หนี้)',    range:'149–193',     part:'บรรพ 2 หนี้' },
    { num:6,  title:'อายุความ',                     range:'193/1–193/35',part:'บรรพ 2 หนี้' },
    { num:7,  title:'วัตถุแห่งหนี้และผลแห่งหนี้',  range:'194–302',     part:'บรรพ 2 หนี้' },
    { num:8,  title:'สัญญา',                        range:'303–353',     part:'บรรพ 2 หนี้' },
    { num:9,  title:'ละเมิดและลาภมิควรได้',        range:'354–452',     part:'บรรพ 2 หนี้' },
  ],

  'law/ppc/sales/sales.json': [
    { num:1,  title:'ซื้อขาย — บทเบ็ดเสร็จทั่วไป',         range:'453–470',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:2,  title:'แลกเปลี่ยน',                           range:'471–471',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:3,  title:'ให้',                                   range:'472–526',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:4,  title:'เช่าทรัพย์',                           range:'537–571',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:5,  title:'เช่าซื้อ',                             range:'572–574',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:6,  title:'จ้างแรงงานและจ้างทำของ',              range:'575–607',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:7,  title:'รับขน',                                range:'608–639',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:8,  title:'ยืมและฝากทรัพย์',                     range:'640–679',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:9,  title:'ค้ำประกันและจำนอง',                   range:'680–769',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:10, title:'เก็บของในคลังสินค้าและนายหน้า',       range:'770–852',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:11, title:'ประกันภัยและตัวแทน',                  range:'853–1000',  part:'บรรพ 3 เอกเทศสัญญา' },
    { num:12, title:'ตั๋วเงิน',                             range:'898–1000',  part:'บรรพ 3 เอกเทศสัญญา' },
    { num:13, title:'หุ้นส่วนและบริษัท',                   range:'1012–1297', part:'บรรพ 3 เอกเทศสัญญา' },
  ],

  'law/ppc/loans/loans.json': [
    { num:1,  title:'ยืมใช้คงรูป',                         range:'640–649',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:2,  title:'ยืมใช้สิ้นเปลือง (กู้ยืมเงิน)',      range:'650–656',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:3,  title:'ฝากทรัพย์',                           range:'657–679',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:4,  title:'ค้ำประกัน',                           range:'680–701',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:5,  title:'จำนอง',                               range:'702–746',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:6,  title:'จำนำ',                                range:'747–769',   part:'บรรพ 3 เอกเทศสัญญา' },
    { num:7,  title:'เก็บของในคลังสินค้า',                 range:'770–796',   part:'บรรพ 3 เอกเทศสัญญา' },
  ],

  'law/ppc/property/property.json': [
    { num:1,  title:'บทนิยามทรัพย์และทรัพย์สิน',          range:'137–148',   part:'บรรพ 4 ทรัพย์สิน' },
    { num:2,  title:'บทเบ็ดเสร็จทั่วไป (กรรมสิทธิ์)',     range:'1298–1307', part:'บรรพ 4 ทรัพย์สิน' },
    { num:3,  title:'กรรมสิทธิ์',                          range:'1308–1366', part:'บรรพ 4 ทรัพย์สิน' },
    { num:4,  title:'ครอบครอง',                            range:'1367–1386', part:'บรรพ 4 ทรัพย์สิน' },
    { num:5,  title:'ภาระจำยอมและสิทธิอาศัย',             range:'1387–1434', part:'บรรพ 4 ทรัพย์สิน' },
  ],

  'law/ppc/family/family.json': [
    { num:1,  title:'การสมรส',                             range:'1435–1535',     part:'บรรพ 5 ครอบครัว' },
    { num:2,  title:'บิดามารดากับบุตร',                   range:'1536–1598/18',  part:'บรรพ 5 ครอบครัว' },
    { num:3,  title:'บุตรบุญธรรม',                        range:'1598/19–1598/41',part:'บรรพ 5 ครอบครัว' },
  ],

  'law/ppc/inheritance/inheritance.json': [
    { num:1,  title:'บทเบ็ดเสร็จทั่วไป — การตกทอดและการเป็นทายาท',  range:'1599–1619', part:'บรรพ 6 มรดก ลักษณะ 1' },
    { num:2,  title:'ทายาทโดยธรรม',                                   range:'1620–1645', part:'บรรพ 6 มรดก ลักษณะ 2' },
    { num:3,  title:'พินัยกรรม',                                       range:'1646–1710', part:'บรรพ 6 มรดก ลักษณะ 3' },
    { num:4,  title:'วิธีจัดการและปันทรัพย์มรดก',                    range:'1711–1752', part:'บรรพ 6 มรดก ลักษณะ 4' },
    { num:5,  title:'มรดกที่ไม่มีผู้รับและอายุความมรดก',             range:'1753–1755', part:'บรรพ 6 มรดก ลักษณะ 5–6' },
  ],

  'law/labor/labor.json': [
    { num:0,  title:'หลักทั่วไปและคำนิยาม',                           range:'1–6',     part:'บทนำ' },
    { num:1,  title:'บททั่วไป',                                        range:'7–22',    part:'' },
    { num:2,  title:'การใช้แรงงานทั่วไป',                             range:'23–37',   part:'' },
    { num:3,  title:'การใช้แรงงานหญิง',                               range:'38–43',   part:'' },
    { num:4,  title:'การใช้แรงงานเด็ก',                               range:'44–52',   part:'' },
    { num:5,  title:'ค่าจ้าง ค่าล่วงเวลา ค่าทำงานในวันหยุด',        range:'53–77',   part:'' },
    { num:6,  title:'คณะกรรมการค่าจ้าง',                             range:'78–91',   part:'' },
    { num:7,  title:'สวัสดิการ',                                       range:'92–99',   part:'' },
    { num:8,  title:'ความปลอดภัย อาชีวอนามัย และสภาพแวดล้อม',        range:'100–107', part:'' },
    { num:9,  title:'การควบคุม',                                       range:'108–115/1',part:'' },
    { num:10, title:'การพักงาน',                                       range:'116–117', part:'' },
    { num:11, title:'ค่าชดเชย',                                       range:'118–122', part:'' },
    { num:12, title:'การยื่นคำร้องและการพิจารณาคำร้อง',              range:'123–125/1',part:'' },
    { num:13, title:'กองทุนสงเคราะห์ลูกจ้าง',                        range:'126–138', part:'' },
    { num:14, title:'พนักงานตรวจแรงงาน',                              range:'139–142', part:'' },
    { num:15, title:'การส่งหนังสือ',                                   range:'143–143', part:'' },
    { num:16, title:'บทกำหนดโทษ',                                     range:'144–159', part:'' },
  ],

  'law/narcotics/narcotics.json': [
    { num:1,  title:'บทบัญญัติทั่วไป',                                                 range:'1–2',   part:'ภาค 1 ลักษณะ 1' },
    { num:2,  title:'นโยบายและแผนระดับชาติว่าด้วยการป้องกันและปราบปรามยาเสพติด',      range:'3–11',  part:'ภาค 1 ลักษณะ 2' },
    { num:3,  title:'สำนักงาน ป.ป.ส.',                                                 range:'12–14', part:'ภาค 1 ลักษณะ 2' },
    { num:4,  title:'บทบัญญัติทั่วไปและคณะกรรมการควบคุมยาเสพติด',                    range:'15–31', part:'ภาค 1 ลักษณะ 3' },
    { num:5,  title:'การอนุญาตและการขึ้นทะเบียนเกี่ยวกับยาเสพติด',                   range:'32–54', part:'ภาค 1 ลักษณะ 3' },
    { num:6,  title:'มาตรการควบคุมพิเศษและตรวจสอบทรัพย์สิน',                         range:'55–90', part:'ภาค 1 ลักษณะ 3–4' },
    { num:7,  title:'ความผิดเกี่ยวกับยาเสพติดให้โทษ',                                 range:'91–107',part:'ภาค 2 ลักษณะ 1' },
    { num:8,  title:'ความผิดเกี่ยวกับวัตถุออกฤทธิ์',                                  range:'108–144',part:'ภาค 2 ลักษณะ 2–3' },
    { num:9,  title:'บทกำหนดโทษ',                                                      range:'145–164',part:'ภาค 3' },
  ],

  'law/bankruptcy/bankruptcy.json': [
    { num:1,  title:'กระบวนพิจารณาตั้งแต่ขอให้ล้มละลายจนถึงปลดจากล้มละลาย', range:'7–81/4',    part:'หมวด 1' },
    { num:2,  title:'กรณีลูกหนี้ตาย',                                          range:'82–87',     part:'หมวด 2' },
    { num:3,  title:'กรณีลูกหนี้เป็นนิติบุคคล',                               range:'88–90',     part:'หมวด 3' },
    { num:4,  title:'การฟื้นฟูกิจการของลูกหนี้',                              range:'90/1–90/90',part:'หมวด 3/1' },
    { num:5,  title:'การฟื้นฟูกิจการ SME',                                     range:'90/91–90/128',part:'หมวด 3/2' },
    { num:6,  title:'วิธีจัดการทรัพย์สินของลูกหนี้',                          range:'91–138',    part:'หมวด 4' },
    { num:7,  title:'เจ้าพนักงานพิทักษ์ทรัพย์',                              range:'139–148/1', part:'หมวด 5' },
    { num:8,  title:'อำนาจศาลและกระบวนพิจารณา',                              range:'149–159',   part:'หมวด 6' },
    { num:9,  title:'การสอบสวนและบทกำหนดโทษ',                                range:'160–175',   part:'หมวด 7' },
    { num:10, title:'บทบัญญัติเบ็ดเสร็จ',                                     range:'176–181',   part:'หมวด 8' },
  ],
};

// ── Helper functions ──────────────────────────────────────────────────────────

function toNum(s) {
  const str = s.toString().replace('/', '.');
  return parseFloat(str);
}

function parseRange(range) {
  const parts = range.split('–').map(x => x.trim().replace('/ทวิ', '.2').replace('/อัฎฐ',''));
  const loStr = parts[0], hiStr = parts[1] || parts[0];
  const loBase = loStr.includes('/') ? parseInt(loStr.split('/')[0]) : null;
  const hiBase = hiStr.includes('/') ? parseInt(hiStr.split('/')[0]) : null;
  if (loBase !== null && hiBase !== null && loBase === hiBase) {
    return { lo: loBase + 0.001, hi: loBase + 0.999, exact: true };
  }
  return { lo: toNum(loStr), hi: toNum(hiStr), exact: false };
}

// ── Apply updates ─────────────────────────────────────────────────────────────

for (const [filePath, newChapters] of Object.entries(CHAPTERS)) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Build range map
  const rangeMap = [];
  for (const c of newChapters) {
    const r = parseRange(c.range);
    if (r) rangeMap.push({ num: c.num, lo: r.lo, hi: r.exact ? r.hi : r.hi + 0.99 });
  }
  rangeMap.sort((a, b) => a.lo - b.lo);
  for (let i = 0; i < rangeMap.length - 1; i++) {
    if (rangeMap[i].hi >= rangeMap[i+1].lo) {
      rangeMap[i].hi = rangeMap[i+1].lo - 0.0001;
    }
  }

  // Re-assign section chapters
  let fixed = 0, unmatched = 0;
  for (const s of data.sections) {
    const n = toNum(s.section);
    let found = null;
    for (const r of rangeMap) {
      if (n >= r.lo && n <= r.hi) { found = r; break; }
    }
    if (found) {
      if (s.chapter !== found.num) { s.chapter = found.num; fixed++; }
      const ch = newChapters.find(c => c.num === found.num);
      if (ch) s.chapter_title = ch.title;
    } else {
      // nearest
      let best = rangeMap[0], bestDist = Infinity;
      for (const r of rangeMap) {
        const dist = Math.min(Math.abs(n - r.lo), Math.abs(n - r.hi));
        if (dist < bestDist) { bestDist = dist; best = r; }
      }
      if (s.chapter !== best.num) { s.chapter = best.num; fixed++; }
      const ch = newChapters.find(c => c.num === best.num);
      if (ch) s.chapter_title = ch.title;
      unmatched++;
    }
  }

  // Replace chapters array (preserve existing label/subchapters if present)
  data.chapters = newChapters.map(c => {
    const old = (data.chapters || []).find(x => x.num === c.num) || {};
    return { ...c, ...(old.label ? {label: old.label} : {}), ...(old.subchapters ? {subchapters: old.subchapters} : {}) };
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  const name = filePath.split('/').slice(-2).join('/');
  console.log(`${name}: ${newChapters.length} chapters, fixed ${fixed}/${data.sections.length} sections${unmatched?' ('+unmatched+' nearest)':''}`);
}
