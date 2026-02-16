
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

/** 
 * AURA WORKBENCH - demo_version_1
 * Agentic ML Governance & Orchestration
 */

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
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([
    { id: 'app-01', modelId: 'm-fraudguard', modelName: 'FraudGuard v4', requester: 'Marcus Aurelius', timestamp: new Date().toISOString(), status: 'Pending' }
  ]);
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
      // Clean history for Gemini: No system messages, strictly alternating user/model roles.
      const history = updatedMessages
        .filter(m => m.role !== 'system')
        .map(m => ({ 
          role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model', 
          parts: [{ text: m.content }] 
        }));

      const response = await chatWithAgent(
        history.slice(-20),
        persona,
        models,
        agents
      );

      let metadata: ChatMessage['metadata'] = undefined;
      const lowerText = text.toLowerCase();
      const lowerReply = response.reply.toLowerCase();

      // Detection for Graphical Tiles
      const targetModel = models.find(m => {
        const nameLower = m.name.toLowerCase();
        return lowerText.includes(nameLower) || lowerReply.includes(nameLower) ||
               (lowerText.includes(m.id.toLowerCase())) ||
               messages.some(prev => prev.content.toLowerCase().includes(nameLower));
      });

      if (lowerText.includes('detail') || lowerText.includes('metric') || lowerText.includes('stats') || lowerText.includes('performance') || lowerText.includes('shap') || lowerText.includes('radar')) {
        if (targetModel) {
          metadata = { type: 'model-detail-tile', data: targetModel };
        }
      } 
      else if (lowerText.includes('owner') || lowerText.includes('endpoint') || lowerText.includes('access')) {
        if (targetModel) {
          metadata = { type: 'owner-details', data: targetModel };
        }
      }
      else if (lowerText.includes('revenue') || lowerText.includes('impact') || lowerText.includes('making') || lowerText.includes('financial')) {
        if (targetModel) {
          metadata = { type: 'revenue-impact', data: targetModel };
        }
      }

      if (response.toolCalls && !metadata) {
        response.toolCalls.forEach((call: any) => {
          if (call.name === 'search_registry') {
            const args = call.args as any;
            let results = [...models];
            if (args.domain) results = results.filter(m => m.domain.toLowerCase().includes(args.domain.toLowerCase()));
            if (args.min_accuracy) results = results.filter(m => m.accuracy >= args.min_accuracy);
            metadata = { type: 'model-list', data: results.slice(0, 3) };
          }
          if (call.name === 'open_registration_form') {
            const args = call.args as any;
            metadata = { type: 'model-form', data: { name: args.name || '', domain: args.domain || 'Tech' } };
          }
          if (call.name === 'view_approval_queue') {
            metadata = { type: 'approval-queue', data: approvalQueue.filter(a => a.status === 'Pending') };
          }
        });
      }

      const modelMsg: ChatMessage = { role: 'model', content: response.reply, timestamp: new Date(), metadata };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Aura Logic Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "My reasoning engine is currently out of sync with the enterprise registry. [Aura Suggestion]:: Should I re-index the asset metadata?", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegister = (data: Partial<MLModel>) => {
    const newId = `m-new-${Date.now()}`;
    const newModel: MLModel = {
      ...INITIAL_MODELS[0],
      id: newId,
      name: data.name || 'New Model',
      domain: data.domain || 'Tech',
      model_stage: 'Experimental',
      approval_status: 'Pending',
      user_growth: 0,
      accuracy: 0.85 + (Math.random() * 0.1),
      latency: 20 + (Math.random() * 50),
      revenue_impact: 0,
      contributor: 'Admin_Dev',
      hyperparameters: { batch_size: 32, lr: 0.001, optimizer: 'adam' },
      cpu_util: 10,
      mem_util: 15,
      throughput: 100,
      monitoring_status: 'Healthy',
      lineage: INITIAL_MODELS[0].lineage,
      data_catalog: INITIAL_MODELS[0].data_catalog
    };
    
    setModels(prev => [newModel, ...prev]);

    const newReq: ApprovalRequest = {
      id: `app-${Date.now()}`,
      modelId: newId,
      modelName: newModel.name,
      requester: 'Admin_Dev',
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    setApprovalQueue(prev => [newReq, ...prev]);

    const systemAck: ChatMessage = { 
      role: 'model', 
      content: `Asset '${newModel.name}' successfully integrated into the enterprise staging registry. It is indexed and searchable. [Aura Suggestion]:: Would you like me to open the Governance Hub to review the approval queue?`, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, systemAck]);
  };

  const handleApprove = (id: string) => {
    const appRequest = approvalQueue.find(a => a.id === id);
    if (!appRequest) return;

    setModels(prev => prev.map(m => m.id === appRequest.modelId ? { ...m, approval_status: 'Approved', model_stage: 'Staging' } : m));
    setApprovalQueue(prev => prev.filter(a => a.id !== id));

    const systemAck: ChatMessage = { 
      role: 'model', 
      content: `Authorization protocol successful. Asset '${appRequest.modelName}' has been elevated to Staging. [Aura Suggestion]:: Shall we verify its performance against production baselines in the Training Forge?`, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, systemAck]);
  };

  if (!isAuthorized) return <Gatekeeper onUnlock={handleUnlock} />;

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
         activeView === 'Governance' ? <GovernanceView models={models} approvalQueue={approvalQueue} auditLogs={MOCK_AUDIT_LOGS} onApprove={handleApprove} /> :
         activeView === 'Data' ? <DataManagementView models={models} connectors={connectors} /> :
         activeView === 'Training' ? <TrainingHubView datasets={datasets} models={models} onApprove={handleApprove} approvalQueue={approvalQueue} /> :
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
                onApprove={handleApprove}
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
