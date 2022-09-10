import { Injectable } from "@nestjs/common";
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

  findOne(id: string) {
    return this.ingredientsRepository.findOneBy({
      id,
    });
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
