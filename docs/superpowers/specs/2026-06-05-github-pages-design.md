# GitHub Pages Landing Page — Lawyer Near Me Claude Code Plugin

## Overview

สร้าง `index.html` สำหรับ GitHub Pages ที่ `seed18up/lawyer-near-me-claude-plugin` เพื่ออธิบาย plugin ให้กับสองกลุ่ม: นักพัฒนาที่ต้องการนำ plugin ไปใช้ และ stakeholder ที่ต้องการเข้าใจ AI capabilities ของ Lawyer Near Me

## Target Audience

- **นักพัฒนา** — ต้องการ installation guide และ command reference ที่ชัดเจน
- **Stakeholder / ผู้บริหาร** — ต้องการเห็นภาพรวม agents และ capabilities โดยไม่ต้องอ่าน code

## Design Decisions

- **ภาษา:** ภาษาไทยเป็นหลัก
- **Layout:** Tabbed (4 tabs) — Hero ถาวรด้านบน, content เปลี่ยนตาม tab
- **Style:** Professional/Corporate — Navy `#1B3A8B`, Red `#B71C1C`, White/Light gray bg
- **Font:** Sarabun (Google Fonts) — อ่านภาษาไทยสวย, ใช้อยู่แล้วใน plugin output
- **Tech:** Pure HTML + CSS + Vanilla JS — ไม่มี framework, ทำงานบน GitHub Pages แบบ static ทันที

## Page Structure

### Navbar (fixed top)
- Logo: `⚖️ Lawyer Near Me Plugin`
- ปุ่ม GitHub link (icon + ข้อความ)

### Hero Section (always visible)
- Headline: "Claude Code Plugin สำหรับแพลตฟอร์มกฎหมายไทย"
- Subtitle: อธิบาย plugin สั้น ๆ ว่าเพิ่ม AI agents, slash commands, และ hooks ให้กับ Claude Code
- CTA buttons:
  - `⬇ ติดตั้งทันที` — smooth scroll ไป tab ติดตั้ง
  - `ดูบน GitHub` — link ไป repo
- Stat badges: `7 Agents · 10 Commands · 3 Hook Types`

### Tab Bar (sticky under hero)
4 tabs: `ภาพรวม` | `Agents` | `Commands` | `ติดตั้ง`

### Tab Contents

#### Tab 1: ภาพรวม
- 3 Feature cards แบบ horizontal:
  - **Legal AI** — agents ฝั่ง Legal Advisory Team
  - **Marketing AI** — agents ฝั่ง Marketing Team  
  - **Automation** — hooks ที่ทำงานอัตโนมัติ
- Hook types section: แสดง 3 hook events (PreToolUse, PostToolUse, Stop) พร้อมอธิบาย behavior

#### Tab 2: Agents
- Grid 2 คอลัมน์, 7 agent cards
- แบ่ง 2 กลุ่ม:
  - **Legal Advisory Team** (border น้ำเงิน): Legal Advisor, Compliance Officer, Contract Specialist
  - **Marketing Team** (border แดง): Marketing Director, Content Creator, SEO Specialist, Social Media Manager
- แต่ละ card แสดง: ชื่อ persona ภาษาไทย, role badge, description สั้น

#### Tab 3: Commands
- Featured card: `/legal-news` — highlight ว่าเป็น pipeline 5 ขั้นตอน
- Legal commands (4): compliance-check, contract-analysis, legal-review, privacy-policy-review
- Marketing commands (5): audience-research, campaign-analytics, content-strategy, seo-audit, social-media-campaign
- แต่ละ command แสดง: slash command name, คำอธิบายสั้น

#### Tab 4: ติดตั้ง
- 3 ขั้นตอนพร้อม step number:
  1. `git clone` repo
  2. copy `.claude/` folder ไปยัง project directory
  3. เปิด Claude Code แล้วลอง `/legal-news`
- Code blocks พร้อม copy-to-clipboard button (vanilla JS)
- Prerequisites: Claude Code CLI ติดตั้งแล้ว

### Footer
- MIT License
- Link ไป repo: `seed18up/lawyer-near-me-claude-plugin`
- ข้อความ: "สร้างด้วย Claude Code"

## File Output

- `index.html` — ไฟล์เดียว, root ของ repo
- GitHub Pages settings: source = `main` branch, root folder

## Non-Goals

- ไม่มี backend หรือ server-side rendering
- ไม่ใช้ JavaScript framework (React, Vue, etc.)
- ไม่มี multi-page routing
- ไม่แปลเป็นภาษาอังกฤษ (ไว้ทำภายหลัง)
