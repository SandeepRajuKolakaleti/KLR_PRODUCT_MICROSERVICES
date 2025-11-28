import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Param, Delete, ParseFilePipe, FileTypeValidator, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { VendorService } from '../services/vendor.service';
import { CreateVendorDto, UpdateVendorDto } from '../models/dto/create-vendor.dto';
import { VendorI } from '../models/vendor.interface';
import { ProductsService } from 'src/products/services/products.service';
import { LoginUserDto } from '../models/dto/LoginUser.dto';

@Controller('vendors')
export class VendorController {
    constructor(private vendorService: VendorService, private productService: ProductsService) { }

    @Post('create-vendor')
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file: Multer.File, @Body() createUserDto: CreateVendorDto): Promise<Observable<VendorI>> {
      console.log(file);
      if (file) {
        createUserDto.image = file.originalname;
      }
      return this.vendorService.create(createUserDto);
      // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('getAll')
    findAll(): Observable<VendorI[]> {
        return this.vendorService.findAll();
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
      if (file) {
        updateUserDto.image = file.originalname;
      }
      updateUserDto.Id = Number(updateUserDto.Id);
      return this.vendorService.update(updateUserDto.Id, updateUserDto);
      // AppConstants.app.xyz
    }
}

