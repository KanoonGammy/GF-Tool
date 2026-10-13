import React, { useState } from 'react';
import { X, Sparkles, Upload, Image as ImageIcon, Check, Loader2, UserCheck, ShieldCheck } from 'lucide-react';
import { DressProject, ModelPersona, ReferenceAngles } from '../types';
import { geminiBrain } from '../services/gemini';
import { PRESET_MODELS } from '../lib/modelLibrary';
import { ModelSelectorModal } from './ModelSelectorModal';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: DressProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('evening_dress');
  const [targetAudience, setTargetAudience] = useState('ผู้หญิงวัยทำงาน 25-35 ปี');
  const [uspInput, setUspInput] = useState('');
  const [usps, setUsps] = useState<string[]>([
    'เนื้อผ้าไหมชีฟองเกรดพรีเมียม สัมผัสนุ่มทิ้งตัว',
    'คัตติ้งเข้ารูปทรงสวย ใส่แล้วหุ่นเพรียวสง่า'
  ]);

  // 3 Dedicated Reference Angles: ด้านหน้า, ด้านหลัง, ซูมเนื้อผ้า
  const [frontImage, setFrontImage] = useState<string>('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80');
  const [backImage, setBackImage] = useState<string>('https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80');
  const [fabricZoomImage, setFabricZoomImage] = useState<string>('');

  // Selected Model Persona
  const [selectedModel, setSelectedModel] = useState<ModelPersona>(PRESET_MODELS[0]); // Default to Mint (Thai)
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAddUsp = () => {
    if (uspInput.trim()) {
      setUsps([...usps, uspInput.trim()]);
      setUspInput('');
    }
  };

  const handleRemoveUsp = (index: number) => {
    setUsps(usps.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'front' | 'back' | 'fabric') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const val = event.target.result as string;
        if (target === 'front') setFrontImage(val);
        else if (target === 'back') setBackImage(val);
        else if (target === 'fabric') setFabricZoomImage(val);
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick Preset Sample Fill
  const handleLoadSample = () => {
    setTitle('ชุดราตรียาวผ้าซาตินพรีเมียม (Midnight Emerald Evening Maxi)');
    setCategory('evening_dress');
    setTargetAudience('ผู้หญิงวัยทำงาน 25-40 ปี สำหรับงานกาล่าและงานแต่งงาน');
    setUsps([
      'ผ้าซาตินทอละเอียด เงางามระดับกูตูร์',
      'ผ่าข้างสูงช่วยให้ก้าวเดินสง่างามและดูเพรียวยาว',
      'คอถ่วงสไตล์วินเทจเสริมบุคลิกภาพ'
    ]);
    setFrontImage('https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80');
    setBackImage('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80');
    setFabricZoomImage('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80');
    setSelectedModel(PRESET_MODELS[1]); // Aria (Eurasian)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !frontImage) return;

    setIsAnalyzing(true);

    try {
      const activeImages = [frontImage, backImage, fabricZoomImage].filter(Boolean);
      
      // 1. Call Gemini to extract Garment DNA
      const dna = await geminiBrain.extractGarmentDna(activeImages);

      const referenceAngles: ReferenceAngles = {
        front: frontImage,
        back: backImage || undefined,
        fabricZoom: fabricZoomImage || undefined
      };

      const newProj: DressProject = {
        id: `dress-proj-${Date.now()}`,
        title: title.trim(),
        category,
        targetAudience,
        keySellingPoints: usps,
        status: 'dna_extracted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inputImages: activeImages,
        referenceAngles,
        modelPersona: selectedModel,
        garmentDna: dna,
        iterations: [],
        revisionMemories: []
      };

      onCreateProject(newProj);
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">สร้างแคมเปญชุดเดรสใหม่</h2>
                <p className="text-xs text-slate-400">ระบุภาพ 3 มุมมอง + เลือกนางแบบ + สกัด Garment DNA ด้วย Gemini</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLoadSample}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ใส่ชุดตัวอย่างด่วน</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ชื่อชุด / รุ่นสินค้า <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ชุดเดรสผ้าไหมชีฟองสีชมพูกะปิ (Dusty Rose Chiffon Maxi)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* 3 Dedicated Reference Image Slots: หน้า - หลัง - ซูมเนื้อผ้า */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  ภาพถ่ายชุดอ้างอิง 3 มุมมอง (Reference Cutouts)
                </label>
                <span className="text-[11px] text-pink-400">บังคับรูปด้านหน้า</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. ด้านหน้า (Front) */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-between text-center relative group">
                  <span className="text-[11px] font-bold text-pink-400 mb-2 flex items-center gap-1">
                    <span>1. รูปด้านหน้า</span>
                    <span className="text-rose-400">*</span>
                  </span>

                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-2">
                    {frontImage ? (
                      <>
                        <img src={frontImage} alt="Front" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFrontImage('')}
                          className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 transition">
                        <Upload className="w-5 h-5 text-slate-500 mb-1" />
                        <span className="text-[10px] text-slate-400">อัปโหลดรูปหน้า</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'front')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">สำหรับล็อคคอเสื้อ/เอว</span>
                </div>

                {/* 2. ด้านหลัง (Back) */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-between text-center relative group">
                  <span className="text-[11px] font-bold text-slate-300 mb-2">
                    2. รูปด้านหลัง (แนะนำ)
                  </span>

                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-2">
                    {backImage ? (
                      <>
                        <img src={backImage} alt="Back" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBackImage('')}
                          className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 transition">
                        <Upload className="w-5 h-5 text-slate-500 mb-1" />
                        <span className="text-[10px] text-slate-400">อัปโหลดรูปหลัง</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'back')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">สำหรับช็อตหมุนตัว 7-10s</span>
                </div>

                {/* 3. ซูมเนื้อผ้า (Fabric Zoom) */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-between text-center relative group">
                  <span className="text-[11px] font-bold text-slate-300 mb-2">
                    3. ซูมเนื้อผ้า/ลาย (ถ้ามี)
                  </span>

                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-2">
                    {fabricZoomImage ? (
                      <>
                        <img src={fabricZoomImage} alt="Fabric" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFabricZoomImage('')}
                          className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 transition">
                        <Upload className="w-5 h-5 text-slate-500 mb-1" />
                        <span className="text-[10px] text-slate-400">อัปโหลดซูมเนื้อผ้า</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'fabric')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">สำหรับช็อต Macro 3-7s</span>
                </div>

              </div>
            </div>

            {/* Model Selection Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-pink-950/40 border border-purple-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedModel.avatarUrl}
                  alt={selectedModel.name}
                  className="w-12 h-14 rounded-xl object-cover border border-purple-400/40 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{selectedModel.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                      {selectedModel.nationality}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ส่วนสูง {selectedModel.heightCm} ซม. • อายุ {selectedModel.age} ปี • {selectedModel.bodyType.split(' ')[0]}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModelModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>เปลี่ยน / เจนนางแบบ</span>
              </button>
            </div>

            {/* Category & Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ประเภทชุด
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value="evening_dress">เดรสออกงาน / งานแต่งงาน (Evening & Gala)</option>
                  <option value="casual_dress">เดรสลำลองแฟชั่นใส่สบาย (Casual & Resort)</option>
                  <option value="cocktail_party">ชุดค็อกเทลปาร์ตี้ (Cocktail Party)</option>
                  <option value="linen_minimal">มินิมอลลินิน / ชุดทำงาน (Minimal Linen & Workwear)</option>
                  <option value="thai_silk_modern">ผ้าไหมไทยประยุกต์ (Modern Thai Silk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  กลุ่มลูกค้าเป้าหมาย
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="เช่น ผู้หญิงวัยทำงาน 25-35 ปี"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* USPs / Selling points */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                จุดเด่นสินค้าสำหรับใส่ในเสียงพากย์โฆษณา (USP)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="พิมพ์จุดเด่น เช่น ผ่าข้างสูงก้าวเดินสง่า, ซับในซาติน..."
                  value={uspInput}
                  onChange={(e) => setUspInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUsp())}
                  className="flex-1 px-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={handleAddUsp}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl transition font-medium"
                >
                  เพิ่มจุดเด่น
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {usps.map((usp, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20"
                  >
                    <span>{usp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUsp(idx)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isAnalyzing || !frontImage}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-pink-500/25 flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini กำลังสกัด Garment DNA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>สร้างแคมเปญ & วิเคราะห์ DNA</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Model Selector Modal */}
      <ModelSelectorModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        selectedModelId={selectedModel.id}
        onSelectModel={(model) => setSelectedModel(model)}
      />
    </>
  );
};
