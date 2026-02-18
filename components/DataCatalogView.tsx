
import React, { useState } from 'react';
import { MLModel, DataConnector, DataSet, FeatureStoreGroup } from '../types';
import { FEATURE_STORE_DATA } from '../constants';

interface DataCatalogViewProps {
  models: MLModel[];
  connectors: DataConnector[];
}

const MOCK_ROWS = [
  { id: '10293', val: 0.42, date: '2024-01-01', geo: 'US-EAST' },
  { id: '21049', val: -0.15, date: '2024-01-02', geo: 'EU-WEST' },
  { id: '99201', val: 0.28, date: '2024-01-03', geo: 'APAC' },
];

const DataCatalogView: React.FC<DataCatalogViewProps> = ({ models, connectors }) => {
  const [selectedSchema, setSelectedSchema] = useState<DataSet | null>(null);
  const [sampleData, setSampleData] = useState<DataSet | null>(null);
  const [activeTab, setActiveTab] = useState<'Datasets' | 'FeatureStore'>('Datasets');
  const [requestedId, setRequestedId] = useState<string | null>(null);
  
  const dataAssets = models.map(m => m.data_catalog).slice(0, 50);

  const handleRequest = (id: string) => {
    setRequestedId(id);
    setTimeout(() => setRequestedId(null), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-8 flex flex-col font-inter">
      <header className="flex justify-between items-start shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Enterprise Catalog</h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2">Authenticated Infrastructure Asset Ledger</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm gap-1">
           {(['Datasets', 'FeatureStore'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'FeatureStore' ? 'Feature Store' : 'Model Datasets'}
              </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
              <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em]">
                {activeTab === 'Datasets' ? 'Active Ingest Streams' : 'Curated Feature Registry'}
              </h3>
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Master Ledger Synced</span>
              </div>
            </div>
            
            <div className="divide-y divide-slate-50 overflow-y-auto custom-scrollbar flex-1">
              {activeTab === 'Datasets' ? (
                dataAssets.map((asset, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {asset.source_platform === 'Snowflake' ? '❄️' : asset.source_platform === 'Alteryx' ? '🪄' : '☁️'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                           <p className="text-[13px] font-black text-slate-800 truncate max-w-[200px]">{asset.dataset_name}</p>
                           <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter">{asset.source_platform}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{asset.record_count} Entries • {asset.size} • {asset.domain}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSampleData(asset)} className="text-[9px] font-black text-slate-500 bg-white px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm active:scale-95 transition-all uppercase">Sample</button>
                      <button 
                        onClick={() => setSelectedSchema(asset)}
                        className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-xl transition-all hover:bg-indigo-600 hover:text-white shadow-sm active:scale-95 border border-indigo-100/50 uppercase"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                FEATURE_STORE_DATA.map((fs, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${
                        fs.tier === 'Gold' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        fs.tier === 'Silver' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
                        'bg-orange-50 text-orange-600 border-orange-100'
                      } border`}>
                        {fs.tier[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                           <p className="text-[13px] font-black text-slate-800 truncate max-w-[250px]">{fs.name}</p>
                           <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter">Verified</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{fs.feature_count} Vectors • Latency: 4ms • {fs.domain}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="text-[8px] font-black text-slate-400 bg-white px-3 py-2 rounded-lg border border-slate-200 hover:text-slate-600 transition-all uppercase">Schema</button>
                       {requestedId === fs.id ? (
                         <button className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 animate-in zoom-in-95 uppercase">Pending Auth</button>
                       ) : (
                         <button 
                          onClick={() => handleRequest(fs.id)}
                          className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-xl transition-all hover:bg-emerald-600 hover:text-white shadow-sm active:scale-95 border border-emerald-100/50 uppercase"
                         >
                          Request Access
                         </button>
                       )}
                    </div>
                  </div>
                ))
              )}
            </div>
        </div>

        <div className="space-y-6 flex flex-col shrink-0">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col group">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-7xl rotate-12 transition-transform group-hover:scale-125">💾</div>
              <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 relative z-10">Global Footprint</h3>
              <div className="text-4xl font-black mb-6 relative z-10">2.4 <span className="text-xl text-indigo-300">PB</span></div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mb-6 overflow-hidden relative z-10">
                 <div className="bg-indigo-500 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              </div>
              <div className="flex justify-between items-center relative z-10">
                 <span className="text-[8px] text-slate-500 uppercase font-black">Multi-AZ Persistence</span>
                 <span className="text-[8px] text-emerald-400 font-black uppercase">Optimized</span>
              </div>
           </div>

           <div className="bg-white rounded-[32px] p-7 border border-slate-200 shadow-sm flex-1 flex flex-col">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Cloud Distribution</h3>
              <div className="space-y-6 overflow-y-auto pr-1">
                 {['Snowflake Core', 'Alteryx Sink', 'Azure S3 Cold', 'GCP Artifacts'].map((p, i) => (
                   <div key={p} className="space-y-2">
                      <div className="flex justify-between text-[8px] font-black uppercase text-slate-600 tracking-tighter">
                         <span>{p}</span>
                         <span>{Math.floor(Math.random() * 40 + 10)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                         <div className={`h-full ${['bg-blue-400', 'bg-purple-400', 'bg-indigo-400', 'bg-cyan-400'][i % 4]} rounded-full`} style={{ width: `${Math.floor(Math.random() * 40 + 10)}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="mt-auto w-full py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[9px] uppercase tracking-widest border border-slate-100 hover:text-slate-600 transition-all">Rebalance Clusters</button>
           </div>
        </div>
      </div>

      {/* Schema Modal */}
      {selectedSchema && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-white/20">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-2xl text-white shadow-xl uppercase font-black">
                       {selectedSchema.source_platform[0]}
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedSchema.dataset_name}</h3>
                       <p className="text-[9px] text-slate-400 font-black uppercase mt-2 tracking-[0.2em]">{selectedSchema.source_platform} Sync • Structural Map</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedSchema(null)} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 text-xl transition-all">×</button>
              </div>
              <div className="p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
                 <table className="w-full text-left font-inter">
                    <thead>
                       <tr className="text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="pb-3 px-2">Column_Label</th>
                          <th className="pb-3 px-2">Type</th>
                          <th className="pb-3 px-2">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {(selectedSchema.columns || []).map(c => (
                         <tr key={c.name} className="text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors group">
                            <td className="py-4 px-2">
                               <div className="font-mono text-[10px] text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{c.name}</div>
                            </td>
                            <td className="py-4 px-2 text-indigo-500 font-black font-mono text-[9px]">{c.type}</td>
                            <td className="py-4 px-2">
                               <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase border ${c.pii ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                  {c.pii ? 'ENCRYPTED' : 'INDEXED'}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* Sample Data Modal */}
      {sampleData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col animate-in zoom-in-95 border border-white/20">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-xl font-black text-slate-900 uppercase">Data Preview: {sampleData.dataset_name}</h3>
                 <button onClick={() => setSampleData(null)} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 text-xl transition-all">×</button>
              </div>
              <div className="p-8">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-x-auto shadow-inner">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead className="bg-white border-b border-slate-200">
                      <tr>
                        {Object.keys(MOCK_ROWS[0]).map(k => <th key={k} className="px-6 py-4 uppercase font-black text-slate-400">{k}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_ROWS.map((row, i) => (
                        <tr key={i} className="hover:bg-indigo-50/30">
                          {Object.values(row).map((v, idx) => <td key={idx} className="px-6 py-4 font-bold text-slate-700">{v}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setSampleData(null)} className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase text-slate-500 transition-all hover:bg-slate-100">Close</button>
                <button className="px-8 py-3 bg-indigo-600 rounded-xl font-black text-[10px] uppercase text-white shadow-lg shadow-indigo-100 active:scale-95 transition-all">Init Pipeline</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DataCatalogView;
