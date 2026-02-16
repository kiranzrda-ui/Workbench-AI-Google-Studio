
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Persona, ExternalAsset, MLModel } from '../types';
import ModelGrid from './widgets/ModelGrid';
import AgentGrid from './widgets/AgentGrid';
import ModelForm from './widgets/ModelForm';
import ComparisonChart from './widgets/ComparisonChart';
import OwnerDetails from './widgets/OwnerDetails';
import ApprovalQueue from './widgets/ApprovalQueue';
import RevenueImpact from './widgets/RevenueImpact';
import ModelDetailTile from './widgets/ModelDetailTile';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isTyping: boolean;
  persona: Persona;
  onImport: (asset: ExternalAsset) => void;
  onRegister: (data: Partial<MLModel>) => void;
  onApprove: (requestId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, isTyping, persona, onRegister, onApprove }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
             <span className="text-6xl mb-4">✨</span>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Aura is Listening</h2>
             <p className="max-w-xs text-xs font-bold mt-2">I can help you audit model safety, analyze revenue impact, or suggest the best training strategy for your next experiment.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] ${msg.role === 'user' ? 'bg-purple-500 text-white rounded-2xl p-4 shadow-lg' : 'space-y-4'}`}>
              {msg.role === 'model' ? (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow text-lg">✨</div>
                  <div className="flex-1 space-y-4">
                    <div className="bg-white rounded-2xl rounded-tl-none p-4 text-slate-800 leading-relaxed shadow-sm border border-slate-200 text-sm font-medium">
                      {msg.content}
                    </div>
                    {msg.metadata?.type === 'model-list' && <ModelGrid models={msg.metadata.data} />}
                    {msg.metadata?.type === 'agent-list' && <AgentGrid agents={msg.metadata.data} />}
                    {msg.metadata?.type === 'owner-details' && <OwnerDetails model={msg.metadata.data} />}
                    {msg.metadata?.type === 'revenue-impact' && <RevenueImpact model={msg.metadata.data} />}
                    {msg.metadata?.type === 'approval-queue' && <ApprovalQueue requests={msg.metadata.data} onApprove={onApprove} />}
                    {msg.metadata?.type === 'model-detail-tile' && <ModelDetailTile model={msg.metadata.data} />}
                    {msg.metadata?.type === 'model-form' && (
                      <div className="animate-in zoom-in-95">
                         <ModelForm onRegister={onRegister} initialData={msg.metadata.data} />
                      </div>
                    )}
                    {msg.metadata?.type === 'comparison' && (
                      <div className="animate-in slide-in-from-bottom-4">
                         <ComparisonChart models={msg.metadata.data} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm font-bold">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex items-center gap-2 bg-white rounded-full px-6 py-2 border border-slate-200 shadow-sm">
               <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
               <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-150"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Aura is thinking...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-200 bg-white/70 backdrop-blur-2xl">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Aura, can you find me models with accuracy above 90%?"
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-slate-800 text-sm font-bold transition-all shadow-inner"
          />
          <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50" disabled={isTyping}>
            Converse
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
