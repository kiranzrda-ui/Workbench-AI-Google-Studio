
import React, { useState } from 'react';
import { MLModel, DataConnector, DataSet } from '../types';

interface DataManagementViewProps {
  models: MLModel[];
  connectors: DataConnector[];
}

const MOCK_COLUMNS = [
  { name: 'CUSTOMER_ID', type: 'VARCHAR(64)', nulls: '0%', unique: '100%', pii: false, description: 'Unique global enterprise customer identifier' },
  { name: 'REVENUE_MTD', type: 'DECIMAL(18,2)', nulls: '4.2%', unique: '88%', pii: false, description: 'Month-to-date revenue at point-of-sale' },
  { name: 'EMAIL_ADDR', type: 'VARCHAR(256)', nulls: '0.1%', unique: '99%', pii: true, description: 'Customer primary contact email (Encrypted at rest)' },
  { name: 'LAST_LOGIN_TS', type: 'TIMESTAMP_NTZ', nulls: '12%', unique: '75%', pii: false, description: 'Last authentication timestamp in UTC' },
  { name: 'GEO_REGION', type: 'VARCHAR(5)', nulls: '0%', unique: '5%', pii: false, description: 'ISO standard regional identifier code' },
  { name: 'SSN_LAST_4', type: 'VARCHAR(4)', nulls: '0%', unique: '15%', pii: true, description: 'Government identification fragment (Restricted Access)' },
];

