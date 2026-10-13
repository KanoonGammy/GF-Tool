export type ProjectStatus = 
  | 'draft' 
  | 'dna_extracted' 
  | 'generating' 
  | 'ready_for_review' 
  | 'revision_requested' 
  | 'approved';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface FabricScanItem {
  id: string;
  name: string;             // เช่น ผ้านิตคอตตอนทอละเอียด, ผ้าริบขอบ 1x1, ลายทอ Jacquard
  location: string;         // ตัวเสื้อ, ขอบคอ/แขน/ชายเสื้อ, ลายทอ
  texture: string;          // ละเอียด แน่น นุ่ม ยืดหยุ่นได้ปานกลาง
}

export interface ColorScanItem {
  id: string;
  name: string;             // Off-white / Cream, Pastel Baby Blue, Blossom Pink, Espresso Brown
  hex: string;
  percentage: number;       // สัดส่วนพื้นที่ เช่น 65, 20, 10, 5
  role: 'primary' | 'secondary' | 'accent';
  selected: boolean;
}

export interface FabricColorScanResult {
  detectedFabrics: FabricScanItem[];
  detectedColors: ColorScanItem[];
  colorMode: 'multi_color' | 'single_focus'; // หลายสีตามลาย หรือเจาะจงสีเดียว
  focusedColorId?: string;                   // สีที่ผู้ใช้เลือกเน้น
}

export interface GarmentDNA {
  fabricType: string;              // e.g. Silk Chiffon, French Tweed, Heavy Cotton
  fabricPhysics: string;           // e.g. Flowing, stiff, lustrous, matte, structured
  colorPalette: ColorSwatch[];     // Primary & accent colors with Hex codes
  fabricColorScan?: FabricColorScanResult; // ผลการสแกนชนิดผ้าและจานสีแบบละเอียด
  silhouette: {
    neckline: string;              // V-neck, sweetheart, high collar, cowl
    sleeves: string;               // Sleeveless, puff short sleeve, bishop sleeve
    waist: string;                 // Cinched, empire, drop-waist, corset
    hemline: string;               // Floor-length, midi A-line, mini slit
  };
  uniqueDetails: string[];         // Buttons, ruffles, pleats, embroidery, sequins
  strictConstraints: string[];     // Hard rules: "No sheer fabric", "Keep floral scale small"
  defaultNegativePrompts: string[];// Base negative tokens
}

export interface StoryboardShot {
  shotNumber: number;     // 1 to 6
  timecode: string;       // e.g. "00-02s"
  title: string;          // e.g. "Opening 3D Orbit"
  shotType: string;       // e.g. "Full Body 360"
  description: string;    // Action & Camera motion
  refToken?: string;      // e.g. "@dress_front_cutout"
  focusArea: string;      // e.g. "Silhouette, Collar, Waist"
  imageUrl?: string;       // Real generated 9:16 shot image from Nano Banana Pro
}

export interface PromptDiff {
  timestamp: string;
  userComplaint: string;
  addedTokens: string[];
  modifiedDirectives: string[];
  negativesAdded: string[];
}

export interface DoDChecklist {
  fabricFidelityPassed: boolean;    // ลวดลายและสีผ้าตรงต้นฉบับ 100%
  cutIntegrityPassed: boolean;      // คัตติ้ง (คอ/แขน/ชายกระโปรง) ไม่ morphing
  modelPresentationPassed: boolean; // ท่าโพสและการเดินไม่บดบังชุด
  audioVisualSyncPassed: boolean;   // เสียงพากย์และดนตรีชัดเจน
}

export type FeedbackCategory = 
  | 'fabric_texture' 
  | 'pattern_drift' 
  | 'cut_morphing' 
  | 'lighting_color' 
  | 'model_motion' 
  | 'audio_messaging';

export interface RevisionMemory {
  id: string;
  iteration: number;
  createdAt: string;
  category: FeedbackCategory;
  userFeedbackText: string;
  addedNegativeTokens: string[];
  aiLearnedRule: string;            // สรุปกฎที่ AI จดจำไว้ใช้ในรอบต่อไป
}

export interface VideoIteration {
  id: string;
  iterationNumber: number;
  videoUrl?: string;
  coverImageUrl?: string;
  positivePrompt: string;
  negativePrompt: string;
  durationSeconds: number;
  engine: 'google_flow_omni' | 'google_veo_3' | 'ai_studio_native';
  createdAt: string;
  dodEvaluation?: {
    checklist: DoDChecklist;
    decision: 'ACCEPTED' | 'REVISION_REQUESTED';
    reviewerNotes: string;
    reviewedAt: string;
  };
}

export interface ModelPersona {
  id: string;
  name: string;
  nationality: string;        // เช่น ไทย, เกาหลี, ญี่ปุ่น, ฝรั่งเศส, ลูกครึ่งไทย-ยุโรป
  ethnicity: string;          // Thai, East Asian, Caucasian, Eurasian, etc.
  age: number;                // 18 - 45
  heightCm: number;           // เช่น 170 - 180 ซม.
  bodyType: string;           // Slender runway, Petite, Curvy, Athletic
  skinTone: string;           // Porcelain white, Warm beige, Golden tan
  hairStyle: string;          // Sleek high ponytail, Soft romantic waves, Short bob, Elegant updo
  hairColor: string;          // Natural black, Dark espresso brown, Honey blonde
  vibe: string;               // Luxury high-fashion, Casual sweet, Confident businesswoman
  avatarUrl: string;
  isCustom?: boolean;
}

export interface ReferenceAngles {
  front: string;              // ด้านหน้า (Required)
  back?: string;              // ด้านหลัง (Recommended)
  fabricZoom?: string;        // ซูมเนื้อผ้า (Optional)
}

export type CommercialVisualEffectType = 
  | 'none'
  | 'anime_cel_shade'
  | 'sparkle_shimmer'
  | 'korean_dreamy_bloom'
  | 'y2k_strobe_flash'
  | 'speed_ramp_hook';

export interface CommercialVisualEffect {
  id: CommercialVisualEffectType;
  name: string;             // ชื่อเอฟเฟกต์ภาษาไทย
  subtitle: string;         // คำอธิบายสั้นๆ
  tag: string;              // แทร็กสั้นๆ
  promptDirective: string;  // คำสั่งที่แทรกลงใน Positive Prompt
  negativeDirective?: string;
  sfxCue: string;           // ซาวด์เอฟเฟกต์ที่ซิงก์กัน
}

export interface DressProject {
  id: string;
  title: string;
  category: string;
  targetAudience: string;
  keySellingPoints: string[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  inputImages: string[];          // Legacy/Fallback array
  referenceAngles?: ReferenceAngles; // ด้านหน้า, ด้านหลัง, ซูมเนื้อผ้า
  modelPersona?: ModelPersona;       // นางแบบที่เลือกใช้
  masterKeyframeUrl?: string;        // ภาพหน้าตรงหลัก (Master Frontal Anchor Plate)
  activeVisualEffect?: CommercialVisualEffectType; // เอฟเฟกต์เสริมสำหรับขายของ
  garmentDna?: GarmentDNA;
  storyboard?: StoryboardShot[];     // 6-shot (2x3) visual storyboard
  promptDiffHistory?: PromptDiff[];  // ประวัติการแก้ไขสิ่งที่เพิ่ม/ตัดออก
  iterations: VideoIteration[];
  revisionMemories: RevisionMemory[];
}

export interface UserSession {
  isAuthenticated: boolean;
  name: string;
  email?: string;
  role: 'admin' | 'creator' | 'reviewer';
  authMethod: 'cloudflare_access' | 'passcode';
}
