
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
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Agent Registry</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Enterprise Orchestration Hub • {agents.length} Autonomous Units</p>
          </div>
          <div className="flex gap-4">
             <input 
               type="text" 
               placeholder="Filter by domain or name..." 
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
                    {agent.type.includes('Supervisor') ? '👮' : '🤖'}
                 </div>
                 <div className="text-right">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${agent.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                     {agent.status}
                   </span>
                 </div>
               </div>
               <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-2 uppercase">{agent.name}</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{agent.domain} • {agent.type}</p>
               
               <p className="mt-4 text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-3">"{agent.description}"</p>

               <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-6">
                  <div>
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Task Success</div>
                     <div className="text-2xl font-black text-indigo-600">{(agent.success_rate * 100).toFixed(1)}%</div>
                  </div>
                  <div className="text-right">
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Avg Response</div>
                     <div className="text-xl font-mono font-bold text-slate-900">{agent.avg_response_time.toFixed(2)}s</div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[480px] shrink-0 bg-white border-l border-slate-100 p-10 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.02)] z-10">
         {selectedAgent ? (
           <div className="space-y-10 h-full animate-in slide-in-from-right-8 duration-500">
              <header className="flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Agent Analytics</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Asset ID: {selectedAgent.id.toUpperCase()}</p>
                 </div>
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">📊</div>
              </header>

              <div className="space-y-8">
                 <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6 shadow-2xl">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Efficiency Protocol</h4>
                    <div className="grid grid-cols-2 gap-6">
                       <MetricCard label="Token Intensity" value={`~${selectedAgent.token_usage_avg}`} sub="avg tokens/msg" />
                       <MetricCard label="Compute Cost" value={`$${selectedAgent.cost_per_exec.toFixed(3)}`} sub="per execution" />
                    </div>
                    <div className="pt-4 border-t border-white/10 space-y-4">
                       <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Tool Accuracy</span>
                          <span className="text-emerald-400">{(selectedAgent.tool_usage_accuracy * 100).toFixed(1)}%</span>
                       </div>
                       <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${selectedAgent.tool_usage_accuracy * 100}%` }}></div>
                       </div>
                       <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Human Transfer Trigger</span>
                          <span className="text-amber-400">{(selectedAgent.human_transfer_rate * 100).toFixed(1)}%</span>
                       </div>
                       <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${selectedAgent.human_transfer_rate * 100}%` }}></div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Role Definition</label>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed border-l-4 border-indigo-500 pl-6 py-2">
                       {selectedAgent.description}
                    </p>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Capabilities</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.capabilities.map(cap => (
                        <span key={cap} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-700 uppercase">{cap}</span>
                      ))}
                    </div>
                 </div>

                 <div className="pt-8 space-y-3">
                    <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-[28px] text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-400/30 active:scale-95 transition-all flex items-center justify-center gap-3">
                       Invoke Reasoning Cycle
                    </button>
                    <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ownership: {selectedAgent.owner_team}</p>
                 </div>
              </div>
           </div>
         ) : (
           <div className="h-full flex flex-col items-center justify-center text-center px-10">
              <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-4xl mb-8 border-4 border-dashed border-slate-200 text-slate-300 animate-pulse">⚙️</div>
              <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight leading-none uppercase">Agent Hub</h4>
              <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Select an autonomous unit from the registry to view performance telemetry, operational costs, and capability vectors.</p>
           </div>
         )}
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, sub }: any) => (
   <div>
      <div className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter mb-1">{label}</div>
      <div className="text-xl font-black text-white">{value}</div>
      <div className="text-[7px] text-slate-500 font-black uppercase mt-0.5">{sub}</div>
   </div>
);

export default AgentHubView;
