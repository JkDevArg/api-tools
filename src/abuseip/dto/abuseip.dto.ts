import { IsDateString, IsIP, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
import { IsReportCategory } from 'src/common/decorators/is-valid-report.decorator';

export class setCommentReport {
  @IsString()
  @IsIP()
  ip: string;

  @IsReportCategory()
  categories: string;

  @IsString()
  comment: string;

  @IsDateString()
  @IsOptional()
  timestamp: string;
}

export class getAbuseIpDto {
    @IsString()
    @IsIP()
    ip: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    maxAgeInDays: number; 

    @IsString()
    @IsOptional()
    verbose: string;
}

export class getCheckBlockNetwork {
    @IsString()
    network: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    maxAgeInDays: number; 
}

export class setClearAddress {
    @IsString()
    @IsIP()
    ip: string;
}

export class pingIp {
    @IsString()
    @IsIP()
    ip: string;
}