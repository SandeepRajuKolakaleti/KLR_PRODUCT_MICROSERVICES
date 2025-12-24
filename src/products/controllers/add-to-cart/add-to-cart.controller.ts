// add-to-cart.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AddToCartService } from '../../services/add-to-cart/add-to-cart.service';
import { AddToCartDto, UpdateCartDto } from '../../models/dto/add-to-cart.dto';
import { SignedInUserInterceptor } from '../../../products/services/signed-in-user.interceptor.service';

@Controller('add-to-cart')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SignedInUserInterceptor)
export class AddToCartController {
  constructor(private readonly cartService: AddToCartService) {}

  @Post()
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  getCart(@Req() req,
    @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,) {
    return this.cartService.getCart(req.user.id, {
        offset: Number(offset),
        limit: Number(limit)
    });
  }

  @Patch(':id')
  updateQuantity(
    @Req() req,
    @Param('id', ParseIntPipe) cartItemId: number,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateQuantity(
      req.user.id,
      cartItemId,
      dto,
    );
  }

  @Delete(':id')
  removeItem(
    @Req() req,
    @Param('id', ParseIntPipe) cartItemId: number,
  ) {
    return this.cartService.removeItem(req.user.id, cartItemId);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
