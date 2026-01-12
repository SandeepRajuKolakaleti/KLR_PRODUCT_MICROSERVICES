// payment.service.ts
import { Inject, Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('RAZORPAY') private razorpay: Razorpay,
    private configService: ConfigService,
  ) {}

  async createOrder(amount: number) {
    return this.razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });
  }

  verifyPayment(payload: any) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = payload;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        this.configService.getOrThrow('RAZORPAY_KEY_SECRET'),
      )
      .update(body)
      .digest('hex');

    return expectedSignature === razorpay_signature;
  }
}
