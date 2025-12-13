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
import { PaginatedResult, Pagination } from '../models/pagination.interface';

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
        const folder = AppConstants.app.S3.product;
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

    async updateproduct(updatedProductDto: UpdateProductDto): Promise<Observable<any>> {
        const Id = updatedProductDto.Id;
        const product = await this.productRepository.findOne({ where: { Id } });
        if (!product) {
            return of({ error: `Product with Id ${Id} not found` });
        }
        if (updatedProductDto.SKU) {
            const skuExists = await this.productRepository.findOne({
                where: { SKU: updatedProductDto.SKU },
            });
            if (skuExists && skuExists.Id !== product.Id) {
                return of({ error: `SKU '${updatedProductDto.SKU}' already exists for another product` });
            }
        }
        if (updatedProductDto.Slug) {
            const slugExists = await this.productRepository.findOne({
                where: { Slug: updatedProductDto.Slug },
            });
            if (slugExists && slugExists.Id !== product.Id) {
                return of({ error: `Slug '${updatedProductDto.Slug}' already exists for another product` });
            }
        }
        const updatedData = { ...product, ...updatedProductDto, Id: product.Id  };
        await this.productRepository.upsert(updatedData, ['Id']);
        const updatedProduct = await this.productRepository.findOne({ where: { Id: product.Id } });
        return of(updatedProduct);
    }

    getAllProducts(user, pagination: Pagination): Observable<PaginatedResult<ProductI>> {
        if (user.userRole === AppConstants.app.userType.admin) {
            console.log("Applying user-specific filtering for:", user.Username);
            return from(this.productRepository.findAndCount({
                select: [
                    'Id', 'Name', 'ThumnailImage', 'Category', 'ChildCategory', 'SubCategory', 'Brand', 'SKU', 'Slug', 
                    'Price', 'OfferPrice', 'StockQuantity', 'Weight', 'ShortDescription', 
                    'LongDescription', 'Status', 'SEOTitle', 'SEODescription', 
                    'Specifications', 'Highlight', 'Vendor', 'createdAt', 'updatedAt'
                ],
                skip: pagination.offset,
                take: pagination.limit,
                order: { createdAt: "DESC" }
            })).pipe(
            map(([products, total]) => ({
                total: total,
                offset: pagination.offset,
                limit: pagination.limit,
                data: products
            })));
        } else if (user.userRole === AppConstants.app.userType.vendor) {
            console.log("Vendor access - no filtering applied.");  
            return from(this.productRepository.findAndCount({
                where: {Vendor: user.id.toString()},
                select: [
                    'Id', 'Name', 'ThumnailImage', 'Category', 'ChildCategory', 'SubCategory', 'Brand', 'SKU', 'Slug', 
                    'Price', 'OfferPrice', 'StockQuantity', 'Weight', 'ShortDescription', 
                    'LongDescription', 'Status', 'SEOTitle', 'SEODescription', 
                    'Specifications', 'Highlight', 'Vendor', 'createdAt', 'updatedAt'
                ],
                skip: pagination.offset,
                take: pagination.limit,
                order: { createdAt: "DESC" }
            })).pipe(
            map(([products, total]) => ({
                total: total,
                offset: pagination.offset,
                limit: pagination.limit,
                data: products
            })));
        } else if (user.userRole === AppConstants.app.userType.user) {
            console.log("Regular user access - limited product view.");
            return from(this.productRepository.findAndCount({
                select: [
                    'Id', 'Name', 'ThumnailImage', 'Category', 'ChildCategory', 'SubCategory', 'Brand', 'SKU', 'Slug', 
                    'Price', 'OfferPrice', 'StockQuantity', 'Weight', 'ShortDescription', 
                    'LongDescription', 'Status', 'SEOTitle', 'SEODescription', 
                    'Specifications', 'Highlight', 'Vendor', 'createdAt', 'updatedAt'
                ],
                skip: pagination.offset,
                take: pagination.limit,
                order: { createdAt: "DESC" }
            })).pipe(
            map(([products, total]) => ({
                total: total,
                offset: pagination.offset,
                limit: pagination.limit,
                data: products
            })));
        } else if (user.userRole === AppConstants.app.userType.deliveryBoy) {
            console.log("Delivery boy access - specific product assignments.");
            return from(this.productRepository.findAndCount({
                select: [
                    'Id', 'Name', 'ThumnailImage', 'Category', 'ChildCategory', 'SubCategory', 'Brand', 'SKU', 'Slug', 
                    'Price', 'OfferPrice', 'StockQuantity', 'Weight', 'ShortDescription', 
                    'LongDescription', 'Status', 'SEOTitle', 'SEODescription', 
                    'Specifications', 'Highlight', 'Vendor', 'createdAt', 'updatedAt'
                ],
                skip: pagination.offset,
                take: pagination.limit,
                order: { createdAt: "DESC" }
            })).pipe(
            map(([products, total]) => ({
                total: total,
                offset: pagination.offset,
                limit: pagination.limit,
                data: products
            })));
        } else {
            return from(this.productRepository.findAndCount({
                select: [
                    'Id', 'Name', 'ThumnailImage', 'Category', 'ChildCategory', 'SubCategory', 'Brand', 'SKU', 'Slug', 
                    'Price', 'OfferPrice', 'StockQuantity', 'Weight', 'ShortDescription', 
                    'LongDescription', 'Status', 'SEOTitle', 'SEODescription', 
                    'Specifications', 'Highlight', 'Vendor', 'createdAt', 'updatedAt'
                ],
                skip: pagination.offset,
                take: pagination.limit,
                order: { createdAt: "DESC" }
            })).pipe(
            map(([products, total]) => ({
                total: total,
                offset: pagination.offset,
                limit: pagination.limit,
                data: products
            })))
        }
        
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
        if (!product) {
            return false;
        }

        product.Status = AppConstants.app.status.inactive; // deactivate instead of deleting
        await this.productRepository.save(product);

        return true;
    }
}
