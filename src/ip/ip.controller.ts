import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { getIpDto } from './dto/ip.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { IpService } from './ip.service';

@Auth(Role.USER)
@Controller('ip')
export class IpController {
    constructor(private readonly ipGeoService: IpService) {}

    @Get('getip')
    async getoip(@Body() GetGeoIp: getIpDto, @ActiveUser() user: UserActiveInterface) {
        return this.ipGeoService.getDataIp(GetGeoIp, user);
    }

    @Get('ips')
    findAll(@ActiveUser() user: UserActiveInterface) {
        return this.ipGeoService.findAll(user);
    }
}
