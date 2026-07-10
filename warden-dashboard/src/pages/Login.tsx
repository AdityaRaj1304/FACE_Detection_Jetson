import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for now
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center selection:bg-primary-container selection:text-on-primary-container" style={{
        backgroundImage: 'url(/front_page_onekbyte.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/40 to-background/60"></div>

      {/* Main Authentication Card - Premium Liquid Glass */}
      <main className="w-full max-w-md px-margin-mobile relative z-10">
        <form onSubmit={handleLogin} className="flex flex-col gap-stack-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Login Box - Premium Liquid Glass (Ultra-Transparent) */}
          <div className="relative backdrop-blur-[16px] bg-white/20 rounded-[40px] p-stack-lg flex flex-col gap-stack-md border border-white/30 shadow-2xl" style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(16px) saturate(180%)'
          }}>
            {/* Email Field */}
            <div className="flex flex-col gap-unit">
              <label className="font-label-md text-label-md text-on-surface ml-stack-sm mb-1" htmlFor="admin_id">ADMIN_ID</label>
              <div className="relative group">
                <input 
                  className="w-full h-14 px-12 backdrop-blur-md bg-white/10 rounded-2xl font-body-md text-on-surface border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all placeholder:text-on-surface/40" 
                  id="admin_id" 
                  placeholder="system_controller_01" 
                  type="text" 
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface text-xl opacity-60" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
              </div>
            </div>
            
            {/* Password Field */}
            <div className="flex flex-col gap-unit">
              <label className="font-label-md text-label-md text-on-surface ml-stack-sm mb-1" htmlFor="access_key">ACCESS_KEY</label>
              <div className="relative">
                <input 
                  className="w-full h-14 px-12 backdrop-blur-md bg-white/10 rounded-2xl font-body-md text-on-surface border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all placeholder:text-on-surface/40" 
                  id="access_key" 
                  placeholder="••••••••••••" 
                  type="password" 
                  required
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface text-xl opacity-60" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface text-xl cursor-pointer hover:text-primary transition-colors opacity-60 hover:opacity-100" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
              </div>
            </div>
            
            {/* Secondary Options */}
            <div className="flex items-center justify-between px-unit mt-2">
              <label className="flex items-center gap-stack-sm cursor-pointer group">
                <div className="w-5 h-5 rounded backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-white/20">
                  <div className="w-2 h-2 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100"></div>
                </div>
                <input className="hidden peer" type="checkbox" />
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-on-surface transition-colors">Persist Session</span>
              </label>
              <a className="font-body-sm text-body-sm text-primary hover:text-primary-container transition-colors font-semibold" href="#">Recovery Key?</a>
            </div>
            
            {/* Submit Button */}
            <button type="submit" className="mt-stack-sm w-full h-16 backdrop-blur-md bg-gradient-to-r from-white/20 to-white/10 rounded-2xl font-headline-md text-on-surface border border-white/30 hover:from-white/25 hover:to-white/15 active:scale-95 transition-all duration-200 group flex items-center justify-center gap-stack-sm shadow-lg hover:shadow-xl" style={{
              boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <span className="font-bold">INITIALIZE CORE</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </button>
            
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-stack-sm"></div>
            
            {/* Alternative Logins */}
            <div className="grid grid-cols-2 gap-stack-md">
              <button type="button" className="h-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/15 hover:border-white/30 transition-all active:scale-95">
                <span className="material-symbols-outlined text-xl text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
                <span className="font-label-md text-label-md text-on-surface">QR SCAN</span>
              </button>
              <button type="button" className="h-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/15 hover:border-white/30 transition-all active:scale-95">
                <span className="material-symbols-outlined text-xl text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>face_6</span>
                <span className="font-label-md text-label-md text-on-surface">BIO AUTH</span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
