import { PrismaService } from 'src/prisma/prisma.service';
import { ProfilePackageStrategy } from '../package-strategy.interface';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Swipes } from '@prisma/client';

export class RegularPackageStrategy implements ProfilePackageStrategy {
  private prisma: PrismaService;
  private profileId: number;
  private date: Date;

  constructor(prisma: PrismaService, profileId: number, date: string) {
    this.prisma = prisma;
    this.profileId = profileId;
    this.date = new Date(date);
  }

  async viewProfile(): Promise<Swipes> {
    const swipes = await this.prisma.swipes.findMany({
      where: { swiper_id: this.profileId, date: this.date },
    });

    if (swipes.length > 10) {
      throw new ForbiddenException(
        'View profile quota exceeded, purchase premium package to continue',
      );
    }

    const profile = await this.prisma.profile.findFirst({
      where: {
        swiping: {
          none: {
            date: this.date,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const swipe = this.prisma.swipes.create({
      data: {
        swiper_id: this.profileId,
        swipee_id: profile.id,
        date: this.date,
      },
      include: {
        swipee: true,
      },
    });

    return swipe;
  }

  //   showBadge(): string {}
}
