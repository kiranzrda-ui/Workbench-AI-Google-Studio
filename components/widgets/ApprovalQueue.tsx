
import React from 'react';
import { ApprovalRequest } from '../../types';

interface ApprovalQueueProps {
  requests: ApprovalRequest[];
  onApprove?: (id: string) => void;
}

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ requests, onApprove }) => {
  if (!requests || requests.length === 0) return (
    <div className="bg-slate-50 rounded-3xl p-8 border border-dashed border-slate-200 text-center">
       <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Queue is Clear</p>
    </div>
  );

  return (
    <div className="bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
      <h3 className="text-[10px] font-black text-indigo-400 mb-6 uppercase tracking-[0.2em]">Pending Approvals</h3>
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-[24px] flex items-center justify-between group">
            <div className="flex-1">
              <div className="text-sm font-black text-slate-100 group-hover:text-indigo-300 transition-colors">{req.modelName}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-1">Requested by: {req.requester} • {new Date(req.timestamp).toLocaleDateString()}</div>
              <div className="mt-3 inline-flex items-center gap-2">
                 <span className={`w-1.5 h-1.5 rounded-full ${req.status === 'Pending' ? 'bg-amber-500 animate-pulse' : (req.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500')}`}></span>
                 <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">{req.status}</span>
              </div>
            </div>
            {req.status === 'Pending' && (
              <div className="flex gap-2">
                <button className="text-[9px] font-black text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl border border-rose-500/20 transition-all uppercase tracking-widest">Reject</button>
                <button 
                  onClick={() => onApprove && onApprove(req.id)}
                  className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl border border-emerald-500/20 transition-all uppercase tracking-widest shadow-lg"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalQueue;
