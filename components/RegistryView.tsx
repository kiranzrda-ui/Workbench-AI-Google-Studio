
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
  const [showAudit, setShowAudit] = useState<MLModel | null>(null);

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
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 space-y-6 md:space-y-10 relative font-inter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Model Registry</h2>
          <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] mt-3">Enterprise Asset Catalog • {models.length} Indexed Models</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-2 md:py-3 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 w-full sm:w-64 md:w-80 shadow-sm transition-all outline-none"
          />
          <select 
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-2 md:py-3 text-xs font-black text-slate-900 outline-none shadow-sm cursor-pointer"
          >
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[24px] md:rounded-[40px] overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] border-b border-slate-100">
              <th className="px-6 md:px-8 py-4 md:py-6">Fingerprint</th>
              <th className="px-6 md:px-8 py-4 md:py-6">Identity</th>
              <th className="px-6 md:px-8 py-4 md:py-6">Domain</th>
              <th className="px-6 md:px-8 py-4 md:py-6">Confidence</th>
              <th className="px-6 md:px-8 py-4 md:py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredModels.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 transition-all duration-200 group relative">
                <td className="px-6 md:px-8 py-4 md:py-6 font-mono text-[11px] font-bold text-slate-400">{m.id}</td>
                <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-sm md:text-base tracking-tight">{m.name}</div>
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-1">v{m.model_version} • {m.model_stage}</div>
                </td>
                <td className="px-6 md:px-8 py-4 md:py-6">
                  <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase px-2 md:px-3 py-1 rounded-full bg-slate-100 border border-slate-200">{m.domain}</span>
                </td>
                <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="font-mono font-black text-slate-900 text-base md:text-lg">{(m.accuracy * 100).toFixed(1)}%</div>
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200 shadow-inner">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${m.accuracy * 100}%` }}></div>
                    </div>
                </td>
                <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                  <button 
                    onClick={() => { setSelectedModel(m); setActiveTab('Overview'); }}
                    className="text-[9px] md:text-[10px] font-black bg-indigo-600 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedModel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-200/50">
            <div className="p-6 md:p-10 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-slate-900 flex items-center justify-center text-2xl md:text-3xl text-white shadow-xl transform rotate-3 uppercase font-black">{selectedModel.name[0]}</div>
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight truncate max-w-xs md:max-w-none uppercase">{selectedModel.name}</h3>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 md:mt-2">{selectedModel.id} • {selectedModel.model_owner_team}</p>
                </div>
              </div>
              <button onClick={() => setSelectedModel(null)} className="w-10 h-10 md:w-12 md:h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm group">
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex border-b border-slate-100 shrink-0 bg-white">
              {(['Overview', 'Lineage', 'Params'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-4 md:px-10 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all ${
                    activeTab === tab ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-10 overflow-y-auto flex-1 bg-white scroll-smooth items-start">
              {activeTab === 'Overview' && (
                <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500 py-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <MetricBox label="Stage" value={selectedModel.model_stage} />
                    <MetricBox label="Accuracy" value={`${(selectedModel.accuracy * 100).toFixed(1)}%`} />
                    <MetricBox label="Latency" value={`${selectedModel.latency}ms`} />
                    <MetricBox label="Status" value={selectedModel.monitoring_status} color={selectedModel.monitoring_status === 'Healthy' ? 'text-emerald-500' : 'text-rose-500'} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 md:mb-6">Performance Matrix</h4>
                      <div className="bg-slate-50/50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 space-y-4 shadow-inner">
                        <DetailRow label="Throughput" value={`${selectedModel.throughput} r/m`} />
                        <DetailRow label="Error Rate" value={`${(selectedModel.error_rate * 100).toFixed(2)}%`} />
                        <DetailRow label="Signal Drift" value={`${(selectedModel.data_drift * 100).toFixed(1)}%`} />
                        <DetailRow label="Utilization" value={`${selectedModel.cpu_util}% CPU`} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 md:mb-6">Governance</h4>
                      <div className="bg-slate-50/50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 space-y-4 shadow-inner">
                        <DetailRow label="Source" value={selectedModel.data_catalog.dataset_name} />
                        <DetailRow label="Sensitivity" value={selectedModel.data_catalog.phi_data ? 'RESTRICTED' : 'General'} />
                        <DetailRow label="SLA" value={selectedModel.sla_tier} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-[24px] md:rounded-[32px] p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all"></div>
                     <div className="z-10 text-center md:text-left">
                        <p className="text-[9px] md:text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Annual Revenue Impact</p>
                        <h4 className="text-2xl md:text-5xl font-black text-white tracking-tight">${(selectedModel.revenue_impact / 1000).toFixed(0)}k <span className="text-emerald-400 text-sm md:text-lg ml-2">+12.4%</span></h4>
                     </div>
                     <button 
                      onClick={() => setShowAudit(selectedModel)}
                      className="z-10 w-full md:w-auto px-10 py-4 bg-white text-slate-900 font-black rounded-xl md:rounded-2xl text-[10px] uppercase shadow-lg active:scale-95 transition-all hover:bg-slate-50"
                     >
                      View Full Audit Report
                     </button>
                  </div>
                </div>
              )}

              {activeTab === 'Lineage' && (
                <div className="animate-in slide-in-from-bottom-6 duration-500 py-8">
                  <div className="flex flex-col gap-8 md:gap-12 relative max-w-2xl mx-auto">
                    {selectedModel.lineage.map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-6 md:gap-10 relative group">
                        {idx < selectedModel.lineage.length - 1 && (
                          <div className="absolute left-[23px] md:left-[31px] top-16 md:top-20 bottom-[-36px] md:bottom-[-48px] w-1 bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>
                        )}
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[16px] md:rounded-[24px] flex items-center justify-center shrink-0 shadow-lg border-2 transition-all group-hover:scale-110 ${
                          step.type === 'Source' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          step.type === 'Transform' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                          step.type === 'Storage' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-900 border-slate-700 text-white'
                        }`}>
                          {step.type === 'Source' ? '☁️' : step.type === 'Transform' ? '⚙️' : step.type === 'Storage' ? '💾' : '💎'}
                        </div>
                        <div className="flex-1 bg-slate-50/50 p-5 md:p-6 rounded-[20px] md:rounded-[32px] border border-slate-100 shadow-sm group-hover:bg-white transition-all group-hover:shadow-md">
                          <p className="text-sm md:text-base font-black text-slate-900 mb-1">{step.name}</p>
                          <p className="text-[8px] md:text-[9px] text-slate-400 uppercase font-black tracking-widest">{step.type} • {step.status}</p>
                          <p className="text-[10px] md:text-xs text-slate-500 mt-2 font-medium italic">"{step.details}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Params' && (
                <div className="animate-in fade-in duration-500 py-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                    {Object.entries(selectedModel.hyperparameters).map(([key, val]) => (
                      <div key={key} className="p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] flex flex-col gap-2 shadow-sm hover:shadow-md transition-all">
                        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm md:text-base font-mono font-black text-indigo-700 bg-white border border-indigo-100 px-4 py-2 rounded-xl shadow-inner w-fit">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAudit && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-lg animate-in fade-in">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 border border-white/10">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black uppercase text-slate-900">Security & Compliance Audit</h3>
              <button onClick={() => setShowAudit(null)} className="text-slate-400 hover:text-slate-900 transition-all text-2xl">×</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <AuditField label="Integrity Signature" value="0x7f2a...b1e9" status="Verified" />
                <AuditField label="Bias Check (Gender/Age)" value="Delta < 0.02" status="Passed" />
                <AuditField label="Egress Filter" value="Domain-Isolated" status="Active" />
                <AuditField label="Last Retrain Signature" value="Companion-Core-v3" status="Signed" />
              </div>
              <div className="p-6 bg-slate-900 rounded-3xl text-white">
                <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Final Conclusion</p>
                <p className="text-xs leading-relaxed italic opacity-80">"Asset v{showAudit.model_version} maintains a zero-drift profile over the last trailing 24 hours. No manual intervention required."</p>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowAudit(null)} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95">Download PDF Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AuditField = ({ label, value, status }: { label: string; value: string; status: string }) => (
  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xs font-bold text-slate-800">{value}</p>
    </div>
    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase">{status}</span>
  </div>
);

const MetricBox = ({ label, value, color = "text-slate-900" }: any) => (
  <div className="bg-slate-50 border border-slate-100 p-5 md:p-6 rounded-[20px] md:rounded-[32px] hover:shadow-lg transition-all hover:-translate-y-1">
    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">{label}</p>
    <p className={`text-sm md:text-xl font-black ${color} tracking-tight`}>{value}</p>
  </div>
);

const DetailRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center border-b border-slate-200/50 pb-2 md:pb-3 last:border-0 last:pb-0">
    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    <span className="text-[10px] md:text-[11px] font-bold text-slate-900 bg-white px-2 md:px-3 py-1 rounded-lg md:rounded-xl shadow-sm truncate max-w-[120px] md:max-w-none">{value}</span>
  </div>
);

export default RegistryView;
