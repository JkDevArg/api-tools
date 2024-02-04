import { Body, Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { PersonService } from './person.service';

@Auth(Role.USER)
@Controller('person')
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    @Get('person')
    async getPerson() {
        return this.personService.getPerson();
    }
}
