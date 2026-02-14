
export type Persona = 'Data Scientist' | 'Supervisor';

export interface Hyperparameters {
  [key: string]: string | number | boolean;
}

export interface LineageStep {
  id: string;
  type: 'Source' | 'Transform' | 'Storage' | 'Model';
  name: string;
  status: 'Syncing' | 'Stale' | 'Active';
  details: string;
}

export interface MLModel {
  id: string;
  name: string;
  model_version: string;
  domain: 'Retail' | 'Finance' | 'Healthcare' | 'Manufacturing' | 'Tech' | 'HR' | 'Supply Chain' | 'Legal' | 'Marketing' | 'Sales';
  type: 'Regression' | 'Classification' | 'NLP' | 'Computer Vision' | 'Recommendation';
  accuracy: number;
  latency: number; // ms
  clients: string[];
  use_cases: string;
  description?: string;
  contributor: string;
  usage: number; // requests/min
  data_drift: number;
  pred_drift: number;
  cpu_util: number;
  mem_util: number;
  throughput: number;
  error_rate: number;
  model_owner_team: string;
  last_retrained_date: string;
  retraining_history?: string[];
  model_stage: 'Experimental' | 'Staging' | 'Production' | 'Archived';
  training_data_source: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  monitoring_status: 'Healthy' | 'Degraded' | 'Critical';
  sla_tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  feature_store_dependency: string[];
  inference_endpoint_id: string;
  revenue_impact: number;
  user_growth: number;
  hyperparameters: Hyperparameters;
  lineage: LineageStep[];
  data_catalog: {
    dataset_name: string;
    format: string;
    size: string;
    record_count: string;
    phi_data: boolean;
  };
}

export interface AIAgent {
  id: string;
  name: string;
  type: 'Autonomous' | 'Task-Specific' | 'RAG' | 'Orchestrator';
  domain: string;
  status: 'Active' | 'Idle' | 'Error';
  success_rate: number;
  avg_response_time: number; // seconds
  cost_per_exec: number;
  usage_count: number;
  description: string;
  owner_team: string;
  capabilities: string[];
}

export interface ExternalAsset {
  id: string;
  name: string;
  source: 'HuggingFace' | 'Azure AI' | 'AWS Bedrock' | 'Google Vertex';
  type: 'Model' | 'Agent';
  domain: string;
  metrics: {
    accuracy?: number;
    success_rate?: number;
  };
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'model-list' | 'agent-list' | 'comparison' | 'performance-profile' | 'shap' | 'impact' | 'approval-queue' | 'submission-form' | 'scan-results' | 'revenue-impact' | 'model-ownership' | 'data-lineage' | 'hyperparams' | 'data-catalog';
    data?: any;
  };
}

export interface ApprovalRequest {
  id: string;
  modelId: string;
  modelName: string;
  requester: string;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}
