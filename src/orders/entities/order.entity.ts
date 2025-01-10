import { ApiProperty } from '@nestjs/swagger';
import { Order, Prisma } from '@prisma/client';

type PaymentWithOrder = Prisma.PaymentGetPayload<{ include: { order: true } }>;
export class OrderEntity implements PaymentWithOrder {
  @ApiProperty({
    description: 'Payment id',
    example: 2,
  })
  id: number;

  @ApiProperty({
    description: 'Order id',
    example: 12,
  })
  order_id: number;

  @ApiProperty({
    description: 'Payment status',
    example: 12,
  })
  status: string;

  @ApiProperty({
    description: 'Order object',
  })
  order: Order;
}
