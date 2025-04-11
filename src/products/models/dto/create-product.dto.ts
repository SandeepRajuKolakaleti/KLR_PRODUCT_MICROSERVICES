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
    @ValidateNested()
    @Type(() => HighlightDto)
    Highlight!: HighlightDto; // {"NewArrival": true, "TopProduct": true, "BestProduct": true, "FeaturedProduct": false}
    @IsString()
    Status!: string;
    @IsString()
    SEOTitle!: string;
    @IsString()
    SEODescription!: string;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SpecificationDto)
    Specifications!: SpecificationDto[]; // [{"key": "Processor", "specification": "Snapdragon 888"}, {"key": "RAM", "specification": "8GB"}, {"key": "Battery", "specification": "5000mAh"}]
    @IsString()
    Vendor!: string;
}

export class UpdateProductDto extends CreateProductDto {
    @IsNumber()
    Id?: number;
}