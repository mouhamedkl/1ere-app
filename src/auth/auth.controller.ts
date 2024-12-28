import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from './../users/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() loginreq:CreateAuthDto){
    return this.authService.login(loginreq);
  }
  @Post('register')
  register(@Body() loginreq:CreateUserDto){
    return this.authService.register(loginreq);
  }
}
