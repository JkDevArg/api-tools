import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { AbuseipService } from './abuseip.service';
import { pingIp } from './dto/abuseip.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Auth(Role.USER)
@Controller('abuseip')
export class AbuseipController {
    constructor(private readonly pingService: AbuseipService){}

    @Post('sendping')
    async sendPing(@Body() setPing: pingIp, @ActiveUser() user: UserActiveInterface){
        return this.pingService.setPing(setPing, user);
    }
}
