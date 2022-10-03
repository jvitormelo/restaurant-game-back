import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { QueueName } from "src/common/constants/queue-name.constant";
import { MenusModule } from "src/menus/menus.module";
import { RestaurantsModule } from "src/restaurants/restaurants.module";
import { StockModule } from "src/stock/stock.module";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.ORDER,
    }),
    MenusModule,
    StockModule,
    RestaurantsModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
