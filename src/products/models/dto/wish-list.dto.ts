// dto/add-to-wishlist.dto.ts
import { IsInt } from 'class-validator';

export class AddToWishlistDto {
    @IsInt()
    productId!: number;
}
