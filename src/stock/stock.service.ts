import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IngredientStock } from "src/customers/customers.service";
import { IngredientCategory } from "src/ingredients/constants/category.enum";
import { MenuDish } from "src/menus/entities/menu.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateStockDto } from "./dto/create-stock.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";
import { Stock } from "./entities/stock.entity";

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
    private stockRepository: Repository<Stock>
  ) {}

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
    return this.stockRepository.save({ id, quantity: quantity });
  }

  remove(id: string) {
    return this.stockRepository.delete(id);
  }

  verifyStock(menu: MenuDish, stock: Stock[]) {
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
        throw new Error(`Not enough ${key}`);
      }

      toRemoveStock.push(result);
    });

    return toRemoveStock;
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
      quantity,
    } = foundStock;

    return {
      id,
      quantity,
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
}
