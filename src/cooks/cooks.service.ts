import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCookDto } from "./dto/create-cooker.dto";
import { UpdateCookDto } from "./dto/update-cooker.dto";
import { Cooker } from "./entities/cooker.entity";

@Injectable()
export class CooksService {
  constructor(
    @InjectRepository(Cooker)
    private cookerRepository: Repository<Cooker>
  ) {}

  create(createCookDto: CreateCookDto) {
    return this.cookerRepository.save({
      ...createCookDto,
      restaurant: {
        id: createCookDto.restaurantId,
      },
    });
  }

  findAll() {
    return `This action returns all cooks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cook`;
  }

  update(id: string, updateCookDto: UpdateCookDto) {
    return this.cookerRepository.update(id, updateCookDto);
  }

  remove(id: number) {
    return `This action removes a #${id} cook`;
  }

  async findAvailableCooker(restaurantId: string) {
    const cooker = await this.cookerRepository.findOne({
      where: {
        restaurant: { id: restaurantId },
        status: "available",
      },
    });

    if (!cooker) {
      throw new Error("No available cooker");
    }
    return cooker;
  }
}
