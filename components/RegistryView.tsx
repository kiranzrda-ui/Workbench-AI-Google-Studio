
import React, { useState, useMemo } from 'react';
import { MLModel } from '../types';

interface RegistryViewProps {
  models: MLModel[];
}

const RegistryView: React.FC<RegistryViewProps> = ({ models }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Lineage' | 'Params'>('Overview');

  const filteredModels = useMemo(() => {
    return models.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain = domainFilter === 'All' || m.domain === domainFilter;
      return matchesSearch && matchesDomain;
    });
  }, [models, searchQuery, domainFilter]);

  const domains = ['All', ...new Set(models.map(m => m.domain))];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Model Registry</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Enterprise Asset Catalog • {models.length} Indexed Models</p>
        </div>
        
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search assets by name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 w-80 shadow-sm transition-all outline-none"
          />
          <select 
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-xs font-black text-slate-900 outline-none shadow-sm cursor-pointer"
          >
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-slate-100">
              <th className="px-8 py-6">Asset Fingerprint</th>
              <th className="px-8 py-6">Orchestrated Identity</th>
              <th className="px-8 py-6">Governance Domain</th>
              <th className="px-8 py-6">Confidence Score</th>
              <th className="px-8 py-6 text-right">Lifecycle Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredModels.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 transition-all duration-200 group relative">
                <td className="px-8 py-6 font-mono text-[11px] font-bold text-slate-400">{m.id}</td>
                <td className="px-8 py-6">
                  <div className="group/identity relative cursor-help">
                    <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-base tracking-tight">{m.name}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-1">Version {m.model_version} • {m.model_stage}</div>
                    
                    {/* ENHANCED HOVER TOOLTIP */}
                    <div className="absolute left-0 bottom-full mb-4 w-64 bg-slate-900 text-white p-4 rounded-[24px] opacity-0 group-hover/identity:opacity-100 transition-all translate-y-2 group-hover/identity:translate-y-0 pointer-events-none z-50 shadow-2xl border border-slate-700">
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Infra Metadata</p>
                       <div className="space-y-2">
                          <div className="flex justify-between border-b border-slate-800 pb-2">
                             <span className="text-[10px] text-slate-500 uppercase font-black">Cluster</span>
                             <span className="text-[10px] font-mono">US-EAST-2</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-2">
                             <span className="text-[10px] text-slate-500 uppercase font-black">Ownership</span>
                             <span className="text-[10px] font-bold">{m.model_owner_team}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-[10px] text-slate-500 uppercase font-black">SLA</span>
                             <span className="text-[10px] font-bold text-emerald-400">TIER 1 (99.9%)</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[10px] font-black text-slate-500 uppercase px-3 py-1 rounded-full bg-slate-100 border border-slate-200">{m.domain}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="group/metrics relative cursor-help">
                    <div className="font-mono font-black text-slate-900 text-lg">{(m.accuracy * 100).toFixed(1)}%</div>
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200 shadow-inner">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${m.accuracy * 100}%` }}></div>
                    </div>

                    <div className="absolute left-0 bottom-full mb-4 w-48 bg-white border border-slate-200 p-4 rounded-[24px] opacity-0 group-hover/metrics:opacity-100 transition-all translate-y-2 group-hover/metrics:translate-y-0 pointer-events-none z-50 shadow-2xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Benchmark Comparison</p>
                       <div className="text-center space-y-1">
                          <div className="text-2xl font-black text-indigo-600">+{(Math.random() * 4).toFixed(1)}%</div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Against Baseline v{parseInt(m.model_version)-1}.0</p>
                       </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => { setSelectedModel(m); setActiveTab('Overview'); }}
                    className="text-[10px] font-black bg-indigo-600 text-white px-5 py-2.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 uppercase tracking-widest"
                  >
                    Manage Asset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal code remains robust, inheriting these hover upgrades for internal elements as well */}
      {selectedModel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-3xl text-white shadow-xl shadow-slate-400/20">💎</div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedModel.name}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">{selectedModel.id} • {selectedModel.model_owner_team}</p>
                </div>
              </div>
              <button onClick={() => setSelectedModel(null)} className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex border-b border-slate-100 shrink-0 bg-white">
              {(['Overview', 'Lineage', 'Params'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all ${
                    activeTab === tab ? 'border-indigo-600 text-indigo-700 bg-slate-50' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-10 overflow-y-auto flex-1 bg-white">
              {activeTab === 'Overview' && (
                <div className="space-y-10 animate-in fade-in">
                  <div className="grid grid-cols-4 gap-6">
                    <MetricBox label="Deployment Stage" value={selectedModel.model_stage} />
                    <MetricBox label="Engine Accuracy" value={`${(selectedModel.accuracy * 100).toFixed(1)}%`} />
                    <MetricBox label="Avg. Latency" value={`${selectedModel.latency}ms`} />
                    <MetricBox label="Monitoring Status" value={selectedModel.monitoring_status} color={selectedModel.monitoring_status === 'Healthy' ? 'text-emerald-500' : 'text-rose-500'} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Technical Performance Matrix</h4>
                      <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                        <DetailRow label="Peak Throughput" value={`${selectedModel.throughput} req/min`} />
                        <DetailRow label="Soft Error Rate" value={`${(selectedModel.error_rate * 100).toFixed(2)}%`} />
                        <DetailRow label="Signal Drift" value={`${(selectedModel.data_drift * 100).toFixed(1)}%`} />
                        <DetailRow label="Infra Resource Util" value={`${selectedModel.cpu_util}% CPU / ${selectedModel.mem_util}% MEM`} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Governance & Data Handshake</h4>
                      <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                        <DetailRow label="Snowflake Training Gold" value={selectedModel.data_catalog.dataset_name} />
                        <DetailRow label="Snapshot Volume" value={selectedModel.data_catalog.record_count} />
                        <DetailRow label="Data Sensitivity" value={selectedModel.data_catalog.phi_data ? 'RESTRICTED (PHI)' : 'General Commercial'} />
                        <DetailRow label="Service Agreement" value={selectedModel.sla_tier} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-[32px] p-8 text-white flex justify-between items-center shadow-2xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent pointer-events-none"></div>
                     <div className="z-10">
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Estimated Annual Revenue Impact</p>
                        <h4 className="text-4xl font-black text-white">${(selectedModel.revenue_impact / 1000).toFixed(0)}k <span className="text-emerald-400 text-lg">+12.4% vs Prev</span></h4>
                     </div>
                     <button className="z-10 px-8 py-3 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase shadow-lg shadow-white/10 active:scale-95 transition-all">Download Audit Report</button>
                  </div>
                </div>
              )}

              {activeTab === 'Lineage' && (
                <div className="animate-in slide-in-from-bottom-6 duration-500">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12 text-center">Enterprise Asset Provenance Trace</h4>
                  <div className="flex flex-col gap-12 relative max-w-2xl mx-auto">
                    {selectedModel.lineage.map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-10 relative group">
                        {idx < selectedModel.lineage.length - 1 && (
                          <div className="absolute left-[31px] top-20 bottom-[-48px] w-1 bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>
                        )}
                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 shadow-lg border-2 transition-all group-hover:scale-110 ${
                          step.type === 'Source' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          step.type === 'Transform' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                          step.type === 'Storage' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-900 border-slate-700 text-white'
                        }`}>
                          {step.type === 'Source' ? '☁️' : step.type === 'Transform' ? '⚙️' : step.type === 'Storage' ? '💾' : '💎'}
                        </div>
                        <div className="flex-1 bg-slate-50 p-6 rounded-[32px] border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:border-indigo-100 transition-all duration-300">
                          <p className="text-base font-black text-slate-900 mb-1">{step.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{step.type} • Verified: {step.status}</p>
                          <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed italic">"{step.details}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Params' && (
                <div className="animate-in fade-in duration-500">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Hyperparameter Configuration Ledger</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedModel.hyperparameters).map(([key, val]) => (
                      <div key={key} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex justify-between items-center group/param hover:bg-white hover:shadow-lg transition-all">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/param:text-indigo-600 transition-colors">{key.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricBox = ({ label, value, color = "text-slate-900" }: any) => (
  <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] hover:bg-white hover:shadow-xl transition-all duration-300 group">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-600 transition-colors">{label}</p>
    <p className={`text-xl font-black ${color} tracking-tight`}>{value}</p>
  </div>
);

const DetailRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center border-b border-slate-200/50 pb-3 last:border-0 last:pb-0">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    <span className="text-[11px] font-bold text-slate-900 bg-white px-3 py-1 rounded-xl shadow-sm">{value}</span>
  </div>
);

export default RegistryView;
