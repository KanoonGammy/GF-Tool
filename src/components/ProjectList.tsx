import React from 'react';
import { DressProject } from '../types';
import { Plus, Eye, Sparkles, CheckCircle2, AlertCircle, Clock, Video, BrainCircuit } from 'lucide-react';

interface ProjectListProps {
  projects: DressProject[];
  onSelectProject: (project: DressProject) => void;
  onNewProject: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  onNewProject
}) => {
  const readyCount = projects.filter(p => p.status === 'ready_for_review').length;
  const approvedCount = projects.filter(p => p.status === 'approved').length;
  const revisionCount = projects.filter(p => p.status === 'revision_requested').length;
  const totalRevisions = projects.reduce((acc, p) => acc + (p.revisionMemories?.length || 0), 0);

  const getStatusBadge = (status: DressProject['status']) => {
    switch (status) {
      case 'ready_for_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            พร้อมตรวจรับ (DoD)
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ผ่านการตรวจรับแล้ว (Approved)
          </span>
        );
      case 'revision_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Clock className="w-3.5 h-3.5" />
            ขอแก้ไขรอบใหม่
          </span>
        );
      case 'dna_extracted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            สกัด DNA เรียบร้อย
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            ดราฟต์
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>คลังแคมเปญชุดเดรสแฟชั่น</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30">
              {projects.length} งาน
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            ควบคุมรายละเอียดคัตติ้ง ลวดลาย และระบบความจำ AI สำหรับสร้างวิดีโอบน Google Flow
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-pink-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างแคมเปญชุดใหม่</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-xs font-medium text-slate-400">งานทั้งหมด</div>
          <div className="text-2xl font-black text-white mt-1">{projects.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            รอเพื่อนตรวจรับ (DoD)
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">{readyCount}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-xs font-medium text-rose-400">สั่งแก้ไขอยู่</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{revisionCount}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-xs font-medium text-indigo-400 flex items-center gap-1">
            <BrainCircuit className="w-3.5 h-3.5" />
            กฎที่ AI บันทึกความจำ
          </div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{totalRevisions}</div>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => {
          const latestIter = project.iterations?.[project.iterations.length - 1];
          const hasDna = !!project.garmentDna;
          const thumbnail = project.inputImages?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800';

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800">
                  <img
                    src={thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(project.status)}
                  </div>

                  {/* Iteration Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 font-semibold flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-pink-400" />
                      รอบที่ {project.iterations?.length || 0}
                    </span>
                    {project.revisionMemories?.length > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-900/80 backdrop-blur-md border border-indigo-500/40 text-indigo-300 font-medium flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3 text-indigo-400" />
                        {project.revisionMemories.length} ความจำ AI
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Category */}
                <h3 className="font-bold text-base text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                  {project.title}
                </h3>

                {/* Garment DNA Specs Chips */}
                {hasDna ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                      {project.garmentDna?.fabricType}
                    </span>
                    {project.garmentDna?.colorPalette?.slice(0, 2).map((col, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: col.hex }}
                        />
                        {col.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-slate-500 italic">
                    ยังไม่ได้วิเคราะห์ Garment DNA
                  </div>
                )}

                {/* Key Selling Points preview */}
                <div className="mt-3 text-xs text-slate-400 line-clamp-2">
                  {project.keySellingPoints?.length > 0 
                    ? project.keySellingPoints.join(' • ')
                    : 'ยังไม่ได้ระบุจุดเด่นสินค้า'}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  อัปเดต {new Date(project.updatedAt).toLocaleDateString('th-TH')}
                </span>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-pink-400 group-hover:text-pink-300 transition">
                  <span>เปิดตรวจงาน</span>
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
