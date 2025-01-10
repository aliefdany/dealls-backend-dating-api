import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockProfile = {
    id: 1,
    user_id: 1,
    full_name: 'Test User',
    package_id: 1,
    dob: new Date(),
    bio: 'test',
    user: {
      id: 1,
      username: 'testuser',
      password: 'hashedPassword123',
    },
  };

  const mockPackage = {
    id: 1,
    name: 'Regular',
  };

  const mockPrismaService = {
    profile: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    package: {
      findFirst: jest.fn(),
    },
  };

  const mockUsersService = {
    getUser: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signin', () => {
    const signInCredentials = {
      username: 'testuser',
      password: 'password123',
    };

    it('should successfully sign in a user and return auth entity', async () => {
      const mockToken = 'jwt-token-123';
      mockPrismaService.profile.findFirst.mockResolvedValue(mockProfile);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.signin(
        signInCredentials.username,
        signInCredentials.password,
      );

      expect(result).toEqual({
        username: signInCredentials.username,
        accessToken: mockToken,
      });
      expect(prismaService.profile.findFirst).toHaveBeenCalledWith({
        where: { user: { username: signInCredentials.username } },
        include: { user: true },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInCredentials.password,
        mockProfile.user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: mockProfile.user.id,
        profileId: mockProfile.id,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.profile.findFirst.mockResolvedValue(null);

      await expect(
        service.signin(signInCredentials.username, signInCredentials.password),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockPrismaService.profile.findFirst.mockResolvedValue(mockProfile);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.signin(signInCredentials.username, signInCredentials.password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    const signUpCredentials = {
      username: 'newuser',
      password: 'password123',
    };

    const mockNewUser = {
      id: 2,
      username: signUpCredentials.username,
      password: 'hashedPassword456',
    };

    it('should successfully create a new user and profile', async () => {
      mockUsersService.getUser.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword456');
      mockUsersService.createUser.mockResolvedValue(mockNewUser);
      mockPrismaService.package.findFirst.mockResolvedValue(mockPackage);
      mockPrismaService.profile.create.mockResolvedValue({
        ...mockProfile,
        user_id: mockNewUser.id,
        full_name: mockNewUser.username,
      });

      const result = await service.signUp(
        signUpCredentials.username,
        signUpCredentials.password,
      );

      expect(result).toEqual(mockNewUser);
      expect(usersService.getUser).toHaveBeenCalledWith(
        signUpCredentials.username,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpCredentials.password, 10);
      expect(usersService.createUser).toHaveBeenCalledWith({
        username: signUpCredentials.username,
        password: 'hashedPassword456',
      });
      expect(prismaService.package.findFirst).toHaveBeenCalledWith({
        where: { name: 'Regular' },
      });
      expect(prismaService.profile.create).toHaveBeenCalledWith({
        data: {
          user_id: mockNewUser.id,
          full_name: mockNewUser.username,
          package_id: mockPackage.id,
          dob: expect.any(Date),
          bio: 'test',
        },
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      mockUsersService.getUser.mockResolvedValue(mockNewUser);

      await expect(
        service.signUp(signUpCredentials.username, signUpCredentials.password),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw error if package not found', async () => {
      mockUsersService.getUser.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword456');
      mockUsersService.createUser.mockResolvedValue(mockNewUser);
      mockPrismaService.package.findFirst.mockResolvedValue(null);

      await expect(
        service.signUp(signUpCredentials.username, signUpCredentials.password),
      ).rejects.toThrow();
    });
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword789';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await (service as any).hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });
});
