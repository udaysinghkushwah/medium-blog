import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 LangGraph NestJS Multi-Agent Server running on http://localhost:${PORT}`);
  console.log(`📌 Test POST API: http://localhost:${PORT}/agents/run`);
  console.log(`📡 Test SSE Stream: http://localhost:${PORT}/agents/stream`);
}

bootstrap();
