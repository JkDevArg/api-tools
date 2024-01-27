import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ABUSEIP } from './entities/abuseip.entity';
import { AbuseipController } from './abuseip.controller';
import { AbuseipService } from './abuseip.service';

@Module({
    imports: [TypeOrmModule.forFeature([ABUSEIP])],
    controllers: [AbuseipController],
    providers: [AbuseipService]
})
export class AbuseipModule {}
