import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.auth.dto';
import { AuthEntity } from './entities/auth.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token when valid credentials are provided', async () => {
      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'password123',
      };

      const expectedAuthEntity: AuthEntity = { accessToken: 'testAccessToken' };
      mockAuthService.signin.mockResolvedValue(expectedAuthEntity);

      const result = await authController.login(signInDto);
      expect(result).toEqual(expectedAuthEntity);
      expect(authService.signin).toHaveBeenCalledWith(
        signInDto.username,
        signInDto.password,
      );
    });
  });
});
