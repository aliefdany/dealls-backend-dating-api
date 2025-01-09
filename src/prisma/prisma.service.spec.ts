import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should call $connect on module initialization', async () => {
    const connectSpy = jest
      .spyOn(prismaService, '$connect')
      .mockImplementation(async () => {});

    await prismaService.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });
});
