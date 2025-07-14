import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLogger } from './log/logs.service';
import helmet from 'helmet';
import compression from 'compression';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Use custom logger
  app.useLogger(app.get(CustomLogger));

  // Enable security best practices
  app.use(helmet()); // Helps secure the app by setting HTTP headers
  app.use(compression()); // Improves performance by compressing responses

  // Enable CORS
  app.enableCors({
    origin: '*', // Consider tightening this for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Luxy API')
    .setDescription('API documentation for Luxy backend')
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT token input
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown fields
      forbidNonWhitelisted: true, // Throw error for unknown fields
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Luxy API running on http://localhost:${port}/api`,
    'Bootstrap',
  );
}
void bootstrap();
