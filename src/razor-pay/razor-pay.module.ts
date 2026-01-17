import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RazorpayProvider } from './services/razorpay.provider';
import { PaymentService } from './payments/services/payments.service';
import { PaymentController } from './payments/controllers/payments.controller';
import { PaypalService } from './payments/services/paypal.service';
import { RazorpayService } from './payments/services/razorpay.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [RazorpayProvider, RazorpayService, PaypalService, PaymentService],
  exports: ['RAZORPAY'],
})
export class RazorPayModule {}
