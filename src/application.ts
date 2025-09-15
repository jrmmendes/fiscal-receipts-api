import {
  ConsoleLogger,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { fastify, FastifyInstance } from 'fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import awsLambdaFastify from '@fastify/aws-lambda';

export class Application {
  nestApp: INestApplication;
  fastifyInstance: FastifyInstance;

  async bootstrapNest() {
    const fastifyInstance = fastify();

    const nestApp = await NestFactory.create(
      AppModule,
      new FastifyAdapter(fastifyInstance as unknown),
      {
        logger: new ConsoleLogger({ json: true }),
      },
    );
    nestApp.useGlobalPipes(new ValidationPipe({ transform: true }));
    nestApp.enableCors();

    this.nestApp = nestApp;
    this.fastifyInstance = fastifyInstance;

    if (process.env.NODE_ENV?.toUpperCase() !== 'PRD') {
      this.enableSwagger();
    }

    await nestApp.init();
    return nestApp;
  }

  enableSwagger() {
    const config = new DocumentBuilder()
      .setTitle('Fiscal Receipts API')
      .setVersion('0.1.0')
      .addServer('/')
      .addServer(
        'https://fiscal-receipts-api-dev.mnds.api.br/v1',
        'DEV',
      )
      .addServer(
        'https://fiscal-receipts-api-hml.mnds.api.br/v1',
        'HML',
      )
      .addServer(
        'https://fiscal-receipts-api-prd.mnds.api.br/v1',
        'PRD',
      )
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(this.nestApp, config);
    SwaggerModule.setup('/docs', this.nestApp, document);
  }

  async setupFastifyServerless() {
    await this.bootstrapNest();
    return awsLambdaFastify(this.fastifyInstance);
  }
}
