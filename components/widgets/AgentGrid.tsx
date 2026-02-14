
import React from 'react';
import { AIAgent } from '../../types';

interface AgentGridProps {
  agents: AIAgent[];
}

const AgentGrid: React.FC<AgentGridProps> = ({ agents }) => {
  if (!agents || !Array.isArray(agents) || agents.length === 0) return (
    <div className="p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700 text-center text-slate-500 italic">
      No AI agents matching those criteria found in the hub.
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {agents.map(a => (
        <div key={a.id} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 hover:border-indigo-400 transition-all cursor-pointer flex flex-col h-full group relative overflow-hidden">
          {/* Animated Background Pulse for Active Agents */}
          {a.status === 'Active' && (
            <div className="absolute top-0 right-0 p-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          )}

          <div className="mb-3">
            <h4 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
              {a.name}
              <span className="text-[8px] font-normal px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 uppercase tracking-tighter">
                {a.type}
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 italic">"{a.description}"</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-auto">
            <div className="text-center p-1.5 bg-slate-900/50 rounded-lg">
              <div className="text-[9px] text-slate-500 uppercase font-bold">Success</div>
              <div className="text-xs font-mono text-emerald-400">{(a.success_rate * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center p-1.5 bg-slate-900/50 rounded-lg">
              <div className="text-[9px] text-slate-500 uppercase font-bold">Latency</div>
              <div className="text-xs font-mono text-indigo-400">{a.avg_response_time.toFixed(1)}s</div>
            </div>
            <div className="text-center p-1.5 bg-slate-900/50 rounded-lg">
              <div className="text-[9px] text-slate-500 uppercase font-bold">Cost/Exec</div>
              <div className="text-xs font-mono text-amber-400">${a.cost_per_exec.toFixed(3)}</div>
            </div>
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/30">
             {a.capabilities.slice(0, 2).map((cap, i) => (
               <span key={i} className="text-[8px] text-slate-500 bg-slate-700/20 px-1.5 py-0.5 rounded">
                 {cap}
               </span>
             ))}
             {a.capabilities.length > 2 && <span className="text-[8px] text-slate-600">+{a.capabilities.length - 2} more</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentGrid;
