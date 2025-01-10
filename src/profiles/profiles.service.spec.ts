import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { ProfileContext } from './package-strategy/package-strategy.context';
import { RegularPackageStrategy } from './package-strategy/concrete-strategies/package-strategy.concrete.regular';
import { PremiumPackageStrategy } from './package-strategy/concrete-strategies/package-strategy.concrete.premium';

// Mock ProfileContext class
jest.mock('./package-strategy/package-strategy.context');

describe('ProfilesService', () => {
  let service: ProfilesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    profile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return profile for regular package', async () => {
      const userId = 1;
      const tz = 'Asia/Jakarta';
      const mockProfile = {
        id: userId,
        package: { name: 'Regular' },
      };

      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);

      // Mock return value for viewProfile method
      const mockProfileData = {
        id: 1,
        swiper_id: 1,
        swipee_id: 2,
        date: new Date(),
        like: true,
      };

      // Mock the viewProfile method of ProfileContext to return the mock profile data
      ProfileContext.prototype.viewProfile = jest
        .fn()
        .mockResolvedValue(mockProfileData);

      const result = await service.getProfile(tz, userId);

      expect(mockPrismaService.profile.findUnique).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: { package: true },
      });
      expect(ProfileContext).toHaveBeenCalledWith(
        expect.any(RegularPackageStrategy),
      ); // Assert ProfileContext constructor was called
      expect(result).toBe(mockProfileData); // Check if it matches the mock profile data
    });

    it('should return profile for premium package', async () => {
      const userId = 1;
      const tz = 'Asia/Jakarta';
      const mockProfile = {
        id: userId,
        package: { name: 'Premium' },
      };

      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);

      // Mock return value for viewProfile method
      const mockProfileData = {
        id: 1,
        swiper_id: 1,
        swipee_id: 2,
        date: new Date(),
        like: true,
      };

      // Mock the viewProfile method of ProfileContext to return the mock profile data
      ProfileContext.prototype.viewProfile = jest
        .fn()
        .mockResolvedValue(mockProfileData);

      const result = await service.getProfile(tz, userId);

      expect(mockPrismaService.profile.findUnique).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: { package: true },
      });
      expect(ProfileContext).toHaveBeenCalledWith(
        expect.any(PremiumPackageStrategy),
      ); // Assert ProfileContext constructor was called
      expect(result).toBe(mockProfileData); // Check if it matches the mock profile data
    });

    it('should throw BadRequestException if package is invalid', async () => {
      const userId = 1;
      const tz = 'Asia/Jakarta';
      const mockProfile = {
        id: userId,
        package: { name: 'InvalidPackage' },
      };

      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);

      await expect(service.getProfile(tz, userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updatePackage', () => {
    it('should update the user profile package', async () => {
      const userId = 1;
      const packageId = 2;
      const mockUpdatedProfile = { id: userId, package_id: packageId };

      mockPrismaService.profile.update.mockResolvedValue(mockUpdatedProfile);

      const result = await service.updatePackage(userId, packageId);

      expect(mockPrismaService.profile.update).toHaveBeenCalledWith({
        where: { user_id: userId },
        data: { package_id: packageId },
      });
      expect(result).toEqual(mockUpdatedProfile);
    });
  });
});
