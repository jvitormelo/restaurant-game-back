import { Module } from "@nestjs/common";
import { CooksService } from "./cooks.service";
import { CooksController } from "./cooks.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cooker } from "./entities/cooker.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cooker])],
  controllers: [CooksController],
  providers: [CooksService],
})
export class CooksModule {}
