import { Module } from '@nestjs/common';
import { UrlscanService } from './urlscan.service';
import { UrlscanController } from './urlscan.controller';

@Module({
  providers: [UrlscanService],
  controllers: [UrlscanController]
})
export class UrlscanModule {}
