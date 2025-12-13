import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateCategoryDto {

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
    Status!: number;
}

export class UpdateCategoryDto extends CreateCategoryDto {
    @IsString()
    Id?: string;
}