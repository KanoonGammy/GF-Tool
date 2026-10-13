import { DressProject, UserSession } from '../types';
import { PRESET_MODELS } from './modelLibrary';

const STORAGE_KEY = 'fashion_dresses_projects_v2'; // Bump key so new seed loads immediately
const USER_KEY = 'fashion_dresses_user_session';
const PASSCODE_KEY = 'fashion_app_passcode';

export const POMELO_KNIT_PROJECT: DressProject = {
  id: 'dress-proj-pomelo-001',
  title: 'เสื้อไหมพรมแขนสั้นลายแฟร์ไอล์ขอบฟ้าพาสเทล (Pomelo Fair Isle Knit Top)',
  category: 'casual_dress',
  targetAudience: 'ผู้หญิงวัยรุ่นและวัยทำงาน 20-32 ปี ชอบสไตล์หวานละมุน น่ารัก มินิมอล',
  keySellingPoints: [
    'ผ้านิตทอละเอียด นุ่ม ยืดหยุ่นสบายตัว ไม่คันผิว',
    'ขอบคอ แขน และชายเสื้อริบลอนสีฟ้าพาสเทลสุดละมุน',
    'ลายทอดอกไม้สีชมพูสลับลายกากบาทเรขาคณิตสีน้ำตาลในตัวเนื้อผ้า',
    'ทรงเข้ารูปพอดีตัว แมตช์ง่ายกับกางเกงขายาวหรือกระโปรง'
  ],
  status: 'ready_for_review',
  createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  updatedAt: new Date().toISOString(),
  inputImages: [
    '/samples/pomelo_knit_top.png',
    '/samples/pomelo_model_wearing.jpg'
  ],
  referenceAngles: {
    front: '/samples/pomelo_knit_top.png',
    back: '/samples/pomelo_knit_top.png',
    fabricZoom: '/samples/pomelo_knit_top.png'
  },
  modelPersona: PRESET_MODELS[0], // น้องมินท์ (Mint) - สาวไทย 24 ปี
  garmentDna: {
    fabricType: 'ผ้านิตไหมพรมคอตตอนเบลนด์ทอละเอียด (Fine Cotton-Blend Knit)',
    fabricPhysics: 'นุ่ม ยืดหยุ่น กระชับตามสรีระ ทิ้งตัวเบาสบาย ไม่มันเงา ผิวสัมผัสแบบ soft matte knit',
    colorPalette: [
      { name: 'Cream / Off-White (ครีมไอวอรี่)', hex: '#F6F5F0' },
      { name: 'Pastel Baby Blue (ฟ้าพาสเทล)', hex: '#A8CBE5' },
      { name: 'Blossom Pink (ชมพูดอกไม้)', hex: '#EAA8B8' },
      { name: 'Espresso Brown (น้ำตาลช็อกโกแลต)', hex: '#48322B' }
    ],
    fabricColorScan: {
      detectedFabrics: [
        { id: 'f-1', name: 'ผ้านิตคอตตอนผสมอะคริลิกทอละเอียด (Fine Gauge Knit)', location: 'ตัวเสื้อหลัก', texture: 'สัมผัสนุ่ม ยืดหยุ่น ไม่หนาเทอะทะ ระบายอากาศดี' },
        { id: 'f-2', name: 'ผ้านิตทอริบลอน 1x1 (1x1 Ribbed Knit Trim)', location: 'ขอบคอกลม, ขอบแขน, และชายเสื้อ', texture: 'ยืดหยุ่นกระชับ อยู่ทรง สีฟ้าพาสเทล' },
        { id: 'f-3', name: 'เทคนิคทอลายในตัว (Intarsia Motif Weave)', location: 'ช่วงอกและลำตัว', texture: 'เส้นด้ายทอผสานในเนื้อผ้า ลายดอกไม้และกากบาท' }
      ],
      detectedColors: [
        { id: 'c-1', name: 'Cream / Off-White (ครีม)', hex: '#F6F5F0', percentage: 62, role: 'primary', selected: true },
        { id: 'c-2', name: 'Pastel Baby Blue (ฟ้าพาสเทล)', hex: '#A8CBE5', percentage: 20, role: 'secondary', selected: true },
        { id: 'c-3', name: 'Blossom Pink (ชมพูดอกไม้)', hex: '#EAA8B8', percentage: 10, role: 'accent', selected: true },
        { id: 'c-4', name: 'Espresso Brown (น้ำตาล)', hex: '#48322B', percentage: 8, role: 'accent', selected: true }
      ],
      colorMode: 'multi_color'
    },
    silhouette: {
      neckline: 'คอกลมกุ๊นขอบริบสีฟ้าพาสเทล (Pastel baby-blue ribbed crewneck)',
      sleeves: 'แขนสั้นความยาวเหนือข้อศอก ขอบริบสีฟ้า (Short sleeves with blue ribbed cuffs)',
      waist: 'ทรงตรงกระชับพอดีตัว (Fitted waistline)',
      hemline: 'ชายเสื้อขอบริบสีฟ้าระดับสะโพกบน (Ribbed hemline at high hip)'
    },
    uniqueDetails: [
      'ริบขอบคอ แขน และชายเสื้อสีฟ้าพาสเทล',
      'ลายทอดอกไม้สีชมพูหวานแนวนอน',
      'ลายทอกากบาทเรขาคณิตสีน้ำตาลช็อกโกแลตสลับเส้นประ',
      'ป้ายแบรนด์ Pomelo ที่คอด้านใน'
    ],
    strictConstraints: [
      'ห้ามเปลี่ยนสีขอบริบสีฟ้าพาสเทลเป็นสีอื่น',
      'ห้ามสลับแถบลายดอกไม้กับลายกากบาท',
      'ห้ามขยายคอกลมให้กลายเป็นคอวีหรือคอปาด',
      'ห้ามยืดแขนเสื้อให้ยาวจนเลยข้อศอก'
    ],
    defaultNegativePrompts: [
      'fabric distortion',
      'long sleeves',
      'v-neck',
      'missing blue ribbed collar',
      'blurred knit texture',
      'deformed floral motif',
      'oversaturated colors'
    ]
  },
  iterations: [
    {
      id: 'iter-pomelo-001',
      iterationNumber: 1,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-dress-posing-40742-large.mp4',
      coverImageUrl: '/samples/pomelo_model_wearing.jpg',
      durationSeconds: 10,
      engine: 'google_flow_omni',
      positivePrompt: '[STYLE]: High-end luxury fashion commercial film, shot on 35mm Arri Alexa 8k, cinematic soft diffused daylight. 9:16 vertical portrait format.\n\n[MODEL]: Professional fashion model น้องมินท์ (Mint), 24 years old, Thai (Southeast Asian / Thai), height 174cm, Slender Runway, skin tone: Warm Honey Beige, hair: Natural Dark Espresso in Elegant Sleek Low Bun.\n\n[SUBJECT]: Model wearing authentic @dress_front_cutout (Fine Cotton-Blend Knit), displaying true-to-life Cream / Off-White (#F6F5F0), Pastel Baby Blue (#A8CBE5), Blossom Pink (#EAA8B8).\n\n[CUT & SILHOUETTE]: Pastel baby-blue ribbed crewneck, short sleeves with blue cuffs, fitted waist, ribbed hem at high hip.\n\n[CAMERA CHOREOGRAPHY]: 0-3s: Smooth 3D circular orbit showcasing whole knit top uncropped matching @dress_front_cutout. 3-7s: Gentle forward push-in macro focusing on fine knit weave and pastel pink floral blossom motifs. 7-10s: Elegant slow-motion turn showing back drapery.\n\n[AUDIO_VOICEOVER]: [VOICEOVER]: เสื้อไหมพรมแขนสั้นลายแฟร์ไอล์สุดละมุน ผ้านิตเกรดพรีเมียมนุ่มไม่คัน ขอบริบสีฟ้าพาสเทลน่ารักสดใส ใส่สบายทุกวัน\n\n[AUDIO_SFX]: [SFX]: 00:00 - Soft luxury wind chime whoosh; 00:03 - Gentle fabric flutter / knit soft rustle; 00:07 - Crisp footsteps in sunlit boutique; 00:09 - Subtle sparkling chime accent\n\n[AUDIO_BGM]: [BGM]: Modern sophisticated luxury fashion house commercial music, smooth chill electronic beat, 115 BPM',
      negativePrompt: 'fabric distortion, long sleeves, v-neck, missing blue ribbed collar, blurred knit texture, deformed floral motif, oversaturated colors',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  revisionMemories: []
};

export const INITIAL_SEED_PROJECT: DressProject = {
  id: 'dress-proj-001',
  title: 'ชุดเดรสผ้าไหมชีฟองสีชมพูกะปิ (Dusty Rose Chiffon Maxi)',
  category: 'evening_dress',
  targetAudience: 'ผู้หญิงวัยทำงาน 25-38 ปี ที่มองหาชุดออกงานและงานแต่งงานเรียบหรู',
  keySellingPoints: [
    'ผ้าไหมชีฟองเกรดพรีเมียม สัมผัสนุ่มทิ้งตัวพลิ้วไหว',
    'คัตติ้งเข้ารูปช่วงเอวพลางหุ่นให้ดูเพรียวสวย',
    'ซับในซาตินเนื้อนุ่มไม่ระคายเคืองผิว',
    'สี Dusty Rose หรูหรา ขับผิวทุกโทนสี'
  ],
  status: 'ready_for_review',
  createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  updatedAt: new Date(Date.now() - 1800000).toISOString(),
  inputImages: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'
  ],
  referenceAngles: {
    front: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    back: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'
  },
  modelPersona: PRESET_MODELS[0],
  garmentDna: {
    fabricType: 'ผ้าไหมชีฟองพรีเมียม (Silk Chiffon with satin lining)',
    fabricPhysics: 'เนื้อผ้าโปร่งเบา พลิ้วไหวสูง ทิ้งตัวเป็นธรรมชาติ ผิวสัมผัสแบบ soft matte ไม่มันวาวพลาสติก',
    colorPalette: [
      { name: 'Dusty Rose (ชมพูกะปิ)', hex: '#C08081' },
      { name: 'Warm Cream (ครีมวอร์มโทน)', hex: '#FDFBF7' }
    ],
    silhouette: {
      neckline: 'คอวีลึกปานกลางแต่งขอบกุ๊นประณีต (Modest V-Neck with fine edging)',
      sleeves: 'แขนกุดทรงคลาสสิก วงแขนพอดีตัวไม่เว้าลึก (Classic Sleeveless)',
      waist: 'เอวเข้ารูปจับเดรปซ่อนยางยืดนุ่ม (Cinched draped waistline)',
      hemline: 'กระโปรงทรงเอยาวคลุมข้อเท้า ทรงระบายพลิ้ว (Flowing Maxi A-line hem)'
    },
    uniqueDetails: [
      'รอยจับจีบพลีทละเอียดช่วงอก',
      'ผ้าผูกโบว์เส้นเล็กปรับระดับได้ที่ด้านหลัง',
      'ซับในผ้าซาตินสัมผัสนุ่มยาวถึงระดับเข่า'
    ],
    strictConstraints: [
      'ห้ามเปลี่ยนเฉดสีชมพูกะปิเป็นชมพูสะท้อนแสงหรือชมพูหวานแหวว',
      'ห้ามให้กระโปรง morph กลายเป็นทรงสอบรัดรูป',
      'ห้ามเนื้อผ้าดูแข็งกระด้างเหมือนพลาสติก 3D'
    ],
    defaultNegativePrompts: [
      'fabric distortion',
      'altered silhouette',
      'morphing neckline',
      'neon pink oversaturation',
      'stiff plastic texture',
      'blurry weave seams'
    ]
  },
  iterations: [
    {
      id: 'iter-001',
      iterationNumber: 1,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-dress-posing-40742-large.mp4',
      coverImageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
      durationSeconds: 10,
      engine: 'google_flow_omni',
      positivePrompt: '[STYLE]: High-end luxury fashion commercial film...\n[SUBJECT]: Professional high-fashion model wearing authentic @dress_reference...',
      negativePrompt: 'fabric distortion, altered silhouette, morphing neckline, neon pink oversaturation, stiff plastic texture',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      dodEvaluation: {
        checklist: {
          fabricFidelityPassed: true,
          cutIntegrityPassed: false,
          modelPresentationPassed: true,
          audioVisualSyncPassed: true
        },
        decision: 'REVISION_REQUESTED',
        reviewerNotes: 'ช่วงคอเสื้อหลุดเป็นคอกว้างเกินไป อยากให้คงคอวีพอดีตัวตามภาพต้นฉบับ',
        reviewedAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    }
  ],
  revisionMemories: [
    {
      id: 'mem-001',
      iteration: 1,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      category: 'cut_morphing',
      userFeedbackText: 'ช่วงคอเสื้อหลุดเป็นคอกว้างเกินไป อยากให้คงคอวีพอดีตัวตามภาพต้นฉบับ',
      addedNegativeTokens: ['wide gaping collar', 'loose plunging neckline'],
      aiLearnedRule: '[ล็อคคอเสื้อ]: บังคับคอวีระดับปานกลางพร้อมขอบกุ๊น (Modest V-Neck with fine edging)'
    }
  ]
};

export const ProjectStorage = {
  getProjects(): DressProject[] {
    if (typeof window === 'undefined') return [POMELO_KNIT_PROJECT, INITIAL_SEED_PROJECT];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.saveProjects([POMELO_KNIT_PROJECT, INITIAL_SEED_PROJECT]);
      return [POMELO_KNIT_PROJECT, INITIAL_SEED_PROJECT];
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return [POMELO_KNIT_PROJECT, INITIAL_SEED_PROJECT];
      }
      return parsed;
    } catch {
      return [POMELO_KNIT_PROJECT, INITIAL_SEED_PROJECT];
    }
  },

  getProjectById(id: string): DressProject | undefined {
    return this.getProjects().find(p => p.id === id);
  },

  saveProjects(projects: DressProject[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  },

  saveProject(project: DressProject) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift({ ...project, updatedAt: new Date().toISOString() });
    }
    this.saveProjects(projects);
  },

  deleteProject(id: string) {
    const projects = this.getProjects().filter(p => p.id !== id);
    this.saveProjects(projects);
  },

  getUserSession(): UserSession {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, name: 'Guest', role: 'reviewer', authMethod: 'passcode' };
    }

    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }

    return {
      isAuthenticated: false,
      name: 'เพื่อนสมาชิก (Friend)',
      role: 'reviewer',
      authMethod: 'passcode'
    };
  },

  setUserSession(session: UserSession) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(session));
    }
  },

  clearUserSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
  },

  getAppPasscode(): string {
    if (typeof window === 'undefined') return 'fashion2025';
    return localStorage.getItem(PASSCODE_KEY) || 'fashion2025';
  },

  setAppPasscode(passcode: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PASSCODE_KEY, passcode);
    }
  }
};
