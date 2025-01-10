import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OrderEntity } from './entities/order.entity';

@Controller({ version: '1', path: 'orders' })
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an order to purchase a package',
    description: 'Orders needs to be paid after creation',
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Create an order and return the payment information',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: OrderEntity })
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }
}
