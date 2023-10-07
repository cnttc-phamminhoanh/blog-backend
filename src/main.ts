import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { LoggingInterceptor } from './interceptors/loggingInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog App')
    .setDescription('The API for Blog App')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Posts')
    .addTag('Users')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(new ValidationPipe({ validateCustomDecorators: true }))

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });

  await app.listen(3001);
}
bootstrap();
