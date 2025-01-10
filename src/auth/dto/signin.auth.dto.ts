import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: "Account's username",
    example: 'alief',
  })
  username: string;

  @IsString()
  @MaxLength(12)
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: "Account's password",
    example: 'random123',
  })
  password: string;
}
