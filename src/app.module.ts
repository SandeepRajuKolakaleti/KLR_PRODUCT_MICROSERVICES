import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { VendorModule } from './vendor/vendor.module';
import { RazorpayProvider } from './razor-pay/services/razorpay.provider';
import { RazorPayModule } from './razor-pay/razor-pay.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ProductsModule,
    AuthModule,
    VendorModule,
    RazorPayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
