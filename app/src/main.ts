import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  // const options = new DocumentBuilder()
  //   .setTitle('Your API Title')
  //   .setDescription('Your API description')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
