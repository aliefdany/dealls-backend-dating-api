import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller({ version: '1', path: '' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Just a greeting. Because, why not?',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
