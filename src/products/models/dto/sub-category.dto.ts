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
    @Type(() => Number)
    Category!: number;
    @IsString()
    @Type(() => String)
    Slug!: string;
    @IsString()
    @Type(() => String)
    Status!: string;
}

export class UpdateSubCategoryDto extends CreateSubCategoryDto {
    @IsNumber()
    Id?: number;
}