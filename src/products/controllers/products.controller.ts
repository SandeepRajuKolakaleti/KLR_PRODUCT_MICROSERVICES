import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Param, Delete, ParseFilePipe, FileTypeValidator, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProductsService } from '../services/products.service';
import { Observable } from 'rxjs';
import { CreateProductDto, UpdateProductDto } from '../models/dto/create-product.dto';
import { ProductI } from '../models/product.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Post("create-product")
    @UseInterceptors(FileInterceptor('file'))
    async createProduct(@UploadedFile() file: Multer.File, @Body() createdProductDto: any,@Req() request: Request): Promise<Observable<ProductI>> {
        // console.log(file, createdProductDto, request.body);
        return await this.productService.upload(file.originalname, file.buffer).then((data) => {
            console.log(data);
            createdProductDto.ThumnailImage = data;
            const parsedDto: CreateProductDto = {
                ...createdProductDto,
                Category: Number(createdProductDto.Category),
                SubCategory: Number(createdProductDto.SubCategory),
                ChildCategory: Number(createdProductDto.ChildCategory),
                Brand: Number(createdProductDto.Brand),
                Price: Number(createdProductDto.Price),
                OfferPrice: Number(createdProductDto.OfferPrice),
                StockQuantity: Number(createdProductDto.StockQuantity),
                Weight: Number(createdProductDto.Weight),
                Highlight: JSON.parse(createdProductDto.Highlight),
                Specifications: JSON.parse(createdProductDto.Specifications),
            };
            return this.productService.createProducts(parsedDto);
        });
        
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadImgToBase64')
    async base64(@Body() img: any) {
        console.log(img);
        return this.productService.getImageUrlToBase64(img.url);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
    @UploadedFile(
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
