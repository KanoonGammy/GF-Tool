import React, { useState } from 'react';
import { X, Sparkles, AlertOctagon, Ban, Loader2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { FeedbackCategory, GarmentDNA, RevisionMemory } from '../types';
import { geminiBrain } from '../services/gemini';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  iterationNumber: number;
  dna: GarmentDNA;
  historicalMemories: RevisionMemory[];
  onSubmitRevision: (newMemory: RevisionMemory) => void;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({
  isOpen,
  onClose,
  iterationNumber,
  dna,
  historicalMemories,
  onSubmitRevision
}) => {
  const [category, setCategory] = useState<FeedbackCategory>('cut_morphing');
  const [feedbackText, setFeedbackText] = useState('');
  const [negativeTagInput, setNegativeTagInput] = useState('');
  const [negativeTokens, setNegativeTokens] = useState<string[]>([
    'morphing neckline',
    'plastic sheen'
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const quickSuggestions: Record<FeedbackCategory, string[]> = {
    cut_morphing: ['morphing sleeves', 'changing dress length', 'distorted waistline', 'wide gaping collar'],
    fabric_texture: ['plastic sheen', 'stiff synthetic fabric', 'blurry texture', 'unnatural shine'],
    pattern_drift: ['enlarged floral prints', 'shifting pattern scale', 'distorted embroidery', 'asymmetrical print'],
    lighting_color: ['neon oversaturation', 'wrong color hue', 'washed out color', 'harsh overexposure'],
    model_motion: ['fast aggressive walking', 'violent spinning', 'jerky camera', 'unnatural limb angles'],
    audio_messaging: ['muffled voiceover', 'rushed speech', 'distorted music', 'inconsistent volume']
  };

  const handleAddTag = () => {
    if (negativeTagInput.trim() && !negativeTokens.includes(negativeTagInput.trim())) {
      setNegativeTokens([...negativeTokens, negativeTagInput.trim()]);
      setNegativeTagInput('');
    }
  };

  const handleTogglePresetTag = (tag: string) => {
    if (negativeTokens.includes(tag)) {
      setNegativeTokens(negativeTokens.filter(t => t !== tag));
    } else {
      setNegativeTokens([...negativeTokens, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNegativeTokens(negativeTokens.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsProcessing(true);

    try {
      // 1. Ask Gemini to reflect on the revision and derive a permanent memory rule
      const reflection = await geminiBrain.reflectOnRevision(
        feedbackText,
        category,
        dna,
        historicalMemories
      );

      const allNegatives = Array.from(new Set([...negativeTokens, ...reflection.recommendedNegatives]));

      const newMemory: RevisionMemory = {
        id: `mem-${Date.now()}`,
        iteration: iterationNumber,
        createdAt: new Date().toISOString(),
        category,
        userFeedbackText: feedbackText.trim(),
        addedNegativeTokens: allNegatives,
        aiLearnedRule: reflection.learnedRule
      };

      onSubmitRevision(newMemory);
      onClose();
    } catch (err) {
      console.error('Error submitting revision reflection:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">บันทึกการขอแก้ไข (Revision Feedback)</h2>
            <p className="text-xs text-slate-400">ระบบความจำ AI จะเรียนรู้และสังเคราะห์ Negative Prompt เพื่อไม่ให้ผิดซ้ำ</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              หมวดหมู่อาการที่ต้องแก้ไข <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'cut_morphing', label: 'คัตติ้งหลุดทรง / Morphing' },
                { id: 'fabric_texture', label: 'เนื้อผ้าไม่สมจริง / เงาพลาสติก' },
                { id: 'pattern_drift', label: 'ลายผ้าเพี้ยน / ขยายใหญ่' },
                { id: 'lighting_color', label: 'สีเพี้ยนจาก Hex' },
                { id: 'model_motion', label: 'โมเดลขยับเร็ว / บังชุด' },
                { id: 'audio_messaging', label: 'เสียงพากย์ / ซาวด์เอฟเฟกต์' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id as FeedbackCategory)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition ${
                    category === item.id
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              คำอธิบายรายละเอียดที่ต้องการให้ปรับปรุง <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="เช่น ช่วงคอเสื้อหลุดเป็นคอกว้างเกินไป อยากให้คงคอวีพอดีตัวตามภาพต้นฉบับ และห้ามให้ผ้าเปลี่ยนเป็นมันวาว..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 leading-relaxed"
            />
          </div>

          {/* Negative Prompts Specification */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-rose-400" />
                <span>ระบุ Negative Prompts เพิ่มเติมสำหรับรอบต่อไป</span>
              </label>
              <span className="text-[11px] text-slate-500">คำสั่งห้ามที่ต้องล็อคไว้</span>
            </div>

            {/* Quick chips recommendations */}
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 w-full mb-1">แท็กแนะนำสำหรับหมวดนี้ (คลิกเพื่อเพิ่ม):</span>
              {quickSuggestions[category].map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTogglePresetTag(sug)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition ${
                    negativeTokens.includes(sug)
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  + {sug}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="พิมพ์ข้อห้ามภาษาอังกฤษ เช่น low resolution, deformed collar..."
                  value={negativeTagInput}
                  onChange={(e) => setNegativeTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500"
                />
                <Tag className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                เพิ่มแท็ก
              </button>
            </div>

            {/* Active Negative Tokens display */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {negativeTokens.map((token, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono"
                >
                  <span>{token}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(token)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* AI Memory Assurance */}
          <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-200/80 leading-relaxed">
              เมื่อกดยืนยัน <strong>Google AI Studio (Gemini)</strong> จะแปลงคำสั่งของคุณเป็น <em>"กฎความจำถาวร"</em> พร้อมคำสั่ง Negative Matrix เพื่อให้พร้อมสำหรับสร้างวิดีโอรอบต่อไปทันที
            </p>
          </div>

          {/* Action Buttons */}
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
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini กำลังกลั่นกรองความจำ...</span>
                </>
              ) : (
                <>
                  <span>บันทึกความจำ & รันรอบใหม่</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
