
import React, { useState } from 'react';
import { DataConnector, MLModel } from '../types';

interface HealthMonitorViewProps {
  connectors: DataConnector[];
  models: MLModel[];
}

const HealthMonitorView: React.FC<HealthMonitorViewProps> = ({ connectors, models }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('SRE Operational Report v2.4 successfully generated and dispatched to team-lead@enterprise.ai');
    }, 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-12 font-inter">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Sys-Ops Monitor</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Aura Core Infrastructure • Phase 2 Operational Readiness</p>
          </div>
          <div className="flex gap-8">
             <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Sockets</div>
                <div className="text-3xl font-black text-indigo-600">1,245</div>
             </div>
             <div className="text-right border-l border-slate-200 pl-8">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Latency (P99)</div>
                <div className="text-3xl font-black text-indigo-600">18ms</div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              {/* Connector Heartbeats */}
              <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Data Lake Heartbeats</h3>
                 <div className="space-y-6">
                    {connectors.map(c => (
                      <div key={c.id} className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl font-black shadow-sm uppercase">{c.name[0]}</div>
                         <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                               <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">{c.name} API Layer</span>
                               <span className="text-[10px] font-mono font-bold text-emerald-500">{c.latency_ms}ms</span>
                            </div>
                            <div className="flex gap-1">
                               {Array.from({length: 40}).map((_, i) => (
                                 <div 
                                   key={i} 
                                   className={`h-6 w-1 rounded-full ${i > 35 ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                                   title="Status: Healthy"
                                 ></div>
                               ))}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Inference Traffic Graph Simulation */}
              <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl overflow-hidden relative">
                 <div className="flex justify-between items-center mb-10">
                    <div>
                       <h3 className="text-xl font-bold uppercase tracking-tight">Live Inference Traffic</h3>
                       <p className="text-xs text-slate-400 uppercase tracking-widest opacity-60">Aggregated Global Requests per second</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Peak Load</span>
                       <div className="text-2xl font-black">2.4k RPS</div>
                    </div>
                 </div>
                 <div className="h-40 flex items-end gap-1 px-2">
                    {Array.from({length: 80}).map((_, i) => {
                      const height = 20 + Math.random() * 80;
                      return (
                        <div 
                          key={i} 
                          className="flex-1 bg-indigo-500/30 rounded-t-sm hover:bg-indigo-400 transition-all cursor-crosshair" 
                          style={{ height: `${height}%` }}
                        ></div>
                      );
                    })}
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none h-full"></div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Error Distributions</h3>
                 <div className="space-y-4">
                    <ErrorRow label="401 Unauthorized" value={2} color="bg-indigo-400" />
                    <ErrorRow label="429 Rate Limit" value={45} color="bg-amber-400" />
                    <ErrorRow label="503 Svc Unavail" value={1} color="bg-rose-400" />
                    <ErrorRow label="Timeout Exceptions" value={12} color="bg-slate-400" />
                 </div>
              </div>

              <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl flex flex-col">
                 <h3 className="font-bold text-indigo-100 uppercase tracking-widest text-[10px] mb-4">Core Model Reliability</h3>
                 <div className="text-4xl font-black">99.998%</div>
                 <p className="text-xs text-indigo-200 mt-2 leading-relaxed opacity-80">System-wide success rate for scheduled inference jobs across all regions.</p>
                 
                 <button 
                  onClick={handleDownloadReport}
                  disabled={isGenerating}
                  className={`w-full mt-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 ${
                    isGenerating ? 'bg-indigo-500 text-indigo-200 cursor-wait' : 'bg-white text-indigo-600 hover:bg-indigo-50'
                  }`}
                 >
                    {isGenerating && <div className="w-3 h-3 border-2 border-indigo-200 border-t-white rounded-full animate-spin"></div>}
                    {isGenerating ? 'Compiling Report...' : 'Download SRE Report'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ErrorRow = ({ label, value, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
       <span>{label}</span>
       <span>{value}</span>
    </div>
    <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
       <div className={`h-full ${color} rounded-full`} style={{ width: `${(value / 50) * 100}%` }}></div>
    </div>
  </div>
);

export default HealthMonitorView;
