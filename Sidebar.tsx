
import React from 'react';
import { Persona } from './types';

interface SidebarProps {
  persona: Persona;
  setPersona: (p: Persona) => void;
  activeView: string;
  setActiveView: (view: any) => void;
  stats: { total: number; agents: number; pending: number; critical: number };
}

const Sidebar: React.FC<SidebarProps> = ({ persona, setPersona, activeView, setActiveView, stats }) => {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col p-6 hidden md:flex shrink-0">
      <div className="mb-10">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Active Persona</div>
        <div className="flex flex-col gap-2">
          {(['Data Scientist', 'Supervisor'] as Persona[]).map((p) => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className={`text-left px-4 py-3 rounded-xl transition-all ${
                persona === p 
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              } flex items-center justify-between group`}
            >
              <span className="font-medium text-sm">{p}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${persona === p ? 'bg-white' : 'bg-slate-300'}`}></div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Workspace Statistics</div>
          <div className="space-y-4">
            <StatRow label="ML Models" value={stats.total} />
            <StatRow label="AI Agents" value={stats.agents} color="text-purple-600" />
            <StatRow label="Pending" value={stats.pending} color="text-amber-600" />
            <StatRow label="Critical" value={stats.critical} color="text-rose-600" />
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Explorer Hubs</div>
          <nav className="space-y-1">
            <NavItem 
              icon="⚡" 
              label="AI Workspace" 
              active={activeView === 'Workspace'} 
              onClick={() => setActiveView('Workspace')}
            />
            <NavItem 
              icon="📊" 
              label="Model Registry" 
              active={activeView === 'Registry'} 
              onClick={() => setActiveView('Registry')}
            />
            <NavItem 
              icon="🤖" 
              label="Agent Hub" 
              active={activeView === 'Agents'} 
              onClick={() => setActiveView('Agents')}
            />
            <NavItem 
              icon="🛡️" 
              label="Governance" 
              active={activeView === 'Governance'} 
              onClick={() => setActiveView('Governance')}
            />
            <NavItem 
              icon="💿" 
              label="Data Management" 
              active={activeView === 'Data'} 
              onClick={() => setActiveView('Data')}
            />
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">AD</div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate text-slate-900">Admin_Dev</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Enterprise Access</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const StatRow = ({ label, value, color = "text-slate-700" }: any) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-slate-500">{label}</span>
    <span className={`font-mono font-bold ${color}`}>{value}</span>
  </div>
);

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left group ${
      active 
        ? 'bg-purple-50 text-purple-700 font-bold' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`}
  >
    <span className="text-base transition-all">{icon}</span>
    <span className="text-sm">{label}</span>
    {active && <div className="ml-auto w-1 h-3 bg-purple-500 rounded-full"></div>}
  </button>
);

export default Sidebar;
