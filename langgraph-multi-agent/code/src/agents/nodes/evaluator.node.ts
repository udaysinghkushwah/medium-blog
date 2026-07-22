import { AIMessage } from '@langchain/core/messages';
import { AgentState } from '../state/agent-state';

export async function evaluatorNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log(`🧐 [Evaluator Agent] Reviewing draft (Iteration: ${state.iterationCount})...`);

  // Simulate evaluation logic
  const isSufficient = state.iterationCount >= 2 || state.evaluatorRating >= 8;
  const rating = isSufficient ? 9 : 7;

  return {
    evaluatorRating: rating,
    isComplete: isSufficient,
    iterationCount: 1, // incremented by reducer
    messages: [
      new AIMessage({
        content: `Evaluator Agent rated draft: ${rating}/10. Task Complete: ${isSufficient}`,
        name: 'EvaluatorAgent',
      }),
    ],
  };
}

// Conditional Routing Function
export function shouldContinue(state: AgentState): 'writer' | '__end__' {
  if (state.isComplete || state.iterationCount >= 3) {
    console.log(`✅ [Conditional Edge] Validation passed. Routing to END.`);
    return '__end__';
  }
  console.log(`🔄 [Conditional Edge] Feedback required. Re-routing to Writer Agent loop.`);
  return 'writer';
}
