
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_DATASETS } from '../../constants';
import { DataSet } from '../../types';

const SpecialisedPrepView: React.FC = () => {
  const [sourceA, setSourceA] = useState<DataSet>(MOCK_DATASETS[0]);
  const [sourceB, setSourceB] = useState<DataSet>(MOCK_DATASETS[1]); 
  const [masking, setMasking] = useState(true);
  const [isFusing, setIsFusing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fusionArtifact, setFusionArtifact] = useState<null | { id: string; timestamp: string; rows: number; columns: number }>(null);

  // Logical Closure: Filter Source B to match Domain of Source A
  const availableB = useMemo(() => MOCK_DATASETS.filter(ds => ds.domain === sourceA.domain && ds.id !== sourceA.id), [sourceA]);

  useEffect(() => {
    if (sourceB.domain !== sourceA.domain || sourceB.id === sourceA.id) {
        if (availableB.length > 0) setSourceB(availableB[0]);
    }
  }, [sourceA, availableB, sourceB]);

  const startFusion = () => {
    if (isFusing) return;
    setFusionArtifact(null);
    setIsFusing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { 
          clearInterval(interval); 
          setIsFusing(false); 
          setFusionArtifact({
            id: `ART-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            rows: Math.min(parseInt(sourceA.record_count), parseInt(sourceB?.record_count || '0')),
            columns: (sourceA.columns?.length || 0) + (sourceB?.columns?.length || 0) - 1 // -1 for join key
          });
          return 100; 
        }
        return p + 10;
      });
    }, 150);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 flex flex-col gap-6 font-inter">
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Specialised Prep</h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2">Domain-Isolated Multi-Source Fusion</p>
        </div>
        <div className="flex gap-3">
          {fusionArtifact && (
             <button 
               onClick={() => setFusionArtifact(null)}
               className="px-6 py-3.5 bg-white border border-slate-200 text-slate-500 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
             >
               Clear Artifact
             </button>
          )}
          <button 
            onClick={startFusion}
            disabled={isFusing || !sourceB}
            className={`px-8 py-3.5 bg-indigo-600 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-30 active:scale-95 flex items-center gap-2`}
          >
            {isFusing ? <span className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : '⚙️'}
            {isFusing ? `EXECUTING (${progress}%)` : 'INITIALIZE FUSION'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
         <div className="lg:col-span-3 space-y-6 flex flex-col">
            {fusionArtifact ? (
               <section className="bg-emerald-900/5 border border-emerald-500/20 rounded-3xl p-10 flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl text-emerald-600 grayscale select-none">🏆</div>
                  <div className="w-20 h-20 rounded-[32px] bg-emerald-500 flex items-center justify-center text-3xl shadow-2xl shadow-emerald-500/30 mb-8 animate-bounce">
                    ✅
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Fusion Cycle Complete</h3>
                  <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 text-sm">
                    Cross-source schema validation successful. High-fidelity feature set sharded and indexed for downstream model consumption.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-8 w-full max-w-2xl bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                    <ArtifactStat label="Artifact ID" value={fusionArtifact.id} />
                    <ArtifactStat label="Total Rows" value={fusionArtifact.rows.toLocaleString()} />
                    <ArtifactStat label="Feature Vector" value={`${fusionArtifact.columns} Dim`} />
                  </div>

                  <div className="mt-12 flex gap-4">
                     <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95">
                        Push to Production
                     </button>
                     <button className="px-10 py-5 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all">
                        Inspect Raw Sample
                     </button>
                  </div>
               </section>
            ) : (
               <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden flex-1">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl grayscale select-none">⋈</div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                    Cross-Table Schema Recon
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center h-full">
                     <SourceMiniCard label="Source A (Primary)" dataset={sourceA} dsList={MOCK_DATASETS} current={sourceA} setDs={setSourceA} />
                     
                     <div className="flex flex-col items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transition-all duration-700 ${isFusing ? 'bg-indigo-600 text-white animate-bounce' : 'bg-slate-900 text-white rotate-45 hover:rotate-0'}`}>⋈</div>
                        <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">JOIN_IDENTITY_HASH</span>
                     </div>

                     {availableB.length > 0 ? (
                       <SourceMiniCard label={`Source B (${sourceA.domain} Enrichment)`} dataset={sourceB} dsList={availableB} current={sourceB} setDs={setSourceB} />
                     ) : (
                       <div className="h-40 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-center p-6 bg-slate-50/50">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">No secondary {sourceA.domain} sets available.</p>
                       </div>
                     )}
                  </div>
               </section>
            )}

            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Governance Primitives</h3>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border transition-all ${masking ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {masking ? 'PII ENCRYPTION: ACTIVE' : 'EXPOSED DATAFRAME'}
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PrepToggle active={masking} onClick={() => setMasking(!masking)} title="Auto-Anonymization" desc="HMAC-SHA256 salt & hash applied to sensitive vectors." />
                  <PrepToggle active={true} onClick={() => {}} title="Isolation Enforcement" desc="Ensures cross-cloud residency compliance automatically." disabled />
               </div>
            </section>
         </div>

         {/* Side Preview Sidebar */}
         <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col overflow-hidden border border-white/5">
            <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4 flex justify-between items-center">
               <span>Egress Preview</span>
               <span className="text-[7px] text-white/40">v{sourceA.record_count.slice(0,2)}.0.4</span>
            </h3>
            <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
               {(sourceA.columns || []).map(col => (
                 <div key={col.name} className={`bg-white/5 border rounded-xl p-4 transition-all duration-500 hover:bg-white/10 ${col.pii && masking ? 'border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]' : 'border-white/5'}`}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-black text-white/50 uppercase tracking-tighter truncate max-w-[100px]">{col.name}</span>
                       {col.pii && (
                         <div className={`w-1.5 h-1.5 rounded-full ${masking ? 'bg-amber-500 animate-pulse' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                       )}
                    </div>
                    <div className={`text-[10px] font-mono transition-all duration-700 flex items-center gap-2 ${masking && col.pii ? 'blur-[5px] opacity-30' : 'opacity-100'}`}>
                       <span className="text-indigo-400 font-black">#</span>
                       {masking && col.pii ? 'SENSITIVE_VECTOR' : `VAL_${col.name.slice(0,4)}`}
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 shrink-0">
               <button className="w-full py-4 bg-white text-slate-900 font-black rounded-xl text-[9px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all hover:bg-indigo-50">EXPORT ARTIFACT</button>
            </div>
         </div>
      </div>
    </div>
  );
};

const ArtifactStat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-sm font-mono font-black text-slate-900">{value}</div>
  </div>
);

const SourceMiniCard = ({ label, dataset, dsList, current, setDs }: any) => (
  <div className="space-y-3 flex flex-col h-full">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{label}</label>
    <div className="relative group">
       <select 
         value={current.id} 
         onChange={(e) => setDs(dsList.find((x:any) => x.id === e.target.value))}
         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black text-slate-900 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer appearance-none"
       >
         {dsList.map((ds: any) => <option key={ds.id} value={ds.id}>{ds.dataset_name}</option>)}
       </select>
       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
    </div>
    <div className="mt-auto p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
       <div className="text-[7px] font-black text-slate-500 uppercase">Records: <span className="text-slate-900">{dataset.record_count}</span></div>
       <div className="w-10 h-1 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.5)]"></div>
    </div>
  </div>
);

const PrepToggle = ({ active, onClick, title, desc, disabled }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`p-5 rounded-2xl border text-left transition-all border-l-4 group ${disabled ? 'opacity-30 grayscale cursor-not-allowed border-slate-100' : (active ? 'bg-indigo-50 border-indigo-100 border-l-indigo-600 scale-[1.02] shadow-md' : 'bg-white border-slate-100 border-l-slate-200 hover:border-slate-300 hover:shadow-sm')}`}
  >
     <div className="flex justify-between items-center w-full mb-2">
        <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{title}</span>
        <div className={`w-8 h-4 rounded-full relative transition-all ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
           <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${active ? 'right-0.5' : 'left-0.5'}`}></div>
        </div>
     </div>
     <p className="text-[9px] text-slate-400 font-bold leading-relaxed">{desc}</p>
  </button>
);

export default SpecialisedPrepView;
