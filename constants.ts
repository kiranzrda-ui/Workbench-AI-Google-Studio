
import { MLModel, AIAgent, DataSet, AutoMLPlatform, AutoMLExperiment, DataConnector, AuditLog, LineageStep } from './types';

export const DATA_CONNECTORS: DataConnector[] = [
  { id: 'c-1', name: 'Snowflake', status: 'Connected', last_sync: '2m ago', latency_ms: 12, config: { warehouse: 'AURA_COMPUTE_XL', database: 'FIN_PROD', schema: 'GOLD_DATA' } },
  { id: 'c-2', name: 'Alteryx', status: 'Connected', last_sync: '14m ago', latency_ms: 45, config: { endpoint: 'https://alteryx.corp.net', version: '2024.1' } },
  { id: 'c-3', name: 'S3', status: 'Connected', last_sync: 'Real-time', latency_ms: 8, config: { bucket: 'aura-main-lake-us-east-1', encryption: 'AES-256' } }
];

export const AUTOML_PLATFORMS: AutoMLPlatform[] = [
  { id: 'p-1', name: 'Google Vertex AI', provider: 'Google', status: 'Connected', capabilities: ['AutoML', 'Pipelines'], region: 'us-central1' },
  { id: 'p-2', name: 'Azure ML Studio', provider: 'Microsoft', status: 'Connected', capabilities: ['Designer', 'SDK'], region: 'eastus2' },
  { id: 'p-3', name: 'H2O.ai Driverless', provider: 'H2O', status: 'Syncing', capabilities: ['Time Series', 'Auto-Doc'], region: 'on-prem-cluster-01' },
  { id: 'p-4', name: 'Oracle HeatWave', provider: 'Oracle', status: 'Connected', capabilities: ['In-DB AutoML'], region: 'us-ashburn-1' }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'l-1', timestamp: '2024-05-20T10:00:00Z', user: 'Lead_Scientist_01', action: 'Inference Push', platform: 'Vertex AI', status: 'Success' },
  { id: 'l-2', timestamp: '2024-05-20T10:05:00Z', user: 'System_Automaton', action: 'Drift Correction', platform: 'Azure ML', status: 'Success' },
  { id: 'l-3', timestamp: '2024-05-20T10:15:00Z', user: 'Supervisor_Alpha', action: 'Model Approval', platform: 'Aura Core', status: 'Success' }
];

export const MOCK_DATASETS: DataSet[] = [
  { id: 'ds-1', dataset_name: 'Snowflake_Customer_Churn_Gold', format: 'Table', size: '1.2TB', record_count: '45.2M', phi_data: false, domain: 'Retail', source_platform: 'Snowflake' },
  { id: 'ds-2', dataset_name: 'Alteryx_Telemetry_Cleaned', format: 'CSV', size: '450GB', record_count: '1.1B', phi_data: false, domain: 'Manufacturing', source_platform: 'Alteryx' },
  { id: 'ds-3', dataset_name: 'S3_Patient_Records_PHI', format: 'Parquet', size: '85GB', record_count: '12M', phi_data: true, domain: 'Healthcare', source_platform: 'S3' }
];

const generateLineage = (modelName: string): LineageStep[] => [
  { id: 'lin-1', type: 'Source', name: 'Snowflake Raw Ingest', status: 'Active', details: 'Direct secure link to prod schema.' },
  { id: 'lin-2', type: 'Transform', name: 'Alteryx Feature Engineering', status: 'Active', details: 'Workflow 0x882 cleaning job.' },
  { id: 'lin-3', type: 'Storage', name: 'S3 Intermediate Parquet', status: 'Active', details: 'Compressed staging area for AutoML.' },
  { id: 'lin-4', type: 'Model', name: modelName, status: 'Active', details: 'Final production weights & endpoint.' }
];

