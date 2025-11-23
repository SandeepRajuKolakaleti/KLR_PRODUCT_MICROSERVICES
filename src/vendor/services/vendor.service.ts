import { Injectable } from '@nestjs/common';
import { CreateVendorDto, UpdateVendorDto } from '../models/dto/create-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { VendorI } from '../models/vendor.interface';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AppConstants } from 'src/app.constants';
import { VendorEntity } from '../models/vendor.entity';
import { ProductEntity } from 'src/products/models/product.entity';
@Injectable()
export class VendorService {
    public readonly s3Client;
    
    constructor(
        @InjectRepository(VendorEntity)
        private vendorRepository: Repository<VendorEntity>,
        private configService: ConfigService,
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
    ) {
        this.s3Client = new S3Client({
            region: configService.get('S3_REGION'),
            credentials: {
              accessKeyId: configService.get('S3_ACCESS_KEY_ID')|| '',
              secretAccessKey: configService.get('S3_SECRET_ACCESS_KEY') || '',
            },
        });
    }

    async upload(fileName: string, file:Buffer) {
        const folder = AppConstants.app.key;
        const s3Key = `${folder}/${fileName}`;
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: AppConstants.app.bucket,
                Key: s3Key,
                Body: file
            })
        );
        // await this.getImageUrlToBase64(s3Key)
        return s3Key;
    }

    async getImageUrlToBase64(s3Key) {
        return await this.imageUrlToBase64(`https://${AppConstants.app.bucket}.s3.${this.configService.get('S3_REGION')}.amazonaws.com/${s3Key}`)
        .then((base64) => {
            // console.log("base64", base64);
            return { img: base64 };
        })
        .catch(console.error);
    }

    async imageUrlToBase64(url: string): Promise<string> {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
        });
      
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
      
        // Optional: Get content-type for full data URI
        const contentType = response.headers['content-type'];
      
        return `data:${contentType};base64,${base64}`;
    }

    createVendor(createVendorDto: CreateVendorDto): Observable<VendorI> {
        return from(this.vendorRepository.save(createVendorDto)).pipe(
            map((savedVendor: VendorI) => {
                const { ...vendor } = savedVendor;
                return vendor;
            })
        )
    }

    async updateVendor(updatedVendorDto: UpdateVendorDto): Promise<Observable<any>> {
        const Id = updatedVendorDto.Id;
        const vendor = await this.vendorRepository.findOne({ where: { Id } });
        if (!vendor) {
            return of({ error: `Vendor with Id ${Id} not found` });
        }
        if (updatedVendorDto.Id) {
            const skuExists = await this.vendorRepository.findOne({
                where: { Id: updatedVendorDto.Id },
            });
            if (skuExists && skuExists.Id !== vendor.Id) {
                return of({ error: `Id '${updatedVendorDto.Id}' already exists for another vendor` });
            }
        }
        if (updatedVendorDto.Id) {
            const slugExists = await this.vendorRepository.findOne({
                where: { Id: updatedVendorDto.Id },
            });
            if (slugExists && slugExists.Id !== vendor.Id) {
                return of({ error: `Slug '${updatedVendorDto.Id}' already exists for another vendor` });
            }
        }
        const updatedData = { ...vendor, ...updatedVendorDto, Id: vendor.Id  };
        await this.vendorRepository.upsert(updatedData, ['Id']);
        const updatedVendor = await this.vendorRepository.findOne({ where: { Id: vendor.Id }, select: [
                'Id', 'Name', 'ThumnailImage', 'Email', 'PhoneNumber', 'Address'
            ] });
        return of(updatedVendor);
    }

    getAllVendors(): Observable<VendorI[]> {
        // Fetch all vendors from the database
        // and return them as an observable array   
        return from(this.vendorRepository.find({
            select: [
                'Id', 'Name', 'ThumnailImage', 'Email', 'PhoneNumber', 'Address'
            ]
        }));
    }

    async readExcelFile(filePath: string): Promise<any> {
        // Read XLS file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const data: any[] = XLSX.utils.sheet_to_json(sheet);

        // Insert each row into the database
        for (const row of data) {
            const vendor: VendorI = this.vendorRepository.create({
                Name: row["name"],
                ThumnailImage: row["thumb image"],
                Email: row["email"],
                PhoneNumber: row["phone number"],
                Address: row["address"],
            });
            await this.vendorRepository.save(vendor);
        }
    }

    getProductsByVendor(Id: number): Observable<any> {
        return from(this.productRepository.find({
            where: {Vendor: Id.toString()},
            select: [
                'Id', 'Name', 'ThumnailImage', 'Category', 'SubCategory', 'Brand', 'SKU', 'Slug', 'Price', 'OfferPrice', 'StockQuantity', 
                'Weight', 'ShortDescription', 'LongDescription', 'Status', 'SEOTitle', 'SEODescription', 'Specifications', 'Highlight', 'Vendor'
            ]
        }));
    }

    findOne(Id: number): Observable<any> {
        return from(this.vendorRepository.findOne({
            where: {Id},
            select: [
                'Id', 'Name', 'ThumnailImage', 'Email', 'PhoneNumber', 'Address'
            ]
        }));
    }

    async deleteVendor(Id: number) {
        const vendor = await this.vendorRepository.findOne({ where: { Id } });
        if (vendor) {
           await this.vendorRepository.remove(vendor);
           return true;
        }
    }
}
