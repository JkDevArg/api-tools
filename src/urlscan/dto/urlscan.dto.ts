import { IsString } from "class-validator";

export class getUrlScanDto {
    @IsString()
    url: string;
}