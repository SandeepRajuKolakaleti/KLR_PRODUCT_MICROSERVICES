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
    @Type(() => Number)
    Category!: number;
    @IsString()
    @Type(() => Number)
    SubCategory!: number;
    @IsString()
    @Type(() => String)
    Slug!: string;
    @IsString()
    @Type(() => String)
    Status!: string;
}

export class UpdateChildCategoryDto extends CreateChildCategoryDto {
    @IsNumber()
    Id?: number;
}