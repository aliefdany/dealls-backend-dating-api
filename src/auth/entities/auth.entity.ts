import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

type UserType = Prisma.UserGetPayload<{ omit: { password: true; id: true } }>;
export class AuthEntity implements UserType {
  @ApiProperty({
    description: "User's username",
    example: 'alief123',
  })
  username: string;

  @ApiProperty({ description: 'JWT token for bearer auth' })
  accessToken: string;
}
