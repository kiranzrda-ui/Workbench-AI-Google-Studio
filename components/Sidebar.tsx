
import React, { useState } from 'react';
import { Persona } from '../types';
import { AppView } from '../App';

interface SidebarProps {
  persona: Persona;
  setPersona: (p: Persona) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  stats: { total: number; agents: number; pending: number; critical: number };
}

const Sidebar: React.FC<SidebarProps> = ({ persona, setPersona, activeView, setActiveView, stats }) => {
  const [openGroup, setOpenGroup] = useState<string | null>('MLOps');

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col p-5 hidden md:flex shrink-0">
      <div className="mb-8 shrink-0">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Identity</div>
        <div className="flex flex-col gap-1.5">
          {(['Data Scientist', 'Supervisor'] as Persona[]).map((p) => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className={`text-left px-4 py-2.5 rounded-xl transition-all flex items-center justify-between border ${
                persona === p 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-200' 
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold text-xs">{p}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${persona === p ? 'bg-white' : 'bg-slate-300'}`}></div>
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto pr-1 custom-scrollbar">
        <div>
          <NavItem icon="💬" label="Companion" active={activeView === 'Companion'} onClick={() => setActiveView('Companion')} />
        </div>

        {/* MLOps Support Group */}
        <div>
          <button 
            onClick={() => setOpenGroup(openGroup === 'MLOps' ? null : 'MLOps')}
            className="w-full flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 hover:text-slate-600 transition-colors"
          >
            <span>MLOps Support</span>
            <span className="text-[8px]">{openGroup === 'MLOps' ? '▼' : '▶'}</span>
          </button>
          {openGroup === 'MLOps' && (
            <div className="space-y-1 ml-2 border-l border-slate-100 pl-2">
              <NavItem icon="📊" label="Model Registry" active={activeView === 'Registry'} onClick={() => setActiveView('Registry')} small />
              <NavItem icon="⚒️" label="Model Optimizer" active={activeView === 'Optimizer'} onClick={() => setActiveView('Optimizer')} small />
              <NavItem icon="💿" label="Data Catalog" active={activeView === 'Catalog'} onClick={() => setActiveView('Catalog')} small />
              <NavItem icon="📜" label="Data Recipes" active={activeView === 'Recipes'} onClick={() => setActiveView('Recipes')} small />
              <NavItem icon="🔬" label="Model Test Bench" active={activeView === 'TestBench'} onClick={() => setActiveView('TestBench')} small />
            </div>
          )}
        </div>

        {/* Data Management Group */}
        <div>
          <button 
            onClick={() => setOpenGroup(openGroup === 'Data' ? null : 'Data')}
            className="w-full flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 hover:text-slate-600 transition-colors"
          >
            <span>Data Management</span>
            <span className="text-[8px]">{openGroup === 'Data' ? '▼' : '▶'}</span>
          </button>
          {openGroup === 'Data' && (
            <div className="space-y-1 ml-2 border-l border-slate-100 pl-2">
              <NavItem icon="📐" label="Visual Transformation" active={activeView === 'VisualTransform'} onClick={() => setActiveView('VisualTransform')} small />
              <NavItem icon="🧪" label="Specialised Prep" active={activeView === 'SpecialPrep'} onClick={() => setActiveView('SpecialPrep')} small />
              <NavItem icon="🔭" label="Visual Explorer" active={activeView === 'VisualExplorer'} onClick={() => setActiveView('VisualExplorer')} small />
              <NavItem icon="🔌" label="Data Connectivity" active={activeView === 'Connectivity'} onClick={() => setActiveView('Connectivity')} small />
            </div>
          )}
        </div>

        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Global Hubs</div>
          <div className="space-y-1">
            <NavItem icon="🤖" label="Agent Registry" active={activeView === 'Agents'} onClick={() => setActiveView('Agents'} />
            <NavItem icon="🛡️" label="Governance" active={activeView === 'Governance'} onClick={() => setActiveView('Governance')} />
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100">
         <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-white shadow-lg">AD</div>
            <div className="min-w-0">
               <div className="text-xs font-black truncate text-slate-900">Admin_Dev</div>
               <div className="text-[8px] text-emerald-600 uppercase font-black tracking-tighter">Enterprise Access</div>
            </div>
         </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active, onClick, small }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left group ${
      active 
        ? 'bg-purple-50 text-purple-700 font-black shadow-sm' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`}
  >
    <span className={`${small ? 'text-sm' : 'text-base'} transition-all`}>{icon}</span>
    <span className={`${small ? 'text-[11px]' : 'text-xs'} font-bold`}>{label}</span>
    {active && <div className="ml-auto w-1 h-3 bg-purple-500 rounded-full"></div>}
  </button>
);

export default Sidebar;
