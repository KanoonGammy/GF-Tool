import { DressProject, GarmentDNA, StoryboardShot, PromptDiff } from '../types';

export function generateDefaultStoryboard(project: DressProject, dna: GarmentDNA): StoryboardShot[] {
  const modelName = project.modelPersona ? project.modelPersona.name : 'นางแบบแฟชั่น';
  const hasBack = !!project.referenceAngles?.back;
  const hasZoom = !!project.referenceAngles?.fabricZoom;

  return [
    {
      shotNumber: 1,
      timecode: '00:00 - 00:02',
      title: 'ช็อตเปิดตัว: 3D Orbit รอบตัวเสื้อทั้งตัว',
      shotType: 'Full Body 3D Orbit (Uncropped)',
      description: `กล้องหมุน 3D Orbit อย่างนุ่มนวลรอบตัว ${modelName} เผยให้เห็นสัดส่วนชุดทั้งตัว ไม่ตัดขอบ ปลอดภัยใน Safe zone 9:16`,
      refToken: '@dress_front_cutout',
      focusArea: 'โครงสร้างชุดทั้งตัว และสัดส่วนเอว',
      imageUrl: '/samples/storyboard/shot1.jpg'
    },
    {
      shotNumber: 2,
      timecode: '00:02 - 00:04',
      title: 'เจาะดีเทล: ทรงคอเสื้อ & ขอบริบพรีเมียม',
      shotType: 'Medium Close-up (Chest & Neckline)',
      description: `กล้อง Push-in เข้าหาช่วงอกและคอเสื้อ ล็อคทรง ${dna.silhouette.neckline} แน่นหนา ไม่ morphing ระหว่างการขยับตัว`,
      refToken: '@dress_front_cutout',
      focusArea: `${dna.silhouette.neckline} และแถบสี`,
      imageUrl: '/samples/storyboard/shot2.jpg'
    },
    {
      shotNumber: 3,
      timecode: '00:04 - 00:06',
      title: 'ช็อตมาโคร: ส่องเนื้อผ้า & เทคนิคการทอลวดลาย',
      shotType: 'Extreme Macro Texture Zoom',
      description: `กล้อง Macro ซูมลึกระดับเส้นใย ${dna.fabricType} ให้เห็นมิติความนุ่ม ลายทอดอกไม้ และการสะท้อนแสงแบบธรรมชาติ`,
      refToken: hasZoom ? '@fabric_zoom_cutout' : '@dress_front_cutout',
      focusArea: 'ผิวสัมผัสเส้นใย และลวดลายในตัวผ้า',
      imageUrl: '/samples/storyboard/shot3.jpg'
    },
    {
      shotNumber: 4,
      timecode: '00:06 - 00:07',
      title: 'ดีเทลคัตติ้ง: ทรงแขนเสื้อ & ช่วงเอวเข้ารูป',
      shotType: 'Waist & Sleeve Detail Framing',
      description: `กล้อง Pan ลงเบาๆ แสดงคัตติ้ง ${dna.silhouette.sleeves} และช่วงเอว ${dna.silhouette.waist} แนบสรีระสวยงาม`,
      refToken: '@dress_front_cutout',
      focusArea: 'ขอบแขนเสื้อ และความเข้ารูปช่วงเอว',
      imageUrl: '/samples/storyboard/shot4.jpg'
    },
    {
      shotNumber: 5,
      timecode: '00:07 - 00:09',
      title: 'จังหวะการเดิน: โมเดลเดิน Runway อย่างสง่า',
      shotType: 'Dynamic Runway Walk (Slow Motion)',
      description: `${modelName} ก้าวเดินด้วยความมั่นใจ จังหวะก้าวสง่างาม ท่วงท่าไม่เหวี่ยงแขนจนบดบังดีเทลของตัวเสื้อ`,
      refToken: '@model_persona',
      focusArea: 'การทิ้งตัวของผ้าตามจังหวะก้าวเดิน',
      imageUrl: '/samples/storyboard/shot5.jpg'
    },
    {
      shotNumber: 6,
      timecode: '00:09 - 00:10',
      title: 'ช็อตจบ: หมุนตัว 360 องศา โชว์ด้านหลัง & ปิดแอด',
      shotType: '360 Spin Turn & Brand Outro',
      description: `โมเดลหมุนตัวช้าๆ โชว์ดีเทลด้านหลัง${hasBack ? ' ตามภาพ @dress_back_cutout' : ''} พร้อมเอฟเฟกต์แสงประกายปิดท้ายแบรนด์`,
      refToken: hasBack ? '@dress_back_cutout' : '@dress_front_cutout',
      focusArea: 'ด้านหลังตัวเสื้อ และความประทับใจสุดท้าย',
      imageUrl: '/samples/storyboard/shot6.jpg'
    }
  ];
}

