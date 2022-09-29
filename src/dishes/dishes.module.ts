import { Module } from "@nestjs/common";
import { DishesService } from "./dishes.service";
import { DishesController } from "./dishes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dish } from "./entities/dish.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule {}
