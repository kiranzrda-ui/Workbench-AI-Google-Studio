
import React, { useState } from 'react';
import { MLModel } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

interface ResultsVisualizerProps {
  models: MLModel[];
}

const ResultsVisualizer: React.FC<ResultsVisualizerProps> = ({ models }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleModel = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id].slice(-3));
  };

  const selectedModels = models.filter(m => selectedIds.includes(m.id));

  const compareData = selectedModels.map(m => ({
    name: m.name.substring(0, 8) + '..',
    accuracy: m.accuracy * 100,
  }));

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 p-4 sm:p-6 overflow-hidden min-h-0">
      <aside className="w-full md:w-64 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col shadow-sm shrink-0 min-h-0">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 shrink-0">Experiment History</h3>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
           {models.slice(0, 40).map(m => (
             <button 
               key={m.id} 
               onClick={() => toggleModel(m.id)}
               className={`w-full text-left p-3 rounded-xl border-2 transition-all group ${
                 selectedIds.includes(m.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-transparent hover:border-slate-200 text-slate-600'
               }`}
             >
                <div className="text-[10px] font-black truncate uppercase tracking-tight">{m.name}</div>
                <div className={`text-[7px] font-bold uppercase ${selectedIds.includes(m.id) ? 'text-indigo-200' : 'text-slate-400'}`}>v{m.model_version} • {m.domain}</div>
             </button>
           ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto pr-1 custom-scrollbar">
        {selectedModels.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-12">
             <div className="text-5xl mb-4 grayscale">📊</div>
             <h3 className="text-base font-black text-slate-900 uppercase">Benchmarking Panel</h3>
             <p className="text-[10px] font-bold text-slate-500 max-w-[200px] mt-1 uppercase tracking-tight leading-relaxed">Select experiments from the history to generate comparison matrix.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
               {selectedModels.map(m => (
                 <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-start mb-4">
                       <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-slate-900 uppercase leading-none truncate">{m.name}</h4>
                          <span className="text-[7px] font-black text-slate-400 uppercase mt-1 block">ID: {m.id.substring(0,8)}</span>
                       </div>
                       <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black uppercase text-xs shrink-0">{m.name[0]}</div>
                    </div>
                    <div className="space-y-2">
                       <ResultLine label="Accuracy" value={`${(m.accuracy * 100).toFixed(1)}%`} />
                       <ResultLine label="Latency" value={`${m.latency}ms`} trendNeg />
                       <ResultLine label="Coverage" value="94.2%" />
                    </div>
                 </div>
               ))}
            </div>

            <div className="flex-1 min-h-[250px] bg-white rounded-3xl border border-slate-200 p-6 shadow-lg flex flex-col">
               <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Cross-Experiment Accuracy Delta</h3>
               <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={compareData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                           contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', fontSize: '9px', fontWeight: 900 }}
                           cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                        />
                        <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} animationDuration={800} barSize={40}>
                           {compareData.map((entry, index) => (
                             <Cell key={index} fill={['#4f46e5', '#8b5cf6', '#a855f7'][index % 3]} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const ResultLine = ({ label, value, trendNeg }: any) => (
  <div className="flex justify-between items-center border-b border-slate-50 pb-1.5 last:border-0">
     <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
     <span className="text-[10px] font-black text-slate-900 uppercase">{value}</span>
  </div>
);

export default ResultsVisualizer;
