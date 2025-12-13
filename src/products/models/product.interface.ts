import { HighlightDto, SpecificationDto } from "./dto/create-product.dto";

export interface ProductI {
    Id?: number;
    ThumnailImage: string;
    Name: string;
    Slug: string;
    Category: number;
    SubCategory: number;
    ChildCategory: number;
    Brand: number;
    SKU: string;
    Price: number;
    OfferPrice: number;
    StockQuantity: number;
    Weight: number;
    ShortDescription: string;
    LongDescription: string;
    Highlight: HighlightDto;
    Status: number;
    SEOTitle: string;
    SEODescription: string;
    Specifications: SpecificationDto[];
    Vendor: string;
}