import { AllExceptionsFilter } from '@app/global/global.exception';
import { ResponseInterceptor } from '@app/global/global.interceptor';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { ApiModule } from './api.module';

async function bootstrap() {
  // setting up nestjs
  const app = await NestFactory.create(ApiModule, {
    logger:
      process.env.LOGS !== undefined
        ? (process.env.LOGS.split(',') as LogLevel[])
        : ['error', 'warn', 'log', 'fatal', 'debug', 'verbose'],
  });

  if (process.env.CORS && process.env.CORS != '') {
    // setting up cors
    app.enableCors({ origin: process.env.CORS.split(',') });
  }

  if (process.env.SWAGGER_ENABLE === 'true') {
    // HTTP Basic Auth for Swagger Docs
    app.use(
      '/docs/*',
      expressBasicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      }),
    );

    // setting up swagger
    const options = new DocumentBuilder()
      .setTitle(process.env.SWAGGER_TITLE || 'Crypitor Service')
      .setDescription(
        process.env.SWAGGER_DESCRIPTION ||
          'Crypitor Blockchain Activities Monitoring API',
      )
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  // setting up exception handler
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.SERVER_PORT);
}

bootstrap();
