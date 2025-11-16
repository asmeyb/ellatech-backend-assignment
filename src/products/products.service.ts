import { 
  Injectable, 
  ConflictException, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { AdjustProductDto } from './dto/adjust-product.dto'; 
import { TransactionType } from '../entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource,
    private transactionsService: TransactionsService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productsRepository.findOne({ 
      where: { name: createProductDto.name }
    });

    if (existingProduct) {
      throw new ConflictException('A product with this name already exists.');
    }

    const newProduct = this.productsRepository.create({
      name: createProductDto.name,
      quantity: createProductDto.quantity || 0,
    });
    return this.productsRepository.save(newProduct);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return product;
  }

  async adjustStock(adjustDto: AdjustProductDto): Promise<Product> {
    return this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);

      const product = await productRepo.findOne({
        where: { id: adjustDto.productId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${adjustDto.productId} not found.`);
      }

      const newQuantity = product.quantity + adjustDto.changeAmount;

      if (newQuantity < 0) {
        throw new BadRequestException(
          `Insufficient stock. Current quantity: ${product.quantity}, requested change: ${adjustDto.changeAmount}`
        );
      }

      product.quantity = newQuantity;
      const updatedProduct = await productRepo.save(product);

      const transactionType = adjustDto.changeAmount > 0 
        ? TransactionType.INBOUND 
        : TransactionType.OUTBOUND;

      await this.transactionsService.createRecord(
        adjustDto.productId,
        Math.abs(adjustDto.changeAmount),
        transactionType,
        manager,
      );

      return updatedProduct;
    });
  }
}