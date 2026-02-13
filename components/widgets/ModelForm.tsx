
import React from 'react';

const ModelForm: React.FC = () => {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-indigo-500/30 shadow-2xl shadow-indigo-500/5">
      <h3 className="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
        Register New Model
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Model Name</label>
            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g., Churn Predictor" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Domain</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none">
              <option>Retail</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Tech</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Use Case Description</label>
            <textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none h-20" placeholder="Describe what this model does..."></textarea>
        </div>
        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20">
          Submit for Validation
        </button>
        <p className="text-[10px] text-center text-slate-500">Models must meet 75% accuracy baseline to be registered.</p>
      </div>
    </div>
  );
};

export default ModelForm;
