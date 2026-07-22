import { StateGraph, START, END } from '@langchain/langgraph';
import { AgentStateAnnotation } from '../state/agent-state';
import { plannerNode } from '../nodes/planner.node';
import { researcherNode } from '../nodes/researcher.node';
import { writerNode } from '../nodes/writer.node';
import { evaluatorNode, shouldContinue } from '../nodes/evaluator.node';

export function buildMultiAgentGraph() {
  const workflow = new StateGraph(AgentStateAnnotation)
    // 1. Add Agent Nodes
    .addNode('planner', plannerNode)
    .addNode('researcher', researcherNode)
    .addNode('writer', writerNode)
    .addNode('evaluator', evaluatorNode)

    // 2. Add Fixed Edges
    .addEdge(START, 'planner')
    .addEdge('planner', 'researcher')
    .addEdge('researcher', 'writer')
    .addEdge('writer', 'evaluator')

    // 3. Add Conditional Edge for Self-Correction Loop
    .addConditionalEdges('evaluator', shouldContinue, {
      writer: 'writer',
      __end__: END,
    });

  return workflow.compile();
}
