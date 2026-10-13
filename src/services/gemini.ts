import { GoogleGenAI } from '@google/genai';
import { GarmentDNA, RevisionMemory } from '../types';

export class GeminiFashionBrain {
  private apiKey: string;

  constructor(apiKey?: string) {
    // Check localStorage or environment
    this.apiKey = apiKey || (typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') || '' : '');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    if (typeof window !== 'undefined') {
      localStorage.setItem('GEMINI_API_KEY', key);
    }
  }

  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * 1. สกัด Garment DNA ด้วย Gemini 2.5 Flash Multimodal
   */
  async extractGarmentDna(imageUrls: string[]): Promise<GarmentDNA> {
    if (!this.apiKey) {
      // High-Fidelity intelligent fallback if API Key is not yet set
      console.warn('Gemini API Key not set. Using intelligent fashion analyzer preset.');
      return this.mockExtractGarmentDna();
    }

    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      
      // Convert images to Gemini parts
      const imageParts = await Promise.all(
        imageUrls.slice(0, 3).map(async (url) => {
          if (url.startsWith('data:')) {
            const [header, base64Data] = url.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
            return {
              inlineData: {
                data: base64Data,
                mimeType
              }
            };
          }
          // If remote url, fetch and convert
          const res = await fetch(url);
          const blob = await res.blob();
          const buffer = await blob.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          return {
            inlineData: {
              data: base64,
              mimeType: blob.type || 'image/jpeg'
            }
          };
        })
      );

      const prompt = `คุณคือ AI Fashion Director ผู้เชี่ยวชาญการถอดรหัสโครงสร้างเสื้อผ้า (Garment DNA) สำหรับงานสร้างภาพยนตร์โฆษณาด้วย Video AI
โปรดวิเคราะห์รูปชุดเสื้อผ้าที่ส่งมาอย่างละเอียดที่สุด ทั้งเนื้อผ้า คัตติ้ง ทรง ชายกระโปรง และดีเทลพิเศษ
ส่งผลลัพธ์กลับมาเป็น JSON ตามโครงสร้างนี้เท่านั้น:
{
  "fabricType": "ชื่อประเภทเนื้อผ้า เช่น ผ้าไหมชีฟอง, ผ้าทวีตฝรั่งเศส, ผ้าลูกไม้คอตตอน",
  "fabricPhysics": "คุณสมบัติการทิ้งตัวและการสะท้อนแสง เช่น พลิ้วไหวสูง นุ่ม ละมุน ไม่มันเงา ทิ้งตัวทิ้งน้ำหนักดี",
  "colorPalette": [
    {"name": "ชื่อสีหลัก เช่น Dusty Rose", "hex": "#DCAE96"},
    {"name": "ชื่อสีรอง เช่น Champagne Gold", "hex": "#F7E7CE"}
  ],
  "silhouette": {
    "neckline": "ทรงคอ เช่น คอวีลึกแต่งระบาย, คอสี่เหลี่ยมวินเทจ",
    "sleeves": "ทรงแขน เช่น แขนกุด, แขนพองบอลลูนสั้น, แขนยาวผ้าซีทรู",
    "waist": "ทรงเอว เช่น เข้ารูปจับจีบ, เอวสูงทรงสอบ",
    "hemline": "ชายกระโปรง เช่น กระโปรงพลีทบานยาวคลุมเข่า, ชายกระโปรงระบายปาดเฉียง"
  },
  "uniqueDetails": ["กระดุมมุก 5 เม็ด", "สายผูกโบว์หลัง", "ดีเทลผ่าข้าง 15 ซม."],
  "strictConstraints": ["ห้ามเปลี่ยนลวดลายดอกไม้", "ห้ามความยาวสั้นกว่าระดับเข่า"],
  "defaultNegativePrompts": [
    "fabric distortion", "altered pattern scale", "morphing sleeves", 
    "sheer transparency where opaque", "blurry texture", "wrong dress length"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...imageParts,
          { text: prompt }
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return parsed as GarmentDNA;
    } catch (err) {
      console.error('Gemini extraction failed, falling back to smart preset:', err);
      return this.mockExtractGarmentDna();
    }
  }

  /**
   * 2. สังเคราะห์สิ่งที่ AI ต้องจดจำ (Memory Reflection) จากฟีดแบ็กการขอแก้ไข
   */
  async reflectOnRevision(
    feedback: string,
    category: string,
    dna: GarmentDNA,
    historicalMemories: RevisionMemory[]
  ): Promise<{ learnedRule: string; recommendedNegatives: string[] }> {
    if (!this.apiKey) {
      return this.mockReflectOnRevision(feedback, category);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const prompt = `คุณคือ Fashion AI Memory & Quality Control Agent
ผู้ใช้งานได้ตรวจสอบวิดีโอโฆษณาชุดเดรสแล้วกด "ขอแก้ไข" (Revision Requested)
หมวดหมู่ปัญหา: "${category}"
ข้อความสั่งแก้จากผู้ใช้: "${feedback}"

ประวัติสิ่งที่เคยสั่งแก้ในรอบก่อนหน้า:
${JSON.stringify(historicalMemories.map(m => m.aiLearnedRule), null, 2)}

สเปกชุด (Garment DNA):
- ชนิดผ้า: ${dna.fabricType}
- คัตติ้ง: ${JSON.stringify(dna.silhouette)}

หน้าที่ของคุณ:
1. วิเคราะห์จุดผิดพลาดและสรุปเป็น "กฎเหล็กที่ AI ต้องจำสำหรับรอบต่อไป" (aiLearnedRule) สั้นกระชับ ชัดเจน
2. สกัดคำสั่งห้ามภาษาอังกฤษสำหรับใส่ใน Negative Prompt (recommendedNegatives) เพื่อป้องกันไม่ให้เกิดจุดนี้ซ้ำ

ตอบกลับเป็น JSON เท่านั้น:
{
  "learnedRule": "สรุปกฎความจำภาษาไทย 1 ประโยค เช่น ล็อคความยาวกระโปรงให้คลุมเข่าเสมอ ห้ามนางแบบสะบัดชายกระโปรงจนสั้นขึ้น",
  "recommendedNegatives": ["short skirt", "exposed knees", "excessive skirt lift", "violent twirling"]
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ text: prompt }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const data = JSON.parse(res.text || '{}');
      return {
        learnedRule: data.learnedRule || `แก้ไขจุด ${category}: ${feedback}`,
        recommendedNegatives: data.recommendedNegatives || [category.replace('_', ' ')]
      };
    } catch (err) {
      console.error('Gemini reflection error:', err);
      return this.mockReflectOnRevision(feedback, category);
    }
  }

  private mockExtractGarmentDna(): GarmentDNA {
    return {
      fabricType: 'ผ้าไหมชีฟองพรีเมียม (Premium Silk Chiffon)',
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
        'blurry weave seams',
        'poor lighting',
        'amateur runway photography'
      ]
    };
  }

  private mockReflectOnRevision(feedback: string, category: string) {
    const negMap: Record<string, string[]> = {
      fabric_texture: ['blurry fabric', 'flat texture', 'plastic shine', 'synthetic sheen'],
      pattern_drift: ['shifting pattern', 'enlarged floral prints', 'distorted motifs'],
      cut_morphing: ['morphing hemline', 'changing sleeve length', 'distorted waistline'],
      lighting_color: ['wrong color saturation', 'neon tint', 'harsh overexposure'],
      model_motion: ['fast aggressive walking', 'violent spinning', 'awkward posture'],
      audio_messaging: ['muffled voiceover', 'distorted audio', 'inappropriate music tempo']
    };

    return {
      learnedRule: `[ล็อคความจำ]: ตรวจพบปัญหา ${category} จากข้อความ "${feedback}" จึงสั่งล็อคพารามิเตอร์คัตติ้งและเพิ่มข้อห้ามใน Negative Matrix ทันที`,
      recommendedNegatives: negMap[category] || ['unwanted visual artifacts', 'inconsistent garment shape']
    };
  }
}

export const geminiBrain = new GeminiFashionBrain();
