import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bull";
import { Cooker } from "src/cooks/entities/cooker.entity";
import { IngredientCategory } from "src/ingredients/constants/category.enum";
import { IngredientQuality } from "src/ingredients/constants/quality.enum";
import { MenuDish } from "src/menus/entities/menu.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { LessThanOrEqual, Repository } from "typeorm";

export interface IStock {
  id: string;
  name: string;
  quantity: number;
  category: IngredientCategory;
  quality: IngredientQuality;
}

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(MenuDish)
    private menuRepository: Repository<MenuDish>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(Cooker)
    private cookerRepository: Repository<Cooker>,
    @InjectQueue("order") private orderQueue: Queue
  ) {}

  @Interval(10000)
  handleCron() {
    // this.makeOrder();
  }
  // TODO separate
  async makeOrder() {
    const [restaurant] = await this.restaurantRepository.find();

    const menu = await this.menuRepository.find({
      where: {
        restaurantLevel: LessThanOrEqual(restaurant.level),
      },
    });

    const dish = menu[Math.floor(Math.random() * menu.length)];

    const restaurantStock = await this.stockRepository.find({
      where: {
        restaurantId: restaurant.id,
      },
      relations: ["ingredient"],
    });

    const stock = restaurantStock.map((stock) => ({
      id: stock.ingredient.id,
      quantity: stock.quantity,
      category: stock.ingredient.category,
      quality: stock.ingredient.quality,
      name: stock.ingredient.name,
    }));

    try {
      const ingredients = this.verifyStock(dish, stock);
      const cooker = await this.findAvailableCooker(restaurant.id);

      const payload = {
        restaurantId: restaurant.id,
        dish,
        ingredients,
        cooker,
      };

      this.orderQueue.add(payload);
    } catch (e) {
      console.error(e.message);
    }
  }

  verifyStock(menu: MenuDish, stock: IStock[]) {
    const ingredients = [
      { key: "vegetable", category: IngredientCategory.VEGETABLE },
      { key: "fruit", category: IngredientCategory.FRUIT },
      { key: "dairy", category: IngredientCategory.DAIRY },
      { key: "meat", category: IngredientCategory.MEAT },
      { key: "fish", category: IngredientCategory.FISH },
    ];

    const toRemoveStock: IStock[] = [];

    ingredients.forEach(({ key, category }) => {
      const quantity = menu[`${key}Quantity`];

      if (!quantity) return;

      const result = this.verifyIfHaveIngredientInStock(
        quantity,
        category,
        stock
      );

      if (!result) {
        throw new Error(`Not enough ${key}`);
      }

      toRemoveStock.push(result);
    });

    return toRemoveStock;
  }

  verifyIfHaveIngredientInStock(
    ingredientQuantity: number,
    ingredientCategory: IngredientCategory,
    stock: IStock[]
  ) {
    const foundIngredient = this.findIngredientByCategory(
      ingredientCategory,
      stock
    );

    if (!foundIngredient || foundIngredient.quantity < ingredientQuantity)
      return false;

    return {
      id: foundIngredient.id,
      quantity: ingredientQuantity,
      quality: foundIngredient.quality,
      category: foundIngredient.category,
      name: foundIngredient.name,
    };
  }

  findIngredientByCategory(category: IngredientCategory, stock: IStock[]) {
    return stock.find((ingredient) => ingredient.category === category);
  }

  findAvailableCooker(restaurantId: string) {
    return this.cookerRepository.findOneOrFail({
      where: {
        restaurant: { id: restaurantId },
        status: "available",
      },
    });
  }
}
