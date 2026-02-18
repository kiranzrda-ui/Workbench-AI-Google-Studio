
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

export type TrainingAction = 'Reinforcement Learning' | 'Fine-Tuning' | 'Weight Distillation' | 'Hyper-Parameter Optimization' | 'First-Light Training';

export interface AIAgent {
  id: string;
  name: string;
  type: string;
  domain: string;
  status: 'Active' | 'Idle' | 'Error';
  success_rate: number;
  avg_response_time: number;
  cost_per_exec: number;
  token_usage_avg: number;
  human_transfer_rate: number;
  tool_usage_accuracy: number;
  usage_count: number;
  description: string;
  owner_team: string;
  capabilities: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  platform: string;
  status: string;
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
}

export interface DataColumn {
  name: string;
  type: string;
  pii: boolean;
  mean: number;
  skew: number;
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
  columns?: DataColumn[];
}

export interface FeatureStoreGroup {
  id: string;
  name: string;
  domain: string;
  feature_count: number;
  last_updated: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  owner: string;
}

export interface DataRecipe {
  id: string;
  name: string;
  description: string;
  domain: string;
  complexity: 'Low' | 'Medium' | 'High';
  execution_time: string;
  is_blueprint: boolean;
  owner: string;
}

export interface ExperimentResult {
  id: string;
  model_id: string;
  timestamp: string;
  volume: 'Small' | 'Large' | 'Enterprise';
  accuracy: number;
  f1_score: number;
  inference_time: string;
  features_used: string[];
}

export interface DataConnector {
  id: string;
  name: string;
  type: 'IAM' | 'REST' | 'JDBC';
  status: 'Connected' | 'Disconnected' | 'Error';
  last_sync: string;
  latency_ms: number;
  endpoint: string;
  config: Record<string, string>;
}

export interface TransformNode {
  id: string;
  type: 'Source' | 'Filter' | 'Map' | 'Aggregate' | 'Cleanse' | 'Destination';
  label: string;
  pos: { x: number; y: number };
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

export interface AutoMLExperiment {
  id: string;
  name: string;
  platform: string;
  status: 'Running' | 'Complete' | 'Failed';
  accuracy: number;
  timestamp: string;
}

export interface AutoMLPlatform {
  id: string;
  name: string;
  provider: 'Google' | 'Azure' | 'AWS' | 'Snowflake';
  status: 'Available' | 'Maintenance';
}