export function refineStoryboardAndPrompt(
  currentShots: StoryboardShot[],
  currentPrompt: string,
  currentNegative: string,
  userComplaint: string
): {
  revisedShots: StoryboardShot[];
  revisedPrompt: string;
  revisedNegative: string;
  diff: PromptDiff;
} {
  const lower = userComplaint.toLowerCase();
  const addedTokens: string[] = [];
  const modifiedDirectives: string[] = [];
  const negativesAdded: string[] = [];

  const revisedShots = currentShots.map(shot => ({ ...shot }));

  // Case 1: Complaints about collar / neckline
  if (lower.includes('คอ') || lower.includes('collar') || lower.includes('ขอบ')) {
    addedTokens.push('reinforced ribbed neckline lock');
    modifiedDirectives.push('Shot 2: ล็อคการโฟกัสขอบริบสีฟ้าพาสเทลให้แน่นขึ้น ห้ามเบลอหรือกลืนสี');
    negativesAdded.push('loose collar, bleached neckline, plain white collar');
    revisedShots[1].description += ' (ปรับปรุง: ล็อคขอบริบสีฟ้าพาสเทลและทรงคอเสื้อไม่ให้เพี้ยนเด็ดขาด)';
  }

  // Case 2: Complaints about camera speed / motion
  if (lower.includes('เร็ว') || lower.includes('กล้อง') || lower.includes('fast') || lower.includes('หมุน')) {
    addedTokens.push('ultra-slow cinematic 0.5x camera glide');
    modifiedDirectives.push('Shot 1 & Shot 5: ชะลอความเร็วการเคลื่อนกล้องลง 50% ให้สายตาจับดีเทลผ้าทัน');
    negativesAdded.push('rapid camera rotation, fast panning, jerky motions');
    revisedShots[0].description = revisedShots[0].description.replace('อย่างนุ่มนวล', 'แบบ Ultra Slow-Motion ช้าลง 50%');
    revisedShots[4].description = revisedShots[4].description.replace('ก้าวเดิน', 'ก้าวเดินอย่างช้าๆ สง่างาม');
  }

  // Case 3: Complaints about sleeves
  if (lower.includes('แขน') || lower.includes('sleeve')) {
    addedTokens.push('strict short sleeves above elbow with ribbed cuffs');
    modifiedDirectives.push('Shot 4: บังคับความยาวแขนสั้นเหนือข้อศอก');
    negativesAdded.push('long sleeves, 3/4 sleeves, extended sleeves');
    revisedShots[3].description += ' (ปรับปรุง: ล็อคความยาวแขนเสื้อสั้นเหนือข้อศอก ไม่ให้ morph ยืดยาว)';
  }

  // Case 4: Complaints about fabric / texture / flower pattern
  if (lower.includes('ผ้า') || lower.includes('ดอกไม้') || lower.includes('ลาย') || lower.includes('zoom')) {
    addedTokens.push('macro intarsia knit weave resolution, crisp floral blossom definition');
    modifiedDirectives.push('Shot 3: เพิ่มระยะซูมมาโคร 1.5x ส่องลึกถึงรอยถักลายดอกไม้');
    negativesAdded.push('blurred knit pattern, deformed flowers, pixelated fabric weave');
    revisedShots[2].description += ' (ปรับปรุง: ซูมลึก 1.5x ให้เห็นเส้นด้ายสีชมพูดอกไม้ทอคมชัด)';
  }

  // Fallback if generic complaint
  if (addedTokens.length === 0) {
    addedTokens.push(`custom directive: ${userComplaint}`);
    modifiedDirectives.push(`ปรับแก้ตามฟีดแบ็กผู้ใช้: "${userComplaint}"`);
    negativesAdded.push('unwanted deformation, inconsistent visual styling');
  }

  const diff: PromptDiff = {
    timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    userComplaint,
    addedTokens,
    modifiedDirectives,
    negativesAdded
  };

  // Compile revised prompts
  const revisedPrompt = currentPrompt + `\n\n[USER_REFINEMENT_LOCK]: Strictly enforce: ${addedTokens.join(', ')}.`;
  const revisedNegative = currentNegative + ', ' + negativesAdded.join(', ');

  return {
    revisedShots,
    revisedPrompt,
    revisedNegative,
    diff
  };
}
