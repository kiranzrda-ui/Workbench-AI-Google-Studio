
import React, { useState } from 'react';
import { MLModel } from '../../types';

interface OwnerDetailsProps {
  model: MLModel;
}

const OwnerDetails: React.FC<OwnerDetailsProps> = ({ model }) => {
  const [requestSent, setRequestSent] = useState(false);

  if (!model) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-indigo-600 h-1.5 w-full"></div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shadow-inner">👤</div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Ownership</h3>
            <h2 className="text-xl font-bold text-slate-800">{model.contributor}</h2>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-xs text-slate-500 font-medium">Associated Team</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{model.model_owner_team}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-xs text-slate-500 font-medium">Inference Endpoint</span>
            <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{model.inference_endpoint_id}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-xs text-slate-500 font-medium">SLA Tier</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-tighter border border-amber-100">{model.sla_tier}</span>
          </div>
        </div>

        <div className="mt-8">
          {!requestSent ? (
            <button 
              onClick={() => setRequestSent(true)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Request Endpoint Access
            </button>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-200">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-xs text-emerald-800 font-medium">
                Access request sent to <strong>{model.contributor}</strong>. Expect validation within 24 hours.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDetails;
