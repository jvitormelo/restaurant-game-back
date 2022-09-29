import { Module } from "@nestjs/common";
import { MenusService } from "./menus.service";
import { MenusController } from "./menus.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuDish } from "./entities/menu.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MenuDish])],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
