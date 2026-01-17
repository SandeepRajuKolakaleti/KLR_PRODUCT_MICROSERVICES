import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../services/payments.service';
import { PaymentGateway } from 'src/razor-pay/models/payment-gateway.enum';
import { EventPattern } from '@nestjs/microservices';
import { ProductsService } from '../../../products/services/products.service';
import { AddToCartService } from '../../../products/services/add-to-cart/add-to-cart.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService, private productservice: ProductsService, private cartService: AddToCartService) {}
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

  @EventPattern('ORDER_CREATED')
  async handleOrderCreated(data: any) {
    console.log('Order received:', data);

    // Process product stockquantity to decrease stock
    if (data.Items && data.Items.length > 0) {
      data.Items.map(async (item) => {
        await this.productservice.decreaseStock(item.ProductId, item.Quantity);
      });
    } else {
      await this.productservice.decreaseStock(data.ProductId, data.Quantity);
    }

    // remove add to cart items after order is placed
    await this.cartService.clearCart(data.UserId);

    const success = true;

    if (success) {
      return { status: 'PAID', orderId: data.orderId };
    }
  }

}
