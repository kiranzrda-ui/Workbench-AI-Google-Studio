
export type Persona = 'Data Scientist' | 'Supervisor';

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
  model_stage: 'Experimental' | 'Staging' | 'Production' | 'Archived';
  training_data_source: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  monitoring_status: 'Healthy' | 'Degraded' | 'Critical';
  sla_tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  feature_store_dependency: string[];
  inference_endpoint_id: string;
  // Calculated business metrics
  revenue_impact: number;
  user_growth: number;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'model-list' | 'comparison' | 'shap' | 'impact' | 'approval-queue' | 'submission-form';
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
