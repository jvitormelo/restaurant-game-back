import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueueName } from "src/common/constants/queue-name.constant";
import { MenuDish } from "src/menus/entities/menu.entity";
import { MenusService } from "src/menus/menus.service";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { StockService } from "src/stock/stock.service";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, MenuDish, Stock]),
    BullModule.registerQueue({
      name: QueueName.ORDER,
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, MenusService, StockService],
})
export class CustomersModule {}
