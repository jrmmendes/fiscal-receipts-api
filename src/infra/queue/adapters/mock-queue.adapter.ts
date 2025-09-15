import { Injectable } from "@nestjs/common";
import { QueueClient } from "../queue.client";
import { Result } from "@/infra/data/result";

@Injectable()
export class MockQueueAdapter implements QueueClient {
  push(message: Record<string, unknown>): Promise<Result<void>> {
    console.log(JSON.stringify(message))
    return;
  }
}

