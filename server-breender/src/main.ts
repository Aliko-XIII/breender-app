import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  const apiVersion = configService.get<string>('API_VERSION', 'v1');
  app.setGlobalPrefix(`api/${apiVersion}`);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
