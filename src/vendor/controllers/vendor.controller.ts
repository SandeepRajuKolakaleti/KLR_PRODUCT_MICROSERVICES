import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Param, Delete, ParseFilePipe, FileTypeValidator, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { VendorService } from '../services/vendor.service';
import { CreateVendorDto, UpdateVendorDto } from '../models/dto/create-vendor.dto';
import { VendorI } from '../models/vendor.interface';
import { ProductsService } from 'src/products/services/products.service';

@Controller('vendors')
export class VendorController {
    constructor(private vendorService: VendorService, private productService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Post("create-vendor")
    @UseInterceptors(FileInterceptor('file'))
    async createVendor(@UploadedFile() file: Multer.File, @Body() createdVendorDto: CreateVendorDto,@Req() request: Request): Promise<Observable<VendorI>> {
        // console.log(file, createdVendorDto, request.body);
        return await this.vendorService.upload(file.originalname, file.buffer).then((data) => {
            console.log(data);
            createdVendorDto.ThumnailImage = data;
            const parsedDto: CreateVendorDto = {
                ...createdVendorDto,
                Name: createdVendorDto.Name,
                PhoneNumber: Number(createdVendorDto.PhoneNumber),
            };
            return this.vendorService.createVendor(parsedDto);
        });
        
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadImgToBase64')
    async base64(@Body() img: any) {
        console.log(img);
        return this.vendorService.getImageUrlToBase64(img.url);
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
        return this.vendorService.upload(file.originalname, file.buffer).then((data) => {
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
        await this.vendorService.readExcelFile(file.path);
        return { message: 'File processed successfully!' };
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllVendors() {
        return this.vendorService.getAllVendors();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-vendor')
    @UseInterceptors(FileInterceptor('file'))
    async updateVendor(@UploadedFile() file: Multer.File, @Body() updatedVendorDto: UpdateVendorDto, @Req() request: Request): Promise<Observable<VendorI>> {
        if (file)   {
            console.log("File uploaded:", file);   
            return await this.vendorService.upload(file.originalname, file.buffer).then((data) => {
                console.log(data);
                updatedVendorDto.ThumnailImage = data;
                const parsedDto: UpdateVendorDto = {
                    ...updatedVendorDto,
                };
                return this.vendorService.updateVendor(parsedDto);
            }); 
        }
        return this.vendorService.updateVendor(updatedVendorDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('vendor/:id')
    async info(@Param('id') id: number): Promise<any> {
      return this.vendorService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('productsByVendor/:id')
    async getProductsByVendor(@Param('id') id: number): Promise<any> {
      return this.vendorService.getProductsByVendor(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('vendor/:id')
    async delete(@Param('id') id: number): Promise<any> {
      return this.vendorService.deleteVendor(id);
    }
}

