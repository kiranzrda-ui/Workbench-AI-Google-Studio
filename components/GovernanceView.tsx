
import React, { useMemo, useState } from 'react';
import { MLModel, ApprovalRequest } from '../types';

interface GovernanceViewProps {
  models: MLModel[];
  approvalQueue: ApprovalRequest[];
}

const GovernanceView: React.FC<GovernanceViewProps> = ({ models, approvalQueue }) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<{title: string, data: any} | null>(null);
  
  const pendingCount = approvalQueue.filter(q => q.status === 'Pending').length;
  const criticalModels = models.filter(m => m.monitoring_status === 'Critical');

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAction = (action: string, target: string, extraData: any = {}) => {
    // Show a detailed "Complete" pop-up
    setActiveAction({
      title: `${action} Initialized`,
      data: {
        target: target,
        timestamp: new Date().toLocaleTimeString(),
        status: 'Triggered Successfully',
        reference: `GOV-${Math.floor(Math.random() * 10000)}`,
        ...extraData
      }
    });
    showToast(`Governance Action: ${action} for ${target}`);
  };

  const complianceStats = [
    { label: 'Model Lineage', score: 98, status: 'Compliant' },
    { label: 'Bias Auditing', score: 94, status: 'Pending Review' },
    { label: 'Security Scan', score: 100, status: 'Secured' },
    { label: 'Drift Thresholds', score: 82, status: 'Alert' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 relative">
      {/* Action Notification Pop-up */}
      {notification && (
        <div className="fixed top-20 right-8 z-[110] animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-sm font-medium">{notification}</div>
          </div>
        </div>
      )}

      {/* Action Detail Modal */}
      {activeAction && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                <h3 className="text-lg font-bold">{activeAction.title}</h3>
                <button onClick={() => setActiveAction(null)} className="text-indigo-200 hover:text-white transition-colors">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <div className="p-8">
                <div className="space-y-4 mb-8">
                   {Object.entries(activeAction.data).map(([key, val]) => (
                     <div key={key} className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{key}:</span>
                        <span className="text-sm font-bold text-slate-800">{String(val)}</span>
                     </div>
                   ))}
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                   <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                   <div className="text-xs text-emerald-800 font-medium">This governance trace has been logged to the Enterprise Ledger.</div>
                </div>
                <button onClick={() => setActiveAction(null)} className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95">
                   Confirm & Close
                </button>
             </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Governance Control</h2>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.2em] mt-1">Enterprise Compliance • Risk & Safety Monitoring</p>
          </div>
          <button 
            onClick={() => handleAction('Full Audit Scan', 'Global Registry', { nodes: 145, findings: 0 })}
            className="text-xs font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition-all border border-purple-200"
          >
            Run Compliance Scan
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Monitor */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  Model Integrity Alerts
                </h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Live Monitoring</span>
              </div>
              <div className="p-6">
                 {criticalModels.length > 0 ? (
                   <div className="space-y-4">
                     {criticalModels.map(m => (
                       <div key={m.id} className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                         <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/20">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                           </svg>
                         </div>
                         <div className="flex-1">
                           <div className="text-xs font-bold text-rose-900">{m.name}</div>
                           <div className="text-[10px] text-rose-600 font-medium">Monitoring Status: {m.monitoring_status} • Accuracy Drop detected</div>
                         </div>
                         <div className="text-right">
                           <div className="text-[10px] font-bold text-rose-700 uppercase tracking-tighter">Drift: {(m.data_drift * 100).toFixed(1)}%</div>
                           <button 
                             onClick={() => handleAction('Retraining', m.name, { epoch: 10, optimizer: 'Adam', lr: 0.001 })}
                             className="text-[10px] text-rose-500 font-bold hover:underline mt-1 active:scale-95"
                           >
                             Retrain Now
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="py-10 text-center text-slate-400 italic">No critical integrity alerts at this time.</div>
                 )}
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Compliance Scorecard
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {complianceStats.map((s, i) => (
                  <div key={i} className="text-center group cursor-help" onClick={() => handleAction('Sub-Audit', s.label, { score: s.score })}>
                     <div className="relative inline-block mb-3">
                        <svg className="w-20 h-20 -rotate-90">
                          <circle cx="40" cy="40" r="36" className="stroke-slate-100 fill-none" strokeWidth="6" />
                          <circle 
                            cx="40" cy="40" r="36" 
                            className={`${s.score > 90 ? 'stroke-emerald-500' : s.score > 80 ? 'stroke-amber-500' : 'stroke-rose-500'} fill-none transition-all duration-1000`} 
                            strokeWidth="6" 
                            strokeDasharray={`${2 * Math.PI * 36}`}
                            strokeDashoffset={`${2 * Math.PI * 36 * (1 - s.score / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-slate-800">{s.score}%</div>
                     </div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
                     <div className={`text-[8px] font-bold mt-1 px-1.5 py-0.5 rounded inline-block ${
                       s.status === 'Compliant' || s.status === 'Secured' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                     }`}>
                       {s.status}
                     </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Side Queue */}
          <div className="space-y-8">
            <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
               <h3 className="font-bold mb-6 flex items-center gap-2 text-indigo-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Approval Queue ({pendingCount})
               </h3>
               <div className="space-y-4">
                  {approvalQueue.filter(q => q.status === 'Pending').slice(0, 4).map(req => (
                    <div key={req.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 group hover:border-indigo-500 transition-all">
                       <div className="text-xs font-bold text-slate-100">{req.modelName}</div>
                       <div className="text-[10px] text-slate-500 mt-1">Requested by: <span className="text-indigo-400 font-bold">{req.requester}</span></div>
                       <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => handleAction('Rejection', req.modelName, { modelId: req.modelId, reason: 'Manual override' })}
                            className="flex-1 py-2 bg-slate-700 hover:bg-rose-600 transition-colors rounded-xl text-[10px] font-bold active:scale-95"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleAction('Approval', req.modelName, { modelId: req.modelId, stage: 'Production' })}
                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl text-[10px] font-bold active:scale-95"
                          >
                            Approve
                          </button>
                       </div>
                    </div>
                  ))}
                  {pendingCount === 0 && <div className="text-center text-slate-600 text-xs py-8 italic">No pending requests</div>}
               </div>
               <button 
                 onClick={() => handleAction('Registry Scan', 'Global History')}
                 className="w-full mt-6 py-3 border border-slate-700 rounded-2xl text-[10px] font-bold hover:bg-slate-800 transition-all uppercase tracking-widest text-slate-400 active:scale-95"
               >
                 View All Requests
               </button>
            </section>

            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-widest">Policy Engine</h3>
               <div className="space-y-3">
                  <PolicyRow label="Automatic Retraining" enabled onToggle={() => handleAction('Policy Update', 'Retraining Lock')} />
                  <PolicyRow label="Privacy/PII Guardrails" enabled onToggle={() => handleAction('Policy Update', 'PII Filter')} />
                  <PolicyRow label="Budget Hard Cap" enabled={false} onToggle={() => handleAction('Policy Update', 'Budgeting')} />
                  <PolicyRow label="Shadow Deployment" enabled onToggle={() => handleAction('Policy Update', 'Shadow Clusters')} />
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const PolicyRow = ({ label, enabled, onToggle }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-bold text-slate-500">{label}</span>
    <button 
      onClick={onToggle}
      className={`w-8 h-4 rounded-full relative transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
    >
       <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`}></div>
    </button>
  </div>
);

export default GovernanceView;
