
import React, { useState, useEffect } from 'react';
import { DataSet, MLModel, TrainingAction } from '../types';

interface TrainingHubViewProps {
  datasets: DataSet[];
  models: MLModel[];
}

const TRAINING_ACTIONS: TrainingAction[] = [
  'Reinforcement Learning',
  'Fine-Tuning',
  'Weight Distillation',
  'Hyper-Parameter Optimization',
  'First-Light Training'
];

const TrainingHubView: React.FC<TrainingHubViewProps> = ({ datasets, models }) => {
  const [draggedItem, setDraggedItem] = useState<{ item: any; type: 'dataset' | 'model' } | null>(null);
  const [stagedDataset, setStagedDataset] = useState<DataSet | null>(null);
  const [stagedModel, setStagedModel] = useState<MLModel | null>(null);
  const [selectedAction, setSelectedAction] = useState<TrainingAction | null>(null);
  
  const [isOverGreenfield, setIsOverGreenfield] = useState(false);
  const [isOverBrownfield, setIsOverBrownfield] = useState(false);
  
  const [isTraining, setIsTraining] = useState(false);
  const [trainingPhase, setTrainingPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const trainingPhases = [
    { label: "Neural Link", detail: "Initializing multi-cloud GPU tensors..." },
    { label: "Data Ingest", detail: "Sharding input data for parallel processing..." },
    { label: "Weights Load", detail: "Serializing existing model weights..." },
    { label: "HP Tuning", detail: "Searching optimal Bayesian space..." },
    { label: "Converging", detail: "Loss function stabilization in progress..." },
    { label: "Validating", detail: "Cross-validation against Snowflake Gold..." },
    { label: "Sealing", detail: "Generating final immutable artifact..." }
  ];

  const handleDragStart = (e: React.DragEvent, item: any, type: 'dataset' | 'model') => {
    setDraggedItem({ item, type });
    e.dataTransfer.setData('type', type);
  };

  const handleDrop = (track: 'green' | 'brown') => {
    if (!draggedItem) return;
    if (track === 'green' && draggedItem.type === 'dataset') {
      setStagedDataset(draggedItem.item);
    } else if (track === 'brown' && draggedItem.type === 'model') {
      setStagedModel(draggedItem.item);
    }
    setIsOverGreenfield(false);
    setIsOverBrownfield(false);
    setDraggedItem(null);
  };

  const canSelectArchitecture = stagedDataset !== null && stagedModel !== null;

  const performTraining = () => {
    if (!stagedDataset || !stagedModel || !selectedAction) return;
    
    setIsTraining(true);
    setIsComplete(false);
    setTrainingPhase(0);

    const interval = setInterval(() => {
      setTrainingPhase(prev => {
        if (prev >= trainingPhases.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTraining(false);
            setIsComplete(true);
          }, 1200);
          return prev;
        }
        return prev + 1;
      });
    }, 1800); // Slower for demo pacing
  };

  const resetForge = () => {
    setStagedDataset(null);
    setStagedModel(null);
    setSelectedAction(null);
    setIsComplete(false);
    setTrainingPhase(0);
  };

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden relative p-8 gap-8">
      {/* Left Panel: Assets */}
      <div className="w-80 flex flex-col gap-8 shrink-0">
        <section className="flex-1 flex flex-col min-h-0 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Datasets (Staging)</h3>
          <div className="space-y-3 overflow-y-auto pr-1">
            {datasets.map(ds => (
              <div 
                key={ds.id} draggable onDragStart={(e) => handleDragStart(e, ds, 'dataset')}
                className={`p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing ${
                    stagedDataset?.id === ds.id ? 'bg-purple-100 border-purple-400 shadow-md' : 'bg-slate-50 border-slate-100 hover:border-purple-300 hover:shadow-sm'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{ds.dataset_name}</div>
                <div className="text-[9px] text-slate-400 uppercase font-black">{ds.record_count} Records</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 flex flex-col min-h-0 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Model Registry</h3>
          <div className="space-y-3 overflow-y-auto pr-1">
            {models.slice(0, 8).map(m => (
              <div 
                key={m.id} draggable onDragStart={(e) => handleDragStart(e, m, 'model')}
                className={`p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing ${
                    stagedModel?.id === m.id ? 'bg-purple-100 border-purple-400 shadow-md' : 'bg-slate-50 border-slate-100 hover:border-purple-300 hover:shadow-sm'
                }`}
              >
                <div className="text-xs font-bold text-purple-900">{m.name}</div>
                <div className="text-[9px] text-purple-400 uppercase font-black">Acc: {(m.accuracy*100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Main Forge */}
      <div className="flex-1 flex flex-col gap-8">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Training Forge</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Evolve Enterprise Models with Agentic Flow</p>
          </div>
          {(stagedDataset || stagedModel) && !isTraining && (
              <button onClick={resetForge} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline transition-all">
                  Reset Staging
              </button>
          )}
        </header>

        <div className="flex-1 grid grid-cols-2 gap-8 relative">
          {/* Dataset Zone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsOverGreenfield(true); }}
            onDragLeave={() => setIsOverGreenfield(false)}
            onDrop={() => handleDrop('green')}
            className={`rounded-[48px] border-4 border-dashed flex flex-col items-center justify-center p-12 transition-all relative overflow-hidden ${
              stagedDataset ? 'bg-purple-50 border-purple-500 border-solid shadow-xl' :
              isOverGreenfield ? 'bg-purple-500 border-purple-300 scale-[1.02] text-white' : 'bg-white border-slate-200 text-slate-300'
            }`}
          >
            {stagedDataset ? (
                <div className="text-center animate-in zoom-in duration-500">
                    <div className="text-5xl mb-4">💿</div>
                    <h4 className="text-lg font-black text-purple-900 uppercase tracking-wider">Source Locked</h4>
                    <p className="text-[10px] font-bold text-purple-500 mt-2">{stagedDataset.dataset_name}</p>
                    <div className="mt-4 px-3 py-1 bg-purple-200 text-purple-700 rounded-full text-[8px] font-black uppercase tracking-widest">Snowflake Gold</div>
                </div>
            ) : (
                <>
                    <div className="text-6xl mb-4 opacity-40">🌱</div>
                    <h4 className="text-xl font-black uppercase tracking-widest">Drop Dataset</h4>
                    <p className="text-[9px] font-bold mt-2 text-center uppercase tracking-tighter opacity-60 max-w-[150px]">Choose a clean data shard from staging</p>
                </>
            )}
          </div>

          {/* Model Zone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsOverBrownfield(true); }}
            onDragLeave={() => setIsOverBrownfield(false)}
            onDrop={() => handleDrop('brown')}
            className={`rounded-[48px] border-4 border-dashed flex flex-col items-center justify-center p-12 transition-all relative overflow-hidden ${
              stagedModel ? 'bg-purple-900 border-purple-500 border-solid text-white shadow-xl' :
              isOverBrownfield ? 'bg-purple-800 border-purple-400 scale-[1.02] text-white' : 'bg-white border-slate-200 text-slate-300'
            }`}
          >
            {stagedModel ? (
                <div className="text-center animate-in zoom-in duration-500">
                    <div className="text-5xl mb-4">🧠</div>
                    <h4 className="text-lg font-black text-white uppercase tracking-wider">Model Locked</h4>
                    <p className="text-[10px] font-bold text-purple-300 mt-2">{stagedModel.name}</p>
                    <div className="mt-4 px-3 py-1 bg-purple-600 text-purple-100 rounded-full text-[8px] font-black uppercase tracking-widest">v{stagedModel.model_version} Pro</div>
                </div>
            ) : (
                <>
                    <div className="text-6xl mb-4 opacity-40">⚒️</div>
                    <h4 className="text-xl font-black uppercase tracking-widest">Drop Model</h4>
                    <p className="text-[9px] font-bold mt-2 text-center uppercase tracking-tighter opacity-60 max-w-[150px]">Select any production model from registry</p>
                </>
            )}
          </div>

          {/* Training Overlay */}
          {isTraining && (
            <div className="absolute inset-0 bg-slate-900/98 rounded-[48px] flex flex-col items-center justify-center z-50 text-white animate-in fade-in duration-500">
              <div className="mb-12 relative">
                <div className="w-24 h-24 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-xl animate-pulse">✨</div>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-[0.3em] mb-4">Evolution Active</h3>
              <div className="w-96 space-y-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-purple-400">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></span>
                        <span>Phase: {trainingPhases[trainingPhase].label}</span>
                    </div>
                    <span>{Math.round(((trainingPhase + 1) / trainingPhases.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${((trainingPhase + 1) / trainingPhases.length) * 100}%` }}></div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-xs text-white font-bold tracking-tight">
                        {trainingPhases[trainingPhase].detail}
                    </p>
                    <p className="text-[9px] text-slate-500 uppercase font-black italic">Aura is optimizing feature weights for Supply Chain domain...</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Summary Artifact */}
          {isComplete && (
            <div className="absolute inset-0 bg-purple-600 rounded-[48px] flex flex-col items-center justify-center z-50 text-white animate-in zoom-in duration-700 shadow-2xl">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[32px] flex items-center justify-center text-5xl mb-8 shadow-2xl border border-white/20">🏆</div>
              <h3 className="text-4xl font-black tracking-tight mb-2 uppercase">Evolution Success</h3>
              <p className="text-purple-100 font-bold uppercase text-[10px] tracking-widest mb-10 opacity-80">Deployment Artifact: aura-v2.9.2-deployable</p>
              
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20 group hover:bg-white/20 transition-all">
                    <div className="text-[9px] font-black uppercase mb-1 opacity-60 tracking-widest">Accuracy Delta</div>
                    <div className="text-3xl font-black text-emerald-300 leading-none">+{((Math.random() * 3) + 2).toFixed(1)}%</div>
                    <div className="text-[8px] mt-2 opacity-50 font-bold">New Baseline: 94.2%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20 group hover:bg-white/20 transition-all">
                    <div className="text-[9px] font-black uppercase mb-1 opacity-60 tracking-widest">Latency Gain</div>
                    <div className="text-3xl font-black text-emerald-300 leading-none">-15ms</div>
                    <div className="text-[8px] mt-2 opacity-50 font-bold">Inference Speed Optimized</div>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                  <button onClick={resetForge} className="px-10 py-4 bg-white text-purple-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                      Finalize & Approve
                  </button>
                  <button onClick={() => setIsComplete(false)} className="px-8 py-4 border border-white/30 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                      Inspect Artifact
                  </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <section className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden transition-all duration-500 shadow-2xl border border-slate-800">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="flex-1 w-full">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-[11px] font-black uppercase tracking-widest transition-colors ${canSelectArchitecture ? 'text-purple-400' : 'text-slate-600'}`}>
                        Step 2: Evolution Strategy
                    </h3>
                    {!canSelectArchitecture && (
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-pulse"></span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Waiting for Stage Handshake</span>
                        </div>
                    )}
                 </div>
                 <div className={`flex flex-wrap gap-2.5 transition-all duration-700 ${canSelectArchitecture ? 'opacity-100' : 'opacity-20 blur-[2px] pointer-events-none'}`}>
                   {TRAINING_ACTIONS.map(a => (
                     <button 
                        key={a} onClick={() => setSelectedAction(a)}
                        className={`px-5 py-2.5 border rounded-2xl text-[10px] font-black uppercase transition-all transform active:scale-95 ${
                            selectedAction === a 
                                ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/40 ring-2 ring-purple-500/20' 
                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-purple-500 hover:text-slate-300'
                        }`}
                        disabled={isTraining || isComplete}
                     >
                        {a}
                     </button>
                   ))}
                 </div>
             </div>
             <div className="shrink-0">
                 <button 
                    onClick={performTraining}
                    disabled={!selectedAction || isTraining || isComplete}
                    className={`px-12 py-5 font-black rounded-[28px] text-[11px] uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center gap-4 ${
                        selectedAction && !isTraining 
                        ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-2xl shadow-purple-500/40' 
                        : 'bg-slate-800 text-slate-600 border border-slate-700'
                    }`}
                 >
                    {isTraining ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Synthesizing...</span>
                        </>
                    ) : 'Begin Retraining'}
                    {selectedAction && !isTraining && <span className="text-xl">✨</span>}
                 </button>
             </div>
           </div>
           
           {!canSelectArchitecture && !isComplete && (
               <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
                   <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                       <span className={stagedDataset ? 'text-emerald-500' : ''}>[ DATASET: {stagedDataset ? 'LOCKED' : 'STAGING'} ]</span>
                       <span className={stagedModel ? 'text-emerald-500' : ''}>[ MODEL: {stagedModel ? 'LOCKED' : 'STAGING'} ]</span>
                   </div>
               </div>
           )}
        </section>
      </div>
    </div>
  );
};

export default TrainingHubView;
