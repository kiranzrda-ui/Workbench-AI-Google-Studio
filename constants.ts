
import { MLModel, AIAgent, DataSet, DataConnector, AuditLog, LineageStep, TransformNode, AutoMLPlatform, FeatureStoreGroup, DataRecipe } from './types';

export const DATA_CONNECTORS: DataConnector[] = [
  { id: 'c-1', name: 'Snowflake Production', type: 'IAM', status: 'Connected', last_sync: '2m ago', latency_ms: 12, endpoint: 'sfc-prod-01.snowflakecomputing.com', config: { role: 'ML_ENGINEER', warehouse: 'AURA_COMPUTE' } },
  { id: 'c-2', name: 'Alteryx API Gateway', type: 'REST', status: 'Connected', last_sync: '14m ago', latency_ms: 45, endpoint: 'https://api.alteryx.enterprise.net', config: { version: 'v2' } },
  { id: 'c-3', name: 'Legacy S3 Bucket', type: 'IAM', status: 'Error', last_sync: '1h ago', latency_ms: 0, endpoint: 's3://enterprise-data-lake-archived', config: { region: 'us-east-1' } }
];

export const TRANSFORM_NODES: TransformNode[] = [
  { id: 'n1', type: 'Source', label: 'Raw Ingest', pos: { x: 50, y: 150 } },
  { id: 'n2', type: 'Cleanse', label: 'Quality Guard', pos: { x: 250, y: 150 } },
  { id: 'n3', type: 'Filter', label: 'Domain Filter', pos: { x: 450, y: 150 } },
  { id: 'n4', type: 'Destination', label: 'Training Egress', pos: { x: 650, y: 150 } }
];

const domains = ['Retail', 'Finance', 'Healthcare', 'Tech', 'Supply Chain'];

const domainTerms: Record<string, string[]> = {
  Retail: ['Customer Churn', 'Inventory Rebalance', 'Sentiment Analysis', 'Price Optimization', 'Affinity Scoring', 'Returns Predictor', 'Flash Sale Forecaster'],
  Finance: ['Credit Scoring', 'Fraud Detection', 'Market Volatility', 'Portfolio Risk', 'LTV Predictor', 'AML Screening', 'Option Pricing Engine'],
  Healthcare: ['Readmission Risk', 'Patient Triage', 'Genomic Sequence', 'Claim Denials', 'Vital Signs Hub', 'Clinical Trial Matcher', 'Radiology AI'],
  Tech: ['Latency Guard', 'Log Anomaly', 'Bot Traffic', 'API Health', 'Edge Compression', 'Infrastructure Drift', 'Resource Allocator'],
  'Supply Chain': ['Route Optimizer', 'Last Mile Dispatch', 'Warehouse Binning', 'Transit Risk', 'Supplier Reliability', 'Demand Shifting', 'Vessel ETA']
};

const platforms: ('Snowflake' | 'Alteryx' | 'S3' | 'Local')[] = ['Snowflake', 'Alteryx', 'S3', 'Local'];

// 110+ UNIQUE DATASETS
export const MOCK_DATASETS: DataSet[] = Array.from({ length: 115 }).map((_, i) => {
  const domain = domains[i % domains.length];
  const term = domainTerms[domain][i % domainTerms[domain].length];
  return {
    id: `ds-${i + 1}`,
    dataset_name: `${term.replace(/ /g, '_')}_Gold_Set_${Math.floor(i / domains.length) + 1}`,
    format: i % 3 === 0 ? 'Table' : i % 3 === 1 ? 'Parquet' : 'Avro',
    size: `${(Math.random() * 800 + 10).toFixed(1)}GB`,
    record_count: `${(Math.random() * 200 + 1).toFixed(1)}M`,
    phi_data: i % 8 === 0,
    domain,
    source_platform: platforms[i % platforms.length],
    columns: [
      { name: 'UUID_KEY', type: 'STRING', pii: false, mean: 0, skew: 0 },
      { name: 'NORMALIZED_VAL', type: 'FLOAT64', pii: false, mean: 45, skew: 1.2 },
      { name: 'PROTECTED_ID', type: 'STRING', pii: true, mean: 0, skew: 0 }
    ]
  };
});

// 105+ UNIQUE FEATURE STORE GROUPS
export const FEATURE_STORE_DATA: FeatureStoreGroup[] = Array.from({ length: 108 }).map((_, i) => {
  const domain = domains[i % domains.length];
  const term = domainTerms[domain][(i + 2) % domainTerms[domain].length];
  const tiers: ('Gold' | 'Silver' | 'Bronze')[] = ['Gold', 'Silver', 'Bronze'];
  return {
    id: `fs-${i + 1}`,
    name: `${term.split(' ')[0]}_Vectors_${tiers[i % 3]}`,
    domain,
    feature_count: Math.floor(Math.random() * 450) + 12,
    last_updated: `${Math.floor(Math.random() * 48)}h ago`,
    tier: tiers[i % 3],
    owner: `engineer_${(i % 14) + 1}`
  };
});

