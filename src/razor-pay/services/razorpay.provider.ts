// razorpay.provider.ts
import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';

export const RazorpayProvider = {
  provide: 'RAZORPAY',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new Razorpay({
      key_id: config.getOrThrow('RAZORPAY_KEY_ID'),
      key_secret: config.getOrThrow('RAZORPAY_KEY_SECRET'),
    });
  },
};
