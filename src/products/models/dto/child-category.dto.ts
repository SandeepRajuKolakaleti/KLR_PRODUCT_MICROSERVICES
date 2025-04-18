import { IsNumber, IsString } from "class-validator";

export class CreateChildCategoryDto {

    @IsString()
    Name!: string;
    @IsString()
    ThumnailImage!: string;
    @IsString()
    Category!: number;
    @IsString()
    SubCategory!: number;
    @IsString()
    Slug!: string;
    @IsString()
    Status!: boolean;
}

export class UpdateChildCategoryDto extends CreateChildCategoryDto {
    @IsNumber()
    Id?: number;
}