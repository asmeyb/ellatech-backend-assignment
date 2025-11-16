import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
