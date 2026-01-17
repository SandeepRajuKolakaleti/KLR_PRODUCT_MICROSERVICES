import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RazorpayProvider } from './services/razorpay.provider';
import { PaymentService } from './payments/services/payments.service';
import { PaymentController } from './payments/controllers/payments.controller';
import { PaypalService } from './payments/services/paypal.service';
import { RazorpayService } from './payments/services/razorpay.service';
import { ProductsService } from 'src/products/services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../products/models/product.entity';
import { AddToCartService } from 'src/products/services/add-to-cart/add-to-cart.service';
import { CartEntity } from 'src/products/models/cart.entity';

@Module({
  imports: [ConfigModule,
    TypeOrmModule.forFeature([
      ProductEntity,
      CartEntity
    ])
  ],
  controllers: [PaymentController],
  providers: [RazorpayProvider, RazorpayService, PaypalService, PaymentService, ProductsService, AddToCartService],
  exports: ['RAZORPAY'],
})
export class RazorPayModule {}
