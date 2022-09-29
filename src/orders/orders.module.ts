import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { BullModule } from "@nestjs/bull";
import { OrderConsumer } from "./orders.consumer";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cooker } from "src/cooks/entities/cooker.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cooker]),
    BullModule.registerQueue({
      name: "order",
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderConsumer],
})
export class OrdersModule {}
