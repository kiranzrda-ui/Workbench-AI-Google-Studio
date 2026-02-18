
import React, { useState, useMemo } from 'react';
import { MLModel } from '../../types';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell } from 'recharts';

interface ModelDiagnosticsProps {
  models: MLModel[];
}

const ModelDiagnostics: React.FC<ModelDiagnosticsProps> = ({ models }) => {
  const [selectedModel, setSelectedModel] = useState<MLModel>(models[0]);
  const [activeMetric, setActiveMetric] = useState<'Residuals' | 'Error Dist' | 'QQ Plot'>('Residuals');

  const simulatedData = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      actual: Math.random() * 100,
      predicted: 0,
      residual: 0,
      isOutlier: Math.random() > 0.96,
      id: i
    })).map(item => {
      const noise = (Math.random() - 0.5) * (selectedModel.accuracy > 0.9 ? 8 : 25);
      item.predicted = item.actual + noise;
      item.residual = item.predicted - item.actual;
      return item;
    });
  }, [selectedModel]);

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 gap-4 sm:gap-6 overflow-hidden min-h-0">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 shrink-0 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
         <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 gap-1 w-full sm:w-auto">
            { (['Residuals', 'Error Dist', 'QQ Plot'] as const).map(m => (
              <button 
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                  activeMetric === m ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest shrink-0">Asset:</label>
            <select 
              value={selectedModel.id}
              onChange={(e) => setSelectedModel(models.find(m => m.id === e.target.value) || models[0])}
              className="flex-1 sm:flex-none bg-white border border-slate-200 rounded-xl px-3 py-2 text-[9px] font-black text-indigo-600 outline-none hover:border-indigo-400 transition-all truncate"
            >
              {models.slice(0, 30).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
         <div className="flex-1 bg-white rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col relative min-h-0">
            <div className="mb-6 flex justify-between items-end shrink-0">
               <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">{activeMetric}</h3>
                  <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Isolation Matrix • v{selectedModel.model_version}</p>
               </div>
               <div className="text-right">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">R-Sq Fit</div>
                  <div className="text-xl font-black text-indigo-600">{(selectedModel.accuracy - 0.04).toFixed(3)}</div>
               </div>
            </div>

            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis type="number" dataKey="actual" name="Actual" tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                     <YAxis type="number" dataKey="residual" name="Residual" tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                     <ZAxis type="number" range={[40, 150]} />
                     <Tooltip 
                       cursor={{ strokeDasharray: '3 3' }}
                       contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', fontSize: '9px', fontWeight: 900 }}
                     />
                     <ReferenceLine y={0} stroke="#6366f1" strokeDasharray="5 5" strokeWidth={1.5} label={{ position: 'top', value: 'Baseline', fill: '#6366f1', fontSize: 8, fontWeight: 900 }} />
                     <Scatter name="Residues" data={simulatedData}>
                        {simulatedData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isOutlier ? '#f43f5e' : '#6366f1'} 
                            fillOpacity={entry.isOutlier ? 1 : 0.4} 
                            className="hover:scale-150 transition-all cursor-crosshair"
                          />
                        ))}
                     </Scatter>
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0 overflow-y-auto pr-1 min-h-0 custom-scrollbar">
            <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden group shrink-0">
               <h4 className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Diagnostic Profile</h4>
               <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tighter">
                  Asset exhibits heteroscedasticity in higher-bound splits. Recommend normalization cycle.
               </p>
            </div>

            <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
               <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Controls</h4>
               <div className="space-y-4">
                  <ControlToggle label="Isolate Outliers" checked={true} />
                  <ControlToggle label="Auto-Correction" checked={false} />
                  <ControlToggle label="Drift Filter" checked={true} />
               </div>
               <button className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95 mt-4">Re-Run Statistical Profile</button>
            </div>
         </div>
      </div>
    </div>
  );
};

const ControlToggle = ({ label, checked }: any) => (
  <div className="flex justify-between items-center group cursor-pointer">
     <span className="text-[9px] font-black text-slate-600 uppercase group-hover:text-slate-900 transition-colors">{label}</span>
     <div className={`w-7 h-4 rounded-full relative transition-all ${checked ? 'bg-indigo-600 shadow-sm' : 'bg-slate-200'}`}>
        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${checked ? 'right-0.5' : 'left-0.5'}`}></div>
     </div>
  </div>
);

export default ModelDiagnostics;
