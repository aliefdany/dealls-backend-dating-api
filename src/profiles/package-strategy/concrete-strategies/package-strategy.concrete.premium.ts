import { PrismaService } from 'src/prisma/prisma.service';
import { ProfilePackageStrategy } from '../package-strategy.interface';
import { NotFoundException } from '@nestjs/common';
import { Swipes } from '@prisma/client';

export class PremiumPackageStrategy implements ProfilePackageStrategy {
  prisma: PrismaService;
  date: string;
  profileId: number;

  constructor(prisma: PrismaService, profileId: number, date: string) {
    this.prisma = prisma;
    this.profileId = profileId;
    this.date = date;
  }

  async viewProfile(): Promise<Swipes> {
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

  showBadge(): string {
    return 'Special Premium Badge Displayed.';
  }
}
