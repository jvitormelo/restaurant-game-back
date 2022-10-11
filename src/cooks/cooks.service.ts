import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bull";
import { QueueName } from "src/common/constants/queue-name.constant";
import { DishesService } from "src/dishes/dishes.service";
import { MenuDish } from "src/menus/entities/menu.entity";
import { OrderPayload } from "src/orders/orders.consumer";
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
    private restaurantService: RestaurantsService,
    @InjectQueue(QueueName.ORDER) private orderQueue: Queue<OrderPayload>
  ) {}

  private readonly logger = new Logger(CooksService.name);

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

  findAll(restaurantId: string) {
    return this.cookerRepository.find({
      where: {
        restaurant: { id: restaurantId },
      },
    });
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

  async retryOrderJob() {
    const orderJobs = await this.orderQueue.getFailed();
    if (orderJobs) {
      const orderJob = orderJobs[0];

      if (orderJob) {
        await orderJob.retry();
        this.logger.verbose(
          `Retrying job ${orderJob.id}: ${orderJob.data.dish.name}`
        );
      }
    }
  }
}
