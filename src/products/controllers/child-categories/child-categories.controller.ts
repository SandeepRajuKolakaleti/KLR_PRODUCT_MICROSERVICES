import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ChildCategoryI } from '../../../products/models/child-category.interface';
import { CreateChildCategoryDto, UpdateChildCategoryDto } from '../../../products/models/dto/child-category.dto';
import { ChildCategoriesService } from '../../../products/services/child-categories/child-categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ProductsService } from 'src/products/services/products.service';
@Controller('child-categories')
export class ChildCategoriesController {
    constructor(private childCategoryService: ChildCategoriesService, private productService: ProductsService) {}

    @UseGuards(JwtAuthGuard)
    @Post("create-child-category")
    @UseInterceptors(FileInterceptor('file'))
    async createChildCategory(@UploadedFile() file: Multer.File, @Body() createdChildCategoryDto: CreateChildCategoryDto): Promise<Observable<ChildCategoryI>> {
        return await this.productService.upload(file.originalname, file.buffer).then((data) => {
            console.log(data);
            createdChildCategoryDto.ThumnailImage = data;
            return this.childCategoryService.create(createdChildCategoryDto);
        });
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllChildCategories() {
        return this.childCategoryService.getAllChildCategories();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-child-category')
    @UseInterceptors(FileInterceptor('file'))
    async updateChildCategory(@UploadedFile() file: Multer.File, @Body() updatedChildCategoryDto: UpdateChildCategoryDto, @Req() request: Request): Promise<Observable<ChildCategoryI>> {
        if (typeof updatedChildCategoryDto.ThumnailImage === 'string' && updatedChildCategoryDto.ThumnailImage !== '')
            return this.childCategoryService.update(updatedChildCategoryDto)
        else {
            if(file)
                return await this.productService.upload(file.originalname, file.buffer).then((data) => {
                    console.log(data);
                    updatedChildCategoryDto.ThumnailImage = data;
                    return this.childCategoryService.update(updatedChildCategoryDto)
                });
            else {
                return this.childCategoryService.update(updatedChildCategoryDto)
            }
        }
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
