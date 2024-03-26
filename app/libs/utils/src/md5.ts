import * as crypto from 'crypto';

export function hashMd5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}