const knownModels: MLModel[] = [
  {
    id: 'm-optiroute',
    name: 'OptiRoute Logistic Engine',
    model_version: '3.1',
    domain: 'Supply Chain',
    type: 'Classification',
    accuracy: 0.945,
    latency: 22,
    clients: ['LogiCorp Global'],
    use_cases: 'Real-time route optimization for fleet management.',
    contributor: 'Dr. Sarah Chen',
    usage: 12500,
    data_drift: 0.02,
    error_rate: 0.005,
    model_owner_team: 'Logistics Core',
    last_retrained_date: '2024-05-10',
    model_stage: 'Production',
    training_data_source: 'Snowflake.PROD_GOLD',
    approval_status: 'Approved',
    monitoring_status: 'Healthy',
    sla_tier: 'Tier 1',
    revenue_impact: 2400000,
    user_growth: 28,
    hyperparameters: { batch_size: 128, lr: 0.00005, optimizer: 'adamw' },
    lineage: generateLineage('OptiRoute Logistic Engine'),
    data_catalog: MOCK_DATASETS[0],
    cpu_util: 18,
    mem_util: 35,
    throughput: 1250,
    inference_endpoint_id: 'ep-opti-09'
  },
  {
    id: 'm-fraudguard',
    name: 'FraudGuard v4',
    model_version: '4.0.1',
    domain: 'Finance',
    type: 'Classification',
    accuracy: 0.982,
    latency: 12,
    clients: ['SafeBank NA'],
    use_cases: 'Transaction fraud detection at the edge.',
    contributor: 'Marcus Aurelius',
    usage: 500000,
    data_drift: 0.01,
    error_rate: 0.001,
    model_owner_team: 'FinSec Intelligence',
    last_retrained_date: '2024-05-15',
    model_stage: 'Production',
    training_data_source: 'Snowflake.FIN_GOLD',
    approval_status: 'Approved',
    monitoring_status: 'Healthy',
    sla_tier: 'Tier 1',
    revenue_impact: 8500000,
    user_growth: 15,
    hyperparameters: { dropout: 0.2, epochs: 15 },
    lineage: generateLineage('FraudGuard v4'),
    data_catalog: MOCK_DATASETS[1],
    cpu_util: 45,
    mem_util: 60,
    throughput: 8000,
    inference_endpoint_id: 'ep-fg-alpha'
  }
];

export const INITIAL_MODELS: MLModel[] = [
  ...knownModels,
  // Fix: Adding explicit return type MLModel to the map callback to prevent literal type inference mismatch for union properties like model_stage.
  ...Array.from({ length: 143 }).map((_, i): MLModel => {
    const domains = ['Retail', 'Finance', 'Healthcare', 'Tech', 'Supply Chain'];
    const domain = domains[i % domains.length];
    const type = ['Classification', 'Regression', 'NLP'][i % 3];
    const name = `${domain} ${type} Engine v${(i % 5) + 1}`;
    return {
      id: `m-${i + 1}`,
      name,
      model_version: `2.${i % 10}`,
      domain,
      type,
      accuracy: 0.88 + Math.random() * 0.08,
      latency: 15 + Math.floor(Math.random() * 60),
      clients: ['Enterprise_Global'],
      use_cases: 'Mission critical production workload.',
      contributor: `Staff_Scientist_${i % 10}`,
      usage: 5000 + (i * 100),
      data_drift: Math.random() * 0.05,
      error_rate: Math.random() * 0.02,
      model_owner_team: 'Core Intelligence',
      last_retrained_date: '2024-05-18',
      model_stage: 'Production',
      training_data_source: 'Snowflake.PROD_GOLD',
      approval_status: 'Approved',
      monitoring_status: 'Healthy',
      sla_tier: 'Tier 1',
      revenue_impact: 800000 + (i * 15000) + (Math.random() * 50000),
      user_growth: 5 + Math.floor(Math.random() * 30),
      hyperparameters: { batch_size: 64, lr: 0.0001 },
      lineage: generateLineage(name),
      data_catalog: MOCK_DATASETS[i % MOCK_DATASETS.length],
      cpu_util: 32 + (i % 20),
      mem_util: 45,
      throughput: 850 + i
    };
  })
];

export const INITIAL_AGENTS: AIAgent[] = Array.from({ length: 112 }).map((_, i) => ({
  id: `a-${i + 1}`,
  name: `Aura-Agent-${i + 1}`,
  type: i % 2 === 0 ? 'Autonomous' : 'Orchestrator',
  domain: i % 3 === 0 ? 'Supply Chain' : 'Global',
  status: 'Active',
  success_rate: 0.95 + Math.random() * 0.04,
  avg_response_time: 0.5 + Math.random() * 0.5,
  cost_per_exec: 0.001,
  usage_count: 10000,
  description: 'Enterprise reasoning agent for multi-cloud orchestration.',
  owner_team: 'Aura Labs',
  capabilities: ['Tool-Use', 'Planning', 'Governance Audit']
}));
