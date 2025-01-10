import { Controller, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ProfilesService } from 'src/profiles/profiles.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OrderEntity } from 'src/orders/entities/order.entity';

@Controller({ version: '1', path: 'payments' })
@ApiTags('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private profileService: ProfilesService,
  ) {}

  @Patch()
  @ApiOperation({
    summary: 'Pay the created order',
    description: 'After paying order, user will get the updated package type',
  })
  @ApiBody({
    type: UpdatePaymentDto,
    description: 'Pay specific order',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OrderEntity })
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
