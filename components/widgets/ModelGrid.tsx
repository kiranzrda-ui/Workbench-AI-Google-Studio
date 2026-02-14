
import React from 'react';
import { MLModel } from '../../types';

interface ModelGridProps {
  models: MLModel[];
}

const ModelGrid: React.FC<ModelGridProps> = ({ models }) => {
  if (!models || !Array.isArray(models) || models.length === 0) return (
    <div className="p-4 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-400 italic">
      No models matching those criteria found in the registry.
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {models.map(m => (
        <div key={m.id} className="bg-white rounded-xl p-4 border border-slate-200 hover:border-purple-400 transition-all cursor-pointer group flex flex-col h-full relative shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="flex-1 min-w-0">
              <div className="relative group/name">
                <h4 className="font-bold text-slate-800 group-hover:text-purple-600 truncate leading-tight">
                  {m.name}
                </h4>
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/name:block z-50 animate-in fade-in slide-in-from-bottom-1 pointer-events-none">
                  <div className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 shadow-xl text-[9px] whitespace-nowrap border-l-2 border-l-amber-500">
                    <span className="text-slate-500 uppercase font-bold mr-1 tracking-tighter">Stability Index:</span>
                    <span className={`font-mono font-bold ${m.data_drift > 0.08 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {(m.data_drift * 100).toFixed(1)}% Drift
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.domain}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[9px] font-bold text-slate-500">{m.type}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter ${
                m.model_stage === 'Production' ? 'bg-emerald-100 text-emerald-700' : 
                m.model_stage === 'Staging' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {m.model_stage}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] text-slate-500 mb-3">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>Accuracy:</span>
                <span className="text-slate-900 font-mono font-bold">{(m.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>Latency:</span>
                <span className="text-slate-900 font-mono font-bold">{m.latency}ms</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 group/history relative">
                <span>Last Retrained:</span>
                <span className="text-purple-600 font-mono flex items-center gap-1 cursor-help font-bold">
                  {m.last_retrained_date}
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                {m.retraining_history && m.retraining_history.length > 0 && (
                  <div className="absolute bottom-full left-0 mb-2 w-full hidden group-hover/history:block z-50 animate-in fade-in slide-in-from-bottom-1">
                    <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-xl">
                      <div className="text-[8px] uppercase tracking-widest text-slate-400 mb-1 border-b border-slate-100 pb-1">Retraining History</div>
                      {m.retraining_history.map((date, idx) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span className="text-slate-400">v{m.model_version.split('.')[0]}.{parseInt(m.model_version.split('.')[1]) - idx - 1}</span>
                          <span className="text-slate-800 font-medium">{date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-1 mb-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  m.accuracy > 0.9 ? 'bg-emerald-500' : 
                  m.accuracy > 0.8 ? 'bg-purple-500' : 'bg-amber-500'
                }`} 
                style={{ width: `${m.accuracy * 100}%` }}
              ></div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 py-1.5 rounded-lg border border-slate-200 transition-colors">
                View Specs
              </button>
              <button className="flex-1 text-[10px] bg-purple-500 hover:bg-purple-600 text-white py-1.5 rounded-lg border border-transparent transition-all font-bold">
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
