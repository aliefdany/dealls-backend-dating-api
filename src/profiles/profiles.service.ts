import { BadRequestException, Injectable } from '@nestjs/common';
import { PremiumPackageStrategy } from './package-strategy/concrete-strategies/package-strategy.concrete.premium';
import { RegularPackageStrategy } from './package-strategy/concrete-strategies/package-strategy.concrete.regular';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileContext } from './package-strategy/package-strategy.context';
import { Prisma, Swipes } from '@prisma/client';

@Injectable()
export class ProfilesService {
  private profileContext: ProfileContext;

  constructor(private prisma: PrismaService) {}

  async getProfile(tz: string, id: number): Promise<Swipes> {
    const date = this.getCurrentLocalDate(tz);

    const profile = await this.getProfileWithPackage(id);

    this.setProfilePackageStrategy(profile.package.name, id, date);

    return this.profileContext.viewProfile();
  }

  async getProfileWithPackage(
    profileId: number,
  ): Promise<Prisma.ProfileGetPayload<{ include: { package: true } }>> {
    return await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: { package: true },
    });
  }

  private getCurrentLocalDate(timeZone: string) {
    return new Date().toLocaleDateString('en-CA', { timeZone });
  }

  private setProfilePackageStrategy(
    packageName: string,
    profileId: number,
    date: string,
  ) {
    switch (packageName) {
      case 'Regular':
        this.profileContext = new ProfileContext(
          new RegularPackageStrategy(this.prisma, profileId, date),
        );
        break;
      case 'Premium':
        this.profileContext = new ProfileContext(
          new PremiumPackageStrategy(this.prisma, profileId, date),
        );
      default:
        throw new BadRequestException('Package name is invalid');
    }
  }
}
