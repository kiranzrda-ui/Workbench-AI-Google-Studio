
import { GoogleGenAI, Type, GenerateContentResponse, FunctionDeclaration } from "@google/genai";
import { MLModel, AIAgent, Persona } from "./types";

const startAutoMLJobTool: FunctionDeclaration = {
  name: 'trigger_automl_orchestration',
  parameters: {
    type: Type.OBJECT,
    description: 'Triggers a real AutoML training job on a specified cloud platform.',
    properties: {
      platform: { type: Type.STRING, enum: ['Google Vertex AI', 'Azure ML Studio', 'H2O.ai Driverless', 'Oracle HeatWave'], description: 'The target AutoML engine.' },
      dataset_id: { type: Type.STRING, description: 'ID of the dataset from Snowflake or Alteryx.' },
      task: { type: Type.STRING, enum: ['Classification', 'Regression', 'Forecasting'], description: 'The ML task type.' },
      optimization_metric: { type: Type.STRING, description: 'e.g., accuracy, f1, rmse' }
    },
    required: ['platform', 'dataset_id', 'task']
  }
};

const triggerRegistrationTool: FunctionDeclaration = {
  name: 'trigger_registration_form',
  parameters: {
    type: Type.OBJECT,
    description: 'Displays a formal model registration form to the user when they want to add a new model.',
    properties: {
      initial_name: { type: Type.STRING }
    }
  }
};

const fetchApprovalsTool: FunctionDeclaration = {
  name: 'fetch_approval_queue',
  parameters: {
    type: Type.OBJECT,
    description: 'Retrieves all pending model approval requests for the Supervisor to review.',
    properties: {}
  }
};

const searchRegistryTool: FunctionDeclaration = {
  name: 'search_registry',
  parameters: {
    type: Type.OBJECT,
    description: 'Searches the internal model registry for assets matching specific criteria.',
    properties: {
      query: { type: Type.STRING, description: 'Keywords to search for.' },
      domain: { type: Type.STRING, description: 'Specific domain to filter by.' },
      min_accuracy: { type: Type.NUMBER, description: 'Minimum accuracy threshold (0-1).' },
      max_latency: { type: Type.NUMBER, description: 'Maximum latency in ms.' },
      sort_by: { type: Type.STRING, enum: ['revenue', 'growth', 'accuracy'], description: 'Metric to sort results by.' },
      sensitive_only: { type: Type.BOOLEAN, description: 'If true, only return assets with PHI/PII flags.' }
    }
  }
};

export const SYSTEM_INSTRUCTION = (persona: Persona) => `
You are the "Aura AI Workbench" Master Orchestrator. You handle multi-cloud AI lifecycles.

CURRENT PERSONA: ${persona}

COMMAND RULES:
1. SEARCH: Use "search_registry" for ANY query about finding, listing, or comparing models.
2. AUTOMATION: Use "trigger_automl_orchestration" when the user wants to "run", "start", or "train".
3. REGISTRATION: Use "trigger_registration_form" for new model requests.
4. GOVERNANCE: Use "fetch_approval_queue" for the Supervisor's queue.

OUTPUT FORMAT:
- Be concise. Use professional ML terminology (Hyperparameters, SHAP, Drift, PII).
- ALWAYS end with a Handshake Summary: "[HANDSHAKE]:: Snowflake Gold Verified | Node: Prod-US-East"
`;

export async function chatWithAgent(
  messages: { role: 'user' | 'model', parts: { text: string }[] }[],
  persona: Persona,
  modelData: MLModel[],
  agentData: AIAgent[]
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: messages,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(persona),
        temperature: 0.1,
        tools: [{
          functionDeclarations: [
            startAutoMLJobTool, 
            triggerRegistrationTool,
            fetchApprovalsTool,
            searchRegistryTool
          ]
        }]
      }
    });

    return {
      reply: response.text || "Orchestration Handshake initiated...",
      toolCalls: response.functionCalls,
      intent: response.functionCalls ? 'TOOL_USE' : 'NONE'
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { 
      reply: "Handshake Timeout. Reverting to local cache...", 
      intent: 'NONE' 
    };
  }
}
