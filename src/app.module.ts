import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CustomValidationPipe } from './custom-validation.pipe';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ProfilesModule, AuthModule],
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
