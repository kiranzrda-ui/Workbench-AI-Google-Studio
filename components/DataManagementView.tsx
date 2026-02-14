
import React from 'react';
import { MLModel } from '../types';

interface DataManagementViewProps {
  models: MLModel[];
}

const DataManagementView: React.FC<DataManagementViewProps> = ({ models }) => {
  const dataAssets = models.map(m => m.data_catalog).slice(0, 20);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Data Catalog</h2>
        <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.2em] mt-1">Global Assets • Governance & Lineage Hub</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Verified Training Sets</h3>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">Healthy Cluster</span>
            </div>
            <div className="divide-y divide-slate-50">
              {dataAssets.map((asset, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">📁</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{asset.dataset_name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{asset.format} • {asset.record_count} Records • {asset.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {asset.phi_data && (
                      <span className="text-[8px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 uppercase tracking-widest">Sensitive</span>
                    )}
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Inspect</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
            <h3 className="font-bold text-indigo-100 uppercase tracking-widest text-[10px] mb-4">Storage Quota</h3>
            <div className="text-3xl font-bold mb-4">42.8 TB</div>
            <div className="w-full bg-indigo-500 h-2 rounded-full mb-2">
              <div className="bg-white h-full w-[65%] rounded-full"></div>
            </div>
            <p className="text-[10px] text-indigo-200">Across AWS East & GCP Europe Regions</p>
          </section>

          <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <ActionButton label="Sync Feature Store" icon="⚡" />
              <ActionButton label="Run Bias Audit" icon="⚖️" />
              <ActionButton label="Rotate API Keys" icon="🔑" />
              <ActionButton label="Dataset Snapshot" icon="📸" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ label, icon }: any) => (
  <button className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all active:scale-[0.98]">
    <span>{icon}</span>
    {label}
  </button>
);

export default DataManagementView;
