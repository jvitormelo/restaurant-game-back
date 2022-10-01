import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bull";
import { CooksService } from "src/cooks/cooks.service";
import { IngredientCategory } from "src/ingredients/constants/category.enum";
import { IngredientQuality } from "src/ingredients/constants/quality.enum";
import { MenuDish } from "src/menus/entities/menu.entity";
import { MenusService } from "src/menus/menus.service";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { StockService } from "src/stock/stock.service";
import { Repository } from "typeorm";

export interface IngredientStock {
  id: string;
  name: string;
  quantity: number;
  category: IngredientCategory;
  quality: IngredientQuality;
}

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private menusService: MenusService,
    private stockService: StockService,
    private cooksService: CooksService,
    @InjectQueue("order") private orderQueue: Queue
  ) {}

  // @Interval(10000)
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

      const cooker = await this.cooksService.findAvailableCooker(restaurant.id);

      const payload = {
        restaurantId: restaurant.id,
        dish,
        ingredients,
        cooker,
      };

      await this.orderQueue.add(payload);
    } catch (e) {
      console.error(e.message);
    }
  }
}
