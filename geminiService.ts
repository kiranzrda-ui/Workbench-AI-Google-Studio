
import { GoogleGenAI, Type } from "@google/genai";
import { MLModel, Persona } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const SYSTEM_INSTRUCTION = (persona: Persona) => `
You are the "Aura AI Workbench" Lead Agent. Your goal is to help Data Scientists and Supervisors manage ML models efficiently.

Persona: ${persona}
Current Context: You have access to a repository of 145 ML models.

CORE CAPABILITIES:
1. Search & Discovery: Filter models by name, domain, stage, accuracy, etc.
2. Comparison: Provide data-driven comparisons of specific models.
3. Health Monitoring: Discuss drift, latency, and error rates.
4. Business Value: Discuss revenue impact and usage trends.
5. Governance: Manage approvals (if Supervisor) or request access (if Data Scientist).

BEHAVIOR:
- When a user asks for models, call the search tool.
- If they ask to compare, call the comparison tool.
- If they ask for business impact, explain revenue and user growth.
- Use a professional, tech-savvy tone.
- Always offer to show charts or specific widgets when relevant.
- Identify "Trending" (high usage, good health), "Struggling" (high drift/error), and "Hidden Gems" (high accuracy, low usage).

AVAILABLE TOOLS (Conceptual - implemented via response schema or text patterns for this app logic):
- find_models(filters)
- compare_models(names)
- show_shap(model_name)
- register_model(details)
- get_approvals()
- update_status(id, status)
`;

export async function chatWithAgent(
  messages: { role: 'user' | 'model', parts: { text: string }[] }[],
  persona: Persona,
  modelData: MLModel[]
) {
  // We use the JSON response schema to let the agent decide which visual components to trigger
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      { role: 'user', parts: [{ text: `SYSTEM INITIALIZATION: ${SYSTEM_INSTRUCTION(persona)}\nCURRENT DATA: ${JSON.stringify(modelData.slice(0, 5))}... (and 140+ more)` }] },
      ...messages.map(m => ({ role: m.role, parts: m.parts }))
    ],
    config: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: { type: Type.STRING, description: "The natural language response to the user." },
          intent: { 
            type: Type.STRING, 
            description: "The action the agent wants to perform.",
            enum: ['SEARCH', 'COMPARE', 'SHAP', 'IMPACT', 'REGISTER', 'APPROVAL_QUEUE', 'UPDATE_APPROVAL', 'TRENDS', 'NONE']
          },
          payload: { 
            type: Type.OBJECT, 
            description: "Data needed for the visual component.",
            properties: {
              filters: { 
                type: Type.OBJECT,
                description: "Key-value pairs for filtering models.",
                properties: {
                  domain: { type: Type.STRING, description: "The industry domain (Retail, Finance, etc.)" },
                  accuracy: { type: Type.NUMBER, description: "Minimum accuracy threshold (0-1)." },
                  stage: { type: Type.STRING, description: "Model stage (Production, Staging, Experimental)." },
                  type: { type: Type.STRING, description: "Model type (NLP, CV, etc.)" }
                }
              },
              modelIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              modelId: { type: Type.STRING },
              metadata: { 
                type: Type.OBJECT,
                description: "Additional structured data for registration or status updates.",
                properties: {
                  name: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  status: { type: Type.STRING, description: "Target status for approvals (Approved, Rejected)." },
                  use_cases: { type: Type.STRING }
                }
              }
            }
          }
        },
        required: ["reply", "intent"]
      }
    }
  });

  return JSON.parse(response.text);
}
