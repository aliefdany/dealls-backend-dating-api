import { ApiProperty } from '@nestjs/swagger';
import { Swipes } from '@prisma/client';

export class ProfileEntity implements Swipes {
  @ApiProperty({
    description: 'Swipe id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Swipee id',
    example: 1,
  })
  swipee_id: number;

  @ApiProperty({
    description: 'Swiper id',
    example: 1,
  })
  swiper_id: number;

  @ApiProperty({
    description: 'Swipe date',
    example: 1,
  })
  date: Date;

  @ApiProperty({
    description: 'Wether swiper like the swipee',
    example: false,
  })
  like: boolean;
}
