import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.auth.dto';
import { SignUpDto } from './dto/signup.auth.dto';
import { AuthEntity } from './entities/auth.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // Mock response for successful authentication
  const mockAuthResponse: AuthEntity = {
    accessToken: 'mock-token',
    username: 'testuser',
  };

  // Mock AuthService
  const mockAuthService = {
    signin: jest.fn(),
    signUp: jest.fn(),
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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      username: 'testuser',
      password: 'password123',
    };

    it('should successfully sign in a user', async () => {
      mockAuthService.signin.mockResolvedValue(mockAuthResponse);

      const result = await controller.signIn(signInDto);

      expect(result).toBe(mockAuthResponse);
      expect(service.signin).toHaveBeenCalledWith(
        signInDto.username,
        signInDto.password,
      );
      expect(service.signin).toHaveBeenCalledTimes(1);
    });

    it('should call AuthService.signin with correct parameters', async () => {
      await controller.signIn(signInDto);

      expect(service.signin).toHaveBeenCalledWith(
        signInDto.username,
        signInDto.password,
      );
    });

    // Test error scenarios
    it('should throw an error if AuthService.signin fails', async () => {
      const errorMessage = 'Invalid credentials';
      mockAuthService.signin.mockRejectedValue(new Error(errorMessage));

      await expect(controller.signIn(signInDto)).rejects.toThrow(errorMessage);
    });
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      username: 'newuser',
      password: 'password123',
    };

    it('should successfully register a new user', async () => {
      mockAuthService.signUp.mockResolvedValue(mockAuthResponse);

      const result = await controller.signUp(signUpDto);

      expect(result).toBe(mockAuthResponse);
      expect(service.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
      expect(service.signUp).toHaveBeenCalledTimes(1);
    });

    it('should call AuthService.signUp with correct parameters', async () => {
      await controller.signUp(signUpDto);

      expect(service.signUp).toHaveBeenCalledWith(
        signUpDto.username,
        signUpDto.password,
      );
    });

    // Test error scenarios
    it('should throw an error if AuthService.signUp fails', async () => {
      const errorMessage = 'Username already exists';
      mockAuthService.signUp.mockRejectedValue(new Error(errorMessage));

      await expect(controller.signUp(signUpDto)).rejects.toThrow(errorMessage);
    });
  });
});
