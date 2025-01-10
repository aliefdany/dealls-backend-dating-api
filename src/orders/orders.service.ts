import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const order = await this.createOrder(createOrderDto.packageId, userId);

    return await this.createPayment(order.id);
  }

  async createOrder(packageId: number, userId: number) {
    return this.prismaService.order.create({
      data: { user_id: userId, package_id: packageId },
    });
  }

  async createPayment(orderId: number) {
    return this.prismaService.payment.create({
      data: {
        order_id: orderId,
        status: 'PENDING',
      },
      include: {
        order: true,
      },
    });
  }
}
