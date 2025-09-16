import { Module } from '@nestjs/common';
import { FiscalReceiptsController } from './application/fiscal-receipts.controller';
import { QueueClient } from './infra/queue/queue.client';
import { MockQueueAdapter } from './infra/queue/adapters/mock-queue.adapter';
import { LoggerModule } from 'nestjs-pino';
import { pinoHttp } from './infra/logger/logger.config';
import { IngestReceiptCommand } from './domain/ingest-fiscal-receipt.command';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: pinoHttp,
    }),
  ],
  controllers: [FiscalReceiptsController],
  providers: [
    IngestReceiptCommand,
    {
      provide: QueueClient,
      useClass: MockQueueAdapter,
    },
  ],
})
export class AppModule {}
