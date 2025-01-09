import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: "User's email",
    example: 'alief',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: "Account's username",
    example: 'alief',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: "Account's password",
    example: 'random123',
  })
  password: string;
}
