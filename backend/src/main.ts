import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exception/exception.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  app.use(cookieParser());
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('boardgame-record API')
    .setDescription('API description for boardgame-record')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('spec', app, documentFactory);

  app.useGlobalFilters(new HttpExceptionFilter(config));
  await app.listen(8000);
}
bootstrap();
