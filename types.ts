
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
  domain: string;
  type: string;
  accuracy: number;
  latency: number; 
  clients: string[];
  use_cases: string;
  contributor: string;
  usage: number; 
  data_drift: number;
  error_rate: number;
  model_owner_team: string;
  last_retrained_date: string;
  model_stage: 'Experimental' | 'Staging' | 'Production' | 'Archived';
  training_data_source: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  monitoring_status: 'Healthy' | 'Degraded' | 'Critical';
  sla_tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  revenue_impact: number;
  user_growth: number;
  hyperparameters: Hyperparameters;
  lineage: LineageStep[];
  data_catalog: DataSet;
  cpu_util: number;
  mem_util: number;
  throughput: number;
  inference_endpoint_id?: string;
  retraining_history?: string[];
}

export interface DataSet {
  id: string;
  dataset_name: string;
  format: string;
  size: string;
  record_count: string;
  phi_data: boolean;
  domain: string;
  source_platform: 'Snowflake' | 'Alteryx' | 'S3' | 'Local';
}

export interface DataConnector {
  id: string;
  name: 'Snowflake' | 'Alteryx' | 'S3' | 'Databricks';
  status: 'Connected' | 'Disconnected' | 'Error';
  last_sync: string;
  latency_ms: number;
  config: Record<string, string>;
}

export interface AutoMLPlatform {
  id: string;
  name: string;
  provider: 'Google' | 'Microsoft' | 'H2O' | 'Oracle';
  status: 'Connected' | 'Disconnected' | 'Syncing';
  capabilities: string[];
  region: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  platform: string;
  status: 'Success' | 'Failed' | 'Pending';
}

export interface AutoMLExperiment {
  id: string;
  name: string;
  status: 'Preprocessing' | 'Feature Engineering' | 'Training' | 'Tuning' | 'Ensembling' | 'Complete';
  progress: number;
  platform: string;
  datasetId: string;
  task: string;
  leaderboard: {
    model: string;
    score: number;
    latency: string;
  }[];
}

export interface AIAgent {
  id: string;
  name: string;
  type: string;
  domain: string;
  status: 'Active' | 'Idle' | 'Error';
  success_rate: number;
  avg_response_time: number;
  cost_per_exec: number;
  usage_count: number;
  description: string;
  owner_team: string;
  capabilities: string[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: string;
    data?: any;
    toolCalls?: any[];
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

export interface ExternalAsset {
  id: string;
  name: string;
  source: 'HuggingFace' | 'Azure AI' | 'Bedrock';
  description: string;
}
