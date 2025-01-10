import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { OrderEntity } from './entities/order.entity';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
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

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call OrdersService.create with correct parameters and return an OrderEntity', async () => {
      const createOrderDto: CreateOrderDto = {
        packageId: 12,
      };
      const userId = 1;
      const mockOrderEntity: OrderEntity = {
        id: 2,
        order_id: 12,
        status: 'pending',
        order: {
          id: 12,
          user_id: userId,
          package_id: createOrderDto.packageId,
        },
      };

      mockOrdersService.create.mockResolvedValue(mockOrderEntity);

      const response = await controller.create(createOrderDto, {
        user: { id: userId },
      });

      expect(mockOrdersService.create).toHaveBeenCalledWith(
        createOrderDto,
        userId,
      );
      expect(response).toEqual(mockOrderEntity);
    });
  });
});
