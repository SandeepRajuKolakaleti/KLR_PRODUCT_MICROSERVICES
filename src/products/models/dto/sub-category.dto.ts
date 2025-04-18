import { IsNumber, IsString } from "class-validator";

export class CreateSubCategoryDto {

    @IsString()
    Name!: string;
    @IsString()
    ThumnailImage!: string;
    @IsString()
    Category!: number;
    @IsString()
    Slug!: string;
    @IsString()
    Status!: boolean;
}

export class UpdateSubCategoryDto extends CreateSubCategoryDto {
    @IsNumber()
    Id?: number;
}