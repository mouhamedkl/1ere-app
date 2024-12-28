import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
        @ApiProperty({ description: 'The name of the user' })

        name?: string; 
        @ApiProperty({ description: 'The email of the user', example: 'example@gmail.com' })
        email?: string;
      
      
}
