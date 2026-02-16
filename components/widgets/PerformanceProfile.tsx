
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
        <MetricCard label="Accuracy" value={`${(model.accuracy * 100).toFixed(1)}%`} color="text-indigo-400" />
        <MetricCard label="Latency" value={`${model.latency}ms`} color="text-purple-400" />
        <MetricCard label="Data Drift" value={`${(model.data_drift * 100).toFixed(1)}%`} color={model.data_drift > 0.08 ? "text-rose-400" : "text-emerald-400"} />
        <MetricCard label="Throughput" value={`${model.throughput} r/m`} color="text-white" />
      </div>

      <div className="bg-slate-900 rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Agentic Insights Protocol: {model.name}
          </h3>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Error: {(model.error_rate * 100).toFixed(2)}%
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              v{model.model_version}
            </span>
          </div>
        </div>
        
        <ShapPlot modelId={model.id} />
        
        <div className="mt-10 pt-10 border-t border-slate-800 grid grid-cols-2 gap-10">
           <div className="space-y-3">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Training Provisioner</div>
             <div className="text-xs font-bold text-white bg-slate-800 px-4 py-3 rounded-2xl border border-slate-700 truncate shadow-inner">
               {model.training_data_source}
             </div>
           </div>
           <div className="space-y-3">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resource Allocation</div>
             <div className="text-xs font-bold text-white bg-slate-800 px-4 py-3 rounded-2xl border border-slate-700 shadow-inner">
               CPU: {model.cpu_util}% • Mem: {model.mem_util}%
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, color }: any) => (
  <div className="bg-slate-900 p-5 rounded-[24px] border border-slate-800 shadow-xl transition-all hover:border-slate-700">
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</div>
    <div className={`text-base font-black ${color} tracking-tight`}>{value}</div>
  </div>
);

export default PerformanceProfile;
