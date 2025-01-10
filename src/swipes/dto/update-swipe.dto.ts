import { PartialType } from '@nestjs/swagger';
import { CreateSwipeDto } from './create-swipe.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateSwipeDto extends PartialType(CreateSwipeDto) {
  @IsBoolean()
  @IsNotEmpty()
  like: boolean;
}
