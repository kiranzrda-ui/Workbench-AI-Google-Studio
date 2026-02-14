
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Persona, ExternalAsset, MLModel } from '../types';
import ModelGrid from './widgets/ModelGrid';
import AgentGrid from './widgets/AgentGrid';
import ComparisonChart from './widgets/ComparisonChart';
import ShapPlot from './widgets/ShapPlot';
import PerformanceProfile from './widgets/PerformanceProfile';
import ApprovalQueue from './widgets/ApprovalQueue';
import ModelForm from './widgets/ModelForm';
import ExternalScan from './widgets/ExternalScan';
import RevenueImpact from './widgets/RevenueImpact';
import OwnerDetails from './widgets/OwnerDetails';
import LineageWidget from './widgets/LineageWidget';
import HyperparamsWidget from './widgets/HyperparamsWidget';
import DataCatalogWidget from './widgets/DataCatalogWidget';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isTyping: boolean;
  persona: Persona;
  onImport: (asset: ExternalAsset) => void;
  onRegister: (data: Partial<MLModel>) => void;
  onApprove: (requestId: string) => void;
}

const DEMO_PROMPTS = [
  { label: "🛡️ Safety Audit", prompt: "Audit the registry for any models containing sensitive PHI or PII data." },
  { label: "🚀 Start Pipeline", prompt: "Run a classification experiment on Snowflake_Customer_Churn via Google Vertex AI." },
  { label: "💰 ROI Analysis", prompt: "Compare our production models based on their annual revenue attribution." },
  { label: "🔍 Root Cause", prompt: "Analyze the data drift for the Retail Classification Engine and show lineage." },
  { label: "⚖️ Governance", prompt: "Supervisor: Fetch all pending approval requests for mission-critical assets." }
];

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, isTyping, persona, onImport, onRegister, onApprove }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSend(input);
    setInput('');
  };

  const renderMetadataWidget = (metadata: ChatMessage['metadata']) => {
    if (!metadata) return null;
    
    if (metadata.type === 'tool-call-log') {
       return (
         <div className="bg-slate-900 rounded-[32px] p-8 border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-4xl group-hover:scale-110 transition-transform">⚡</div>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-6">
               <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
               </div>
               <div>
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Cross-Cloud Handshake</h4>
                  <p className="text-[10px] text-slate-500 font-bold">Verifying Multi-Cloud Entitlements</p>
               </div>
            </div>
            <div className="space-y-4">
               {metadata.data.map((call: any, idx: number) => (
                 <div key={idx} className="font-mono text-[10px] space-y-2">
                    <div className="flex justify-between text-indigo-300">
                       <span className="font-bold flex items-center gap-2">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                          EXEC::{call.name.toUpperCase()}
                       </span>
                       <span className="text-[8px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-500">AUTH::0x{Math.floor(Math.random()*10000).toString(16).toUpperCase()}</span>
                    </div>
                    <div className="bg-black/40 p-4 rounded-2xl border border-slate-800 text-slate-400 leading-relaxed group-hover:border-indigo-500/30 transition-colors">
                       {JSON.stringify(call.args, null, 2)}
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-6 flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest italic">
               <span>TLS 1.3 Encryption Active</span>
               <span className="text-emerald-500">Handshake Success</span>
            </div>
         </div>
       );
    }

    switch (metadata.type) {
      case 'model-list': return <ModelGrid models={metadata.data} />;
      case 'agent-list': return <AgentGrid agents={metadata.data} />;
      case 'scan-results': return <ExternalScan assets={metadata.data} onImport={onImport} />;
      case 'comparison': return <ComparisonChart models={metadata.data} />;
      case 'performance-profile': return <PerformanceProfile model={metadata.data} />;
      case 'shap': return <ShapPlot modelId={metadata.data?.modelId} />;
      case 'approval-queue': return <ApprovalQueue requests={metadata.data} onApprove={onApprove} />;
      case 'submission-form': return <ModelForm onRegister={onRegister} />;
      case 'revenue-impact': return <RevenueImpact model={metadata.data} />;
      case 'model-ownership': return <OwnerDetails model={metadata.data} />;
      case 'data-lineage': return <LineageWidget model={metadata.data} />;
      case 'hyperparams': return <HyperparamsWidget model={metadata.data} />;
      case 'data-catalog': return <DataCatalogWidget model={metadata.data} />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-slate-900 rounded-[28px] rounded-tr-none text-white px-6 py-4 shadow-xl' : 'space-y-4'}`}>
              {msg.role === 'model' && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-lg text-xl relative group">
                    ✨
                    <div className="absolute inset-0 rounded-2xl bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="bg-white rounded-[28px] rounded-tl-none p-6 text-slate-800 leading-relaxed shadow-sm border border-slate-200 text-sm font-medium">
                      {msg.content}
                    </div>
                    {msg.metadata && renderMetadataWidget(msg.metadata)}
                  </div>
                </div>
              )}
              {msg.role === 'user' && (
                <div className="flex items-center gap-3">
                   <span className="text-sm font-bold tracking-tight">{msg.content}</span>
                   <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300">U</div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 border border-slate-200 shadow-xl">
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Aura Orchestrating...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-200 bg-white/70 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-2">
          {DEMO_PROMPTS.map((d, i) => (
            <button 
              key={i}
              onClick={() => onSend(d.prompt)}
              className="text-[10px] font-black px-4 py-2 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm uppercase tracking-tighter active:scale-95"
            >
              {d.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={persona === 'Data Scientist' ? "Audit safety, run experiments, or search registry..." : "Authorize deployments, audit drift, or review requests..."}
            className="flex-1 bg-white border border-slate-200 rounded-[28px] px-8 py-5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-slate-800 placeholder:text-slate-400 transition-all shadow-xl text-sm font-bold"
          />
          <button 
            type="submit"
            disabled={isTyping}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 rounded-[28px] font-black transition-all shadow-2xl active:scale-95 text-xs uppercase tracking-widest"
          >
            Execute
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
