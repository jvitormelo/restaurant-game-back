import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { BullModule } from "@nestjs/bull";
import { OrderConsumer } from "./orders.consumer";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cooker } from "src/cooks/entities/cooker.entity";
import { DishesService } from "src/dishes/dishes.service";
import { Dish } from "src/dishes/entities/dish.entity";
import { StockService } from "src/stock/stock.service";
import { Stock } from "src/stock/entities/stock.entity";
import { CooksService } from "src/cooks/cooks.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cooker, Dish, Stock]),
    BullModule.registerQueue({
      name: "order",
    }),
  ],
  controllers: [OrdersController],

  providers: [
    OrdersService,
    OrderConsumer,
    DishesService,
    StockService,
    CooksService,
  ],
})
export class OrdersModule {}
