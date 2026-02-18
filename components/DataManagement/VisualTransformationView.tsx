
import React, { useState, useMemo } from 'react';
import { TRANSFORM_NODES, MOCK_DATASETS } from '../../constants';
import { DataSet, TransformNode } from '../../types';

type Tool = 'Filter' | 'Map' | 'Cleanse' | 'Aggregate' | 'Format';

const VisualTransformationView: React.FC = () => {
  const [selectedDs, setSelectedDs] = useState<DataSet>(MOCK_DATASETS[0]);
  const [executing, setExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TransformNode | null>(null);
  const [activeTool, setActiveTool] = useState<Tool | null>('Filter');

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleExecute = () => {
    if (executing) return;
    setExecuting(true);
    setShowResult(false);
    setLogs([]);
    addLog(`Initializing IAM handshake for ${selectedDs.source_platform}...`);
    
    const steps = [
      `Connecting to ${selectedDs.source_platform} Gateway...`,
      `Extracted ${selectedDs.columns?.length || 0} column units from ${selectedDs.domain} set.`,
      "Optimizing execution graph...",
      "Executing distributed transformation...",
      `Serializing: ${selectedDs.dataset_name}_PROCESSED`
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        addLog(step);
        if (i === steps.length - 1) {
          setExecuting(false);
          setShowResult(true);
          addLog("Success: Transformation Artifact Created.");
        }
      }, (i + 1) * 600);
    });
  };

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden font-inter">
      {/* Configuration Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-100 bg-slate-50/30">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Input Selection</h3>
           <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {MOCK_DATASETS.map(ds => (
                <button 
                  key={ds.id}
                  onClick={() => setSelectedDs(ds)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${selectedDs.id === ds.id ? 'bg-purple-600 border-purple-500 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                >
                   <div className="text-[11px] font-bold truncate">{ds.dataset_name}</div>
                   <div className={`text-[8px] uppercase font-black tracking-tighter mt-0.5 ${selectedDs.id === ds.id ? 'text-purple-200' : 'text-slate-400'}`}>{ds.domain} • {ds.source_platform}</div>
                </button>
              ))}
           </div>
        </div>

        <div className="p-5 flex-1 flex flex-col overflow-hidden">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Logic Primitives</h3>
          <div className="space-y-1 overflow-y-auto">
            {(['Filter', 'Map', 'Cleanse', 'Aggregate', 'Format'] as Tool[]).map(t => (
              <button 
                key={t}
                onClick={() => setActiveTool(t)}
                className={`w-full text-left py-2 px-3 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all ${activeTool === t ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-transparent text-slate-500 hover:bg-slate-50'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4">
             <button 
               onClick={handleExecute}
               disabled={executing}
               className="w-full py-3.5 bg-slate-900 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
             >
               {executing ? <span className="w-2.5 h-2.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : '⚡'}
               {executing ? 'RUNNING' : 'RUN PIPELINE'}
             </button>
          </div>
        </div>
      </aside>

      {/* Visual Workspace */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#fbfcfd]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {TRANSFORM_NODES.map((node, i) => {
            if (i === TRANSFORM_NODES.length - 1) return null;
            const next = TRANSFORM_NODES[i + 1];
            return (
              <path 
                key={node.id}
                d={`M ${node.pos.x + 160} ${node.pos.y + 35} C ${node.pos.x + 200} ${node.pos.y + 35}, ${next.pos.x - 40} ${next.pos.y + 35}, ${next.pos.x} ${next.pos.y + 35}`}
                stroke={executing ? "#a855f7" : "#cbd5e1"}
                strokeWidth="1.5"
                fill="none"
                strokeDasharray={executing ? "None" : "4 4"}
                className={executing ? "animate-pulse" : "animate-dash"}
              />
            );
          })}
        </svg>

        <div className="flex-1 relative">
          {TRANSFORM_NODES.map((node, i) => (
            <div 
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{ left: node.pos.x, top: node.pos.y }}
              className={`absolute w-40 bg-white border cursor-pointer rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md ${selectedNode?.id === node.id ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-indigo-100' : 'border-slate-200'} ${executing ? 'opacity-90' : ''}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all ${selectedNode?.id === node.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 border border-slate-100'}`}>
                  {node.type === 'Source' ? '💿' : node.type === 'Cleanse' ? '✨' : node.type === 'Filter' ? '🔍' : '📦'}
                </div>
                <div className="min-w-0">
                   <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{node.type}</div>
                   <div className="text-[10px] font-black text-slate-800 truncate">{i === 0 ? selectedDs.dataset_name : node.label}</div>
                </div>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-[600ms] ${executing ? 'bg-purple-500 w-full animate-pulse' : (selectedNode?.id === node.id ? 'bg-indigo-400 w-1/2' : 'bg-slate-300 w-1/4')}`}></div>
              </div>
            </div>
          ))}

          {/* Compact Properties Panel */}
          {selectedNode && (
            <div className="absolute top-6 right-6 w-56 bg-white/95 backdrop-blur-md border border-slate-200 p-5 rounded-2xl shadow-xl animate-in slide-in-from-right-4 z-20">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Node Inspector</h4>
                  <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-900 transition-colors">×</button>
               </div>
               <div className="space-y-4">
                  <div>
                     <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Logic Handle</label>
                     <div className="p-2 bg-slate-50 rounded-lg font-mono text-[9px] text-indigo-600 border border-slate-100 break-all">
                        {selectedNode.type === 'Source' ? `read("${selectedDs.dataset_name}")` : `process.${selectedNode.label.replace(/ /g, '_')}()`}
                     </div>
                  </div>
                  <div>
                     <p className="text-[9px] text-slate-500 font-medium leading-relaxed italic">
                        Node type <span className="font-black text-slate-700">{selectedNode.type}</span> is fully compatible with {selectedDs.domain} schemas.
                     </p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Compact Terminal Interface */}
        <div className="h-48 bg-slate-900 flex overflow-hidden shrink-0 border-t border-slate-800">
           <div className="w-1/2 p-6 border-r border-white/5 flex flex-col">
              <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">Live Execution Logs</h4>
              <div className="flex-1 font-mono text-[9px] text-slate-500 space-y-1.5 overflow-y-auto">
                 {logs.map((l, i) => <p key={i} className="animate-in slide-in-from-left-1 border-l border-indigo-500/20 pl-2">{l}</p>)}
                 {logs.length === 0 && <p className="italic text-slate-700">System standby. Awaiting protocol invocation.</p>}
              </div>
           </div>
           <div className="w-1/2 p-6 bg-slate-950 flex flex-col">
              <h4 className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-3">Schema Evolution</h4>
              {showResult ? (
                <div className="flex-1 animate-in fade-in zoom-in-95 duration-500">
                   <table className="w-full text-left font-mono text-[9px]">
                      <thead>
                        <tr className="text-slate-600 border-b border-white/10 uppercase font-black tracking-widest">
                          <th className="pb-1.5">Field_Identity</th>
                          <th className="pb-1.5">Data_T</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDs.columns?.slice(0, 3).map(col => (
                          <tr key={col.name} className="text-emerald-500/80 border-b border-white/5">
                            <td className="py-1.5">{col.name}_X</td>
                            <td className="py-1.5 text-slate-500">{col.type}</td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                   <p className="text-[8px] text-slate-600 mt-2 italic font-bold">Successfully sharded to 4 production partitions.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                   <span className="text-3xl mb-2">📄</span>
                   <p className="text-[9px] font-black uppercase text-white tracking-widest">Preview Inactive</p>
                </div>
              )}
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes dash { to { stroke-dashoffset: -20; } }
        .animate-dash { animation: dash 5s linear infinite; }
      `}</style>
    </div>
  );
};

export default VisualTransformationView;
