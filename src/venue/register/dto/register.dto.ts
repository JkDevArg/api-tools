import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterVenueDto {
    @IsNumber()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    gender: string;

    @IsNumber()
    @IsOptional()
    age: string;

    @IsString()
    @IsOptional()
    city: string;
}
