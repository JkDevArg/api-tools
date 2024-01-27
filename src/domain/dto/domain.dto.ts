import { IsString, MinLength } from "class-validator";


export class getDomainDto {
    @IsString()
    @MinLength(3)
    domain: string;
}