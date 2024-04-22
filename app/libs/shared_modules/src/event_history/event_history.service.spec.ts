import { Test, TestingModule } from '@nestjs/testing';
import { EventHistoryService } from './event_history.service';

describe('EventHistoryService', () => {
  let service: EventHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventHistoryService],
    }).compile();

    service = module.get<EventHistoryService>(EventHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
