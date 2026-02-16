
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
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 space-y-6 md:space-y-8 relative">
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Enterprise Data Catalog</h2>
          <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em] mt-1">Global Connectors • Snowflake & Alteryx Handshake</p>
        </div>
        <button className="px-4 md:px-6 py-2 bg-slate-900 text-white font-black rounded-lg md:rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">Add Source</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Master Data Inventory</h3>
              <span className="text-[9px] md:text-[10px] font-black text-slate-400 border border-slate-200 px-3 py-1 rounded-full bg-white">Global Sync: 100%</span>
            </div>
            <div className="divide-y divide-slate-50">
              {dataAssets.map((asset, i) => (
                <div key={i} className="p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                  <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl md:text-2xl shrink-0">
                      {asset.source_platform === 'Snowflake' ? '❄️' : asset.source_platform === 'Alteryx' ? '🪄' : '☁️'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                         <p className="text-sm md:text-base font-black text-slate-800 truncate max-w-[150px] md:max-w-none">{asset.dataset_name}</p>
                         <span className={`text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                           asset.source_platform === 'Snowflake' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                         }`}>{asset.source_platform}</span>
                      </div>
                      <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-1">{asset.record_count} Records • {asset.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {asset.phi_data && (
                        <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-full border border-rose-100 uppercase tracking-widest">PHI Protected</span>
                    )}
                    <button 
                      onClick={() => setSelectedSchema(asset)}
                      className="text-[9px] md:text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-100 px-3 md:px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
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
          <section className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 md:mb-8">Active Connectors</h3>
            <div className="space-y-4">
              {connectors.map(c => (
                <div key={c.id} className="p-4 md:p-5 bg-slate-50 border border-slate-100 rounded-[20px] md:rounded-[32px] flex flex-col gap-3 md:gap-4 transition-all hover:bg-white hover:shadow-xl">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 md:gap-3">
                         <span className="text-xl md:text-2xl">{c.name === 'Snowflake' ? '❄️' : c.name === 'Alteryx' ? '🪄' : '📦'}</span>
                         <span className="text-xs md:text-sm font-black text-slate-800">{c.name} Cloud</span>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 md:py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase ${c.status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600'}`}>
                         <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${c.status === 'Connected' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                         {c.status}
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      {Object.entries(c.config).map(([key, val]) => (
                        <div key={key} className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl border border-slate-100">
                           <div className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-tighter">{key}</div>
                           <div className="text-[9px] md:text-[10px] font-mono text-slate-700 truncate font-bold">{val}</div>
                        </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 rounded-[24px] md:rounded-[40px] p-6 md:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
            <h3 className="font-black text-indigo-400 uppercase tracking-widest text-[9px] md:text-[10px] mb-4">Ingestion Bandwidth</h3>
            <div className="text-3xl md:text-4xl font-black mb-4 md:mb-6">8.4 GB/s</div>
            <div className="w-full bg-slate-800 h-2 md:h-2.5 rounded-full mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)]"></div>
            </div>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cluster Throughput</p>
          </section>
        </div>
      </div>

      {/* SCHEMA EXPLORER MODAL */}
      {selectedSchema && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              <div className="p-6 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                 <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-indigo-600 flex items-center justify-center text-3xl md:text-4xl text-white shadow-xl shadow-indigo-600/20">
                       {selectedSchema.source_platform === 'Snowflake' ? '❄️' : '🪄'}
                    </div>
                    <div>
                       <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight truncate max-w-xs md:max-w-none">{selectedSchema.dataset_name}</h3>
                       <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Schema Explorer • {selectedSchema.source_platform} Sync</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedSchema(null)} className="w-10 h-10 md:w-12 md:h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    <SchemaStat label="Columns" value="24" />
                    <SchemaStat label="Primary Key" value="CUSTOMER_ID" />
                    <SchemaStat label="Null Profile" value="Good" color="text-emerald-500" />
                    <SchemaStat label="Scan Result" value="Verified" color="text-indigo-600" />
                 </div>

                 <div className="bg-slate-50 rounded-[20px] md:rounded-[32px] border border-slate-200 overflow-x-auto shadow-inner">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                       <thead className="bg-white border-b border-slate-200">
                          <tr className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <th className="px-6 md:px-8 py-4 md:py-5">Identifier</th>
                             <th className="px-6 md:px-8 py-4 md:py-5">Type</th>
                             <th className="px-6 md:px-8 py-4 md:py-5">Metrics</th>
                             <th className="px-6 md:px-8 py-4 md:py-5">Governance</th>
                             <th className="px-6 md:px-8 py-4 md:py-5 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 text-[11px] md:text-sm font-medium text-slate-700">
                          {MOCK_COLUMNS.map(col => (
                            <tr key={col.name} className="hover:bg-indigo-50/30 transition-colors group/row">
                               <td className="px-6 md:px-8 py-4 md:py-5">
                                  <div className="font-mono text-[10px] md:text-[11px] font-bold text-slate-900">{col.name}</div>
                                  <div className="text-[8px] md:text-[9px] text-slate-400 mt-0.5 font-bold truncate max-w-[150px]">{col.description}</div>
                               </td>
                               <td className="px-6 md:px-8 py-4 md:py-5 text-indigo-600 font-bold font-mono text-[10px] md:text-xs">{col.type}</td>
                               <td className="px-6 md:px-8 py-4 md:py-5">
                                  <div className="flex flex-col gap-1 w-20 md:w-24">
                                     <div className="flex justify-between text-[8px] uppercase font-black text-slate-400">
                                        <span>Nulls: {col.nulls}</span>
                                     </div>
                                     <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: col.unique }}></div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 md:px-8 py-4 md:py-5">
                                  {col.pii ? (
                                    <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-rose-100 text-rose-600 rounded-md text-[8px] md:text-[9px] font-black uppercase border border-rose-200">PII</span>
                                  ) : (
                                    <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-emerald-100 text-emerald-600 rounded-md text-[8px] md:text-[9px] font-black uppercase">Standard</span>
                                  )}
                               </td>
                               <td className="px-6 md:px-8 py-4 md:py-5 text-right">
                                  <button className="text-[9px] md:text-[10px] font-black text-indigo-600 hover:underline">Sample</button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50 shrink-0 flex flex-col md:flex-row justify-between items-center gap-6">
                 <p className="text-[9px] md:text-[10px] text-slate-500 font-bold max-w-lg leading-relaxed uppercase tracking-tighter italic text-center md:text-left">
                   Aura automated scanners have indexed this schema for Phase 2 readiness.
                 </p>
                 <div className="flex gap-3 md:gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-xl md:rounded-2xl text-[10px] uppercase shadow-sm active:scale-95 transition-all">Export Dictionary</button>
                    <button className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-indigo-600 text-white font-black rounded-xl md:rounded-2xl text-[10px] uppercase shadow-xl active:scale-95 transition-all">Init Pipeline</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const SchemaStat = ({ label, value, color = "text-slate-900" }: any) => (
  <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
     <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <p className={`text-base md:text-xl font-black ${color} truncate`}>{value}</p>
  </div>
);

export default DataManagementView;
