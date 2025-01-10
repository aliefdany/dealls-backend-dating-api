import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    required: true,
    description: 'Package id',
    example: 12,
  })
  @IsNumber()
  @IsNotEmpty()
  packageId: number;
}
