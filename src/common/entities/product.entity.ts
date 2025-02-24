import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { OrderItems } from './order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;

  @OneToMany(() => OrderItems, (orderItem) => orderItem.product)
  orderItems: OrderItems[];
}
