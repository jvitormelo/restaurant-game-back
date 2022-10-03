import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IngredientsModule } from "src/ingredients/ingredients.module";
import { RestaurantsModule } from "src/restaurants/restaurants.module";
import { Stock } from "./entities/stock.entity";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Stock]),
    IngredientsModule,
    RestaurantsModule,
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
