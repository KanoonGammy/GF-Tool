import React, { useState } from 'react';
import { X, Sparkles, Upload, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { DressProject } from '../types';
import { geminiBrain } from '../services/gemini';

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
    'เนื้อผ้าเกรดพรีเมียม สัมผัสนุ่มทิ้งตัว',
    'คัตติ้งเข้ารูปทรงสวย ใส่แล้วหุ่นเพรียว'
  ]);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'
  ]);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsAnalyzing(true);

    try {
      // 1. Call Gemini to extract Garment DNA
      const dna = await geminiBrain.extractGarmentDna(images);

      const newProj: DressProject = {
        id: `dress-proj-${Date.now()}`,
        title: title.trim(),
        category,
        targetAudience,
        keySellingPoints: usps,
        status: 'dna_extracted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inputImages: images,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">สร้างแคมเปญชุดเดรสใหม่</h2>
            <p className="text-xs text-slate-400">ระบบจะวิเคราะห์ Garment DNA เพื่อล็อครายละเอียดเนื้อผ้าและคัตติ้ง</p>
          </div>
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
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
            />
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
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-pink-500"
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
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-pink-500"
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
                placeholder="พิมพ์จุดเด่น เช่น ลายพิมพ์ดอกไม้ไม่ลอก, มีซับในทั้งตัว..."
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

          {/* Reference Images */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              รูปภาพชุดต้นฉบับ (แนะนำ: ด้านหน้า, ด้านหลัง, ซูมเนื้อผ้า)
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-800 group">
                  <img src={img} alt="reference" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <label className="aspect-square border-2 border-dashed border-slate-800 hover:border-pink-500/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/40 hover:bg-slate-950">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-400 font-medium">เพิ่มรูปภาพ</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
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
              disabled={isAnalyzing}
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
  );
};
