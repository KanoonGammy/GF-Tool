import { DressProject, UserSession } from '../types';

const STORAGE_KEY = 'fashion_dresses_projects_v1';
const USER_KEY = 'fashion_dresses_user_session';
const PASSCODE_KEY = 'fashion_app_passcode';

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
          cutIntegrityPassed: false, // คัตติ้งช่วงคอเพี้ยน
          modelPresentationPassed: true,
          audioVisualSyncPassed: true
        },
        decision: 'REVISION_REQUESTED',
        reviewerNotes: 'ช่วงคอเสื้อหลุดเป็นคอกว้างเกินไป อยากให้คงคอวีพอดีตัวตามภาพต้นฉบับ และห้ามให้ผ้าเปลี่ยนเป็นมันวาว',
        reviewedAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    },
    {
      id: 'iter-002',
      iterationNumber: 2,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-in-a-pink-dress-posing-in-slow-motion-41808-large.mp4',
      coverImageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
      durationSeconds: 10,
      engine: 'google_flow_omni',
      positivePrompt: '[STYLE]: High-end luxury fashion commercial film, 35mm Arri Alexa 8k.\n[SUBJECT]: Model in @dress_reference with modest V-necklock...\n[AUDIO_VOICEOVER]: [VOICEOVER]: ชุดเดรสทรงสวยสำหรับผู้หญิงยุคใหม่...',
      negativePrompt: 'fabric distortion, altered silhouette, morphing neckline, wide gaping collar, plastic sheen, shiny silk satin, neon pink oversaturation',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  revisionMemories: [
    {
      id: 'mem-001',
      iteration: 1,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      category: 'cut_morphing',
      userFeedbackText: 'ช่วงคอเสื้อหลุดเป็นคอกว้างเกินไป อยากให้คงคอวีพอดีตัวตามภาพต้นฉบับ และห้ามให้ผ้าเปลี่ยนเป็นมันวาว',
      addedNegativeTokens: ['wide gaping collar', 'loose plunging neckline', 'plastic sheen', 'shiny silk satin'],
      aiLearnedRule: '[ล็อคคอเสื้อ]: บังคับคอวีระดับปานกลางพร้อมขอบกุ๊น (Modest V-Neck with fine edging) และล็อคเนื้อผ้าให้อยู่ในโหมด Matte Chiffon ห้ามมีความมันวาว'
    }
  ]
};

export const ProjectStorage = {
  getProjects(): DressProject[] {
    if (typeof window === 'undefined') return [INITIAL_SEED_PROJECT];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.saveProjects([INITIAL_SEED_PROJECT]);
      return [INITIAL_SEED_PROJECT];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [INITIAL_SEED_PROJECT];
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

  // Auth / Friend Passcode management
  getUserSession(): UserSession {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, name: 'Guest', role: 'reviewer', authMethod: 'passcode' };
    }

    // Check Cloudflare Access header emulation or local storage
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }

    // Default to unauthenticated until friend types passcode
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
