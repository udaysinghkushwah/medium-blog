import { AIMessage } from '@langchain/core/messages';
import { AgentState } from '../state/agent-state';

export async function plannerNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log(`🧠 [Planner Agent] Breaking down task: "${state.task}"`);

  const planSteps = [
    'Step 1: Search technical documentation & API specifications.',
    'Step 2: Synthesize architectural patterns and trade-offs.',
    'Step 3: Draft production-grade implementation code.',
    'Step 4: Evaluate code quality and perform safety review.',
  ];

  return {
    plan: planSteps,
    messages: [
      new AIMessage({
        content: `Planner Agent initialized. Plan established with ${planSteps.length} execution steps.`,
        name: 'PlannerAgent',
      }),
    ],
  };
}
