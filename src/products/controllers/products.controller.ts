import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Param, Delete, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProductsService } from '../services/products.service';
import { Observable } from 'rxjs';
import { CreateProductDto, UpdateProductDto } from '../models/dto/create-product.dto';
import { ProductI } from '../models/product.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Post("create-product")
    async createProduct(@Body() createdProductDto: CreateProductDto): Promise<Observable<ProductI>> {
        return this.productService.createProducts(createdProductDto);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: 'image/jpeg'})
            ]
        })
    ) file: Multer.File) {
        // console.log("upload data:", file);
        return this.productService.upload(file.originalname, file.buffer).then((data) => {
            console.log(data);
            return {
                url: data
            };
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload/excel')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads', // Save file in 'uploads' folder
                filename: (req, file, cb) => {
                    const fileExt = extname(file.originalname);
                    const fileName = `upload-${Date.now()}${fileExt}`;
                    cb(null, fileName);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(xls|xlsx)$/)) {
                    return cb(new Error('Only Excel files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadExcel(@UploadedFile() file: Multer.File) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        await this.productService.readExcelFile(file.path);
        return { message: 'File processed successfully!' };
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-product')
    async updateProduct(@Body() updatedProductDto: UpdateProductDto): Promise<Observable<ProductI>> {
        return this.productService.updateproduct(updatedProductDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('product/:id')
    async info(@Param('id') id: number): Promise<any> {
      return this.productService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('product/:id')
    async delete(@Param('id') id: number): Promise<any> {
      return this.productService.deleteProduct(id);
    }
}
