// wishlist.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistEntity } from '../../models/wish-list.entity';
import { AddToWishlistDto } from '../../models/dto/wish-list.dto';
import { Pagination } from 'src/products/models/pagination.interface';
import { firstValueFrom, from, map } from 'rxjs';
import { ProductsService } from '../products.service';

@Injectable()
export class WishListService {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
    private productService: ProductsService
  ) {}

  async add(userId: number, dto: AddToWishlistDto) {
    // 1. Fetch product from Product microservice
    const product = await firstValueFrom(
        this.productService.findOne(dto.productId)
    );

    if (!product) {
        throw new NotFoundException('Product not available');
    }

    console.log(product);
    const exists = await this.wishlistRepository.findOne({
      where: { userId, productId: dto.productId },
    });

    if (exists) {
      throw new ConflictException('Product already in wishlist');
    }

    const item = this.wishlistRepository.create({
      userId,
      productId: dto.productId,
      productName: product.Name,
      price: product.Price,
      status: product.Status
    });

    return this.wishlistRepository.save(item);
  }

  async getAll(userId: number, pagination: Pagination) {
    return from(this.wishlistRepository.findAndCount({
        where: { userId },
        skip: pagination.offset,
        take: pagination.limit,
        order: { createdAt: "DESC" }
    })).pipe(
    map(([carts, total]) => ({
        total: total,
        offset: pagination.offset,
        limit: pagination.limit,
        data: carts
    })));
  }

  async remove(userId: number, wishlistItemId: number) {
    const result = await this.wishlistRepository.delete({
      id: wishlistItemId,
      userId,
    });

    if (!result.affected) {
      throw new NotFoundException('Wishlist item not found');
    }

    return { message: 'Removed from wishlist' };
  }

  async clear(userId: number) {
    await this.wishlistRepository.delete({ userId });
    return { message: 'Wishlist cleared' };
  }
}
