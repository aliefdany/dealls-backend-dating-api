import { Swipes } from '@prisma/client';

export interface ProfilePackageStrategy {
  viewProfile(): Promise<Swipes>;
  //   showBadge(): string;
}
