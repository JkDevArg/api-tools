import { Optional } from "@nestjs/common";
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class getIpDto {
    @IsString()
    @MinLength(3)
    ip: string;
}