import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateChatgptDto {
    @IsString()
    message: string;

    @IsString()
    @IsOptional()
    token: string;

    @IsString()
    @IsOptional()
    prompt: string;

    @IsString()
    bot: string;
}
