import React, { useState } from 'react';
import { FabricColorScanResult, ColorScanItem, FabricScanItem } from '../types';
import { Sparkles, Layers, Palette, Check, Sliders, Filter, Eye } from 'lucide-react';

interface FabricColorScannerProps {
  scanResult: FabricColorScanResult;
  onUpdateScan: (updated: FabricColorScanResult) => void;
}

export const FabricColorScanner: React.FC<FabricColorScannerProps> = ({
  scanResult,
  onUpdateScan
}) => {
  const [colorMode, setColorMode] = useState<'multi_color' | 'single_focus'>(scanResult.colorMode || 'multi_color');
  const [focusedColorId, setFocusedColorId] = useState<string | undefined>(scanResult.focusedColorId || scanResult.detectedColors[0]?.id);

  const handleModeChange = (mode: 'multi_color' | 'single_focus') => {
    setColorMode(mode);
    onUpdateScan({
      ...scanResult,
      colorMode: mode,
      focusedColorId: mode === 'single_focus' ? focusedColorId : undefined
    });
  };

  const handleSelectColor = (colorId: string) => {
    setFocusedColorId(colorId);
    onUpdateScan({
      ...scanResult,
      colorMode: 'single_focus',
      focusedColorId: colorId
    });
  };

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>ผลการสแกนชนิดผ้า & โทนสี (Fabric & Color Breakdown)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                สแกนพบ {scanResult.detectedFabrics.length} แบบผ้า • {scanResult.detectedColors.length} โทนสี
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              วิเคราะห์โครงสร้างเส้นใยและแยกเลเยอร์สีเพื่อให้ทำภาพ Reference ได้แม่นยำ
            </p>
          </div>
        </div>

        {/* Color Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => handleModeChange('multi_color')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              colorMode === 'multi_color'
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>หลายสีตามลาย (Multi-Color)</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('single_focus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              colorMode === 'single_focus'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>เน้นสีเดียว (Color Focus)</span>
          </button>
        </div>
      </div>

      {/* Grid: Fabrics (Left) and Colors (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left: Detected Fabric Types */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            <span>ชนิดผ้าและเทคนิคการทอที่ตรวจพบ ({scanResult.detectedFabrics.length} แบบ):</span>
          </span>

          <div className="space-y-2">
            {scanResult.detectedFabrics.map((fabric, idx) => (
              <div
                key={fabric.id || idx}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs space-y-1 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{fabric.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                    {fabric.location}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  สัมผัส: {fabric.texture}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detected Colors & Interactive Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>โทนสีที่สกัดได้ ({colorMode === 'single_focus' ? 'คลิกเพื่อเลือกสีที่จะเน้น' : 'แสดงทุกลายสี'}):</span>
            </span>
            {colorMode === 'single_focus' && (
              <span className="text-[10px] text-pink-400 font-medium animate-pulse">
                * เลือกเน้นสีนี้ในวิดีโอ
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scanResult.detectedColors.map((color) => {
              const isSelected = colorMode === 'single_focus' && focusedColorId === color.id;

              return (
                <div
                  key={color.id}
                  onClick={() => colorMode === 'single_focus' && handleSelectColor(color.id)}
                  className={`p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'border-pink-500 bg-pink-950/30 shadow-md ring-1 ring-pink-500 cursor-pointer'
                      : colorMode === 'single_focus'
                      ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 cursor-pointer'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg border border-white/20 shadow-inner flex-shrink-0 relative"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center text-white">
                          <Check className="w-4 h-4 drop-shadow" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">{color.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{color.hex} • {color.percentage}%</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 capitalize">
                    {color.role}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Color Mode Advice */}
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
            <span className="text-pink-400 font-bold">💡 โหมดการเรนเดอร์:</span>
            <span>
              {colorMode === 'multi_color'
                ? 'AI จะรักษาทั้ง 4 สี (ครีม, ฟ้าพาสเทล, ชมพูดอกไม้, น้ำตาล) ให้ตรงตามลายผ้าต้นฉบับ 100%'
                : `AI จะขับเน้นช็อตกล้องและแสงไฟไปที่โทนสี "${scanResult.detectedColors.find(c => c.id === focusedColorId)?.name}" เป็นจุดเด่น`}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
