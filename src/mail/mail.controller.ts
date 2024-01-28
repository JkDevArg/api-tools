import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { MailService } from './mail.service';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { getDataVictim, sendEmailDto } from './dto/mail.dto';

@Auth(Role.ADMIN)
@Controller('mail')
export class MailController {
    constructor(private readonly sendEmailService: MailService) {}

    @Get('getcredentials')
    async getCredentials(@Body() GetDataVictim: getDataVictim, @ActiveUser() user: UserActiveInterface){
        return this.sendEmailService.getDataVictim(GetDataVictim);
    }

    @Post('sendmail')
    async sendMail(@Body() sendEmailDto: sendEmailDto, @ActiveUser() user: UserActiveInterface){
        return this.sendEmailService.sendEmail(sendEmailDto);
    }
}
