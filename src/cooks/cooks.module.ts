import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  registerCookingOrderQueue,
  registerOrderQueue,
} from "src/common/config/queues.config";
import { DishesModule } from "src/dishes/dishes.module";
import { RestaurantsModule } from "src/restaurants/restaurants.module";
import { CooksConsumer } from "./cooks.consumer";
import { CooksController } from "./cooks.controller";
import { CooksService } from "./cooks.service";
import { Cooker } from "./entities/cooker.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cooker]),
    DishesModule,
    RestaurantsModule,
    registerCookingOrderQueue(),
    registerOrderQueue(),
  ],
  controllers: [CooksController],
  providers: [CooksService, CooksConsumer],
  exports: [CooksService],
})
export class CooksModule {}
