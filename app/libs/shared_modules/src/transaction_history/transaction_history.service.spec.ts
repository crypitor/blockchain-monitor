import { Test, TestingModule } from '@nestjs/testing';
import { TransactionHistoryService } from './transaction_history.service';

describe('TransactionHistoryService', () => {
  let service: TransactionHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionHistoryService],
    }).compile();

    service = module.get<TransactionHistoryService>(TransactionHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
