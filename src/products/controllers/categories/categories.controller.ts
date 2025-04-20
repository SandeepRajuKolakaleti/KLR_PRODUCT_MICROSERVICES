import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../products/models/dto/category.dto';
import { Observable } from 'rxjs';
import { CategoryI } from '../../../products/models/category.interface';
import { CategoriesService } from '../../../products/services/categories/categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ProductsService } from '../../../products/services/products.service';
@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService, private productService: ProductsService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-category")
    @UseInterceptors(FileInterceptor('file'))
    async createCategory(@UploadedFile() file: Multer.File, @Body() createdCategoryDto: CreateCategoryDto, @Req() request: Request): Promise<Observable<CategoryI>> {
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
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-category')
    async updateCategory(@Body() updatedCategoryDto: UpdateCategoryDto): Promise<Observable<CategoryI>> {
        return this.categoryService.update(updatedCategoryDto);
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
