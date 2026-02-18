
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, CartesianGrid, ZAxis, ReferenceLine } from 'recharts';
import { MOCK_DATASETS } from '../../constants';
import { DataSet } from '../../types';

const VisualExplorerView: React.FC = () => {
  const [selectedDs, setSelectedDs] = useState<DataSet>(MOCK_DATASETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [activeColIndex, setActiveColIndex] = useState(2); 
  const [activeTab, setActiveTab] = useState<'Distribution' | 'Correlation' | 'Drift Analysis'>('Distribution');

  const handleSelect = (ds: DataSet) => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => {
      setSelectedDs(ds);
      setActiveColIndex(ds.columns?.length ? ds.columns.length - 1 : 0);
      setIsScanning(false);
    }, 1000);
  };

  const currentColumn = useMemo(() => selectedDs.columns?.[activeColIndex] || { name: 'VAL', skew: 0, mean: 0, pii: false }, [selectedDs, activeColIndex]);

  const distData = useMemo(() => {
    const skew = currentColumn.skew;
    return Array.from({ length: 15 }).map((_, i) => ({
      bucket: `${i * 10}-${(i + 1) * 10}`,
      count: Math.floor(Math.exp(-Math.pow(i - (6 + skew * 2), 2) / (10 - Math.abs(skew))) * 1000)
    }));
  }, [currentColumn]);

  const scatterData = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 800,
      isAnomalous: Math.random() > 0.95
    }));
  }, [selectedDs]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 space-y-6 flex flex-col font-inter">
      <header className="flex justify-between items-start shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Visual Explorer</h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2">Enterprise Statistical Profiling Platform</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm gap-1">
             {MOCK_DATASETS.slice(0, 3).map(ds => (
               <button 
                 key={ds.id}
                 onClick={() => handleSelect(ds)}
                 className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${selectedDs.id === ds.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {ds.domain} Set
               </button>
             ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Health Index:</span>
            <div className="flex gap-0.5">
               {Array.from({length: 10}).map((_, i) => <div key={i} className={`h-2 w-1.5 rounded-full ${i < 9 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>)}
            </div>
            <span className="text-[10px] font-black text-emerald-600">9.2</span>
          </div>
        </div>
      </header>

      {/* Main Analysis Engine */}
      <div className="flex-1 flex gap-6 min-h-0">
         {/* Sidebar: Feature List & Core Metrics */}
         <aside className="w-80 flex flex-col gap-6 shrink-0">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
               <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Schema Vector</h3>
                  <div className="space-y-2">
                     {selectedDs.columns?.map((c, idx) => (
                       <button 
                         key={c.name}
                         onClick={() => setActiveColIndex(idx)}
                         className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${activeColIndex === idx ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl translate-x-1' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200'}`}
                       >
                         <div className="min-w-0">
                            <div className="text-[10px] font-black uppercase tracking-tight truncate">{c.name}</div>
                            <div className={`text-[8px] font-bold uppercase ${activeColIndex === idx ? 'text-indigo-200' : 'text-slate-400'}`}>{c.type}</div>
                         </div>
                         {c.pii && <div className={`w-1.5 h-1.5 rounded-full ${activeColIndex === idx ? 'bg-indigo-300' : 'bg-rose-400 animate-pulse'}`}></div>}
                       </button>
                     ))}
                  </div>
               </div>
               
               <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Moment Estimates</h3>
                  <div className="grid grid-cols-2 gap-3">
                     <MomentCard label="Skewness" value={currentColumn.skew.toFixed(3)} />
                     <MomentCard label="Kurtosis" value="3.120" />
                     <MomentCard label="Variance" value="1.04k" />
                     <MomentCard label="P-Value" value="0.045" color="text-emerald-500" />
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group hover:shadow-indigo-500/20 transition-all cursor-help">
               <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl grayscale transition-transform group-hover:scale-110">🛰️</div>
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Companion Auditor</h4>
               <p className="text-[11px] text-slate-400 leading-relaxed font-medium uppercase tracking-tighter">
                  "{selectedDs.dataset_name}" feature distribution for <span className="text-white font-black underline">{currentColumn.name}</span> suggests a {currentColumn.skew > 0 ? 'positive' : 'negative'} tail deviation. Recommend log-normalization."
               </p>
            </div>
         </aside>

         {/* Main Viewport: Charts */}
         <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {/* View Selectors */}
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit shrink-0">
               {(['Distribution', 'Correlation', 'Drift Analysis'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${activeTab === tab ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    {tab}
                  </button>
               ))}
            </div>

            <div className="flex-1 bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm relative overflow-hidden flex flex-col">
               {isScanning && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-40 flex flex-col items-center justify-center animate-in fade-in">
                     <div className="w-14 h-14 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                     <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] animate-pulse">Scanning Data Manifold...</h4>
                  </div>
               )}

               <div className="flex justify-between items-start mb-10">
                  <div>
                     <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">{activeTab} Profiling</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Active Field: {currentColumn.name} • Scale: Linear</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Global P95: {Math.floor(Math.random() * 90) + 10}</div>
                  </div>
               </div>

               <div className="flex-1 min-h-0">
                  {activeTab === 'Distribution' ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="bucket" tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                           <YAxis hide />
                           <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} contentStyle={{ border: 'none', borderRadius: '16px', fontSize: '10px', fontWeight: 900, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                           <Bar dataKey="count" radius={[12, 12, 0, 0]} animationDuration={800}>
                              {distData.map((_, i) => (
                                <Cell key={i} fill={i > 6 && i < 11 ? '#6366f1' : '#e2e8f0'} />
                              ))}
                           </Bar>
                           <ReferenceLine x={distData[Math.floor(distData.length/2)].bucket} stroke="#6366f1" strokeDasharray="3 3" label={{ position: 'top', value: 'Mean', fill: '#6366f1', fontSize: 10, fontWeight: 900 }} />
                        </BarChart>
                     </ResponsiveContainer>
                  ) : activeTab === 'Correlation' ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis type="number" dataKey="x" hide />
                           <YAxis type="number" dataKey="y" hide />
                           <ZAxis type="number" dataKey="z" range={[80, 500]} />
                           <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                           <Scatter name="Vectors" data={scatterData}>
                              {scatterData.map((entry, i) => (
                                <Cell 
                                  key={i} 
                                  fill={entry.isAnomalous ? '#f43f5e' : (i % 2 === 0 ? '#8b5cf6' : '#6366f1')} 
                                  opacity={entry.isAnomalous ? 1 : 0.4} 
                                  className="hover:scale-150 transition-all cursor-crosshair"
                                />
                              ))}
                           </Scatter>
                        </ScatterChart>
                     </ResponsiveContainer>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4 border-4 border-slate-100 animate-pulse">📉</div>
                        <h4 className="text-lg font-black text-slate-800 uppercase mb-2 tracking-tight">Temporal Drift Map</h4>
                        <p className="text-slate-400 text-xs font-medium max-w-sm">Comparing training baseline against current {selectedDs.source_platform} production stream. Zero critical drift detected over 30d window.</p>
                        <button className="mt-8 px-8 py-3 bg-indigo-50 text-indigo-600 font-black rounded-xl text-[10px] uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all">Verify Baseline Schema</button>
                     </div>
                  )}
               </div>

               <div className="grid grid-cols-4 gap-6 pt-10 border-t border-slate-50 mt-auto shrink-0">
                  <StatInfo label="Total Samples" value={selectedDs.record_count} />
                  <StatInfo label="Unique Dim" value="2.4k" />
                  <StatInfo label="Entropy Score" value="0.884" color="text-indigo-600" />
                  <StatInfo label="Data Quality" value="A+" color="text-emerald-500" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const MomentCard = ({ label, value, color = "text-slate-900" }: any) => (
  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
     <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">{label}</div>
     <div className={`text-xs font-mono font-black ${color}`}>{value}</div>
  </div>
);

const StatInfo = ({ label, value, color = "text-slate-900" }: any) => (
  <div className="text-center">
     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
     <div className={`text-xl font-black ${color} tracking-tight`}>{value}</div>
  </div>
);

export default VisualExplorerView;
