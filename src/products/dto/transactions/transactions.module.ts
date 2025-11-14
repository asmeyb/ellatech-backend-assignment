// api/src/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../entities/transaction.entity';
import { TransactionsController } from './transactions.controller'; // Import the controller

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController], // Register the controller
  providers: [TransactionsService],
  exports: [TransactionsService], 
})
export class TransactionsModule {}