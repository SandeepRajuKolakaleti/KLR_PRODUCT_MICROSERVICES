import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { BrandI } from '../../../products/models/brand.interface';
import { CreateBrandDto, UpdateBrandDto } from '../../../products/models/dto/brand.dto';
import { BrandsService } from '../../../products/services/brands/brands.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ProductsService } from '../../../products/services/products.service';

@Controller('brands')
export class BrandsController {
    constructor(private brandsService: BrandsService, private productService: ProductsService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-brand")
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file: Multer.File, @Body() createdBrandDto: CreateBrandDto, @Req() request: Request): Promise<Observable<BrandI>> {
        return await this.productService.upload(file.originalname, file.buffer).then((data) => {
            console.log(data);
            createdBrandDto.ThumnailImage = data;
            return this.brandsService.create(createdBrandDto);
        });
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllBrands(
            @Req() request: Request, 
            @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
            @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,
        ) {
        console.log("Request User:", request, offset, limit);
        return this.brandsService.getAllBrands({
            offset: Number(offset),
            limit: Number(limit)
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-brand')
    @UseInterceptors(FileInterceptor('file'))
    async update(@UploadedFile() file: Multer.File, @Body() updatedBrandDto: UpdateBrandDto, @Req() request: Request): Promise<Observable<BrandI>> {
        if (typeof updatedBrandDto.ThumnailImage === 'string' && updatedBrandDto.ThumnailImage !== '')
            return this.brandsService.update(updatedBrandDto);
        else {
            if(file)
                return await this.productService.upload(file.originalname, file.buffer).then((data) => {
                    console.log(data);
                    updatedBrandDto.ThumnailImage = data;
                    return this.brandsService.update(updatedBrandDto);
                });
            else {
                return this.brandsService.update(updatedBrandDto);
            }
        }
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('brand/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.brandsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('brand/:id')
    async delete(@Param('id') id: number): Promise<any> {
        return this.brandsService.delete(id);
    }
}
