import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Transaction, TransactionType } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async createRecord(
    productId: string,
    quantityChanged: number,
    type: TransactionType,
    manager?: EntityManager,
  ): Promise<Transaction> {
    const repo = manager 
      ? manager.getRepository(Transaction) 
      : this.transactionsRepository;

    const transaction = repo.create({
      productId,
      quantityChanged,
      type,
    });

    return repo.save(transaction);
  }

  async findAll(limit: number = 10, offset: number = 0) {
    const [transactions, total] = await this.transactionsRepository.findAndCount({
      relations: ['product'],
      order: { timestamp: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      data: transactions.map(t => ({
        id: t.id,
        productId: t.productId,
        productName: t.product?.name,
        type: t.type,
        quantityChanged: t.quantityChanged,
        timestamp: t.timestamp,
      })),
      total,
      limit,
      offset,
    };
  }
}
