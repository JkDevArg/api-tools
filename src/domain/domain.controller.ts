import { Body, Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { DomainService } from './domain.service';
import { getDomainDto } from './dto/domain.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Auth(Role.USER)
@Controller('domain')
export class DomainController {
    constructor(private readonly domainService: DomainService) {}

    @Get('getdomain')
    async domain(@Body() GetDomain: getDomainDto, @ActiveUser() user: UserActiveInterface) {
        return this.domainService.getDataDomain(GetDomain, user);
    }

    @Get()
    findAll(@ActiveUser() user: UserActiveInterface) {
        return this.domainService.findAll(user);
    }
}
