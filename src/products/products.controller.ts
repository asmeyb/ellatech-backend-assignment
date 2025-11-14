// api/src/products/products.controller.ts
import { Controller, Post, Get, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../entities/product.entity';
import { 
  // ... existing imports
  Put,
  Param 
} from '@nestjs/common';
import { AdjustProductDto } from './dto/adjust-product.dto'; // Import the new DTO

@Controller('products')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // POST /products
  @Post()
  @HttpCode(HttpStatus.CREATED) // Requirement: Proper HTTP status code (201 Created)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }
  // PUT /products/:id/adjust-stock
  // PUT /products/adjust
  @Put('adjust')
  @HttpCode(HttpStatus.OK) // PUT often returns 200 OK
  async adjust(@Body() adjustDto: AdjustProductDto): Promise<Product> {
    return this.productsService.adjustStock(adjustDto);
  }


  // GET /status/:productId
  @Get('status/:productId')
  @HttpCode(HttpStatus.OK) // 200 OK
  async getStatus(@Param('productId') productId: string): Promise<Product> {
    // ProductsService.findOne handles the 404 NotFoundException if product doesn't exist
    return this.productsService.findOne(parseInt(productId, 10));
  }


}