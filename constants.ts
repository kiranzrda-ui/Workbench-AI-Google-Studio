
import { MLModel } from './types';

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

  const featureStores = [
    'UserClickstream_v4', 'TransactionLedger_Prod', 'SensorTelemetry_Stream', 
    'HistoricalSales_Global', 'CustomerProfile_Master', 'InventoryLevel_L1',
    'ExternalMarketIndices', 'SocialSentiment_Aggregator', 'HREmployeeCentral_Sync',
    'LegalDocs_Metadata', 'Salesforce_Opportunity_Feed'
  ];

  return {
    id: `m-${i + 1}`,
    name,
    model_version: `2.${Math.floor(Math.random() * 15)}`,
    domain,
    type,
    accuracy: parseFloat(accuracy.toFixed(3)),
    latency: Math.floor(Math.random() * 150 + 10),
    clients: ['GlobalBank', 'HealthFirst', 'MegaRetail', 'LogiSys', 'TechFlow', 'EnterpriseCo'].slice(0, Math.floor(Math.random() * 4) + 1),
    use_cases: `Mission critical ${type.toLowerCase()} implementation for ${domain} workflow automation and efficiency optimization.`,
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
    feature_store_dependency: featureStores.slice(0, Math.floor(Math.random() * 3) + 1),
    inference_endpoint_id: `prod-endpoint-${Math.floor(Math.random() * 9000) + 1000}`,
    revenue_impact: Math.floor(Math.random() * 2500000 + 50000),
    user_growth: Math.floor(Math.random() * 25)
  };
});
