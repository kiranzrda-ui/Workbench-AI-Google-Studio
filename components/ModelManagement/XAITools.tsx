
import React, { useState, useMemo, useEffect } from 'react';
import { MLModel } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface XAIToolsProps {
  models: MLModel[];
}

const DOMAIN_FEATURES: Record<string, string[]> = {
  Retail: ['Seasonal_Promo', 'Loyalty_Score', 'Purchase_Freq', 'Geo_Affinity', 'Basket_Size', 'Category_Risk'],
  Finance: ['Credit_Util', 'Debt_Ratio', 'Pay_History', 'Account_Age', 'Velocity', 'Bureau_Score'],
  Healthcare: ['Age_Group', 'Comorbidity', 'BMI', 'Last_Visit', 'Vital_Sign', 'Marker_Alpha'],
  Tech: ['Uptime', 'Latency_P95', 'Session_Depth', 'Auth_Method', 'Payload', 'Browser'],
  'Supply Chain': ['Lead_Time', 'Fuel_Index', 'Throughput', 'Reliability', 'Congestion', 'Turn_Rate']
};

const XAITools: React.FC<XAIToolsProps> = ({ models }) => {
  const [selectedModel, setSelectedModel] = useState<MLModel>(models[0]);
  const [xaiMode, setXaiMode] = useState<'SHAP' | 'LIME' | 'Bias Audit'>('SHAP');
  const [isComputing, setIsComputing] = useState(false);

  useEffect(() => {
    setIsComputing(true);
    const timer = setTimeout(() => setIsComputing(false), 600);
    return () => clearTimeout(timer);
  }, [selectedModel.id, xaiMode]);

  const shapData = useMemo(() => {
    const features = DOMAIN_FEATURES[selectedModel.domain] || DOMAIN_FEATURES['Tech'];
    return features.map((f, i) => {
      const seed = (selectedModel.id.length + i) % 10;
      const impact = (seed / 10) * (i % 2 === 0 ? 1 : -1) * selectedModel.accuracy;
      return { feature: f, impact, positive: impact > 0 };
    }).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }, [selectedModel]);

  const fairnessData = useMemo(() => {
    const base = selectedModel.accuracy * 100;
    const jitter = (val: number) => Math.min(100, Math.max(70, val + (Math.random() * 8 - 4)));
    return [
      { subject: 'Demographic', value: jitter(base - 5) },
      { subject: 'Equal Odds', value: jitter(base - 8) },
      { subject: 'Predictive', value: jitter(base) },
      { subject: 'Disparate', value: jitter(base - 3) },
      { subject: 'Treatment', value: jitter(base - 6) },
    ];
  }, [selectedModel]);

  const transparencyMetrics = useMemo(() => {
    const score = Math.floor(selectedModel.accuracy * 80 + (selectedModel.model_stage === 'Production' ? 15 : 5));
    return {
      score,
      cert: score > 85 ? 'HIGH' : score > 70 ? 'MEDIUM' : 'LOW',
      robust: `${Math.floor(selectedModel.accuracy * 95)}%`
    };
  }, [selectedModel]);

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 gap-4 sm:gap-6 overflow-hidden min-h-0 relative">
      {isComputing && (
        <div className="absolute inset-0 z-50 bg-slate-50/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-100">
            <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Attributing...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 bg-white p-3 rounded-2xl border border-slate-200">
         <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 gap-1 w-full sm:w-auto">
            { (['SHAP', 'LIME', 'Bias Audit'] as const).map(m => (
              <button 
                key={m}
                onClick={() => setXaiMode(m)}
                className={`flex-1 sm:flex-none px-5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                  xaiMode === m ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
         </div>
         <select 
            value={selectedModel.id}
            onChange={(e) => setSelectedModel(models.find(m => m.id === e.target.value) || models[0])}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-[9px] font-black text-indigo-600 outline-none truncate"
          >
            {models.slice(0, 30).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
         <div className="bg-white rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col relative min-h-0">
            <div className="flex justify-between items-start mb-6 shrink-0">
               <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">{xaiMode}</h3>
                  <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                    {xaiMode === 'SHAP' ? 'Global Importance' : xaiMode === 'LIME' ? 'Local Instance' : 'Fairness Audit'}
                  </p>
               </div>
               <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border ${
                 selectedModel.monitoring_status === 'Healthy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
               }`}>
                 {selectedModel.monitoring_status === 'Healthy' ? 'PASS' : 'WARN'}
               </div>
            </div>

            <div className="flex-1 min-h-0">
               {xaiMode === 'SHAP' ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={shapData} margin={{ left: -10 }}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                       <XAxis type="number" hide />
                       <YAxis 
                        dataKey="feature" 
                        type="category" 
                        tick={{ fontSize: 8, fontWeight: 900, fill: '#64748b' }} 
                        axisLine={false} 
                        tickLine={false} 
                        width={90} 
                       />
                       <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} contentStyle={{ border: 'none', borderRadius: '12px', fontSize: '9px', fontWeight: 900 }} />
                       <Bar dataKey="impact" radius={[0, 6, 6, 0]} barSize={14}>
                          {shapData.map((entry, index) => (
                            <Cell key={index} fill={entry.positive ? '#10b981' : '#f43f5e'} fillOpacity={0.8} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
               ) : xaiMode === 'Bias Audit' ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={fairnessData}>
                       <PolarGrid stroke="#cbd5e1" />
                       <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 8, fontWeight: 900 }} />
                       <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                       <Radar name="Fairness" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} strokeWidth={2} />
                    </RadarChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="text-4xl">👁️</div>
                    <h4 className="text-sm font-black text-slate-800 uppercase">Local Surrogate Modeling</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[200px]">Generating weighted sample sets to explain individual prediction vectors.</p>
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[8px] uppercase tracking-widest shadow-md">Initialize</button>
                 </div>
               )}
            </div>
         </div>

         <div className="flex flex-col gap-4 overflow-y-auto pr-1 min-h-0 custom-scrollbar">
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group shrink-0">
               <h4 className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Transparency</h4>
               <div className="space-y-4">
                  <TransparencyLine label="Explainability" value={`${transparencyMetrics.score}/100`} />
                  <TransparencyLine label="Certifiability" value={transparencyMetrics.cert} color={transparencyMetrics.cert === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'} />
                  <TransparencyLine label="Robustness" value={transparencyMetrics.robust} />
               </div>
            </div>

            <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col shrink-0 min-h-[300px]">
               <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-6">Governance Policy</h4>
               <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">Ethical Constraints</p>
                     <div className="flex flex-wrap gap-1.5 mt-2">
                        {['Fairness', 'Privacy', 'Zero_PII'].map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[7px] font-black uppercase border border-indigo-100">{tag}</span>
                        ))}
                     </div>
                  </div>
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <p className="text-[8px] font-black text-emerald-700 uppercase tracking-widest mb-1">Protection</p>
                    <p className="text-[9px] text-slate-500 leading-tight">Automated redaction active for sensitive features.</p>
                  </div>
               </div>
               <button className="mt-auto w-full py-3 bg-white border-2 border-slate-200 text-slate-400 rounded-xl font-black text-[8px] uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm">Compliance PDF</button>
            </div>
         </div>
      </div>
    </div>
  );
};

const TransparencyLine = ({ label, value, color = "text-white" }: any) => (
  <div className="flex justify-between items-center border-b border-white/5 pb-2">
     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
     <span className={`text-[11px] font-black uppercase ${color}`}>{value}</span>
  </div>
);

export default XAITools;
