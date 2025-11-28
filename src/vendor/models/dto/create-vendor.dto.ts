import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { LoginUserDto } from "./LoginUser.dto";


export class CreateVendorDto extends LoginUserDto {

    @IsString()
    userRole!: string;

    @IsOptional()
    @IsString()
    image?: string;
    	
	@IsString()
    @IsOptional()
    address?:string;
	
	@IsString()
    @IsOptional()
    birthday?:string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    totalSales?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    revenue?: string;
    
}

export class UpdateVendorDto extends CreateVendorDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    Id?: number;
}