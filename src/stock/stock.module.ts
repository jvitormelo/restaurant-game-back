import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ingredient } from "src/ingredients/entities/ingredient.entity";
import { IngredientsService } from "src/ingredients/ingredients.service";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { RestaurantsService } from "src/restaurants/restaurants.service";
import { Stock } from "./entities/stock.entity";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Ingredient, Restaurant])],
  controllers: [StockController],
  providers: [StockService, IngredientsService, RestaurantsService],
})
export class StockModule {}
