import {
  Injectable,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    });
  }
}
