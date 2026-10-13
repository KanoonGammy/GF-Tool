import React, { useState } from 'react';
import { X, Sparkles, UserCheck, Plus, Check, Sliders, Globe, Heart } from 'lucide-react';
import { ModelPersona } from '../types';
import { PRESET_MODELS } from '../lib/modelLibrary';

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModelId?: string;
  onSelectModel: (model: ModelPersona) => void;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedModelId,
  onSelectModel
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  // Custom Model Form State
  const [customName, setCustomName] = useState('พราว (Praew)');
  const [nationality, setNationality] = useState('ไทย (Thai)');
  const [ethnicity, setEthnicity] = useState('Southeast Asian / Thai');
  const [age, setAge] = useState<number>(24);
  const [heightCm, setHeightCm] = useState<number>(173);
  const [bodyType, setBodyType] = useState('Slender Runway (เพรียวระหงส์ สัดส่วนนางแบบ)');
  const [skinTone, setSkinTone] = useState('Warm Honey Beige (ผิวน้ำผึ้งนวลผ่องออร่า)');
  const [hairStyle, setHairStyle] = useState('ลอนคลายธรรมชาติสลวย (Soft Natural Waves)');
  const [hairColor, setHairColor] = useState('น้ำตาลเข้มเอสเพรสโซ่ (Dark Espresso Brown)');
  const [vibe, setVibe] = useState('หรูหรา มั่นใจ ทันสมัย (Confident Modern Luxury)');
  const [customAvatar, setCustomAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const handleCreateCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    const newModel: ModelPersona = {
      id: `custom-model-${Date.now()}`,
      name: customName.trim() || 'AI Custom Model',
      nationality,
      ethnicity,
      age,
      heightCm,
      bodyType,
      skinTone,
      hairStyle,
      hairColor,
      vibe,
      avatarUrl: customAvatar,
      isCustom: true
    };
    onSelectModel(newModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">เลือกหรือเจนนางแบบโฆษณา (Fashion Model Persona)</h2>
            <p className="text-xs text-slate-400">เลือกนางแบบที่มีอยู่แล้ว หรือปรับแต่งสัญชาติ อายุ ส่วนสูง และสไตล์ได้อิสระ</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'preset'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>นางแบบยอดนิยม (Preset Models)</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>+ เจนนางแบบคนใหม่ตามใจชอบ (Custom Generator)</span>
          </button>
        </div>

        {/* Tab 1: Preset Models */}
        {activeTab === 'preset' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PRESET_MODELS.map((model) => {
              const isSelected = selectedModelId === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model);
                    onClose();
                  }}
                  className={`group relative bg-slate-950/70 border rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between ${
                    isSelected
                      ? 'border-pink-500 bg-pink-950/20 shadow-lg shadow-pink-500/10 ring-1 ring-pink-500'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Avatar */}
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3 bg-slate-900 border border-slate-800">
                      <img src={model.avatarUrl} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute top-2 right-2">
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] text-white flex items-center justify-between">
                        <span>{model.heightCm} cm</span>
                        <span>อายุ {model.age} ปี</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-white group-hover:text-pink-300 transition line-clamp-1">
                      {model.name}
                    </h4>
                    <div className="text-xs text-pink-400 font-medium mt-0.5">{model.nationality}</div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{model.vibe}</div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{model.bodyType.split(' ')[0]}</span>
                    <span className="font-semibold text-pink-400 group-hover:underline">เลือกคนนี้</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Custom Generator */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCreateCustomModel} className="space-y-4">
            
            {/* Name & Nationality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ชื่อเรียกนางแบบ (Model Name)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="เช่น มะปราง, Jennifer, ซูจิน"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  สัญชาติ / เชื้อชาติ (Nationality & Ethnicity)
                </label>
                <select
                  value={nationality}
                  onChange={(e) => {
                    setNationality(e.target.value);
                    if (e.target.value.includes('ไทย')) setEthnicity('Southeast Asian / Thai');
                    else if (e.target.value.includes('เกาหลี') || e.target.value.includes('ญี่ปุ่น')) setEthnicity('East Asian');
                    else if (e.target.value.includes('ฝรั่งเศส') || e.target.value.includes('ยุโรป')) setEthnicity('European / Caucasian');
                    else if (e.target.value.includes('ลูกครึ่ง')) setEthnicity('Eurasian');
                  }}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="ไทย (Thai)">ไทย (Thai)</option>
                  <option value="ลูกครึ่งไทย-ยุโรป (Thai-Eurasian)">ลูกครึ่งไทย-ยุโรป (Thai-Eurasian)</option>
                  <option value="เกาหลี (Korean)">เกาหลี (Korean)</option>
                  <option value="ญี่ปุ่น (Japanese)">ญี่ปุ่น (Japanese)</option>
                  <option value="ฝรั่งเศส / ยุโรป (French / Caucasian)">ฝรั่งเศส / ยุโรป (French / Caucasian)</option>
                  <option value="อเมริกัน / คอเคเซียน (American Caucasian)">อเมริกัน / คอเคเซียน (American Caucasian)</option>
                  <option value="ละตินอเมริกา (Latina)">ละตินอเมริกา (Latina)</option>
                  <option value="สแกนดิเนเวีย (Scandinavian)">สแกนดิเนเวีย (Scandinavian)</option>
                </select>
              </div>
            </div>

            {/* Age & Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">อายุ (Age): {age} ปี</label>
                </div>
                <input
                  type="range"
                  min={18}
                  max={45}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">ส่วนสูง (Height): {heightCm} ซม.</label>
                </div>
                <input
                  type="range"
                  min={160}
                  max={185}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Body Type & Skin Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  รูปร่าง & สรีระ (Body Type)
                </label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="Slender Runway (เพรียวระหงส์ สัดส่วนนางแบบ)">Slender Runway (เพรียวระหงส์ สัดส่วนนางแบบ)</option>
                  <option value="Petite (ตัวเล็ก กะทัดรัด น่ารักหวาน)">Petite (ตัวเล็ก กะทัดรัด น่ารักหวาน)</option>
                  <option value="Curvy & S-Line (มีทรวดทรง อก-เอว-สะโพกชัดเจน)">Curvy & S-Line (มีทรวดทรง อก-เอว-สะโพกชัดเจน)</option>
                  <option value="Athletic & Toned (หุ่นกระชับ สุขภาพดี สง่า)">Athletic & Toned (หุ่นกระชับ สุขภาพดี สง่า)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  โทนสีผิว (Skin Tone)
                </label>
                <select
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="Warm Honey Beige (ผิวน้ำผึ้งนวลผ่องออร่า)">Warm Honey Beige (ผิวน้ำผึ้งนวลผ่องออร่า)</option>
                  <option value="Porcelain Glass Skin (ผิวขาวออร่าแบบเกาหลี)">Porcelain Glass Skin (ผิวขาวออร่าแบบเกาหลี)</option>
                  <option value="Golden Sun-kissed Tan (ผิวสองสีแทนประกายทอง)">Golden Sun-kissed Tan (ผิวสองสีแทนประกายทอง)</option>
                  <option value="Fair Rosy Undertone (ผิวขาวอมชมพูธรรมชาติ)">Fair Rosy Undertone (ผิวขาวอมชมพูธรรมชาติ)</option>
                </select>
              </div>
            </div>

            {/* Hair Style & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ทรงผม (Hair Style)
                </label>
                <select
                  value={hairStyle}
                  onChange={(e) => setHairStyle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="ลอนคลายธรรมชาติสลวย (Soft Natural Waves)">ลอนคลายธรรมชาติสลวย (Soft Natural Waves)</option>
                  <option value="เกล้าผมทรงหรูหรา (Elegant Sleek Low Bun)">เกล้าผมทรงหรูหรา (Elegant Sleek Low Bun)</option>
                  <option value="ผมตรงสลวยแสกกลางเงางาม (Glossy Sleek Straight)">ผมตรงสลวยแสกกลางเงางาม (Glossy Sleek Straight)</option>
                  <option value="บ็อบสั้นชิคสไตล์ปารีเซียง (French Chic Bob)">บ็อบสั้นชิคสไตล์ปารีเซียง (French Chic Bob)</option>
                  <option value="หางม้าสูงโฉบเฉี่ยว (Sleek High Ponytail)">หางม้าสูงโฉบเฉี่ยว (Sleek High Ponytail)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ลุค & คาแรคเตอร์ (Vibe & Expression)
                </label>
                <input
                  type="text"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  placeholder="เช่น สวยหวานลูกคุณหนู, โฉบเฉี่ยวมั่นใจ, เรียบหรูคลาสสิก"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Prompt Preview */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                Prompt Token ที่จะถูกส่งต่อให้ Google Flow:
              </span>
              <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                [MODEL]: Professional fashion model "{customName}", {age}yo {nationality} ({ethnicity}), {heightCm}cm, {bodyType}, skin: {skinTone}, hair: {hairColor} in {hairStyle}. Vibe: {vibe}.
              </p>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('preset')}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-pink-500/25 flex items-center gap-1.5 transition"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกและเลือกใช้นางแบบคนนี้</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
