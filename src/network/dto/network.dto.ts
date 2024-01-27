import { IsString, MinLength } from "class-validator";

/*
    Dto para crear el token consumiendo la api de IZIPAY
*/
export class NetworkDomainDto {
    @IsString()
    @MinLength(1)
    domain: string;
}