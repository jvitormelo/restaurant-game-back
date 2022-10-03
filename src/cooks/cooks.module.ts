import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueueName } from "src/common/constants/queue-name.constant";
import { DishesModule } from "src/dishes/dishes.module";
import { RestaurantsModule } from "src/restaurants/restaurants.module";
import { CooksConsumer } from "./cooks.consumer";
import { CooksController } from "./cooks.controller";
import { CooksService } from "./cooks.service";
import { Cooker } from "./entities/cooker.entity";

@Module({
  imports: [
    DishesModule,
    RestaurantsModule,
    TypeOrmModule.forFeature([Cooker]),
    BullModule.registerQueue({
      name: QueueName.COOKING_ORDER,
    }),
    BullModule.registerQueue({
      name: QueueName.ORDER,
    }),
  ],
  controllers: [CooksController],
  providers: [CooksService, CooksConsumer],
  exports: [CooksService],
})
export class CooksModule {}
