import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateBrandDto {

    @IsString()
    @Type(() => String)
    Name!: string;
    @IsString()
    @Type(() => String)
    ThumnailImage!: string;
    @IsString()
    @Type(() => String)
    Slug!: string;
    @IsString()
    @Type(() => String)
    Status!: string;
}

export class UpdateBrandDto extends CreateBrandDto {
    @IsNumber()
    Id?: number;
}