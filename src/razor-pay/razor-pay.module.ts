import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RazorpayProvider } from './services/razorpay.provider';
import { PaymentService } from './payments/services/payments.service';
import { PaymentController } from './payments/controllers/payments.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [RazorpayProvider, PaymentService],
  exports: ['RAZORPAY'],
})
export class RazorPayModule {}
