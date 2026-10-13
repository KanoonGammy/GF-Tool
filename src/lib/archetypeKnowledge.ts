export interface ArchetypeRule {
  id: string;
  category: string;
  categoryName: string;
  cautionTitle: string;
  vulnerability: string;     // อาการที่พบบ่อย (The Bug)
  countermeasure: string;    // คำสั่งป้องกันใน Prompt & Negatives (The Fix)
  lockedNegatives: string[]; // Negative tokens ที่ต้องใส่เสมอ
  lastUpdated: string;
}

export const INITIAL_ARCHETYPE_RULES: ArchetypeRule[] = [
  {
    id: 'rule-knitwear-01',
    category: 'knitwear',
    categoryName: 'เสื้อไหมพรม & เสื้อนิตถัก (Knitwear & Fair Isle)',
    cautionTitle: 'ระวังขอบริบสีพาสเทลกลืนสี (Collar & Cuff Bleaching)',
    vulnerability: 'AI มักจะกลืนสีขอบริบ (เช่น ขอบฟ้าพาสเทล) ให้กลายเป็นสีครีมสีเดียวกับตัวเสื้อ',
    countermeasure: 'ต้องระบุ Token เฉพาะเจาะจงว่า: "pastel baby-blue ribbed crewneck collar, sleeve cuffs, and waistband hem"',
    lockedNegatives: ['missing blue ribbed collar', 'bleached collar', 'plain white collar'],
    lastUpdated: '2026-10-13'
  },
  {
    id: 'rule-knitwear-02',
    category: 'knitwear',
    categoryName: 'เสื้อไหมพรม & เสื้อนิตถัก (Knitwear & Fair Isle)',
    cautionTitle: 'ระวังลายทอดอกไม้และกากบาทบิดเบี้ยว (Intarsia Motif Distortion)',
    vulnerability: 'การขยับตัวหมุนเร็วเกินไปจะทำให้ลายแถบดอกไม้แนวนอนบิดโค้งเสียทรง',
    countermeasure: 'สั่งกล้องแบบ Smooth 3D Orbit ช้าลง 50% และนางแบบเดิน Runway อย่างสง่า ไม่สะบัดตัวแรง',
    lockedNegatives: ['distorted floral motif', 'warped geometric pattern', 'uneven stripe scale'],
    lastUpdated: '2026-10-13'
  },
  {
    id: 'rule-knitwear-03',
    category: 'knitwear',
    categoryName: 'เสื้อไหมพรม & เสื้อนิตถัก (Knitwear & Fair Isle)',
    cautionTitle: 'ระวังแขนเสื้อยืดยาวเพี้ยน (Sleeve Length Drift)',
    vulnerability: 'เสื้อแขนสั้นมักจะ morph กลายเป็นแขนสามส่วนหรือแขนยาวระหว่างฉาก',
    countermeasure: 'ระบุชัดเจนว่า: "short sleeves terminating well above elbow with ribbed cuffs"',
    lockedNegatives: ['long sleeves', '3/4 sleeves', 'extended sleeves'],
    lastUpdated: '2026-10-13'
  },
  {
    id: 'rule-evening-01',
    category: 'evening_dress',
    categoryName: 'ชุดเดรสออกงาน & ชุดราตรี (Evening & Gala Gowns)',
    cautionTitle: 'ระวังกระโปรงบานพลิ้วกลายเป็นทรงสอบรัดรูป (Hemline Morphing)',
    vulnerability: 'โมเดลขยับขาเดินแล้วชายกระโปรงพลีทหรือกระโปรงบานหดสั้นหรือรัดรูป',
    countermeasure: 'ล็อคโครงสร้าง Maxi A-line flowing hemline พร้อมระบุความยาวคลุมข้อเท้าตลอดคลิป',
    lockedNegatives: ['tight miniskirt', 'changing dress length', 'morphing hemline'],
    lastUpdated: '2026-10-13'
  },
  {
    id: 'rule-evening-02',
    category: 'evening_dress',
    categoryName: 'ชุดเดรสออกงาน & ชุดราตรี (Evening & Gala Gowns)',
    cautionTitle: 'ระวังเนื้อผ้าไหมชีฟองขึ้นเงาพลาสติก (Plastic Sheen)',
    vulnerability: 'แสงไฟสตูดิโอจัดเกินไปทำให้ผ้าชีฟองดูแข็งและมันวาวเหมือนพลาสติก 3D CGI',
    countermeasure: 'สั่งแสงแบบ Soft diffused morning daylight และล็อคผิวสัมผัสแบบ soft matte luster',
    lockedNegatives: ['plastic sheen', 'cgi render', 'harsh shiny reflections', '3d model look'],
    lastUpdated: '2026-10-13'
  }
];

const KNOWLEDGE_STORAGE_KEY = 'fashion_archetype_knowledge_v1';

export const ArchetypeKnowledgeManager = {
  getRules(): ArchetypeRule[] {
    if (typeof window === 'undefined') return INITIAL_ARCHETYPE_RULES;
    const data = localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
    if (!data) {
      this.saveRules(INITIAL_ARCHETYPE_RULES);
      return INITIAL_ARCHETYPE_RULES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ARCHETYPE_RULES;
    }
  },

  saveRules(rules: ArchetypeRule[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(rules));
    }
  },

  addRuleFromFeedback(category: string, userFeedback: string, negativeTokens: string[]) {
    const rules = this.getRules();
    const newRule: ArchetypeRule = {
      id: `rule-${Date.now()}`,
      category,
      categoryName: category === 'knitwear' ? 'เสื้อไหมพรม & นิตถัก' : category === 'evening_dress' ? 'ชุดเดรสออกงาน' : 'แฟชั่นทั่วไป',
      cautionTitle: `ข้อควรระวัง: ${userFeedback.slice(0, 45)}...`,
      vulnerability: userFeedback,
      countermeasure: `เรียนรู้จากฟีดแบ็กจริง: "${userFeedback}" สั่งล็อคพารามิเตอร์เพื่อป้องกันความผิดพลาดซ้ำ`,
      lockedNegatives: negativeTokens,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    rules.unshift(newRule);
    this.saveRules(rules);
    return newRule;
  },

  getRulesForCategory(category: string): ArchetypeRule[] {
    return this.getRules().filter(r => r.category === category || r.category === 'all');
  }
};
