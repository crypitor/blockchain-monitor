import { Test, TestingModule } from '@nestjs/testing';
import { WorkerServiceController } from './worker-service.controller';
import { WorkerServiceService } from './worker-service.service';

describe('WorkerServiceController', () => {
  let workerServiceController: WorkerServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorkerServiceController],
      providers: [WorkerServiceService],
    }).compile();

    workerServiceController = app.get<WorkerServiceController>(WorkerServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workerServiceController.getHello()).toBe('Hello World!');
    });
  });
});
