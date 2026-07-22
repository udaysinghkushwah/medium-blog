import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const handlerName = context.getHandler().name;
    const className = context.getClass().name;
    const metadata = rpcContext.getContext();
    const startTime = Date.now();

    console.log(`📥 [gRPC Incoming Request] ${className}.${handlerName}()`);

    return next.handle().pipe(
      tap({
        next: (val) => {
          const duration = Date.now() - startTime;
          console.log(`📤 [gRPC Response Sent] ${className}.${handlerName}() +${duration}ms`);
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          console.error(`❌ [gRPC Error Failed] ${className}.${handlerName}() +${duration}ms`, err.message);
        },
      })
    );
  }
}
