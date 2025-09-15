import { Injectable } from '@nestjs/common';
import { Result } from '@/infra/data/result';

@Injectable()
export abstract class QueueClient {
  abstract push(message: Record<string, unknown>): Promise<Result<void>>;
}
