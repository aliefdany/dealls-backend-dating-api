import { Test, TestingModule } from '@nestjs/testing';
import { SwipesService } from './swipes.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSwipeDto } from './dto/update-swipe.dto';
import { BadRequestException } from '@nestjs/common';

describe('SwipesService', () => {
  let service: SwipesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    profile: {
      findUnique: jest.fn(),
    },
    swipes: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwipesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SwipesService>(SwipesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('swipeProfile', () => {
    it('should successfully swipe a profile', async () => {
      const id = 1;
      const updateSwipeDto: UpdateSwipeDto = { like: true };
      const userId = 2;

      // Mocked Prisma responses
      mockPrismaService.profile.findUnique.mockResolvedValue({
        id: userId,
      });
      mockPrismaService.swipes.update.mockResolvedValue({
        id: 1,
        swipee_id: 3,
        swiper_id: 2,
        date: new Date(),
        like: true,
        swipee: { id: 3, name: 'Swipee Name' },
      });

      const result = await service.swipeProfile(id, updateSwipeDto, userId);

      expect(prismaService.profile.findUnique).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
      expect(prismaService.swipes.update).toHaveBeenCalledWith({
        where: { id, swiper_id: userId },
        data: updateSwipeDto,
        include: { swipee: true },
      });
      expect(result).toEqual({
        id: 1,
        swipee_id: 3,
        swiper_id: 2,
        date: expect.any(Date),
        like: true,
        swipee: { id: 3, name: 'Swipee Name' },
      });
    });

    it('should throw an error if profile not found', async () => {
      const id = 1;
      const updateSwipeDto: UpdateSwipeDto = { like: true };
      const userId = 2;

      mockPrismaService.profile.findUnique.mockResolvedValue(null);

      await expect(
        service.swipeProfile(id, updateSwipeDto, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the swipe update fails', async () => {
      const id = 1;
      const updateSwipeDto: UpdateSwipeDto = { like: true };
      const userId = 2;

      mockPrismaService.profile.findUnique.mockResolvedValue({
        id: userId,
      });
      mockPrismaService.swipes.update.mockRejectedValue(
        new Error('Database Error'),
      );

      await expect(
        service.swipeProfile(id, updateSwipeDto, userId),
      ).rejects.toThrow('Database Error');
    });
  });
});
