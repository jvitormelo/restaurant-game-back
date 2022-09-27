import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateStockDto } from "./dto/create-stock.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";
import { Stock } from "./entities/stock.entity";

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

  findAll() {
    return this.stockRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  update(id: string, { quantity }: UpdateStockDto) {
    return this.stockRepository.save({ id, quantity: quantity });
  }

  remove(id: number) {
    return `This action removes a #${id} stock`;
  }
}
