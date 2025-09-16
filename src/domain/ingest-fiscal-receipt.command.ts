import { QueueClient } from '@/infra/queue/queue.client';
import { Formats } from './fiscal-receipt-formats.enum';
import { Result } from '@/infra/data/result';
import { randomUUID } from 'crypto';
import { DefaultError } from '@/infra/data/typing';
import { FiscalReceipt } from './fiscal-receipt.entity';
import { Injectable } from '@nestjs/common';

type IngestReceiptCommandArgs = {
  format: string;
  source: string;
  payload: unknown;
};

@Injectable()
export class IngestFiscalReceiptCommand {
  constructor(private readonly queueClient: QueueClient) {}

  execute({
    format,
    source,
    payload,
  }: IngestReceiptCommandArgs): Result<
    FiscalReceipt,
    DefaultError<'UNKNOWN_FORMAT'>
  > {
    if (Formats.DEFAULT !== format && Formats.POS_JSON_V2 !== format) {
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
