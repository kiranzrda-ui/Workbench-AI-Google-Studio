
import React, { useState } from 'react';
import { DATA_CONNECTORS } from '../../constants';
import { DataConnector } from '../../types';

const DataConnectivityView: React.FC = () => {
  const [connectors, setConnectors] = useState<DataConnector[]>(DATA_CONNECTORS);
  const [showAdd, setShowAdd] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [newConnName, setNewConnName] = useState('');

  const handleTest = (id: string) => {
    if (testingId) return;
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setConnectors(prev => prev.map(c => c.id === id ? { ...c, last_sync: 'Just now', latency_ms: Math.floor(Math.random() * 15) + 4 } : c));
    }, 2000);
  };

  const handleCreate = () => {
    const newConn: DataConnector = {
      id: `c-${Date.now()}`,
      name: newConnName || 'Secure Node',
      type: 'IAM',
      status: 'Connected',
      last_sync: 'Validated',
      latency_ms: 12,
      endpoint: 'sfc-aws-cluster.internal.com',
      config: { region: 'us-east-1', role: 'Workbench_Reader' }
    };
    setConnectors([newConn, ...connectors]);
    setShowAdd(false);
    setNewConnName('');
    setStep(1);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-8 relative font-inter">
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Connectivity Hub</h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2">Zero-Trust Data Bridge Management</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="px-8 py-3.5 bg-indigo-600 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
        >
          <span>🔌</span> REGISTER NEW NODE
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {connectors.map(c => (
          <div key={c.id} className={`bg-white rounded-[32px] border transition-all duration-500 p-8 space-y-6 shadow-sm group relative overflow-hidden ${testingId === c.id ? 'border-indigo-400 ring-8 ring-indigo-50 shadow-indigo-100' : 'border-slate-100 hover:border-indigo-300'}`}>
             <div className={`absolute top-0 right-0 p-8 opacity-5 text-7xl grayscale transition-transform group-hover:scale-110 ${c.status === 'Connected' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {c.name.includes('Snowflake') ? '❄️' : '🪄'}
             </div>
             
             {testingId === c.id && (
               <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                  <div className="w-10 h-10 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">PINGING HANDSHAKE...</div>
               </div>
             )}

             <div className="flex justify-between items-start relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500`}>
                  {c.type === 'IAM' ? '🛡️' : '🔗'}
                </div>
                <div className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 border ${
                  c.status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                   <div className={`w-1 h-1 rounded-full ${c.status === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                   {c.status}
                </div>
             </div>

             <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">{c.name}</h3>
                <p className="text-[9px] font-mono text-slate-400 truncate font-bold bg-slate-50 p-2 rounded-lg border border-slate-100/50">{c.endpoint}</p>
             </div>

             <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50 relative z-10">
                <div>
                   <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Sync State</div>
                   <div className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{c.last_sync}</div>
                </div>
                <div>
                   <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Latency (P99)</div>
                   <div className="text-[11px] font-mono font-black text-indigo-600">{testingId === c.id ? '--' : c.latency_ms}ms</div>
                </div>
             </div>

             <div className="flex gap-2 relative z-10">
                <button className="flex-1 py-3 bg-slate-50 border border-slate-100 text-[9px] font-black uppercase text-slate-500 rounded-xl hover:bg-slate-100 transition-all">CONFIG</button>
                <button 
                  onClick={() => handleTest(c.id)}
                  className="flex-1 py-3 bg-indigo-50 border border-indigo-100 text-[9px] font-black uppercase text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-indigo-100 shadow-lg active:scale-95"
                >
                  TEST SYNC
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Compact Modern Registration Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 border border-white/10">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Register Node</h3>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Protocol Step {step} of 2</p>
                 </div>
                 <button onClick={() => setShowAdd(false)} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400">×</button>
              </div>
              <div className="p-8 space-y-8 min-h-[320px]">
                 {step === 1 ? (
                   <div className="space-y-6 animate-in slide-in-from-right-2">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Identity Label</label>
                         <input 
                           type="text" 
                           value={newConnName}
                           onChange={(e) => setNewConnName(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-black text-slate-900 focus:ring-4 focus:ring-indigo-100 outline-none shadow-inner" 
                           placeholder="e.g., Azure_West_Production" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Security Architecture</label>
                         <div className="grid grid-cols-2 gap-3">
                            {['Cloud Hub', 'REST Gateway'].map((t, i) => (
                              <button key={t} onClick={() => setStep(2)} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left">
                                 <span className="text-xl">{i === 0 ? '☁️' : '🔗'}</span>
                                 <span className="font-black text-slate-800 uppercase text-[9px] tracking-tighter leading-none">{t}</span>
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-6 animate-in slide-in-from-right-2">
                      <div className="space-y-4">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Endpoint URI</label>
                         <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-4 focus:ring-indigo-100 outline-none shadow-inner" placeholder="sfc-internal-p1.snowflake.com" />
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pt-2">IAM Role ARN</label>
                         <input type="password" value="••••••••••••••••••••" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none" />
                      </div>
                   </div>
                 )}
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                 {step > 1 && <button onClick={() => setStep(1)} className="flex-1 py-4 text-slate-500 font-black text-[9px] uppercase tracking-widest hover:text-slate-900 transition-colors">BACK</button>}
                 <button 
                   onClick={() => step === 2 ? handleCreate() : setStep(2)}
                   className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl text-[9px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
                 >
                    {step === 2 ? 'AUTHORIZE NODE' : 'CONTINUE'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DataConnectivityView;
