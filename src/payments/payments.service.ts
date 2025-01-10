import { Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prismaService: PrismaService) {}

  async payOrder(updatePaymentDto: UpdatePaymentDto) {
    return await this.prismaService.payment.update({
      where: { order_id: updatePaymentDto.orderId },
      // just to demonstrate payment
      data: { status: 'PAID' },
      include: {
        order: true,
      },
    });
  }
}
