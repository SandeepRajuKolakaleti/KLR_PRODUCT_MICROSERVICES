import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorService } from './services/vendor.service';
import { VendorController } from './controllers/vendor.controller';
import { UserEntity } from './models/vendor.entity';
import { ProductEntity } from 'src/products/models/product.entity';
import { ProductsService } from 'src/products/services/products.service';
import { UserPermissionEntity } from './models/user.permission.entity';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        HttpModule, 
        TypeOrmModule.forFeature([
            UserEntity,
            UserPermissionEntity,
            ProductEntity
        ])
    ],
    controllers: [VendorController],
    providers: [VendorService, ProductsService, AuthService, JwtService]
})
export class VendorModule {}
