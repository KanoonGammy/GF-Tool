import React, { useState } from 'react';
import { DressProject, GarmentDNA, RevisionMemory } from '../types';
import { compileFlowPrompt } from '../services/flowPromptCompiler';
import { Copy, Check, Sparkles, Video, Volume2, ShieldCheck, ExternalLink, Upload, Film, User, Layers, Info } from 'lucide-react';

interface GoogleFlowPromptCardProps {
  project: DressProject;
  dna: GarmentDNA;
  memories: RevisionMemory[];
  onAddIterationVideo: (videoUrl: string, coverImageUrl?: string) => void;
}

export const GoogleFlowPromptCard: React.FC<GoogleFlowPromptCardProps> = ({
  project,
  dna,
  memories,
  onAddIterationVideo
}) => {
  const [copiedPos, setCopiedPos] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [videoInputUrl, setVideoInputUrl] = useState('');
  const [isAttachingVideo, setIsAttachingVideo] = useState(false);

  const compiled = compileFlowPrompt(project, dna, memories);

  const handleCopyPositive = () => {
    navigator.clipboard.writeText(compiled.positivePrompt);
    setCopiedPos(true);
    setTimeout(() => setCopiedPos(false), 2000);
  };

  const handleCopyNegative = () => {
    navigator.clipboard.writeText(compiled.negativePrompt);
    setCopiedNeg(true);
    setTimeout(() => setCopiedNeg(false), 2000);
  };

  const handleCopySingleToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  const handleAttachVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoInputUrl.trim()) return;
    onAddIterationVideo(videoInputUrl.trim());
    setVideoInputUrl('');
    setIsAttachingVideo(false);
  };

  const handleSampleVideo = (url: string) => {
    onAddIterationVideo(url);
    setIsAttachingVideo(false);
  };

  const frontImg = project.referenceAngles?.front || project.inputImages?.[0];
  const backImg = project.referenceAngles?.back || project.inputImages?.[1];
  const fabricImg = project.referenceAngles?.fabricZoom;
  const model = project.modelPersona;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">Google Flow (Omni-Flash 1.1) Video Studio</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                10s • 9:16 Vertical
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ขับเคลื่อนโดย Gemini 2.5 Brain (วิเคราะห์ DNA + คุมความจำ) ส่งเข้า Google Flow Omni-Flash (เรนเดอร์คลิป + เสียงไทย + SFX)
            </p>
          </div>
        </div>

        <a
          href="https://labs.google/fx/tools/flow"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
        >
          <span>เปิด Google Flow Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Reference Cutouts & Model Persona Bar */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            <span>Reference Tokens ที่ต้องแนบเข้า Prompt Bar ของ Google Flow:</span>
          </span>
          <span className="text-[11px] text-slate-500">ลากรูปไปวางใน Google Flow ได้เลย</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Front Cutout Token */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
              {frontImg && <img src={frontImg} alt="front" className="w-full h-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-slate-200 truncate">1. ด้านหน้า</div>
              <button
                type="button"
                onClick={() => handleCopySingleToken('@dress_front_cutout')}
                className="text-[10px] text-pink-400 font-mono hover:underline flex items-center gap-0.5 mt-0.5"
              >
                <span>{copiedToken === '@dress_front_cutout' ? 'คัดลอกแล้ว' : '@dress_front_cutout'}</span>
              </button>
            </div>
          </div>

          {/* Back Cutout Token */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
              {backImg ? (
                <img src={backImg} alt="back" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">-</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-slate-200 truncate">2. ด้านหลัง</div>
              <button
                type="button"
                onClick={() => handleCopySingleToken('@dress_back_cutout')}
                className="text-[10px] text-pink-400 font-mono hover:underline flex items-center gap-0.5 mt-0.5"
              >
                <span>{copiedToken === '@dress_back_cutout' ? 'คัดลอกแล้ว' : '@dress_back_cutout'}</span>
              </button>
            </div>
          </div>

          {/* Fabric Zoom Token */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
              {fabricImg ? (
                <img src={fabricImg} alt="fabric" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">-</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-slate-200 truncate">3. ซูมเนื้อผ้า</div>
              <button
                type="button"
                onClick={() => handleCopySingleToken('@fabric_zoom_cutout')}
                className="text-[10px] text-pink-400 font-mono hover:underline flex items-center gap-0.5 mt-0.5"
              >
                <span>{copiedToken === '@fabric_zoom_cutout' ? 'คัดลอกแล้ว' : '@fabric_zoom_cutout'}</span>
              </button>
            </div>
          </div>

          {/* Model Persona Token */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 border border-purple-400/40">
              {model?.avatarUrl && <img src={model.avatarUrl} alt="model" className="w-full h-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-purple-300 truncate">4. {model ? model.name : 'นางแบบ'}</div>
              <div className="text-[10px] text-slate-400 truncate">{model ? `${model.heightCm}cm ${model.nationality}` : 'สแตนดาร์ด'}</div>
            </div>
          </div>

        </div>
      </div>

      {/* Rules Applied from Past Memory Alert */}
      {compiled.cumulativeRulesApplied.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>กฎความจำที่นำมาบังคับใช้ในรอบนี้ (Cumulative Memory Rules Active):</span>
          </div>
          <ul className="text-xs text-indigo-200/90 space-y-1">
            {compiled.cumulativeRulesApplied.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-400">✓</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Positive Prompt Card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                คำสั่งสร้างวิดีโอ (Positive Prompt)
              </span>
              <button
                onClick={handleCopyPositive}
                className="text-xs px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 font-semibold flex items-center gap-1 transition"
              >
                {copiedPos ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>คัดลอกแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>1-Click Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="text-[11px] text-slate-300 bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 h-52 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
              {compiled.positivePrompt}
            </pre>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-slate-400" />
            <span>มีเสียงพากย์สรรพคุณภาษาไทย + SFX ตามไทม์โค้ดในตัว</span>
          </div>
        </div>

        {/* Negative Prompt Matrix Card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                ชุดคำสั่งห้าม (Compiled Negative Matrix)
              </span>
              <button
                onClick={handleCopyNegative}
                className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1 transition"
              >
                {copiedNeg ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>คัดลอกแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>1-Click Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-rose-200/90 bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 h-52 overflow-y-auto font-mono leading-relaxed">
              {compiled.negativePrompt}
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-500">
            * รวมคำสั่งห้ามจากสเปกเนื้อผ้า + ทุกข้อที่เคยขอแก้ไขในอดีตเรียบร้อยแล้ว
          </div>
        </div>

      </div>

      {/* Action to Attach Generated Video for DoD Review */}
      <div className="bg-gradient-to-r from-pink-950/30 via-slate-950 to-indigo-950/30 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">เมื่อได้คลิปวิดีโอจาก Google Flow แล้ว:</div>
          <div className="text-xs text-slate-400 mt-0.5">
            นำไฟล์หรือ URL คลิปเข้ามา เพื่อให้ทีมงานเปิดห้องตรวจรับ Definition of Done (DoD)
          </div>
        </div>

        <button
          onClick={() => setIsAttachingVideo(!isAttachingVideo)}
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-600/25 flex items-center gap-1.5 transition"
        >
          <Upload className="w-4 h-4" />
          <span>นำคลิปเข้าห้องตรวจรับงาน</span>
        </button>
      </div>

      {/* Attach Video Input Drawer */}
      {isAttachingVideo && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          <form onSubmit={handleAttachVideo} className="flex gap-2">
            <input
              type="url"
              placeholder="วาง URL วิดีโอ MP4 จาก Flow / Cloudflare R2 / ลิงก์ทดสอบ..."
              value={videoInputUrl}
              onChange={(e) => setVideoInputUrl(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold rounded-xl transition"
            >
              บันทึกเพื่อเริ่มตรวจ
            </button>
          </form>

          {/* Preset Sample Videos for quick testing */}
          <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
            <span>หรือคลิกวิดีโอจำลอง:</span>
            <button
              type="button"
              onClick={() => handleSampleVideo('https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-dress-posing-40742-large.mp4')}
              className="text-pink-400 hover:underline"
            >
              [ตัวอย่างคลิปแฟชั่น 1]
            </button>
            <button
              type="button"
              onClick={() => handleSampleVideo('https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-in-a-pink-dress-posing-in-slow-motion-41808-large.mp4')}
              className="text-indigo-400 hover:underline"
            >
              [ตัวอย่างคลิปแฟชั่น 2]
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
