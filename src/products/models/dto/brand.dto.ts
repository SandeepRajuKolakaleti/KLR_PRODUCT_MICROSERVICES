import { IsNumber, IsString } from "class-validator";

export class CreateBrandDto {

    @IsString()
    Name!: string;
    @IsString()
    ThumnailImage!: string;
    @IsString()
    Slug!: string;
    @IsString()
    Status!: boolean;
}

export class UpdateBrandDto extends CreateBrandDto {
    @IsNumber()
    Id?: number;
}