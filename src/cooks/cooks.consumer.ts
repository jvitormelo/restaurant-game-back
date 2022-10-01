import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job, Queue } from "bull";
import { QueueName } from "src/common/constants/queue-name.constant";
import { OrderPayload } from "src/orders/orders.consumer";
import { CooksService } from "./cooks.service";
import { Cooker } from "./entities/cooker.entity";

export interface CookingOrderPayload
  extends Omit<OrderPayload, "restaurantId"> {
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
    const { cooker: cookerData, dish, ingredients } = job.data;

    this.logger.log(`Cooking ${dish.name} by ${cookerData.name}`);

    const cooker = new Cooker(cookerData);

    await this.cooksService.cook(cooker, dish, ingredients);

    this.logger.log(`Order ${job.id} cooked by ${cooker.name}`);

    const orderJobs = await this.orderQueue.getFailed();
    orderJobs.forEach((orderJob) => orderJob.retry());

    job.moveToCompleted();
  }
}
