import React, { useState } from 'react';
import { GarmentDNA, ColorSwatch, FabricColorScanResult } from '../types';
import { Sparkles, Palette, Scissors, ShieldAlert, Ban, Check, Edit2, Layers } from 'lucide-react';
import { FabricColorScanner } from './FabricColorScanner';

interface GarmentDnaViewProps {
  dna: GarmentDNA;
  onUpdateDna: (updatedDna: GarmentDNA) => void;
}

export const GarmentDnaView: React.FC<GarmentDnaViewProps> = ({ dna, onUpdateDna }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDna, setEditedDna] = useState<GarmentDNA>(dna);

  const handleSave = () => {
    onUpdateDna(editedDna);
    setIsEditing(false);
  };

  const handleUpdateScan = (updatedScan: FabricColorScanResult) => {
    const updated = {
      ...dna,
      fabricColorScan: updatedScan
    };
    onUpdateDna(updated);
  };

  // Fallback scan if not present
  const activeScan: FabricColorScanResult = dna.fabricColorScan || {
    detectedFabrics: [
      { id: 'f-1', name: dna.fabricType, location: 'ตัวเสื้อหลัก', texture: dna.fabricPhysics },
      { id: 'f-2', name: 'ขอบริบและตะเข็บเข้ารูป', location: 'ขอบคอ/แขน/ชายเสื้อ', texture: 'ยืดหยุ่น กระชับ อยู่ทรง' }
    ],
    detectedColors: dna.colorPalette.map((col, idx) => ({
      id: `c-${idx}`,
      name: col.name,
      hex: col.hex,
      percentage: idx === 0 ? 65 : Math.floor(35 / (dna.colorPalette.length - 1 || 1)),
      role: idx === 0 ? 'primary' : 'accent',
      selected: true
    })),
    colorMode: 'multi_color'
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-6">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>Garment DNA Passport</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gemini Verified
              </span>
            </h3>
            <p className="text-xs text-slate-400">พาสปอร์ตโครงสร้างชุดสำหรับล็อคคัตติ้งและเนื้อผ้าไม่ให้เพี้ยน</p>
          </div>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>บันทึกการแก้ไข</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>ปรับแต่ง DNA</span>
            </>
          )}
        </button>
      </div>

      {/* Section 1: Detailed Fabric & Color Scanner (จุดที่ user ขอให้สแกนได้) */}
      <FabricColorScanner
        scanResult={activeScan}
        onUpdateScan={handleUpdateScan}
      />

      {/* Section 2: Silhouette & Physics Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Fabric & Colors */}
        <div className="space-y-4">
          
          {/* Fabric Type & Physics */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-300 mb-2">
              <Scissors className="w-3.5 h-3.5" />
              <span>เนื้อผ้า & คุณสมบัติทางฟิสิกส์ (Fabric & Physics)</span>
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedDna.fabricType}
                  onChange={(e) => setEditedDna({ ...editedDna, fabricType: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
                <textarea
                  value={editedDna.fabricPhysics}
                  onChange={(e) => setEditedDna({ ...editedDna, fabricPhysics: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            ) : (
              <div>
                <div className="text-sm font-semibold text-white">{dna.fabricType}</div>
                <div className="text-xs text-slate-400 mt-1 leading-relaxed">{dna.fabricPhysics}</div>
              </div>
            )}
          </div>

          {/* Unique Details */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="text-xs font-bold text-amber-300 mb-2">จุดเด่น & ลวดลายเฉพาะ (Accents)</div>
            <div className="flex flex-wrap gap-1.5">
              {dna.uniqueDetails.map((detail, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium"
                >
                  {detail}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Silhouette & Strict Constraints */}
        <div className="space-y-4">
          
          {/* Silhouette Breakdown */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="text-xs font-bold text-emerald-300 mb-3">คัตติ้ง & สัดส่วนชุด (Cut & Silhouette)</div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">ช่วงคอ (Neckline):</span>
                <span className="font-semibold text-slate-200 text-right">{dna.silhouette.neckline}</span>
              </div>
              <div className="flex items-start justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">ช่วงแขน (Sleeves):</span>
                <span className="font-semibold text-slate-200 text-right">{dna.silhouette.sleeves}</span>
              </div>
              <div className="flex items-start justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">ช่วงเอว (Waist):</span>
                <span className="font-semibold text-slate-200 text-right">{dna.silhouette.waist}</span>
              </div>
              <div className="flex items-start justify-between py-1">
                <span className="text-slate-400">ชายเสื้อ/กระโปรง (Hemline):</span>
                <span className="font-semibold text-slate-200 text-right">{dna.silhouette.hemline}</span>
              </div>
            </div>
          </div>

          {/* Strict Constraints (ข้อห้ามเด็ดขาด) */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>ข้อห้ามเด็ดขาดของชุดนี้ (Strict Constraints)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {dna.strictConstraints.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Default Negatives */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2">
              <Ban className="w-3.5 h-3.5 text-rose-400" />
              <span>Negative Prompts มาตรฐานสำหรับชุดนี้</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {dna.defaultNegativePrompts.map((neg, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300/90 border border-rose-500/20 font-mono"
                >
                  {neg}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
