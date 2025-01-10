import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    payment: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('payOrder', () => {
    it('should update the payment status and return the updated payment', async () => {
      // Arrange
      const updatePaymentDto: UpdatePaymentDto = { orderId: 12 };
      const mockUpdatedPayment = {
        id: 101,
        status: 'PAID',
        order_id: updatePaymentDto.orderId,
        order: {
          id: updatePaymentDto.orderId,
          package_id: 3,
        },
      };

      mockPrismaService.payment.update.mockResolvedValue(mockUpdatedPayment);

      // Act
      const result = await service.payOrder(updatePaymentDto);

      // Assert
      expect(prismaService.payment.update).toHaveBeenCalledWith({
        where: { order_id: updatePaymentDto.orderId },
        data: { status: 'PAID' },
        include: { order: true },
      });
      expect(result).toEqual(mockUpdatedPayment);
    });
  });
});
