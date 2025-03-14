import { Test, TestingModule } from '@nestjs/testing';
import { VetController } from '../vet.controller';
import { VetService } from '../vet.service';

describe('VetController', () => {
  let controller: VetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VetController],
      providers: [VetService],
    }).compile();

    controller = module.get<VetController>(VetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
