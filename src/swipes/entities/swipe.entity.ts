import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Profile } from '@prisma/client';

type SwipeWithSwipee = Prisma.SwipesGetPayload<{ include: { swipee: true } }>;

export class SwipeEntity implements SwipeWithSwipee {
  @ApiProperty({
    description: 'Swipes id',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({ description: 'Swipee id', example: 1, type: Number })
  swipee_id: number;

  @ApiProperty({ description: 'Swiper id', example: 2, type: Number })
  swiper_id: number;

  @ApiProperty({ description: 'Swipee id', example: 1, type: Date })
  date: Date;

  @ApiProperty({
    description: 'Wether swiper like swipee',
    example: false,
    type: Boolean,
  })
  like: boolean;

  swipee: Profile;
}
