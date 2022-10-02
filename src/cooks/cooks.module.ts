import { Module } from "@nestjs/common";
import { CooksService } from "./cooks.service";
import { CooksController } from "./cooks.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cooker } from "./entities/cooker.entity";
import { BullModule } from "@nestjs/bull";
import { QueueName } from "src/common/constants/queue-name.constant";
import { DishesService } from "src/dishes/dishes.service";
import { StockService } from "src/stock/stock.service";
import { CooksConsumer } from "./cooks.consumer";
import { Dish } from "src/dishes/entities/dish.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { RestaurantsService } from "src/restaurants/restaurants.service";
import { IngredientsService } from "src/ingredients/ingredients.service";
import { Ingredient } from "src/ingredients/entities/ingredient.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cooker, Dish, Stock, Restaurant, Ingredient]),
    BullModule.registerQueue({
      name: QueueName.COOKING_ORDER,
    }),
    BullModule.registerQueue({
      name: QueueName.ORDER,
    }),
  ],
  controllers: [CooksController],
  providers: [
    CooksService,
    DishesService,
    StockService,
    CooksService,
    CooksConsumer,
    RestaurantsService,
    IngredientsService,
  ],
})
export class CooksModule {}
