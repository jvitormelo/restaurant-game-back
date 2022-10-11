import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common/services";
import { Interval } from "@nestjs/schedule";
import { Queue } from "bull";
import { QueueName } from "src/common/constants/queue-name.constant";
import { MenusService } from "src/menus/menus.service";
import { OrderPayload } from "src/orders/orders.consumer";
import { RestaurantsService } from "src/restaurants/restaurants.service";
import { StockService } from "src/stock/stock.service";

const MAXIMUM_ORDERS_PER_RESTAURANT = 3;

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    private restaurantService: RestaurantsService,
    private menusService: MenusService,
    private stockService: StockService,
    @InjectQueue(QueueName.ORDER) private orderQueue: Queue<OrderPayload>
  ) {}

  @Interval(2000)
  handleCron() {
    this.makeOrder();
  }

  async makeOrder() {
    try {
      const [restaurant] = await this.restaurantService.findAll();

      const dish = await this.menusService.findRandomDish(restaurant.level);

      const restaurantStock = await this.stockService.findAll({
        where: {
          restaurantId: restaurant.id,
        },
      });

      const ingredients = this.stockService.verifyStock(dish, restaurantStock);

      const awaitingToCookQueue = await this.orderQueue.getFailedCount();

      if (awaitingToCookQueue >= MAXIMUM_ORDERS_PER_RESTAURANT) {
        throw new Error(
          `Too many orders awaiting to cook, maximum is ${MAXIMUM_ORDERS_PER_RESTAURANT}.
          In queue ${awaitingToCookQueue}`
        );
      }

      this.logger.warn(`Ordering ${dish.name} for ${restaurant.name}`);

      await this.orderQueue.add(
        {
          restaurantId: restaurant.id,
          dish,
          ingredients,
        },
        { removeOnComplete: true }
      );
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
