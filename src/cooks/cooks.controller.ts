import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CooksService } from "./cooks.service";
import { CreateCookDto } from "./dto/create-cooker.dto";
import { UpdateCookDto } from "./dto/update-cooker.dto";

@Controller("cooks")
export class CooksController {
  constructor(private readonly cooksService: CooksService) {}

  @Post()
  create(@Body() createCookDto: CreateCookDto) {
    return this.cooksService.create(createCookDto);
  }

  @Get()
  findAll() {
    return this.cooksService.findAll();
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
