
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Persona } from '../types';
import ModelGrid from './widgets/ModelGrid';
import ComparisonChart from './widgets/ComparisonChart';
import ShapPlot from './widgets/ShapPlot';
import ApprovalQueue from './widgets/ApprovalQueue';
import ModelForm from './widgets/ModelForm';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isTyping: boolean;
  persona: Persona;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, isTyping, persona }) => {
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

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/20 backdrop-blur-xl relative">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-600 rounded-2xl rounded-tr-none text-white px-4 py-3 shadow-xl' : 'space-y-4'}`}>
              {msg.role === 'model' && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">✨</div>
                  <div className="flex-1 space-y-4">
                    <div className="bg-slate-800/80 rounded-2xl rounded-tl-none p-4 text-slate-200 leading-relaxed shadow-lg border border-slate-700/50">
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
             <div className="flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-700">
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={persona === 'Data Scientist' ? "Search for retail models in production..." : "View pending approvals or check high drift models..."}
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder:text-slate-500 transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={isTyping}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 rounded-2xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

function renderMetadataWidget(metadata: ChatMessage['metadata']) {
  if (!metadata) return null;
  switch (metadata.type) {
    case 'model-list': return <ModelGrid models={metadata.data} />;
    case 'comparison': return <ComparisonChart models={metadata.data} />;
    case 'shap': return <ShapPlot modelId={metadata.data?.modelId} />;
    case 'approval-queue': return <ApprovalQueue requests={metadata.data} />;
    case 'submission-form': return <ModelForm />;
    default: return null;
  }
}

export default ChatWindow;