// 102+ UNIQUE DATA RECIPES
export const DATA_RECIPES: DataRecipe[] = Array.from({ length: 105 }).map((_, i) => {
  const domain = domains[i % domains.length];
  const term = domainTerms[domain][(i + 4) % domainTerms[domain].length];
  const complexities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  return {
    id: `recipe-${i + 1}`,
    name: `${term} Cleanup Logic`,
    description: `Specific ETL procedure to handle ${term.toLowerCase()} edge cases and domain-specific outliers.`,
    domain,
    complexity: complexities[i % 3],
    execution_time: `${Math.floor(Math.random() * 120) + 2}m`,
    is_blueprint: i % 5 === 0,
    owner: `arch_${(i % 9) + 1}`
  };
});

const generateLineage = (modelName: string): LineageStep[] => [
  { id: `lin-${Math.random()}`, type: 'Source', name: 'Raw Enterprise Stream', status: 'Active', details: 'Authenticated ingestion from core backbone.' },
  { id: `lin-${Math.random()}`, type: 'Transform', name: 'Domain Logic Mapping', status: 'Active', details: 'Applying recipe-based sanitization.' },
  { id: `lin-${Math.random()}`, type: 'Storage', name: 'In-Memory Cache', status: 'Active', details: 'Low-latency sharded cluster.' },
  { id: `lin-${Math.random()}`, type: 'Model', name: modelName, status: 'Active', details: 'Production-ready serialized weights.' }
];

// 150+ UNIQUE MODELS
export const INITIAL_MODELS: MLModel[] = Array.from({ length: 155 }).map((_, i) => {
  const domain = domains[i % domains.length];
  const term = domainTerms[domain][(i + 1) % domainTerms[domain].length];
  return {
    id: `m-aura-${i + 1}`,
    name: `${term} Predictor`,
    model_version: `${(i % 5) + 1}.${i % 10}.${Math.floor(Math.random() * 100)}`,
    domain,
    type: i % 3 === 0 ? 'Classification' : i % 3 === 1 ? 'Regression' : 'Clustering',
    accuracy: 0.78 + Math.random() * 0.21,
    latency: 5 + Math.floor(Math.random() * 200),
    clients: [`Client_Group_${(i % 20) + 1}`],
    use_cases: `Real-time handling of ${term.toLowerCase()} requests across edge regions.`,
    contributor: `Scientist_${(i % 25) + 1}`,
    usage: 500 + (i * 1200),
    data_drift: Math.random() * 0.12,
    error_rate: Math.random() * 0.05,
    model_owner_team: `${domain} Intel Lab`,
    last_retrained_date: '2024-05-20',
    model_stage: i % 4 === 0 ? 'Production' : i % 4 === 1 ? 'Staging' : 'Experimental',
    training_data_source: `Internal_Repo_${domain.substring(0,3).toUpperCase()}`,
    approval_status: 'Approved',
    monitoring_status: i % 25 === 0 ? 'Critical' : i % 18 === 0 ? 'Degraded' : 'Healthy',
    sla_tier: i % 3 === 0 ? 'Tier 1' : 'Tier 2',
    revenue_impact: 200000 + (Math.random() * 5000000),
    user_growth: Math.floor(Math.random() * 60),
    hyperparameters: { batch_size: 128, optimizer: 'adam', lr: 0.0001 },
    lineage: generateLineage(`${term} Engine`),
    data_catalog: MOCK_DATASETS[i % MOCK_DATASETS.length],
    cpu_util: 10 + Math.floor(Math.random() * 80),
    mem_util: 10 + Math.floor(Math.random() * 80),
    throughput: 100 + (i * 50),
    inference_endpoint_id: `ep-node-${1000 + i}`
  };
});

// 100+ UNIQUE AGENTS
export const INITIAL_AGENTS: AIAgent[] = Array.from({ length: 102 }).map((_, i) => ({
  id: `agent-${i + 1}`,
  name: `${domains[i % domains.length].substring(0, 3)}-Orchestrator-${i + 1}`,
  type: i % 2 === 0 ? 'Autonomous' : 'Supervisor',
  domain: domains[i % domains.length],
  status: 'Active',
  success_rate: 0.92 + Math.random() * 0.07,
  avg_response_time: 0.1 + Math.random() * 1.4,
  cost_per_exec: 0.001 * (i + 1),
  usage_count: 1000 + (i * 1000),
  description: `Specialized agent managing ${domainTerms[domains[i % domains.length]][0].toLowerCase()} pipelines.`,
  owner_team: 'Companion Labs Core',
  capabilities: ['Tool-Use', 'Multi-Hop Reasoning', 'Audit Handshake']
}));

export const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `log-${i + 1}`,
  timestamp: new Date().toISOString(),
  user: `operator_${(i % 10) + 1}`,
  action: ['Deployment', 'Scale-up', 'Permission Grant', 'Retraining Job'][i % 4],
  platform: ['Aura Core', 'Edge Node B', 'Cloud Gateway'][i % 3],
  status: 'Success'
}));

export const AUTOML_PLATFORMS: AutoMLPlatform[] = [
  { id: 'p-1', name: 'Vertex AI', provider: 'Google', status: 'Available' },
  { id: 'p-2', name: 'Azure ML', provider: 'Azure', status: 'Available' },
  { id: 'p-3', name: 'SageMaker', provider: 'AWS', status: 'Available' },
  { id: 'p-4', name: 'Snowflake Cortex', provider: 'Snowflake', status: 'Available' }
];
