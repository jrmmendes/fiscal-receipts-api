import { IngestReceiptCommand } from '@/domain/ingest-fiscal-receipt.command';
import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';
import { IngestFiscalReceiptResponse } from './ingest-fiscal-receipt-response.dto';
import { IngestFiscalReceiptBody } from './ingest-fiscal-receipt-body.dto';

@Controller('fiscal-receipts')
export class FiscalReceiptsController {
  constructor(private readonly command: IngestReceiptCommand) {}

  @Post()
  @ApiCreatedResponse()
  @ApiHeader({
    name: 'format',
    enum: ['default', 'pos-json-v2'],
    required: true
  })
  @ApiHeader({
    name: 'source',
    required: true
  })
  async ingest(
    @Headers() headers: string,
    @Body() payload: IngestFiscalReceiptBody,
  ) {
    const format = headers['format'];
    const source = headers['source'];

    if (!payload) {
      throw new BadRequestException('Missing body')
    }

    if (!format) {
      throw new BadRequestException('Fiscal receipt format header missing');
    }

    if (!source) {
      throw new BadRequestException('Missing source header');
    }

    const ingestion = this.command.execute({
      format,
      source,
      payload,
    });

    if (ingestion.errorType === 'UNKNOWN_FORMAT') {
      throw new UnprocessableEntityException(ingestion.errorValue);
    }

    if (ingestion.hasError) {
      throw new InternalServerErrorException(ingestion.errorValue);
    }

    const receipt = ingestion.value;

    return IngestFiscalReceiptResponse.from(receipt);
  }
}
