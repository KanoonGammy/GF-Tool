import { DressProject, GarmentDNA, RevisionMemory } from '../types';

export interface CompiledPromptResult {
  positivePrompt: string;
  negativePrompt: string;
  voiceoverScript: string;
  audioDirectives: {
    vo: string;
    sfx: string[];
    bgm: string;
  };
  cumulativeRulesApplied: string[];
}

export function compileFlowPrompt(
  project: DressProject,
  dna: GarmentDNA,
  memories: RevisionMemory[]
): CompiledPromptResult {
  const currentIteration = (project.iterations?.length || 0) + 1;

  // 1. Gather all cumulative negative tokens from history
  const baseNegatives = [
    ...(dna.defaultNegativePrompts || []),
    'distorted fabric texture',
    'morphing sleeves',
    'changing neckline',
    'inconsistent floral/print scale',
    'anatomical defects',
    'blurry garment seams',
    'harsh cartoon lighting',
    'cgi plastic sheen',
    'fast jerky camera'
  ];

  const historicalNegatives = memories.flatMap(m => m.addedNegativeTokens || []);
  const allNegatives = Array.from(new Set([...baseNegatives, ...historicalNegatives]));

  // 2. Rules applied from past AI reflections
  const appliedRules = memories.map(m => `รอบ ${m.iteration}: ${m.aiLearnedRule}`);

  // 3. Thai Commercial Voiceover script crafted for fashion USP
  const usps = project.keySellingPoints?.length > 0 
    ? project.keySellingPoints.join(', ')
    : 'เนื้อผ้าเกรดพรีเมียม คัตติ้งเนี้ยบ ทรงสวยใส่แล้วมั่นใจ';

  const voScript = `ชุดเดรสทรงสวยสำหรับผู้หญิงยุคใหม่ ${dna.fabricType} ${usps} พลิ้วไหวทุกลมหายใจ ใส่แล้วดูสง่า คัตติ้งเป๊ะทุกมุมมอง`;

  const sfxTriggers = [
    '00:00 - Soft luxury wind chime whoosh',
    '00:03 - Gentle fabric flutter / silk rustle',
    '00:07 - Crisp high-heel footsteps in luxury boutique hallway',
    '00:09 - Subtle sparkling chime accent'
  ];

  const bgmPrompt = 'Modern sophisticated luxury fashion house commercial music, smooth chill electronic beat, elegant piano accents, 115 BPM';

  // 4. Construct Omni-Flash / Google Flow Unified Positive Prompt
  const positivePrompt = [
    `[STYLE]: High-end luxury fashion commercial film, shot on 35mm Arri Alexa 8k, cinematic soft diffused daylight. 9:16 vertical portrait format.`,
    `[SUBJECT]: Professional high-fashion model wearing the authentic @dress_reference (${dna.fabricType}), displaying true-to-life ${dna.colorPalette.map(c => `${c.name} (${c.hex})`).join(', ')}.`,
    `[CUT & SILHOUETTE]: ${dna.silhouette.neckline} neckline, ${dna.silhouette.sleeves} sleeves, fitted ${dna.silhouette.waist} waist, flowing ${dna.silhouette.hemline}. Accents include ${dna.uniqueDetails.join(', ')}.`,
    `[FABRIC PHYSICS & DETAIL]: 100% garment mesh integrity, ${dna.fabricPhysics}. Zero morphing of fabric texture or seams. Photorealistic fabric weave visible in macro shots.`,
    `[CAMERA CHOREOGRAPHY]: 0-3s: Smooth 3D circular orbit showcasing whole dress silhouette uncropped. 3-7s: Gentle forward push-in macro focusing on fine fabric texture and waist detail. 7-10s: Elegant slow-motion turn showing back drapery.`,
    `[AUDIO_VOICEOVER]: [VOICEOVER]: ${voScript}`,
    `[AUDIO_SFX]: [SFX]: ${sfxTriggers.join('; ')}`,
    `[AUDIO_BGM]: [BGM]: ${bgmPrompt}`
  ].join('\n\n');

  return {
    positivePrompt,
    negativePrompt: allNegatives.join(', '),
    voiceoverScript: voScript,
    audioDirectives: {
      vo: voScript,
      sfx: sfxTriggers,
      bgm: bgmPrompt
    },
    cumulativeRulesApplied: appliedRules
  };
}
