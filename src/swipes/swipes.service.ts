import { Injectable } from '@nestjs/common';
import { UpdateSwipeDto } from './dto/update-swipe.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SwipesService {
  constructor(private prismaService: PrismaService) {}
  async swipeProfile(
    id: number,
    updateSwipeDto: UpdateSwipeDto,
    userId: number,
  ) {
    const profile = await this.prismaService.profile.findUnique({
      where: { user_id: userId },
    });

    return this.prismaService.swipes.update({
      where: { id, swiper_id: profile.id },
      data: updateSwipeDto,
      include: {
        swipee: true,
      },
    });
  }
}
