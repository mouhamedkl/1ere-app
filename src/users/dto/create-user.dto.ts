import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';
import { Role } from '../entities/user.entity';
export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @Length(3,10)
  name: string;

  @ApiProperty({ description: 'The email of the user', example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', minLength: 6 })
  @Length(3,10)
  password: string;
  @ApiProperty({ description: 'The role of the user' })
  @IsString()
  role: Role;
  }
  