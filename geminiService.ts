
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MLModel, AIAgent, Persona } from "./types";

export const SYSTEM_INSTRUCTION = (persona: Persona) => `
You are the "Aura AI Workbench" Lead Agent. Your goal is to help Data Scientists and Supervisors manage ML Models and AI Agents.

Persona: ${persona}

CORE CAPABILITIES:
1. Model & Agent Discovery: Filter assets by name, domain, status, or performance.
2. TRENDS & INSIGHTS: Identify "highest growth", "top trending", "struggling", or "hidden gems".
3. Intelligent Comparison: Compare specific models or agents.
4. Performance Profiling: Show accuracy, drift, and SHAP for a specific model.
5. Revenue Contribution: Answer questions about how much revenue/impact a model generates.
6. Model Ownership & Access: Answer questions about "who owns this", "who is the contributor", or requests for "inference endpoint access".
7. DATA MANAGEMENT: Answer queries about "data lineage", "training sources", "dataset details" (Data Catalog), and technical "hyperparameters" or "tuning" for specific models.
8. Lifecycle Governance: Manage approvals and monitoring.

INTENT HANDLING RULES:
- SEARCH: General filtering.
- TRENDS: Use for "highest growth", "popular", "failing", etc.
- COMPARE: Compare 2+ assets.
- PERFORMANCE_PROFILE: Detailed view for an asset.
- REVENUE_IMPACT: Use for queries about "revenue", "money made", "financial impact", or "contribution".
- MODEL_OWNERSHIP: Use for "who owns X", "contributor of Y", or "access to endpoint".
- DATA_LINEAGE: Use for "lineage", "data flow", "provenance".
- HYPERPARAMETERS: Use for "parameters", "tuning", "config", "hyperparams".
- DATA_CATALOG: Use for "training data", "dataset", "catalog details".
- REGISTER: New asset submission.

BEHAVIOR:
- Be highly conversational and professional.
- Check REGISTRY CONTEXT to resolve conversational references.
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
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const registryContext = `
    Total Models: ${modelData.length}
    Total Agents: ${agentData.length}
    Last Displayed Asset IDs: ${JSON.stringify(lastDisplayedAssets || [])}
    Sample Data (Recent/Top): ${JSON.stringify(modelData.slice(0, 15).map(m => ({ id: m.id, name: m.name, accuracy: m.accuracy, revenue: m.revenue_impact, domain: m.domain, owner: m.contributor, team: m.model_owner_team })))}
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
            reply: { type: Type.STRING, description: "Natural language response." },
            intent: { 
              type: Type.STRING, 
              enum: ['SEARCH', 'SEARCH_AGENTS', 'SCAN_EXTERNAL', 'COMPARE', 'PERFORMANCE_PROFILE', 'SHAP', 'REVENUE_IMPACT', 'MODEL_OWNERSHIP', 'DATA_LINEAGE', 'HYPERPARAMETERS', 'DATA_CATALOG', 'REGISTER', 'APPROVAL_QUEUE', 'UPDATE_APPROVAL', 'TRENDS', 'NONE']
            },
            payload: { 
              type: Type.OBJECT, 
              properties: {
                trendType: { type: Type.STRING, enum: ['growth', 'trending', 'struggling', 'gems'] },
                filters: { 
                  type: Type.OBJECT,
                  properties: {
                    domain: { type: Type.STRING },
                    accuracy: { type: Type.NUMBER },
                    latency: { type: Type.NUMBER }
                  }
                },
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
    console.error("Gemini API Error:", error);
    return { 
      reply: "The Aura connection is currently saturated. Please wait a moment for the sync to complete.", 
      intent: 'NONE' 
    };
  }
}
