import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { databaseConfig } from "./common/config/database.config";
import { IngredientsModule } from "./ingredients/ingredients.module";
import { StockModule } from "./stock/stock.module";
import { RestaurantsModule } from "./restaurants/restaurants.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    IngredientsModule,
    StockModule,
    RestaurantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
