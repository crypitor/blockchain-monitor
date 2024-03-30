import { Test, TestingModule } from '@nestjs/testing';
import { PollingBlockService } from './polling.block.service';

describe('PollingBlockService', () => {
  let service: PollingBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollingBlockService],
    }).compile();

    service = module.get<PollingBlockService>(PollingBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
