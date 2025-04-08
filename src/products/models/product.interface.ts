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
    Highlight: { [key: string]: boolean };
    Status: string; 
    SEOTitle: string;
    SEODescription: string;
    Specifications: {key: string; specification: string }[];
    Vendor: string;
}