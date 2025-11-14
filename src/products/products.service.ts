// api/src/products/products.service.ts (Add imports)
import { 
  Injectable, 
  ConflictException, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // Import DataSource
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { AdjustProductDto } from './dto/adjust-product.dto'; 
import { TransactionType } from '../entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service'; // Import Transaction Service

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource, // Inject TypeORM's DataSource
    private transactionsService: TransactionsService, // Inject Transaction Service
  ) {}

  // POST /products implementation
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Check for unique SKU before attempting save (handles potential duplicate error gracefully)
    const existingProduct = await this.productsRepository.findOne({ 
        where: [{ name: createProductDto.name }, { sku: createProductDto.sku }] 
    });

    if (existingProduct) {
        // Return 409 Conflict if product name or SKU already exists
        throw new ConflictException('A product with this name or SKU already exists.');
    }

    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }

  // Helper method for other services (used later)
  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`); // Return 404 Not Found
    }
    return product;
  }

  // api/src/products/products.service.ts (New method)

async adjustStock(adjustDto: AdjustProductDto): Promise<Product> {
  // Use TypeORM's built-in transaction wrapper
  return this.dataSource.transaction(async (manager) => {
    const productRepo = manager.getRepository(Product);

    // 1. Fetch the product using PESSIMISTIC_WRITE lock
    // This locks the product row in the database for the duration of the transaction, 
    // ensuring no other concurrent requests can read or update it until this transaction is committed.
    const product = await productRepo.findOne({
      where: { id: adjustDto.productId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${adjustDto.productId} not found.`);
    }

    let newStock = product.stock;
    const quantityChange = adjustDto.quantity;

    if (adjustDto.type === TransactionType.OUT) {
      // 2. Check Business Logic: Insufficient Stock
      if (product.stock < quantityChange) {
        throw new BadRequestException('Insufficient stock to complete the adjustment.');
      }
      newStock -= quantityChange;
    } else { // TransactionType.IN
      newStock += quantityChange;
    }

    // 3. Update Product Stock (within the transaction)
    product.stock = newStock;
    const updatedProduct = await productRepo.save(product);

    // 4. Record Transaction History (within the same transaction)
    await this.transactionsService.createRecord(
      updatedProduct,
      quantityChange,
      adjustDto.type,
      manager, // Pass the transaction manager to use the same connection
    );

    // 5. If successful, the transaction commits automatically here.
    return updatedProduct;
  });
}
}