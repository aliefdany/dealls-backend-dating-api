import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePaymentDto {
  @ApiProperty({
    required: true,
    description: "Order's id",
    example: 'alief',
  })
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}
