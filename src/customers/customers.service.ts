import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common/services";
import { Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bull";
import { QueueName } from "src/common/constants/queue-name.constant";
import { MenusService } from "src/menus/menus.service";
import { OrderPayload } from "src/orders/orders.consumer";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { StockService } from "src/stock/stock.service";
import { Repository } from "typeorm";

const MAXIMUM_ORDERS_PER_RESTAURANT = 3;

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private menusService: MenusService,
    private stockService: StockService,
    @InjectQueue(QueueName.ORDER) private orderQueue: Queue<OrderPayload>
  ) {}

  @Interval(1000)
  handleCron() {
    this.makeOrder();
  }

  async makeOrder() {
    try {
      const [restaurant] = await this.restaurantRepository.find();

      const dish = await this.menusService.findRandomDish(restaurant.level);

      const restaurantStock = await this.stockService.findAll({
        where: {
          restaurantId: restaurant.id,
        },
      });

      const ingredients = this.stockService.verifyStock(dish, restaurantStock);

      const [failedCount, queueCount] = await Promise.all([
        this.orderQueue.getFailedCount(),
        this.orderQueue.count(),
      ]);

      const awaitingToCookQueue = failedCount + queueCount;

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
