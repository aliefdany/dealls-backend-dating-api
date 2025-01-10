import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';

@Controller({ version: '1', path: 'profiles' })
@ApiTags('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a profile from other user',
    description:
      'Get other profile to swipe, user with regular package can only view 10 profile in a day, to get unlimited quota user must purchase premium package',
  })
  @ApiParam({
    name: 'tz',
    description: 'IANA timezone format',
    type: String,
    example: 'Asia/Jakarta',
  })
  @ApiOkResponse({ type: ProfileEntity })
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Request() req: { user: { id: number } },
    @Query('tz') tz: string,
  ) {
    return await this.profilesService.getProfile(tz, req.user.id);
  }
}
