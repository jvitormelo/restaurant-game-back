import { Module } from "@nestjs/common";
import { IngredientsService } from "./ingredients.service";
import { IngredientsController } from "./ingredients.controller";
import { Ingredient } from "./entities/ingredient.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
  exports: [IngredientsService],
})
export class IngredientsModule {}
