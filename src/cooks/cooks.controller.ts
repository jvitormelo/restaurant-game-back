import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { RestaurantId } from "src/common/decorators/getRestaurantId.decorator";
import { CooksService } from "./cooks.service";
import { CreateCookDto } from "./dto/create-cooker.dto";
import { UpdateCookDto } from "./dto/update-cooker.dto";

@Controller("cooks")
export class CooksController {
  constructor(private readonly cooksService: CooksService) {}

  @Post("hire")
  async hire(@Body() createCookDto: CreateCookDto) {
    return this.cooksService.hire(createCookDto);
  }

  @Post()
  create(@Body() createCookDto: CreateCookDto) {
    return this.cooksService.create(createCookDto);
  }

  @Get()
  findAll(@RestaurantId() restaurantId: string) {
    return this.cooksService.findAll(restaurantId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cooksService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCookDto: UpdateCookDto) {
    return this.cooksService.update({ ...updateCookDto, id });
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cooksService.remove(+id);
  }
}
