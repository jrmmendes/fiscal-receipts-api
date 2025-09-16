import { ApiProperty } from '@nestjs/swagger';

export class FiscalReceiptItem {
  @ApiProperty()
  sku: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  value: number;
}

export class IngestFiscalReceiptBody {
  @ApiProperty()
  code: number;

  @ApiProperty()
  terminal: string;

  @ApiProperty()
  clientName: string;

  @ApiProperty({
    type: [FiscalReceiptItem]
  })
  items: FiscalReceiptItem[];
}
