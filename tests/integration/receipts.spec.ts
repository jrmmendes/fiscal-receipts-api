import { AppModule } from '@/app.module';
import { QueueClient } from '@/infra/queue/queue.client';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import request from 'supertest';

describe('Fiscal Receipts - Integration Tests', () => {
  const testQueue: QueueClient = {
    push: jest.fn(),
  };

  let app: INestApplication<App>;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QueueClient)
      .useValue(testQueue)
      .compile();

    app = testModule.createNestApplication();
    await app.init();
  });

  it('When valid receipt payload and headers, expect to generate metadata and send encoded message to queue', async () => {
    const response = await request(app.getHttpServer())
      .post('/fiscal-receipts')
      .set('format', 'default')
      .set('source', 'pos-test')
      .send({
        code: 1,
        terminal: 'i312',
        clientName: 'Luke Skywalker',
        items: [
          {
            sku: 1,
            description: 'Light Saber',
            value: 100000,
          },
        ],
      });

      expect(response.status).toBe(HttpStatus.CREATED);
  });
});
