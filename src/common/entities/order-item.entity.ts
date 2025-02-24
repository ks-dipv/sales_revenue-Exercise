import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;

  @Column({
    type: 'int4',
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;
}
