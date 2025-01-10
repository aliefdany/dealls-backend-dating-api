import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSwipeDto } from './create-swipe.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateSwipeDto extends PartialType(CreateSwipeDto) {
  @ApiProperty({
    required: true,
    description: 'Whether swiper like the swipee',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  like: boolean;
}
