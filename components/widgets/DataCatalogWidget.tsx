
import React from 'react';
import { MLModel } from '../../types';

const DataCatalogWidget: React.FC<{ model: MLModel }> = ({ model }) => {
  if (!model) return null;
  const { data_catalog } = model;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg border border-slate-100">💿</div>
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dataset Artifact</h3>
          <h4 className="text-sm font-bold text-slate-800">{data_catalog.dataset_name}</h4>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-slate-400 uppercase">Records</div>
          <div className="text-xs font-bold text-slate-700">{data_catalog.record_count}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-slate-400 uppercase">Size / Format</div>
          <div className="text-xs font-bold text-slate-700">{data_catalog.size} • {data_catalog.format}</div>
        </div>
      </div>
      {data_catalog.phi_data && (
        <div className="mt-4 p-2 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
           <span className="text-[9px] font-bold text-rose-700 uppercase">Contains PHI/PII Data</span>
        </div>
      )}
    </div>
  );
};

export default DataCatalogWidget;
