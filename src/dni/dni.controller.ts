import { Body, Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { DniService } from './dni.service';
import { getDniDto } from './dto/dni.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Auth(Role.USER)
@Controller('dni')
export class DniController {
    constructor(private readonly dniService: DniService){}

    @Get('getdni')
    async getdni(@Body() GetDni: getDniDto, @ActiveUser() user: UserActiveInterface){
        return this.dniService.getDataDni(GetDni, user);
    }

    @Get('dni')
    findAll(@ActiveUser() user: UserActiveInterface){
        return this.dniService.findAll(user);
    }
}
