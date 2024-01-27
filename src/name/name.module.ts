import { Module } from '@nestjs/common';
import { NameService } from './name.service';
import { NameController } from './name.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Name } from './entities/name.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Name])],
  providers: [NameService],
  controllers: [NameController]
})
export class NameModule {}
