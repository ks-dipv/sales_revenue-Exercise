import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('revenue')
  totalRevenue() {
    return this.appService.totalRevenue();
  }

  @Get('customer/limit')
  limit() {
    return this.appService.getTopCustomersBySpending();
  }

  @Get('category/sales-revenue')
  getSalesCountAndRevenuePerCategory() {
    return this.appService.getSalesCountAndRevenuePerCategory();
  }

  @Get('order/count')
  getDailyOrderCountLast7Days() {
    return this.appService.getDailyOrderCountLast7Days();
  }

  @Get('order/each-customer')
  getAverageOrderValuePerCustomer() {
    return this.appService.getAverageOrderValuePerCustomer();
  }

  @Get('order/monthly')
  getMonthlySalesTrendLast6Months() {
    return this.appService.getMonthlySalesLast6Months();
  }
}
