import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RemoveHashedPassInterceptor } from './remove-hashed-pass/remove-hashed-pass.interceptor';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
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
  
  // Serve static files from uploads directory using process.cwd()
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
