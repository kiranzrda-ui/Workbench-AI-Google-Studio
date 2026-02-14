
import React from 'react';
import { MLModel } from '../../types';
import ShapPlot from './ShapPlot';

interface PerformanceProfileProps {
  model: MLModel;
}

const PerformanceProfile: React.FC<PerformanceProfileProps> = ({ model }) => {
  if (!model) return null;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Accuracy" value={`${(model.accuracy * 100).toFixed(1)}%`} color="text-indigo-600" />
        <MetricCard label="Latency" value={`${model.latency}ms`} color="text-purple-600" />
        <MetricCard label="Data Drift" value={`${(model.data_drift * 100).toFixed(1)}%`} color={model.data_drift > 0.08 ? "text-rose-600" : "text-emerald-600"} />
        <MetricCard label="Throughput" value={`${model.throughput} r/m`} color="text-slate-900" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            Performance & Insights: {model.name}
          </h3>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              Error Rate: {(model.error_rate * 100).toFixed(2)}%
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              v{model.model_version}
            </span>
          </div>
        </div>
        
        <ShapPlot modelId={model.id} />
        
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-8">
           <div className="space-y-2">
             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Training Source</div>
             <div className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 truncate">
               {model.training_data_source}
             </div>
           </div>
           <div className="space-y-2">
             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Operational Health</div>
             <div className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
               CPU: {model.cpu_util}% • Mem: {model.mem_util}%
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, color }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-sm font-bold ${color}`}>{value}</div>
  </div>
);

export default PerformanceProfile;
