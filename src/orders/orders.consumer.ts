import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { QueueName } from "src/common/constants/queue-name.constant";
import { CooksService } from "src/cooks/cooks.service";
import { MenuDish } from "src/menus/entities/menu.entity";
import { IngredientStock } from "src/stock/types/ingredient-stock";
import { Logger } from "@nestjs/common";
import { CookingOrderPayload } from "src/cooks/cooks.consumer";

export interface OrderPayload {
  restaurantId: string;
  dish: MenuDish;
  ingredients: IngredientStock[];
}

@Processor(QueueName.ORDER)
export class OrderConsumer {
  constructor(
    private cooksService: CooksService,
    @InjectQueue(QueueName.COOKING_ORDER)
    private cookingOrderQueue: Queue<CookingOrderPayload>
  ) {}

  private readonly logger = new Logger(OrderConsumer.name);

  @Process()
  async addToCookingQueue(job: Job<OrderPayload>) {
    const { restaurantId, dish, ingredients } = job.data;

    const cooker = await this.cooksService.findAvailableCooker(restaurantId);

    if (!cooker) {
      this.logger.error(`No cooker available to make ${dish.name}`);
      return job.moveToFailed({ message: "No available cookers" });
    }

    await this.cooksService.update({
      id: cooker.id,
      status: "unavailable",
    });

    this.cookingOrderQueue.add(
      {
        ingredients,
        dish,
        cooker,
      },
      { delay: dish.timeToCook }
    );

    this.logger.log(
      `Order ${job.id} added to cooking queue for ${cooker.name}`
    );

    job.moveToCompleted();
  }
}
