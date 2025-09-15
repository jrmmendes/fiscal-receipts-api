import { QueueClient } from '@/infra/queue/queue.client';
import { Formats } from './fiscal-receipt-formats.enum';
import { Result } from '@/infra/data/result';
import { randomUUID } from 'crypto';
import { DefaultError } from '@/infra/data/typing';

type IngestReceiptCommandArgs = {
  format: string;
  source: string;
  payload: unknown;
};

export class IngestReceiptCommand {
  constructor(private readonly queueClient: QueueClient) {}

  execute({
    format,
    source,
    payload,
  }: IngestReceiptCommandArgs): Result<
    FiscalReceipt,
    DefaultError<'UNKNOWN_FORMAT'>
  > {
    if (!Formats[format]) {
      return Result.fail({
        type: 'UNKNOWN_FORMAT',
        message: `Invalid format provided ${format}`,
        source: this.constructor.name,
      });
    }

    const receipt = new FiscalReceipt({
      format,
      payload,
      source,
      id: randomUUID(),
      timestamp: new Date().toISOString(),
    });

    this.queueClient.push(receipt.serialize());

    return Result.success(receipt);
  }
}
