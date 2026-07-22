import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create NestJS Microservice with gRPC Transport
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: join(__dirname, '../../proto/hero.proto'),
      url: '0.0.0.0:50051',
    },
  });

  await app.listen();
  console.log('🚀 NestJS gRPC Microservice is listening on port 50051');
}

bootstrap();
