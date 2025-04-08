import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ChildCategoryI } from '../../../products/models/child-category.interface';
import { CreateChildCategoryDto, UpdateChildCategoryDto } from '../../../products/models/dto/child-category.dto';
import { ChildCategoriesService } from '../../../products/services/child-categories/child-categories.service';

@Controller('child-categories')
export class ChildCategoriesController {
    constructor(private childCategoryService: ChildCategoriesService) {}

    @UseGuards(JwtAuthGuard)
    @Post("create-child-category")
    createChildCategory(@Body() createdChildCategoryDto: CreateChildCategoryDto): Observable<ChildCategoryI> {
        return this.childCategoryService.create(createdChildCategoryDto);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllChildCategories() {
        return this.childCategoryService.getAllChildCategories();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-child-category')
    async updateChildCategory(@Body() updatedChildCategoryDto: UpdateChildCategoryDto): Promise<Observable<ChildCategoryI>> {
        return this.childCategoryService.update(updatedChildCategoryDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('child-category/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.childCategoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('child-category/:id')
    async deleteChildCategory(@Param('id') id: number): Promise<any> {
        return this.childCategoryService.delete(id);
    }
}
