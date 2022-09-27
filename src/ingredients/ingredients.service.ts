import { HttpStatus, Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common/exceptions";
import { RpcException } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { Ingredient } from "./entities/ingredient.entity";

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>
  ) {}

  create(createIngredientDto: CreateIngredientDto) {
    return this.ingredientsRepository.save(createIngredientDto);
  }

  findAll() {
    return this.ingredientsRepository.find();
  }

  async findOne(id: string) {
    const ingredient = await this.ingredientsRepository.findOneBy({
      id,
    });

    if (!ingredient) {
      throw new NotFoundException("Ingredient not found");
    }

    return ingredient;
  }

  update(id: string, updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsRepository.save({
      id,
      ...updateIngredientDto,
    });
  }

  remove(id: string) {
    return this.ingredientsRepository.delete(id);
  }
}
