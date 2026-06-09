#!/usr/bin/env node

/**
 * Daily Legal News Generator for Lawyer Near Me (ทนายใกล้ฉัน)
 * 1. Fetches real trending headlines from Thai news RSS feeds
 * 2. Passes them to Claude to pick the most viral + create legal drama angles
 * 3. Writes output to news-data.json and news-archive.json
 */

const { writeFileSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');
const ROOT = join(__dirname, '..');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set.');
  process.exit(1);
}

async function main() { await generateNews(); }
main().catch(e => { console.error(e); process.exit(1); });

function getTodayISO() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' });
}

function getTodayThai() {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];
  const bkk = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const [y, m, d] = bkk.split('-');
  return `${parseInt(d)} ${thaiMonths[parseInt(m) - 1]} ${parseInt(y) + 543}`;
}

// ── Generic JSON fetch with timeout ──
async function fetchJSON(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ── Fetch Wikimedia Commons image URL by category ──
const WIKIMEDIA_KEYWORDS = {
  criminal:  'Thailand police court arrest handcuffs',
  labor:     'Thailand workers factory employment protest',
  property:  'Thailand house Bangkok real estate building',
  family:    'Thailand family children couple',
  consumer:  'online shopping fraud scam consumer',
  contract:  'business contract signing document pen',
};

async function fetchWikimediaImage(category_en) {
  const keywords = WIKIMEDIA_KEYWORDS[category_en] || 'Thailand court law justice';
  const searchData = await fetchJSON(
    `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keywords)}&srnamespace=6&srlimit=10&format=json&origin=*`
  );
  if (!searchData) return null;

  const hit = (searchData?.query?.search || []).find(h => /\.(jpg|jpeg|png)$/i.test(h.title));
  if (!hit) return null;

  const infoData = await fetchJSON(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(hit.title)}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*`
  );
  if (!infoData) return null;

  const pages = Object.values(infoData?.query?.pages || {});
  const thumbUrl = pages[0]?.imageinfo?.[0]?.thumburl;
  console.log(`  Wikimedia image (${category_en}): ${thumbUrl ? 'found' : 'not found'}`);
  return thumbUrl || null;
}

// ── Fetch RSS with timeout ──
async function fetchRSS(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ── Parse <title> from RSS XML (handles CDATA and plain) ──
function parseTitles(xml) {
  if (!xml) return [];
  const titles = [];
  // Match both CDATA and plain titles inside <item>
  const itemRegex = /<item[\s\S]*?<\/item>/g;
  let item;
  while ((item = itemRegex.exec(xml)) !== null) {
    const cdata = item[0].match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/);
    const plain = item[0].match(/<title>([\s\S]*?)<\/title>/);
    const title = (cdata?.[1] || plain?.[1] || '').trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (title && title.length > 5) titles.push(title);
  }
  return titles;
}

// ── Fetch trending headlines from Thai news sites ──
async function fetchTrendingHeadlines() {
  const sources = [
    { name: 'ไทยรัฐ',  url: 'https://www.thairath.co.th/rss/news.xml' },
    { name: 'ข่าวสด',  url: 'https://www.khaosod.co.th/feed' },
    { name: 'มติชน',   url: 'https://www.matichon.co.th/feed' },
  ];

  console.log('Fetching trending headlines from Thai news RSS...');
  const results = await Promise.all(sources.map(async (s) => {
    const xml = await fetchRSS(s.url);
    const titles = parseTitles(xml).slice(0, 15);
    console.log(`  ${s.name}: ${titles.length} headlines`);
    return { source: s.name, titles };
  }));

  const all = results.flatMap(r => r.titles.map(t => `[${r.source}] ${t}`));
  console.log(`Total headlines fetched: ${all.length}`);
  return all;
}

async function generateNews() {
  const today = getTodayISO();

  // Step 1: Get real trending news
  const headlines = await fetchTrendingHeadlines();

  // Step 2: Build prompt — inject real headlines as context
  const headlineSection = headlines.length > 0
    ? `\n\nข่าวกระแสจริงจากสื่อไทยวันนี้ (${today}):\n${headlines.slice(0, 40).map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n`
    : '\n\n(ไม่สามารถดึงข่าวจริงได้วันนี้ — ให้สร้างจากสถานการณ์ที่เป็นกระแสในสังคมไทยปัจจุบัน)\n\n';

  const prompt = `คุณคือผู้เชี่ยวชาญด้านการสร้าง viral content กฎหมายสำหรับ Facebook ไทย${headlineSection}จากข่าวกระแสข้างต้น ให้ทำดังนี้:

1. คัดเลือกข่าวที่มีศักยภาพ viral สูงสุด 2 เรื่อง (ดราม่า, ขัดแย้ง, คนทั่วไปเจอได้, มีมิติทางกฎหมาย)
2. สร้าง angle กฎหมายที่ทำให้คนอยากแชร์ต่อและอยากปรึกษาทนาย
3. สร้างข่าวกฎหมายทั่วไป 1 เรื่องจากกระแสที่น่าสนใจที่สุด

ถ้าข่าวที่ดึงมาไม่มีมิติกฎหมาย ให้ใช้กระแสนั้นเป็น "แรงบันดาลใจ" และสร้างสถานการณ์ที่เกี่ยวข้องซึ่งคนทั่วไปอาจเจอได้จริง

เรื่องที่ 1 และ 2 — ข่าวดราม่า (Facebook):
- หัวข่าวต้องสะเทือนอารมณ์ อ่านแล้วอยากแชร์ทันที
- เนื้อหามีความขัดแย้งชัดเจน (ผู้เสียหาย vs ผู้กระทำ)
- emotional hook — โกรธ, กลัว, หรืออยากช่วยเหลือ
- ต้องผูกกับกระแสที่คนกำลังพูดถึงในสังคมตอนนี้

เรื่องที่ 3 — ข่าวกฎหมายทั่วไป (เว็บไซต์):
- ข่าวที่ให้ความรู้ มีประโยชน์ ไม่จำเป็นต้องดราม่า

ทุกเรื่องต้องมี field:
- category: ประเภทคดี เช่น "คดีแรงงาน", "อสังหาริมทรัพย์", "ผู้บริโภค", "ครอบครัว", "สัญญาธุรกิจ", "คดีอาญา"
- category_en: English slug (labor, property, consumer, family, contract, criminal)
- title: หัวข่าวภาษาไทย กระชับ ดึงดูด ไม่เกิน 80 ตัวอักษร
- what_happened: เกิดอะไรขึ้น 2-3 ประโยค
- impact: กระทบอย่างไร 1-2 ประโยค
- action: ควรทำอะไร 1-2 ประโยค
- practice_area: สาขากฎหมาย เช่น "Civil / Labor Law"
- urgency: "high" | "medium" | "low"
- trending_angle: อธิบายสั้นๆ ว่าโยงกับกระแสอะไรในสังคมตอนนี้ (1 ประโยค)

เฉพาะเรื่องที่ 1 และ 2 เพิ่ม:
- drama_hook: ประโยคเปิดดราม่า 1 ประโยค ให้คนหยุดอ่านบน Facebook
- hashtags: array hashtag ภาษาไทย 4-5 อัน

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
        messages: [{ role: 'user', content: prompt }],
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

  // ── Attach Unsplash images per category ──
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

  console.log('Fetching images from Wikimedia Commons...');
  const usedImages = new Set();
  const enrichedStories = await Promise.all(stories.map(async (s) => {
    const en = (s.category_en || 'criminal').toLowerCase();
    let imageUrl = s.image_url;
    if (!imageUrl) {
      imageUrl = await fetchWikimediaImage(en);
    }
    if (!imageUrl) {
      const pool = IMAGES[en] || IMAGES.criminal;
      imageUrl = pool.find((u) => !usedImages.has(u)) || pool[0];
      usedImages.add(imageUrl);
    }
    return {
      ...s,
      image_url: imageUrl,
      article_url: 'https://lawyernearme.in.th/news.html',
    };
  }));

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

  // ── Update news-archive.json (keep last 30 days) ──
  const archivePath = join(ROOT, 'news-archive.json');
  let archive = [];
  if (existsSync(archivePath)) {
    try {
      archive = JSON.parse(readFileSync(archivePath, 'utf-8'));
    } catch (_) {
      archive = [];
    }
  }
  archive = archive.filter((entry) => entry.date !== today);
  archive = [{ date: today, date_th: output.updated_th, stories: enrichedStories }, ...archive].slice(0, 30);
  try {
    writeFileSync(archivePath, JSON.stringify(archive, null, 2), 'utf-8');
  } catch (writeError) {
    console.error('ERROR: Failed to write news-archive.json:', writeError.message);
    process.exit(1);
  }

  console.log(`SUCCESS: Wrote ${stories.length} stories to news-data.json`);
  console.log(`Archive: ${archive.length} days stored in news-archive.json`);
  console.log(`Date: ${today} (${output.updated_th})`);
}
