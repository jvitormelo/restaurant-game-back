import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { IngredientsService } from "./ingredients.service";

@Controller("ingredients")
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  async findAll() {
    return this.ingredientsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateIngredientDto: UpdateIngredientDto
  ) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(":id")
  remove(@Param() id: string) {
    return this.ingredientsService.remove(id);
  }
}
