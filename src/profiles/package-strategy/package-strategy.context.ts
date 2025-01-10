import { Swipes } from '@prisma/client';
import { ProfilePackageStrategy } from './package-strategy.interface';

export class ProfileContext {
  private strategy: ProfilePackageStrategy;

  constructor(strategy: ProfilePackageStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ProfilePackageStrategy): void {
    this.strategy = strategy;
  }

  async viewProfile(): Promise<Swipes> {
    return this.strategy.viewProfile();
  }

  //   showBadge(): string {
  //     return this.strategy.showBadge();
  //   }
}
