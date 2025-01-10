import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Request() req: { user: { id: number } },
    @Query('tz') tz: string,
  ) {
    console.log({ user: req.user });

    return await this.profilesService.getProfile(tz, req.user.id);
  }
}
