import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'; 
@Injectable()
export class AuthService {
  constructor(
    private  usersService: UsersService,
    private  jwtService: JwtService,
  ) {}
  async validateUser(userlogin: CreateAuthDto): Promise<any> {
    const user = await this.usersService.findByEmail(userlogin.email); 
    if (user && await bcrypt.compare(userlogin.password, user.password)) { 
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
   async login(loginUserDto: CreateAuthDto) {
    const user = await this.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id , role:user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); 
    createUserDto.password = hashedPassword;
    const user = await this.usersService.create(createUserDto); 
    return {
      message: 'User registered successfully',
    };
  }
}