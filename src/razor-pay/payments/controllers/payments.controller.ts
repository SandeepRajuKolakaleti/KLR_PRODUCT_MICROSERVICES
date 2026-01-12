// payment.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../services/payments.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-order')
  createOrder(@Body('amount') amount: number) {
    return this.paymentService.createOrder(amount);
  }

  @Post('verify')
  verifyPayment(@Body() body: any) {
    const isValid = this.paymentService.verifyPayment(body);

    if (!isValid) {
      return { success: false, message: 'Invalid signature' };
    }

    // 👉 Save order to DB here
    return { success: true };
  }
}
