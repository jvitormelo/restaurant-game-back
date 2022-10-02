import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job, Queue } from "bull";
import { QueueName } from "src/common/constants/queue-name.constant";
import { OrderPayload } from "src/orders/orders.consumer";
import { CooksService } from "./cooks.service";
import { Cooker } from "./entities/cooker.entity";

export interface CookingOrderPayload extends OrderPayload {
  cooker: Cooker;
}

@Processor(QueueName.COOKING_ORDER)
export class CooksConsumer {
  private readonly logger = new Logger(CooksConsumer.name);

  constructor(
    private cooksService: CooksService,
    @InjectQueue(QueueName.ORDER) private orderQueue: Queue<OrderPayload>
  ) {}

  @Process()
  async cook(job: Job<CookingOrderPayload>) {
    try {
      const { cooker, dish, ingredients, restaurantId } = job.data;

      await this.cooksService.cook(cooker, dish, ingredients, restaurantId);

      this.logger.log(
        `[CookingQueue ${job.id}] ${dish.name} cooked by ${cooker.name}`
      );

      const orderJobs = await this.orderQueue.getFailed();
      if (orderJobs) {
        const orderJob = orderJobs[orderJobs.length - 1];

        if (orderJob) {
          await orderJob?.retry();
          this.logger.warn(
            `Retrying job ${orderJob.id}: ${orderJob.data.dish.name}`
          );
        }
      }

      job.moveToCompleted();
    } catch (e) {
      this.logger.error(e?.message || e);
    }
  }
}
