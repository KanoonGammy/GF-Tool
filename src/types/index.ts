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

export interface GarmentDNA {
  fabricType: string;              // e.g. Silk Chiffon, French Tweed, Heavy Cotton
  fabricPhysics: string;           // e.g. Flowing, stiff, lustrous, matte, structured
  colorPalette: ColorSwatch[];     // Primary & accent colors with Hex codes
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
  garmentDna?: GarmentDNA;
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
