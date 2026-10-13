# Fashion Ad Studio - Dresses AI Video Generator

เว็บแอปพลิเคชันสำหรับสร้างและตรวจรับงานวิดีโอโฆษณาชุดเสื้อผ้า/เดรสผู้หญิงด้วย AI โดยเฉพาะ พร้อมระบบความจำต่อเนื่อง (Cumulative AI Memory) ผ่าน **Google AI Studio (Gemini 2.5)** ร่วมกับ **Google Flow (Omni-Flash / Veo)** และระบบสิทธิ์เข้าใช้งานสำหรับเพื่อนผ่าน **Cloudflare**

---

## 🌟 ฟีเจอร์หลัก (Key Features)

1. **Cloudflare Edge Deployment & Friend Access**:
   - ระบบป้องกันการเข้าถึงด้วย **Passcode สำหรับกลุ่มเพื่อน** (`fashion2025`)
   - รองรับ **Cloudflare Zero Trust (Access)** ส่งรหัส One-Time PIN ไปยังอีเมลของเพื่อน ไม่ต้องสมัครสมาชิก
   - ทำงานบน Cloudflare Pages + Cloudflare D1 (Database) + Cloudflare R2 (Storage)

2. **Garment DNA Passport (ถอดรหัสเนื้อผ้าและคัตติ้ง)**:
   - สกัดสเปกของชุดเสื้อผ้าโดยละเอียดด้วยโมเดลวิสัยทัศน์ **Gemini 2.5 Flash Multimodal**
   - ถอดรหัสประเภทผ้า (Fabric Type), ฟิสิกส์การทิ้งตัว (Fabric Physics), รหัสสี (Color Palette Hex), คัตติ้ง (Neckline, Sleeves, Waistline, Hemline) และจุดเด่นเฉพาะ
   - มี **Strict Constraints** และชุดคำสั่งห้ามมาตรฐานเพื่อป้องกันไม่ให้ชุดเสียทรง

3. **Google Flow Omni-Flash Prompt Studio**:
   - สังเคราะห์ Prompt ภาษาอังกฤษคุณภาพสูงระดับ High-Fashion Commercial 9:16 ความยาว 10 วินาที
   - รวมเสียงพากย์สรรพคุณภาษาไทย `[VOICEOVER]`, เสียงเอฟเฟกต์ตามไทม์โค้ด `[SFX]`, และดนตรีโฆษณา `[BGM]`
   - คำสั่งเคลื่อนไหวกล้องแบบไม่ทำให้ชุดบิดเบี้ยว (Zero-Morphing Camera Orbits)

4. **Definition of Done (DoD) Inspection Room**:
   - เครื่องเล่นวิดีโอ 9:16 พร้อมฟังก์ชัน **Slow-Motion (0.5x)** สำหรับตรวจเช็กตะเข็บและลวดลายผ้า
   - จอเทียบเคียงภาพชุดจริง (Ground Truth Reference Comparison)
   - เช็กลิสต์ความสมบูรณ์ 4 ข้อ:
     1. ลวดลายและสีผ้าตรงต้นฉบับ 100% (Fabric & Color Fidelity)
     2. คัตติ้งคงรูปเดิม ไม่ Morphing (Silhouette Integrity)
     3. ท่าโพสและการเดินสง่างาม ไม่บดบังชุด (Presentation & Motion)
     4. เสียงพากย์และซาวด์เอฟเฟกต์ชัดเจน (Audio Sync)
   - 🟢 ปุ่ม **"อนุมัติงาน (Accept - DoD Passed)"**
   - 🔴 ปุ่ม **"ขอแก้ไข (Request Revision)"**

5. **ระบบความจำ AI (Cumulative AI Memory Bank)**:
   - เมื่อผู้ใช้กด "ขอแก้ไข" และระบุ Negative Prompts เพิ่มเติม:
   - **Google AI Studio (Gemini)** จะวิเคราะห์สาเหตุและสรุปเป็น **"กฎความจำถาวร (AI Learned Rule)"**
   - บันทึก Negative Tokens ใหม่ลงใน Memory Matrix
   - ในรอบถัดไป กฎและข้อห้ามทั้งหมดในอดีตจะถูกนำมารวมเข้าสู่ Prompt ใหม่โดยอัตโนมัติ ทำให้ AI **"ไม่ทำพลาดซ้ำเดิม"**

---

## 🚀 วิธีการรันในเครื่อง (Local Development)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้น Dev Server
npm run dev
```

เปิดบราวเซอร์ไปที่ `http://localhost:5173`
- รหัสผ่านเข้าใช้งานเริ่มต้น: `fashion2025` (หรือคลิกปุ่ม "เข้าใช้งานด่วนแบบ Guest Demo")

---

## ☁️ วิธีการ Deploy บน Cloudflare Pages & D1

### 1. Build โค้ด
```bash
npm run build
```

### 2. Deploy ไปยัง Cloudflare Pages
```bash
npx wrangler pages deploy dist --project-name dresses-ai-studio
```

### 3. สร้าง D1 Database & รัน SQL Schema
```bash
# สร้าง Database
npx wrangler d1 create dresses_ai_db

# รัน Schema
npx wrangler d1 execute dresses_ai_db --file=./schema.sql
```

### 4. ตั้งค่า Environment Variables บน Cloudflare Dashboard
- `APP_PASSCODE`: รหัสผ่านที่คุณต้องการแจกให้เพื่อน
- `GEMINI_API_KEY`: API Key จาก Google AI Studio (`https://aistudio.google.com/app/apikey`)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
├── src/
│   ├── components/
│   │   ├── AuthGate.tsx                 # ระบบ Login สำหรับเพื่อน
│   │   ├── Header.tsx                   # แถบเมนูด้านบนและสถานะระบบ
│   │   ├── ProjectList.tsx              # หน้ารวมแคมเปญชุดเดรส
│   │   ├── ProjectDetailView.tsx        # หน้าจัดการแคมเปญและแท็บต่างๆ
│   │   ├── GarmentDnaView.tsx           # หน้าพาสปอร์ตโครงสร้างชุด (Garment DNA)
│   │   ├── GoogleFlowPromptCard.tsx     # เครื่องมือสังเคราะห์ Prompt Google Flow
│   │   ├── VideoReviewRoom.tsx          # ห้องตรวจรับ Definition of Done (DoD)
│   │   ├── RevisionModal.tsx            # ฟอร์มบันทึกการขอแก้ไขและ Negative Prompts
│   │   ├── CumulativeMemoryTimeline.tsx # ไทม์ไลน์ความจำของ AI
│   │   └── SettingsModal.tsx            # หน้าต่างตั้งค่า API Key และรหัสผ่าน
│   ├── services/
│   │   ├── gemini.ts                    # Google AI Studio Brain (Gemini 2.5 Flash)
│   │   └── flowPromptCompiler.ts        # ตัวรวม Prompt & Cumulative Negatives
│   ├── lib/
│   │   └── storage.ts                   # ระบบจัดเก็บข้อมูล Local & D1 Sync
│   ├── types/
│   │   └── index.ts                     # TypeScript Types
│   ├── App.tsx                          # App Component
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Tailwind CSS
├── functions/
│   └── api/
│       └── [[route]].ts                 # Cloudflare Pages Functions Backend
├── schema.sql                           # SQLite Schema สำหรับ Cloudflare D1
├── wrangler.toml                        # การตั้งค่า Cloudflare
└── package.json
```
