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

const MAXIMUM_ORDERS_PER_RESTAURANT = 5;

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

  @Interval(4000)
  handleCron() {
    this.makeOrder();
  }

  async makeOrder() {
    try {
      this.logger.log(`New customer arrived`);
      const [restaurant] = await this.restaurantRepository.find();

      const dish = await this.menusService.findRandomDish(restaurant.level);

      const restaurantStock = await this.stockService.findAll({
        where: {
          restaurantId: restaurant.id,
        },
      });

      const awaitingToCookQueue = await this.orderQueue.getFailedCount();

      if (awaitingToCookQueue > MAXIMUM_ORDERS_PER_RESTAURANT) {
        throw new Error("Too many orders awaiting to cook");
      }

      const ingredients = this.stockService.verifyStock(dish, restaurantStock);

      this.logger.log(`Ordering ${dish.name} from ${restaurant.name}`);

      await this.orderQueue.add({
        restaurantId: restaurant.id,
        dish,
        ingredients,
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
