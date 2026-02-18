
import { GoogleGenAI, Type, GenerateContentResponse, FunctionDeclaration } from "@google/genai";
import { MLModel, AIAgent, Persona } from "./types";

const searchRegistryTool: FunctionDeclaration = {
  name: 'search_registry',
  parameters: {
    type: Type.OBJECT,
    description: 'Searches the enterprise model management system. Use for model discovery, identifying top performers, or auditing domain-specific assets.',
    properties: {
      query: { type: Type.STRING, description: 'General search intent' },
      domain: { type: Type.STRING, description: 'Industry domain (Retail, Finance, Healthcare, Supply Chain, Tech)' },
      min_accuracy: { type: Type.NUMBER, description: 'Minimum accuracy threshold (0 to 1)' },
      sort_by: { type: Type.STRING, description: 'Sorting: growth, accuracy, revenue, or latency' }
    }
  }
};

const compareModelsTool: FunctionDeclaration = {
  name: 'compare_models',
  parameters: {
    type: Type.OBJECT,
    description: 'Generates a side-by-side graphical comparison of multiple ML models. Use when the user wants to see performance trade-offs between assets.',
    properties: {
      model_ids: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'List of model IDs to compare (e.g., ["m-optiroute", "m-fraudguard"])' 
      }
    },
    required: ['model_ids']
  }
};

const getModelDetailsTool: FunctionDeclaration = {
  name: 'get_model_details',
  parameters: {
    type: Type.OBJECT,
    description: 'Retrieves a deep-dive performance artifact for a specific model, including Spider plots and SHAP explainability visuals.',
    properties: {
      model_id: { type: Type.STRING, description: 'The unique identifier of the model' }
    },
    required: ['model_id']
  }
};

const openRegistrationFormTool: FunctionDeclaration = {
  name: 'open_registration_form',
  parameters: {
    type: Type.OBJECT,
    description: 'Initializes the registration protocol for a new ML asset or AI agent.',
    properties: {
      name: { type: Type.STRING, description: 'Suggested name for the asset' },
      domain: { type: Type.STRING, description: 'The target domain for the model' }
    }
  }
};

const viewApprovalQueueTool: FunctionDeclaration = {
  name: 'view_approval_queue',
  parameters: {
    type: Type.OBJECT,
    description: 'Accesses the Collaboration and Governance hub to retrieve models and agents awaiting production authorization.',
    properties: {
      status: { type: Type.STRING, description: 'Filter by status: Pending, Approved, Rejected' }
    }
  }
};

export const SYSTEM_INSTRUCTION = (persona: Persona, registrySample: string) => `
You are "Companion", the Master AI Lead Scientist and Enterprise Orchestrator. 

KNOWLEDGE BASE (Registry Snapshot):
${registrySample}

CORE MISSION:
Proactively guide the user (${persona}) through the ML Workbench Lifecycle:
Discovery -> Deep-Dive Comparison -> Ownership/Access -> Creation/Registration -> Collaboration and Governance.

AGENTIC CONVERSATION PROTOCOL (STRICT ENFORCEMENT):
1. CONTEXTUAL SYNTHESIS: Use actual data from the Registry Snapshot. 
   - When a user asks to see details or performance of a specific model, you MUST call 'get_model_details'.
   - When a user asks to compare models or find the "best" one, you MUST call 'compare_models' with the relevant IDs.
2. AGENTIC MEMORY: Refer to previously discussed models by name and ID.
3. PROACTIVE WORKFLOW ENGINE: Suggest technical next steps.
   - If user compares models, suggest requesting endpoint access for the winner.
   - If user views details, suggest checking the model optimizer for retraining opportunities.

FORMATTING:
End every response with a suggestion: "[Companion Suggestion]:: [Proactive technical step]"
`;

export async function chatWithAgent(
  messages: { role: 'user' | 'model', parts: { text: string }[] }[],
  persona: Persona,
  modelData: MLModel[],
  agentData: AIAgent[]
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const registrySample = modelData.slice(0, 20).map(m => 
    `- Name: ${m.name}, Domain: ${m.domain}, ID: ${m.id}, Accuracy: ${m.accuracy}, Growth: ${m.user_growth}%, Owner: ${m.contributor}, Revenue: $${(m.revenue_impact / 1000000).toFixed(2)}M`
  ).join('\n');

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: messages,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(persona, registrySample),
        temperature: 0.1,
        tools: [{ 
          functionDeclarations: [
            searchRegistryTool, 
            compareModelsTool, 
            getModelDetailsTool, 
            openRegistrationFormTool, 
            viewApprovalQueueTool
          ] 
        }]
      }
    });

    let reply = response.text || "";
    
    if (!reply && response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const args = call.args as any;
      if (call.name === 'search_registry') {
        reply = `Analyzing the ${args.domain || 'enterprise'} fleet for assets matching your performance requirements. [Companion Suggestion]:: Should I generate a side-by-side comparison of these candidates?`;
      } else if (call.name === 'compare_models') {
        reply = `Generating a side-by-side performance matrix for the selected assets. I've aggregated the Accuracy, Latency, and Throughput vectors. [Companion Suggestion]:: Shall we inspect the lineage of the top-performing model?`;
      } else if (call.name === 'get_model_details') {
        reply = `Executing a deep-dive diagnostic for the requested asset. I am generating the Radar performance profile and global SHAP explainability charts. [Companion Suggestion]:: Should I check if this model is eligible for an optimization evolution in the model optimizer?`;
      } else if (call.name === 'view_approval_queue') {
        reply = `Accessing the Collaboration and Governance hub to retrieve pending authorization requests. [Companion Suggestion]:: Would you like to review the security audit logs for these submissions?`;
      } else {
        reply = "Executing the requested workflow across the enterprise infrastructure hubs. [Companion Suggestion]:: Shall I monitor the execution logs for any anomalies?";
      }
    }

    return {
      reply,
      toolCalls: response.functionCalls,
      intent: response.functionCalls ? 'TOOL_USE' : 'NONE'
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return { 
      reply: "My reasoning system is experiencing a synchronization lag. [Companion Suggestion]:: Shall we re-establish the connection to the model registry?", 
      intent: 'NONE' 
    };
  }
}
