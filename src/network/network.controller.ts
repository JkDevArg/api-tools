import { Body, Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { NetworkDomainDto } from './dto/network.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { NetworkService } from './network.service';

@Auth(Role.USER)
@Controller('network')
export class NetworkController {
    constructor(private readonly networkService: NetworkService) {}

    @Get('domain')
    async domain(@Body() GetDomain: NetworkDomainDto, @ActiveUser() user: UserActiveInterface) {
        return this.networkService.getNetworkDomain(GetDomain, user);
    }

    @Get('certified')
    async certified(@Body() GetCertified: NetworkDomainDto, @ActiveUser() user: UserActiveInterface) {
        return this.networkService.getNetworkCertified(GetCertified, user);
    }

    @Get()
    findAll(@ActiveUser() user: UserActiveInterface) {
        return this.networkService.findAll(user);
    }
}
