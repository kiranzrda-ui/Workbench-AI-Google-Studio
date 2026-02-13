
import React from 'react';
import { ApprovalRequest } from '../../types';

interface ApprovalQueueProps {
  requests: ApprovalRequest[];
}

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ requests }) => {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Pending Approvals</h3>
      <div className="space-y-3">
        {requests.map(req => (
          <div key={req.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-100">{req.modelName}</div>
              <div className="text-[10px] text-slate-500">Requested by: {req.requester} • {new Date(req.timestamp).toLocaleDateString()}</div>
              <div className="mt-2 inline-flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${req.status === 'Pending' ? 'bg-amber-500' : (req.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500')}`}></span>
                 <span className="text-[10px] text-slate-400 uppercase tracking-tighter font-bold">{req.status}</span>
              </div>
            </div>
            {req.status === 'Pending' && (
              <div className="flex gap-2">
                <button className="text-[10px] bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white px-3 py-2 rounded-lg border border-rose-500/30 transition-all">Reject</button>
                <button className="text-[10px] bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-3 py-2 rounded-lg border border-emerald-500/30 transition-all font-bold">Approve</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalQueue;
