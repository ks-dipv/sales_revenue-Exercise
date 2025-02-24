import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import environmentValidation from './config/environment.validation';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { Customer } from './common/entities/customer.entity';
import { Order } from './common/entities/order.entity';
import { OrderItems } from './common/entities/order-item.entity';
import { Product } from './common/entities/product.entity';
import { Category } from './common/entities/category.entity';
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Order, OrderItems, Product, Category]),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env.development'],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
        port: +configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        database: configService.get('database.name'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
