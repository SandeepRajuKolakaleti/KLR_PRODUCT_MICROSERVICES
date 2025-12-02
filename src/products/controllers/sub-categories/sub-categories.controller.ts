import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '../../../products/models/dto/sub-category.dto';
import { SubCategoryI } from '../../../products/models/sub-category.interface';
import { SubCategoriesService } from '../../../products/services/sub-categories/sub-categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ProductsService } from '../../../products/services/products.service';
@Controller('sub-categories')
export class SubCategoriesController {
    constructor(private subCategoryService: SubCategoriesService, private productService: ProductsService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-subcategory")
    @UseInterceptors(FileInterceptor('file'))
    async createSubCategory(@UploadedFile() file: Multer.File, @Body() createdSubCategoryDto: CreateSubCategoryDto): Promise<Observable<SubCategoryI>> {
        return await this.productService.upload(file.originalname, file.buffer).then((data) => {
            console.log(data);
            createdSubCategoryDto.ThumnailImage = data;
            return  this.subCategoryService.create(createdSubCategoryDto);;
        });
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllSubCategories(@Req() request: Request, 
        @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
        @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,) {
        return this.subCategoryService.getAllSubCategories({
            offset: Number(offset),
            limit: Number(limit)
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-subcategory')
    @UseInterceptors(FileInterceptor('file'))
    async updateSubCategory(@UploadedFile() file: Multer.File, @Body() updatedSubCategoryDto: UpdateSubCategoryDto): Promise<Observable<SubCategoryI>> {
        if (typeof updatedSubCategoryDto.ThumnailImage === 'string' && updatedSubCategoryDto.ThumnailImage !== '')
            return this.subCategoryService.update(updatedSubCategoryDto);
        else {
            if(file)
                return await this.productService.upload(file.originalname, file.buffer).then((data) => {
                    console.log(data);
                    updatedSubCategoryDto.ThumnailImage = data;
                    return this.subCategoryService.update(updatedSubCategoryDto);
                });
            else {
                return this.subCategoryService.update(updatedSubCategoryDto);
            }
        }
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('subCategory/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.subCategoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('category/:id')
    async category(@Param('id') id: number): Promise<any> {
        return this.subCategoryService.findOneByCategory(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('subCategory/:id')
    async deleteSubCategory(@Param('id') id: number): Promise<any> {
        return this.subCategoryService.delete(id);
    }
}
