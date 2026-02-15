
import React, { useState, useEffect } from 'react';
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
import DataManagementView from './components/DataManagementView';
import TrainingHubView from './components/TrainingHubView';
import SettingsView from './components/SettingsView';
import HealthMonitorView from './components/HealthMonitorView';

type AppView = 'Companion' | 'Registry' | 'Agents' | 'Governance' | 'Data' | 'Training' | 'Settings' | 'Health';

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
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleUnlock = () => {
    const today = new Date().toISOString().split('T')[0];
    sessionStorage.setItem('aura_auth_date', today);
    setIsAuthorized(true);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const response = await chatWithAgent(
        updatedMessages.slice(-12).map(m => ({ 
          role: m.role === 'model' ? 'model' : 'user', 
          parts: [{ text: m.content }] 
        })),
        persona,
        models,
        agents
      );

      let metadata: ChatMessage['metadata'] = undefined;
      
      if (response.toolCalls) {
        response.toolCalls.forEach((call: any) => {
          if (call.name === 'search_registry') {
            const args = call.args as any;
            let results = [...models];
            
            if (args.domain) {
              results = results.filter(m => m.domain.toLowerCase().includes(args.domain.toLowerCase()));
            }
            if (args.min_accuracy) {
              results = results.filter(m => m.accuracy >= args.min_accuracy);
            }
            
            // Critical: Ensure growth sorting is applied if requested or implied
            if (args.sort_by === 'growth' || text.toLowerCase().includes('growth')) {
              results.sort((a, b) => b.user_growth - a.user_growth);
            } else if (args.sort_by === 'accuracy') {
              results.sort((a, b) => b.accuracy - a.accuracy);
            }

            metadata = { type: 'model-list', data: results.slice(0, 4) };
          }

          if (call.name === 'search_agents') {
            const args = call.args as any;
            let results = [...agents];
            if (args.domain) {
              results = results.filter(a => a.domain.toLowerCase().includes(args.domain.toLowerCase()));
            }
            metadata = { type: 'agent-list', data: results.slice(0, 4) };
          }

          if (call.name === 'open_registration_form') {
            const args = call.args as any;
            metadata = { 
              type: 'model-form', 
              data: { name: args.name || '', domain: args.domain || 'Tech' } 
            };
          }

          if (call.name === 'compare_models') {
            const args = call.args as any;
            const namesToFind = args.model_names || [];
            const results = models.filter(m => 
              namesToFind.some((n: string) => m.name.toLowerCase().includes(n.toLowerCase()))
            );
            metadata = { type: 'comparison', data: results };
          }
        });
      }

      const modelMsg: ChatMessage = { role: 'model', content: response.reply, timestamp: new Date(), metadata };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, my neural pathways are slightly congested. Shall we try that query again?", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegister = (data: Partial<MLModel>) => {
    // Mock registration logic
    const newModel: MLModel = {
      ...INITIAL_MODELS[0],
      id: `m-new-${Date.now()}`,
      name: data.name || 'New Model',
      domain: data.domain || 'Tech',
      model_stage: 'Experimental',
      approval_status: 'Pending'
    };
    setModels([newModel, ...models]);
  };

  if (!isAuthorized) return <Gatekeeper onUnlock={handleUnlock} />;

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-inter">
      <Sidebar 
        persona={persona} 
        setPersona={setPersona} 
        activeView={activeView} 
        setActiveView={setActiveView} 
        stats={{ 
          total: models.length, 
          agents: agents.length, 
          pending: approvalQueue.length, 
          critical: models.filter(m => m.monitoring_status === 'Critical').length 
        }} 
      />
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-500/20 text-white">A</div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Aura <span className="text-purple-500 font-light italic">Companion</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <div onClick={() => setActiveView('Health')} className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-white transition-all shadow-sm">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase">Aura Active</span>
             </div>
          </div>
        </header>

        {activeView === 'Registry' ? <RegistryView models={models} /> : 
         activeView === 'Agents' ? <AgentHubView agents={agents} /> :
         activeView === 'Governance' ? <GovernanceView models={models} approvalQueue={approvalQueue} auditLogs={MOCK_AUDIT_LOGS} /> :
         activeView === 'Data' ? <DataManagementView models={models} connectors={connectors} /> :
         activeView === 'Training' ? <TrainingHubView datasets={datasets} models={models} /> :
         activeView === 'Settings' ? <SettingsView connectors={connectors} /> :
         activeView === 'Health' ? <HealthMonitorView connectors={connectors} models={models} /> :
         (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col border-r border-slate-200">
              <ChatWindow 
                messages={messages} 
                onSend={handleSendMessage} 
                isTyping={isTyping} 
                persona={persona} 
                onImport={() => {}} 
                onRegister={handleRegister}
                onApprove={() => {}}
              />
            </div>
            <div className="hidden lg:block w-96 xl:w-[450px] bg-slate-50 overflow-y-auto p-4 space-y-4">
               <ModelVisuals models={models} persona={persona} />
            </div>
          </div>
         )}
      </main>
    </div>
  );
};

export default App;
