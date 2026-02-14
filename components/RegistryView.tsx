
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
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Model Registry</h2>
          <p className="text-sm text-slate-500 uppercase tracking-widest font-medium">Enterprise Catalog • {models.length} Indexed Assets</p>
        </div>
        
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Search registry..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 text-slate-800"
          />
          <select 
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none"
          >
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
              <th className="px-6 py-4">Asset ID</th>
              <th className="px-6 py-4">Model Name</th>
              <th className="px-6 py-4">Domain</th>
              <th className="px-6 py-4">Accuracy</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredModels.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">{m.id}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{m.name}</div>
                  <div className="text-[10px] text-slate-400">v{m.model_version}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100">{m.domain}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono font-bold text-slate-700">{(m.accuracy * 100).toFixed(1)}%</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setSelectedModel(m); setActiveTab('Overview'); }}
                    className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Detail Modal */}
      {selectedModel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedModel.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{selectedModel.id} • {selectedModel.model_owner_team}</p>
              </div>
              <button onClick={() => setSelectedModel(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex border-b border-slate-100">
              {(['Overview', 'Lineage', 'Params'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                    activeTab === tab ? 'border-purple-500 text-purple-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-8 overflow-y-auto max-h-[60vh]">
              {activeTab === 'Overview' && (
                <div className="space-y-8 animate-in fade-in">
                  <div className="grid grid-cols-4 gap-4">
                    <MetricBox label="Stage" value={selectedModel.model_stage} />
                    <MetricBox label="Accuracy" value={`${(selectedModel.accuracy * 100).toFixed(1)}%`} />
                    <MetricBox label="Latency" value={`${selectedModel.latency}ms`} />
                    <MetricBox label="Health" value={selectedModel.monitoring_status} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Model Performance</h4>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                        <DetailRow label="Throughput" value={`${selectedModel.throughput} req/min`} />
                        <DetailRow label="Error Rate" value={`${(selectedModel.error_rate * 100).toFixed(2)}%`} />
                        <DetailRow label="Data Drift" value={`${(selectedModel.data_drift * 100).toFixed(1)}%`} />
                        <DetailRow label="CPU / Mem" value={`${selectedModel.cpu_util}% / ${selectedModel.mem_util}%`} />
                        <DetailRow label="Monthly Usage" value={`${selectedModel.usage.toLocaleString()} reqs`} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Data & Governance</h4>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                        <DetailRow label="Training Dataset" value={selectedModel.data_catalog.dataset_name} />
                        <DetailRow label="Records" value={selectedModel.data_catalog.record_count} />
                        <DetailRow label="Sensitive (PHI)" value={selectedModel.data_catalog.phi_data ? 'Yes (Strict)' : 'No'} />
                        <DetailRow label="SLA Tier" value={selectedModel.sla_tier} />
                        <DetailRow label="Inference ID" value={selectedModel.inference_endpoint_id} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Usage & Impact</h4>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm grid grid-cols-2 gap-8">
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Revenue Impact:</span>
                          <span className="text-sm font-bold text-emerald-600">${(selectedModel.revenue_impact / 1000).toFixed(0)}k/year</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">User Growth:</span>
                          <span className="text-sm font-bold text-purple-600">+{selectedModel.user_growth}%</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Lineage' && (
                <div className="animate-in slide-in-from-bottom-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Asset Lineage (Source to Production)</h4>
                  <div className="flex flex-col gap-10 relative">
                    {selectedModel.lineage.map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-6 relative group">
                        {idx < selectedModel.lineage.length - 1 && (
                          <div className="absolute left-6 top-10 bottom-[-40px] w-0.5 bg-slate-200"></div>
                        )}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-all ${
                          step.type === 'Source' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          step.type === 'Transform' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                          step.type === 'Storage' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-purple-50 border-purple-200 text-purple-600'
                        }`}>
                          {step.type === 'Source' ? '☁️' : step.type === 'Transform' ? '⚙️' : step.type === 'Storage' ? '💾' : '💎'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{step.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-1">{step.type} • {step.status}</p>
                          <p className="text-xs text-slate-500 mt-1 italic">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Params' && (
                <div className="animate-in fade-in">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Tuning Parameters ({selectedModel.type})</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedModel.hyperparameters).map(([key, val]) => (
                      <div key={key} className="p-4 bg-white border border-slate-100 rounded-xl flex justify-between items-center shadow-sm">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{key.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{String(val)}</span>
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

const MetricBox = ({ label, value }: any) => (
  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-base font-bold text-slate-800">{value}</p>
  </div>
);

const DetailRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
    <span className="text-xs text-slate-500">{label}:</span>
    <span className="text-xs font-bold text-slate-800">{value}</span>
  </div>
);

export default RegistryView;
