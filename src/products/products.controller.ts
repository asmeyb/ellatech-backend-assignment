import { Controller, Post, Get, Put, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AdjustProductDto } from './dto/adjust-product.dto';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put('adjust')
  @HttpCode(HttpStatus.OK)
  async adjust(@Body() adjustDto: AdjustProductDto): Promise<Product> {
    return this.productsService.adjustStock(adjustDto);
  }

  @Get('status/:productId')
  @HttpCode(HttpStatus.OK)
  async getStatus(@Param('productId') productId: string): Promise<Product> {
    return this.productsService.findOne(productId);
  }
}