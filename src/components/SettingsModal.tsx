import React, { useState } from 'react';
import { X, Key, Shield, Globe, ExternalLink, Check, Copy, HelpCircle } from 'lucide-react';
import { geminiBrain } from '../services/gemini';
import { ProjectStorage } from '../lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onKeySaved
}) => {
  const [apiKey, setApiKey] = useState(geminiBrain.getApiKey());
  const [passcode, setPasscode] = useState(ProjectStorage.getAppPasscode());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    geminiBrain.setApiKey(apiKey.trim());
    ProjectStorage.setAppPasscode(passcode.trim() || 'fashion2025');
    setSavedSuccess(true);
    onKeySaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleCopyWrangler = () => {
    navigator.clipboard.writeText('npm run build && npx wrangler pages deploy dist');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ตั้งค่าระบบและการเชื่อมต่อ</h2>
            <p className="text-xs text-slate-400">Google AI Studio API & Cloudflare Deployment Settings</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>Google AI Studio API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-pink-400 hover:underline flex items-center gap-1"
              >
                <span>รับ API Key ฟรีที่นี่</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500">
              * ใช้สำหรับเรียกโมเดล <strong>Gemini 2.5 Flash / Pro</strong> เพื่อสกัด Garment DNA และประมวลผลความจำ
            </p>
          </div>

          {/* Friend Passcode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>รหัสผ่านสำหรับเพื่อน (Friend Passcode)</span>
            </label>
            <input
              type="text"
              placeholder="fashion2025"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500">
              * รหัสที่เพื่อนต้องกรอกเมื่อเปิดเข้ามาใช้งานหน้าเว็บ
            </p>
          </div>

          {/* Cloudflare Deployment Guide Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>ขั้นตอนฝากขึ้น Cloudflare Pages</span>
              </span>
              <button
                type="button"
                onClick={handleCopyWrangler}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'คัดลอกคำสั่งแล้ว' : 'คัดลอกคำสั่ง deploy'}</span>
              </button>
            </div>

            <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>สร้าง Cloudflare Pages โปรเจกต์ หรือรันคำสั่ง <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded">npx wrangler pages deploy dist</code></li>
              <li>สร้าง D1 Database: <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded">npx wrangler d1 create dresses_ai_db</code></li>
              <li>รัน SQL Schema: <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded">npx wrangler d1 execute dresses_ai_db --file=./schema.sql</code></li>
              <li>(ตัวเลือก) เปิดใช้ Cloudflare Zero Trust เพื่อส่งรหัส OTP 6 หลักเข้าอีเมลเพื่อน</li>
            </ol>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
            >
              ปิด
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>บันทึกสำเร็จ!</span>
                </>
              ) : (
                <span>บันทึกการตั้งค่า</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
