import { ModelPersona } from '../types';

export const PRESET_MODELS: ModelPersona[] = [
  {
    id: 'model-mint-thai',
    name: 'มินท์ (Mint)',
    nationality: 'ไทย (Thai)',
    ethnicity: 'Southeast Asian / Thai',
    age: 24,
    heightCm: 174,
    bodyType: 'Slender Runway (เพรียวระหงส์)',
    skinTone: 'Warm Beige ผิวน้ำผึ้งนวลผ่องธรรมชาติ',
    hairStyle: 'เกล้าผมทรง Elegant Sleek Low Bun เรียบหรู',
    hairColor: 'ดำธรรมชาติ (Natural Dark Espresso)',
    vibe: 'ลูกคุณหนูเรียบหรู สง่างาม (Quiet Luxury & Grace)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'model-aria-eurasian',
    name: 'อาริยา (Aria)',
    nationality: 'ลูกครึ่งไทย-อังกฤษ (Thai-British)',
    ethnicity: 'Eurasian (ลูกครึ่ง)',
    age: 25,
    heightCm: 177,
    bodyType: 'High-Fashion Slender (หุ่นนางแบบแฟชั่นวีค)',
    skinTone: 'Golden Bronze สุขภาพดีเปล่งปลั่ง',
    hairStyle: 'ลอนคลื่นเบาๆ สลวย (Soft Natural Waves)',
    hairColor: 'น้ำตาลคาราเมล (Caramel Brown)',
    vibe: 'โฉบเฉี่ยว อินเตอร์ ทันสมัย (Editorial High-Fashion)',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'model-yuna-korean',
    name: 'Yuna (ยูนา)',
    nationality: 'เกาหลี (Korean)',
    ethnicity: 'East Asian',
    age: 23,
    heightCm: 171,
    bodyType: 'Petite Slender (เพรียวบางโปร่ง)',
    skinTone: 'Porcelain White ผิวขาวออร่าแบบ Glass Skin',
    hairStyle: 'ผมยาวตรงสลวยแสกกลางเงางาม (Glossy Sleek Straight)',
    hairColor: 'ดำสนิท (Glossy Jet Black)',
    vibe: 'มินิมอล โมเดิร์น น่ารักหวานซ่อนเปรี้ยว (Clean Chic)',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'model-camille-french',
    name: 'Camille (คามิลล์)',
    nationality: 'ฝรั่งเศส (French)',
    ethnicity: 'European / Caucasian',
    age: 26,
    heightCm: 178,
    bodyType: 'Tall Runway (สูงเพรียว โครงหน้าชัด)',
    skinTone: 'Fair with Rosy Undertones',
    hairStyle: 'Messy French Bob สไตล์ปารีเซียง',
    hairColor: 'บลอนด์น้ำผึ้ง (Honey Blonde)',
    vibe: 'คลาสสิก ปารีเซียง มั่นใจ (Parisian Haute Couture)',
    avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'model-sora-japanese',
    name: 'Sora (โซระ)',
    nationality: 'ญี่ปุ่น (Japanese)',
    ethnicity: 'East Asian',
    age: 22,
    heightCm: 167,
    bodyType: 'Delicate Feminine (อ่อนช้อย บอบบาง)',
    skinTone: 'Soft Peach Ivory',
    hairStyle: 'บ็อบสั้นดัดลอนคลาย มีหน้าม้าซีทรู (Airy Bob with Bangs)',
    hairColor: 'ช็อกโกแลตหม่น (Ash Chocolate)',
    vibe: 'อ่อนหวาน ละมุน โรแมนติก (Soft Romantic Elegance)',
    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80'
  }
];

export function buildModelPersonaPromptToken(model?: ModelPersona): string {
  if (!model) {
    return '[MODEL]: Professional high-fashion female model, 24yo Thai-Eurasian, 175cm tall, slender runway build, glowing porcelain skin, natural elegant posture.';
  }

  return `[MODEL]: Professional fashion model "${model.name}", ${model.age} years old, ${model.nationality} (${model.ethnicity}), height ${model.heightCm}cm, ${model.bodyType}, skin tone: ${model.skinTone}, hair: ${model.hairColor} in ${model.hairStyle}. Demeanor: ${model.vibe}, confident graceful runway walking and poise without extreme gestures.`;
}
