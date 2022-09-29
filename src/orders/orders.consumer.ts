import { Processor, Process } from "@nestjs/bull";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bull";
import { Cooker } from "src/cooks/entities/cooker.entity";
import { IStock } from "src/customers/customers.service";
import { DishesService } from "src/dishes/dishes.service";
import { MenuDish } from "src/menus/entities/menu.entity";
import { StockService } from "src/stock/stock.service";
import { Repository } from "typeorm";
interface OrderPayload {
  restaurantId: string;
  dish: MenuDish;
  ingredients: IStock[];
  cooker: Cooker;
}

@Processor("order")
export class OrderConsumer {
  constructor(
    @InjectRepository(Cooker)
    private cookerRepository: Repository<Cooker>,
    private readonly dishesService: DishesService,
    private readonly stockService: StockService
  ) {}

  @Process()
  async transcode(job: Job<OrderPayload>) {
    await this.cookerRepository.update(job.data.cooker.id, {
      status: "unavailable",
    });

    const createdDish = await this.dishesService.create({
      ...job.data,
      ...job.data.dish,
    });

    await this.cookerRepository.update(job.data.cooker.id, {
      status: "available",
      experience: job.data.cooker.experience + createdDish.experience,
    });

    job.data.ingredients.map(async (ingredient) => {
      const foundIngredient = await this.stockService.findOne(
        undefined,
        ingredient.id
      );

      const remainingQuantity = foundIngredient.quantity - ingredient.quantity;

      if (remainingQuantity <= 0) {
        await this.stockService.remove(foundIngredient.id);
      } else {
        await this.stockService.update(foundIngredient.id, {
          quantity: remainingQuantity,
        });
      }
    });
  }
}
