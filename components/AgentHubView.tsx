
import React, { useState, useMemo } from 'react';
import { AIAgent } from '../types';

interface AgentHubViewProps {
  agents: AIAgent[];
}

const AgentHubView: React.FC<AgentHubViewProps> = ({ agents }) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Idle' | 'Error'>('All');
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  const filteredAgents = useMemo(() => {
    return agents.filter(a => {
      const matchesFilter = filter === 'All' || a.status === filter;
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.domain.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [agents, filter, search]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 flex gap-8">
      <div className="flex-1 space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Agent Registry</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Enterprise Orchestration Hub • {agents.length} Autonomous Units</p>
          </div>
          <div className="flex gap-4">
             <input 
               type="text" 
               placeholder="Search agent registry..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 w-80 shadow-sm transition-all outline-none"
             />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredAgents.slice(0, 15).map(agent => (
            <div 
              key={agent.id} 
              onClick={() => setSelectedAgent(agent)}
              className={`bg-white rounded-[40px] border-4 p-8 cursor-pointer transition-all duration-300 relative group ${selectedAgent?.id === agent.id ? 'border-indigo-600 shadow-2xl scale-[1.02]' : 'border-transparent hover:border-slate-100 shadow-sm hover:shadow-xl'}`}
            >
               <div className="flex justify-between items-start mb-8">
                 <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    {agent.type === 'Orchestrator' ? '🎼' : '🧠'}
                 </div>
                 <div className="text-right">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${agent.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                     {agent.status}
                   </span>
                 </div>
               </div>
               <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-2">{agent.name}</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{agent.domain} • Global Instance</p>
               
               <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-end">
                  <div>
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Execution Reliability</div>
                     <div className="text-2xl font-black text-indigo-600">{(agent.success_rate * 100).toFixed(1)}%</div>
                  </div>
                  <div className="text-right group/latency relative cursor-help">
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Avg TTL</div>
                     <div className="text-lg font-mono font-bold text-slate-900">{agent.avg_response_time}s</div>
                     <div className="absolute bottom-full right-0 mb-2 w-32 bg-slate-900 text-white p-2 rounded-lg text-[8px] opacity-0 group-hover/latency:opacity-100 transition-opacity pointer-events-none z-50">
                       P95 Response time within enterprise backbone.
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[450px] shrink-0 bg-white border-l border-slate-100 p-10 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.02)] z-10">
         {selectedAgent ? (
           <div className="space-y-10 h-full animate-in slide-in-from-right-8 duration-500">
              <header className="flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Agent Ops</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">UUID: {selectedAgent.id.toUpperCase()}</p>
                 </div>
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">⚙️</div>
              </header>

              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Reasoning Engine Tuning</label>
                    <div className="space-y-4">
                       <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-tighter">
                          <span>Temperature</span>
                          <span className="text-indigo-600">0.2</span>
                       </div>
                       <div className="w-full bg-slate-200 h-1.5 rounded-full relative">
                          <div className="absolute left-0 top-0 h-full bg-indigo-600 w-1/5 rounded-full"></div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master System Prompt</label>
                    <div className="relative group">
                      <textarea 
                        className="w-full bg-white border border-slate-200 rounded-[32px] p-6 text-xs font-bold text-slate-700 h-48 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all leading-relaxed shadow-sm resize-none"
                        defaultValue={`You are an autonomous ${selectedAgent.type} within the Companion Core platform. Your objective is to manage ${selectedAgent.domain} workloads while enforcing zero-trust data protocols and enterprise governance.`}
                      ></textarea>
                      <div className="absolute bottom-4 right-4 text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Editable Core</div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tool Entitlements</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Snowflake_Gateway', 'Alteryx_Engine_v2', 'AutoML_Provisioner'].map(tool => (
                        <div key={tool} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer group/tool">
                           <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{tool.replace(/_/g, ' ')}</span>
                           </div>
                           <div className="w-8 h-4 bg-indigo-600 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="pt-8 space-y-3">
                    <button className="w-full py-5 bg-slate-900 text-white font-black rounded-[28px] text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-400/30 active:scale-95 transition-all flex items-center justify-center gap-3">
                       <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                       Apply Changes & Hot-Deploy
                    </button>
                    <p className="text-center text-[9px] text-slate-400 font-bold uppercase italic">"Deployment takes ~12s to propagate to Global Edge Clusters."</p>
                 </div>
              </div>
           </div>
         ) : (
           <div className="h-full flex flex-col items-center justify-center text-center px-10">
              <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-4xl mb-8 border-4 border-dashed border-slate-200 text-slate-300 animate-pulse">🔧</div>
              <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight leading-none">Registry Management</h4>
              <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Select an autonomous agent from the primary registry to view real-time logs, tune its reasoning parameters, and manage cloud tool access.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default AgentHubView;
