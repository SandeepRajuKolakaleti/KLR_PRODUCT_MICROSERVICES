import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../products/models/dto/category.dto';
import { Observable } from 'rxjs';
import { CategoryI } from '../../../products/models/category.interface';
import { CategoriesService } from '../../../products/services/categories/categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ProductsService } from '../../../products/services/products.service';
@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService, private productService: ProductsService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-category")
    @UseInterceptors(FileInterceptor('file'))
    async createCategory(@UploadedFile() file: Express.Multer.File, @Body() createdCategoryDto: CreateCategoryDto, @Req() request: Request): Promise<Observable<CategoryI>> {
        // console.log(request);
        return await this.productService.upload(file.originalname, file.buffer).then((data) => {
            console.log(data);
            createdCategoryDto.ThumnailImage = data;
            return this.categoryService.create(createdCategoryDto);
        });
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllCategories(  
        @Req() request: Request, 
        @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
        @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,) 
        {
        return this.categoryService.getAllCategories({
            offset: Number(offset), 
            limit: Number(limit)
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-category')
    @UseInterceptors(FileInterceptor('file'))
    async updateCategory(@UploadedFile() file: Express.Multer.File, @Body() updatedCategoryDto: UpdateCategoryDto, @Req() request: Request): Promise<Observable<CategoryI>> {
        console.log(file);
        if (typeof updatedCategoryDto.ThumnailImage === 'string' && updatedCategoryDto.ThumnailImage !== '')
            return this.categoryService.update(updatedCategoryDto);
        else {
            if(file)
                return await this.productService.upload(file.originalname, file.buffer).then((data) => {
                    console.log(data);
                    updatedCategoryDto.ThumnailImage = data;
                    return this.categoryService.update(updatedCategoryDto);
                });
            else {
                return this.categoryService.update(updatedCategoryDto);
            }
        }
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('category/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.categoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('category/:id')
    async deleteCategory(@Param('id') id: number): Promise<any> {
        return this.categoryService.delete(id);
    }
}
