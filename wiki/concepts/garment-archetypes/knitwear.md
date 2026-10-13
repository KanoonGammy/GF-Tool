# Garment Archetype: Knitwear & Fair Isle Tops

> Category: `knitwear` / `fair_isle_tops` / `ribbed_crewnecks`  
> First analyzed: 2026-10-13 from Pomelo Short-Sleeved Fair Isle Knit Top.

---

## 🧵 Physical Characteristics

- **Base Fabric**: Fine gauge cotton/acrylic blend yarn. Soft, flexible, matte finish (no nylon sheen).
- **Trims**: 1x1 ribbed elastic knits at crewneck collar, sleeve cuffs, and waistband hem.
- **Pattern Technique**: Intarsia/Jacquard weave. Motifs are knitted into the matrix using different colored yarns (not flat screen-printed ink).

---

## 🚨 Known Vulnerabilities & Caution Rules (สิ่งที่ต้องระวังเป็นพิเศษ)

### 1. Collar & Trim Bleaching (ขอบริบสีกลืน)
- **The Bug**: Generative diffusion models frequently bleach colored ribbed collars (like pastel baby-blue) into the primary body color (off-white/cream).
- **Mandatory Countermeasure**:
  - Positive Prompt must explicitly declare: `[TRIM]: Pastel baby-blue ribbed crewneck collar, pastel baby-blue sleeve cuffs, and matching ribbed hem band.`
  - Negative Prompt must include: `missing blue ribbed collar, bleached collar, plain white crewneck`.

### 2. Intarsia Horizontal Stripe Distortion (ลายดอกไม้และกากบาทบิดเบี้ยว)
- **The Bug**: Fast model turns or arm swings distort horizontal floral/geometric stripes, turning straight Fair Isle bands into wavy curves.
- **Mandatory Countermeasure**:
  - Restrict model movements to smooth, upright runway walking and subtle slow-motion 3D camera orbits.
  - Negative Prompt must include: `distorted floral motif, uneven stripe scale, warped geometric pattern`.

### 3. Sleeve Length Drift (แขนเสื้อยาวเพี้ยน)
- **The Bug**: Short knit sleeves often morph into 3/4 sleeves or full-length sleeves during camera transitions.
- **Mandatory Countermeasure**:
  - Explicitly declare: `short sleeves terminating well above the elbow with defined ribbed cuffs`.
  - Negative Prompt must include: `long sleeves, 3/4 sleeves, missing cuff ribbing`.

### 4. Bottom Pairing Harmony (การแมตช์ท่อนล่าง)
- **The Bug**: When given only a top, AI tends to hallucinate distracting bottoms (torn denim, clashing skirts).
- **Mandatory Countermeasure**:
  - Always pair with neutral, elegant bottoms: e.g. `high-waisted tailored cream linen trousers` to maintain quiet luxury aesthetics.
