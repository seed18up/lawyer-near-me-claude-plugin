# GitHub Pages Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้าง `index.html` ไฟล์เดียวที่ root ของ repo สำหรับ GitHub Pages เพื่ออธิบาย Lawyer Near Me Claude Code Plugin ให้ developer และ stakeholder

**Architecture:** Single static HTML file, no framework. Tabbed layout ด้วย vanilla JS tab switching. CSS ใช้ custom properties (variables) สำหรับ brand colors. ทุกอย่างอยู่ใน `index.html` ไฟล์เดียว — ไม่มี external CSS/JS files.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox, grid), Vanilla JavaScript, Google Fonts (Sarabun), GitHub Pages (static hosting)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `index.html` | Create | หน้าเว็บทั้งหมด — structure, styles, scripts |

---

### Task 1: Base HTML Skeleton + Navbar + CSS Variables + Footer

**Files:**
- Create: `index.html`

- [ ] **Step 1: สร้าง index.html ด้วย base structure**

สร้างไฟล์ `index.html` ที่ root ของ repo (ระดับเดียวกับ `.claude/`):

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lawyer Near Me — Claude Code Plugin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --navy: #1B3A8B;
      --navy-dark: #132c6e;
      --navy-light: #e8edf8;
      --red: #B71C1C;
      --red-light: #fdecea;
      --white: #ffffff;
      --gray-bg: #f4f6fb;
      --gray-border: #e2e8f0;
      --text-main: #1a1a2e;
      --text-muted: #64748b;
      --font: 'Sarabun', sans-serif;
    }

    body {
      font-family: var(--font);
      background: var(--gray-bg);
      color: var(--text-main);
      line-height: 1.6;
    }

    /* ── NAVBAR ── */
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 56px;
      background: var(--white);
      border-bottom: 2px solid var(--navy-light);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(27,58,139,0.08);
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 17px;
      font-weight: 800;
      color: var(--navy);
      text-decoration: none;
    }

    .navbar-brand span { font-size: 22px; }

    .navbar-github {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--navy);
      color: var(--white);
      text-decoration: none;
      padding: 7px 18px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.2s;
    }

    .navbar-github:hover { background: var(--navy-dark); }

    /* ── FOOTER ── */
    footer {
      background: var(--navy);
      color: rgba(255,255,255,0.75);
      text-align: center;
      padding: 28px 32px;
      font-size: 14px;
      line-height: 2;
      margin-top: 48px;
    }

    footer a { color: rgba(255,255,255,0.9); text-decoration: underline; }
    footer strong { color: var(--white); }
  </style>
</head>
<body>

  <!-- NAVBAR -->
  <nav class="navbar">
    <a class="navbar-brand" href="#">
      <span>⚖️</span> Lawyer Near Me Plugin
    </a>
    <a class="navbar-github" href="https://github.com/seed18up/lawyer-near-me-claude-plugin" target="_blank">
      ⭐ ดูบน GitHub
    </a>
  </nav>

  <!-- MAIN CONTENT placeholder (Tasks 2-6 เพิ่มตรงนี้) -->
  <main style="margin-top:56px; padding: 40px 32px;">
    <p style="color:var(--text-muted)">กำลังสร้าง...</p>
  </main>

  <!-- FOOTER -->
  <footer>
    <strong>Lawyer Near Me Claude Code Plugin</strong><br>
    MIT License ·
    <a href="https://github.com/seed18up/lawyer-near-me-claude-plugin" target="_blank">seed18up/lawyer-near-me-claude-plugin</a><br>
    สร้างด้วย <strong>Claude Code</strong> · 2026
  </footer>

</body>
</html>
```

- [ ] **Step 2: เปิดไฟล์ใน browser ตรวจสอบ**

เปิด `index.html` ใน browser โดยตรง (double-click หรือ `open index.html`)

Expected: เห็น navbar สีขาวด้านบน, footer สีน้ำเงินด้านล่าง, ข้อความ "กำลังสร้าง..."

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add base HTML structure, navbar, footer"
```

---

### Task 2: Hero Section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: แทนที่ `<main>` placeholder ด้วย Hero section**

แทนที่ `<main style="margin-top:56px; padding: 40px 32px;">` ทั้งบล็อก (ถึง `</main>`) ด้วย:

