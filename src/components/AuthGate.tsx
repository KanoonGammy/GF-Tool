import React, { useState } from 'react';
import { Lock, Sparkles, Shield, ArrowRight, CheckCircle2, Users } from 'lucide-react';
import { UserSession } from '../types';
import { ProjectStorage } from '../lib/storage';

interface AuthGateProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLoginSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [friendName, setFriendName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const currentPasscode = ProjectStorage.getAppPasscode();

    if (passcode !== currentPasscode) {
      setError('รหัสผ่านไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบเพื่อขอรหัส');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const session: UserSession = {
        isAuthenticated: true,
        name: friendName.trim() || 'เพื่อนสมาชิก (Fashion Partner)',
        role: 'reviewer',
        authMethod: 'passcode'
      };
      ProjectStorage.setUserSession(session);
      onLoginSuccess(session);
      setIsLoading(false);
    }, 400);
  };

  const handleQuickDemo = () => {
    const session: UserSession = {
      isAuthenticated: true,
      name: 'Designer Friend (ทดสอบระบบ)',
      role: 'creator',
      authMethod: 'passcode'
    };
    ProjectStorage.setUserSession(session);
    onLoginSuccess(session);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial-gradient">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">
            Fashion Ad Studio
          </h1>
          <p className="text-sm text-slate-400">
            ระบบสร้างและตรวจรับงานวิดีโอโฆษณาแฟชั่นด้วย AI
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cloudflare Access Gate</span>
          </div>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ชื่อของคุณ / ชื่อเล่น
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="เช่น น้องแอน, คุณบอส"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm transition"
              />
              <Users className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                รหัสผ่านสำหรับเพื่อน (Passcode)
              </label>
              <span className="text-[11px] text-pink-400/80">ค่าเริ่มต้น: fashion2025</span>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="กรอกรหัสผ่านเพื่อเข้าใช้งาน"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm transition"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ Fashion Studio'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500 font-medium">หรือ</span>
          </div>
        </div>

        {/* Quick Demo Button */}
        <button
          onClick={handleQuickDemo}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>เข้าใช้งานด่วนแบบ Guest Demo (ไม่ต้องกรอกรหัส)</span>
        </button>

        {/* Information Notice */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ระบบทำงานบน Cloudflare Network พร้อมระบบความจำ AI สำหรับตรวจจับและจดจำดีเทลเนื้อผ้าและคัตติ้งชุดเดรสโดยเฉพาะ
          </p>
        </div>

      </div>
    </div>
  );
};
