import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class HighlightDto {
  @IsBoolean()
  NewArrival?: boolean;

  @IsBoolean()
  TopProduct?: boolean;

  @IsBoolean()
  BestProduct?: boolean;

  @IsBoolean()
  FeaturedProduct?: boolean;
}
export class SpecificationDto {
  @IsString()
  key?: string;

  @IsString()
  specification?: string;
}
export class CreateProductDto {

    @IsString()
    @Type(() => String)
    Name!: string;
    @IsString()
    @Type(() => String)
    ThumnailImage!: string;
    @IsString()
    @Type(() => String)
    Slug!: string;
    @IsNumber()
    @Type(() => Number)
    Category!: number;
    @IsNumber()
    @Type(() => Number)
    SubCategory!: number;
    @IsNumber()
    @Type(() => Number)
    ChildCategory!: number;
    @IsNumber()
    @Type(() => Number)
    Brand!: number;
    @IsString()
    SKU!: string;
    @IsNumber()
    @Type(() => Number)
    Price!: number;
    @IsNumber()
    @Type(() => Number)
    OfferPrice!: number;
    @IsNumber()
    @Type(() => Number)
    StockQuantity!: number;
    @IsNumber()
    @Type(() => Number)
    Weight!: number;
    @IsString()
    @Type(() => String)
    ShortDescription!: string;
    @IsString()
    @Type(() => String)
    LongDescription!: string;
    @IsString()
    Highlight!: HighlightDto; // {"NewArrival": true, "TopProduct": true, "BestProduct": true, "FeaturedProduct": false}
    @IsString()
    @Type(() => String)
    Status!: string;
    @IsString()
    @Type(() => String)
    SEOTitle!: string;
    @IsString()
    @Type(() => String)
    SEODescription!: string;
    @IsString()
    Specifications!: SpecificationDto[]; // [{"key": "Processor", "specification": "Snapdragon 888"}, {"key": "RAM", "specification": "8GB"}, {"key": "Battery", "specification": "5000mAh"}]
    @IsString()
    @Type(() => String)
    Vendor!: string;
}

export class UpdateProductDto extends CreateProductDto {
    @IsNumber()
    Id?: number;
}