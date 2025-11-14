// api/src/transactions/transactions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  // Function to create a history record, using the EntityManager from the parent transaction
  async createRecord(
    product: Product,
    quantity: number,
    type: TransactionType,
    manager: EntityManager,
  ): Promise<Transaction> {
    const transaction = manager.create(Transaction, {
      productId: product.id,
      quantityChange: quantity,
      type: type,
    });
    // This uses the shared transaction manager
    return manager.save(transaction); 
  }
  
  // Method to fetch all transactions (for GET /transactions later)
  async findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }
}