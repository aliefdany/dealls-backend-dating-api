import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let profilesService: ProfilesService;

  const mockProfilesService = {
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfilesService,
          useValue: mockProfilesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { id: 1 }; // Mock authenticated user
          return true;
        },
      })
      .compile();

    controller = module.get<ProfilesController>(ProfilesController);
    profilesService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should fetch a profile for the authenticated user', async () => {
      const userId = 1;
      const tz = 'Asia/Jakarta';
      const mockProfile = {
        id: 2,
        swipee_id: 3,
        swiper_id: userId,
        date: new Date(),
        like: false,
      };

      mockProfilesService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile({ user: { id: userId } }, tz);

      expect(profilesService.getProfile).toHaveBeenCalledWith(tz, userId);
      expect(result).toEqual(mockProfile);
    });
  });
});
