import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshJwtGuard } from './guard/refresh.guard';
import { RequestWithUser } from './interface/req.interface';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    /* console.log('refreshed'); */
    return await this.authService.refreshToken(req.body.email);
  }

  @Get('profile')
  @Auth(Role.USER)
  profile(@Request() req: RequestWithUser) {
    // Obtenemos información del usuario logeado
    const email = req.user.email;
    return this.authService.profile({ email });
  }
}
