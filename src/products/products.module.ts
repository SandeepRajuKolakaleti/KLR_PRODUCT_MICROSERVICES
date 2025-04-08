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

@Module({
  imports: [
    HttpModule, 
    TypeOrmModule.forFeature([
      ProductEntity, 
      CategoryEntity, 
      SubCategoryEntity, 
      ChildCategoryEntity, 
      BrandEntity
    ])
  ],
  controllers: [ProductsController, CategoriesController, SubCategoriesController, ChildCategoriesController, BrandsController],
  providers: [ProductsService, CategoriesService, SubCategoriesService, ChildCategoriesService, BrandsService]
})
export class ProductsModule {}
