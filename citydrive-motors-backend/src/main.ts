import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as path from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const logger = new Logger('Bootstrap');

  const allowedOrigins = [
    'http://localhost:5173',
    'https://city-drive-motors.vercel.app/',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.some((o) => origin.includes(o.split('://')[1]))
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  app.use(
    '/uploads',
    require('express').static(path.join(__dirname, '..', 'uploads')),
  );

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  const config = new DocumentBuilder()
    .setTitle('CityDrive Motors API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);

  logger.log(`Application running on port ${port}`);
  logger.log(`Health check: ${await app.getUrl()}/health`);
  logger.log(`Swagger docs: ${await app.getUrl()}/api-docs`);
}
bootstrap();
