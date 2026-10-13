import React, { useState } from 'react';
import { UserSession } from '../types';
import { Sparkles, ShieldCheck, Key, LogOut, Settings as SettingsIcon } from 'lucide-react';

interface HeaderProps {
  session: UserSession;
  onLogout: () => void;
  onOpenSettings: () => void;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onLogout,
  onOpenSettings,
  hasGeminiKey
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-indigo-200 bg-clip-text text-transparent">
                Fashion Ad Studio
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                Dresses AI
              </span>
            </div>
            <p className="text-xs text-slate-400">ระบบสร้างคลิปโฆษณาชุดเดรสแฟชั่น พร้อมระบบความจำ AI</p>
          </div>
        </div>

        {/* Status Indicators & User Nav */}
        <div className="flex items-center gap-3">
          {/* Cloudflare Protected Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cloudflare Secure</span>
          </div>

          {/* Gemini Key Status */}
          <button
            onClick={onOpenSettings}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              hasGeminiKey 
                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20' 
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
            }`}
            title="ตั้งค่า Google AI Studio Key"
          >
            <Key className="w-3 h-3" />
            <span>{hasGeminiKey ? 'Gemini 2.5 Brain Active' : 'ใส่ Gemini API Key'}</span>
          </button>

          {/* User Role & Name */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {session.name ? session.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-200">{session.name}</div>
              <div className="text-[10px] text-slate-400 capitalize">{session.role} Member</div>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              title="ตั้งค่าระบบ"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
