import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../models/dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../models/product.entity';
import { Repository } from 'typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { ProductI } from '../models/product.interface';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AppConstants } from 'src/app.constants';

@Injectable()
export class ProductsService {
    public readonly s3Client;
    
    constructor(
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
        private configService: ConfigService
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

    createProducts(createProductDto: CreateProductDto): Observable<ProductI> {
        return from(this.productRepository.save(createProductDto)).pipe(
            map((savedProduct: ProductI) => {
                const { ...product } = savedProduct;
                return product;
            })
        )
    }

    async updateproduct(updateedProductDto: UpdateProductDto): Promise<Observable<any>> {
        const SKU = updateedProductDto.SKU;
        const product = await this.productRepository.findOne({ where: { SKU } });
        if (product) {
            return from(this.productRepository.upsert(updateedProductDto, ['SKU'])).pipe(
                switchMap(() =>
                    from(this.productRepository.findOne({ where: { SKU } })).pipe(
                        map((updatedBrand) => {
                            if (!updatedBrand) {
                                throw new Error('Brand update failed');
                            }
                            return updatedBrand as ProductI;
                        })
                    )
                )
            );
        } else {
            return of([]);
        }
    }

    getAllProducts(): Observable<ProductI[]> {
        return from(this.productRepository.find());
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
            const product: ProductI = this.productRepository.create({
                Name: row["name"],
                ThumnailImage: row["thumb image"],
                Category: row["category"],
                SubCategory: row["sub category"],
                ChildCategory: row["child category"],
                Brand: row["brand"],
                SKU: row["sku"],
                Slug: row["slug"],
                Price: row["price"],
                OfferPrice: row["offer price"],
                StockQuantity: row["stock quantity"],
                Weight: row["weight"],
                ShortDescription: row["short description"],
                LongDescription: row["long description"],
                Status: row["status"],
                SEOTitle: row["seo title"],
                SEODescription: row["seo description"],
                Specifications: row["specifications"]
                    ? JSON.parse(row["specifications"]) 
                    : [],
                Highlight: row["highlight"]
                    ? JSON.parse(row["highlight"])
                    : {},
                Vendor: row["vendor"]
            });
            await this.productRepository.save(product);
        }
    }

    findOne(Id: number): Observable<any> {
        return from(this.productRepository.findOne({
            where: {Id},
            select: [
                'Id', 'Name', 'ThumnailImage', 'Category', 'SubCategory', 'Brand', 'SKU', 'Slug', 'Price', 'OfferPrice', 'StockQuantity', 
                'Weight', 'ShortDescription', 'LongDescription', 'Status', 'SEOTitle', 'SEODescription', 'Specifications', 'Highlight', 'Vendor'
            ]
        }));
    }

    async deleteProduct(Id: number) {
        const product = await this.productRepository.findOne({ where: { Id } });
        if (product) {
           await this.productRepository.remove(product);
           return true;
        }
    }
}
