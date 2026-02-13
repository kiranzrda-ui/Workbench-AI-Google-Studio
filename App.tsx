
import React, { useState, useEffect, useRef } from 'react';
import { Persona, MLModel, ChatMessage, ApprovalRequest } from './types';
import { INITIAL_MODELS } from './constants';
import { chatWithAgent } from './geminiService';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import ModelVisuals from './components/ModelVisuals';

const App: React.FC = () => {
  const [persona, setPersona] = useState<Persona>('Data Scientist');
  const [models, setModels] = useState<MLModel[]>(INITIAL_MODELS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([
    { id: 'req-1', modelId: 'm-5', modelName: 'Finance NLP v0.4', requester: 'Scientist_Alpha', timestamp: new Date().toISOString(), status: 'Pending' }
  ]);

  // Initial greeting
  useEffect(() => {
    const greeting = persona === 'Data Scientist' 
      ? "Welcome back to Aura Workbench. I'm your model discovery agent. Are you looking to find an existing production model, or are you here to register a new experiment?"
      : "Supervisor dashboard active. I've flagged 3 models with significant drift and have 1 pending approval request. How would you like to proceed?";
    
    setMessages([{
      role: 'model',
      content: greeting,
      timestamp: new Date()
    }]);
  }, [persona]);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Convert messages to Gemini format
      const chatHistory = messages.slice(-10).map(m => ({
        role: (m.role === 'model' ? 'model' : 'user') as 'model' | 'user',
        parts: [{ text: m.content }]
      }));
      chatHistory.push({ role: 'user', parts: [{ text }] });

      const response = await chatWithAgent(chatHistory, persona, models);
      
      const modelMsg: ChatMessage = {
        role: 'model',
        content: response.reply,
        timestamp: new Date(),
        metadata: {
          type: mapIntentToMetaType(response.intent),
          data: processPayload(response.intent, response.payload, models, approvalQueue)
        }
      };

      setMessages(prev => [...prev, modelMsg]);

      // Side effect: If intent is UPDATE_APPROVAL, we actually update state
      if (response.intent === 'UPDATE_APPROVAL' && response.payload?.modelId) {
        const newStatus = response.payload.metadata?.status === 'Approved' ? 'Approved' : 'Rejected';
        setApprovalQueue(prev => prev.map(q => q.modelId === response.payload.modelId ? { ...q, status: newStatus } : q));
        setModels(prev => prev.map(m => m.id === response.payload.modelId ? { ...m, approval_status: newStatus } : m));
      }

      // Side effect: Register model
      if (response.intent === 'REGISTER' && response.payload?.metadata) {
        const newModel: MLModel = {
          ...INITIAL_MODELS[0], // base template
          id: `m-new-${Date.now()}`,
          ...response.payload.metadata,
          approval_status: 'Pending',
          model_stage: 'Experimental'
        };
        setModels(prev => [newModel, ...prev]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: "I encountered an error processing that. Could you try rephrasing? My connections seem a bit shaky.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      <Sidebar 
        persona={persona} 
        setPersona={setPersona} 
        stats={{
          total: models.length,
          pending: approvalQueue.filter(q => q.status === 'Pending').length,
          critical: models.filter(m => m.monitoring_status === 'Critical').length
        }}
      />
      
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">A</div>
            <h1 className="text-xl font-semibold tracking-tight">Aura <span className="text-indigo-400 font-light">AI Workbench</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">System Status: <span className="text-emerald-400">Optimal</span></div>
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700"></div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col border-r border-slate-800/50">
            <ChatWindow 
              messages={messages} 
              onSend={handleSendMessage} 
              isTyping={isTyping} 
              persona={persona}
            />
          </div>
          
          <div className="hidden lg:block w-96 xl:w-[450px] bg-slate-900/30 overflow-y-auto p-4 space-y-4">
             <ModelVisuals models={models} persona={persona} />
          </div>
        </div>
      </main>
    </div>
  );
};

function mapIntentToMetaType(intent: string): ChatMessage['metadata']['type'] {
  switch (intent) {
    case 'SEARCH': return 'model-list';
    case 'COMPARE': return 'comparison';
    case 'SHAP': return 'shap';
    case 'IMPACT': return 'impact';
    case 'APPROVAL_QUEUE': return 'approval-queue';
    case 'REGISTER': return 'submission-form';
    default: return undefined;
  }
}

function processPayload(intent: string, payload: any, allModels: MLModel[], queue: ApprovalRequest[]) {
  if (intent === 'SEARCH' && payload?.filters) {
    const { domain, accuracy, stage } = payload.filters;
    return allModels.filter(m => {
      let match = true;
      if (domain && !m.domain.toLowerCase().includes(domain.toLowerCase())) match = false;
      if (accuracy && m.accuracy < accuracy) match = false;
      if (stage && m.model_stage.toLowerCase() !== stage.toLowerCase()) match = false;
      return match;
    }).slice(0, 5);
  }
  
  if (intent === 'COMPARE' && payload?.modelIds) {
    return allModels.filter(m => payload.modelIds.includes(m.id) || payload.modelIds.includes(m.name));
  }

  if (intent === 'APPROVAL_QUEUE') return queue;

  return payload;
}

export default App;
