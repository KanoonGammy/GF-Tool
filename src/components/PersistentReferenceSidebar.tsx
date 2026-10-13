import React, { useState } from 'react';
import { DressProject } from '../types';
import { Layers, Copy, Check, Eye, ChevronRight, ChevronLeft, User, ZoomIn, Sparkles, X } from 'lucide-react';

interface PersistentReferenceSidebarProps {
  project: DressProject;
}

export const PersistentReferenceSidebar: React.FC<PersistentReferenceSidebarProps> = ({ project }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string } | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const frontImg = project.referenceAngles?.front || project.inputImages?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800';
  const backImg = project.referenceAngles?.back || project.inputImages?.[1];
  const fabricImg = project.referenceAngles?.fabricZoom;
  const model = project.modelPersona;

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  if (isCollapsed) {
    return (
      <div className="fixed right-3 top-24 z-30">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-pink-400 shadow-2xl hover:bg-slate-800 transition flex items-center gap-2"
          title="เปิดแถบ Reference ภาพจริง"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-bold writing-mode-vertical">ภาพชุด Reference</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-4 backdrop-blur-md">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-400" />
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              ภาพชุด Reference (คงที่ทุกหน้า)
            </h4>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-[11px]"
            title="พับเก็บแถบ Reference"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Angles Images Showcase */}
        <div className="space-y-3">
          
          {/* Front Angle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-200">1. ด้านหน้า (Front)</span>
              <button
                onClick={() => handleCopy('@dress_front_cutout')}
                className="text-[10px] text-pink-400 hover:underline font-mono"
              >
                {copiedToken === '@dress_front_cutout' ? 'คัดลอกแล้ว!' : 'Copy @token'}
              </button>
            </div>
            <div
              onClick={() => setZoomedImage({ url: frontImg, title: 'ภาพชุดด้านหน้า (Front View)' })}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer group shadow-md"
            >
              <img src={frontImg} alt="Front View" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                <ZoomIn className="w-6 h-6 drop-shadow" />
              </div>
            </div>
          </div>

          {/* Back & Fabric Zoom Thumbnails */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* Back Angle */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 block truncate">2. ด้านหลัง</span>
              <div
                onClick={() => backImg && setZoomedImage({ url: backImg, title: 'ภาพชุดด้านหลัง (Back View)' })}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer group"
              >
                {backImg ? (
                  <>
                    <img src={backImg} alt="Back View" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">ไม่มีรูปหลัง</div>
                )}
              </div>
            </div>

            {/* Fabric Zoom */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 block truncate">3. ซูมเนื้อผ้า</span>
              <div
                onClick={() => fabricImg && setZoomedImage({ url: fabricImg, title: 'ซูมลายและเนื้อผ้า (Fabric Zoom)' })}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer group"
              >
                {fabricImg ? (
                  <>
                    <img src={fabricImg} alt="Fabric Zoom" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">ไม่มีรูปซูม</div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Selected Model Persona Badge */}
        {model && (
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>นางแบบที่ใส่ชุดนี้:</span>
            </span>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950 border border-purple-500/30">
              <img
                src={model.avatarUrl}
                alt={model.name}
                className="w-10 h-12 rounded-lg object-cover border border-purple-400/40 flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{model.name}</div>
                <div className="text-[10px] text-purple-300 font-medium">{model.nationality} • {model.heightCm}cm</div>
                <div className="text-[10px] text-slate-400 truncate">{model.vibe.split(' ')[0]}</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Color Palette Swatches */}
        {project.garmentDna?.colorPalette && (
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 block">
              โทนสีที่สกัดได้ ({project.garmentDna.colorPalette.length} สี):
            </span>
            <div className="flex flex-wrap gap-1">
              {project.garmentDna.colorPalette.map((col, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.hex }} />
                  <span>{col.name.split(' ')[0]}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs text-white font-bold">
              <span>{zoomedImage.title}</span>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={zoomedImage.url}
              alt="Zoomed Reference"
              className="max-h-[70vh] w-auto mx-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};
