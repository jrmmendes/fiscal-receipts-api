import { AppModule } from '@/app.module';
import { FiscalReceiptsController } from '@/application/fiscal-receipts.controller';
import { IngestFiscalReceiptCommand } from '@/domain/ingest-fiscal-receipt.command';
import { QueueClient } from '@/infra/queue/queue.client';
import { INestApplication, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { when } from 'jest-when';
import { IngestFiscalReceiptBody } from '@/application/ingest-fiscal-receipt-body.dto';
import { Result } from '@/infra/data/result';

describe('Fiscal Receipts Controller -> Unit Tests', () => {
  const testQueue: QueueClient = {
    push: jest.fn(),
  };

  const command = {
    execute: jest.fn()
  } 

  let app: INestApplication<App>;
  let controller: FiscalReceiptsController;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QueueClient)
      .useValue(testQueue)
      .overrideProvider(IngestFiscalReceiptCommand)
      .useValue(command)
      .compile();

    app = testModule.createNestApplication();
    await app.init();

    controller = app.get(FiscalReceiptsController);
  });

  describe('ingest', () => {
    it('When "UNKNOWN_FORMAT" error type from command, expect to throw UnprocessableEntityException', async () => {
      const format = 'default';
      const source = 'test';
      const payload: IngestFiscalReceiptBody = {
        terminal: '123k',
        clientName: 'test',
        code: 123,
        items: [
          {
            description: 'test',
            sku: 123,
            value: 1000,
          },
        ],
      };

      when(command.execute)
        .calledWith({ format, source, payload })
        .mockReturnValue(
          Result.fail({
            type: 'UNKNOWN_FORMAT',
            source: 'test',
            message: 'test',
          }),
        );

      const execution = () => controller.ingest({ format, source }, payload);

      expect(execution).rejects.toThrow(UnprocessableEntityException);
    });
  });
});
