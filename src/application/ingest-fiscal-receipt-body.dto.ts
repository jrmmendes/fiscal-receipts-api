import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';

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
  @IsNumber()
  code: number;

  @ApiProperty()
  @IsString()
  terminal: string;

  @ApiProperty()
  @IsString()
  clientName: string;

  @ApiProperty({
    type: [FiscalReceiptItem],
  })
  @IsArray()
  @ArrayMinSize(1)
  items: FiscalReceiptItem[];
}
