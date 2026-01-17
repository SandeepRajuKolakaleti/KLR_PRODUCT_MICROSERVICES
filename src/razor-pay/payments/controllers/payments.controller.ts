// payment.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../services/payments.service';
import { PaymentGateway } from 'src/razor-pay/models/payment-gateway.enum';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-order')
  createOrder(@Body() body: { gateway: PaymentGateway; amount: number }) {
    return this.paymentService.createOrder(body.gateway, body.amount);
  }

  @Post('verify')
  verifyPayment(@Body() body: { gateway: PaymentGateway; payload: any }) {
    const isValid = this.paymentService.verifyPayment(body.gateway, body.payload);

    if (!isValid) {
      return { success: false, message: 'Invalid signature' };
    }

    // 👉 Save order to DB here
    return { success: true };
  }
}
