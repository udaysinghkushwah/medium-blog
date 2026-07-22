import { Catch, RpcExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { status as gRPCStatus } from '@grpc/grpc-js';

@Catch()
export class ProductionGrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    console.error('💥 [gRPC Exception Filter Captured Error]:', exception);

    // If it is already an RpcException, return it directly
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    // Map HTTP / Business exceptions to standard gRPC Status Codes
    let grpcCode: gRPCStatus = gRPCStatus.INTERNAL;
    let message = exception.message || 'Internal Server Error';

    if (exception.status === HttpStatus.NOT_FOUND || exception.name === 'NotFoundException') {
      grpcCode = gRPCStatus.NOT_FOUND;
    } else if (exception.status === HttpStatus.BAD_REQUEST || exception.name === 'BadRequestException') {
      grpcCode = gRPCStatus.INVALID_ARGUMENT;
    } else if (exception.status === HttpStatus.UNAUTHORIZED) {
      grpcCode = gRPCStatus.UNAUTHENTICATED;
    } else if (exception.status === HttpStatus.FORBIDDEN) {
      grpcCode = gRPCStatus.PERMISSION_DENIED;
    }

    return throwError(() => ({
      code: grpcCode,
      message: message,
      details: exception.response || null,
    }));
  }
}
