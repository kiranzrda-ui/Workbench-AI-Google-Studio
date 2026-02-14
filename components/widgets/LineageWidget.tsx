
import React from 'react';
import { MLModel } from '../../types';

const LineageWidget: React.FC<{ model: MLModel }> = ({ model }) => {
  if (!model) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 animate-in slide-in-from-left-4 duration-300">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Data Provenance Chain</h3>
      <div className="flex flex-col gap-4">
        {model.lineage.map((step, idx) => (
          <div key={step.id} className="flex gap-4 items-start relative">
            {idx < model.lineage.length - 1 && (
              <div className="absolute left-[11px] top-6 w-[2px] h-8 bg-slate-100"></div>
            )}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
              step.status === 'Active' ? 'bg-white border-indigo-500' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${step.status === 'Active' ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-800 leading-none">{step.name}</div>
              <div className="text-[9px] text-slate-400 font-medium uppercase mt-1">{step.type} • {step.status}</div>
              <div className="text-[10px] text-slate-500 mt-1 italic">{step.details}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineageWidget;
