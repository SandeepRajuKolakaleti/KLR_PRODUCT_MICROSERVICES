// wishlist.controller.ts
import {
  Controller,
  Post,
  Get,
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
import { WishListService } from '../../services/wish-list/wish-list.service';
import { AddToWishlistDto } from '../../models/dto/wish-list.dto';
import { SignedInUserInterceptor } from 'src/products/services/signed-in-user.interceptor.service';

@Controller('wish-list')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SignedInUserInterceptor)
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Post()
  addToWishlist(@Req() req, @Body() addToWishlistDto: AddToWishlistDto) {
    return this.wishListService.add(req.user.id, addToWishlistDto);
  }

  @Get()
  getWishlist(@Req() req,
    @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,) {
    return this.wishListService.getAll(req.user.id, {
        offset: Number(offset),
        limit: Number(limit)
    });
  }

  @Delete(':id')
  removeFromWishlist(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.wishListService.remove(req.user.id, id);
  }

  @Delete()
  clearWishlist(@Req() req) {
    return this.wishListService.clear(req.user.id);
  }
}
