import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { Customer } from './customer.entity';
import { OrderItems } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    cascade: true,
  })
  customer: Customer;

  @Column({
    type: 'float',
    nullable: false,
  })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    nullable: false,
    default: OrderStatus.pending,
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItems, (orderItem) => orderItem.order, {
    cascade: ['update'],
  })
  orderItems: OrderItems[];
}
