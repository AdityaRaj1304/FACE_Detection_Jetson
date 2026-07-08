import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Video, Fingerprint, Users, Router, BrainCircuit, Activity, Settings, LogOut } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/surveillance', label: 'Live Feed', icon: Video },
  { path: '/attendance', label: 'Attendance', icon: Fingerprint },
  { path: '/students/register', label: 'Resident Logs', icon: Users },
  { path: '/devices', label: 'Device Registry', icon: Router },
  { path: '/analytics', label: 'AI Analytics', icon: BrainCircuit },
  { path: '/insights', label: 'System Health', icon: Activity },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container neumorphic-high-lift flex flex-col py-stack-lg gap-stack-md z-50">
      <div className="px-margin-desktop mb-stack-lg">
        <h1 className="font-headline-md text-headline-md text-primary tracking-tighter uppercase font-bold">OneKByte Labs</h1>
        <div className="mt-stack-sm flex items-center gap-stack-sm">
          <div className="w-10 h-10 rounded-full neumorphic-convex flex items-center justify-center overflow-hidden border border-outline-variant/20">
            <img 
              alt="Admin Avatar" 
              className="w-full h-full object-cover" 
              src="https://ui-avatars.com/api/?name=Admin+User&background=3a3841&color=e6e0ed" 
            />
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface">System Controller</p>
            <p className="text-[10px] text-primary opacity-70 font-mono tracking-widest">NODE: DELTA-04</p>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-col gap-unit px-stack-md">
        {navItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-stack-md px-stack-md py-stack-md rounded-xl transition-all duration-300 active:scale-95 ` +
              (isActive 
                ? `neumorphic-inset text-secondary` 
                : `text-on-surface-variant hover:text-primary hover:bg-surface-container-high`)
            }
          >
            <item.icon size={20} />
            <span className="font-label-md">{item.label}</span>
          </NavLink>
        ))}

        <div className="mt-auto pt-stack-lg border-t border-outline-variant/10">
          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              `flex items-center gap-stack-md px-stack-md py-stack-md rounded-xl transition-all duration-300 active:scale-95 ` +
              (isActive 
                ? `neumorphic-inset text-secondary` 
                : `text-on-surface-variant hover:text-primary hover:bg-surface-container-high`)
            }
          >
            <Settings size={20} />
            <span className="font-label-md">Settings</span>
          </NavLink>
          <NavLink 
            to="/login"
            className="flex items-center gap-stack-md px-stack-md py-stack-md rounded-xl text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-all duration-300 active:scale-95"
          >
            <LogOut size={20} />
            <span className="font-label-md">Logout</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};