```html
  <!-- HERO -->
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-badge">Claude Code Plugin</div>
      <h1 class="hero-title">Claude Code Plugin<br>สำหรับแพลตฟอร์มกฎหมายไทย</h1>
      <p class="hero-subtitle">
        เพิ่ม AI Agents, Slash Commands, และ Hooks อัตโนมัติให้กับ Claude Code<br>
        ออกแบบเฉพาะสำหรับ <strong>Lawyer Near Me</strong> — แพลตฟอร์มเชื่อมผู้ใช้กับทนายความในพื้นที่
      </p>
      <div class="hero-ctas">
        <a class="btn-primary" href="#install" onclick="switchTab('install');return false;">⬇ ติดตั้งทันที</a>
        <a class="btn-outline" href="https://github.com/seed18up/lawyer-near-me-claude-plugin" target="_blank">ดูบน GitHub →</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><span class="stat-num">7</span><span class="stat-label">AI Agents</span></div>
        <div class="stat-sep">·</div>
        <div class="stat"><span class="stat-num">10</span><span class="stat-label">Slash Commands</span></div>
        <div class="stat-sep">·</div>
        <div class="stat"><span class="stat-num">3</span><span class="stat-label">Hook Types</span></div>
      </div>
    </div>
  </section>

  <!-- TAB AREA placeholder (Task 3) -->
  <div id="tab-area"></div>
```

- [ ] **Step 2: เพิ่ม CSS สำหรับ Hero ใน `<style>` (ก่อน `</style>`)**

```css
    /* ── HERO ── */
    .hero {
      margin-top: 56px;
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 60%, #0d1f5c 100%);
      color: var(--white);
      padding: 72px 32px 56px;
      text-align: center;
    }

    .hero-inner { max-width: 760px; margin: 0 auto; }

    .hero-badge {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      color: var(--white);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 5px 16px;
      border-radius: 20px;
      margin-bottom: 20px;
    }

    .hero-title {
      font-size: 42px;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 18px;
    }

    .hero-subtitle {
      font-size: 18px;
      line-height: 1.7;
      color: rgba(255,255,255,0.82);
      margin-bottom: 32px;
    }

    .hero-subtitle strong { color: var(--white); }

    .hero-ctas { display: flex; gap: 14px; justify-content: center; margin-bottom: 40px; flex-wrap: wrap; }

    .btn-primary {
      background: var(--red);
      color: var(--white);
      padding: 13px 28px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.2s, transform 0.1s;
    }

    .btn-primary:hover { background: #9b1616; transform: translateY(-1px); }

    .btn-outline {
      background: transparent;
      color: var(--white);
      border: 2px solid rgba(255,255,255,0.6);
      padding: 13px 28px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: border-color 0.2s, background 0.2s;
    }

    .btn-outline:hover { border-color: var(--white); background: rgba(255,255,255,0.08); }

    .hero-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 16px 32px;
      display: inline-flex;
    }

    .stat { text-align: center; }
    .stat-num { display: block; font-size: 32px; font-weight: 800; line-height: 1; }
    .stat-label { font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 500; }
    .stat-sep { font-size: 24px; color: rgba(255,255,255,0.3); }
```

- [ ] **Step 3: เปิด browser ตรวจสอบ**

Expected: Hero section สีน้ำเงิน gradient, headline ใหญ่, ปุ่มแดง + ปุ่ม outline, stat badges แสดง 7 · 10 · 3

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add hero section with CTAs and stat badges"
```

---

### Task 3: Tab Bar + JavaScript Tab Switching

**Files:**
- Modify: `index.html`

- [ ] **Step 1: แทนที่ `<div id="tab-area"></div>` ด้วย Tab Bar + Tab Content wrapper**

```html
  <!-- TAB BAR -->
  <div class="tab-bar-wrap">
    <div class="tab-bar">
      <button class="tab-btn active" onclick="switchTab('overview')" id="btn-overview">ภาพรวม</button>
      <button class="tab-btn" onclick="switchTab('agents')" id="btn-agents">Agents</button>
      <button class="tab-btn" onclick="switchTab('commands')" id="btn-commands">Commands</button>
      <button class="tab-btn" onclick="switchTab('install')" id="btn-install">ติดตั้ง</button>
    </div>
  </div>

  <!-- TAB CONTENTS -->
  <div class="tab-content-wrap">
    <div id="tab-overview" class="tab-panel active"><!-- Task 4 --></div>
    <div id="tab-agents"   class="tab-panel"><!-- Task 5 --></div>
    <div id="tab-commands" class="tab-panel"><!-- Task 6 --></div>
    <div id="tab-install"  class="tab-panel"><!-- Task 7 --></div>
  </div>
