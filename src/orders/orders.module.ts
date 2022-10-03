import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { QueueName } from "src/common/constants/queue-name.constant";
import { CooksModule } from "src/cooks/cooks.module";
import { StockModule } from "src/stock/stock.module";
import { OrderConsumer } from "./orders.consumer";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    CooksModule,
    StockModule,
    BullModule.registerQueue({
      name: QueueName.ORDER,
    }),
    BullModule.registerQueue({
      name: QueueName.COOKING_ORDER,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderConsumer],
  exports: [OrdersService],
})
export class OrdersModule {}
