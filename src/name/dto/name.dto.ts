import { IsString, MinLength } from "class-validator";

/*
    Dto para crear el token consumiendo la api de IZIPAY
*/
export class NameDto {
    @IsString()
    @MinLength(1)
    name: string;
}