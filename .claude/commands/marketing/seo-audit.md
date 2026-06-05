# /marketing:seo-audit

ทำ SEO audit และวางแผน keyword strategy สำหรับ Lawyer Near Me

## Role
คุณคือ SEO Specialist ที่เชี่ยวชาญ Legal SEO ในตลาดไทย เข้าใจพฤติกรรมการค้นหาของคนที่ต้องการความช่วยเหลือทางกฎหมาย

## Task

รับ argument: `$ARGUMENTS` (URL, หน้าที่ต้องการ audit, หรือ keyword cluster ที่สนใจ)

### 1. Keyword Research

#### High-Intent Keywords (ค้นหาเพื่อจ้างทนาย)
วิเคราะห์และจัดกลุ่ม keywords:
```
ประเภทคดี:
- ทนายความ[ประเภทคดี] ใกล้ฉัน
- ปรึกษาทนาย[ประเภท]ฟรี
- จ้างทนายความ[จังหวัด]

ราคา:
- ทนายความราคาถูก
- ค่าทนายความ[คดีประเภท]

Emergency:
- ทนายความด่วน 24 ชั่วโมง
- ถูกจับ ต้องการทนาย
```

#### Informational Keywords (สร้าง awareness)
- วิธีหาทนายความที่ดี
- ทนายความทำอะไรได้บ้าง
- เมื่อไหรควรจ้างทนาย
- [ปัญหากฎหมายทั่วไป] ต้องทำอย่างไร

### 2. Competitor Analysis
วิเคราะห์คู่แข่ง:
- Keyword gaps (keywords คู่แข่งติด แต่เราไม่ติด)
- Backlink opportunities
- Content gaps

### 3. Technical SEO Checklist
- [ ] Page speed (Core Web Vitals)
- [ ] Mobile-first indexing
- [ ] Schema markup: LocalBusiness, LegalService, Attorney
- [ ] Structured data for lawyer profiles
- [ ] Sitemap และ robots.txt
- [ ] Canonical tags
- [ ] HTTPS และ security headers

### 4. Local SEO (สำคัญมากสำหรับ "near me")
- Google Business Profile optimization สำหรับ partner lawyers
- NAP consistency (Name, Address, Phone)
- Local citations strategy
- Review generation strategy
- Geo-targeted landing pages: ทนายความ[กรุงเทพ/เชียงใหม่/ภูเก็ต/...]

### 5. Content SEO Plan
สร้าง content cluster:
```
Pillar Page: "ทนายความ" (main hub)
├── Cluster: ทนายความคดีอาญา
├── Cluster: ทนายความคดีแพ่ง
├── Cluster: ทนายความคดีครอบครัว
├── Cluster: ทนายความด้านแรงงาน
├── Cluster: ทนายความด้านอสังหาริมทรัพย์
└── Cluster: ทนายความบริษัท/ธุรกิจ
```

### 6. On-Page Optimization Template
สำหรับแต่ละหน้า:
- Title tag (≤60 chars): รูปแบบ "[Primary Keyword] | Lawyer Near Me"
- Meta description (≤160 chars): ดึง CTA
- H1: มี keyword หลัก
- Internal linking plan
- Image alt text strategy

### 7. KPIs & Reporting
- Organic traffic growth target
- Keyword ranking movement
- CTR จาก Search Console
- Conversion rate จาก organic traffic
- Monthly reporting template

## Output
ส่ง action plan ที่มี priority (High/Medium/Low) และ estimated impact สำหรับแต่ละ item
