// api/src/products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../entities/product.entity';
import { TransactionsModule } from '../transactions/transactions.module'; // Import it!

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TransactionsModule, 
  ], 
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}