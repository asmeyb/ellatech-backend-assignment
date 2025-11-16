import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Check } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('products')
@Check('"quantity" >= 0')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions: Transaction[];
}