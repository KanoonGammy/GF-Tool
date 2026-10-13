import { DressProject, GarmentDNA, RevisionMemory } from '../types';
import { buildModelPersonaPromptToken } from '../lib/modelLibrary';
import { getVisualEffectById } from '../lib/visualEffects';

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
  referenceTokensGuidance: string[];
}

export function compileFlowPrompt(
  project: DressProject,
  dna: GarmentDNA,
  memories: RevisionMemory[]
): CompiledPromptResult {
  const currentIteration = (project.iterations?.length || 0) + 1;
  const hasBack = !!project.referenceAngles?.back;
  const effect = getVisualEffectById(project.activeVisualEffect);

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
    'fast jerky camera',
    'face distortion',
    'inconsistent face',
    'changing hairstyle',
    'loose flying hair'
  ];

  // ⭐ CRITICAL RULE: If ONLY front reference is provided, STRICTLY FORBID back views / 360 spins!
  if (!hasBack) {
    baseNegatives.push(
      'back view',
      'rear view',
      'back facing camera',
      'turning around 360',
      'showing back',
      'looking away from camera',
      'backside details',
      'hallucinated rear zipper',
      'hallucinated back cut'
    );
  }

  if (effect.negativeDirective) {
    baseNegatives.push(effect.negativeDirective);
  }

  const historicalNegatives = memories.flatMap(m => m.addedNegativeTokens || []);
  const allNegatives = Array.from(new Set([...baseNegatives, ...historicalNegatives]));

  // 2. Rules applied from past AI reflections
  const appliedRules = memories.map(m => `รอบ ${m.iteration}: ${m.aiLearnedRule}`);

  // 3. Model Persona directive (Locking Face & Hairstyle strictly!)
  const modelDirective = buildModelPersonaPromptToken(project.modelPersona);
  const hairAndFaceLock = `[IDENTITY_LOCK]: Exact facial likeness and hair structure locked to model anchor. Sleek dark espresso low bun with clean center part, polished hairline, zero loose strands, pristine facial bone structure matching reference model.`;

  // 4. Reference Tokens construction
  const refTokens: string[] = ['@dress_front_cutout (ภาพด้านหน้า - Master Anchor)'];
  if (hasBack) {
    refTokens.push('@dress_back_cutout (ภาพด้านหลัง)');
  }
  if (project.referenceAngles?.fabricZoom) {
    refTokens.push('@fabric_zoom_cutout (ซูมลายและเนื้อผ้า)');
  }
  if (project.modelPersona) {
    refTokens.push(`@model_persona (${project.modelPersona.name})`);
  }

  // 5. Thai Commercial Voiceover script crafted for fashion USP
  const usps = project.keySellingPoints?.length > 0 
    ? project.keySellingPoints.join(', ')
    : 'เนื้อผ้าเกรดพรีเมียม คัตติ้งเนี้ยบ ทรงสวยใส่แล้วมั่นใจ';

  const voScript = `ชุดเดรสทรงสวยสำหรับผู้หญิงยุคใหม่ ${dna.fabricType} ${usps} พลิ้วไหวทุกลมหายใจ ใส่แล้วดูสง่า คัตติ้งเป๊ะทุกมุมมอง`;

  const sfxTriggers = [
    effect.sfxCue,
    '00:03 - Gentle fabric flutter / knit soft rustle as model moves',
    '00:07 - Crisp footsteps in sunlit boutique hallway',
    '00:09 - Subtle sparkling chime accent for brand outro'
  ];

  const bgmPrompt = 'Modern sophisticated luxury fashion house commercial music, smooth chill electronic beat, elegant piano accents, 115 BPM';

  // 6. Camera & Shot Choreography based on reference angles (HONORING FRONT-ONLY CONSTRAINT)
  let cameraChoreography = '';
  if (!hasBack) {
    cameraChoreography = `[CAMERA CHOREOGRAPHY (STRICT FRONTAL HEMISPHERE ONLY)]: 
0-3s: Smooth 3D frontal arc orbit (within ±35° front angle) showcasing whole garment silhouette uncropped, matching @dress_front_cutout. 
3-7s: Gentle forward push-in macro focusing on fine knit weave and collar detail${project.referenceAngles?.fabricZoom ? ' matching @fabric_zoom_cutout' : ''}. 
7-10s: Elegant front-facing poise and confident gaze into camera, maintaining full frontal silhouette matching @dress_front_cutout, subtle brand outro (NO BACK VIEW).`;
  } else {
    cameraChoreography = `[CAMERA CHOREOGRAPHY]: 
0-3s: Smooth 3D circular orbit showcasing whole dress silhouette uncropped, matching @dress_front_cutout. 
3-7s: Gentle forward push-in macro focusing on fine fabric weave and waist detail${project.referenceAngles?.fabricZoom ? ' matching @fabric_zoom_cutout' : ''}. 
7-10s: Elegant slow-motion runway turn showing back drapery matching @dress_back_cutout.`;
  }

  // 7. Construct Omni-Flash / Google Flow Unified Positive Prompt
  const positivePrompt = [
    `[STYLE]: High-end luxury fashion commercial film, shot on 35mm Arri Alexa 8k, cinematic soft diffused daylight. 9:16 vertical portrait format.`,
    effect.promptDirective,
    modelDirective,
    hairAndFaceLock,
    `[SUBJECT]: Model wearing the authentic @dress_front_cutout (${dna.fabricType}), displaying true-to-life ${dna.colorPalette.map(c => `${c.name} (${c.hex})`).join(', ')}.`,
    `[CUT & SILHOUETTE]: ${dna.silhouette.neckline} neckline, ${dna.silhouette.sleeves} sleeves, fitted ${dna.silhouette.waist} waist, flowing ${dna.silhouette.hemline}. Accents include ${dna.uniqueDetails.join(', ')}.`,
    `[FABRIC PHYSICS & DETAIL]: 100% garment mesh integrity, ${dna.fabricPhysics}. Zero morphing of fabric texture or seams. Photorealistic fabric weave visible in macro shots.`,
    cameraChoreography,
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
    cumulativeRulesApplied: appliedRules,
    referenceTokensGuidance: refTokens
  };
}
