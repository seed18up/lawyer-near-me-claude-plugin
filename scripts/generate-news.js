#!/usr/bin/env node

/**
 * Daily Legal News Generator for Lawyer Near Me (ทนายใกล้ฉัน)
 * Uses Anthropic API (claude-sonnet-4-6) to generate 3 Thai legal news stories:
 *   [0] drama story  → Facebook morning post
 *   [1] drama story  → Facebook evening post
 *   [2] general story → website display only
 * Writes output to news-data.json at the repo root.
 *
 * No npm packages required — uses Node 18+ built-in fetch().
 */

const { writeFileSync } = require('fs');
const { join } = require('path');
const ROOT = join(__dirname, '..');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set.');
  process.exit(1);
}

async function main() { await generateNews(); }
main().catch(e => { console.error(e); process.exit(1); });

// Format today's date in Thai (Buddhist Era)
function getTodayISO() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getTodayThai() {
  const now = new Date();
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];
  const day = now.getDate();
  const month = thaiMonths[now.getMonth()];
  const year = now.getFullYear() + 543; // Convert to Buddhist Era
  return `${day} ${month} ${year}`;
}

async function generateNews() {
  const today = getTodayISO();

  const prompt = `สร้างข่าวกฎหมายไทย 3 เรื่อง สมจริง สำหรับวันที่ ${today} โดยมีโครงสร้างดังนี้:

เรื่องที่ 1 และ 2 — ข่าวดราม่า (สำหรับโพสต์ Facebook)
- ต้องเป็นเรื่องที่คนทั่วไปอาจเจอได้ เช่น ถูกโกง, โดนเอาเปรียบ, สิทธิ์ถูกละเมิด, แรงงานโดนกลั่นแกล้ง, ซื้อบ้านโกง
- หัวข่าวต้องสะเทือนอารมณ์ อ่านแล้วอยากแชร์ต่อ
- เนื้อหาต้องมีความขัดแย้ง (ผู้เสียหาย vs นายจ้าง/บริษัท/คู่สมรส/นักต้มตุ๋น)
- มี emotional hook — โกรธ, กลัว, หรืออยากช่วยเหลือ
- ต้องมี field: drama_hook และ hashtags

เรื่องที่ 3 — ข่าวกฎหมายทั่วไป (สำหรับเว็บไซต์)
- ข่าวความเคลื่อนไหวกฎหมาย, คำพิพากษา, หรือการเปลี่ยนแปลงกฎระเบียบ
- น่าสนใจ ให้ความรู้ ไม่จำเป็นต้องดราม่า
- ไม่ต้องมี field: drama_hook และ hashtags

ทุกเรื่องต้องมี field เหล่านี้:
- category: ประเภทคดี (เช่น "คดีแรงงาน", "อสังหาริมทรัพย์", "ผู้บริโภค", "ครอบครัว", "สัญญาธุรกิจ", "คดีอาญา")
- category_en: English slug (labor, property, consumer, family, contract, criminal)
- title: หัวข่าว กระชับ ดึงดูด ภาษาไทย (ไม่เกิน 80 ตัวอักษร)
- what_happened: เกิดอะไรขึ้น 2-3 ประโยค
- impact: กระทบอย่างไร หรือบทเรียน 1-2 ประโยค
- action: ควรทำอะไร 1-2 ประโยค
- practice_area: สาขากฎหมาย เช่น "Civil / Labor Law"
- urgency: "high" | "medium" | "low"

เฉพาะเรื่องที่ 1 และ 2 เพิ่ม:
- drama_hook: ประโยคเปิดดราม่า 1 ประโยค ที่ทำให้คนหยุดอ่านบน Social Media
- hashtags: array ของ hashtag ภาษาไทย 4-5 อัน เช่น ["#สิทธิแรงงาน","#ระวังโดนโกง"]

ตอบเป็น JSON array 3 elements เท่านั้น ไม่มีข้อความอื่น`;

  console.log(`Calling Anthropic API for date: ${today} ...`);

  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });
  } catch (networkError) {
    console.error('ERROR: Network request to Anthropic API failed:', networkError.message);
    process.exit(1);
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ERROR: Anthropic API returned HTTP ${response.status}: ${errorText}`);
    process.exit(1);
  }

  let apiData;
  try {
    apiData = await response.json();
  } catch (parseError) {
    console.error('ERROR: Failed to parse Anthropic API response as JSON:', parseError.message);
    process.exit(1);
  }

  const rawText = apiData?.content?.[0]?.text ?? '';
  if (!rawText) {
    console.error('ERROR: Anthropic API response contained no text content.');
    console.error('Full response:', JSON.stringify(apiData, null, 2));
    process.exit(1);
  }

  // Extract JSON array from the response (strip any accidental markdown code fences)
  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('ERROR: Could not find a JSON array in Claude response.');
    console.error('Response text:', rawText);
    process.exit(1);
  }

  let stories;
  try {
    stories = JSON.parse(jsonMatch[0]);
  } catch (jsonError) {
    console.error('ERROR: Failed to parse stories JSON:', jsonError.message);
    console.error('Raw JSON string:', jsonMatch[0]);
    process.exit(1);
  }

  if (!Array.isArray(stories) || stories.length === 0) {
    console.error('ERROR: Parsed stories is not a non-empty array.');
    process.exit(1);
  }

  // ── Attach a curated Unsplash image per category ──
  const IMAGES = {
    property: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1570129477492-1f17d3f82f33?w=800&q=80&fit=crop&auto=format',
    ],
    labor: [
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&fit=crop&auto=format',
    ],
    consumer: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&fit=crop&auto=format',
    ],
    criminal: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1532938911079-1346d177168a?w=800&q=80&fit=crop&auto=format',
    ],
    family: [
      'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=800&q=80&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1516534669431-49b2d45f6610?w=800&q=80&fit=crop&auto=format',
    ],
    contract: [
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&fit=crop&auto=format',
    ],
  };

  const usedImages = new Set();
  const enrichedStories = stories.map((s) => {
    const en = (s.category_en || 'criminal').toLowerCase();
    const pool = IMAGES[en] || IMAGES.criminal;
    // Pick first unused image; wrap around if all used
    const img = pool.find((u) => !usedImages.has(u)) || pool[0];
    usedImages.add(img);
    return { ...s, image_url: s.image_url || img };
  });

  const output = {
    updated: today,
    updated_th: getTodayThai(),
    stories: enrichedStories,
  };

  const outputPath = join(ROOT, 'news-data.json');
  try {
    writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  } catch (writeError) {
    console.error('ERROR: Failed to write news-data.json:', writeError.message);
    process.exit(1);
  }

  console.log(`SUCCESS: Wrote ${stories.length} stories to news-data.json`);
  console.log(`Date: ${today} (${output.updated_th})`);
}
