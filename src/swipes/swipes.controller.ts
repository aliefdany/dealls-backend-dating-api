import {
  Controller,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SwipesService } from './swipes.service';
import { UpdateSwipeDto } from './dto/update-swipe.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('swipes')
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSwipeDto: UpdateSwipeDto,
    @Request() req: { user: { id: number } },
  ) {
    console.log({ id, updateSwipeDto, user: req.user });
    return this.swipesService.swipeProfile(+id, updateSwipeDto, req.user.id);
  }
}
