import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Param, Delete, ParseFilePipe, FileTypeValidator, Req, Query, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { VendorService } from '../services/vendor.service';
import { CreateVendorDto, UpdateVendorDto } from '../models/dto/create-vendor.dto';
import { VendorI } from '../models/vendor.interface';
import { ProductsService } from '../../products/services/products.service';
import { LoginUserDto } from '../models/dto/LoginUser.dto';
import { PaginatedResult } from '../../products/models/pagination.interface';

@Controller('vendors')
export class VendorController {
    constructor(private vendorService: VendorService, private productService: ProductsService) { }

    @Post('create-vendor')
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file: Multer.File, @Body() createUserDto: CreateVendorDto): Promise<Observable<VendorI>> {
      console.log(file);
      return await this.vendorService.upload(file.originalname, file.buffer).then((data) => {
        console.log(data);
        createUserDto.image = data;
        return this.vendorService.create(createUserDto);
      });
      
      // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('getAll')
    findAll(@Req() request: Request, 
        @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
        @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,): Observable<PaginatedResult<VendorI>> {
        return this.vendorService.findAll({
            offset: Number(offset),
            limit: Number(limit)
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('findByMail/:email')
    async findByMail(@Param('email') email: string): Promise<any> {
      return this.vendorService.findUserByEmail(email);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('vendor/:id')
    async findOne(@Param('id') id: number): Promise<any> {
      return this.vendorService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile/:id')
    async info(@Param('id') id: number): Promise<any> {
      return this.vendorService.findOne(id);
    }

    @Post('resetPassword')
    async resetPassword(@Body() resetPassword: LoginUserDto): Promise<Observable<VendorI>> {
        return this.vendorService.resetPassword(resetPassword);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('productsByVendor/:id')
    async getProductsByVendor(@Param('id') id: number): Promise<any> {
      return this.vendorService.getProductsByVendor(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('vendor/:id')
    async deleteUser(@Param('id') id: number): Promise<any> {
      return this.vendorService.deleteUser(id);
    }

    @Post('update-vendor')
    @UseInterceptors(FileInterceptor('file'))
    async update(@UploadedFile() file: Multer.File, @Body() updateUserDto: UpdateVendorDto): Promise<Observable<VendorI>> {
      console.log(file);
      const vendorId = Number(updateUserDto.Id);
      return await this.vendorService.upload(file.originalname, file.buffer).then((data) => {
        console.log(data);
        updateUserDto.image = data;
        return this.vendorService.update(vendorId, updateUserDto);
      });
      // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadImgToBase64')
    async base64(@Body() img: any) {
        console.log(img);
        return this.vendorService.getImageUrlToBase64(img.url);
    }
}

