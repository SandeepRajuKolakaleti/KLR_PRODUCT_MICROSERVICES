import { Injectable } from "@nestjs/common";
import { RazorpayService } from "./razorpay.service";
import { PaypalService } from "./paypal.service";
import { PaymentGateway } from "../../../razor-pay/models/payment-gateway.enum";

@Injectable()
export class PaymentService {
  constructor(
    private razorpay: RazorpayService,
    private paypal: PaypalService,
  ) {}

  createOrder(gateway: PaymentGateway, amount: number) {
    if (gateway === PaymentGateway.RAZORPAY) {
      return this.razorpay.createOrder(amount);
    }

    return this.paypal.createOrder(amount);
  }

  verifyPayment(gateway: PaymentGateway, payload: any) {
    if (gateway === PaymentGateway.RAZORPAY) {
      return this.razorpay.verifyPayment(payload);
    }

    return this.paypal.capture(payload.orderId);
  }
}
