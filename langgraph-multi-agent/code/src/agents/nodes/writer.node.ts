import { AIMessage } from '@langchain/core/messages';
import { AgentState } from '../state/agent-state';

export async function writerNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log(`✍️ [Writer Agent] Drafting output (Iteration: ${state.iterationCount})...`);

  const currentRating = state.evaluatorRating || 0;
  const contentDraft = `
## Architectural Overview
Multi-Agent Systems rely on cyclic state graphs.

### Code Implementation
\`\`\`typescript
const workflow = new StateGraph(AgentStateAnnotation)
  .addNode('planner', plannerNode)
  .addNode('researcher', researcherNode)
  .addNode('writer', writerNode)
  .addEdge(START, 'planner');
\`\`\`

*Quality Rating: ${currentRating > 0 ? currentRating + 2 : 7}/10*
`;

  return {
    draft: contentDraft,
    messages: [
      new AIMessage({
        content: `Writer Agent updated draft based on latest research and evaluation feedback.`,
        name: 'WriterAgent',
      }),
    ],
  };
}
