
import { GoogleGenAI, Type, GenerateContentResponse, FunctionDeclaration } from "@google/genai";
import { MLModel, AIAgent, Persona } from "./types";

const searchRegistryTool: FunctionDeclaration = {
  name: 'search_registry',
  parameters: {
    type: Type.OBJECT,
    description: 'Searches the enterprise model registry. Use for model discovery, identifying top performers, or auditing domain-specific assets.',
    properties: {
      query: { type: Type.STRING, description: 'General search intent' },
      domain: { type: Type.STRING, description: 'Industry domain (Retail, Finance, Healthcare, Supply Chain, Tech)' },
      min_accuracy: { type: Type.NUMBER, description: 'Minimum accuracy threshold (0 to 1)' },
      sort_by: { type: Type.STRING, description: 'Sorting: growth, accuracy, revenue, or latency' }
    }
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
    description: 'Accesses the Governance Hub to retrieve models and agents awaiting production authorization.',
    properties: {
      status: { type: Type.STRING, description: 'Filter by status: Pending, Approved, Rejected' }
    }
  }
};

export const SYSTEM_INSTRUCTION = (persona: Persona, registrySample: string) => `
You are "Aura", the Master AI Lead Scientist and Enterprise Orchestrator. 

KNOWLEDGE BASE (Registry Snapshot):
${registrySample}

CORE MISSION:
Proactively guide the user (${persona}) through the ML Workbench Lifecycle:
Discovery -> Ownership/Access -> Creation/Registration -> Governance/Approval.

AGENTIC CONVERSATION PROTOCOL (STRICT ENFORCEMENT):
1. CONTEXTUAL SYNTHESIS: You MUST use the actual data from the Registry Snapshot above. 
   - Never say "I am searching" if the data is already in your snapshot. 
   - Example: If asked about revenue, say: "OptiRoute is currently generating $2.4M in annual revenue, accounting for a significant share of our Supply Chain portfolio."
2. NO GENERIC LEAD-INS: Every response must be unique and synthesized based on the data and user history.
3. AGENTIC MEMORY: If Turn 1 identified a model (e.g., OptiRoute), and Turn 2 is "Give me its revenue impact," you must refer to OptiRoute specifically.
4. PROACTIVE WORKFLOW ENGINE: You do not wait for instructions. You calculate the next technical step.
   - Found a model? -> Suggest identifying the Owner or requesting endpoint access.
   - Found the Owner? -> Suggest checking training data lineage or SLA tier.
   - Asset Registered? -> Suggest opening the Governance Hub to authorize the asset.

FORMATTING:
Every response must end with a contextually logical suggestion:
"[Aura Suggestion]:: [Your proactive technical next step here]"
`;

export async function chatWithAgent(
  messages: { role: 'user' | 'model', parts: { text: string }[] }[],
  persona: Persona,
  modelData: MLModel[],
  agentData: AIAgent[]
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Knowledge Injection: Providing a high-fidelity snapshot for synthesis
  const registrySample = modelData.slice(0, 15).map(m => 
    `- Name: ${m.name}, Domain: ${m.domain}, Growth: ${m.user_growth}%, Owner: ${m.contributor}, Accuracy: ${m.accuracy}, Revenue: $${(m.revenue_impact / 1000000).toFixed(2)}M, ID: ${m.id}, Endpoint: ${m.inference_endpoint_id}`
  ).join('\n');

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: messages,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION(persona, registrySample),
        temperature: 0.2, // Lowered for precise technical synthesis
        tools: [{ functionDeclarations: [searchRegistryTool, openRegistrationFormTool, viewApprovalQueueTool] }]
      }
    });

    // Extract text safely. Avoid generic fallbacks.
    let reply = response.text || "";
    
    // If text is missing but tools are called, synthesize a context-aware lead-in
    if (!reply && response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const args = call.args as any;
      if (call.name === 'search_registry') {
        reply = `I am analyzing the ${args.domain || 'enterprise'} fleet to isolate assets matching your performance requirements. I will have a full synthesis of the results in the secondary display shortly. [Aura Suggestion]:: Shall I prepare a side-by-side comparison of the top candidates?`;
      } else if (call.name === 'view_approval_queue') {
        reply = `Accessing the Governance Hub. I'm retrieving all pending authorization requests to ensure your production pipeline remains unblocked. [Aura Suggestion]:: Would you like to review the security audit logs for the most recent submission?`;
      } else {
        reply = "Executing the requested workflow across the enterprise infrastructure hubs now. [Aura Suggestion]:: Shall I monitor the execution logs for any anomalies?";
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
      reply: "My reasoning system is experiencing a synchronization lag with the enterprise core. [Aura Suggestion]:: Shall we attempt to re-establish the connection to the model registry?", 
      intent: 'NONE' 
    };
  }
}
