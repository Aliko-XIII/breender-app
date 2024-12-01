import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AnimalsModule } from './animals/animals.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LogsDatabaseModule } from './logs-database/logs-database.module';
import { OwnerModule } from './owner/owner.module';
import { VetModule } from './vet/vet.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AnimalsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    LogsDatabaseModule,
    OwnerModule,
    VetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