```

- [ ] **Step 2: เพิ่ม CSS สำหรับ Tab Bar ใน `<style>`**

```css
    /* ── TAB BAR ── */
    .tab-bar-wrap {
      position: sticky;
      top: 56px;
      z-index: 90;
      background: var(--white);
      border-bottom: 2px solid var(--gray-border);
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .tab-bar {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      gap: 0;
      padding: 0 24px;
    }

    .tab-btn {
      background: none;
      border: none;
      padding: 16px 28px;
      font-family: var(--font);
      font-size: 15px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: color 0.15s, border-color 0.15s;
    }

    .tab-btn:hover { color: var(--navy); }
    .tab-btn.active { color: var(--navy); border-bottom-color: var(--navy); }

    /* ── TAB PANELS ── */
    .tab-content-wrap { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
    .tab-panel { display: none; }
    .tab-panel.active { display: block; }
```

- [ ] **Step 3: เพิ่ม JavaScript ก่อน `</body>`**

```html
  <script>
    function switchTab(id) {
      // deactivate all
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      // activate selected
      document.getElementById('tab-' + id).classList.add('active');
      document.getElementById('btn-' + id).classList.add('active');
      // scroll tab bar into view
      document.querySelector('.tab-bar-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function copyCode(btnEl, codeId) {
      const text = document.getElementById(codeId).textContent;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btnEl.textContent;
        btnEl.textContent = '✓ คัดลอกแล้ว';
        setTimeout(() => { btnEl.textContent = orig; }, 2000);
      });
    }
  </script>
```

- [ ] **Step 4: เปิด browser ตรวจสอบ**

Expected: เห็น tab bar ใต้ hero, 4 tabs, tab "ภาพรวม" ขีดเส้นน้ำเงินด้านล่าง, คลิก tab อื่นแล้ว active state เปลี่ยน

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add tab bar and JS tab switching"
```

---

### Task 4: Tab Content — ภาพรวม

**Files:**
- Modify: `index.html`

- [ ] **Step 1: แทนที่ `<!-- Task 4 -->` ใน `#tab-overview` ด้วย**

```html
      <h2 class="section-title">Plugin นี้ทำอะไรได้บ้าง?</h2>
      <p class="section-sub">เพิ่มความสามารถ 3 ด้านให้กับ Claude Code สำหรับแพลตฟอร์มกฎหมาย</p>

      <div class="feature-grid">
        <div class="feature-card navy">
          <div class="feature-icon">⚖️</div>
          <h3>Legal AI Team</h3>
          <p>3 agents ฝั่ง Legal Advisory — Legal Advisor, Compliance Officer, Contract Specialist ทำงานร่วมกันตรวจสอบ compliance, ร่างสัญญา, และให้ Legal Opinion อย่างเป็นทางการ</p>
        </div>
        <div class="feature-card red">
          <div class="feature-icon">📣</div>
          <h3>Marketing AI Team</h3>
          <p>4 agents ฝั่ง Marketing — Director, Content Creator, SEO Specialist, Social Media Manager ร่วมกันสร้าง content กฎหมายที่ถูกต้องและ optimize สำหรับ search</p>
        </div>
        <div class="feature-card gray">
          <div class="feature-icon">🤖</div>
          <h3>Automation Hooks</h3>
          <p>3 hook types ทำงานอัตโนมัติ — แจ้งเตือนเมื่อแก้ไขไฟล์กฎหมาย, บันทึก research insights, และแสดง checklist ท้าย session</p>
        </div>
      </div>

      <h2 class="section-title" style="margin-top:48px;">Hook Types ที่มี</h2>
      <div class="hook-list">
        <div class="hook-item">
          <span class="hook-badge pre">PreToolUse</span>
          <div>
            <strong>ก่อนใช้ tool</strong>
            <p>แจ้งเตือนเมื่อแก้ไขไฟล์ที่ชื่อมีคำว่า legal, contract, terms, privacy, compliance — เพื่อให้ Legal Team ตรวจสอบก่อน</p>
          </div>
        </div>
        <div class="hook-item">
          <span class="hook-badge post">PostToolUse</span>
          <div>
            <strong>หลังใช้ tool</strong>
            <p>แจ้งเตือนเมื่อสร้างหรือแก้ไข marketing assets และ legal documents — พร้อม PDPA compliance reminder</p>
          </div>
        </div>
        <div class="hook-item">
          <span class="hook-badge stop">Stop</span>
          <div>
            <strong>ท้าย session</strong>
            <p>แสดง team checklist — Marketing ส่ง content ให้ Legal review, Legal ยืนยัน compliance ก่อน publish</p>
          </div>
        </div>
      </div>
```

- [ ] **Step 2: เพิ่ม CSS**

```css
    /* ── SECTION COMMON ── */
    .section-title { font-size: 26px; font-weight: 800; color: var(--navy); margin-bottom: 8px; }
    .section-sub { color: var(--text-muted); font-size: 15px; margin-bottom: 28px; }

    /* ── FEATURE CARDS ── */
    .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

    @media (max-width: 700px) { .feature-grid { grid-template-columns: 1fr; } }

    .feature-card {
      background: var(--white);
      border-radius: 12px;
      padding: 28px 24px;
      border-top: 4px solid transparent;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .feature-card.navy { border-top-color: var(--navy); }
    .feature-card.red  { border-top-color: var(--red); }
    .feature-card.gray { border-top-color: #94a3b8; }

    .feature-icon { font-size: 32px; margin-bottom: 12px; }
    .feature-card h3 { font-size: 17px; font-weight: 700; margin-bottom: 10px; color: var(--text-main); }
    .feature-card p  { font-size: 14px; color: var(--text-muted); line-height: 1.7; }

    /* ── HOOKS ── */
    .hook-list { display: flex; flex-direction: column; gap: 16px; }

    .hook-item {
      background: var(--white);
      border-radius: 10px;
      padding: 20px 24px;
      display: flex;
      align-items: flex-start;
      gap: 20px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.05);
    }

    .hook-badge {
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      padding: 4px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .hook-badge.pre  { background: var(--navy-light); color: var(--navy); }
    .hook-badge.post { background: #e8f5e9; color: #2e7d32; }
    .hook-badge.stop { background: var(--red-light); color: var(--red); }

    .hook-item strong { font-size: 15px; font-weight: 700; display: block; margin-bottom: 4px; }
    .hook-item p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin: 0; }
```

- [ ] **Step 3: ตรวจสอบใน browser**

Expected: เห็น 3 feature cards (navy/red/gray top border), ตามด้วย hook list 3 รายการพร้อม badge สี

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add overview tab with feature cards and hook list"
```

---

### Task 5: Tab Content — Agents

**Files:**
- Modify: `index.html`

- [ ] **Step 1: แทนที่ `<!-- Task 5 -->` ใน `#tab-agents` ด้วย**

```html
      <h2 class="section-title">7 AI Agents</h2>
      <p class="section-sub">แต่ละ agent มี persona, ความเชี่ยวชาญ, และขอบเขตการทำงานที่ชัดเจน</p>

      <h3 class="team-label navy">⚖️ Legal Advisory Team</h3>
      <div class="agent-grid">
        <div class="agent-card navy">
          <div class="agent-header">
            <span class="agent-avatar">👩‍⚖️</span>
            <div>
              <div class="agent-name">ดร.วรรณา สิทธิชัย</div>
              <div class="agent-role">Legal Advisor (Chief)</div>
            </div>
          </div>
          <p class="agent-desc">ผู้มีอำนาจสูงสุดด้านกฎหมาย — review content, ออก Legal Opinion, approve เอกสารทุกฉบับ เชี่ยวชาญ PDPA, Tech Law, สภาทนายความ</p>
          <div class="agent-cmd"><code>legal-advisor</code></div>
        </div>
        <div class="agent-card navy">
          <div class="agent-header">
            <span class="agent-avatar">🛡️</span>
            <div>
              <div class="agent-name">คุณสิทธิศักดิ์ พงษ์ไพบูลย์</div>
              <div class="agent-role">Compliance Officer</div>
            </div>
          </div>
          <p class="agent-desc">ดูแล PDPA compliance, ตรวจสอบใบอนุญาตทนาย, จัดการ data subject requests, บันทึกเชิง regulatory รายวัน</p>
          <div class="agent-cmd"><code>compliance-officer</code></div>
        </div>
        <div class="agent-card navy">
          <div class="agent-header">
            <span class="agent-avatar">📋</span>
            <div>
              <div class="agent-name">คุณภัทรพงษ์ อารีย์วงศ์</div>
              <div class="agent-role">Contract Specialist</div>
            </div>
          </div>
          <p class="agent-desc">ร่าง, ตรวจสอบ, และเจรจาสัญญา — partnership agreements, vendor contracts, ToS, NDAs, employment agreements</p>
          <div class="agent-cmd"><code>contract-specialist</code></div>
        </div>
      </div>

      <h3 class="team-label red" style="margin-top:36px;">📣 Marketing Team</h3>
      <div class="agent-grid">
        <div class="agent-card red">
          <div class="agent-header">
            <span class="agent-avatar">🎯</span>
            <div>
              <div class="agent-name">คุณพิชัย วงศ์สุวรรณ</div>
              <div class="agent-role">Marketing Director</div>
            </div>
          </div>
          <p class="agent-desc">CMO — ตัดสินใจเชิงกลยุทธ์, อนุมัติ campaigns, จัดสรร budget, ประสานงาน cross-team ประสบการณ์ 15 ปี digital marketing</p>
          <div class="agent-cmd"><code>marketing-director</code></div>
        </div>
        <div class="agent-card red">
          <div class="agent-header">
            <span class="agent-avatar">✍️</span>
            <div>
              <div class="agent-name">คุณมินตรา ชัยศรี</div>
              <div class="agent-role">Content Creator</div>
            </div>
          </div>
          <p class="agent-desc">สร้าง legal content ที่เข้าใจง่าย — บทความ, social posts, email campaigns, video scripts พื้นฐานนิติศาสตร์ + communication arts</p>
          <div class="agent-cmd"><code>content-creator</code></div>
        </div>
        <div class="agent-card red">
          <div class="agent-header">
            <span class="agent-avatar">🔍</span>
            <div>
              <div class="agent-name">คุณธนวัฒน์ ศรีสมบูรณ์</div>
              <div class="agent-role">SEO Specialist</div>
            </div>
          </div>
          <p class="agent-desc">SEO สำหรับ legal industry ไทย — keyword research, local SEO, technical audit, content optimization เชี่ยวชาญ "near me" search</p>
          <div class="agent-cmd"><code>seo-specialist</code></div>
        </div>
        <div class="agent-card red">
          <div class="agent-header">
            <span class="agent-avatar">📱</span>
            <div>
              <div class="agent-name">คุณแพรวพิมล รัตนกุล</div>
              <div class="agent-role">Social Media Manager</div>
            </div>
          </div>
          <p class="agent-desc">จัดการ social media รายวัน — posts, community responses, influencer, campaigns ผู้เชี่ยวชาญ algorithm และ viral content ภาษาไทย</p>
          <div class="agent-cmd"><code>social-media-manager</code></div>
        </div>
      </div>
```

- [ ] **Step 2: เพิ่ม CSS**

```css
    /* ── AGENTS ── */
    .team-label {
      font-size: 16px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 16px;
    }
    .team-label.navy { color: var(--navy); }
    .team-label.red  { color: var(--red); }

    .agent-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 700px) { .agent-grid { grid-template-columns: 1fr; } }

    .agent-card {
      background: var(--white);
      border-radius: 12px;
      padding: 20px;
      border-left: 4px solid transparent;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    }
    .agent-card.navy { border-left-color: var(--navy); }
    .agent-card.red  { border-left-color: var(--red); }

    .agent-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .agent-avatar { font-size: 28px; }
    .agent-name { font-size: 14px; font-weight: 700; color: var(--text-main); }
    .agent-role { font-size: 12px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }
    .agent-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px; }
    .agent-cmd code {
      font-size: 12px;
      background: var(--gray-bg);
      padding: 3px 10px;
      border-radius: 4px;
      color: var(--navy);
      font-family: monospace;
      font-weight: 600;
    }
```

- [ ] **Step 3: ตรวจสอบใน browser — คลิก tab "Agents"**

Expected: 2 sections แบ่ง Legal (3 cards border น้ำเงิน) และ Marketing (4 cards border แดง), agent grid responsive

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add agents tab with all 7 agent cards"
```

---

### Task 6: Tab Content — Commands

**Files:**
- Modify: `index.html`

- [ ] **Step 1: แทนที่ `<!-- Task 6 -->` ใน `#tab-commands` ด้วย**

```html
      <h2 class="section-title">10 Slash Commands</h2>
      <p class="section-sub">พิมพ์ใน Claude Code ได้ทันที หลัง copy .claude/ folder ไปยัง project</p>

      <!-- Featured command -->
      <div class="cmd-featured">
        <div class="cmd-featured-left">
          <span class="cmd-featured-badge">⭐ FEATURED</span>
          <div class="cmd-featured-name">/legal-news</div>
          <p class="cmd-featured-desc">Pipeline 5 ขั้นตอน — ดึงข่าวกฎหมายไทย real-time, สรุปโดย Content Creator, วิเคราะห์ SEO, ออก Legal Opinion อย่างเป็นทางการ, render HTML + PNG</p>
          <div class="cmd-usage">ใช้งาน: <code>/legal-news</code> หรือ <code>/legal-news แรงงาน</code></div>
        </div>
        <div class="cmd-pipeline">
          <div class="pipe-step">1 GATHER</div>
          <div class="pipe-arrow">→</div>
          <div class="pipe-step">2 CONTENT</div>
          <div class="pipe-arrow">→</div>
          <div class="pipe-step">3 SEO</div>
          <div class="pipe-arrow">→</div>
          <div class="pipe-step">4 LEGAL</div>
          <div class="pipe-arrow">→</div>
          <div class="pipe-step">5 RENDER</div>
        </div>
      </div>

      <!-- Legal commands -->
      <h3 class="team-label navy" style="margin-top:36px; margin-bottom:16px;">⚖️ Legal Commands</h3>
      <div class="cmd-grid">
        <div class="cmd-card">
          <div class="cmd-name">/legal/compliance-check</div>
          <div class="cmd-desc">ตรวจสอบ PDPA compliance, ใบอนุญาตทนาย, และข้อกำหนดทางกฎหมายที่เกี่ยวข้อง</div>
        </div>
        <div class="cmd-card">
          <div class="cmd-name">/legal/contract-analysis</div>
          <div class="cmd-desc">วิเคราะห์และให้ความเห็นบนสัญญา — ความเสี่ยง, ช่องโหว่, และข้อแนะนำ</div>
        </div>
        <div class="cmd-card">
          <div class="cmd-name">/legal/legal-review</div>
          <div class="cmd-desc">Review content ที่มีประเด็นกฎหมายก่อน publish — ตรวจสอบโดย Legal Advisor</div>
        </div>
        <div class="cmd-card">
          <div class="cmd-name">/legal/privacy-policy-review</div>
          <div class="cmd-desc">ตรวจสอบ Privacy Policy ให้สอดคล้อง PDPA และมาตรฐาน international</div>
        </div>
      </div>

      <!-- Marketing commands -->
      <h3 class="team-label red" style="margin-top:36px; margin-bottom:16px;">📣 Marketing Commands</h3>
      <div class="cmd-grid">
        <div class="cmd-card">
          <div class="cmd-name">/marketing/audience-research</div>
          <div class="cmd-desc">วิเคราะห์กลุ่มเป้าหมาย, pain points, และ channel ที่เหมาะสมสำหรับ legal services</div>
        </div>
        <div class="cmd-card">
          <div class="cmd-name">/marketing/campaign-analytics</div>
          <div class="cmd-desc">วิเคราะห์ผล campaign, KPIs, และ insight สำหรับการปรับกลยุทธ์</div>
        </div>
        <div class="cmd-card">
          <div class="cmd-name">/marketing/content-strategy</div>
          <div class="cmd-desc">วางแผน content calendar, pillar topics, และ distribution strategy</div>
        </div>
        <div class="cmd-card">
          <div class="cmd-name">/marketing/seo-audit</div>
          <div class="cmd-desc">ตรวจสอบ SEO ทั้ง on-page, technical, และ local SEO สำหรับตลาดกฎหมายไทย</div>
        </div>
        <div class="cmd-card">
          <div class="cmd-name">/marketing/social-media-campaign</div>
          <div class="cmd-desc">วางแผนและสร้าง social media campaign พร้อม legal compliance check</div>
        </div>
      </div>
```

- [ ] **Step 2: เพิ่ม CSS**

```css
    /* ── COMMANDS ── */
    .cmd-featured {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%);
      color: var(--white);
      border-radius: 14px;
      padding: 28px 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      flex-wrap: wrap;
    }

    .cmd-featured-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 3px 10px;
      border-radius: 12px;
      margin-bottom: 10px;
    }

    .cmd-featured-name {
      font-size: 28px;
      font-weight: 800;
      font-family: monospace;
      margin-bottom: 10px;
    }

    .cmd-featured-desc { font-size: 14px; color: rgba(255,255,255,0.82); line-height: 1.7; max-width: 420px; }
    .cmd-usage { margin-top: 14px; font-size: 13px; color: rgba(255,255,255,0.7); }
    .cmd-usage code { background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 4px; font-family: monospace; }

    .cmd-pipeline {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
      margin-top: 8px;
    }

    .pipe-step {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      font-size: 11px;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }

    .pipe-arrow { color: rgba(255,255,255,0.5); font-size: 14px; }

    .cmd-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    @media (max-width: 600px) { .cmd-grid { grid-template-columns: 1fr; } }

    .cmd-card {
      background: var(--white);
      border-radius: 10px;
      padding: 16px 20px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.05);
      border-left: 3px solid var(--gray-border);
      transition: border-color 0.15s;
    }

    .cmd-card:hover { border-left-color: var(--navy); }

    .cmd-name {
      font-size: 14px;
      font-weight: 700;
      font-family: monospace;
      color: var(--navy);
      margin-bottom: 6px;
    }

    .cmd-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
```

- [ ] **Step 3: ตรวจสอบใน browser — คลิก tab "Commands"**

Expected: Featured card สีน้ำเงิน dark พร้อม pipeline steps, ตามด้วย 2 grids (Legal/Marketing), hover แล้ว border เปลี่ยน

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add commands tab with featured legal-news and command grid"
```

---

### Task 7: Tab Content — ติดตั้ง + Copy Button

**Files:**
- Modify: `index.html`

- [ ] **Step 1: แทนที่ `<!-- Task 7 -->` ใน `#tab-install` ด้วย**

```html
      <h2 class="section-title">ติดตั้งใน 3 ขั้นตอน</h2>
      <p class="section-sub">ต้องการ: <strong>Claude Code CLI</strong> ติดตั้งแล้ว</p>

      <div class="install-steps">

        <div class="install-step">
          <div class="step-num">1</div>
          <div class="step-body">
            <h3>Clone repo</h3>
            <p>ดาวน์โหลด plugin มายังเครื่อง</p>
            <div class="code-block">
              <pre id="code1">git clone https://github.com/seed18up/lawyer-near-me-claude-plugin.git</pre>
              <button class="copy-btn" onclick="copyCode(this, 'code1')">คัดลอก</button>
            </div>
          </div>
        </div>

        <div class="install-step">
          <div class="step-num">2</div>
          <div class="step-body">
            <h3>Copy .claude/ folder</h3>
            <p>วาง <code>.claude/</code> folder เข้าไปใน root ของ project ที่ต้องการใช้งาน</p>
            <div class="code-block">
              <pre id="code2">cp -r lawyer-near-me-claude-plugin/.claude/ /path/to/your-project/</pre>
              <button class="copy-btn" onclick="copyCode(this, 'code2')">คัดลอก</button>
            </div>
            <p class="step-note">💡 หรือ copy folder <code>.claude/</code> ด้วย File Explorer ไปวางที่ root ของ project</p>
          </div>
        </div>

        <div class="install-step">
          <div class="step-num">3</div>
          <div class="step-body">
            <h3>เปิด Claude Code และลองใช้</h3>
            <p>เปิด Claude Code ใน project directory แล้วรัน command แรก</p>
            <div class="code-block">
              <pre id="code3">/legal-news</pre>
              <button class="copy-btn" onclick="copyCode(this, 'code3')">คัดลอก</button>
            </div>
            <p class="step-note">🎉 Claude Code จะรัน pipeline 5 ขั้น — ดึงข่าว → สรุป → SEO → Legal Opinion → render HTML</p>
          </div>
        </div>

      </div>

      <div class="install-note">
        <strong>หมายเหตุ:</strong> เนื้อหาทั้งหมดที่สร้างโดย plugin นี้เป็นไปเพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย
        ทุก content ที่จะ publish จริงต้องผ่าน Legal Advisor review ก่อน
      </div>
```

- [ ] **Step 2: เพิ่ม CSS**

```css
    /* ── INSTALL ── */
    .install-steps { display: flex; flex-direction: column; gap: 0; }

    .install-step {
      display: flex;
      gap: 24px;
      padding: 28px 0;
      border-bottom: 1px solid var(--gray-border);
    }
    .install-step:last-child { border-bottom: none; }

    .step-num {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      background: var(--navy);
      color: var(--white);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 800;
      margin-top: 2px;
    }

    .step-body { flex: 1; }
    .step-body h3 { font-size: 18px; font-weight: 700; margin-bottom: 6px; color: var(--text-main); }
    .step-body p  { font-size: 14px; color: var(--text-muted); margin-bottom: 12px; }
    .step-body code { background: var(--gray-bg); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; color: var(--navy); }
    .step-note { font-size: 13px; color: var(--text-muted); margin-top: 10px; margin-bottom: 0; }

    .code-block {
      background: #1a1a2e;
      border-radius: 8px;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .code-block pre {
      color: #a8d8a8;
      font-family: monospace;
      font-size: 13px;
      white-space: pre-wrap;
      word-break: break-all;
      margin: 0;
    }

    .copy-btn {
      flex-shrink: 0;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.8);
      font-family: var(--font);
      font-size: 12px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }

    .copy-btn:hover { background: rgba(255,255,255,0.2); }

    .install-note {
      margin-top: 32px;
      background: var(--red-light);
      border-left: 4px solid var(--red);
      border-radius: 8px;
      padding: 16px 20px;
      font-size: 14px;
      color: #7f1d1d;
      line-height: 1.7;
    }
```

- [ ] **Step 3: ตรวจสอบใน browser**

ตรวจสอบ 3 จุด:
1. คลิก tab "ติดตั้ง" — เห็น 3 ขั้นตอนพร้อม step number circle น้ำเงิน
2. คลิก "คัดลอก" — ปุ่มเปลี่ยนเป็น "✓ คัดลอกแล้ว" แล้วกลับมา
3. เนื้อหาใน clipboard ถูกต้อง (วางใน text editor ตรวจสอบ)

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add install tab with 3-step guide and copy buttons"
```

---

### Task 8: Enable GitHub Pages + Push

**Files:**
- ไม่มีไฟล์ใหม่ — ตั้งค่าผ่าน GitHub UI

- [ ] **Step 1: Push commits ทั้งหมดขึ้น GitHub**

```bash
git push origin main
```

Expected output: `Branch 'main' set up to track 'origin/main'` หรือ `Everything up-to-date`

- [ ] **Step 2: เปิดใช้ GitHub Pages**

1. ไปที่ `https://github.com/seed18up/lawyer-near-me-claude-plugin`
2. คลิก **Settings** (แท็บบนสุด)
3. เลือก **Pages** จาก sidebar ซ้าย
4. ที่ **Source** เลือก `Deploy from a branch`
5. Branch: `main`, Folder: `/ (root)`
6. กด **Save**

- [ ] **Step 3: รอ deploy และเปิดหน้าเว็บ**

GitHub Pages ใช้เวลา 1–3 นาที URL จะเป็น:
```
https://seed18up.github.io/lawyer-near-me-claude-plugin/
```

เปิด URL ตรวจสอบครบทุก tab ใน browser จริง

- [ ] **Step 4: เพิ่ม website URL ใน repo description**

1. กลับไปที่ repo หน้าหลัก
2. คลิกไอคอน ⚙️ ข้าง "About"
3. ใส่ URL: `https://seed18up.github.io/lawyer-near-me-claude-plugin/`
4. กด **Save changes**

---

## Self-Review

**Spec coverage check:**
- ✅ Tabbed layout (4 tabs: ภาพรวม, Agents, Commands, ติดตั้ง)
- ✅ Hero with CTAs ([ติดตั้งทันที] + [ดูบน GitHub]) และ stat badges
- ✅ Professional blue/red Thai style ด้วย Sarabun font
- ✅ Pure HTML/CSS/JS — ไม่มี framework
- ✅ 7 agents ครบทุกคน พร้อมชื่อ persona จริง
- ✅ 10 commands ครบ (1 featured + 4 legal + 5 marketing)
- ✅ 3 hook types อธิบายครบ
- ✅ Copy-to-clipboard ใน install tab
- ✅ Footer พร้อม MIT license และ repo link
- ✅ GitHub Pages enable steps

**Placeholder scan:** ไม่มี TBD หรือ TODO — code ทุก step เป็น code จริง

**Type consistency:** `switchTab(id)` และ `copyCode(btnEl, codeId)` ใช้ consistent ทั้ง HTML onclick และ JS function definition
