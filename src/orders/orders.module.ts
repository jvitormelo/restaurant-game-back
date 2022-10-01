import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueueName } from "src/common/constants/queue-name.constant";
import { CooksService } from "src/cooks/cooks.service";
import { Cooker } from "src/cooks/entities/cooker.entity";
import { DishesService } from "src/dishes/dishes.service";
import { Dish } from "src/dishes/entities/dish.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { StockService } from "src/stock/stock.service";
import { OrderConsumer } from "./orders.consumer";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cooker, Dish, Stock]),
    BullModule.registerQueue({
      name: QueueName.ORDER,
    }),
    BullModule.registerQueue({
      name: QueueName.COOKING_ORDER,
    }),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderConsumer,
    StockService,
    CooksService,
    DishesService,
  ],
})
export class OrdersModule {}
