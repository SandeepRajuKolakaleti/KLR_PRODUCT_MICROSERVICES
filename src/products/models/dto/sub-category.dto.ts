import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateSubCategoryDto {

    @IsString()
    @Type(() => String)
    Name!: string;
    @IsString()
    @Type(() => String)
    ThumnailImage!: string;
    @IsString()
    @Type(() => String)
    Category!: string;
    @IsString()
    @Type(() => String)
    SubCategory!: string;
    @IsString()
    @Type(() => String)
    Slug!: string;
    @IsString()
    @Type(() => String)
    Status!: string;
}

export class UpdateSubCategoryDto extends CreateSubCategoryDto {
    @IsNumber()
    @Type(() => Number)
    Id?: number;
}