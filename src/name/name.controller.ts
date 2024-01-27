import { Body, Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { NameService } from './name.service';
import { NameDto } from './dto/name.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Auth(Role.USER)
@Controller('name')
export class NameController {
    constructor(private readonly nameService: NameService) {}

    @Get('national')
    async domain(@Body() GetDomain: NameDto, @ActiveUser() user: UserActiveInterface) {
        return this.nameService.getName(GetDomain, user);
    }
    
    @Get()
    findAll(@ActiveUser() user: UserActiveInterface) {
        return this.nameService.findAll(user);
    }
}
