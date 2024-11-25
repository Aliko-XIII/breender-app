import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AnimalsModule } from './animals/animals.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UsersModule, AnimalsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
