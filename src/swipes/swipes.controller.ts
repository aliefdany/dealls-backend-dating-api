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
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SwipeEntity } from './entities/swipe.entity';

@Controller({ version: '1', path: 'swipes' })
@ApiTags('swipes')
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @Patch(':id')
  @ApiOperation({
    summary: 'Swipe a profile',
    description: 'User can swipe left to pass and right to like',
  })
  @ApiBody({
    type: UpdateSwipeDto,
    examples: {
      example1: {
        summary: "Swipe other user's profile",
        value: {
          like: true,
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Swipes id', type: Number })
  @ApiOkResponse({ type: SwipeEntity })
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSwipeDto: UpdateSwipeDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.swipesService.swipeProfile(+id, updateSwipeDto, req.user.id);
  }
}
