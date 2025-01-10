import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello fellas! welcome to the dealls dating app API!';
  }
}
