
import React, { useState, useEffect } from 'react';
import { DataSet, AutoMLExperiment, MLModel, AutoMLPlatform } from '../types';
import { AUTOML_PLATFORMS } from '../constants';

interface AutoMLViewProps {
  datasets: DataSet[];
  experiments: AutoMLExperiment[];
  models: MLModel[];
}

const AutoMLView: React.FC<AutoMLViewProps> = ({ datasets, experiments, models }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<AutoMLPlatform>(AUTOML_PLATFORMS[0]);
  const [isOver, setIsOver] = useState(false);
  const [droppedDataset, setDroppedDataset] = useState<DataSet | null>(null);
  const [activeTab, setActiveTab] = useState<'Canvas' | 'Leaderboard' | 'Platforms'>('Canvas');
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const pipelineSteps = [
    'Handshaking with API Endpoints',
    'Automated Data Preprocessing',
    'Intelligent Feature Engineering',
    'Multi-Cloud Model Selection',
    'Hyperparameter Optimization',
    'Ensemble & Stacking'
  ];

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleRunAutoML = () => {
    if (!droppedDataset) return;
    setIsRunning(true);
    setPipelineStep(0);
    setLogs([]);
    
    addLog(`Initializing connection to ${selectedPlatform.name}...`);
    addLog(`Authorizing service account for ${droppedDataset.source_platform} access...`);

    const interval = setInterval(() => {
      setPipelineStep(prev => {
        if (prev >= pipelineSteps.length - 1) {
          clearInterval(interval);
          setIsRunning(false);
          addLog(`Orchestration Complete. View leaderboard.`);
          setActiveTab('Leaderboard');
          return prev;
        }
        addLog(`Executing: ${pipelineSteps[prev + 1]}...`);
        return prev + 1;
      });
    }, 2000);
  };

  const handleDragStart = (e: React.DragEvent, ds: DataSet) => {
    e.dataTransfer.setData('dataset_id', ds.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData('dataset_id');
    const ds = datasets.find(d => d.id === id);
    if (ds) {
      setDroppedDataset(ds);
      addLog(`Dataset ${ds.dataset_name} staged for orchestration.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">AutoML Orchestrator</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-Time Platform Control Plane</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
             <span className="text-[10px] font-bold text-slate-400 uppercase">Target Engine:</span>
             <select 
               className="bg-transparent text-sm font-bold text-indigo-600 outline-none cursor-pointer"
               value={selectedPlatform.id}
               onChange={(e) => {
                 const p = AUTOML_PLATFORMS.find(x => x.id === e.target.value);
                 if (p) setSelectedPlatform(p);
               }}
             >
               {AUTOML_PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl">
             {(['Canvas', 'Leaderboard', 'Platforms'] as const).map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {tab}
               </button>
             ))}
          </div>
        </div>
      </div>

      {activeTab === 'Canvas' && (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r border-slate-200 bg-white flex flex-col p-6 overflow-y-auto">
             <div className="mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Enterprise Data Lake</h3>
                <div className="space-y-3">
                   {datasets.map(ds => (
                     <div 
                       key={ds.id}
                       draggable
                       onDragStart={(e) => handleDragStart(e, ds)}
                       className="p-3 bg-slate-50 border border-slate-100 rounded-2xl cursor-grab hover:border-indigo-400 hover:bg-indigo-50 transition-all group shadow-sm active:cursor-grabbing"
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm border border-slate-100">
                             {ds.source_platform === 'Snowflake' ? '❄️' : '🪄'}
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{ds.dataset_name}</p>
                              <p className="text-[9px] text-slate-400 uppercase font-bold">{ds.source_platform}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="mt-auto bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-800">
                <h4 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">Execution Logs</h4>
                <div className="space-y-2 max-h-[150px] overflow-y-auto font-mono text-[8px]">
                   {logs.length > 0 ? logs.map((log, i) => (
                     <p key={i} className="text-slate-400 leading-tight border-l border-slate-800 pl-2">{log}</p>
                   )) : <p className="text-slate-600 italic text-[10px]">Staging complete. Waiting for ingest...</p>}
                </div>
             </div>
          </div>

          <div className="flex-1 p-10 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

             <div className="w-full max-w-2xl space-y-12 z-10">
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`aspect-video w-full border-4 border-dashed rounded-[48px] flex flex-col items-center justify-center transition-all duration-300 ${
                    isRunning ? 'border-indigo-500 bg-white shadow-2xl scale-[1.02]' : 
                    isOver ? 'border-indigo-400 bg-indigo-50 scale-[1.02]' :
                    (droppedDataset ? 'border-indigo-400 bg-indigo-50/20' : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300')
                  }`}
                >
                   {isRunning ? (
                     <div className="text-center space-y-6 px-12">
                        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{pipelineSteps[pipelineStep]}</h3>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-8">
                           <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${((pipelineStep + 1) / pipelineSteps.length) * 100}%` }}></div>
                        </div>
                     </div>
                   ) : (
                     <div className="text-center">
                        {!droppedDataset ? (
                          <div className="space-y-4">
                             <div className={`text-6xl mb-4 transition-transform ${isOver ? 'scale-125 rotate-6' : ''}`}>📥</div>
                             <p className={`text-xl font-bold ${isOver ? 'text-indigo-600' : 'text-slate-300'}`}>
                               {isOver ? 'Drop to Start Ingest' : 'Drop Dataset Here'}
                             </p>
                          </div>
                        ) : (
                          <div className="space-y-8 animate-in zoom-in-95">
                             <div className="flex items-center gap-8 bg-white p-8 rounded-[40px] shadow-2xl border border-indigo-100 relative overflow-hidden">
                                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-4xl text-white">
                                   {droppedDataset.source_platform === 'Snowflake' ? '❄️' : '🪄'}
                                </div>
                                <div className="text-left">
                                   <h4 className="text-2xl font-black text-slate-900">{droppedDataset.dataset_name}</h4>
                                   <p className="text-sm text-slate-500">Records: {droppedDataset.record_count} • Format: {droppedDataset.format}</p>
                                </div>
                                <button onClick={() => setDroppedDataset(null)} className="ml-8 text-slate-300 hover:text-rose-500">
                                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                             </div>
                             <button onClick={handleRunAutoML} className="px-12 py-5 bg-indigo-600 text-white font-black rounded-[28px] shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-4 mx-auto">
                               <span>⚡</span> Initialize Platform Sync
                             </button>
                          </div>
                        )}
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'Leaderboard' && (
         <div className="flex-1 p-12 overflow-y-auto bg-white">
            <div className="max-w-4xl mx-auto">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Experiment Leaderboard</h3>
               <div className="space-y-4">
                  {[
                    { model: 'XGBoost Ensemble', score: 0.942, latency: '12ms' },
                    { model: 'LightGBM Optim', score: 0.931, latency: '8ms' },
                    { model: 'Neural Regression', score: 0.928, latency: '24ms' }
                  ].map((res, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 flex items-center justify-between">
                       <div className="flex items-center gap-8">
                          <div className="text-3xl font-black text-indigo-600">#{i + 1}</div>
                          <div>
                             <h4 className="text-xl font-bold text-slate-900">{res.model}</h4>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Latency: {res.latency}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-3xl font-black text-slate-900">{(res.score * 100).toFixed(1)}%</div>
                          <button className="mt-2 text-[10px] font-bold text-indigo-600 uppercase">Deploy to Staging</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AutoMLView;
