import { IsNumber, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    Name!: string;
    @IsString()
    ThumnailImage!: string;
    @IsString()
    Slug!: string;
    @IsString()
    Status!: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {
    @IsNumber()
    Id?: number;
}