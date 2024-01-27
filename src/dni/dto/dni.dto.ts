import { IsNumber, MaxLength, MinLength } from "class-validator";


export class getDniDto {
    @IsNumber()
    dni: number;
}