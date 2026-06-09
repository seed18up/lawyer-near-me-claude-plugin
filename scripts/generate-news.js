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

// ── Cloudinary: branded Thai headline image per story ──
const CLOUDINARY_CLOUD = 'de50nluyy';
const BG_POOLS = {
  criminal: ['legal-bg-criminal', 'legal-bg-criminal-2', 'legal-bg-criminal-3', 'legal-bg-criminal-4'],
  labor:    ['legal-bg-labor', 'legal-bg-labor-2', 'legal-bg-labor-3', 'legal-bg-labor-4', 'legal-bg-labor-5'],
  property: ['legal-bg-property', 'legal-bg-property-2', 'legal-bg-property-3', 'legal-bg-property-4'],
  family:   ['legal-bg-family', 'legal-bg-family-2', 'legal-bg-family-3', 'legal-bg-family-4'],
  consumer: ['legal-bg-consumer', 'legal-bg-consumer-2', 'legal-bg-consumer-3', 'legal-bg-consumer-4', 'legal-bg-consumer-5'],
  contract: ['legal-bg-contract', 'legal-bg-contract-2', 'legal-bg-contract-3', 'legal-bg-contract-4'],
};

function buildCloudinaryImageUrl(title, categoryEn) {
  const pool = BG_POOLS[categoryEn] || BG_POOLS.criminal;
  const bg   = pool[Math.floor(Math.random() * pool.length)];
  const display = title.length > 55 ? title.slice(0, 54) + '…' : title;
  const encoded = encodeURIComponent(encodeURIComponent(display));
  return [
    `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload`,
    'w_1200,h_630,c_fill,g_auto,q_auto:good',
    'e_brightness:-30',
    `l_text:Sarabun_52_bold:${encoded},co_white,g_south_west,x_60,y_80,w_1080,c_fit,e_shadow:40`,
    bg,
  ].join('/');
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

  // ── Build Cloudinary branded image per story ──
  console.log('Building Cloudinary image URLs...');
  const enrichedStories = stories.map((s) => {
    const en = (s.category_en || 'criminal').toLowerCase();
    return {
      ...s,
      image_url: buildCloudinaryImageUrl(s.title, en),
      article_url: 'https://lawyernearme.in.th/news.html',
    };
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
