import { Module } from "@nestjs/common";
import { registerOrderQueue } from "src/common/config/queues.config";
import { MenusModule } from "src/menus/menus.module";
import { RestaurantsModule } from "src/restaurants/restaurants.module";
import { StockModule } from "src/stock/stock.module";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";

@Module({
  imports: [registerOrderQueue(), MenusModule, StockModule, RestaurantsModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
