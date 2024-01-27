import { Module } from '@nestjs/common';
import { UrlscanService } from './urlscan.service';
import { UrlscanController } from './urlscan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { URLSCAN } from './entities/urlscan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([URLSCAN])],
  providers: [UrlscanService],
  controllers: [UrlscanController]
})
export class UrlscanModule {}
