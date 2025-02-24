import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './common/entities/order.entity';
import { Repository } from 'typeorm';
import { Customer } from './common/entities/customer.entity';
import { Category } from './common/entities/category.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async totalRevenue() {
    return this.orderRepository
      .createQueryBuilder('order')
      .select("DATE_PART('month', order.createdAt) AS month")
      .addSelect('SUM(order.totalAmount)', 'totalRevenue')
      .where(
        'EXTRACT(YEAR FROM order.createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)',
      )
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getTopCustomersBySpending(): Promise<any[]> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .innerJoin('customer.orders', 'order')
      .select('customer.id', 'customerId')
      .addSelect('customer.name', 'customerName')
      .addSelect('SUM(order.totalAmount)', 'spent')
      .where("order.status = 'completed'")
      .groupBy('customer.id')
      .orderBy('spent', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async getSalesCountAndRevenuePerCategory(): Promise<any[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .innerJoin('category.products', 'product')
      .innerJoin('product.orderItems', 'orderItem')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(orderItem.id)', 'totalSold')
      .addSelect('SUM(orderItem.price)', 'totalRevenue')
      .groupBy('category.id')
      .getRawMany();
  }

  async getDailyOrderCountLast7Days(): Promise<any[]> {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('EXTRACT(DAY FROM order.createdAt ) AS orderDate')
      .addSelect('COUNT(order.id)', 'totalOrders')
      .where("order.createdAt >= CURRENT_DATE - INTERVAL '7 days'")
      .groupBy('orderDate')
      .orderBy('orderDate', 'ASC')
      .getRawMany();
  }

  async getAverageOrderValuePerCustomer(): Promise<any[]> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .innerJoin('customer.orders', 'order')
      .select('customer.id', 'customerId')
      .addSelect('customer.name', 'customerName')
      .addSelect('AVG(order.totalAmount)', 'averageOrderValue')
      .where("order.status = 'completed'")
      .groupBy('customer.id')
      .having('COUNT(order.id) >= 2')
      .getRawMany();
  }

  async getMonthlySalesLast6Months(): Promise<any[]> {
    return this.orderRepository
      .createQueryBuilder('order')
      .select('EXTRACT(MONTH FROM order.createdAt) AS month')
      .addSelect('SUM(order.totalAmount)', 'totalRevenue')
      .where("order.createdAt >= CURRENT_DATE - INTERVAL '6 months'")
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }
}
