import { Module } from '@nestjs/common';
import { DniService } from './dni.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DNI } from './entities/dni.entity';
import { DniController } from './dni.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DNI])],
  controllers: [DniController],
  providers: [DniService]
})
export class DniModule {}
