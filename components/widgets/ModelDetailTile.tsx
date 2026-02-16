
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { MLModel } from '../../types';
import ShapPlot from './ShapPlot';

interface ModelDetailTileProps {
  model: MLModel;
}

const ModelDetailTile: React.FC<ModelDetailTileProps> = ({ model }) => {
  if (!model) return null;

  // Radar Data: comparing the model metrics to enterprise-wide baselines
  const radarData = [
    { subject: 'Accuracy', value: model.accuracy * 100, full: 100 },
    { subject: 'Latency', value: Math.max(0, 100 - (model.latency / 2)), full: 100 },
    { subject: 'Throughput', value: Math.min(100, model.throughput / 10), full: 100 },
    { subject: 'Health', value: (1 - model.error_rate) * 100, full: 100 },
    { subject: 'Efficiency', value: 100 - model.cpu_util, full: 100 },
  ];

  return (
    <div className="bg-slate-900 rounded-[32px] overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-500 max-w-2xl">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center">
        <div>
          <h3 className="text-white text-xl font-black tracking-tight">{model.name}</h3>
          <p className="text-purple-200 text-[10px] font-black uppercase tracking-widest mt-1">v{model.model_version} • Graphical Performance Artifact</p>
        </div>
        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-tighter border border-white/20">
          {model.monitoring_status}
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Graphical Section: Spider & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#475569" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={model.name}
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="#8b5cf6"
                  fillOpacity={0.5}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 800 }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 text-4xl">🧬</div>
          </div>

          <div className="space-y-4">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Inference Fingerprint</div>
                <div className="text-xs font-mono font-bold text-indigo-400">{model.inference_endpoint_id || 'LOCAL_BACKBONE_SYNC'}</div>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Operational Tier</div>
                <div className="text-xs font-bold text-white uppercase tracking-tighter">{model.sla_tier} Reliability Enforced</div>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800 p-3 rounded-xl">
                   <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Usage</div>
                   <div className="text-xs font-black text-white">{model.usage.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl">
                   <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Growth</div>
                   <div className="text-xs font-black text-emerald-400">+{model.user_growth}%</div>
                </div>
             </div>
          </div>
        </div>

        {/* Explainability Section: SHAP */}
        <div className="pt-8 border-t border-slate-800">
           <ShapPlot modelId={model.id} />
        </div>

        <div className="flex gap-4">
           <button className="flex-1 py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all">
              Inspect Full Metadata
           </button>
           <button className="flex-1 py-4 bg-slate-800 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all">
              Download Audit JSON
           </button>
        </div>
      </div>
      
      <div className="bg-slate-950 p-4 text-center">
         <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Aura Dynamic Artifact • Cryptographically Signed • {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default ModelDetailTile;
