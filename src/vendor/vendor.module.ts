import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorService } from './services/vendor.service';
import { VendorController } from './controllers/vendor.controller';
import { VendorEntity } from './models/vendor.entity';
import { ProductEntity } from 'src/products/models/product.entity';
import { ProductsService } from 'src/products/services/products.service';

@Module({
    imports: [
        HttpModule, 
        TypeOrmModule.forFeature([
            VendorEntity,
            ProductEntity
        ])
    ],
    controllers: [VendorController],
    providers: [VendorService, ProductsService]
})
export class VendorModule {}
