
import React, { useState, useMemo } from 'react';
import { AIAgent } from '../types';

interface AgentHubViewProps {
  agents: AIAgent[];
}

const AgentHubView: React.FC<AgentHubViewProps> = ({ agents }) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Idle' | 'Error'>('All');
  const [search, setSearch] = useState('');

  const filteredAgents = useMemo(() => {
    return agents.filter(a => {
      const matchesFilter = filter === 'All' || a.status === filter;
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.domain.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [agents, filter, search]);

  const stats = useMemo(() => ({
    total: agents.length,
    active: agents.filter(a => a.status === 'Active').length,
    avgSuccess: (agents.reduce((acc, a) => acc + a.success_rate, 0) / agents.length * 100).toFixed(1),
    totalCost: agents.reduce((acc, a) => acc + (a.usage_count * a.cost_per_exec), 0).toLocaleString()
  }), [agents]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Agent Hub</h2>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.2em] mt-1">Autonomous Fleet Management • Global Cluster</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Agents" value={stats.total} />
            <StatCard label="Live Instances" value={stats.active} color="text-emerald-600" />
            <StatCard label="Avg Success" value={`${stats.avgSuccess}%`} color="text-indigo-600" />
            <StatCard label="Mtd Cost" value={`$${stats.totalCost}`} color="text-amber-600" />
          </div>
        </header>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            {(['All', 'Active', 'Idle', 'Error'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Search by agent name or domain..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-80"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all group flex flex-col h-full relative overflow-hidden">
               <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110`}>
                 <div className="w-full h-full bg-indigo-500 rounded-full"></div>
               </div>

               <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-inner shrink-0">
                    {agent.type === 'Orchestrator' ? '🎼' : agent.type === 'Autonomous' ? '🧠' : '🤖'}
                 </div>
                 <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                   agent.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                   agent.status === 'Error' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                 }`}>
                   {agent.status}
                 </span>
               </div>

               <div className="flex-1">
                 <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{agent.name}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{agent.domain} • {agent.type}</p>
                 <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-2 italic">"{agent.description}"</p>
               </div>

               <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                 <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Execution Score</div>
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${agent.success_rate * 100}%` }}
                          ></div>
                       </div>
                       <span className="font-mono text-[10px] font-bold text-slate-700">{(agent.success_rate * 100).toFixed(0)}%</span>
                    </div>
                 </div>
                 <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Avg Latency</div>
                    <div className="text-xs font-mono font-bold text-slate-900">{agent.avg_response_time.toFixed(2)}s</div>
                 </div>
               </div>

               <div className="mt-4 flex flex-wrap gap-1.5">
                  {agent.capabilities.slice(0, 3).map((cap, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] rounded-md border border-slate-100">
                      {cap}
                    </span>
                  ))}
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color = "text-slate-900" }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500/30 transition-all">
    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
  </div>
);

export default AgentHubView;
