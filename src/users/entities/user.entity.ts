import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

type UserWithoutPassword = Prisma.UserGetPayload<{ omit: { password: true } }>;
export class UserEntity implements UserWithoutPassword {
  @ApiProperty({ description: 'The id of the users', example: 1 })
  id: number;

  @ApiProperty({
    description: 'The username of the user',
    example: 'aliefdany',
  })
  username: string;
}
