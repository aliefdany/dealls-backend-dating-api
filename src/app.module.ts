import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CustomValidationPipe } from './custom-validation.pipe';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { SwipesModule } from './swipes/swipes.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [UsersModule, ProfilesModule, AuthModule, SwipesModule, OrdersModule, PaymentsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
  ],
})
export class AppModule {}
