import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RemoveHashedPassInterceptor } from './remove-hashed-pass/remove-hashed-pass.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalInterceptors(new RemoveHashedPassInterceptor());
  const configService = app.get(ConfigService);
  const apiVersion = configService.get<string>('API_VERSION', 'v1');
  app.setGlobalPrefix(`api/${apiVersion}`);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
