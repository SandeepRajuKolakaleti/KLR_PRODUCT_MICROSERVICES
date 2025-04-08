import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../products/models/dto/category.dto';
import { Observable } from 'rxjs';
import { CategoryI } from '../../../products/models/category.interface';
import { CategoriesService } from '../../../products/services/categories/categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-category")
    createCategory(@Body() createdCategoryDto: CreateCategoryDto): Observable<CategoryI> {
        return this.categoryService.create(createdCategoryDto);
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
