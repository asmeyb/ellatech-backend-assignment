// api/src/transactions/transactions.controller.ts
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // GET /transactions
  @Get()
  @HttpCode(HttpStatus.OK) // 200 OK
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }
}