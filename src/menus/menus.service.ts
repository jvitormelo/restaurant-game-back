import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

  findOne(id: number) {
    return `This action returns a #${id} menu`;
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