const DataManagementView: React.FC<DataManagementViewProps> = ({ models, connectors }) => {
  const [selectedSchema, setSelectedSchema] = useState<DataSet | null>(null);
  const dataAssets = models.map(m => m.data_catalog).slice(0, 15);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-8 relative">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Data Catalog</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Global Connectors • Snowflake & Alteryx Handshake</p>
        </div>
        <button className="px-6 py-2 bg-slate-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">Add Source</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Master Data Inventory</h3>
              <div className="flex gap-2">
                <span className="text-[10px] font-black text-slate-400 border border-slate-200 px-3 py-1 rounded-full bg-white">Global Sync: 100%</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {dataAssets.map((asset, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:bg-white group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                      {asset.source_platform === 'Snowflake' ? '❄️' : asset.source_platform === 'Alteryx' ? '🪄' : '☁️'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <p className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors cursor-help" title={`Data hosted in enterprise zone: ${asset.source_platform === 'Snowflake' ? 'AWS-US-EAST-1' : 'Azure-Central-1'}`}>{asset.dataset_name}</p>
                         <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                           asset.source_platform === 'Snowflake' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                         }`}>{asset.source_platform}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-1">{asset.format} • {asset.record_count} Records • {asset.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {asset.phi_data && (
                      <div className="group/phi relative">
                        <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-full border border-rose-100 uppercase tracking-widest cursor-help">PHI Protected</span>
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 text-white p-3 rounded-xl text-[10px] opacity-0 group-hover/phi:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                          <p className="font-bold text-rose-400 mb-1">GOVERNANCE ALERT</p>
                          This asset contains Protected Health Information. Access is logged to Corporate Compliance Ledger.
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={() => setSelectedSchema(asset)}
                      className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-100 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      Query Schema
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Active Connectors</h3>
            <div className="space-y-4">
              {connectors.map(c => (
                <div key={c.id} className="p-5 bg-slate-50 border border-slate-100 rounded-[32px] flex flex-col gap-4 group/conn transition-all hover:bg-white hover:shadow-xl">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <span className="text-2xl group-hover/conn:scale-110 transition-transform">{c.name === 'Snowflake' ? '❄️' : c.name === 'Alteryx' ? '🪄' : '📦'}</span>
                         <span className="text-sm font-black text-slate-800">{c.name} Cloud Svc</span>
                      </div>
                      <div className="group/health relative cursor-help">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${c.status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600'}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Connected' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                           {c.status}
                        </div>
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-slate-200 p-3 rounded-xl text-[10px] opacity-0 group-hover/health:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl text-slate-600">
                          <p className="font-black text-slate-900 uppercase mb-1">Handshake Status</p>
                          Latency: {c.latency_ms}ms<br/>
                          Region: us-east-1<br/>
                          Last Pulse: {c.last_sync}
                        </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      {Object.entries(c.config).map(([key, val]) => (
                        <div key={key} className="bg-white p-3 rounded-2xl border border-slate-100">
                           <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{key}</div>
                           <div className="text-[10px] font-mono text-slate-700 truncate font-bold">{val}</div>
                        </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🚀</div>
            <h3 className="font-black text-indigo-400 uppercase tracking-widest text-[10px] mb-4">Ingestion Bandwidth</h3>
            <div className="text-4xl font-black mb-6">8.4 GB/s</div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[85%] rounded-full animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cluster Throughput • Optimal</p>
          </section>
        </div>
      </div>

      {/* SCHEMA EXPLORER MODAL */}
      {selectedSchema && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[80vh]">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-4xl text-white shadow-xl shadow-indigo-600/20">
                       {selectedSchema.source_platform === 'Snowflake' ? '❄️' : '🪄'}
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedSchema.dataset_name}</h3>
                       <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Schema Explorer • {selectedSchema.source_platform} Live Integration</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedSchema(null)} className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                 <div className="grid grid-cols-4 gap-6 mb-12">
                    <SchemaStat label="Columns" value="24" tooltip="Total identified fields in original source" />
                    <SchemaStat label="Primary Key" value="CUSTOMER_ID" tooltip="Enterprise Unique Constraint Verified" />
                    <SchemaStat label="Null Profile" value="Good" color="text-emerald-500" tooltip="No missing values in critical feature set" />
                    <SchemaStat label="Scan Result" value="Verified" color="text-indigo-600" tooltip="MD5 Hash verified against Snowflake master" />
                 </div>

                 <div className="bg-slate-50 rounded-[32px] border border-slate-200 overflow-hidden shadow-inner">
                    <table className="w-full text-left border-collapse">
                       <thead className="bg-white border-b border-slate-200">
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <th className="px-8 py-5">Column Identifier</th>
                             <th className="px-8 py-5">Type / Definition</th>
                             <th className="px-8 py-5">Integrity Metrics</th>
                             <th className="px-8 py-5">Governance Flag</th>
                             <th className="px-8 py-5 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                          {MOCK_COLUMNS.map(col => (
                            <tr key={col.name} className="hover:bg-indigo-50/30 transition-colors group/row">
                               <td className="px-8 py-5">
                                  <div className="font-mono text-[11px] font-bold text-slate-900">{col.name}</div>
                                  <div className="text-[9px] text-slate-400 mt-1 font-bold">{col.description}</div>
                               </td>
                               <td className="px-8 py-5 text-indigo-600 font-bold font-mono text-xs">{col.type}</td>
                               <td className="px-8 py-5">
                                  <div className="flex flex-col gap-1">
                                     <div className="flex justify-between text-[9px] uppercase font-bold text-slate-400">
                                        <span>Nulls: {col.nulls}</span>
                                        <span>Uniq: {col.unique}</span>
                                     </div>
                                     <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: col.unique }}></div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-5">
                                  {col.pii ? (
                                    <span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-md text-[9px] font-black uppercase border border-rose-200 cursor-help" title="Sensitive data detected. Redaction mandatory.">PII Detected</span>
                                  ) : (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md text-[9px] font-black uppercase">Standard</span>
                                  )}
                               </td>
                               <td className="px-8 py-5 text-right opacity-0 group-hover/row:opacity-100 transition-opacity">
                                  <button className="text-[10px] font-black text-indigo-600 hover:underline">View Samples</button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="p-10 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center">
                 <p className="text-xs text-slate-500 font-bold max-w-lg leading-relaxed uppercase tracking-tighter italic">
                   "Aura automated scanners have indexed this schema. Sensitivity flags were determined using enterprise-standard BERT-based NER models."
                 </p>
                 <div className="flex gap-4">
                    <button className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl text-[10px] uppercase shadow-sm active:scale-95 transition-all">Export Dictionary</button>
                    <button className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Initialize Pipeline</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const SchemaStat = ({ label, value, color = "text-slate-900", tooltip }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-help transition-all hover:shadow-md" title={tooltip}>
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <p className={`text-xl font-black ${color}`}>{value}</p>
  </div>
);

export default DataManagementView;
