
import React, { useState, useEffect } from 'react';
import { DataSet, MLModel, TrainingAction, ApprovalRequest } from '../types';

interface TrainingHubViewProps {
  datasets: DataSet[];
  models: MLModel[];
  onApprove?: (id: string) => void;
  approvalQueue?: ApprovalRequest[];
}

const TRAINING_ACTIONS: TrainingAction[] = [
  'Reinforcement Learning',
  'Fine-Tuning',
  'Weight Distillation',
  'Hyper-Parameter Optimization',
  'First-Light Training'
];

const TrainingHubView: React.FC<TrainingHubViewProps> = ({ datasets, models, onApprove, approvalQueue }) => {
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
    { label: "Neural Link", detail: "Initializing tensors..." },
    { label: "Data Ingest", detail: "Sharding data..." },
    { label: "Weights Load", detail: "Serializing..." },
    { label: "HP Tuning", detail: "Bayesian Search..." },
    { label: "Converging", detail: "Stabilizing..." },
    { label: "Validating", detail: "Cross-val..." },
    { label: "Sealing", detail: "Finalizing..." }
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
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const resetForge = () => {
    setStagedDataset(null);
    setStagedModel(null);
    setSelectedAction(null);
    setIsComplete(false);
    setTrainingPhase(0);
  };

  const handleFinalize = () => {
    if (stagedModel) {
      const pendingReq = approvalQueue?.find(r => r.modelId === stagedModel.id);
      if (pendingReq && onApprove) {
        onApprove(pendingReq.id);
      }
    }
    resetForge();
  };

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden relative p-3 md:p-4 gap-3 md:gap-4 max-h-screen">
      {/* Left Panel: Assets */}
      <div className="w-48 md:w-56 flex flex-col gap-3 shrink-0">
        <section className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 p-3 shadow-sm overflow-hidden">
          <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Datasets</h3>
          <div className="space-y-1.5 overflow-y-auto pr-1">
            {datasets.map(ds => (
              <div 
                key={ds.id} draggable onDragStart={(e) => handleDragStart(e, ds, 'dataset')}
                className={`p-1.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                    stagedDataset?.id === ds.id ? 'bg-purple-50 border-purple-400' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="text-[9px] font-bold text-slate-900 truncate">{ds.dataset_name}</div>
                <div className="text-[7px] text-slate-400 uppercase font-black">{ds.record_count} Records</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 p-3 shadow-sm overflow-hidden">
          <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Model Management</h3>
          <div className="space-y-1.5 overflow-y-auto pr-1">
            {models.slice(0, 10).map(m => (
              <div 
                key={m.id} draggable onDragStart={(e) => handleDragStart(e, m, 'model')}
                className={`p-1.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                    stagedModel?.id === m.id ? 'bg-purple-50 border-purple-400' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="text-[9px] font-bold text-purple-900 truncate">{m.name}</div>
                <div className="text-[7px] text-purple-400 uppercase font-black">Acc: {(m.accuracy*100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Main Forge */}
      <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0 h-full overflow-hidden">
        <header className="flex justify-between items-end shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">Model Optimizer</h2>
            <p className="text-slate-500 font-bold uppercase text-[7px] tracking-[0.2em] mt-1">Optimize Enterprise Models</p>
          </div>
          {(stagedDataset || stagedModel) && !isTraining && (
              <button onClick={resetForge} className="text-[7px] font-black text-rose-500 uppercase tracking-widest hover:underline">
                  Reset
              </button>
          )}
        </header>

        <div className="flex-1 grid grid-cols-2 gap-3 relative min-h-0">
          {/* Dataset Zone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsOverGreenfield(true); }}
            onDragLeave={() => setIsOverGreenfield(false)}
            onDrop={() => handleDrop('green')}
            className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 transition-all relative overflow-hidden ${
              stagedDataset ? 'bg-purple-50 border-purple-500 border-solid shadow-sm' :
              isOverGreenfield ? 'bg-purple-500 border-purple-300 text-white' : 'bg-white border-slate-200 text-slate-300'
            }`}
          >
            {stagedDataset ? (
                <div className="text-center animate-in zoom-in duration-300">
                    <div className="text-2xl mb-1">💿</div>
                    <h4 className="text-[8px] font-black text-purple-900 uppercase tracking-wider">Locked</h4>
                    <p className="text-[7px] font-bold text-purple-500 mt-0.5 truncate max-w-[100px] mx-auto">{stagedDataset.dataset_name}</p>
                </div>
            ) : (
                <>
                    <div className="text-2xl mb-1 opacity-20">🌱</div>
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-center">Drop Data</h4>
                </>
            )}
          </div>

          {/* Model Zone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsOverBrownfield(true); }}
            onDragLeave={() => setIsOverBrownfield(false)}
            onDrop={() => handleDrop('brown')}
            className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 transition-all relative overflow-hidden ${
              stagedModel ? 'bg-purple-900 border-purple-500 border-solid text-white shadow-sm' :
              isOverBrownfield ? 'bg-purple-800 border-purple-400 text-white' : 'bg-white border-slate-200 text-slate-300'
            }`}
          >
            {stagedModel ? (
                <div className="text-center animate-in zoom-in duration-300">
                    <div className="text-2xl mb-1">🧠</div>
                    <h4 className="text-[8px] font-black text-white uppercase tracking-wider">Locked</h4>
                    <p className="text-[7px] font-bold text-purple-300 mt-0.5 truncate max-w-[100px] mx-auto">{stagedModel.name}</p>
                </div>
            ) : (
                <>
                    <div className="text-2xl mb-1 opacity-20">⚒️</div>
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-center">Drop Model</h4>
                </>
            )}
          </div>

          {/* Training Overlay - COMPACTED & NO SCROLL */}
          {isTraining && (
            <div className="absolute inset-0 bg-slate-900/98 rounded-2xl flex flex-col items-center justify-center z-[60] text-white animate-in fade-in duration-200 p-4 border border-purple-500/30 overflow-hidden">
              <div className="mb-2 relative shrink-0">
                <div className="w-8 h-8 border-[3px] border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-lg">✨</div>
              </div>
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-2 text-center text-purple-400">Optimization Active</h3>
              <div className="w-full max-w-[180px] space-y-2">
                <div className="flex justify-between text-[6px] font-black uppercase tracking-widest text-purple-300">
                    <span>{trainingPhases[trainingPhase].label}</span>
                    <span>{Math.round(((trainingPhase + 1) / trainingPhases.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                    <div className="h-full bg-purple-500 transition-all duration-700 ease-out" style={{ width: `${((trainingPhase + 1) / trainingPhases.length) * 100}%` }}></div>
                </div>
                <p className="text-[8px] text-center text-slate-400 font-bold uppercase tracking-tighter line-clamp-1">
                    {trainingPhases[trainingPhase].detail}
                </p>
              </div>
            </div>
          )}

          {/* Success Summary Artifact - COMPACTED & NO SCROLL */}
          {isComplete && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl flex flex-col items-center justify-center z-[70] text-white animate-in zoom-in duration-300 p-4 border border-white/20 overflow-hidden">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-lg mb-2 shadow-xl border border-white/20 shrink-0">🏆</div>
              <h3 className="text-sm md:text-base font-black tracking-tight mb-1 uppercase text-center leading-none">Optimization Success</h3>
              <p className="text-purple-300 font-bold uppercase text-[5px] tracking-widest mb-3 opacity-80 text-center">Artifact: optimized-v2.9.2-deployable</p>
              
              <div className="grid grid-cols-2 gap-2 w-full max-w-[220px] mb-4">
                <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 text-center">
                    <div className="text-[5px] font-black uppercase mb-0.5 opacity-60">Accuracy Delta</div>
                    <div className="text-xs font-black text-emerald-300">+{((Math.random() * 2) + 1).toFixed(1)}%</div>
                </div>
                <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 text-center">
                    <div className="text-[5px] font-black uppercase mb-0.5 opacity-60">Latency Gain</div>
                    <div className="text-xs font-black text-emerald-300">-12ms</div>
                </div>
              </div>

              <div className="flex gap-2 w-full max-w-[220px] shrink-0">
                  <button onClick={handleFinalize} className="flex-1 py-1.5 bg-white text-purple-800 font-black rounded-md text-[7px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg">
                      Finalize
                  </button>
                  <button onClick={() => setIsComplete(false)} className="flex-1 py-1.5 border border-white/30 text-white font-black rounded-md text-[7px] uppercase tracking-widest hover:bg-white/10 transition-all">
                      Inspect
                  </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Section - COMPACTED */}
        <section className="bg-slate-900 rounded-xl p-3 md:p-4 text-white shrink-0 shadow-lg border border-slate-800">
           <div className="flex flex-col lg:flex-row justify-between items-center gap-3">
             <div className="flex-1 w-full">
                 <h3 className={`text-[7px] font-black uppercase tracking-widest mb-2 transition-colors ${canSelectArchitecture ? 'text-purple-400' : 'text-slate-600'}`}>
                    Optimization Strategy
                 </h3>
                 <div className={`flex flex-wrap gap-1 transition-all duration-500 ${canSelectArchitecture ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                   {TRAINING_ACTIONS.map(a => (
                     <button 
                        key={a} onClick={() => setSelectedAction(a)}
                        className={`px-2 py-1 border rounded-md text-[7px] md:text-[8px] font-black uppercase transition-all ${
                            selectedAction === a 
                                ? 'bg-purple-500 border-purple-400 text-white shadow-md' 
                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-purple-500'
                        }`}
                        disabled={isTraining || isComplete}
                     >
                        {a}
                     </button>
                   ))}
                 </div>
             </div>
             <div className="shrink-0 w-full lg:w-auto">
                 <button 
                    onClick={performTraining}
                    disabled={!selectedAction || isTraining || isComplete}
                    className={`w-full lg:w-auto px-4 py-2 font-black rounded-lg text-[8px] md:text-[9px] uppercase tracking-widest transition-all ${
                        selectedAction && !isTraining 
                        ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-xl' 
                        : 'bg-slate-800 text-slate-600 border border-slate-700'
                    }`}
                 >
                    {isTraining ? 'Optimizing...' : 'Begin Optimization'}
                 </button>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default TrainingHubView;
