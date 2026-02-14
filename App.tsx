
import React, { useState, useEffect } from 'react';
import { Persona, MLModel, AIAgent, ChatMessage, ApprovalRequest, ExternalAsset } from './types';
import { INITIAL_MODELS, INITIAL_AGENTS } from './constants';
import { chatWithAgent } from './geminiService';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import ModelVisuals from './components/ModelVisuals';
import Gatekeeper from './components/Gatekeeper';
import RegistryView from './components/RegistryView';
import AgentHubView from './components/AgentHubView';
import GovernanceView from './components/GovernanceView';
import DataManagementView from './components/DataManagementView';

type AppView = 'Workspace' | 'Registry' | 'Agents' | 'Governance' | 'Data';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    const authDate = sessionStorage.getItem('aura_auth_date');
    const today = new Date().toISOString().split('T')[0];
    return authDate === today;
  });

  const [persona, setPersona] = useState<Persona>('Data Scientist');
  const [activeView, setActiveView] = useState<AppView>('Workspace');
  const [models, setModels] = useState<MLModel[]>(INITIAL_MODELS);
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastDisplayedAssetIds, setLastDisplayedAssetIds] = useState<string[]>([]);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([
    { id: 'req-1', modelId: 'm-5', modelName: 'Finance NLP v0.4', requester: 'Scientist_Alpha', timestamp: new Date().toISOString(), status: 'Pending' }
  ]);

  const handleUnlock = () => {
    const today = new Date().toISOString().split('T')[0];
    sessionStorage.setItem('aura_auth_date', today);
    setIsAuthorized(true);
  };

  useEffect(() => {
    if (!isAuthorized) return;
    const greeting = persona === 'Data Scientist' 
      ? "Aura OS active. Monitoring 145 models. How can I help you with data lineage or hyperparameters today?"
      : "Supervisor Hub engaged. Drift detected in 3 models. How can I help you optimize governance?";
    setMessages([{ role: 'model', content: greeting, timestamp: new Date() }]);
  }, [persona, isAuthorized]);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const chatHistory = messages.slice(-10).map(m => ({
        role: (m.role === 'model' ? 'model' : 'user') as 'model' | 'user',
        parts: [{ text: m.content }]
      }));
      chatHistory.push({ role: 'user', parts: [{ text }] });

      const response = await chatWithAgent(chatHistory, persona, models, agents, lastDisplayedAssetIds);
      const processedData = processPayload(response.intent, response.payload, models, agents, approvalQueue, lastDisplayedAssetIds);

      if (['SEARCH', 'TRENDS', 'COMPARE', 'REVENUE_IMPACT', 'MODEL_OWNERSHIP', 'DATA_LINEAGE', 'HYPERPARAMETERS', 'DATA_CATALOG', 'PERFORMANCE_PROFILE'].includes(response.intent)) {
        if (processedData) {
          const ids = Array.isArray(processedData) ? processedData.map((d: any) => d.id || d.name) : [(processedData as any).id || (processedData as any).name];
          setLastDisplayedAssetIds(ids);
        }
      }

      const modelMsg: ChatMessage = {
        role: 'model',
        content: response.reply,
        timestamp: new Date(),
        metadata: {
          type: mapIntentToMetaType(response.intent),
          data: processedData
        }
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Portfolio synchronization failed. Connection unstable.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isAuthorized) return <Gatekeeper onUnlock={handleUnlock} />;

  const renderContent = () => {
    switch (activeView) {
      case 'Registry': return <RegistryView models={models} />;
      case 'Agents': return <AgentHubView agents={agents} />;
      case 'Governance': return <GovernanceView models={models} approvalQueue={approvalQueue} />;
      case 'Data': return <DataManagementView models={models} />;
      default: return (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col border-r border-slate-200">
            <ChatWindow messages={messages} onSend={handleSendMessage} isTyping={isTyping} persona={persona} onImport={() => {}} onRegister={() => {}} />
          </div>
          <div className="hidden lg:block w-96 xl:w-[450px] bg-slate-50 overflow-y-auto p-4 space-y-4">
             <ModelVisuals models={models} persona={persona} />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-inter">
      <Sidebar persona={persona} setPersona={setPersona} activeView={activeView} setActiveView={setActiveView} stats={{ total: models.length, agents: agents.length, pending: approvalQueue.filter(q => q.status === 'Pending').length, critical: models.filter(m => m.monitoring_status === 'Critical').length }} />
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-500/20 text-white">A</div>
            <h1 className="text-xl font-semibold tracking-tight">Aura <span className="text-purple-600 font-light">Workbench</span></h1>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

function mapIntentToMetaType(intent: string): ChatMessage['metadata']['type'] {
  switch (intent) {
    case 'SEARCH': 
    case 'TRENDS': return 'model-list';
    case 'SEARCH_AGENTS': return 'agent-list';
    case 'SCAN_EXTERNAL': return 'scan-results';
    case 'COMPARE': return 'comparison';
    case 'PERFORMANCE_PROFILE': return 'performance-profile';
    case 'REVENUE_IMPACT': return 'revenue-impact';
    case 'MODEL_OWNERSHIP': return 'model-ownership';
    case 'DATA_LINEAGE': return 'data-lineage';
    case 'HYPERPARAMETERS': return 'hyperparams';
    case 'DATA_CATALOG': return 'data-catalog';
    case 'APPROVAL_QUEUE': return 'approval-queue';
    case 'REGISTER': return 'submission-form';
    default: return undefined;
  }
}

function processPayload(intent: string, payload: any, allModels: MLModel[], allAgents: AIAgent[], queue: ApprovalRequest[], lastIds: string[]) {
  const findModel = (id: string) => {
    if (!id) return null;
    return allModels.find(m => 
      m.id === id || 
      m.name.toLowerCase() === id.toLowerCase() || 
      m.name.toLowerCase().includes(id.toLowerCase())
    );
  };
  
  if (intent === 'SEARCH' || intent === 'TRENDS') {
    const filters = payload?.filters || {};
    let results = allModels.filter(m => {
      let match = true;
      if (filters.domain && !m.domain.toLowerCase().includes(filters.domain.toLowerCase())) match = false;
      return match;
    });
    return results.slice(0, 6);
  }

  if (['REVENUE_IMPACT', 'MODEL_OWNERSHIP', 'DATA_LINEAGE', 'HYPERPARAMETERS', 'DATA_CATALOG', 'PERFORMANCE_PROFILE'].includes(intent)) {
    const id = payload?.metadata?.modelId || payload?.modelIds?.[0];
    const target = findModel(id) || findModel(lastIds[0]);
    return target || allModels[0];
  }

  if (intent === 'SEARCH_AGENTS') {
    return allAgents.slice(0, 6);
  }

  if (intent === 'APPROVAL_QUEUE') return queue;
  return payload;
}

export default App;
