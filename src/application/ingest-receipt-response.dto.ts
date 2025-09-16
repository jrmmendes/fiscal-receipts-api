import { FiscalReceipt } from '@/domain/fiscal-receipt.entity';
import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

export class IngestReceiptResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: string;

  static from(entity: FiscalReceipt) {
    const data = entity.serialize();
    return plainToInstance(IngestReceiptResponse, {
      id: data.id,
      timestamp: data.timestamp,
    });
  }
}
