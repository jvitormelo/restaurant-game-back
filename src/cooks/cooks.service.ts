import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DishesService } from "src/dishes/dishes.service";
import { MenuDish } from "src/menus/entities/menu.entity";
import { RestaurantsService } from "src/restaurants/restaurants.service";
import { IngredientStock } from "src/stock/types/ingredient-stock";
import { Repository } from "typeorm";
import { CreateCookDto } from "./dto/create-cooker.dto";
import { UpdateCookDto } from "./dto/update-cooker.dto";
import { Cooker } from "./entities/cooker.entity";

const HIRE_COST = 100;

@Injectable()
export class CooksService {
  constructor(
    @InjectRepository(Cooker)
    private cookerRepository: Repository<Cooker>,
    private dishesService: DishesService,
    private restaurantService: RestaurantsService
  ) {}

  async hire(createCookDto: CreateCookDto) {
    await this.restaurantService.updateBalance(
      createCookDto.restaurantId,
      -HIRE_COST
    );
    return this.create(createCookDto);
  }

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

  update({ id, ...updateCookDto }: UpdateCookDto) {
    return this.cookerRepository.update(id, updateCookDto);
  }

  remove(id: number) {
    return `This action removes a #${id} cook`;
  }

  async findAvailableCooker(restaurantId: string) {
    return await this.cookerRepository.findOne({
      where: {
        restaurant: { id: restaurantId },
        status: "available",
      },
    });
  }

  async cook(
    cookerData: Cooker,
    dish: MenuDish,
    ingredients: IngredientStock[],
    restaurantId: string
  ) {
    const cooker = new Cooker(cookerData);
    const [createdDish] = await Promise.all([
      this.dishesService.create({
        cooker,
        ingredients,
        ...dish,
      }),
    ]);

    cooker.addExperience(createdDish.experience);
    cooker.status = "available";

    await Promise.all([
      this.update(cooker),
      this.restaurantService.updateBalance(restaurantId, createdDish.price),
    ]);
  }
}
