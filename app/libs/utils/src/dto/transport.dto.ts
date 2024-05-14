export class BlockTransportDto {
  blockNumber: number;
  retry: number;
  confirmed: boolean;
  isError: boolean;
  error: any;

  constructor(
    blockNumber: number,
    confirmed: boolean,
    retry?: number,
    isError?: boolean,
    error?: any,
  ) {
    this.blockNumber = blockNumber;
    this.retry = retry;
    this.confirmed = confirmed;
    this.isError = isError;
    this.error = error;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
