import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from '../dto/signup.auth.dto';

export class SignupEntity extends PartialType(SignUpDto) {
  @ApiProperty({ description: 'The id of the users', example: 1 })
  id: number;

  @ApiProperty({
    description: 'The email of the user',
    example: 'alief@gmail.io',
  })
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'aliefdany',
  })
  username: string;
}
