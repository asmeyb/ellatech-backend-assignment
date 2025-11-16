import { IsNotEmpty, IsString, IsNumber, IsInt, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  quantity?: number = 0;
}