import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  Briefcase, 
  Settings, 
  LogOut,
  ChevronRight,
  Compass
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onBackToHome }) {
  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'jobs', name: 'AI Job Matcher', icon: Briefcase },
    { id: 'skills', name: 'Skill Roadmap', icon: Target },
    { id: 'analytics', name: 'Market Demand', icon: TrendingUp }
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col border-r border-white/5 bg-[#030014]/60 backdrop-blur-xl h-screen sticky top-0 p-6 justify-between z-40">
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <div className="flex items-center gap-2 px-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 shadow-md shadow-indigo-500/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base tracking-wider text-white">
            Compass<span className="text-cyan-400">AI</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border-l-2 border-indigo-500 text-white shadow-inner' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls inside Sidebar */}
      <div className="flex flex-col gap-3">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium text-sm">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <button 
          onClick={onBackToHome}
          className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors font-medium text-sm border border-transparent hover:border-rose-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Dashboard</span>
        </button>
      </div>
    </aside>
  );
}
