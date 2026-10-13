import React from 'react';
import { RevisionMemory } from '../types';
import { BrainCircuit, ShieldCheck, Ban, ArrowDown, Clock, Sparkles } from 'lucide-react';

interface CumulativeMemoryTimelineProps {
  memories: RevisionMemory[];
}

export const CumulativeMemoryTimeline: React.FC<CumulativeMemoryTimelineProps> = ({ memories }) => {
  if (!memories || memories.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">ยังไม่มีประวัติการขอแก้ไข</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          เมื่อคุณหรือเพื่อนกด "ขอแก้ไข" ระบบ Gemini Brain จะเริ่มบันทึกกฎความจำและ Negative Prompts ลงในไทม์ไลน์นี้โดยอัตโนมัติ
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>AI Cumulative Memory Bank</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {memories.length} กฎความจำ
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              สิ่งที่ Google AI Studio (Gemini) ได้เรียนรู้จากฟีดแบ็กการตรวจงานของทีม
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ความจำถูกล็อคเข้า Prompt ทุกรอบถัดไป</span>
          </span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {memories.map((mem, idx) => (
          <div key={mem.id} className="relative group">
            
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </div>

            <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4.5 space-y-3">
              
              {/* Iteration & Meta */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                  ฟีดแบ็กจากรอบที่ {mem.iteration}
                </span>
                <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  {new Date(mem.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                </span>
              </div>

              {/* User Feedback */}
              <div className="text-xs bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
                <span className="text-slate-400 font-semibold">สิ่งที่ผู้ใช้สั่งแก้:</span>
                <p className="text-slate-200 mt-1 italic leading-relaxed">
                  "{mem.userFeedbackText}"
                </p>
              </div>

              {/* Gemini AI Learned Rule */}
              <div className="text-xs bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>กฎที่ Gemini กลั่นเป็นความจำถาวร:</span>
                </div>
                <p className="text-indigo-100 font-medium leading-relaxed">
                  {mem.aiLearnedRule}
                </p>
              </div>

              {/* Locked Negatives */}
              {mem.addedNegativeTokens?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <Ban className="w-3 h-3 text-rose-400" />
                    <span>Negative Prompts ที่ถูกบันทึกเพิ่ม:</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mem.addedNegativeTokens.map((token, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
