
import React from 'react';
import { Persona } from '../types';

interface SidebarProps {
  persona: Persona;
  setPersona: (p: Persona) => void;
  stats: { total: number; pending: number; critical: number };
}

const Sidebar: React.FC<SidebarProps> = ({ persona, setPersona, stats }) => {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col p-6 hidden md:flex">
      <div className="mb-10">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Active Persona</div>
        <div className="flex flex-col gap-2">
          {(['Data Scientist', 'Supervisor'] as Persona[]).map((p) => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className={`text-left px-4 py-3 rounded-xl transition-all ${
                persona === p 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              } flex items-center justify-between group`}
            >
              <span className="font-medium">{p}</span>
              <div className={`w-2 h-2 rounded-full ${persona === p ? 'bg-white' : 'bg-slate-700'}`}></div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Workspace Statistics</div>
          <div className="space-y-4">
            <StatRow label="Total Models" value={stats.total} />
            <StatRow label="Pending Approvals" value={stats.pending} color="text-amber-400" />
            <StatRow label="Critical Issues" value={stats.critical} color="text-rose-500" />
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Links</div>
          <nav className="space-y-2">
            <NavItem icon="📊" label="Model Registry" />
            <NavItem icon="📈" label="Performance Hub" />
            <NavItem icon="🛡️" label="Compliance" />
            <NavItem icon="⚙️" label="Settings" />
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/40/40" className="w-10 h-10 rounded-full border border-slate-700" alt="Avatar" />
          <div>
            <div className="text-sm font-semibold">User_Dev</div>
            <div className="text-xs text-slate-500">Tier 1 Access</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const StatRow = ({ label, value, color = "text-slate-200" }: any) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-500">{label}</span>
    <span className={`font-mono font-bold ${color}`}>{value}</span>
  </div>
);

const NavItem = ({ icon, label }: any) => (
  <a href="#" className="flex items-center gap-3 text-slate-400 hover:text-slate-200 text-sm transition-colors py-1">
    <span>{icon}</span>
    <span>{label}</span>
  </a>
);

export default Sidebar;
