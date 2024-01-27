import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { IsTemplateEmail } from "src/common/decorators/is-valid-email-template.decorator";

export class sendEmailDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    subject: string;

    @IsString()
    body: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    hostmail?: string;

    @IsString()
    @IsOptional()
    hostname?: string;

    @IsNumber()
    @IsOptional()
    port?: number;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    t_redirect_url?: string;

    @IsString()
    @IsOptional()
    t_vic_name?: string;

    @IsString()
    @IsOptional()
    t_title?: string;

    @IsTemplateEmail()
    template: string;

    @IsBoolean()
    @IsOptional()
    secure?: boolean;

    @IsBoolean()
    victim: boolean;
}

export class getDataVictim {
    @IsString()
    url: string;
}
