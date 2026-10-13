import React, { useState, useRef } from 'react';
import { DressProject, VideoIteration, DoDChecklist } from '../types';
import { Play, Pause, RotateCcw, CheckCircle2, AlertOctagon, Sparkles, Image as ImageIcon, Volume2, ShieldCheck, ZoomIn, SlidersHorizontal } from 'lucide-react';

interface VideoReviewRoomProps {
  project: DressProject;
  currentIteration: VideoIteration;
  onAccept: (checklist: DoDChecklist, notes: string) => void;
  onRequestRevision: () => void;
}

export const VideoReviewRoom: React.FC<VideoReviewRoomProps> = ({
  project,
  currentIteration,
  onAccept,
  onRequestRevision
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showOriginalComparison, setShowOriginalComparison] = useState(true);
  const [reviewerNotes, setReviewerNotes] = useState('');

  // 4 Core DoD Checkpoints
  const [checklist, setChecklist] = useState<DoDChecklist>({
    fabricFidelityPassed: currentIteration.dodEvaluation?.checklist.fabricFidelityPassed ?? false,
    cutIntegrityPassed: currentIteration.dodEvaluation?.checklist.cutIntegrityPassed ?? false,
    modelPresentationPassed: currentIteration.dodEvaluation?.checklist.modelPresentationPassed ?? false,
    audioVisualSyncPassed: currentIteration.dodEvaluation?.checklist.audioVisualSyncPassed ?? false
  });

  const allPassed = 
    checklist.fabricFidelityPassed &&
    checklist.cutIntegrityPassed &&
    checklist.modelPresentationPassed &&
    checklist.audioVisualSyncPassed;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedToggle = () => {
    if (!videoRef.current) return;
    const nextRate = playbackRate === 1 ? 0.5 : 1;
    videoRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const handleCheckboxChange = (key: keyof DoDChecklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAcceptSubmit = () => {
    onAccept(checklist, reviewerNotes);
  };

  const videoUrl = currentIteration.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-dress-posing-40742-large.mp4';
  const originalImage = project.inputImages?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-lg text-white">ห้องตรวจรับงาน Definition of Done (DoD)</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20">
              รอบที่ {currentIteration.iterationNumber}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ตรวจสอบความถูกต้องของเนื้อผ้า ลวดลาย และคัตติ้งก่อนอนุมัตินำไปยิงแอด
          </p>
        </div>

        <button
          onClick={() => setShowOriginalComparison(!showOriginalComparison)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            showOriginalComparison 
              ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{showOriginalComparison ? 'ซ่อนภาพเทียบชุดจริง' : 'เปิดภาพเทียบชุดจริง'}</span>
        </button>
      </div>

      {/* Main Review Stage: Video + Original Image Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 9:16 Video Player Stage (Takes 5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-slate-800 shadow-2xl group">
            
            <video
              ref={videoRef}
              src={videoUrl}
              loop
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Play/Pause Overlay */}
            <div
              onClick={togglePlay}
              className={`absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer transition-opacity ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </div>
            </div>

            {/* Top Bar inside Video */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] text-white">
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md">9:16 Vertical</span>
              <button
                onClick={handleSpeedToggle}
                className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md hover:bg-black/90 font-mono transition"
              >
                {playbackRate}x Speed
              </button>
            </div>

          </div>

          {/* Quick Controls below video */}
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            <button
              onClick={togglePlay}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
            >
              {isPlaying ? 'หยุดชั่วคราว' : 'เล่นวิดีโอ'}
            </button>
            <button
              onClick={handleSpeedToggle}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>โหมดสโลว์โมชั่น (0.5x ตรวจผ้า)</span>
            </button>
          </div>
        </div>

        {/* Center/Right: Side-by-Side Reference & DoD Checklist (Takes 7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Original Reference Image Card */}
          {showOriginalComparison && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
              <div className="w-20 h-24 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-900">
                <img src={originalImage} alt="Original dress" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>ภาพชุดต้นฉบับจริง (Ground Truth Reference)</span>
                </div>
                <div className="text-slate-400 leading-relaxed">
                  ประเภทผ้า: <span className="text-slate-200">{project.garmentDna?.fabricType}</span>
                </div>
                <div className="text-slate-400 leading-relaxed">
                  คัตติ้ง: <span className="text-slate-200">{project.garmentDna?.silhouette.neckline}, {project.garmentDna?.silhouette.hemline}</span>
                </div>
              </div>
            </div>
          )}

          {/* Definition of Done (DoD) Checklist Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                เช็กลิสต์เกณฑ์การผ่านงาน (Definition of Done)
              </span>
              <span className="text-xs font-bold text-slate-400">
                {Object.values(checklist).filter(Boolean).length} / 4 ข้อ
              </span>
            </div>

            {/* Checkpoint 1 */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.fabricFidelityPassed}
                onChange={() => handleCheckboxChange('fabricFidelityPassed')}
                className="mt-0.5 rounded border-slate-700 text-pink-600 focus:ring-pink-500 w-4 h-4"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-200">1. ลวดลายและสีผ้าตรงต้นฉบับ 100% (Fabric & Color Fidelity)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  เนื้อผ้าไม่แบนพลาสติก ลายพิมพ์และเฉดสี ({project.garmentDna?.colorPalette[0]?.name}) ถูกต้อง ไม่เพี้ยนเป็นสีอื่น
                </div>
              </div>
            </label>

            {/* Checkpoint 2 */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.cutIntegrityPassed}
                onChange={() => handleCheckboxChange('cutIntegrityPassed')}
                className="mt-0.5 rounded border-slate-700 text-pink-600 focus:ring-pink-500 w-4 h-4"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-200">2. คัตติ้งคงรูปเดิม ไม่ Morphing (Silhouette Integrity)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  คอเสื้อ แขนเสื้อ และชายกระโปรงไม่หลุดรูปทรงระหว่างที่โมเดลขยับตัว ไม่สั้นหรือยาวขึ้นกะทันหัน
                </div>
              </div>
            </label>

            {/* Checkpoint 3 */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.modelPresentationPassed}
                onChange={() => handleCheckboxChange('modelPresentationPassed')}
                className="mt-0.5 rounded border-slate-700 text-pink-600 focus:ring-pink-500 w-4 h-4"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-200">3. ท่าโพสและการเดินสง่างาม ไม่บดบังชุด (Presentation & Motion)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  กล้อง Orbit รอบชุดเห็นครบ 360 องศา ปลอดภัยใน Safe zone ของ TikTok / Reels 9:16
                </div>
              </div>
            </label>

            {/* Checkpoint 4 */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.audioVisualSyncPassed}
                onChange={() => handleCheckboxChange('audioVisualSyncPassed')}
                className="mt-0.5 rounded border-slate-700 text-pink-600 focus:ring-pink-500 w-4 h-4"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-200">4. เสียงพากย์และซาวด์เอฟเฟกต์ชัดเจน (Audio Sync)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  จุดเด่นของชุดถูกกล่าวถึงใน Voiceover และมีเสียงประกอบเนื้อผ้า/บรรยากาศร้านหรูหรา
                </div>
              </div>
            </label>

          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              บันทึกข้อคิดเห็นของทีมงาน (Reviewer Notes)
            </label>
            <input
              type="text"
              placeholder="เช่น งานสวยมาก ลายผ้าเป๊ะ พร้อมยิงแอดในช่อง TikTok..."
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Core Decision Buttons (DoD Handshake) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            
            {/* Red Button: Request Revision (With Negative Prompt Recorder) */}
            <button
              onClick={onRequestRevision}
              className="w-full sm:w-1/2 py-3 px-4 rounded-2xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>ขอแก้ไข (บันทึกฟีดแบ็ก & Negative Prompt)</span>
            </button>

            {/* Green Button: Accept (DoD Passed) */}
            <button
              onClick={handleAcceptSubmit}
              disabled={!allPassed}
              className={`w-full sm:w-1/2 py-3 px-4 rounded-2xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition ${
                allPassed
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{allPassed ? 'ยอมรับผลงาน (DoD ผ่านครบ 4 ข้อ)' : 'กรุณาติ๊กให้ผ่านครบทั้ง 4 ข้อ'}</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
