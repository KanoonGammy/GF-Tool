import React, { useState } from 'react';
import { DressProject, GarmentDNA, StoryboardShot, PromptDiff, CommercialVisualEffectType } from '../types';
import { generateDefaultStoryboard, refineStoryboardAndPrompt } from '../services/storyboardEngine';
import { compileFlowPrompt } from '../services/flowPromptCompiler';
import { COMMERCIAL_VISUAL_EFFECTS } from '../lib/visualEffects';
import { 
  Sparkles, Film, Check, Copy, RotateCcw, ArrowRight, 
  Plus, Minus, Edit3, Maximize2, X, ShieldAlert, Lock, Wand2
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
  const hasBack = !!project.referenceAngles?.back;

  // 6 Visual Shots (Ensure each has real image URL)
  const [shots, setShots] = useState<StoryboardShot[]>(() => {
    if (project.storyboard && project.storyboard.length === 6) {
      return project.storyboard.map(s => ({
        ...s,
        imageUrl: s.imageUrl || `/samples/storyboard/shot${s.shotNumber}.jpg`
      }));
    }
    return generateDefaultStoryboard(project, dna);
  });

  const [activeEffect, setActiveEffect] = useState<CommercialVisualEffectType>(
    project.activeVisualEffect || 'none'
  );

  const compiled = compileFlowPrompt({ ...project, activeVisualEffect: activeEffect }, dna, project.revisionMemories || []);
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

  // Inspector & Lightbox state
  const [activeLightboxShot, setActiveLightboxShot] = useState<StoryboardShot | null>(null);
  const [showPromptDrawer, setShowPromptDrawer] = useState<boolean>(false);
  const [copiedPos, setCopiedPos] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);

  // Quick preset feedback chips tailored to user rules
  const quickComplaints = [
    'ล็อคโครงหน้านางแบบและทรงผมมวยต่ำ',
    'ห้ามหันหลัง 360 องศา (เน้นหน้าตรง)',
    'กล้องหมุนเร็วไป ชะลอลง 50%',
    'เน้นซูมลายดอกไม้และเนื้อผ้า',
    'ล็อคขอบริบคอเสื้อสีฟ้าพาสเทล'
  ];

  // Switch commercial visual effect
  const handleSelectEffect = (effectId: CommercialVisualEffectType) => {
    setActiveEffect(effectId);
    const updatedProject: DressProject = {
      ...project,
      activeVisualEffect: effectId,
      updatedAt: new Date().toISOString()
    };
    const newCompiled = compileFlowPrompt(updatedProject, dna, project.revisionMemories || []);
    setCurrentPositivePrompt(newCompiled.positivePrompt);
    setCurrentNegativePrompt(newCompiled.negativePrompt);
    onUpdateProject(updatedProject);
  };

  // Refine storyboard shots & prompt
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
    }, 350);
  };

  const handleApproveAndGenerate = () => {
    onProceedToVideoGeneration(currentPositivePrompt, currentNegativePrompt);
  };

  const model = project.modelPersona;
  const masterAnchorImg = project.masterKeyframeUrl || '/samples/pomelo_model_wearing.jpg';

  return (
    <div className="space-y-4">
      
      {/* Master Frontal Keyframe Anchor Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-pink-950/70 border border-purple-500/30 rounded-2xl p-3.5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-14 rounded-xl overflow-hidden border-2 border-pink-400 shadow-md flex-shrink-0 group">
            <img 
              src={masterAnchorImg} 
              alt="Master Frontal Anchor" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>ภาพหน้าตรงหลัก (Master Frontal Anchor Plate)</span>
              </span>
              {!hasBack && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <ShieldAlert className="w-2.5 h-2.5" />
                  <span>มีเฉพาะรูปหน้า ➔ ล็อคห้ามหันหลัง 360°</span>
                </span>
              )}
            </div>
            <p className="text-xs text-white font-bold mt-0.5">
              ล็อคโครงหน้าน้องมินท์ + ทรงผมมวยต่ำ (Sleek Low Bun) 100% ไม่ให้เพี้ยนข้ามช็อต
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => setShowPromptDrawer(!showPromptDrawer)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            {showPromptDrawer ? 'ซ่อน Prompt' : 'ดู Prompt & Audio'}
          </button>
        </div>
      </div>

      {/* Commercial Visual Effects Selector Strip */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-pink-400" />
            <span>สไตล์เอฟเฟกต์สำหรับคลิปขายของ (Commercial Visual Effects):</span>
          </span>
          <span className="text-[10px] text-pink-300 font-medium">
            คลิกเพื่อเปลี่ยนสไตล์คลิปทันที
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {COMMERCIAL_VISUAL_EFFECTS.map((eff) => {
            const isSelected = activeEffect === eff.id;
            return (
              <button
                key={eff.id}
                type="button"
                onClick={() => handleSelectEffect(eff.id)}
                className={`p-2 rounded-xl text-left transition border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-pink-600/20 border-pink-500 text-white shadow-md shadow-pink-500/20 ring-1 ring-pink-500'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {eff.tag}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-pink-400" />}
                </div>
                <div className="text-[11px] font-bold truncate">{eff.name}</div>
                <div className="text-[9px] text-slate-500 truncate mt-0.5">{eff.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2x3 Visual Cinema Storyboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {shots.map((shot) => {
          const imgSrc = shot.imageUrl || `/samples/storyboard/shot${shot.shotNumber}.jpg`;
          const isShot6FrontalLocked = shot.shotNumber === 6 && !hasBack;

          return (
            <div
              key={shot.shotNumber}
              onClick={() => setActiveLightboxShot(shot)}
              className={`group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isShot6FrontalLocked 
                  ? 'border-amber-500/40 hover:border-amber-400' 
                  : 'border-slate-800 hover:border-pink-500/80'
              }`}
            >
              {/* Real 9:16 Generated Shot Image */}
              <img
                src={imgSrc}
                alt={shot.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/samples/pomelo_model_wearing.jpg';
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Top Bar Vignette */}
              <div className="relative z-10 p-2.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-600/90 text-white shadow">
                  Shot {shot.shotNumber}
                </span>
                <span className="text-[10px] font-mono font-bold text-white/90 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {shot.timecode}
                </span>
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Vignette & Compact Title */}
              <div className="relative z-10 p-2.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent">
                {isShot6FrontalLocked && (
                  <span className="inline-flex items-center gap-1 text-[8px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/30 mb-1">
                    <Lock className="w-2 h-2" /> ห้ามหันหลัง (Front Only)
                  </span>
                )}
                <p className="text-[11px] font-bold text-white leading-tight drop-shadow line-clamp-1">
                  {shot.title.replace(/^ช็อต.*?: /, '').replace(/^[0-9]+.*?: /, '')}
                </p>
                <div className="flex items-center justify-between mt-1 text-[9px] text-slate-300">
                  <span className="truncate max-w-[80px]">{shot.shotType.split('(')[0]}</span>
                  {shot.refToken && (
                    <span className="font-mono text-pink-300 font-bold bg-pink-950/70 px-1 rounded border border-pink-500/30">
                      {shot.refToken}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sleek Director Control Bar */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        
        {/* Input & Action Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="ต้องการปรับอะไรใน 6 ช็อตนี้? (เช่น ล็อคหน้าตรงห้ามหันหลัง, ซูมลายดอกไม้, สปีดชะลอลง...)"
            value={userComplaint}
            onChange={(e) => setUserComplaint(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleRefinePrompt())}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
          />
          <button
            onClick={() => handleRefinePrompt()}
            disabled={isRefining || !userComplaint.trim()}
            className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40 flex-shrink-0"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefining ? 'animate-spin' : ''}`} />
            <span>ปรับแก้ Storyboard & Prompt</span>
          </button>
          <button
            onClick={handleApproveAndGenerate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/20 flex-shrink-0"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>โอเคแล้ว ➔ สร้างวิดีโอ 10s บน Flow</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {/* Quick Click Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-slate-500 text-[10px] mr-1">คำสั่งด่วน:</span>
          {quickComplaints.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleRefinePrompt(q)}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            >
              + {q}
            </button>
          ))}
        </div>

        {/* Compact Diff Badges */}
        {latestDiff && (
          <div className="pt-2 border-t border-slate-900/80 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-bold text-[10px] mr-1">Diff ล่าสุด:</span>
            {latestDiff.addedTokens.map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px]">
                <Plus className="w-2.5 h-2.5" /> {t}
              </span>
            ))}
            {latestDiff.modifiedDirectives.map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-500/30 text-[10px]">
                <Edit3 className="w-2.5 h-2.5" /> {t.split(':')[0]}
              </span>
            ))}
            {latestDiff.negativesAdded.map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/60 text-rose-300 border border-rose-500/30 text-[10px]">
                <Minus className="w-2.5 h-2.5" /> {t}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Collapsible Prompt & Audio Drawer */}
      {showPromptDrawer && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Prompt คอมไพล์พร้อมเอฟเฟกต์ {COMMERCIAL_VISUAL_EFFECTS.find(e => e.id === activeEffect)?.name}</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">Positive Prompt + Audio [VO/SFX/BGM]:</span>
              <pre className="text-[11px] text-slate-300 bg-slate-900 border border-slate-800 rounded-xl p-3 h-36 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                {currentPositivePrompt}
              </pre>
            </div>
            <div>
              <span className="text-[10px] text-rose-400 font-semibold block mb-1">Negative Matrix (ล็อคห้ามเพี้ยน & ห้ามหันหลัง):</span>
              <div className="text-[11px] text-rose-200/90 bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 h-36 overflow-y-auto font-mono leading-relaxed">
                {currentNegativePrompt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Cinema Modal for Any Shot */}
      {activeLightboxShot && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-3 p-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-600 text-white">
                  Shot #{activeLightboxShot.shotNumber}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {activeLightboxShot.timecode}
                </span>
              </div>
              <button
                onClick={() => setActiveLightboxShot(null)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 9:16 High-Res Image Display */}
            <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black border border-slate-800">
              <img
                src={activeLightboxShot.imageUrl || `/samples/storyboard/shot${activeLightboxShot.shotNumber}.jpg`}
                alt={activeLightboxShot.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Shot Details */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white">{activeLightboxShot.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{activeLightboxShot.description}</p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-900">
                <span>โฟกัส: {activeLightboxShot.focusArea}</span>
                {activeLightboxShot.refToken && (
                  <span className="font-mono text-pink-400 font-bold bg-pink-950/60 px-1.5 py-0.5 rounded border border-pink-500/30">
                    {activeLightboxShot.refToken}
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
