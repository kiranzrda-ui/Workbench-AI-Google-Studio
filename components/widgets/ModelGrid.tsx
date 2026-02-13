
import React from 'react';
import { MLModel } from '../../types';

interface ModelGridProps {
  models: MLModel[];
}

const ModelGrid: React.FC<ModelGridProps> = ({ models }) => {
  if (!models || models.length === 0) return (
    <div className="p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700 text-center text-slate-500 italic">
      No models matching those criteria found in the registry.
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {models.map(m => (
        <div key={m.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer group flex flex-col h-full">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-100 group-hover:text-indigo-400 truncate leading-tight">{m.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{m.domain}</span>
                <span className="text-slate-700">•</span>
                <span className="text-[9px] font-bold text-slate-400">{m.type}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter ${
                m.model_stage === 'Production' ? 'bg-emerald-500/10 text-emerald-400' : 
                m.model_stage === 'Staging' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {m.model_stage}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-3">
              <div className="flex justify-between border-b border-slate-700/50 pb-1">
                <span>Accuracy:</span>
                <span className="text-slate-200 font-mono">{(m.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-1">
                <span>Latency:</span>
                <span className="text-slate-200 font-mono">{m.latency}ms</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-900 rounded-full h-1 mb-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  m.accuracy > 0.9 ? 'bg-emerald-500' : 
                  m.accuracy > 0.8 ? 'bg-indigo-500' : 'bg-amber-500'
                }`} 
                style={{ width: `${m.accuracy * 100}%` }}
              ></div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 text-[10px] bg-slate-900 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg border border-slate-700 transition-colors">
                View Specs
              </button>
              <button className="flex-1 text-[10px] bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white py-1.5 rounded-lg border border-indigo-500/30 transition-all font-bold">
                Deploy
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModelGrid;
