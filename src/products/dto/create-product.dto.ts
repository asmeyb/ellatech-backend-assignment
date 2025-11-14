// api/src/products/dto/create-product.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsInt, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  sku: string; // Stock Keeping Unit should be unique

  @IsNumber()
  @IsInt()
  @Min(0) // Stock cannot be negative upon creation
  stock: number;
}