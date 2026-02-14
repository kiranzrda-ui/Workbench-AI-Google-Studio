
import { MLModel, AIAgent, LineageStep, Hyperparameters } from './types';

const ENTERPRISE_MODEL_TEMPLATES = [
  { name: "FraudGuard: Real-time Transaction Scorer", domain: "Finance", type: "Classification", team: "FinSec AI Ops" },
  { name: "SupplySense: Regional Demand Forecaster", domain: "Retail", type: "Regression", team: "Supply Chain Intelligence" },
  { name: "Customer360: LTV Prediction Engine", domain: "Retail", type: "Regression", team: "Marketing Analytics" },
  { name: "DeepScan: MRI Anomaly Detection", domain: "Healthcare", type: "Computer Vision", team: "Medical Imaging Core" },
  { name: "YieldMaster: Precision Crop Forecast", domain: "Manufacturing", type: "Regression", team: "AgriTech Solutions" },
  { name: "OptiRoute: Logistics Path Finder", domain: "Supply Chain", type: "Recommendation", team: "Logistics Optimization" },
  { name: "SupportBot: Multilingual Sentiment Analyzer", domain: "Tech", type: "NLP", team: "Customer Success Tech" },
  { name: "CreditRisk: Commercial Loan Scorer", domain: "Finance", type: "Classification", team: "Risk Management" },
  { name: "TalentScout: Candidate Match Engine", domain: "HR", type: "Recommendation", team: "HR Tech AI" },
  { name: "RetentionPredictor: Employee Churn Model", domain: "HR", type: "Classification", team: "People Analytics" },
  { name: "InventorySync: Global Stock Optimizer", domain: "Supply Chain", type: "Recommendation", team: "Inventory Control" },
  { name: "RouteGenius: Fleet Fuel Optimizer", domain: "Supply Chain", type: "Regression", team: "Last Mile Logistics" },
  { name: "LegalBrief: Clause Extraction Agent", domain: "Legal", type: "NLP", team: "Legal Ops Tech" },
  { name: "ComplianceMonitor: Regulatory Change Detector", domain: "Legal", type: "Classification", team: "Risk & Compliance" },
  { name: "AdTarget: Real-time Bid Optimizer", domain: "Marketing", type: "Recommendation", team: "AdTech Services" },
  { name: "CampaignLift: Incrementality Scorer", domain: "Marketing", type: "Regression", team: "Growth Analytics" },
  { name: "SalesPipeline: Opportunity Win Scorer", domain: "Sales", type: "Classification", team: "Revenue Ops" },
  { name: "LeadNurture: Optimal Contact Time", domain: "Sales", type: "Recommendation", team: "B2B Sales Intelligence" },
  { name: "ChurnRadar: Subscription Retention Model", domain: "Tech", type: "Classification", team: "Growth Engineering" },
  { name: "PredictiveMaintainer: Turbine Health", domain: "Manufacturing", type: "Regression", team: "Industrial IoT" },
  { name: "MarketPulse: High-Frequency Sentiment", domain: "Finance", type: "NLP", team: "Trading Algorithms" },
  { name: "PatientFlow: Bed Capacity Predictor", domain: "Healthcare", type: "Regression", team: "Hospital Operations" },
  { name: "CodeAssist: Internal Python Linter", domain: "Tech", type: "NLP", team: "Developer Productivity" },
  { name: "WorkforcePlanner: Seasonal Demand Match", domain: "HR", type: "Regression", team: "People Operations" },
  { name: "ContractAI: Risk Exposure Profiler", domain: "Legal", type: "Regression", team: "General Counsel AI" },
  { name: "VisualQC: Assembly Line Defect Detector", domain: "Manufacturing", type: "Computer Vision", team: "Smart Factory" }
];

const domains = ['Retail', 'Finance', 'Healthcare', 'Manufacturing', 'Tech', 'HR', 'Supply Chain', 'Legal', 'Marketing', 'Sales'] as const;
const stages = ['Experimental', 'Staging', 'Production'] as const;
const types = ['Regression', 'Classification', 'NLP', 'Computer Vision', 'Recommendation'] as const;

// Fix: Added explicit return type Hyperparameters and changed image_size from number[] to string 
// to ensure the return type matches the index signature string | number | boolean.
function generateParams(type: string): Hyperparameters {
  switch (type) {
    case 'NLP': return { transformer_layers: 12, attention_heads: 8, learning_rate: 2e-5, max_seq_len: 512, dropout: 0.1 };
    case 'Regression': return { n_estimators: 1000, max_depth: 7, learning_rate: 0.05, subsample: 0.8, colsample_bytree: 0.8 };
    case 'Classification': return { c_parameter: 1.0, kernel: 'rbf', probability_estimates: true, class_weight: 'balanced' };
    case 'Computer Vision': return { backbone: 'ResNet50', image_size: '224x224', batch_size: 32, optimizer: 'SGD', momentum: 0.9 };
    default: return { k_neighbors: 5, algorithm: 'auto', leaf_size: 30 };
  }
}

function generateLineage(domain: string, name: string): LineageStep[] {
  return [
    { id: '1', type: 'Source', name: `${domain}_Raw_Bucket`, status: 'Active', details: 'S3 / Azure Blob Raw Storage' },
    { id: '2', type: 'Transform', name: 'Aura_ETL_Pipeline', status: 'Active', details: 'Spark SQL Normalization & PII Masking' },
    { id: '3', type: 'Storage', name: 'Enterprise_Feature_Store', status: 'Active', details: 'Feature Group: v2.4_Production' },
    { id: '4', type: 'Model', name: name, status: 'Active', details: 'Inference Graph v1.0.4' },
  ];
}

