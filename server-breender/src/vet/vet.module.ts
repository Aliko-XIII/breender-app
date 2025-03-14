import { Module } from '@nestjs/common';
import { VetService } from './vet.service';
import { VetController } from './vet.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
      JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
          }),
    ],
  controllers: [VetController],
  providers: [VetService],
})
export class VetModule {}
