import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { QueueName } from "src/common/constants/queue-name.constant";
import { CooksService } from "src/cooks/cooks.service";
import { MenuDish } from "src/menus/entities/menu.entity";
import { IngredientStock } from "src/stock/types/ingredient-stock";
import { Logger } from "@nestjs/common";
import { CookingOrderPayload } from "src/cooks/cooks.consumer";
import { StockService } from "src/stock/stock.service";

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
    private cookingOrderQueue: Queue<CookingOrderPayload>,
    private stockService: StockService
  ) {}

  private readonly logger = new Logger(OrderConsumer.name);

  @Process()
  async addToCookingQueue(job: Job<OrderPayload>) {
    try {
      const { restaurantId, dish, ingredients } = job.data;

      const cooker = await this.cooksService.findAvailableCooker(restaurantId);

      if (!cooker) {
        await job.moveToFailed({ message: "No available cookers" });

        throw new Error(
          `[OrderQueue: ${job.id}] No cooker available to make ${dish.name}`
        );
      }

      await Promise.all([
        this.stockService.removeIngredientsFromStock(ingredients),
        this.cooksService.update({
          id: cooker.id,
          status: "unavailable",
        }),
      ]);

      await this.cookingOrderQueue.add(
        {
          restaurantId,
          ingredients,
          dish,
          cooker,
        },
        { delay: dish.timeToCook }
      );

      this.logger.log(
        `[CookingQueue: ${job.id}] Added ${dish.name} to cooking queue for ${cooker.name}`
      );

      await job.moveToCompleted();
    } catch (e) {
      this.logger.error(e?.message || e);
    }
  }
}
