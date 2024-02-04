import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterVenue } from './entities/register.entity';
import { RegisterController } from './register.controller';
import { PersonService } from 'src/person/person.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterVenue])],
  providers: [RegisterService, PersonService],
  controllers: [RegisterController]
})
export class RegisterModule {}
