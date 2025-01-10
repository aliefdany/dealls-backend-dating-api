import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}
