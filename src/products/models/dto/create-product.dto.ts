import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {

    @IsString()
    Name!: string;
    @IsString()
    ThumnailImage!: string;
    @IsString()
    Slug!: string;
    @IsNumber()
    Category!: number;
    @IsNumber()
    SubCategory!: number;
    @IsNumber()
    ChildCategory!: number;
    @IsNumber()
    Brand!: number;
    @IsString()
    SKU!: string;
    @IsNumber()
    Price!: number;
    @IsNumber()
    OfferPrice!: number;
    @IsNumber()
    StockQuantity!: number;
    @IsNumber()
    Weight!: number;
    @IsString()
    ShortDescription!: string;
    @IsString()
    LongDescription!: string;

    Highlight!: { [key: string]: boolean }; // {"NewArrival": true, "TopProduct": true, "BestProduct": true, "FeaturedProduct": false}
    @IsString()
    Status!: string;
    @IsString()
    SEOTitle!: string;
    @IsString()
    SEODescription!: string;

    Specifications!: {key: string; specification: string }[]; // [{"key": "Processor", "specification": "Snapdragon 888"}, {"key": "RAM", "specification": "8GB"}, {"key": "Battery", "specification": "5000mAh"}]
    @IsString()
    Vendor!: string;
}

export class UpdateProductDto extends CreateProductDto {
    @IsNumber()
    Id?: number;
}