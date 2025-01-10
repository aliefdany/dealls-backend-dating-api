import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order and return it', async () => {
      const packageId = 12;
      const userId = 1;
      const mockOrder = { id: 101, user_id: userId, package_id: packageId };

      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      const result = await service.createOrder(packageId, userId);

      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: { user_id: userId, package_id: packageId },
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('createPayment', () => {
    it('should create a new payment and return it', async () => {
      const orderId = 101;
      const mockPayment = {
        id: 201,
        order_id: orderId,
        status: 'PENDING',
        order: { id: orderId, items: [], total: 100 },
      };

      mockPrismaService.payment.create.mockResolvedValue(mockPayment);

      const result = await service.createPayment(orderId);

      expect(prismaService.payment.create).toHaveBeenCalledWith({
        data: {
          order_id: orderId,
          status: 'PENDING',
        },
        include: {
          order: true,
        },
      });
      expect(result).toEqual(mockPayment);
    });
  });

  describe('create', () => {
    it('should create an order and payment and return the payment', async () => {
      const createOrderDto = { packageId: 12 };
      const userId = 1;
      const mockOrder = {
        id: 101,
        user_id: userId,
        package_id: createOrderDto.packageId,
      };
      const mockPayment = {
        id: 201,
        order_id: mockOrder.id,
        status: 'PENDING',
        order: mockOrder,
      };

      jest.spyOn(service, 'createOrder').mockResolvedValue(mockOrder);
      jest.spyOn(service, 'createPayment').mockResolvedValue(mockPayment);

      const result = await service.create(createOrderDto, userId);

      expect(service.createOrder).toHaveBeenCalledWith(
        createOrderDto.packageId,
        userId,
      );
      expect(service.createPayment).toHaveBeenCalledWith(mockOrder.id);
      expect(result).toEqual(mockPayment);
    });
  });
});