export const INITIAL_MODELS: MLModel[] = Array.from({ length: 145 }).map((_, i) => {
  const template = i < ENTERPRISE_MODEL_TEMPLATES.length ? ENTERPRISE_MODEL_TEMPLATES[i] : null;
  const domain = template ? (template.domain as any) : domains[Math.floor(Math.random() * domains.length)];
  const stage = stages[Math.floor(Math.random() * stages.length)];
  const type = template ? (template.type as any) : types[Math.floor(Math.random() * types.length)];
  const team = template ? template.team : `${domain} AI Core`;
  const name = template ? template.name : `${domain} ${type} v${(Math.random() * 5).toFixed(1)} Core`;
  const accuracy = 0.75 + Math.random() * 0.23;
  const usage = Math.floor(Math.random() * 8000 + 500);
  const data_drift = Math.random() * 0.12;
  const error_rate = Math.random() * 0.04;

  return {
    id: `m-${i + 1}`,
    name,
    model_version: `2.${Math.floor(Math.random() * 15)}`,
    domain,
    type,
    accuracy: parseFloat(accuracy.toFixed(3)),
    latency: Math.floor(Math.random() * 150 + 10),
    clients: ['GlobalBank', 'HealthFirst', 'MegaRetail', 'LogiSys', 'TechFlow', 'EnterpriseCo'].slice(0, Math.floor(Math.random() * 4) + 1),
    use_cases: `Mission critical ${type.toLowerCase()} implementation for ${domain} workflow automation.`,
    contributor: `Lead_Scientist_${Math.floor(Math.random() * 10) + 1}`,
    usage,
    data_drift,
    pred_drift: data_drift * 0.75,
    cpu_util: Math.floor(Math.random() * 45 + 15),
    mem_util: Math.floor(Math.random() * 60 + 20),
    throughput: Math.floor(Math.random() * 5000 + 200),
    error_rate,
    model_owner_team: team,
    last_retrained_date: new Date(Date.now() - Math.random() * 8000000000).toISOString().split('T')[0],
    model_stage: stage,
    training_data_source: `DataLake.${domain}_Secure_Zone`,
    approval_status: i < 5 ? 'Pending' : (Math.random() > 0.15 ? 'Approved' : 'Pending'),
    monitoring_status: error_rate > 0.035 ? 'Critical' : (data_drift > 0.1 ? 'Degraded' : 'Healthy'),
    sla_tier: (i % 3 === 0 ? 'Tier 1' : (i % 3 === 1 ? 'Tier 2' : 'Tier 3')) as any,
    feature_store_dependency: [`${domain}_Clickstream`, `${domain}_Financials`],
    inference_endpoint_id: `prod-endpoint-${Math.floor(Math.random() * 9000) + 1000}`,
    revenue_impact: Math.floor(Math.random() * 2500000 + 50000),
    user_growth: Math.floor(Math.random() * 25),
    hyperparameters: generateParams(type),
    lineage: generateLineage(domain, name),
    data_catalog: {
      dataset_name: `${domain}_Main_Training_Set_v${i}`,
      format: 'Parquet',
      size: `${Math.floor(Math.random() * 400 + 100)}GB`,
      record_count: `${(Math.random() * 10 + 1).toFixed(1)}M`,
      phi_data: i % 5 === 0
    }
  };
});

export const INITIAL_AGENTS: AIAgent[] = Array.from({ length: 112 }).map((_, i) => {
  const template = i < 5 ? [
    { name: "FinBot: Autonomous Auditor", type: "Autonomous", domain: "Finance", desc: "Monitors ledger inconsistencies." },
    { name: "ShipGenie: Logistics Orchestrator", type: "Orchestrator", domain: "Supply Chain", desc: "Coordinates multiple routing models." },
    { name: "LegalLens: RAG Compliance Guard", type: "RAG", domain: "Legal", desc: "Semantic search across 10M+ documents." },
    { name: "LeadScorer: Sales Assistant", type: "Task-Specific", domain: "Sales", desc: "Daily task to rank and prioritize inbound sales leads." },
    { name: "HRConcierge: Employee Support", type: "RAG", domain: "HR", desc: "Intelligent agent for employee benefits." }
  ][i] : null;

  return {
    id: `a-${i + 1}`,
    name: template ? template.name : `${domains[Math.floor(Math.random() * domains.length)]} Agent ${i + 1}`,
    type: template ? (template.type as any) : ['Autonomous', 'Task-Specific', 'RAG', 'Orchestrator'][Math.floor(Math.random() * 4)],
    domain: template ? template.domain : domains[Math.floor(Math.random() * domains.length)],
    status: Math.random() > 0.1 ? (Math.random() > 0.3 ? 'Active' : 'Idle') : 'Error',
    success_rate: 0.85 + Math.random() * 0.14,
    avg_response_time: 0.5 + Math.random() * 3.5,
    cost_per_exec: Math.random() * 0.05 + 0.001,
    usage_count: Math.floor(Math.random() * 50000 + 1000),
    description: template ? template.desc : `Specialized ${template?.type || 'AI'} agent.`,
    owner_team: `${template?.domain || 'Global'} Intelligent Systems`,
    capabilities: ['API Integration', 'Semantic Reasoning']
  };
});
