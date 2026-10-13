import React, { useState } from 'react';
import { ArchetypeKnowledgeManager, ArchetypeRule } from '../lib/archetypeKnowledge';
import { ShieldAlert, BookOpen, Sparkles, Plus, Check, Ban, Tag, ArrowRight } from 'lucide-react';

interface ArchetypeKnowledgeViewProps {
  currentCategory?: string;
}

export const ArchetypeKnowledgeView: React.FC<ArchetypeKnowledgeViewProps> = ({ currentCategory }) => {
  const [rules, setRules] = useState<ArchetypeRule[]>(ArchetypeKnowledgeManager.getRules());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(currentCategory || 'all');

  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newCategory, setNewCategory] = useState(currentCategory || 'knitwear');
  const [newTitle, setNewTitle] = useState('');
  const [newVulnerability, setNewVulnerability] = useState('');
  const [newCountermeasure, setNewCountermeasure] = useState('');
  const [newNegatives, setNewNegatives] = useState('');

  const filteredRules = selectedCategoryFilter === 'all'
    ? rules
    : rules.filter(r => r.category === selectedCategoryFilter);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const negArray = newNegatives.split(',').map(s => s.trim()).filter(Boolean);
    const created: ArchetypeRule = {
      id: `rule-${Date.now()}`,
      category: newCategory,
      categoryName: newCategory === 'knitwear' ? 'เสื้อไหมพรม & นิตถัก' : newCategory === 'evening_dress' ? 'ชุดเดรสออกงาน' : 'แฟชั่นทั่วไป',
      cautionTitle: newTitle.trim(),
      vulnerability: newVulnerability.trim(),
      countermeasure: newCountermeasure.trim(),
      lockedNegatives: negArray,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const updated = [created, ...rules];
    setRules(updated);
    ArchetypeKnowledgeManager.saveRules(updated);
    setIsAddingRule(false);
    setNewTitle('');
    setNewVulnerability('');
    setNewCountermeasure('');
    setNewNegatives('');
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>คลังข้อควรระวังตามประเภทเสื้อผ้า (Garment Archetype Knowledge Base)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                {rules.length} ข้อควรระวัง
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              ฐานความรู้สะสม: เมื่อมีเสื้อผ้าประเภทเดียวกันเข้ามา AI จะดึงข้อควรระวังเหล่านี้ไปป้องกันความผิดพลาดก่อนเริ่มเรนเดอร์เสมอ
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingRule(!isAddingRule)}
          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ เพิ่มข้อควรระวังใหม่</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-semibold mr-1">หมวดหมู่:</span>
        {[
          { id: 'all', label: 'ทั้งหมด' },
          { id: 'knitwear', label: 'เสื้อไหมพรม & นิตถัก (Knitwear)' },
          { id: 'evening_dress', label: 'ชุดเดรสออกงาน (Evening Gowns)' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
              selectedCategoryFilter === cat.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Add New Rule Form */}
      {isAddingRule && (
        <form onSubmit={handleAddRule} className="p-5 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-4 animate-fadeIn">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>บันทึกข้อควรระวังใหม่ลงคลังความจำ AI:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">หมวดหมู่ชุด</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="knitwear">เสื้อไหมพรม & นิตถัก (Knitwear)</option>
                <option value="evening_dress">ชุดเดรสออกงาน (Evening Gowns)</option>
                <option value="linen_minimal">มินิมอลลินิน (Linen)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">หัวข้อข้อควรระวัง</label>
              <input
                type="text"
                required
                placeholder="เช่น ระวังลายพิมพ์ดอกไม้เพี้ยนเมื่อหมุนตัว..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">อาการผิดพลาดที่พบบ่อย (The Bug / Vulnerability)</label>
            <input
              type="text"
              required
              placeholder="เช่น AI มักทำขอบริบคอเสื้อกลืนเป็นสีขาว..."
              value={newVulnerability}
              onChange={(e) => setNewVulnerability(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">วิธีสั่งคำสั่งป้องกัน (Countermeasure in Prompt)</label>
            <input
              type="text"
              required
              placeholder="เช่น ต้องระบุชื่อสีขอบริบคอกลมและขอบแขนชัดเจนเสมอ..."
              value={newCountermeasure}
              onChange={(e) => setNewCountermeasure(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Negative Tokens ที่ต้องใส่เสมอ (คั่นด้วยจุลภาค)</label>
            <input
              type="text"
              placeholder="e.g. missing collar trim, blurred pattern, wrong neckline"
              value={newNegatives}
              onChange={(e) => setNewNegatives(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingRule(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
            >
              บันทึกข้อควรระวัง
            </button>
          </div>
        </form>
      )}

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4.5 space-y-3 hover:border-amber-500/40 transition duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {rule.categoryName}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {rule.lastUpdated}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white leading-snug">
              {rule.cautionTitle}
            </h4>

            {/* Vulnerability */}
            <div className="text-xs bg-rose-950/20 border border-rose-900/40 rounded-xl p-2.5 space-y-0.5">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                จุดที่ AI มักทำพลาด (The Bug):
              </span>
              <p className="text-rose-200/90 leading-relaxed text-[11px]">
                {rule.vulnerability}
              </p>
            </div>

            {/* Countermeasure */}
            <div className="text-xs bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-2.5 space-y-0.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                คำสั่งป้องกันที่ AI นำไปใส่ Prompt อัตโนมัติ:
              </span>
              <p className="text-emerald-200/90 leading-relaxed text-[11px]">
                {rule.countermeasure}
              </p>
            </div>

            {/* Locked Negatives */}
            {rule.lockedNegatives?.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Ban className="w-3 h-3 text-rose-400" />
                  <span>Negative Prompts ที่ถูกล็อค:</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {rule.lockedNegatives.map((token, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
