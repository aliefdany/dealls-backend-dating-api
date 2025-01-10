import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentsService: PaymentsService;
  let profilesService: ProfilesService;

  const mockPaymentsService = {
    payOrder: jest.fn(),
  };

  const mockProfilesService = {
    updatePackage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
        {
          provide: ProfilesService,
          useValue: mockProfilesService,
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

    controller = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
    profilesService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('payOrder', () => {
    it('should process payment and update the user package', async () => {
      const updatePaymentDto: UpdatePaymentDto = { orderId: 12 };
      const userId = 1;
      const mockPayment = {
        id: 101,
        status: 'PAID',
        order: {
          id: 12,
          package_id: 3,
        },
      };

      mockPaymentsService.payOrder.mockResolvedValue(mockPayment);
      mockProfilesService.updatePackage.mockResolvedValue(undefined);

      const result = await controller.payOrder(updatePaymentDto, {
        user: { id: userId },
      });

      expect(paymentsService.payOrder).toHaveBeenCalledWith(updatePaymentDto);
      expect(profilesService.updatePackage).toHaveBeenCalledWith(
        userId,
        mockPayment.order.package_id,
      );
      expect(result).toEqual(mockPayment);
    });
  });
});
