import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { RegisterService } from './register.service';
import { RegisterVenueDto } from './dto/register.dto';

@Auth(Role.USER)
@Controller('venue')
export class RegisterController {
    constructor(private readonly registerVenuService: RegisterService) {}

    @Post('register')
    async domain(@Body() SetRegisterVenueDto: RegisterVenueDto) {
        return this.registerVenuService.setRegister(SetRegisterVenueDto);
    }
}
