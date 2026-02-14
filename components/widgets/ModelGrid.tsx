
import React from 'react';
import { MLModel } from '../../types';

interface ModelGridProps {
  models: MLModel[];
}

const ModelGrid: React.FC<ModelGridProps> = ({ models }) => {
  if (!models || !Array.isArray(models) || models.length === 0) return (
    <div className="p-8 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center flex flex-col items-center gap-4">
      <span className="text-4xl opacity-20">📂</span>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching assets identified in registry.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {models.map(m => (
        <div key={m.id} className="bg-white rounded-[32px] p-6 border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer group flex flex-col h-full relative shadow-sm hover:shadow-xl">
          <div className="flex justify-between items-start mb-4 gap-2">
            <div className="flex-1 min-w-0">
              <div className="relative group/name">
                <h4 className="font-black text-slate-900 group-hover:text-indigo-600 truncate leading-tight text-lg tracking-tight transition-colors">
                  {m.name}
                </h4>
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/name:block z-50 animate-in fade-in slide-in-from-bottom-1 pointer-events-none">
                  <div className="bg-slate-900 text-white rounded-xl px-3 py-2 shadow-2xl text-[9px] border border-slate-800">
                    <span className="text-indigo-400 uppercase font-black mr-2 tracking-widest">Asset UID:</span>
                    <span className="font-mono text-slate-300">{m.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">{m.domain}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[9px] font-bold text-slate-500">{m.type}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest border ${
                m.model_stage === 'Production' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                m.model_stage === 'Staging' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'
              }`}>
                {m.model_stage}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] text-slate-500 mb-4">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400 uppercase tracking-tighter">Confidence:</span>
                <span className="text-slate-900 font-mono font-black">{(m.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400 uppercase tracking-tighter">Latency:</span>
                <span className="text-slate-900 font-mono font-black">{m.latency}ms</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 col-span-2 group/history relative">
                <span className="font-bold text-slate-400 uppercase tracking-tighter">Last Synchronization:</span>
                <span className="text-indigo-600 font-mono flex items-center gap-1 cursor-help font-black">
                  {m.last_retrained_date}
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </span>
              </div>
            </div>
            
            <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-1.5 mb-6 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  m.accuracy > 0.9 ? 'bg-emerald-500' : 
                  m.accuracy > 0.8 ? 'bg-indigo-500' : 'bg-amber-500'
                }`} 
                style={{ width: `${m.accuracy * 100}%` }}
              ></div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                View Ledger
              </button>
              <button className="flex-1 text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl border border-transparent transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                Push Prod
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModelGrid;
