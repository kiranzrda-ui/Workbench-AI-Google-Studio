
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
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, isTyping, persona, onImport, onRegister }) => {
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
    switch (metadata.type) {
      case 'model-list': return <ModelGrid models={metadata.data} />;
      case 'agent-list': return <AgentGrid agents={metadata.data} />;
      case 'scan-results': return <ExternalScan assets={metadata.data} onImport={onImport} />;
      case 'comparison': return <ComparisonChart models={metadata.data} />;
      case 'performance-profile': return <PerformanceProfile model={metadata.data} />;
      case 'shap': return <ShapPlot modelId={metadata.data?.modelId} />;
      case 'approval-queue': return <ApprovalQueue requests={metadata.data} />;
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
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-purple-500 rounded-2xl rounded-tr-none text-white px-4 py-3 shadow-xl' : 'space-y-4'}`}>
              {msg.role === 'model' && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-lg">✨</div>
                  <div className="flex-1 space-y-4">
                    <div className="bg-white rounded-2xl rounded-tl-none p-4 text-slate-800 leading-relaxed shadow-sm border border-slate-200">
                      {msg.content}
                    </div>
                    {msg.metadata && renderMetadataWidget(msg.metadata)}
                  </div>
                </div>
              )}
              {msg.role === 'user' && msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-slate-200 shadow-sm">
               <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-100"></div>
               <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-200"></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-200 bg-white/70 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={persona === 'Data Scientist' ? "Try 'show lineage for m-1' or 'hyperparams for FraudGuard'..." : "Try 'review pending models' or 'financial audit'..."}
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 placeholder:text-slate-400 transition-all shadow-sm"
          />
          <button 
            type="submit"
            disabled={isTyping}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 rounded-2xl font-semibold transition-all shadow-lg shadow-purple-500/20 active:scale-95"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
