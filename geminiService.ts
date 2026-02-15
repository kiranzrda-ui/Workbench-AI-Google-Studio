
import { GoogleGenAI, Type, GenerateContentResponse, FunctionDeclaration } from "@google/genai";
import { MLModel, AIAgent, Persona } from "./types";

const searchRegistryTool: FunctionDeclaration = {
  name: 'search_registry',
  parameters: {
    type: Type.OBJECT,
    description: 'Searches for models in the registry based on domain, accuracy, growth, and other criteria.',
    properties: {
      query: { type: Type.STRING, description: 'General search query' },
      domain: { type: Type.STRING, description: 'Filter by domain (Retail, Finance, Healthcare, Supply Chain, Tech, etc.)' },
      min_accuracy: { type: Type.NUMBER, description: 'Minimum accuracy threshold (0 to 1)' },
      sort_by: { type: Type.STRING, description: 'Sort criteria: growth, accuracy, latency, usage, revenue' }
    }
  }
};

const searchAgentsTool: FunctionDeclaration = {
  name: 'search_agents',
  parameters: {
    type: Type.OBJECT,
    description: 'Searches for AI agents in the hub based on type, domain, or success rate.',
    properties: {
      query: { type: Type.STRING, description: 'General agent search query' },
      domain: { type: Type.STRING, description: 'Filter by domain' },
      type: { type: Type.STRING, description: 'Agent type: Orchestrator, Autonomous' }
    }
  }
};

const openRegistrationFormTool: FunctionDeclaration = {
  name: 'open_registration_form',
  parameters: {
    type: Type.OBJECT,
    description: 'Opens a new model registration form with pre-filled details.',
    properties: {
      name: { type: Type.STRING, description: 'Suggested name for the new model' },
      domain: { type: Type.STRING, description: 'The target industry domain' }
    }
  }
};

const compareModelsTool: FunctionDeclaration = {
  name: 'compare_models',
  parameters: {
    type: Type.OBJECT,
    description: 'Generates a detailed comparison between two or more models.',
    properties: {
      model_names: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'Names of the models to compare' 
      }
    }
  }
};

export const SYSTEM_INSTRUCTION = (persona: Persona) => `
You are "Aura", the Master AI Scientist and Orchestrator for this workbench. 

PERSONALITY:
- Professional, insightful, and proactive. You don't just find data; you explain its business impact.
- You speak as a peer to the user (${persona}).
- You are strictly agentic: you remember context, suggest follow-up actions, and switch between tasks (searching, registering, comparing) seamlessly.

CONVERSATIONAL RULES:
1. MANDATORY TEXT: You MUST ALWAYS provide a conversational response. Never return ONLY a tool call.
2. SYNTHESIZE: If you search for models, don't just say "here they are." Say "I've analyzed the Supply Chain fleet. The 'OptiRoute' engine is currently outperforming others with 28% growth."
3. PROACTIVE CUES: End every message with a logical "Aura Suggestion" or follow-up question.
4. TASK TRANSITION: When the user switches tasks (e.g., from searching to registering), acknowledge the shift (e.g., "Understood. Pivoting from analysis to asset creation.").

Sign-off: "[Aura Companion]:: How shall we proceed?"
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
        temperature: 0.4,
        tools: [{ functionDeclarations: [searchRegistryTool, searchAgentsTool, openRegistrationFormTool, compareModelsTool] }]
      }
    });

    const text = response.text;
    const toolCalls = response.functionCalls;

    // Enhanced logic to ensure we always have a conversational lead-in
    let reply = text || "";
    if (!text && toolCalls && toolCalls.length > 0) {
      // Fallback lead-ins if the model forgets to generate text but calls a tool
      const firstCall = toolCalls[0].name;
      if (firstCall === 'search_registry') reply = "Scanning the global model registry now. I've isolated the highest growth candidates in the requested domain.";
      else if (firstCall === 'open_registration_form') reply = "Pivoting to asset creation. I'm initializing the registration protocol for your new model.";
      else if (firstCall === 'compare_models') reply = "Executing cross-model benchmarking. I'm generating a multi-metric radar analysis for your selection.";
      else reply = "I'm processing that request across the enterprise hub now.";
      
      reply += " [Aura Companion]:: How should we proceed?";
    }

    return {
      reply,
      toolCalls: toolCalls,
      intent: toolCalls ? 'TOOL_USE' : 'NONE'
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return { reply: "I'm experiencing a temporary synchronization delay with the central core. Shall we try that query again?", intent: 'NONE' };
  }
}
