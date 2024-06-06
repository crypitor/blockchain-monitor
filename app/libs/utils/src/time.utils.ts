import { Logger } from '@nestjs/common';

export async function measureTime<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  Logger.log(`Latency for [${label}]: ${(end - start).toFixed(3)}ms`);
  return result;
}

export function timing(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
