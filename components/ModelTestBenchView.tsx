
import React, { useState, useMemo } from 'react';
import { MLModel, DataSet, ExperimentResult } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

interface ModelTestBenchProps {
  models: MLModel[];
  datasets: DataSet[];
}

const ModelTestBenchView: React.FC<ModelTestBenchProps> = ({ models, datasets }) => {
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<DataSet | null>(null);
  const [volume, setVolume] = useState<'Small' | 'Large' | 'Enterprise'>('Small');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ExperimentResult | null>(null);

  const startExperiment = () => {
    if (!selectedModel || !selectedDataset) return;
    setIsRunning(true);
    setResults(null);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setResults({
            id: `EXP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            model_id: selectedModel.id,
            timestamp: new Date().toISOString(),
            volume,
            accuracy: selectedModel.accuracy + (Math.random() * 0.04 - 0.02),
            f1_score: selectedModel.accuracy - 0.03,
            inference_time: volume === 'Small' ? '12ms' : (volume === 'Large' ? '85ms' : '410ms'),
            features_used: ['SIGNAL_A', 'TEMPORAL_VECTOR_01', 'GEO_HASH_v4']
          });
          return 100;
        }
        return p + 5;
      });
    }, 120);
  };

  const chartData = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      step: i,
      loss: Math.exp(-i / 3) + Math.random() * 0.1,
      accuracy: 0.7 + (i * 0.02) + Math.random() * 0.05
    }));
  }, [results]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 flex flex-col gap-6 font-inter">
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Model Test Bench</h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2">Isolated Cross-Experiment Validation</p>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm gap-1">
              {(['Small', 'Large', 'Enterprise'] as const).map(v => (
                <button 
                  key={v}
                  onClick={() => setVolume(v)}
                  className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${volume === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {v} Vol
                </button>
              ))}
           </div>
           <button 
             onClick={startExperiment}
             disabled={!selectedModel || !selectedDataset || isRunning}
             className="px-8 py-3.5 bg-slate-900 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all disabled:opacity-30 active:scale-95 flex items-center gap-2"
           >
             {isRunning ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : '🧪'}
             {isRunning ? `BENCH TESTING (${progress}%)` : 'EXECUTE EXPERIMENT'}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
         {/* Config Panel */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm space-y-8">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Target Model</label>
                  <select 
                     value={selectedModel?.id || ''}
                     onChange={(e) => setSelectedModel(models.find(m => m.id === e.target.value) || null)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-xs font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 outline-none shadow-sm cursor-pointer"
                  >
                     <option value="">Select ML Asset</option>
                     {models.slice(0, 50).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
               </div>

               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Validation Corpus</label>
                  <select 
                     value={selectedDataset?.id || ''}
                     onChange={(e) => setSelectedDataset(datasets.find(d => d.id === e.target.value) || null)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-xs font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 outline-none shadow-sm cursor-pointer"
                  >
                     <option value="">Select Reference Set</option>
                     {datasets.slice(0, 30).map(d => <option key={d.id} value={d.id}>{d.dataset_name}</option>)}
                  </select>
               </div>

               <div className="pt-6 border-t border-slate-50">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Volume Simulation Parameters</h4>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                        <span className="uppercase">Sharding Density</span>
                        <span className="text-indigo-600 font-black">X-GAUSS</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                        <span className="uppercase">Concurrency</span>
                        <span className="text-indigo-600 font-black">8-CORE MESH</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden flex flex-col group">
               <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl transition-transform group-hover:scale-110">📡</div>
               <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Live Bench Stream</h4>
               <div className="flex-1 font-mono text-[8px] text-slate-500 space-y-1 overflow-hidden h-32">
                  <p className="text-emerald-400">> Handshaking isolation kernel...</p>
                  <p className="text-slate-400">> Mapping tensors to sharded memory...</p>
                  <p className="text-slate-400">> {isRunning ? 'Processing inference cycle...' : 'Awaiting initialization cycle.'}</p>
               </div>
            </div>
         </div>

         {/* Results Display */}
         <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col">
            {!results && !isRunning && (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                  <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-5xl mb-4 border-4 border-dashed border-slate-100 text-slate-200">⚗️</div>
                  <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tight">System Ready for Bench Test</h3>
                  <p className="max-w-md text-slate-400 text-sm font-medium">Select a model and valid dataset from the catalog to initialize the cross-validation simulation environment.</p>
               </div>
            )}

            {isRunning && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                 <div className="relative">
                    <div className="w-32 h-32 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">🎛️</div>
                 </div>
                 <div className="text-center">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Stress Testing...</h3>
                    <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-widest">Injecting {volume} volume synthetic drift vectors</p>
                 </div>
                 <div className="w-full max-w-lg bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                 </div>
              </div>
            )}

            {results && !isRunning && (
              <div className="flex-1 flex flex-col p-10 space-y-10 animate-in slide-in-from-bottom-6">
                 <div className="grid grid-cols-4 gap-6">
                    <BenchStat label="Metric: Accuracy" value={`${(results.accuracy * 100).toFixed(2)}%`} color="text-indigo-600" />
                    <BenchStat label="Metric: F1 Score" value={results.f1_score.toFixed(3)} color="text-purple-600" />
                    <BenchStat label="Inference P99" value={results.inference_time} />
                    <BenchStat label="Test Identity" value={results.id} />
                 </div>

                 <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Convergence Delta</h4>
                       <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={chartData}>
                                <defs>
                                   <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="step" hide />
                                <YAxis hide domain={[0, 1]} />
                                <Tooltip contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                <Area type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experiment Artifacts</h4>
                       <div className="space-y-3">
                          {results.features_used.map(f => (
                            <div key={f} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-indigo-100 transition-all cursor-help">
                               <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                  <span className="text-[10px] font-black text-slate-700 uppercase">{f}</span>
                               </div>
                               <span className="text-[8px] font-black text-slate-400 uppercase opacity-0 group-hover:opacity-100 transition-all">Weight Verified</span>
                            </div>
                          ))}
                       </div>
                       <div className="mt-8 p-6 bg-slate-900 rounded-[32px] text-white">
                          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Final Verdict</p>
                          <p className="text-sm font-medium leading-relaxed italic">"Performance within 2σ of baseline. Safe for regional sharding."</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

const BenchStat = ({ label, value, color = "text-slate-900" }: any) => (
  <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 text-center shadow-inner group transition-all hover:bg-white hover:shadow-lg">
     <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">{label}</div>
     <div className={`text-base font-black ${color} tracking-tight`}>{value}</div>
  </div>
);

export default ModelTestBenchView;
