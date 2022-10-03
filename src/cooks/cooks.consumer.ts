import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { QueueName } from "src/common/constants/queue-name.constant";
import { OrderPayload } from "src/orders/orders.consumer";
import { CooksService } from "./cooks.service";
import { Cooker } from "./entities/cooker.entity";

export interface CookingOrderPayload extends OrderPayload {
  cooker: Cooker;
}

@Processor(QueueName.COOKING_ORDER)
export class CooksConsumer {
  constructor(private cooksService: CooksService) {}

  private readonly logger = new Logger(CooksConsumer.name);

  @Process()
  async cook(job: Job<CookingOrderPayload>) {
    try {
      const { cooker, dish, ingredients, restaurantId } = job.data;

      await this.cooksService.cook(cooker, dish, ingredients, restaurantId);

      this.logger.log(
        `[CookingQueue:${job.id}] ${dish.name} cooked by ${cooker.name}`
      );

      await this.cooksService.retryOrderJob();
    } catch (e) {
      this.logger.error(e?.message || e);
    }
  }
}
