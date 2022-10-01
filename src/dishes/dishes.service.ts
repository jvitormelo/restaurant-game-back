import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDishDto } from "./dto/create-dish.dto";
import { UpdateDishDto } from "./dto/update-dish.dto";
import { Dish } from "./entities/dish.entity";

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>
  ) {}

  create(createDishDto: CreateDishDto) {
    const { cooker, ingredients } = createDishDto;

    const dish = new Dish();
    dish.cookedBy = cooker.id;
    dish.description = createDishDto.description;
    dish.name = createDishDto.name;
    dish.price = createDishDto.price;
    dish.experience = createDishDto.experience;
    dish.applyCookerBonus(cooker);
    dish.applyIngredientsBonus(ingredients);

    return this.dishRepository.save(dish);
  }

  findAll() {
    return `This action returns all dishes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dish`;
  }

  update(id: number, updateDishDto: UpdateDishDto) {
    return `This action updates a #${id} dish ${updateDishDto.cooker}`;
  }

  remove(id: number) {
    return `This action removes a #${id} dish`;
  }
}
