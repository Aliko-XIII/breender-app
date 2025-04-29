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
import { SqlInjectionMiddleware } from './sql-injection-check/sql-injection.middleware';
import { DocumentsModule } from './documents/documents.module';
import { PhotosModule } from './photos/photos.module';
import { RecordsModule } from './records/records.module';
import { RemindersModule } from './reminders/reminders.module';
import { PartnershipsModule } from './partnerships/partnerships.module';

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
    DocumentsModule,
    PhotosModule,
    RecordsModule,
    RemindersModule,
    PartnershipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(SqlInjectionMiddleware).forRoutes('*');
  }
}
