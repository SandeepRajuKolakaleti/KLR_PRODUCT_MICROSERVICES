import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { BrandI } from '../../../products/models/brand.interface';
import { CreateBrandDto, UpdateBrandDto } from '../../../products/models/dto/brand.dto';
import { BrandsService } from '../../../products/services/brands/brands.service';

@Controller('brands')
export class BrandsController {
     constructor(private brandsService: BrandsService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-brand")
    createCategory(@Body() createdCategoryDto: CreateBrandDto): Observable<BrandI> {
        return this.brandsService.create(createdCategoryDto);
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
