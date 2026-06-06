#!/usr/bin/env node

/**
 * Facebook Auto-Poster for ทนายใกล้ฉัน
 * Posts one drama news story to the Facebook Page.
 *
 * Usage:
 *   node scripts/post-to-facebook.js 0   ← รอบเช้า (story index 0)
 *   node scripts/post-to-facebook.js 1   ← รอบเย็น (story index 1)
 *
 * Required env vars:
 *   FB_PAGE_ID           — Facebook Page ID (numeric)
 *   FB_PAGE_ACCESS_TOKEN — Long-lived Page Access Token
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const ROOT = join(__dirname, '..');

const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

if (!FB_PAGE_ID || !FB_PAGE_ACCESS_TOKEN) {
  console.error('ERROR: FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN must be set.');
  process.exit(1);
}

const storyIndex = parseInt(process.argv[2] ?? '0', 10);
if (isNaN(storyIndex) || storyIndex < 0) {
  console.error('ERROR: Pass story index as first argument (0 or 1).');
  process.exit(1);
}

async function main() {
  // ── Load news data ──────────────────────────────────────────────────────────
  let newsData;
  try {
    const raw = readFileSync(join(ROOT, 'news-data.json'), 'utf-8');
    newsData = JSON.parse(raw);
  } catch (e) {
    console.error('ERROR: Cannot read news-data.json:', e.message);
    process.exit(1);
  }

  const story = newsData.stories?.[storyIndex];
  if (!story) {
    console.error(`ERROR: No story at index ${storyIndex}. Available: ${newsData.stories?.length ?? 0} stories.`);
    process.exit(1);
  }

  // ── Format Facebook post ────────────────────────────────────────────────────
  const urgencyEmoji = { high: '🚨', medium: '⚠️', low: '📌' };
  const emoji = urgencyEmoji[story.urgency] || '⚖️';

  const hashtags = Array.isArray(story.hashtags)
    ? story.hashtags.join(' ')
    : '#กฎหมาย #สิทธิของคุณ #ทนายใกล้ฉัน';

  const postText = [
    `${emoji} ${story.title}`,
    '',
    `${story.drama_hook}`,
    '',
    `📌 เกิดอะไรขึ้น?`,
    story.what_happened,
    '',
    `💡 กระทบกับคุณอย่างไร?`,
    story.impact,
    '',
    `✅ ควรทำอะไร?`,
    story.action,
    '',
    `─────────────────────`,
    `🔍 มีปัญหากฎหมายคล้ายกันนี้ไหม?`,
    `ปรึกษาทนายในพื้นที่ของคุณได้ฟรี ที่ lawyernearme.in.th`,
    '',
    hashtags,
    '#ทนายใกล้ฉัน #LawyerNearMe',
  ].join('\n');

  console.log('--- POST PREVIEW ---');
  console.log(postText);
  console.log('--------------------');

  // ── Post to Facebook ────────────────────────────────────────────────────────
  const url = `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/feed`;
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: postText,
        access_token: FB_PAGE_ACCESS_TOKEN,
      }),
    });
  } catch (networkErr) {
    console.error('ERROR: Network request to Facebook API failed:', networkErr.message);
    process.exit(1);
  }

  const data = await res.json();

  if (!res.ok || data.error) {
    console.error(`ERROR: Facebook API returned HTTP ${res.status}:`, JSON.stringify(data));
    process.exit(1);
  }

  console.log(`SUCCESS: Posted story[${storyIndex}] → post ID: ${data.id}`);
  console.log(`Story: ${story.title}`);
}

main().catch(e => { console.error(e); process.exit(1); });
