import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRandomValueFromArray } from "src/shared/getRandomValueFromArray";
import { LessThanOrEqual, Repository } from "typeorm";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";

import { MenuDish } from "./entities/menu.entity";

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(MenuDish)
    private menuRepository: Repository<MenuDish>
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    return this.menuRepository.save(createMenuDto);
  }

  findAll() {
    return this.menuRepository.find();
  }

  findOne(id: string) {
    return "";
  }

  async findRandomDish(restaurantLevel: number) {
    const menu = await this.menuRepository.find({
      where: {
        restaurantLevel: LessThanOrEqual(restaurantLevel),
      },
    });

    return getRandomValueFromArray<MenuDish>(menu);
  }

  update(id: string, updateMenuDto: UpdateMenuDto) {
    return this.menuRepository.save({
      id,
      ...updateMenuDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
