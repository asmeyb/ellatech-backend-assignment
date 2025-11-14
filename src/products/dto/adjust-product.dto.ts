// api/src/products/dto/adjust-product.dto.ts
import { IsNotEmpty, IsInt, Min, IsPositive, IsIn, IsString } from 'class-validator';
import { TransactionType } from '../../entities/transaction.entity';

export class AdjustProductDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  productId: number; // The product to adjust

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number; // The amount to add or remove

  @IsNotEmpty()
  @IsString()
  @IsIn([TransactionType.IN, TransactionType.OUT])
  type: TransactionType; // 'IN' to increase stock, 'OUT' to decrease
}