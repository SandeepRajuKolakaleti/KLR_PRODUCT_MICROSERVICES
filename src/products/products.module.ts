import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { ProductEntity } from './models/product.entity';
import { CategoryEntity } from './models/category.entity';
import { CategoriesController } from './controllers/categories/categories.controller';
import { SubCategoriesController } from './controllers/sub-categories/sub-categories.controller';
import { CategoriesService } from './services/categories/categories.service';
import { SubCategoriesService } from './services/sub-categories/sub-categories.service';
import { SubCategoryEntity } from './models/sub-category.entity';
import { ChildCategoryEntity } from './models/child-category.entity';
import { BrandEntity } from './models/brand.entity';
import { ChildCategoriesController } from './controllers/child-categories/child-categories.controller';
import { BrandsController } from './controllers/brands/brands.controller';
import { ChildCategoriesService } from './services/child-categories/child-categories.service';
import { BrandsService } from './services/brands/brands.service';
import { AddToCartController } from './controllers/add-to-cart/add-to-cart.controller';
import { WishListController } from './controllers/wish-list/wish-list.controller';
import { AddToCartService } from './services/add-to-cart/add-to-cart.service';
import { WishListService } from './services/wish-list/wish-list.service';
import { CartEntity } from './models/cart.entity';
import { WishlistEntity } from './models/wish-list.entity';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { RedisCacheModule } from './services/redis/redis.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    RedisCacheModule,
    TypeOrmModule.forFeature([
      ProductEntity, 
      CategoryEntity, 
      SubCategoryEntity, 
      ChildCategoryEntity, 
      BrandEntity,
      CartEntity,
      WishlistEntity
    ])
  ],
  controllers: [ProductsController, CategoriesController, SubCategoriesController, ChildCategoriesController, BrandsController, AddToCartController, WishListController],
  providers: [ProductsService, CategoriesService, SubCategoriesService, ChildCategoriesService, BrandsService, AddToCartService, WishListService, UserService]
})
export class ProductsModule {}
