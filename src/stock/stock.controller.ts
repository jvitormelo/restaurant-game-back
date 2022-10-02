import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";

import { StockService } from "./stock.service";
import { CreateStockDto } from "./dto/create-stock.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";

@Controller("stocks")
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post("buy/:id")
  buy(
    @Param("id") id: string,
    @Body() createStockDto: Omit<CreateStockDto, "ingredientId">
  ) {
    return this.stockService.buyIngredients({
      ...createStockDto,
      ingredientId: id,
    });
  }

  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  findOne(@Param() id: string) {
    return this.stockService.findOne({ id });
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(":id")
  remove(@Param() id: string) {
    return this.stockService.remove(id);
  }
}
