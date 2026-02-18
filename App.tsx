
import React, { useState } from 'react';
import { Persona, MLModel, AIAgent, ChatMessage, ApprovalRequest, DataSet, DataConnector } from './types';
import { INITIAL_MODELS, INITIAL_AGENTS, MOCK_DATASETS, DATA_CONNECTORS, MOCK_AUDIT_LOGS } from './constants';
import { chatWithAgent } from './geminiService';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import ModelVisuals from './components/ModelVisuals';
import Gatekeeper from './components/Gatekeeper';
import RegistryView from './components/RegistryView';
import AgentHubView from './components/AgentHubView';
import GovernanceView from './components/GovernanceView';
import DataCatalogView from './components/DataCatalogView';
import TrainingHubView from './components/TrainingHubView';
import VisualTransformationView from './components/DataManagement/VisualTransformationView';
import SpecialisedPrepView from './components/DataManagement/SpecialisedPrepView';
import VisualExplorerView from './components/DataManagement/VisualExplorerView';
import DataConnectivityView from './components/DataManagement/DataConnectivityView';
import DataRecipesView from './components/DataRecipesView';
import ModelTestBenchView from './components/ModelTestBenchView';
import ModelManagementHub from './components/ModelManagement/ModelManagementHub';

export type AppView = 
  | 'Companion' 
  | 'Registry' | 'Optimizer' | 'Catalog' | 'Recipes' | 'TestBench' 
  | 'Mgmt_Engine' | 'Mgmt_Visualizer' | 'Mgmt_Diagnostics' | 'Mgmt_XAI'
  | 'VisualTransform' | 'SpecialPrep' | 'VisualExplorer' | 'Connectivity'
  | 'Agents' | 'Governance' | 'Health';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    const authDate = sessionStorage.getItem('aura_auth_date');
    const today = new Date().toISOString().split('T')[0];
    return authDate === today;
  });

  const [persona, setPersona] = useState<Persona>('Data Scientist');
  const [activeView, setActiveView] = useState<AppView>('Companion');
  const [models, setModels] = useState<MLModel[]>(INITIAL_MODELS);
  const [agents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [datasets] = useState<DataSet[]>(MOCK_DATASETS);
  const [connectors] = useState<DataConnector[]>(DATA_CONNECTORS);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([
    { id: 'app-01', modelId: 'm-fraudguard', modelName: 'FraudGuard v4', requester: 'Marcus Aurelius', timestamp: new Date().toISOString(), status: 'Pending' }
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleUnlock = () => {
    sessionStorage.setItem('aura_auth_date', new Date().toISOString().split('T')[0]);
    setIsAuthorized(true);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const history = updatedMessages.filter(m => m.role !== 'system').map(m => ({ 
        role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model', 
        parts: [{ text: m.content }] 
      }));

      const response = await chatWithAgent(history.slice(-10), persona, models, agents);
      const modelMsg: ChatMessage = { role: 'model', content: response.reply, timestamp: new Date(), metadata: { toolCalls: response.toolCalls } };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isAuthorized) return <Gatekeeper onUnlock={handleUnlock} />;

  const renderView = () => {
    if (activeView.startsWith('Mgmt_')) {
      const tabMap: Record<string, 'Engine' | 'Visualizer' | 'Diagnostics' | 'XAI'> = {
        Mgmt_Engine: 'Engine',
        Mgmt_Visualizer: 'Visualizer',
        Mgmt_Diagnostics: 'Diagnostics',
        Mgmt_XAI: 'XAI'
      };
      return <ModelManagementHub models={models} datasets={datasets} initialTab={tabMap[activeView]} />;
    }

    switch (activeView) {
      case 'Registry': return <RegistryView models={models} />;
      case 'Optimizer': return <TrainingHubView datasets={datasets} models={models} />;
      case 'Catalog': return <DataCatalogView models={models} connectors={connectors} />;
      case 'Recipes': return <DataRecipesView />;
      case 'TestBench': return <ModelTestBenchView models={models} datasets={datasets} />;
      case 'VisualTransform': return <VisualTransformationView />;
      case 'SpecialPrep': return <SpecialisedPrepView datasets={datasets} />;
      case 'VisualExplorer': return <VisualExplorerView />;
      case 'Connectivity': return <DataConnectivityView connectors={connectors} />;
      case 'Agents': return <AgentHubView agents={agents} />;
      case 'Governance': return <GovernanceView models={models} approvalQueue={approvalQueue} auditLogs={MOCK_AUDIT_LOGS} />;
      default: return (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col border-r border-slate-200">
            <ChatWindow messages={messages} onSend={handleSendMessage} isTyping={isTyping} persona={persona} onImport={() => {}} onRegister={() => {}} onApprove={() => {}} />
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
      <Sidebar 
        persona={persona} 
        setPersona={setPersona} 
        activeView={activeView} 
        setActiveView={setActiveView} 
        stats={{ total: models.length, agents: agents.length, pending: approvalQueue.length, critical: models.filter(m => m.monitoring_status === 'Critical').length }} 
      />
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center font-bold text-lg text-white">W</div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">AI Workbench <span className="text-purple-500 font-light italic">v3.0</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase">Engine Status: Optimal</span>
             </div>
          </div>
        </header>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
