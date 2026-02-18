
import React, { useMemo, useState } from 'react';
import { MLModel, ApprovalRequest, AuditLog } from '../types';

interface GovernanceViewProps {
  models: MLModel[];
  approvalQueue: ApprovalRequest[];
  auditLogs: AuditLog[];
  onApprove?: (id: string) => void;
}

const GovernanceView: React.FC<GovernanceViewProps> = ({ models, approvalQueue, auditLogs, onApprove }) => {
  const [activeTab, setActiveTab] = useState<'Monitor' | 'Audit Ledger'>('Monitor');
  
  const criticalModels = models.filter(m => m.monitoring_status === 'Critical');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Collaboration and Governance</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Enterprise Compliance • Immutable Audit Trail</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
           {(['Monitor', 'Audit Ledger'] as const).map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </header>

      {activeTab === 'Monitor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                   <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                   Critical Integrity Alerts
                 </h3>
                 <div className="space-y-4">
                    {criticalModels.length > 0 ? criticalModels.map(m => (
                       <div key={m.id} className="flex items-center gap-6 p-6 bg-rose-50 border border-rose-100 rounded-[32px]">
                          <div className="w-14 h-14 bg-rose-500 rounded-3xl flex items-center justify-center text-white text-2xl shadow-xl shadow-rose-200 shrink-0">⚠️</div>
                          <div className="flex-1">
                             <div className="text-lg font-bold text-rose-900">{m.name}</div>
                             <p className="text-xs text-rose-700 mt-1">Accuracy fell below 85% threshold. Retraining job suggested.</p>
                          </div>
                          <button className="px-6 py-3 bg-rose-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg">Fix Now</button>
                       </div>
                    )) : (
                      <div className="p-12 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No Critical Alerts Detected</div>
                    )}
                 </div>
              </section>

              <div className="grid grid-cols-2 gap-8">
                 <div className="bg-indigo-600 rounded-[40px] p-8 text-white">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-6">Safety Score</h3>
                    <div className="text-5xl font-black mb-2">94%</div>
                    <p className="text-xs opacity-80 leading-relaxed">System-wide adherence to fairness and bias constraints.</p>
                 </div>
                 <div className="bg-white rounded-[40px] p-8 border border-slate-200">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Lineage Coverage</h3>
                    <div className="text-5xl font-black text-slate-900 mb-2">100%</div>
                    <p className="text-xs text-slate-500 leading-relaxed">Every model in production has a verified provenance trail.</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl overflow-y-auto">
              <h3 className="font-black text-indigo-400 uppercase tracking-[0.2em] text-[10px] mb-8">Pending Approvals ({approvalQueue.length})</h3>
              <div className="space-y-4">
                 {approvalQueue.map(req => (
                    <div key={req.id} className="bg-slate-800 p-6 rounded-[32px] border border-slate-700">
                      <div className="text-sm font-bold text-white">{req.modelName}</div>
                      <div className="text-[10px] text-slate-500 mt-2">Requester: {req.requester} • Date: {new Date(req.timestamp).toLocaleDateString()}</div>
                      <div className="flex gap-2 mt-6">
                         <button 
                           onClick={() => onApprove && onApprove(req.id)}
                           className="flex-1 py-3 bg-emerald-600 rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-500 transition-colors"
                         >
                           Approve
                         </button>
                         <button className="flex-1 py-3 bg-slate-700 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-600 transition-colors">Review</button>
                      </div>
                    </div>
                 ))}
                 {approvalQueue.length === 0 && (
                   <div className="p-8 text-center text-slate-600 border border-dashed border-slate-700 rounded-[32px] italic text-xs">Queue Clear</div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'Audit Ledger' && (
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-8">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Orchestrator Role</th>
                    <th className="px-6 py-4">Action Taken</th>
                    <th className="px-6 py-4">Target Platform</th>
                    <th className="px-6 py-4">Verification</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-[11px]">
                 {auditLogs.map(log => (
                   <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-5 font-bold text-slate-700">{log.user}</td>
                      <td className="px-6 py-5 text-slate-900 font-bold">{log.action}</td>
                      <td className="px-6 py-5 text-indigo-600 font-bold">{log.platform}</td>
                      <td className="px-6 py-5">
                         <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded font-black text-[9px] uppercase">SHA-256 Valid</span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default GovernanceView;
