// paypal.service.ts
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalService {
  private api: string|undefined;

  constructor(private config: ConfigService) {
    this.api = this.config.get('PAYPAL_API');
  }

  private async getToken() {
    const auth = Buffer.from(
      `${this.config.get('PAYPAL_CLIENT_ID')}:${this.config.get('PAYPAL_CLIENT_SECRET')}`,
    ).toString('base64');

    const { data } = await axios.post(
      `${this.api}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return data.access_token;
  }

  async createOrder(amount: number) {
    const token = await this.getToken();

    const { data } = await axios.post(
      `${this.api}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2),
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  }

  async capture(orderId: string) {
    const token = await this.getToken();

    const { data } = await axios.post(
      `${this.api}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  }
}
