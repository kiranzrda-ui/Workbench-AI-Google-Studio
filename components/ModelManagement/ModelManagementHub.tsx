
import React, { useState, useEffect } from 'react';
import VisualMLEngine from './VisualMLEngine';
import ResultsVisualizer from './ResultsVisualizer';
import ModelDiagnostics from './ModelDiagnostics';
import XAITools from './XAITools';
import { MLModel, DataSet } from '../../types';

interface ModelManagementHubProps {
  models: MLModel[];
  datasets: DataSet[];
  initialTab?: 'Engine' | 'Visualizer' | 'Diagnostics' | 'XAI';
}

const ModelManagementHub: React.FC<ModelManagementHubProps> = ({ models, datasets, initialTab = 'Engine' }) => {
  const [activeTab, setActiveTab] = useState<'Engine' | 'Visualizer' | 'Diagnostics' | 'XAI'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden font-inter h-full">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase truncate">Workbench Hub</h2>
          <p className="text-slate-400 font-bold uppercase text-[8px] tracking-[0.3em] mt-1 truncate">Experiment Orchestration Layer</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner shrink-0">
           {[
             { id: 'Engine', label: 'Engine', icon: '⚡' },
             { id: 'Visualizer', label: 'Results', icon: '📊' },
             { id: 'Diagnostics', label: 'Diagnostics', icon: '🔬' },
             { id: 'XAI', label: 'XAI', icon: '👁️' }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                 activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               <span>{tab.icon}</span>
               <span className="hidden sm:inline">{tab.label}</span>
             </button>
           ))}
        </div>
      </header>

      <div className="flex-1 overflow-hidden min-h-0 relative">
        {activeTab === 'Engine' && <VisualMLEngine models={models} datasets={datasets} />}
        {activeTab === 'Visualizer' && <ResultsVisualizer models={models} />}
        {activeTab === 'Diagnostics' && <ModelDiagnostics models={models} />}
        {activeTab === 'XAI' && <XAITools models={models} />}
      </div>
    </div>
  );
};

export default ModelManagementHub;
