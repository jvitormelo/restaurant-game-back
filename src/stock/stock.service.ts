import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
}
