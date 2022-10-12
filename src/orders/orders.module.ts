import { Module } from "@nestjs/common";
import {
  registerCookingOrderQueue,
  registerOrderQueue,
} from "src/common/config/queues.config";
import { CooksModule } from "src/cooks/cooks.module";
import { EventsModule } from "src/events/events.module";
import { StockModule } from "src/stock/stock.module";
import { OrderConsumer } from "./orders.consumer";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    CooksModule,
    StockModule,
    registerOrderQueue(),
    registerCookingOrderQueue(),
    EventsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderConsumer],
  exports: [OrdersService],
})
export class OrdersModule {}
