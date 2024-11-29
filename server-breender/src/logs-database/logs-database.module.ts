import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsDatabaseService } from './logs-database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReqLog, ReqLogSchema } from './schemas/req-log.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGO_URI'),
          dbName: 'breender-logs',
        };
      },
    }),
    MongooseModule.forFeature([{ name: ReqLog.name, schema: ReqLogSchema }]),
  ],
  providers: [LogsDatabaseService],
  exports: [LogsDatabaseService],
})
export class LogsDatabaseModule {}
