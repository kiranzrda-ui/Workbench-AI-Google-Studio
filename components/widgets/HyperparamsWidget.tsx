
import React from 'react';
import { MLModel } from '../../types';

const HyperparamsWidget: React.FC<{ model: MLModel }> = ({ model }) => {
  if (!model) return null;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl p-6 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Tuning Specifications</h3>
        <span className="text-[10px] text-slate-500 font-mono">v{model.model_version}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(model.hyperparameters).map(([key, val]) => (
          <div key={key} className="bg-slate-800 border border-slate-700 p-3 rounded-xl flex flex-col">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">{key.replace(/_/g, ' ')}</span>
            <span className="text-xs font-mono font-bold text-indigo-300">{String(val)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HyperparamsWidget;
