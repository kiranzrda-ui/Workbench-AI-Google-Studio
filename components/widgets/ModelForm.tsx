
import React, { useState } from 'react';
import { MLModel } from '../../types';

interface ModelFormProps {
  onRegister?: (data: Partial<MLModel>) => void;
  initialData?: { name?: string; domain?: string };
}

const ModelForm: React.FC<ModelFormProps> = ({ onRegister, initialData }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    domain: MLModel['domain'];
    description: string;
  }>({
    name: initialData?.name || '',
    domain: (initialData?.domain as MLModel['domain']) || 'Retail',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (onRegister) {
      onRegister(formData);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-200 shadow-md text-center animate-in zoom-in-95 duration-300">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-800 mb-2">Registration Confirmed</h3>
        <p className="text-sm text-emerald-600">
          The model <strong>{formData.name}</strong> has been successfully added to the registry as an experimental asset.
        </p>
        <div className="mt-6 pt-4 border-t border-emerald-100">
           <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">Awaiting Supervisor Validation</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-xl max-w-lg">
      <h3 className="text-sm font-black text-purple-600 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
        Asset Registration Form
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-800 transition-all" 
              placeholder="e.g., Footfall Predictor" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Domain</label>
            <select 
              required
              value={formData.domain}
              onChange={(e) => setFormData({...formData, domain: e.target.value as MLModel['domain']})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-purple-500/20 outline-none text-slate-800"
            >
              <option value="Retail">Retail</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Supply Chain">Supply Chain</option>
              <option value="Tech">Tech</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Use Case Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium h-20 text-slate-800 transition-all resize-none" 
              placeholder="Briefly state the deployment objective..."
            ></textarea>
        </div>
        <button 
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] uppercase text-[10px] tracking-[0.2em]"
        >
          Initialize Metadata Handshake
        </button>
      </form>
    </div>
  );
};

export default ModelForm;
