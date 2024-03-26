import { Test, TestingModule } from '@nestjs/testing';
import { MonitorServiceController } from './monitor-service.controller';
import { MonitorServiceService } from './monitor-service.service';

describe('MonitorServiceController', () => {
  let monitorServiceController: MonitorServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MonitorServiceController],
      providers: [MonitorServiceService],
    }).compile();

    monitorServiceController = app.get<MonitorServiceController>(MonitorServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(monitorServiceController.getHello()).toBe('Hello World!');
    });
  });
});
