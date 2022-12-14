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
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    IngredientsModule,
    StockModule,
    RestaurantsModule,
    MenusModule,
    CustomersModule,
    OrdersModule,
    CooksModule,
    DishesModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
