import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { databaseConfig } from "./common/config/database.config";
import { CooksModule } from "./cooks/cooks.module";
import { CustomersModule } from "./customers/customers.module";
import { DishesModule } from "./dishes/dishes.module";
import { IngredientsModule } from "./ingredients/ingredients.module";
import { MenusModule } from "./menus/menus.module";
import { OrdersModule } from "./orders/orders.module";
import { RestaurantsModule } from "./restaurants/restaurants.module";
import { StockModule } from "./stock/stock.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    IngredientsModule,
    StockModule,
    RestaurantsModule,
    ScheduleModule.forRoot(),
    MenusModule,
    CustomersModule,
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    OrdersModule,
    CooksModule,
    DishesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
