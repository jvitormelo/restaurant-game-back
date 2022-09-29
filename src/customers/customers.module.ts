import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cooker } from "src/cooks/entities/cooker.entity";
import { MenuDish } from "src/menus/entities/menu.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, MenuDish, Stock, Cooker]),
    BullModule.registerQueue({
      name: "order",
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
