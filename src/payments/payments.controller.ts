import { Controller, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ProfilesService } from 'src/profiles/profiles.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private profileService: ProfilesService,
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  async payOrder(
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Request() req: { user: { id: number } },
  ) {
    const payment = await this.paymentsService.payOrder(updatePaymentDto);

    await this.profileService.updatePackage(
      req.user.id,
      payment.order.package_id,
    );

    return payment;
  }
}
