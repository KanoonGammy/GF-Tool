import { CommercialVisualEffect, CommercialVisualEffectType } from '../types';

export const COMMERCIAL_VISUAL_EFFECTS: CommercialVisualEffect[] = [
  {
    id: 'none',
    name: 'สไตล์ธรรมชาติ (Pure Editorial)',
    subtitle: 'กล้อง Arri Alexa 35mm แสงธรรมชาติหรูหรา',
    tag: 'Haute Couture',
    promptDirective: '[VISUAL_STYLE]: Pristine ultra-luxury editorial commercial cinematography, 35mm prime lens, clean organic morning boutique lighting, true-to-life realistic fabric texture, natural skin tones with zero artificial filters.',
    sfxCue: '00:00 - Crisp natural studio ambience and gentle fabric rustle'
  },
  {
    id: 'anime_cel_shade',
    name: 'อนิเมะวาร์ป (Anime Warp Glow)',
    subtitle: 'เอฟเฟกต์แปลงร่าง 2.5D แสงนีออนพาสเทลวาร์ปเปิดตัวชุด',
    tag: 'Gen-Z Viral',
    promptDirective: '[VISUAL_STYLE]: High-concept modern fashion ad with subtle Japanese anime 2.5D magical girl transformation accents. 00:00-00:02s features delicate glowing pastel cyan and soft blossom-pink particle line traces wrapping smoothly around the garment silhouette before settling into photorealistic 8k fabric.',
    negativeDirective: 'crude cartoon lines, low quality 2D sketch, flat cel shading',
    sfxCue: '00:00 - Magical anime shimmer warp sound effect followed by sparkling crystal chime'
  },
  {
    id: 'sparkle_shimmer',
    name: 'ประกายเพชร (Diamond Shimmer)',
    subtitle: 'ละอองแสงวิ้งสะท้อนบนเนื้อผ้า ชวนสะกดสายตา',
    tag: 'Luxury Glow',
    promptDirective: '[VISUAL_STYLE]: Luxurious radiant micro-diamond shimmer effect. Soft ethereal anamorphic light glints and delicate crystalline lens flares dance across the ribbed collar trims and knitted floral motifs whenever the model moves under ambient sunlight.',
    negativeDirective: 'overblown sparkles, tacky glitter graphics, blurry bokeh blobs',
    sfxCue: '00:02 - Delicate fairy dust twinkle and soft luxury chime accent'
  },
  {
    id: 'korean_dreamy_bloom',
    name: 'ฟุ้งละมุนเกาหลี (Korean Soft Bloom)',
    subtitle: 'แสงแดดอุ่น Halation โทนสีละมุนใจสไตล์คาเฟ่โซล',
    tag: 'K-Fashion Cafe',
    promptDirective: '[VISUAL_STYLE]: Dreamy Korean aesthetic fashion film, warm pastel film halation, gentle soft-focus bloom on morning sunbeams, cozy minimalist Seoul boutique interior with creamy aesthetic grading and romantic subtle breeze.',
    negativeDirective: 'harsh dark shadows, cold sterile blue lighting, high contrast grit',
    sfxCue: '00:00 - Warm acoustic guitar strum and gentle breeze whisper'
  },
  {
    id: 'y2k_strobe_flash',
    name: 'แฟลชสตูดิโอ Y2K (Fashion Strobe)',
    subtitle: 'แสงแฟลชสตูคมกริบ ยุค 90s ป๊อปแฟชั่นสะดุดตา',
    tag: 'TikTok Trending',
    promptDirective: '[VISUAL_STYLE]: High-energy Y2K editorial magazine cover aesthetic. Crisp direct ring-flash strobe lighting, hyper-vivid pastel blue and blossom pink contrast, ultra-sharp textile threading and magazine-spread editorial pose.',
    negativeDirective: 'dull washed out colors, flat dim lighting, grainy noise',
    sfxCue: '00:00 - High-fashion camera motor drive shutter snap and studio strobe pop'
  },
  {
    id: 'speed_ramp_hook',
    name: 'สปีดแรมป์ดึงดูด (Speed Ramp Hook)',
    subtitle: 'สปีดชะลอ-กระชากสายตา 2 วิแรก หยุดคนดูไม่ให้ปัดผ่าน',
    tag: 'High Hook Rate',
    promptDirective: '[VISUAL_STYLE]: Viral e-commerce hook choreography. 00:00-00:01s starts with a lightning-fast dynamic punch-in zoom snap into the model, immediately easing into ultra-fluid 0.5x slow-motion gliding orbit at 00:02s to showcase the collar and fabric texture.',
    negativeDirective: 'static boring framing, continuous fast rotation, disorienting motion',
    sfxCue: '00:00 - Bass drop whoosh impact transition into smooth chill beat'
  }
];

export function getVisualEffectById(id?: CommercialVisualEffectType): CommercialVisualEffect {
  const found = COMMERCIAL_VISUAL_EFFECTS.find(e => e.id === id);
  return found || COMMERCIAL_VISUAL_EFFECTS[0];
}
