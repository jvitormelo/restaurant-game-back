export class CreateMenuDto {
  name: string;

  description: string;

  price: number;

  vegetableQuantity?: number;
  fruitQuantity?: number;
  dairyQuantity?: number;
  meatQuantity?: number;
  fishQuantity?: number;
}
