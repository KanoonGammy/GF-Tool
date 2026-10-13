import React, { useState } from 'react';
import { ModelPersona, DressProject } from '../types';
import { PRESET_MODELS } from '../lib/modelLibrary';
import { FlowService } from '../services/flowService';
import { 
  UserCheck, Sparkles, Upload, Check, Wand2, RefreshCw, 
  Camera, Sliders, Globe, Heart, ShieldCheck, ArrowRight, Lock, Eye
} from 'lucide-react';

interface ModelStudioViewProps {
  project: DressProject;
  onUpdateProject: (updated: DressProject) => void;
  onProceedToStoryboard?: () => void;
}

export const ModelStudioView: React.FC<ModelStudioViewProps> = ({
  project,
  onUpdateProject,
  onProceedToStoryboard
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'preset' | 'generate' | 'upload'>('preset');

  // Currently selected model
  const currentModel = project.modelPersona || PRESET_MODELS[0];

  // AI Generation Form State
  const [genName, setGenName] = useState('พราว (Praew)');
  const [genNationality, setGenNationality] = useState('ไทย (Thai)');
  const [genEthnicity, setGenEthnicity] = useState('Southeast Asian / Thai');
  const [genAge, setGenAge] = useState<number>(23);
  const [genHeight, setGenHeight] = useState<number>(175);
  const [genBodyType, setGenBodyType] = useState('Slender Runway (เพรียวระหงส์ สัดส่วนนางแบบ)');
  const [genSkinTone, setGenSkinTone] = useState('Warm Honey Beige (ผิวน้ำผึ้งนวลผ่องออร่า)');
  const [genHairStyle, setGenHairStyle] = useState('เกล้าผมทรง Elegant Sleek Low Bun เรียบหรู');
  const [genHairColor, setGenHairColor] = useState('ดำธรรมชาติ (Natural Dark Espresso)');
  const [genVibe, setGenVibe] = useState('ลูกคุณหนูเรียบหรู สง่างาม (Quiet Luxury & Grace)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string | null>(null);

  // Upload Form State
  const [uploadName, setUploadName] = useState('พรีเซนเตอร์ของแบรนด์ (Brand Ambassador)');
  const [uploadNationality, setUploadNationality] = useState('ไทย (Thai)');
  const [uploadAge, setUploadAge] = useState<number>(25);
  const [uploadHeight, setUploadHeight] = useState<number>(172);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [setAsMasterAnchor, setSetAsMasterAnchor] = useState<boolean>(true);

  // Handle preset model selection
  const handleSelectPreset = (model: ModelPersona) => {
    const updated: DressProject = {
      ...project,
      modelPersona: model,
      updatedAt: new Date().toISOString()
    };
    onUpdateProject(updated);
  };

  // Handle AI Model Generation
  const [genError, setGenError] = useState<string | null>(null);

  const handleGenerateAiModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenError(null);

    const prompt = `A breathtaking, hyper-realistic 9:16 vertical fashion commercial portrait of a ${genAge}-year-old ${genNationality} fashion model named '${genName.trim()}'. ${genHeight}cm tall, ${genBodyType}. Skin tone: ${genSkinTone}. Hair styled in an ${genHairStyle}, hair color: ${genHairColor}. Vibe: ${genVibe}. Looking directly into the camera lens with warm confident eyes, neutral minimal fashion studio background, 35mm Arri Alexa fashion photography, sharp 8k resolution, raw editorial commercial quality.`;

    try {
      const res = await FlowService.generateImage(prompt);
      if (res && res.url) {
        setGeneratedPreviewUrl(res.url);
      }
    } catch (err: any) {
      console.error('Flow generation error:', err);
      setGenError(err.message || 'การเชื่อมต่อ Google Flow ล้มเหลว โปรดตรวจสอบว่าคลิกเข้าโปรเจกต์ใน Google Flow ไว้แล้ว');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyGeneratedModel = () => {
    const newModel: ModelPersona = {
      id: `ai-model-${Date.now()}`,
      name: genName.trim() || 'AI Model',
      nationality: genNationality,
      ethnicity: genEthnicity,
      age: genAge,
      heightCm: genHeight,
      bodyType: genBodyType,
      skinTone: genSkinTone,
      hairStyle: genHairStyle,
      hairColor: genHairColor,
      vibe: genVibe,
      avatarUrl: generatedPreviewUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      isCustom: true
    };

    const updated: DressProject = {
      ...project,
      modelPersona: newModel,
      updatedAt: new Date().toISOString()
    };
    onUpdateProject(updated);
    if (onProceedToStoryboard) onProceedToStoryboard();
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Applying Uploaded Model
  const handleApplyUploadedModel = () => {
    if (!uploadedPreview) return;

    const customUploadedModel: ModelPersona = {
      id: `upload-model-${Date.now()}`,
      name: uploadName.trim() || 'Custom Model',
      nationality: uploadNationality,
      ethnicity: 'Custom Presenter',
      age: uploadAge,
      heightCm: uploadHeight,
      bodyType: 'Custom Physique',
      skinTone: 'Custom Skin Tone',
      hairStyle: 'Custom Hairstyle as Uploaded',
      hairColor: 'Custom Hair Color',
      vibe: 'Brand Ambassador / Presenter',
      avatarUrl: uploadedPreview,
      isCustom: true
    };

    const updated: DressProject = {
      ...project,
      modelPersona: customUploadedModel,
      masterKeyframeUrl: setAsMasterAnchor ? uploadedPreview : project.masterKeyframeUrl,
      updatedAt: new Date().toISOString()
    };

    onUpdateProject(updated);
    if (onProceedToStoryboard) onProceedToStoryboard();
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                หมวดนางแบบ (Model Studio)
              </span>
              <span className="text-xs text-slate-400">
                เลือกแบบ • เจนโมเดลใหม่ • อัปโหลดภาพจริง
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              กำหนดนางแบบผู้สวมใส่สำหรับโฆษณา
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              นางแบบที่เลือกจะถูกล็อคโครงหน้า ทรงผม และสัดส่วนสรีระไว้เป็น Master Anchor ในทุกช็อตของวิดีโอ
            </p>
          </div>
        </div>

        {/* Current Active Model Badge */}
        {currentModel && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/90 border border-pink-500/40 shadow-lg">
            <img 
              src={currentModel.avatarUrl} 
              alt={currentModel.name} 
              className="w-12 h-14 rounded-xl object-cover border border-pink-400 shadow-sm" 
            />
            <div className="text-left text-xs">
              <span className="text-[9px] font-bold text-pink-400 uppercase block">นางแบบที่ใช้อยู่:</span>
              <div className="font-extrabold text-white text-sm">{currentModel.name}</div>
              <div className="text-[11px] text-purple-300">{currentModel.nationality} • {currentModel.heightCm} ซม.</div>
              <div className="text-[10px] text-slate-400">{currentModel.vibe.split(' ')[0]}</div>
            </div>
          </div>
        )}
      </div>

      {/* 3 Main Modes Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('preset')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'preset'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>1. เลือกจากคลังนางแบบยอดนิยม (Preset Models)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('generate')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'generate'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>2. สั่งเจนโมเดลใหม่ด้วย AI (Nano Banana Pro)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('upload')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'upload'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>3. อัปโหลดภาพนางแบบของตัวเอง (Upload Custom Photo)</span>
        </button>
      </div>

      {/* Mode 1: Preset Models Gallery */}
      {activeSubTab === 'preset' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              คลิกเพื่อเลือกนางแบบสำหรับโปรเจกต์นี้:
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              ทั้งหมด {PRESET_MODELS.length} สไตล์
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_MODELS.map((model) => {
              const isSelected = currentModel.id === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => handleSelectPreset(model)}
                  className={`p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex gap-4 items-start ${
                    isSelected
                      ? 'bg-slate-900 border-pink-500 shadow-xl shadow-pink-500/10 ring-2 ring-pink-500/40'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <img
                    src={model.avatarUrl}
                    alt={model.name}
                    className="w-20 h-28 rounded-2xl object-cover shadow-md flex-shrink-0"
                  />
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-white text-sm">{model.name}</h4>
                      {isSelected ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500 text-white flex items-center gap-1 shadow">
                          <Check className="w-2.5 h-2.5" /> ใช้งานอยู่
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">คลิกเพื่อเลือก</span>
                      )}
                    </div>
                    <div className="text-[11px] text-purple-300 font-semibold">
                      {model.nationality} • {model.age} ปี • สูง {model.heightCm} ซม.
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <span className="text-slate-500">ผิว:</span> {model.skinTone}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <span className="text-slate-500">ผม:</span> {model.hairStyle}
                    </div>
                    <div className="text-[10px] text-pink-300 pt-1 font-medium italic">
                      "{model.vibe}"
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: AI Generate New Model */}
      {activeSubTab === 'generate' && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>สตูดิโอสร้างนางแบบเสมือนจริงด้วย AI (Nano Banana Pro)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ปรับแต่งสัญชาติ โครงหน้า สีผิว ทรงผม และบุคลิกได้อย่างอิสระ
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateAiModel} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Form Inputs (Takes 7 cols) */}
            <div className="md:col-span-7 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อเรียกนางแบบ:</label>
                  <input
                    type="text"
                    value={genName}
                    onChange={(e) => setGenName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">สัญชาติ / เชื้อชาติ:</label>
                  <select
                    value={genNationality}
                    onChange={(e) => {
                      setGenNationality(e.target.value);
                      if (e.target.value.includes('ไทย')) setGenEthnicity('Southeast Asian / Thai');
                      else if (e.target.value.includes('ลูกครึ่ง')) setGenEthnicity('Eurasian');
                      else if (e.target.value.includes('เกาหลี')) setGenEthnicity('East Asian / Korean');
                      else if (e.target.value.includes('ญี่ปุ่น')) setGenEthnicity('East Asian / Japanese');
                      else setGenEthnicity('International High-Fashion');
                    }}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="ไทย (Thai)">ไทย (Thai)</option>
                    <option value="ลูกครึ่งไทย-อังกฤษ (Thai-British)">ลูกครึ่งไทย-อังกฤษ (Eurasian)</option>
                    <option value="เกาหลี (Korean)">เกาหลี (Korean)</option>
                    <option value="ญี่ปุ่น (Japanese)">ญี่ปุ่น (Japanese)</option>
                    <option value="ฝรั่งเศส (French)">ฝรั่งเศส (French)</option>
                    <option value="อิตาลี (Italian)">อิตาลี (Italian)</option>
                  </select>
                </div>
              </div>

              {/* Sliders: Age & Height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-semibold">อายุ:</span>
                    <span className="text-purple-300 font-bold">{genAge} ปี</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={38}
                    value={genAge}
                    onChange={(e) => setGenAge(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-semibold">ส่วนสูง:</span>
                    <span className="text-purple-300 font-bold">{genHeight} ซม.</span>
                  </div>
                  <input
                    type="range"
                    min={160}
                    max={185}
                    value={genHeight}
                    onChange={(e) => setGenHeight(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>

              {/* Styling: Skin, Hair, Vibe */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">โทนสีผิว:</label>
                  <select
                    value={genSkinTone}
                    onChange={(e) => setGenSkinTone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Warm Honey Beige (ผิวน้ำผึ้งนวลผ่องออร่า)">Warm Honey Beige (ผิวน้ำผึ้งนวลผ่องออร่าธรรมชาติ)</option>
                    <option value="Porcelain White (ผิวขาวออร่าแบบ Glass Skin)">Porcelain White (ผิวขาวออร่าแบบ Glass Skin)</option>
                    <option value="Golden Bronze (ผิวสีแทนประกายทองสุขภาพดี)">Golden Bronze (ผิวสีแทนประกายทองสุขภาพดี)</option>
                    <option value="Soft Peach Ivory (ผิวขาวอมชมพูละมุน)">Soft Peach Ivory (ผิวขาวอมชมพูละมุน)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ทรงผม (Hair Style):</label>
                  <select
                    value={genHairStyle}
                    onChange={(e) => setGenHairStyle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="เกล้าผมทรง Elegant Sleek Low Bun เรียบหรู">เกล้าผมทรง Elegant Sleek Low Bun เรียบหรู (แนะนำสำหรับงานเสื้อผ้า)</option>
                    <option value="ลอนคลายธรรมชาติสลวย (Soft Natural Waves)">ลอนคลายธรรมชาติสลวย (Soft Natural Waves)</option>
                    <option value="ผมตรงสลวยแสกกลางเงางาม (Glossy Sleek Straight)">ผมตรงสลวยแสกกลางเงางาม (Glossy Sleek Straight)</option>
                    <option value="บ็อบสั้นสไตล์ปารีเซียง (Chic Parisian Bob)">บ็อบสั้นสไตล์ปารีเซียง (Chic Parisian Bob)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">บุคลิกภาพ / อารมณ์ภาพ (Demeanor & Vibe):</label>
                  <input
                    type="text"
                    value={genVibe}
                    onChange={(e) => setGenVibe(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {genError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs text-left leading-relaxed">
                  <div className="font-bold text-rose-200 mb-1">⚠️ แจ้งเตือนข้อผิดพลาด:</div>
                  {genError}
                  {genError.includes('NO_FLOW_PROJECT') && (
                    <div className="mt-2 text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      💡 <strong>วิธีแก้:</strong> สลับไปที่แท็บ Chrome ของ Google Flow แล้วคลิกเปิดโปรเจกต์ใดโปรเจกต์หนึ่ง (หรือกด + New Project) เพื่อให้ FlowKit ตรวจจับ Project ID ครับ!
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition disabled:opacity-40"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGenerating ? 'กำลังสร้างภาพพอร์ตเทรตนางแบบบน Google Flow...' : '⚡ สั่งเจนรูปพอร์ตเทรตนางแบบด้วย AI (Nano Banana Pro)'}</span>
              </button>

            </div>

            {/* Generated Preview Card (Takes 5 cols) */}
            <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 text-center">
              <span className="text-xs font-bold text-slate-300 block text-left">
                ภาพพอร์ตเทรตนางแบบที่ได้:
              </span>

              <div className="relative aspect-[9/16] w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl">
                <img
                  src={generatedPreviewUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'}
                  alt="AI Model Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-left">
                  <span className="text-xs font-bold text-white">{genName}</span>
                  <span className="text-[10px] text-purple-300">{genNationality} • {genAge} ปี</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyGeneratedModel}
                className="w-full py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                <Check className="w-4 h-4" />
                <span>ล็อคเป็นนางแบบของโปรเจกต์นี้</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Mode 3: Upload Custom Model / Presenter */}
      {activeSubTab === 'upload' && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>อัปโหลดภาพนางแบบจริง / พรีเซนเตอร์ของแบรนด์</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ใช้รูปถ่ายจริงของนางแบบหรืออินฟลูเอนเซอร์เป็น Master Keyframe Plate เพื่อสร้างวิดีโอ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Upload Area (Takes 7 cols) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Dropzone */}
              <label className="border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-900/50 hover:bg-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition group">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 flex items-center justify-center mb-3 transition">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-white">ลากและวางภาพนางแบบ หรือคลิกเพื่ออัปโหลด</h4>
                <p className="text-xs text-slate-400 mt-1">รองรับ JPG, PNG, WebP (แนะนำภาพหน้าตรง แสงคมชัด)</p>
              </label>

              {/* Presenter Metadata Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อพรีเซนเตอร์ / นางแบบ:</label>
                  <input
                    type="text"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    placeholder="เช่น คุณแพรวา (อินฟลูเอนเซอร์)"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">สัญชาติ:</label>
                  <input
                    type="text"
                    value={uploadNationality}
                    onChange={(e) => setUploadNationality(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Master Anchor Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsMasterAnchor}
                  onChange={(e) => setSetAsMasterAnchor(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                />
                <div className="text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ใช้ภาพนี้เป็นภาพหน้าตรงหลัก (Master Frontal Anchor Plate)</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    ระบบจะใช้ใบหน้าและสัดส่วนจากรูปนี้ล็อคเป็นแม่แบบของทั้ง 6 ช็อตและวิดีโอ 10s
                  </div>
                </div>
              </label>

              <button
                type="button"
                onClick={handleApplyUploadedModel}
                disabled={!uploadedPreview}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>บันทึกและนำภาพนี้ไปใช้ใน Storyboard ทันที</span>
              </button>

            </div>

            {/* Uploaded Preview (Takes 5 cols) */}
            <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 text-center">
              <span className="text-xs font-bold text-slate-300 block text-left">
                พรีวิวรูปถ่ายที่อัปโหลด:
              </span>

              <div className="relative aspect-[9/16] w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl flex items-center justify-center">
                {uploadedPreview ? (
                  <img
                    src={uploadedPreview}
                    alt="Uploaded Model Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-600 text-xs p-6 space-y-2">
                    <Camera className="w-8 h-8 mx-auto text-slate-700" />
                    <p>ยังไม่มีภาพอัปโหลด</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
