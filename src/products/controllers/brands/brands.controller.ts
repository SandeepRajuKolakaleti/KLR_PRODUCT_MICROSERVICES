import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    async createCategory(@UploadedFile() file: Multer.File,@Body() createdBrandDto: CreateBrandDto): Promise<Observable<BrandI>> {
        return await this.productService.upload(file.originalname, file.buffer).then((data) => {
            console.log(data);
            createdBrandDto.ThumnailImage = data;
            return this.brandsService.create(createdBrandDto);
        });
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllBrands() {
        return this.brandsService.getAllBrands();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-brand')
    async updateCategory(@Body() updatedBrandDto: UpdateBrandDto): Promise<Observable<BrandI>> {
        return this.brandsService.update(updatedBrandDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('brand/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.brandsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('brand/:id')
    async deleteBrand(@Param('id') id: number): Promise<any> {
        return this.brandsService.delete(id);
    }
}
