
import React, { useState } from 'react';
import { DataConnector } from '../types';

interface SettingsViewProps {
  connectors: DataConnector[];
}

const SettingsView: React.FC<SettingsViewProps> = ({ connectors }) => {
  const [activeCategory, setActiveCategory] = useState<'Connectors' | 'Security' | 'AI Core'>('Connectors');

  return (
    <div className="flex-1 overflow-y-auto bg-white p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Orchestrator Settings</h2>
          <p className="text-slate-500 font-medium mt-2">Manage enterprise integrations, security protocols, and agentic tuning.</p>
        </header>

        <div className="flex gap-1 bg-slate-100 p-1.5 rounded-[20px] w-fit">
           {(['Connectors', 'Security', 'AI Core'] as const).map(cat => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-8 py-2.5 rounded-[14px] text-xs font-black transition-all ${activeCategory === cat ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {activeCategory === 'Connectors' && (
          <div className="space-y-6">
            {connectors.map(c => (
              <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm border border-slate-100">
                      {c.name === 'Snowflake' ? '❄️' : c.name === 'Alteryx' ? '🪄' : '📦'}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{c.name} Integration</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Connection • v2.1.4</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-black rounded-xl text-[10px] uppercase hover:bg-slate-100 transition-all">Test Sync</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(c.config).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</label>
                      <input 
                        type="text" 
                        value={val} 
                        readOnly
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-600 focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Secret (Encrypted)</label>
                    <input 
                      type="password" 
                      value="************************" 
                      readOnly
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-600" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeCategory === 'Security' && (
          <div className="space-y-8 bg-slate-900 rounded-[40px] p-10 text-white">
             <div className="space-y-2">
                <h3 className="text-2xl font-bold">Hardened Security Layer</h3>
                <p className="text-slate-400 text-sm">All tool calls are signed with an HMAC-SHA256 enterprise certificate.</p>
             </div>
             <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-6 bg-slate-800 rounded-3xl border border-slate-700">
                   <div>
                      <h4 className="font-bold">Two-Factor Orchestration Approval</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Status: Enabled</p>
                   </div>
                   <div className="w-12 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-800 rounded-3xl border border-slate-700 opacity-50">
                   <div>
                      <h4 className="font-bold">PII/PHI Automated Redaction</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Status: Enforced by Policy</p>
                   </div>
                   <div className="w-12 h-6 bg-indigo-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;
