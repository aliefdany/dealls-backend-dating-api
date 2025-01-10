import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from 'src/auth/dto/signup.auth.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user without password', async () => {
      const userId = 1;

      const mockUser = {
        id: userId,
        username: 'aliefdany',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        omit: { password: true },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const userId = 1;

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.getUserById(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        omit: { password: true },
      });
      expect(result).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return a user by username without password', async () => {
      const username = 'aliefdany';

      const mockUser = {
        id: 1,
        username,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUser(username);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
        omit: { password: true },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by username', async () => {
      const username = 'aliefdany';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.getUser(username);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
        omit: { password: true },
      });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user and return user without password', async () => {
      const createUserDto: SignUpDto = {
        username: 'aliefdany',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        username: createUserDto.username,
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
        omit: { password: true },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
