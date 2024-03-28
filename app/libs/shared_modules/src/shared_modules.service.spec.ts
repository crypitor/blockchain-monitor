import { Test, TestingModule } from '@nestjs/testing';
import { SharedModulesService } from './shared_modules.service';

describe('SharedModulesService', () => {
  let service: SharedModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedModulesService],
    }).compile();

    service = module.get<SharedModulesService>(SharedModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
