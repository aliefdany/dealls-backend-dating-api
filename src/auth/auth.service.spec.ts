import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signin.auth.dto';
import { AuthEntity } from './entities/auth.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockAccount = {
    id: 1,
    username: 'testuser',
    password: 'password123',
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
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
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signin', () => {
    it('should return an access token if username and password are valid', async () => {
      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockAccount);
      mockJwtService.sign.mockReturnValue('testAccessToken');

      const result: AuthEntity = await authService.signin(
        signInDto.username,
        signInDto.password,
      );
      expect(result).toEqual({ accessToken: 'testAccessToken' });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: signInDto.username },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        accountId: mockAccount.id,
      });
    });

    it('should throw NotFoundException if the user is not found', async () => {
      const signInDto: SignInDto = {
        username: 'wronguser',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.signin(signInDto.username, signInDto.password),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: signInDto.username },
      });
    });

    it('should throw UnauthorizedException if the password is invalid', async () => {
      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockAccount);

      await expect(
        authService.signin(signInDto.username, signInDto.password),
      ).rejects.toThrow(UnauthorizedException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: signInDto.username },
      });
    });
  });
});
