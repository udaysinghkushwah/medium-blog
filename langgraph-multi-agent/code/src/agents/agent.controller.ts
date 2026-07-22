import { Controller, Post, Body, Sse, MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { buildMultiAgentGraph } from './graph/multi-agent.graph';

@Controller('agents')
export class AgentController {
  private readonly appGraph = buildMultiAgentGraph();

  @Post('run')
  async runAgentWorkflow(@Body() body: { task: string }) {
    const initialTask = body.task || 'Design a resilient distributed rate limiter system';

    console.log(`\n🚀 [NestJS Agent Controller] Executing Multi-Agent Graph for task: "${initialTask}"`);
    
    const finalState = await this.appGraph.invoke({
      task: initialTask,
    });

    return {
      status: 'SUCCESS',
      task: finalState.task,
      iterations: finalState.iterationCount,
      rating: finalState.evaluatorRating,
      draftOutput: finalState.draft,
      messagesCount: finalState.messages.length,
    };
  }

  @Sse('stream')
  streamAgentWorkflow(@Body() body: { task: string }): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    const task = body?.task || 'Architect Multi-Agent Systems in NestJS';

    (async () => {
      try {
        const stream = await this.appGraph.stream(
          { task },
          { streamMode: 'updates' }
        );

        for await (const chunk of stream) {
          const nodeName = Object.keys(chunk)[0];
          const nodeOutput = chunk[nodeName];

          subject.next({
            data: JSON.stringify({
              node: nodeName,
              timestamp: Date.now(),
              outputSummary: nodeOutput.messages?.[0]?.content || 'Node state updated',
            }),
          });
        }

        subject.next({ data: JSON.stringify({ status: 'COMPLETED' }) });
        subject.complete();
      } catch (err) {
        subject.error(err);
      }
    })();

    return subject.asObservable();
  }
}
