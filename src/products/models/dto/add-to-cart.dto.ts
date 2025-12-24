// dto/add-to-cart.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class AddToCartDto {
    @IsInt()
    @Type(() => Number)
    productId!: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    quantity!: number;
}


export class UpdateCartDto {
    @IsInt()
    @IsPositive()
    quantity!: number;
}
