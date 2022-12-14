import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IngredientCategory } from "src/ingredients/constants/category.enum";
import { IngredientsService } from "src/ingredients/ingredients.service";
import { MenuDish } from "src/menus/entities/menu.entity";
import { RestaurantsService } from "src/restaurants/restaurants.service";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateStockDto } from "./dto/create-stock.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";
import { Stock } from "./entities/stock.entity";
import { IngredientStock } from "./types/ingredient-stock";

interface FindOneParams {
  id?: string;
  ingredientId?: string;
}

interface FindAllParams {
  where?: FindOptionsWhere<Stock>;
}

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    private ingredientService: IngredientsService,
    private restaurantService: RestaurantsService
  ) {}

  async buyIngredients({
    ingredientId,
    quantity,
    restaurantId,
  }: CreateStockDto) {
    const [ingredient, stockIngredient] = await Promise.all([
      this.ingredientService.findOne(ingredientId),
      this.findOne({ ingredientId }),
    ]);

    const totalPrice = ingredient.price * quantity;

    await this.restaurantService.updateBalance(restaurantId, -totalPrice);

    if (!stockIngredient) {
      return this.create({ ingredientId, quantity, restaurantId });
    }
    return this.update(stockIngredient.id, {
      quantity: stockIngredient.quantity + quantity,
    });
  }

  create(createStockDto: CreateStockDto) {
    const stock = new Stock(createStockDto);
    return this.stockRepository.save(stock);
  }

  findAll(params?: FindAllParams) {
    return this.stockRepository.find({
      relations: ["ingredient"],
      where: params?.where,
    });
  }

  findOne({ id, ingredientId }: FindOneParams) {
    return this.stockRepository.findOneBy({ id, ingredientId });
  }

  update(id: string, { quantity }: UpdateStockDto) {
    return this.stockRepository.save({ id, quantity });
  }

  remove(id: string) {
    return this.stockRepository.delete(id);
  }

  verifyStock(menu: MenuDish, stock: Stock[]): IngredientStock[] | string {
    try {
      const ingredients = [
        { key: "vegetable", category: IngredientCategory.VEGETABLE },
        { key: "fruit", category: IngredientCategory.FRUIT },
        { key: "dairy", category: IngredientCategory.DAIRY },
        { key: "meat", category: IngredientCategory.MEAT },
        { key: "fish", category: IngredientCategory.FISH },
      ];

      const toRemoveStock: IngredientStock[] = [];

      ingredients.forEach(({ key, category }) => {
        const quantity = menu[`${key}Quantity`];

        if (!quantity) return;

        const result = this.verifyIfHaveIngredientInStock(
          quantity,
          category,
          stock
        );

        if (!result) {
          throw key;
        }

        toRemoveStock.push(result);
      });

      return toRemoveStock;
    } catch (error) {
      return error;
    }
  }

  private verifyIfHaveIngredientInStock(
    ingredientQuantity: number,
    ingredientCategory: IngredientCategory,
    stock: Stock[]
  ) {
    const foundStock = this.findIngredientByCategory(ingredientCategory, stock);

    if (!foundStock || foundStock.quantity < ingredientQuantity) return false;

    const {
      ingredient: { id, quality, category, name },
    } = foundStock;

    return {
      id,
      quantity: ingredientQuantity,
      quality,
      category,
      name,
    };
  }

  private findIngredientByCategory(
    category: IngredientCategory,
    stock: Stock[]
  ) {
    return stock.find(({ ingredient }) => ingredient.category === category);
  }

  async removeIngredientsFromStock(ingredients: IngredientStock[]) {
    const promises = ingredients.map(async (ingredient) => {
      const stockIngredient = await this.findOne({
        ingredientId: ingredient.id,
      });

      if (!stockIngredient) {
        // throw new Error("Ingredient in stock not found");
        return;
      }

      const remainingQuantity = stockIngredient.quantity - ingredient.quantity;

      if (remainingQuantity <= 0) {
        await this.remove(stockIngredient.id);
      } else {
        await this.update(stockIngredient.id, {
          quantity: remainingQuantity,
        });
      }
    });

    await Promise.all(promises);
  }
}
