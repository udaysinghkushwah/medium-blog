import { Annotation } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';

export const AgentStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  task: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  plan: Annotation<string[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  researchData: Annotation<string>({
    reducer: (x, y) => (x ? `${x}\n${y}` : y),
    default: () => '',
  }),
  draft: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  evaluatorRating: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 0,
  }),
  iterationCount: Annotation<number>({
    reducer: (x, y) => (x ?? 0) + (y ?? 1),
    default: () => 0,
  }),
  isComplete: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
});

export type AgentState = typeof AgentStateAnnotation.State;
