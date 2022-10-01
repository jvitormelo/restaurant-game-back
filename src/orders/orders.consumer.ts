import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CooksService } from "src/cooks/cooks.service";
import { Cooker } from "src/cooks/entities/cooker.entity";
import { IngredientStock } from "src/customers/customers.service";
import { DishesService } from "src/dishes/dishes.service";
import { MenuDish } from "src/menus/entities/menu.entity";
import { StockService } from "src/stock/stock.service";
interface OrderPayload {
  restaurantId: string;
  dish: MenuDish;
  ingredients: IngredientStock[];
  cooker: Cooker;
}

@Processor("order")
export class OrderConsumer {
  constructor(
    private cooksService: CooksService,
    private readonly dishesService: DishesService,
    private readonly stockService: StockService
  ) {}

  @Process()
  async transcode(job: Job<OrderPayload>) {
    const cooker = new Cooker(job.data.cooker);

    cooker.status = "unavailable";

    await this.cooksService.update(job.data.cooker.id, cooker);

    job.data.ingredients.map(async (ingredient) => {
      const foundIngredient = await this.stockService.findOne({
        ingredientId: ingredient.id,
      });

      const remainingQuantity = foundIngredient.quantity - ingredient.quantity;

      if (remainingQuantity <= 0) {
        await this.stockService.remove(foundIngredient.id);
      } else {
        await this.stockService.update(foundIngredient.id, {
          quantity: remainingQuantity,
        });
      }
    });

    const createdDish = await this.dishesService.create({
      ...job.data,
      ...job.data.dish,
    });

    cooker.status = "available";

    cooker.addExperience(createdDish.experience);

    await this.cooksService.update(job.data.cooker.id, cooker);

    job.finished();
  }
}
