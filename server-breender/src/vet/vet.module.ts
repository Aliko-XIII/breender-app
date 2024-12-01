import { Module } from '@nestjs/common';
import { VetService } from './vet.service';
import { VetController } from './vet.controller';

@Module({
  controllers: [VetController],
  providers: [VetService],
})
export class VetModule {}
