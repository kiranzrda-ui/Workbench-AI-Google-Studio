
import React, { useState, useEffect } from 'react';
import { Persona, MLModel, AIAgent, ChatMessage, ApprovalRequest, DataSet, AutoMLExperiment, DataConnector, AuditLog, ExternalAsset } from './types';
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
import AutoMLView from './components/AutoMLView';
import SettingsView from './components/SettingsView';
import HealthMonitorView from './components/HealthMonitorView';

type AppView = 'Workspace' | 'Registry' | 'Agents' | 'Governance' | 'Data' | 'AutoML' | 'Settings' | 'Health';

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
  const [datasets, setDatasets] = useState<DataSet[]>(MOCK_DATASETS);
  const [connectors, setConnectors] = useState<DataConnector[]>(DATA_CONNECTORS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleUnlock = () => {
    const today = new Date().toISOString().split('T')[0];
    sessionStorage.setItem('aura_auth_date', today);
    setIsAuthorized(true);
  };

  const handleRegisterModel = (data: Partial<MLModel>) => {
    const newModel: MLModel = {
      ...INITIAL_MODELS[0],
      id: `m-ext-${Date.now()}`,
      name: data.name || 'Untitled Discovery',
      domain: data.domain || 'Retail',
      model_stage: 'Experimental',
      approval_status: 'Pending',
      contributor: 'Aura_Workbench_Ingest',
      last_retrained_date: new Date().toISOString().split('T')[0],
      accuracy: 0.75 + Math.random() * 0.1,
      revenue_impact: 0,
      user_growth: 0
    };
    setModels(prev => [newModel, ...prev]);
    const request: ApprovalRequest = {
      id: `req-${Date.now()}`,
      modelId: newModel.id,
      modelName: newModel.name,
      requester: persona,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    setApprovalQueue(prev => [request, ...prev]);
  };

  const handleApproveModel = (requestId: string) => {
    const request = approvalQueue.find(r => r.id === requestId);
    if (!request) return;
    setModels(prev => prev.map(m => m.id === request.modelId ? { ...m, approval_status: 'Approved', model_stage: 'Staging' } : m));
    setApprovalQueue(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const response = await chatWithAgent(
        updatedMessages.slice(-10).map(m => ({ 
          role: m.role === 'model' ? 'model' : 'user', 
          parts: [{ text: m.content }] 
        })),
        persona,
        models,
        agents
      );

      let metadata: ChatMessage['metadata'] = undefined;
      
      if (response.toolCalls) {
        metadata = { type: 'tool-call-log', data: response.toolCalls };
        
        response.toolCalls.forEach((call: any) => {
          if (call.name === 'trigger_registration_form') metadata!.type = 'submission-form';
          if (call.name === 'fetch_approval_queue') {
            metadata!.type = 'approval-queue';
            metadata!.data = approvalQueue;
          }
          if (call.name === 'search_registry') {
             const args = call.args;
             let results = models;
             if (args.domain) results = results.filter(m => m.domain === args.domain);
             if (args.min_accuracy) results = results.filter(m => m.accuracy >= args.min_accuracy);
             if (args.max_latency) results = results.filter(m => m.latency <= args.max_latency);
             if (args.sensitive_only) results = results.filter(m => m.data_catalog.phi_data);
             if (args.sort_by === 'revenue') results = [...results].sort((a,b) => b.revenue_impact - a.revenue_impact);
             if (args.sort_by === 'growth') results = [...results].sort((a,b) => b.user_growth - a.user_growth);
             
             // Handle comparisons or specific lookups
             if (text.toLowerCase().includes('compare')) {
                metadata!.type = 'comparison';
                metadata!.data = results.slice(0, 2);
             } else if (text.toLowerCase().includes('profile') || text.toLowerCase().includes('shap')) {
                metadata!.type = 'performance-profile';
                metadata!.data = results[0];
             } else if (text.toLowerCase().includes('owner') || text.toLowerCase().includes('access')) {
                metadata!.type = 'model-ownership';
                metadata!.data = results[0];
             } else {
                metadata!.type = 'model-list';
                metadata!.data = results.slice(0, 4);
             }
          }
        });
      }

      const modelMsg: ChatMessage = {
        role: 'model',
        content: response.reply,
        timestamp: new Date(),
        metadata
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Orchestration layer timeout.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isAuthorized) return <Gatekeeper onUnlock={handleUnlock} />;

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-inter">
      <Sidebar persona={persona} setPersona={setPersona} activeView={activeView} setActiveView={setActiveView} stats={{ total: models.length, agents: agents.length, pending: approvalQueue.length, critical: models.filter(m => m.monitoring_status === 'Critical').length }} />
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-600/20 text-white">A</div>
            <h1 className="text-xl font-black tracking-tight">Aura <span className="text-indigo-600 font-light italic">Orchestrator</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <div onClick={() => setActiveView('Health')} className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-white transition-all shadow-sm">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase">Sys-Health: 100%</span>
             </div>
          </div>
        </header>
        {activeView === 'Registry' ? <RegistryView models={models} /> : 
         activeView === 'Agents' ? <AgentHubView agents={agents} /> :
         activeView === 'Governance' ? <GovernanceView models={models} approvalQueue={approvalQueue} auditLogs={auditLogs} /> :
         activeView === 'Data' ? <DataManagementView models={models} connectors={connectors} /> :
         activeView === 'AutoML' ? <AutoMLView datasets={datasets} experiments={[]} models={models} /> :
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
                onImport={(a) => handleRegisterModel({name: a.name})} 
                onRegister={handleRegisterModel}
                onApprove={handleApproveModel}
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
