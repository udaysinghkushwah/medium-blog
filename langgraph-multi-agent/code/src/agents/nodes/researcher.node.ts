import { AIMessage } from '@langchain/core/messages';
import { AgentState } from '../state/agent-state';

export async function researcherNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log(`🔎 [Researcher Agent] Executing research for steps... (Iteration: ${state.iterationCount})`);

  const researchFindings = `[Research Summary]: LangGraph.js enables stateful multi-agent loops via StateGraph annotations. NestJS provides robust dependency injection and Server-Sent Events (SSE) streaming capabilities. State persistence is achieved via checkpointers.`;

  return {
    researchData: researchFindings,
    messages: [
      new AIMessage({
        content: `Researcher Agent gathered context. Integrated knowledge sources successfully.`,
        name: 'ResearcherAgent',
      }),
    ],
  };
}
