import { DressProject, GarmentDNA, StoryboardShot, PromptDiff } from '../types';

export function generateDefaultStoryboard(project: DressProject, dna: GarmentDNA): StoryboardShot[] {
  const modelName = project.modelPersona ? project.modelPersona.name : 'นางแบบแฟชั่น';
  const hasBack = !!project.referenceAngles?.back;
  const hasZoom = !!project.referenceAngles?.fabricZoom;

  return [
    {
      shotNumber: 1,
      timecode: '00:00 - 00:02',
      title: hasBack ? 'ช็อตเปิดตัว: 3D Orbit รอบตัวเสื้อทั้งตัว' : 'ช็อตเปิดตัว: 3D Frontal Orbit (ครึ่งวงกลมด้านหน้า)',
      shotType: hasBack ? 'Full Body 3D Orbit (Uncropped)' : 'Frontal Orbit (±30° Safe Zone)',
      description: `กล้องหมุน Frontal Orbit อย่างนุ่มนวลรอบตัว ${modelName} เผยให้เห็นสัดส่วนชุดทั้งตัวจากด้านหน้า ไม่ตัดขอบ ปลอดภัยใน Safe zone 9:16`,
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
      title: 'จังหวะการเดิน: โมเดลเดิน Runway มุ่งตรงมาข้างหน้า',
      shotType: 'Dynamic Runway Walk (Front-Facing)',
      description: `${modelName} ก้าวเดินตรงเข้าหากล้องอย่างสง่างาม ท่วงท่าไม่เหวี่ยงแขนจนบดบังดีเทลของตัวเสื้อ`,
      refToken: '@model_persona',
      focusArea: 'การทิ้งตัวของผ้าตามจังหวะก้าวเดิน',
      imageUrl: '/samples/storyboard/shot5.jpg'
    },
    {
      shotNumber: 6,
      timecode: '00:09 - 00:10',
      title: hasBack ? 'ช็อตจบ: หมุนตัว 360 โชว์ด้านหลัง & ปิดแอด' : 'ช็อตจบ: ท่าโพสหน้าตรงสง่างาม สบตากล้อง & ปิดแอด',
      shotType: hasBack ? '360 Spin Turn & Outro' : 'Frontal Hero Poise (ห้ามหันหลัง)',
      description: hasBack 
        ? `โมเดลหมุนตัวช้าๆ โชว์ดีเทลด้านหลังตามภาพ @dress_back_cutout พร้อมเอฟเฟกต์แสงประกายปิดท้ายแบรนด์`
        : `โมเดลยืนโพสหน้าตรงอย่างมั่นใจ สบตากล้องอย่างสง่างาม ล็อคดีเทลหน้าเสื้อชัดเจน 100% ห้ามหันหลังเพื่อป้องกันรายละเอียดเพี้ยน`,
      refToken: hasBack ? '@dress_back_cutout' : '@dress_front_cutout',
      focusArea: hasBack ? 'ด้านหลังตัวเสื้อ' : 'ด้านหน้าตัวเสื้อ และสายตาสะกดใจ',
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

  // Case 1: Complaints about face or hairstyle inconsistency
  if (lower.includes('หน้า') || lower.includes('ผม') || lower.includes('face') || lower.includes('hair')) {
    addedTokens.push('identical facial likeness lock, locked sleek dark espresso low bun');
    modifiedDirectives.push('All Shots: ล็อคโครงหน้านางแบบและทรงผมรวบตึงมวยต่ำ (Sleek Low Bun) ให้ตรงกัน 100% ทุกช็อต');
    negativesAdded.push('different face, changing hairstyle, loose flying hair, messy bangs, facial morphing');
  }

  // Case 2: Complaints about back view / 360 spin when front-only
  if (lower.includes('หันหลัง') || lower.includes('360') || lower.includes('ด้านหลัง') || lower.includes('เพี้ยน')) {
    addedTokens.push('strictly frontal camera angle (0-20 degrees max), zero back view');
    modifiedDirectives.push('Shot 6: เปลี่ยนเป็นท่าโพสหน้าตรง Hero Pose ห้ามหันหลังเด็ดขาดเพื่อป้องกันรายละเอียดเพี้ยน');
    negativesAdded.push('back view, rear view, 360 spin, turning back, showing backside, hallucinated back details');
    revisedShots[5].title = 'ช็อตจบ: ท่าโพสหน้าตรงสง่างาม สบตากล้อง & ปิดแอด';
    revisedShots[5].shotType = 'Frontal Hero Poise (ห้ามหันหลัง)';
    revisedShots[5].description = 'โมเดลยืนโพสหน้าตรงอย่างมั่นใจ สบตากล้องอย่างสง่างาม ล็อคดีเทลหน้าเสื้อชัดเจน 100% ห้ามหันหลังเด็ดขาด';
  }

  // Case 3: Complaints about collar / neckline
  if (lower.includes('คอ') || lower.includes('collar') || lower.includes('ขอบ')) {
    addedTokens.push('reinforced ribbed neckline lock');
    modifiedDirectives.push('Shot 2: ล็อคการโฟกัสขอบริบสีฟ้าพาสเทลให้แน่นขึ้น ห้ามเบลอหรือกลืนสี');
    negativesAdded.push('loose collar, bleached neckline, plain white collar');
    revisedShots[1].description += ' (ล็อคขอบริบสีฟ้าพาสเทลและทรงคอเสื้อไม่ให้เพี้ยน)';
  }

  // Case 4: Complaints about camera speed / motion
  if (lower.includes('เร็ว') || lower.includes('กล้อง') || lower.includes('fast') || lower.includes('หมุน')) {
    addedTokens.push('ultra-slow cinematic 0.5x camera glide');
    modifiedDirectives.push('Shot 1 & Shot 5: ชะลอความเร็วการเคลื่อนกล้องลง 50% ให้สายตาจับดีเทลผ้าทัน');
    negativesAdded.push('rapid camera rotation, fast panning, jerky motions');
  }

  // Case 5: Complaints about sleeves
  if (lower.includes('แขน') || lower.includes('sleeve')) {
    addedTokens.push('strict short sleeves above elbow with ribbed cuffs');
    modifiedDirectives.push('Shot 4: บังคับความยาวแขนสั้นเหนือข้อศอก');
    negativesAdded.push('long sleeves, 3/4 sleeves, extended sleeves');
  }

  // Case 6: Complaints about fabric / texture / flower pattern
  if (lower.includes('ผ้า') || lower.includes('ดอกไม้') || lower.includes('ลาย') || lower.includes('zoom')) {
    addedTokens.push('macro intarsia knit weave resolution, crisp floral blossom definition');
    modifiedDirectives.push('Shot 3: เพิ่มระยะซูมมาโคร 1.5x ส่องลึกถึงรอยถักลายดอกไม้');
    negativesAdded.push('blurred knit pattern, deformed flowers, pixelated fabric weave');
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
