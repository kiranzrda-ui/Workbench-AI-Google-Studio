
import React from 'react';
import { MLModel } from '../../types';

interface ModelGridProps {
  models: MLModel[];
}

const ModelGrid: React.FC<ModelGridProps> = ({ models }) => {
  if (!models || models.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {models.map(m => (
        <div key={m.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer group shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-slate-900 group-hover:text-indigo-600 truncate text-base">{m.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.domain} • {m.type}</p>
            </div>
            <div className="shrink-0">
               <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[9px] font-black uppercase border border-indigo-100">v{m.model_version}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-auto">
             <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Accuracy</div>
                <div className="text-sm font-black text-indigo-600">{(m.accuracy * 100).toFixed(1)}%</div>
             </div>
             <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Latency</div>
                <div className="text-sm font-black text-indigo-600">{m.latency}ms</div>
             </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
             <span className={`text-[8px] font-black uppercase tracking-widest ${m.monitoring_status === 'Healthy' ? 'text-emerald-500' : 'text-rose-500'}`}>
               ● {m.monitoring_status}
             </span>
             <button className="text-[9px] font-black text-indigo-600 uppercase group-hover:underline">Inspect Asset</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModelGrid;
