import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ) {}

  create(createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantRepository.save(createRestaurantDto);
  }

  findAll() {
    return this.restaurantRepository.find();
  }

  findOne(id: string) {
    return this.restaurantRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant ${updateRestaurantDto}`;
  }

  // TODO MOVE TO QUEUE
  async updateBalance(id: string, amount: number) {
    const restaurant = await this.findOne(id);

    return this.restaurantRepository.update(id, {
      money: restaurant.money + amount,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
