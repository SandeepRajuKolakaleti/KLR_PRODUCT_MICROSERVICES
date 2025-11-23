import { IsNumber, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class CreateVendorDto {
  @IsString()
  @Type(() => String)
  Name!: string;
  @IsString()
  @Type(() => String)
  ThumnailImage!: string;
  @IsString()
  @Type(() => String)
  Email!: string;
  @IsNumber()
  @Type(() => Number)
  PhoneNumber!: number;
  @IsString()
  @Type(() => String)
  Address!: string;
}

export class UpdateVendorDto extends CreateVendorDto {
    @IsNumber()
    @Type(() => Number)
    Id?: number;
}