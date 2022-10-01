import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DishesService } from "src/dishes/dishes.service";
import { MenuDish } from "src/menus/entities/menu.entity";
import { StockService } from "src/stock/stock.service";
import { IngredientStock } from "src/stock/types/ingredient-stock";
import { Repository } from "typeorm";
import { CreateCookDto } from "./dto/create-cooker.dto";
import { UpdateCookDto } from "./dto/update-cooker.dto";
import { Cooker } from "./entities/cooker.entity";

@Injectable()
export class CooksService {
  constructor(
    @InjectRepository(Cooker)
    private cookerRepository: Repository<Cooker>,
    private stockService: StockService,
    private dishesService: DishesService
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

  async cook(cooker: Cooker, dish: MenuDish, ingredients: IngredientStock[]) {
    const [createdDish] = await Promise.all([
      this.dishesService.create({
        cooker,
        ingredients,
        ...dish,
      }),
      this.stockService.removeIngredientsFromStock(ingredients),
    ]);

    cooker.addExperience(createdDish.experience);

    cooker.status = "available";

    await this.update(cooker);
  }
}
