import React, { useState, useEffect } from 'react';
import { TrendingUp, Settings2, Zap, Plus } from 'lucide-react';
import { TopBar } from '../components/TopBar';

export default function Dashboard() {
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(12).fill(50));

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveformBars(prev => prev.map(() => Math.floor(Math.random() * 60) + 30));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <TopBar title="Operational Overview" />
      
      <main className="p-margin-desktop min-h-screen max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col gap-gutter">
          
          {/* Hero Stats: Tenant Health */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="bg-surface-container rounded-3xl p-stack-md neu-convex border-l-4 border-primary">
              <p className="text-label-md font-label-md text-on-surface-variant mb-unit">ACTIVE TENANTS</p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline-lg text-[32px] font-bold text-primary">124</h3>
                <span className="text-secondary font-label-md text-[12px] flex items-center gap-1">
                  <TrendingUp size={16} /> +8.2%
                </span>
              </div>
            </div>
            
            <div className="bg-surface-container rounded-3xl p-stack-md neu-convex border-l-4 border-secondary">
              <p className="text-label-md font-label-md text-on-surface-variant mb-unit">DEPLOYMENT UPTIME</p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline-lg text-[32px] font-bold text-secondary">99.98%</h3>
                <span className="text-on-surface-variant font-label-md text-[12px]">Operational</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-3xl p-stack-md neu-convex border-l-4 border-tertiary">
              <p className="text-label-md font-label-md text-on-surface-variant mb-unit">MEAN VERSION</p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline-lg text-[32px] font-bold text-tertiary">v2.4.1</h3>
                <span className="text-on-surface-variant font-label-md text-[12px]">Stable Patch</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-3xl p-stack-md neu-convex border-l-4 border-error">
              <p className="text-label-md font-label-md text-on-surface-variant mb-unit">CRITICAL LOOPS</p>
              <div className="flex items-end justify-between">
                <h3 className="font-headline-lg text-[32px] font-bold text-error drop-shadow-[0_0_8px_rgba(255,50,50,0.5)]">07</h3>
                <span className="text-error font-label-md text-[12px]">Action Required</span>
              </div>
            </div>
          </section>

          {/* Bento Layout: Monitoring & Controls */}
          <section className="grid grid-cols-12 gap-gutter">
            
            {/* Multi-Tenant Grid */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-3xl p-stack-lg neu-convex">
              <div className="flex items-center justify-between mb-stack-lg">
                <h4 className="font-headline-md text-[24px] font-bold text-on-surface">Tenant Ecosystem Map</h4>
                <div className="flex gap-stack-sm">
                  <button className="neu-inset px-stack-md py-2 rounded-xl text-label-md font-label-md text-secondary uppercase tracking-widest">FILTER BY VERSION</button>
                  <button className="neu-convex px-stack-md py-2 rounded-xl text-label-md font-label-md text-on-surface hover:text-primary transition-all active:scale-95 uppercase tracking-widest">EXPORT LOGS</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                {/* Tenant Card 1 */}
                <div className="bg-surface-container-low p-stack-md rounded-2xl neu-convex border border-outline-variant/20">
                  <div className="flex items-start justify-between mb-stack-md">
                    <div>
                      <h5 className="font-bold text-on-surface">CyberHub Residence</h5>
                      <p className="font-label-md text-[12px] text-on-surface-variant mt-1">ID: TK-8802</p>
                    </div>
                    <span className="bg-secondary-container/20 text-secondary px-2 py-1 rounded-md text-[10px] font-bold">STABLE</span>
                  </div>
                  <div className="space-y-stack-sm">
                    <div className="flex justify-between font-label-md text-[12px]">
                      <span className="text-on-surface-variant">Core Engine:</span>
                      <span className="text-on-surface">v2.4.1 (Latest)</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-secondary-fixed w-[98%] rounded-full drop-shadow-[0_0_8px_rgba(0,229,203,0.5)]"></div>
                    </div>
                  </div>
                </div>

                {/* Tenant Card 2 (Error State) */}
                <div className="bg-surface-container-low p-stack-md rounded-2xl neu-convex border border-error/30">
                  <div className="flex items-start justify-between mb-stack-md">
                    <div>
                      <h5 className="font-bold text-on-surface">NeoDorm Alpha</h5>
                      <p className="font-label-md text-[12px] text-on-surface-variant mt-1">ID: TK-4122</p>
                    </div>
                    <span className="bg-error-container/20 text-error px-2 py-1 rounded-md text-[10px] font-bold drop-shadow-[0_0_8px_rgba(255,50,50,0.5)]">ERROR LOOP</span>
                  </div>
                  <div className="space-y-stack-sm">
                    <div className="flex justify-between font-label-md text-[12px]">
                      <span className="text-on-surface-variant">Core Engine:</span>
                      <span className="text-error font-bold">v2.3.9 (Outdated)</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-error w-[45%] rounded-full drop-shadow-[0_0_8px_rgba(255,50,50,0.5)]"></div>
                    </div>
                  </div>
                </div>

                {/* Tenant Card 3 */}
                <div className="bg-surface-container-low p-stack-md rounded-2xl neu-convex border border-outline-variant/20">
                  <div className="flex items-start justify-between mb-stack-md">
                    <div>
                      <h5 className="font-bold text-on-surface">Quantum Suites</h5>
                      <p className="font-label-md text-[12px] text-on-surface-variant mt-1">ID: TK-9104</p>
                    </div>
                    <span className="bg-secondary-container/20 text-secondary px-2 py-1 rounded-md text-[10px] font-bold">STABLE</span>
                  </div>
                  <div className="space-y-stack-sm">
                    <div className="flex justify-between font-label-md text-[12px]">
                      <span className="text-on-surface-variant">Core Engine:</span>
                      <span className="text-on-surface">v2.4.1 (Latest)</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-secondary-fixed w-[92%] rounded-full drop-shadow-[0_0_8px_rgba(0,229,203,0.5)]"></div>
                    </div>
                  </div>
                </div>

                {/* Tenant Card 4 */}
                <div className="bg-surface-container-low p-stack-md rounded-2xl neu-convex border border-outline-variant/20">
                  <div className="flex items-start justify-between mb-stack-md">
                    <div>
                      <h5 className="font-bold text-on-surface">Sentinel Living</h5>
                      <p className="font-label-md text-[12px] text-on-surface-variant mt-1">ID: TK-0221</p>
                    </div>
                    <span className="bg-tertiary-container/20 text-tertiary px-2 py-1 rounded-md text-[10px] font-bold">SYNCING</span>
                  </div>
                  <div className="space-y-stack-sm">
                    <div className="flex justify-between font-label-md text-[12px]">
                      <span className="text-on-surface-variant">Core Engine:</span>
                      <span className="text-on-surface">v2.4.0</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary-fixed w-[78%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laser Crimson Controls & AI Log Monitor */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
              {/* Hardware Vectors */}
              <div className="bg-surface-container rounded-3xl p-stack-lg neu-convex">
                <div className="flex items-center gap-stack-sm mb-stack-lg">
                  <Settings2 className="text-error drop-shadow-[0_0_8px_rgba(255,50,50,0.5)]" size={24} />
                  <h4 className="font-headline-md text-[24px] font-bold text-on-surface">Hardware Vectors</h4>
                </div>
                <div className="space-y-stack-md">
                  <div className="flex flex-col gap-unit">
                    <label className="font-label-md text-[12px] font-bold text-on-surface-variant ml-2 uppercase tracking-widest">Global Reboot Key</label>
                    <div className="bg-surface-container-low neu-inset rounded-2xl p-stack-md flex items-center justify-between group">
                      <span className="text-on-surface-variant font-mono">X-ALPHA-09</span>
                      <button className="bg-error/10 hover:bg-error/20 p-2 rounded-xl neu-convex active:neu-inset transition-all duration-200">
                        <Zap className="text-error drop-shadow-[0_0_8px_rgba(255,50,50,0.5)]" size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-stack-md bg-surface-container rounded-2xl neu-convex border border-error/10">
                    <p className="font-body-sm text-[14px] text-on-surface-variant mb-stack-md italic">Force hardware cold-boot across all nodes failing handshake v2.4.</p>
                    <button className="w-full py-4 bg-surface-container-high rounded-xl neu-convex active:neu-inset text-error font-bold uppercase tracking-tighter hover:text-white transition-all duration-300">
                      Execute Laser Crimson Reboot
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Log Monitor */}
              <div className="bg-surface-container rounded-3xl p-stack-lg neu-convex flex-1">
                <h4 className="font-headline-md text-[24px] font-bold text-on-surface mb-stack-lg">System Telemetry</h4>
                <div className="flex flex-col gap-stack-sm max-h-48 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-stack-sm text-[10px] font-mono p-2 border-b border-outline-variant/10">
                    <span className="text-secondary">[14:02:11]</span>
                    <span className="text-on-surface">TK-8802: Handshake successful.</span>
                  </div>
                  <div className="flex items-center gap-stack-sm text-[10px] font-mono p-2 border-b border-outline-variant/10">
                    <span className="text-error">[14:02:15]</span>
                    <span className="text-error">TK-4122: Null pointer in bio-log loop.</span>
                  </div>
                  <div className="flex items-center gap-stack-sm text-[10px] font-mono p-2 border-b border-outline-variant/10">
                    <span className="text-secondary">[14:02:18]</span>
                    <span className="text-on-surface">TK-9104: Telemetry uplink verified.</span>
                  </div>
                  <div className="flex items-center gap-stack-sm text-[10px] font-mono p-2">
                    <span className="text-tertiary">[14:02:22]</span>
                    <span className="text-on-surface-variant">Global Sync: Processing v2.4.1 delta.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Deployment Visualizer */}
          <section className="bg-surface-container rounded-3xl p-stack-lg neu-convex relative overflow-hidden h-96">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbbeff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-stack-lg">
                <div className="flex flex-col">
                  <h4 className="font-headline-md text-[24px] font-bold text-on-surface">Global Deployment Waveform</h4>
                  <p className="font-body-sm text-[14px] text-on-surface-variant">Real-time cross-tenant synchronization frequency</p>
                </div>
                <div className="neu-inset p-4 rounded-full flex gap-stack-lg items-center px-stack-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary drop-shadow-[0_0_8px_rgba(0,229,203,0.5)]"></div>
                    <span className="font-label-md text-[12px] font-bold text-on-surface tracking-widest uppercase">Uplink</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary drop-shadow-[0_0_8px_rgba(203,190,255,0.5)]"></div>
                    <span className="font-label-md text-[12px] font-bold text-on-surface tracking-widest uppercase">Stable</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full h-48 flex items-end gap-2 px-stack-md">
                  {waveformBars.map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 neu-convex rounded-t-lg transition-all duration-700 ${
                        i === 3 || i === 9 ? 'bg-error/20 drop-shadow-[0_0_8px_rgba(255,50,50,0.5)]' :
                        i % 2 === 0 ? 'bg-primary/20' : 'bg-secondary/30'
                      }`} 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FAB for Quick Diagnosis */}
      <button className="fixed bottom-margin-desktop right-margin-desktop w-16 h-16 rounded-full neu-high-lift bg-primary text-on-primary flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group z-50">
        <Plus className="text-3xl group-hover:rotate-45 transition-transform" size={32} />
        <span className="absolute right-20 bg-surface-container-high px-stack-md py-2 rounded-xl neu-convex opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-label-md text-[12px] font-bold tracking-widest text-primary uppercase pointer-events-none">New Deployment</span>
      </button>
    </div>
  );
}
