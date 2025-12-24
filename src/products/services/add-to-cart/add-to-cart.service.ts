// add-to-cart.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom, from, map } from 'rxjs';
import { CartEntity } from '../../models/cart.entity';
import { AddToCartDto, UpdateCartDto } from '../../models/dto/add-to-cart.dto';
import { ProductsService } from '../products.service';
import { Pagination } from '../../../products/models/pagination.interface';

@Injectable()
export class AddToCartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private productService: ProductsService) {}

    async addToCart(userId: number, dto: AddToCartDto) {
        // 1. Fetch product from Product microservice
        const product = await firstValueFrom(
            this.productService.findOne(dto.productId)
        );

        if (!product) {
            throw new NotFoundException('Product not available');
        }

        console.log(product);

        // 2. Check if item already exists
        const existing = await this.cartRepository.findOne({
            where: {
                userId,
                productId: dto.productId,
            },
        });

        if (existing) {
            existing.quantity += dto.quantity;

            // Optional: update snapshot if price changed
            existing.price = product.Price;
            existing.productName = product.Name;

            return this.cartRepository.save(existing);
        }

        // 3. Create new cart item with snapshot
        const cartItem = this.cartRepository.create({
            userId,
            productId: dto.productId,
            quantity: dto.quantity,
            productName: product.Name,
            price: product.Price,
        });

        return this.cartRepository.save(cartItem);
    }

    async getCart(userId: number, pagination:Pagination) {
        return from(this.cartRepository.findAndCount({
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

    async updateQuantity(
        userId: number,
        cartItemId: number,
        dto: UpdateCartDto,
    ) {
        const item = await this.cartRepository.findOne({
        where: {
            id: cartItemId,
            userId,
        },
        });

        if (!item) {
            throw new NotFoundException('Cart item not found');
        }

        item.quantity = dto.quantity;
        return this.cartRepository.save(item);
    }

    async removeItem(userId: number, cartItemId: number) {
        const result = await this.cartRepository.delete({
            id: cartItemId,
            userId,
        });

        if (!result.affected) {
            throw new NotFoundException('Cart item not found');
        }

        return { message: 'Item removed from cart' };
    }

    async clearCart(userId: number) {
        await this.cartRepository.delete({ userId });
        return { message: 'Cart cleared successfully' };
    }
}
