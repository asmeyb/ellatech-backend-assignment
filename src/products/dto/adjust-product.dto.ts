import { IsNotEmpty, IsInt, IsUUID } from 'class-validator';

export class AdjustProductDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  changeAmount: number; // Positive for INBOUND, negative for OUTBOUND
}