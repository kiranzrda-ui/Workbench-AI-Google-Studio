
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MLModel, AIAgent, Persona } from "./types";

// Local interceptor to provide instant responses for demo scenarios and avoid 429 errors
const MOCK_KNOWLEDGE_BASE: Record<string, any> = {
  "show me the data lineage for m-1": {
    reply: "Analyzing provenance for **FraudGuard (m-1)**. I've retrieved the complete lineage from the S3 Raw Bucket through the Aura ETL Pipeline to the Production Feature Store.",
    intent: "DATA_LINEAGE",
    payload: { metadata: { modelId: "m-1" } }
  },
  "what are the hyperparameters for fraudguard?": {
    reply: "Retrieved technical specs for **FraudGuard**. It is currently using an RBF kernel with balanced class weighting to handle high-frequency transaction fraud.",
    intent: "HYPERPARAMETERS",
    payload: { metadata: { modelId: "m-1" } }
  },
  "which model has the highest revenue impact?": {
    reply: "Searching the value portfolio... The highest impact asset is currently the **Supply Chain Regression Model**, contributing approximately $2.5M annually.",
    intent: "REVENUE_IMPACT",
    payload: { modelIds: ["m-2"] }
  },
  "who is the owner of supplysense?": {
    reply: "Directing you to the ownership profile for **SupplySense**. This asset is managed by the Supply Chain Intelligence team under Lead Scientist Alpha.",
    intent: "MODEL_OWNERSHIP",
    payload: { metadata: { modelId: "m-2" } }
  },
  "tell me about the training source for customer360": {
    reply: "Accessing the Data Catalog for **Customer360 (m-3)**. It utilizes the Retail_Secure_Zone dataset in Parquet format, containing approximately 5.4M records.",
    intent: "DATA_CATALOG",
    payload: { metadata: { modelId: "m-3" } }
  },
  "run performance audit for m-1": {
    reply: "Audit complete for **FraudGuard (m-1)**. Accuracy is holding steady at 91.2%, but I've detected a minor 3.1% drift in input distribution over the last 24 hours. Latency remains optimal at 42ms.",
    intent: "PERFORMANCE_PROFILE",
    payload: { metadata: { modelId: "m-1" } }
  }
};

export const SYSTEM_INSTRUCTION = (persona: Persona) => `
You are the "Aura AI Workbench" Lead Agent. Your goal is to help Data Scientists and Supervisors manage ML Models and AI Agents.

Persona: ${persona}

CORE CAPABILITIES:
1. Discovery: Search assets by name, domain, status.
2. MODEL PERFORMANCE: Provide deep-dives into accuracy, latency, drift, throughput, and error rates.
3. DATA MANAGEMENT: Visibility into the Data Catalog, Lineage (Provenance), and Hyperparameters (Tuning).
4. TRENDS: Identify "top trending", "struggling", or "hidden gems" based on revenue and growth.
5. Ownership: Manage asset ownership profiles and inference access.

RESPONSE RULES:
- If asked for "performance", "audit", "stats", or "drift", use intent PERFORMANCE_PROFILE.
- If asked for "lineage", "flow", "provenance", use intent DATA_LINEAGE.
- If asked for "hyperparams", "tuning", "config", use intent HYPERPARAMETERS.
- If asked for "data source", "catalog", "training set", use intent DATA_CATALOG.
- Always check the "Last Displayed Asset IDs" to resolve pronouns like "it", "this model".

BEHAVIOR:
- Be highly technical and professional.
`;

async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.error?.status;
      const isRetryable = status === 429 || (status >= 500 && status < 600);

      if (isRetryable && i < maxRetries - 1) {
        const waitBase = status === 429 ? 2000 : 1000;
        const delay = Math.pow(2, i) * waitBase + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function chatWithAgent(
  messages: { role: 'user' | 'model', parts: { text: string }[] }[],
  persona: Persona,
  modelData: MLModel[],
  agentData: AIAgent[],
  lastDisplayedAssets?: string[]
) {
  const lastUserMessage = messages[messages.length - 1]?.parts[0]?.text.toLowerCase().trim();
  
  if (lastUserMessage && MOCK_KNOWLEDGE_BASE[lastUserMessage]) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      ...MOCK_KNOWLEDGE_BASE[lastUserMessage],
      reply: `[Aura Local-Sync] ${MOCK_KNOWLEDGE_BASE[lastUserMessage].reply}`
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const registryContext = `
    Total Models: ${modelData.length}
    Total Agents: ${agentData.length}
    Last Displayed Asset IDs: ${JSON.stringify(lastDisplayedAssets || [])}
    Detailed Context: ${JSON.stringify(modelData.slice(0, 5).map(m => ({ 
      id: m.id, 
      name: m.name, 
      accuracy: m.accuracy, 
      latency: m.latency,
      drift: m.data_drift,
      throughput: m.throughput,
      error_rate: m.error_rate,
      owner: m.contributor 
    })))}
  `;

  try {
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `REGISTRY CONTEXT:\n${registryContext}` }] },
        ...messages.map(m => ({ role: m.role, parts: m.parts }))
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(persona),
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            intent: { 
              type: Type.STRING, 
              enum: ['SEARCH', 'SEARCH_AGENTS', 'SCAN_EXTERNAL', 'COMPARE', 'PERFORMANCE_PROFILE', 'SHAP', 'REVENUE_IMPACT', 'MODEL_OWNERSHIP', 'DATA_LINEAGE', 'HYPERPARAMETERS', 'DATA_CATALOG', 'REGISTER', 'APPROVAL_QUEUE', 'UPDATE_APPROVAL', 'TRENDS', 'NONE']
            },
            payload: { 
              type: Type.OBJECT, 
              properties: {
                modelIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                metadata: { 
                  type: Type.OBJECT,
                  properties: {
                    modelId: { type: Type.STRING },
                    name: { type: Type.STRING }
                  }
                }
              }
            }
          },
          required: ["reply", "intent"]
        }
      }
    }));

    const jsonStr = response.text;
    if (!jsonStr) return { reply: "Analysis complete, but I couldn't format the result. Try again?", intent: 'NONE' };
    return JSON.parse(jsonStr.trim());

  } catch (error: any) {
    if (error?.status === 429 || error?.error?.status === 429 || error?.message?.includes("quota")) {
      return { 
        reply: "⚠️ **Quota Limit Reached**. Using local cache for suggested demo prompts.", 
        intent: 'NONE' 
      };
    }
    return { 
      reply: "The Aura connection is currently unstable. Please check your network.", 
      intent: 'NONE' 
    };
  }
}
