import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto {
    @ApiProperty({ description: 'The email of the user', example: 'example@gmail.com' })

    email: string; 
    @ApiProperty({ description: 'The password of the user', minLength: 6 })

    password: string;
}
