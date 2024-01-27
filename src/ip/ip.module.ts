import { Module } from '@nestjs/common';
import { IpService } from './ip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IP } from './entities/ip.entity';
import { IpController } from './ip.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IP])],
  controllers: [IpController],
  providers: [IpService]
})
export class IpModule {}
