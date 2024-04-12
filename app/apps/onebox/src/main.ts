import { AllExceptionsFilter } from '@app/global/global.exception';
import { ResponseInterceptor } from '@app/global/global.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { MainModule } from './main.module';

async function bootstrap() {
  // setting up nestjs
  const app = await NestFactory.create(MainModule);

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
      .setTitle(process.env.SWAGGER_TITLE || 'Blockchain Webhook API')
      .setDescription(
        process.env.SWAGGER_DESCRIPTION || 'The Blockchain Webhook API',
      )
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
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
