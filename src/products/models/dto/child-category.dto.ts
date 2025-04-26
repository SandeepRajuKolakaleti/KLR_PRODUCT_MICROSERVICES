import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateChildCategoryDto {

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

export class UpdateChildCategoryDto extends CreateChildCategoryDto {
    @IsNumber()
    @Type(() => Number)
    Id?: number;
}