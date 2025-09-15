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
import { ApiCreatedResponse } from '@nestjs/swagger';
import { IngestReceiptResponse } from './ingest-receipt-response.dto';

@Controller('fiscal-receipts')
export class ReceiptsController {
  constructor(private readonly command: IngestReceiptCommand) {}

  @Post()
  @ApiCreatedResponse()
  async ingest(
    @Headers() headers: string,
    @Body() payload: unknown,
  ) {
    const format = headers['format'];
    const source = headers['source'];

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

    return IngestReceiptResponse.from(receipt);
  }
}
