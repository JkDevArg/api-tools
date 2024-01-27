import { Body, Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { UrlscanService } from './urlscan.service';
import { getUrlScanDto } from './dto/urlscan.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Auth(Role.USER)
@Controller('urlscan')
export class UrlscanController {
    constructor(private readonly urlScanService: UrlscanService) {}

    @Get('urlscan')
    async domain(@Body() GetUrlScan: getUrlScanDto, @ActiveUser() user: UserActiveInterface) {
        return this.urlScanService.getUrlScan(GetUrlScan, user);
    }

    @Get()
    findAll(@ActiveUser() user: UserActiveInterface) {
        return this.urlScanService.findAll(user);
    }
}
