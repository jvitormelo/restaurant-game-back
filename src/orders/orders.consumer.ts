import { Processor, Process } from "@nestjs/bull";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bull";
import { Cooker } from "src/cooks/entities/cooker.entity";
import { IStock } from "src/customers/customers.service";
import { MenuDish } from "src/menus/entities/menu.entity";
import { Repository } from "typeorm";
interface OrderPayload {
  restaurantId: string;
  dish: MenuDish;
  ingredients: IStock;
  cooker: Cooker;
}

@Processor("order")
export class OrderConsumer {
  constructor(
    @InjectRepository(Cooker)
    private cookerRepository: Repository<Cooker>
  ) {}

  @Process()
  async transcode(job: Job<OrderPayload>) {
    await this.cookerRepository.update(job.data.cooker.id, {
      status: "unavailable",
    });
  }
}
