import { Test, TestingModule } from '@nestjs/testing';
import { LogsDatabaseService } from '../logs-database.service';

describe('LogsDatabaseService', () => {
  let service: LogsDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsDatabaseService],
    }).compile();

    service = module.get<LogsDatabaseService>(LogsDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
