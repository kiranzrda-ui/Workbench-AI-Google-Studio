
import React, { useState, useMemo } from 'react';
import { MLModel, DataSet } from '../../types';

interface VisualMLEngineProps {
  models: MLModel[];
  datasets: DataSet[];
}

const ALGORITHMS: Record<string, string[]> = {
  'Classification': ['XGBoost Classifier', 'Random Forest', 'LightGBM', 'Logistic Regression'],
  'Regression': ['Gradient Boosting Regressor', 'ElasticNet', 'XGBoost Regressor'],
  'NLP': ['BERT Transformer', 'T5 Encoder', 'RoBERTa Base'],
  'Supply Chain': ['Temporal Fusion Transformer', 'DeepAR', 'Prophet Engine']
};

const VisualMLEngine: React.FC<VisualMLEngineProps> = ({ models, datasets }) => {
  const [step, setStep] = useState(1);
  const [selectedDs, setSelectedDs] = useState<DataSet | null>(null);
  const [selectedAlgo, setSelectedAlgo] = useState<string>('');
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const recommendations = useMemo(() => {
    if (!selectedDs) return [];
    if (selectedDs.domain === 'Retail') return ALGORITHMS['Classification'];
    if (selectedDs.domain === 'Finance') return ALGORITHMS['Classification'];
    if (selectedDs.domain === 'Healthcare') return ALGORITHMS['NLP'];
    if (selectedDs.domain === 'Supply Chain') return ALGORITHMS['Supply Chain'];
    return ALGORITHMS['Regression'];
  }, [selectedDs]);

  const handleStartTrain = () => {
    setIsTraining(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsTraining(false);
        setStep(4);
      }
    }, 50);
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 gap-4 sm:gap-6 overflow-hidden min-h-0">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm shrink-0">
         { [1, 2, 3, 4].map(s => (
           <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[10px] border-2 transition-all shrink-0 ${
                step === s ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' :
                step > s ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-300'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <div className="hidden md:block">
                 <p className={`text-[8px] font-black uppercase tracking-widest truncate ${step >= s ? 'text-slate-900' : 'text-slate-300'}`}>
                    {['Prepare', 'Select', 'Train', 'Deploy'][s-1]}
                 </p>
              </div>
              {s < 4 && <div className={`w-4 sm:w-12 h-0.5 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>}
           </div>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-1">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
             {datasets.slice(0, 24).map(ds => (
               <button 
                 key={ds.id} 
                 onClick={() => { setSelectedDs(ds); setStep(2); }}
                 className="bg-white border border-slate-200 p-4 rounded-2xl text-left hover:border-indigo-500 transition-all hover:shadow-md group flex flex-col justify-between"
               >
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {ds.source_platform === 'Snowflake' ? '❄️' : '🪄'}
                    </div>
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{ds.domain}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight mb-1 uppercase truncate w-full">{ds.dataset_name}</h4>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter truncate">{ds.record_count} Recs • {ds.size}</p>
               </button>
             ))}
          </div>
        )}

        {step === 2 && selectedDs && (
          <div className="max-w-3xl mx-auto space-y-6 pb-6">
             <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl">⚙️</div>
                <h3 className="text-xl font-black mb-1 uppercase tracking-tight">Recommended Architectures</h3>
                <p className="text-indigo-300 font-bold uppercase text-[8px] tracking-[0.2em] mb-8">Based on {selectedDs.domain} Domain Patterns</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {recommendations.map(algo => (
                     <button 
                       key={algo} 
                       onClick={() => { setSelectedAlgo(algo); setStep(3); }}
                       className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-indigo-600 transition-all text-left group"
                     >
                        <h4 className="font-black text-sm text-white group-hover:scale-105 transition-transform">{algo}</h4>
                        <div className="mt-3 flex gap-2">
                           <span className="px-1.5 py-0.5 bg-white/10 rounded text-[7px] font-black uppercase">Standard Tier</span>
                        </div>
                     </button>
                   ))}
                </div>
             </div>
             <button onClick={() => setStep(1)} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">← Back to Data Selection</button>
          </div>
        )}

        {step === 3 && selectedAlgo && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
             {!isTraining ? (
                <>
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border-4 border-indigo-50 flex items-center justify-center text-3xl animate-bounce">🛠️</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase">Prepare for Ingest</h3>
                    <p className="text-slate-500 font-medium text-xs mt-2 max-w-sm">Finalizing neural weights for <strong>{selectedAlgo}</strong>.</p>
                  </div>
                  <button 
                    onClick={handleStartTrain}
                    className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                  >
                    Initialize Neural Training
                  </button>
                </>
             ) : (
                <div className="w-full max-w-md space-y-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">⚡</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Cycle Convergence Active</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 animate-pulse">Epoch {Math.floor(progress/5)}</p>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
             )}
          </div>
        )}

        {step === 4 && (
          <div className="max-w-2xl mx-auto space-y-6 py-6">
             <div className="bg-emerald-50 rounded-[32px] p-8 text-center border-4 border-emerald-100 shadow-xl">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg animate-in zoom-in">✅</div>
                <h3 className="text-2xl font-black text-emerald-900 tracking-tighter uppercase mb-2">Model Registry Ingested</h3>
                <p className="text-emerald-700 font-bold uppercase text-[8px] tracking-[0.2em] mb-8">Artifact: SHA256_{Math.random().toString(36).substr(2, 5).toUpperCase()}</p>
                
                <div className="grid grid-cols-3 gap-4 bg-white/50 rounded-2xl p-4 border border-emerald-200">
                   <ArtifactStat label="Accuracy" value="98.4%" />
                   <ArtifactStat label="Latency" value="12ms" />
                   <ArtifactStat label="SLA" value="Tier 1" />
                </div>

                <div className="mt-8 flex gap-3 justify-center">
                   <button onClick={() => setStep(1)} className="px-6 py-3 bg-white border border-emerald-200 text-emerald-700 font-black rounded-xl uppercase text-[9px] tracking-widest hover:bg-emerald-100 transition-all">New Job</button>
                   <button className="px-6 py-3 bg-emerald-600 text-white font-black rounded-xl uppercase text-[9px] tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30">Promote</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ArtifactStat = ({ label, value }: any) => (
  <div>
    <div className="text-[7px] font-black text-emerald-600 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-sm font-black text-slate-900">{value}</div>
  </div>
);

export default VisualMLEngine;
