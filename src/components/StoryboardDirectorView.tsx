import React, { useState } from 'react';
import { DressProject, GarmentDNA, StoryboardShot, PromptDiff } from '../types';
import { generateDefaultStoryboard, refineStoryboardAndPrompt } from '../services/storyboardEngine';
import { compileFlowPrompt } from '../services/flowPromptCompiler';
import { 
  Sparkles, Film, Check, Copy, AlertOctagon, RotateCcw, ArrowRight, 
  ExternalLink, Layers, ShieldCheck, Plus, Minus, Edit3, Eye, Video, Send, Loader2
} from 'lucide-react';

interface StoryboardDirectorViewProps {
  project: DressProject;
  dna: GarmentDNA;
  onProceedToVideoGeneration: (positivePrompt: string, negativePrompt: string) => void;
  onUpdateProject: (updated: DressProject) => void;
}

export const StoryboardDirectorView: React.FC<StoryboardDirectorViewProps> = ({
  project,
  dna,
  onProceedToVideoGeneration,
  onUpdateProject
}) => {
  // Initial or existing storyboard
  const [shots, setShots] = useState<StoryboardShot[]>(
    project.storyboard && project.storyboard.length === 6 
      ? project.storyboard 
      : generateDefaultStoryboard(project, dna)
  );

  const compiled = compileFlowPrompt(project, dna, project.revisionMemories || []);
  const [currentPositivePrompt, setCurrentPositivePrompt] = useState<string>(compiled.positivePrompt);
  const [currentNegativePrompt, setCurrentNegativePrompt] = useState<string>(compiled.negativePrompt);

  // User rejection / feedback loop state
  const [userComplaint, setUserComplaint] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [latestDiff, setLatestDiff] = useState<PromptDiff | null>(
    project.promptDiffHistory && project.promptDiffHistory.length > 0 
      ? project.promptDiffHistory[project.promptDiffHistory.length - 1] 
      : null
  );

  const [copiedPos, setCopiedPos] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);

  // Quick preset complaints
  const quickComplaints = [
    'กล้องหมุนเร็วเกินไป อยากให้ช้าลง 50%',
    'เน้นซูมลายดอกไม้และเนื้อผ้าให้ชัดขึ้น',
    'ล็อคขอบริบคอเสื้อสีฟ้าพาสเทลแน่นๆ ห้ามกลืนสี',
    'แขนเสื้อสั้นเหนือข้อศอก ห้ามยืดเป็นแขนยาว',
    'ให้นางแบบเดินช้าลง นุ่มนวลขึ้น'
  ];

  // Handler for user's iterative refinement
  const handleRefinePrompt = (complaintText?: string) => {
    const text = complaintText || userComplaint;
    if (!text.trim()) return;

    setIsRefining(true);

    setTimeout(() => {
      const { revisedShots, revisedPrompt, revisedNegative, diff } = refineStoryboardAndPrompt(
        shots,
        currentPositivePrompt,
        currentNegativePrompt,
        text.trim()
      );

      setShots(revisedShots);
      setCurrentPositivePrompt(revisedPrompt);
      setCurrentNegativePrompt(revisedNegative);
      setLatestDiff(diff);
      setUserComplaint('');

      const updatedHistory = [...(project.promptDiffHistory || []), diff];
      const updatedProj: DressProject = {
        ...project,
        storyboard: revisedShots,
        promptDiffHistory: updatedHistory,
        updatedAt: new Date().toISOString()
      };

      onUpdateProject(updatedProj);
      setIsRefining(false);
    }, 400);
  };

  const handleApproveAndGenerate = () => {
    onProceedToVideoGeneration(currentPositivePrompt, currentNegativePrompt);
  };

  const model = project.modelPersona;

  return (
    <div className="space-y-6">
      
      {/* Header Banner: Garment & Model DNA Summary */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-pink-950/40 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              หน้าหลัก: Storyboard & Prompt Studio
            </span>
            <span className="text-xs text-slate-400">
              {project.category}
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-white mt-1">
            สตูดิโอจำลองวิดีโอก่อนเรนเดอร์ (2x3 Storyboard Grid)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ตรวจเช็ก 6 ช็อตของวิดีโอ 10 วินาที หากพอใจกดสร้างได้ทันที หรือสั่งแก้ prompt ได้เรื่อยๆ จนกว่าจะถูกใจ
          </p>
        </div>

        {/* Selected Model Persona Badge */}
        {model && (
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <img src={model.avatarUrl} alt={model.name} className="w-10 h-12 rounded-xl object-cover border border-purple-400/40 shadow-sm" />
            <div className="text-left text-xs">
              <div className="font-bold text-white">{model.name}</div>
              <div className="text-[11px] text-purple-300">{model.nationality} • {model.heightCm}cm</div>
              <div className="text-[10px] text-slate-400">{model.vibe.split(' ')[0]}</div>
            </div>
          </div>
        )}
      </div>

      {/* The 2x3 Storyboard Grid (6 Shots Visual Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Film className="w-4 h-4 text-pink-400" />
            <span>โครงสร้างลำดับภาพ 6 ช็อต (2x3 Storyboard Grid • 10 วินาที)</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            อัตราส่วน 9:16 Vertical • Omni-Flash
          </span>
        </div>

        {/* 2 Rows x 3 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shots.map((shot) => (
            <div
              key={shot.shotNumber}
              className="bg-slate-950/70 border border-slate-800/90 hover:border-pink-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group shadow-md"
            >
              <div>
                {/* Shot Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/30">
                    Shot #{shot.shotNumber}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    {shot.timecode}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition line-clamp-1 mb-1">
                  {shot.title}
                </h4>

                <div className="text-[10px] font-medium text-purple-400 mb-2">
                  มุมกล้อง: {shot.shotType}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {shot.description}
                </p>
              </div>

              {/* Shot Footer: Token & Focus */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 truncate max-w-[120px]">
                  โฟกัส: {shot.focusArea}
                </span>
                {shot.refToken && (
                  <span className="font-mono text-pink-400/90 font-semibold bg-pink-950/40 px-1.5 py-0.5 rounded border border-pink-500/20">
                    {shot.refToken}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diff Box: แสดงให้เห็นชัดเจนว่า "แก้ไขตรงไหนไป เพิ่มตรงไหนไป" */}
      {latestDiff && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>สรุปการเปลี่ยนแปลงในรอบนี้ (Prompt & Storyboard Diff Log):</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              อัปเดตเมื่อ {latestDiff.timestamp} น.
            </span>
          </div>

          <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-semibold">คำสั่งแก้ของคุณ:</span>
            <span className="text-white ml-1.5 italic">"{latestDiff.userComplaint}"</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
            {/* Added */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-2.5 space-y-1">
              <span className="text-emerald-300 font-bold flex items-center gap-1 text-[10px] uppercase">
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>สิ่งที่เพิ่มเข้าไปใหม่ (Added)</span>
              </span>
              <ul className="text-emerald-200/90 space-y-0.5 list-disc list-inside">
                {latestDiff.addedTokens.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            {/* Modified */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-2.5 space-y-1">
              <span className="text-amber-300 font-bold flex items-center gap-1 text-[10px] uppercase">
                <Edit3 className="w-3 h-3 text-amber-400" />
                <span>สิ่งที่ปรับปรุงในช็อต (Modified)</span>
              </span>
              <ul className="text-amber-200/90 space-y-0.5 list-disc list-inside">
                {latestDiff.modifiedDirectives.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            {/* Negatives Added */}
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-2.5 space-y-1">
              <span className="text-rose-300 font-bold flex items-center gap-1 text-[10px] uppercase">
                <Minus className="w-3 h-3 text-rose-400" />
                <span>คำสั่งห้ามใหม่ใน Negative (Forbidden)</span>
              </span>
              <ul className="text-rose-200/90 space-y-0.5 list-disc list-inside">
                {latestDiff.negativesAdded.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* The Two Core Decisions: OK vs NOT OK (หัวใจของหน้าหลัก) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Pathway 1: ถ้าไม่โอเค -> บอกจุดที่ไม่ชอบ แล้วเจนใหม่เรื่อยๆ (Takes 7 cols) */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                ถ้ายังไม่โอเค ➔ บอกจุดที่ไม่ชอบเพื่อให้ AI ปรับแก้
              </h3>
              <p className="text-[11px] text-slate-400">
                ระบบจะวิเคราะห์และปรับ Storyboard + Prompt ใหม่ให้เรื่อยๆ จนกว่าคุณจะพอใจ
              </p>
            </div>
          </div>

          {/* Quick Click Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 w-full">คลิกคำสั่งด่วนที่พบบ่อย:</span>
            {quickComplaints.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRefinePrompt(q)}
                disabled={isRefining}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
              >
                + {q}
              </button>
            ))}
          </div>

          {/* Custom Complaint Input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="พิมพ์จุดที่คุณไม่โอเค เช่น แขนเสื้อยาวเกินไป, อยากซูมลายดอกไม้, นางแบบเดินเร็วไป..."
              value={userComplaint}
              onChange={(e) => setUserComplaint(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleRefinePrompt())}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={() => handleRefinePrompt()}
              disabled={isRefining || !userComplaint.trim()}
              className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
            >
              {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              <span>ปรับแก้ Prompt ใหม่</span>
            </button>
          </div>
        </div>

        {/* Pathway 2: ถ้าโอเคแล้ว -> ส่งสร้างวิดีโอบน Google Flow (Takes 5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/30 via-slate-950 to-teal-950/30 border border-emerald-500/40 rounded-3xl p-5 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  ถ้าพอใจกับ 6 ช็อตนี้แล้ว ➔ เริ่มสร้างวิดีโอ
                </h3>
                <p className="text-[11px] text-slate-400">
                  ส่งคำสั่งที่ผ่านการอนุมัติไปเรนเดอร์คลิป 10 วินาทีบน Google Flow
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              เมื่อกดปุ่มนี้ ระบบจะนำ Prompt, Negative Matrix และ Reference Tokens ทั้งหมดไปเปิดห้องเรนเดอร์ Google Flow Omni-Flash ทันที
            </p>
          </div>

          <button
            onClick={handleApproveAndGenerate}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>โอเคแล้ว ➔ ส่งสร้างวิดีโอบน Google Flow</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Accordion: Full Prompts & Negative Matrix Inspector */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>คำสั่งที่ระบบคอมไพล์ล่าสุด (Compiled Omni-Flash Prompt & Negative Matrix)</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentPositivePrompt);
                setCopiedPos(true);
                setTimeout(() => setCopiedPos(false), 1500);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/30 hover:bg-pink-500/20 font-semibold flex items-center gap-1 transition"
            >
              {copiedPos ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPos ? 'คัดลอกแล้ว' : 'คัดลอก Positive'}</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(currentNegativePrompt);
                setCopiedNeg(true);
                setTimeout(() => setCopiedNeg(false), 1500);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 font-semibold flex items-center gap-1 transition"
            >
              {copiedNeg ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedNeg ? 'คัดลอกแล้ว' : 'คัดลอก Negative'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold">Positive Prompt (พร้อม VO ภาษาไทย + SFX + BGM):</span>
            <pre className="text-[11px] text-slate-300 bg-slate-900 border border-slate-800 rounded-xl p-3 h-40 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
              {currentPositivePrompt}
            </pre>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-rose-400 font-semibold">Negative Prompt Matrix (รวมข้อห้ามจากประวัติทั้งหมด):</span>
            <div className="text-[11px] text-rose-200/90 bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 h-40 overflow-y-auto font-mono leading-relaxed">
              {currentNegativePrompt}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
