import { Injectable, Logger } from '@nestjs/common';
import { MonitorRepository } from '../repositories/monitor.repository';
import NodeCache = require('node-cache');

@Injectable()
export class MonitorWebhookService {
  private cache: NodeCache;
  constructor(private readonly monitorRepository: MonitorRepository) {
    this.cache = new NodeCache({
      stdTTL: 60,
      checkperiod: 60,
      useClones: false,
    });
    this.cache.on('expired', (_, value) => {
      this.increaseWebhookCountInDB(value.monitorId, value.count);
      Logger.debug('Cache stats: ', this.cache.stats);
    });
  }

  async increaseWebhookCount(monitorId: string, count = 1): Promise<boolean> {
    const minute = (new Date().getTime() / 1000 / 60).toFixed(0);
    const cacheKey = monitorId + '_' + minute;
    let cache: MonitorWebhookCountCache = this.cache.get(cacheKey);
    if (!cache) {
      cache = new MonitorWebhookCountCache(monitorId, 0);
      this.cache.set(cacheKey, cache);
    }
    cache.count += count;
    Logger.log(
      `Monitor Webhook Count cache ${cacheKey}: ${JSON.stringify(cache)}`,
    );
    return true;
  }

  async increaseWebhookCountInDB(
    monitorId: string,
    count = 1,
  ): Promise<boolean> {
    Logger.log(`increaseWebhookCountInDB: ${monitorId}-${count}`);
    return this.monitorRepository.increaseWebhookCount(monitorId, count);
  }
}

class MonitorWebhookCountCache {
  monitorId: string;
  count: number;
  constructor(monitorId: string, count: number) {
    this.monitorId = monitorId;
    this.count = count;
  }
}
