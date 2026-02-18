
import React, { useState, useMemo } from 'react';
import { DATA_RECIPES } from '../constants';
import { DataRecipe } from '../types';

const DataRecipesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Blueprints' | 'My Recipes'>('All');
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const [previewRecipe, setPreviewRecipe] = useState<DataRecipe | null>(null);

  const filtered = useMemo(() => {
    if (activeTab === 'Blueprints') return DATA_RECIPES.filter(r => r.is_blueprint);
    return DATA_RECIPES;
  }, [activeTab]);

  const handleRequest = (id: string) => {
    setRequestedId(id);
    setTimeout(() => setRequestedId(null), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 flex flex-col gap-6 font-inter">
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Data Recipes</h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2">Enterprise Project Blueprints & Pipeline Logic</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm gap-1">
           {(['All', 'Blueprints', 'My Recipes'] as const).map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
         {filtered.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-[32px] border border-slate-200 p-8 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
               {recipe.is_blueprint && (
                 <div className="absolute top-0 left-0 bg-indigo-600 text-white px-4 py-1.5 rounded-br-2xl text-[8px] font-black uppercase tracking-widest z-10 shadow-lg">
                    Blueprint Artifact
                 </div>
               )}
               
               <div className="mt-4 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                     <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase border ${
                        recipe.complexity === 'High' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                        recipe.complexity === 'Medium' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                     }`}>
                        {recipe.complexity} Complexity
                     </span>
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{recipe.domain}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-3 group-hover:text-indigo-600 transition-colors">{recipe.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-8">"{recipe.description}"</p>
               </div>

               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                     <div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Avg Sync Time</div>
                        <div className="text-xs font-mono font-black text-slate-900">{recipe.execution_time}</div>
                     </div>
                     <div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Architect</div>
                        <div className="text-xs font-black text-slate-900 uppercase">@{recipe.owner}</div>
                     </div>
                  </div>

                  {requestedId === recipe.id ? (
                     <div className="w-full py-4 bg-emerald-50 border border-emerald-100 text-emerald-600 font-black rounded-2xl text-[9px] uppercase tracking-widest text-center animate-in zoom-in-95">
                        Handshake Requested
                     </div>
                  ) : (
                     <div className="flex gap-2">
                        <button 
                          onClick={() => setPreviewRecipe(recipe)}
                          className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[9px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-95"
                        >
                          Preview Logic
                        </button>
                        <button 
                           onClick={() => handleRequest(recipe.id)}
                           className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all hover:bg-indigo-700"
                        >
                           Request Access
                        </button>
                     </div>
                  )}
               </div>
            </div>
         ))}
      </div>

      {/* Logic Preview Modal */}
      {previewRecipe && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
           <div className="bg-slate-950 rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 border border-white/10">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-xl text-white font-black">📜</div>
                    <div>
                      <h3 className="text-white font-black uppercase">{previewRecipe.name}</h3>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Procedural YAML Definition</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewRecipe(null)} className="text-slate-400 hover:text-white transition-all text-2xl">×</button>
              </div>
              <div className="p-8 overflow-y-auto max-h-[400px]">
                 <pre className="text-emerald-400 font-mono text-[10px] leading-relaxed p-6 bg-black rounded-2xl border border-white/5">
{`version: "2.1"
domain: ${previewRecipe.domain.toUpperCase()}
recipe_id: ${previewRecipe.id}

steps:
  - id: ingest
    source: core_backbone
    method: streaming
    
  - id: normalize
    type: domain_logic
    rules:
      - handle_nulls: mode_imputation
      - outlier_detection: z_score_threshold_3
      
  - id: encode
    method: semantic_embedding
    model: aura-text-v4
    
output:
  sink: validation_cluster
  encryption: SHA256_ACTIVE`}
                 </pre>
              </div>
              <div className="p-8 border-t border-white/5 flex justify-end gap-3 bg-white/5">
                <button onClick={() => setPreviewRecipe(null)} className="px-8 py-3 bg-white/5 text-slate-400 font-black text-[10px] uppercase rounded-xl hover:text-white transition-all">Close</button>
                <button className="px-8 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all">Download Definition</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DataRecipesView;
